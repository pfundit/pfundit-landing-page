'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';

/**
 * Full-screen, in-app resume viewer for small screens.
 *
 * - PDFs are rendered with pdf.js onto canvases (mobile browsers can't show PDFs in an iframe).
 * - .docx files are converted to HTML in the browser with mammoth.
 * - Pinch-to-zoom, double-tap zoom and +/- buttons; content pans in both directions when zoomed.
 * - The phone's back button / back gesture closes the viewer instead of leaving the dashboard.
 */

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const DOUBLE_TAP_SCALE = 2.5;
const PAGE_GAP = 12;
const SIDE_PADDING = 12;
/** Room so the last lines can scroll above the floating zoom bar. */
const BOTTOM_PADDING = 88;
/** Keep canvases under iOS Safari's per-canvas pixel limit (~16.7M). */
const MAX_CANVAS_PIXELS = 12_000_000;

type ViewerState =
  | { kind: 'loading' }
  | { kind: 'pdf'; doc: PDFDocumentProxy; pages: PDFPageProxy[] }
  | { kind: 'docx'; html: string }
  | { kind: 'unsupported' }
  | { kind: 'error'; message: string };

const clamp = (value: number, min = MIN_SCALE, max = MAX_SCALE) => Math.min(max, Math.max(min, value));

function getExtension(fileName?: string) {
  const match = /\.([a-z0-9]+)$/i.exec(fileName || '');
  return match ? match[1].toLowerCase() : '';
}

let pdfWorker: Worker | null = null;

async function loadPdf(data: ArrayBuffer) {
  const pdfjs = await import('pdfjs-dist');
  if (!pdfWorker) {
    pdfWorker = new Worker(new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url), { type: 'module' });
    pdfjs.GlobalWorkerOptions.workerPort = pdfWorker;
  }
  const task = pdfjs.getDocument({ data: new Uint8Array(data) });
  const doc = await task.promise;
  const pages = await Promise.all(Array.from({ length: doc.numPages }, (_, i) => doc.getPage(i + 1)));
  return { doc, pages, destroy: () => task.destroy() };
}

/** Converts a .docx to HTML and strips anything that isn't plain content (e.g. javascript: links). */
async function loadDocx(data: ArrayBuffer) {
  const mammoth = await import('mammoth');
  const { value } = await mammoth.convertToHtml({ arrayBuffer: data });
  const parsed = new DOMParser().parseFromString(value, 'text/html');
  parsed.querySelectorAll('script, style, iframe, object, embed').forEach((el) => el.remove());
  parsed.querySelectorAll('*').forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      if (attr.name.startsWith('on')) el.removeAttribute(attr.name);
    }
  });
  parsed.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href') || '';
    if (!/^(https?:|mailto:|#)/i.test(href)) a.removeAttribute('href');
    else {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    }
  });
  parsed.querySelectorAll('img[src]').forEach((img) => {
    if (!/^data:image\//i.test(img.getAttribute('src') || '')) img.remove();
  });
  return parsed.body.innerHTML;
}

function PdfPage({ page, cssWidth, pageNumber }: { page: PDFPageProxy; cssWidth: number; pageNumber: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const base = page.getViewport({ scale: 1 });
  const cssHeight = (cssWidth * base.height) / base.width;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || cssWidth <= 0) return;

    // Wait for zoom to settle before doing the (expensive) re-render.
    let task: ReturnType<PDFPageProxy['render']> | null = null;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      const dpr = window.devicePixelRatio || 1;
      let renderScale = (cssWidth / base.width) * dpr;
      const pixels = base.width * base.height * renderScale * renderScale;
      if (pixels > MAX_CANVAS_PIXELS) renderScale *= Math.sqrt(MAX_CANVAS_PIXELS / pixels);

      const viewport = page.getViewport({ scale: renderScale });
      // Render off-screen first so the visible page never flashes blank while zooming.
      const offscreen = document.createElement('canvas');
      offscreen.width = Math.floor(viewport.width);
      offscreen.height = Math.floor(viewport.height);
      task = page.render({ canvas: offscreen, viewport });
      task.promise
        .then(() => {
          if (cancelled) return;
          canvas.width = offscreen.width;
          canvas.height = offscreen.height;
          canvas.getContext('2d')?.drawImage(offscreen, 0, 0);
        })
        .catch(() => {
          // Render was cancelled because the zoom changed again; the next effect run handles it.
        });
    }, 120);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      task?.cancel();
    };
  }, [page, cssWidth, base.width, base.height]);

  return (
    <canvas
      ref={canvasRef}
      aria-label={`Page ${pageNumber}`}
      className="block bg-white shadow-[0_4px_18px_rgba(0,0,0,0.18)]"
      style={{ width: cssWidth, height: cssHeight }}
    />
  );
}

export function ResumeViewer({
  url,
  fileName,
  title,
  onClose,
}: {
  url: string;
  fileName?: string;
  title: string;
  onClose: () => void;
}) {
  const [state, setState] = useState<ViewerState>({ kind: 'loading' });
  const [scale, setScale] = useState(1);
  const [viewportWidth, setViewportWidth] = useState(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const scaleRef = useRef(1);
  const pendingScroll = useRef<{ left: number; top: number } | null>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // --- Back button closes the viewer -------------------------------------------------
  // We push one history entry when opening; going back (phone gesture, browser button or
  // our own "Back") pops it and closes the viewer, leaving the dashboard where it was.
  // The ref keeps React Strict Mode's double-run of effects from pushing twice.
  const pushedHistory = useRef(false);
  useEffect(() => {
    if (!pushedHistory.current) {
      window.history.pushState(null, '', window.location.href);
      pushedHistory.current = true;
    }
    const onPop = () => onCloseRef.current();
    window.addEventListener('popstate', onPop);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('popstate', onPop);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const close = useCallback(() => {
    if (pushedHistory.current) window.history.back();
    else onCloseRef.current();
  }, []);

  // --- Load the document ---------------------------------------------------------------
  useEffect(() => {
    const controller = new AbortController();
    let destroyPdf: (() => Promise<void>) | null = null;

    (async () => {
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`The file couldn’t be downloaded (HTTP ${res.status}).`);
        const contentType = res.headers.get('content-type') || '';
        const data = await res.arrayBuffer();
        const head = new Uint8Array(data.slice(0, 4));
        const isPdfBytes = head[0] === 0x25 && head[1] === 0x50 && head[2] === 0x44 && head[3] === 0x46; // %PDF
        const isZipBytes = head[0] === 0x50 && head[1] === 0x4b; // PK (docx)
        const ext = getExtension(fileName);

        if (isPdfBytes || contentType.includes('pdf')) {
          const { doc, pages, destroy } = await loadPdf(data);
          destroyPdf = destroy;
          if (!controller.signal.aborted) setState({ kind: 'pdf', doc, pages });
        } else if (isZipBytes && (ext === 'docx' || contentType.includes('wordprocessingml'))) {
          const html = await loadDocx(data);
          if (!controller.signal.aborted) setState({ kind: 'docx', html });
        } else {
          setState({ kind: 'unsupported' });
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error('Resume preview failed:', error);
        setState({ kind: 'error', message: error instanceof Error ? error.message : 'Preview failed.' });
      }
    })();

    return () => {
      controller.abort();
      void destroyPdf?.();
    };
  }, [url, fileName]);

  // --- Track available width -----------------------------------------------------------
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setViewportWidth(el.clientWidth));
    observer.observe(el);
    setViewportWidth(el.clientWidth);
    return () => observer.disconnect();
  }, []);

  /** Sets a new zoom level keeping the content point under (anchorX, anchorY) fixed on screen. */
  const zoomTo = useCallback((nextScale: number, anchorX?: number, anchorY?: number) => {
    const el = scrollRef.current;
    const target = clamp(nextScale);
    if (!el) return;
    const ax = anchorX ?? el.clientWidth / 2;
    const ay = anchorY ?? el.clientHeight / 2;
    const ratio = target / scaleRef.current;
    pendingScroll.current = {
      left: (el.scrollLeft + ax) * ratio - ax,
      top: (el.scrollTop + ay) * ratio - ay,
    };
    scaleRef.current = target;
    setScale(target);
  }, []);

  // Apply the new scroll position in the same frame the new size is laid out.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    const content = contentRef.current;
    if (content) {
      content.style.transform = '';
      content.style.transformOrigin = '';
    }
    if (el && pendingScroll.current) {
      el.scrollLeft = Math.max(0, pendingScroll.current.left);
      el.scrollTop = Math.max(0, pendingScroll.current.top);
      pendingScroll.current = null;
    }
  }, [scale]);

  // --- Pinch + double-tap gestures -----------------------------------------------------
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let pinch: { startDist: number; startScale: number; midX: number; midY: number; target: number } | null = null;
    let tap: { x: number; y: number; moved: boolean } | null = null;
    let lastTap: { time: number; x: number; y: number } | null = null;

    const point = (t: Touch) => {
      const rect = el.getBoundingClientRect();
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 2) {
        const a = point(event.touches[0]);
        const b = point(event.touches[1]);
        pinch = {
          startDist: Math.hypot(a.x - b.x, a.y - b.y) || 1,
          startScale: scaleRef.current,
          midX: (a.x + b.x) / 2,
          midY: (a.y + b.y) / 2,
          target: scaleRef.current,
        };
        tap = null;
        const content = contentRef.current;
        if (content) {
          content.style.transformOrigin = `${el.scrollLeft + pinch.midX}px ${el.scrollTop + pinch.midY}px`;
        }
      } else if (event.touches.length === 1) {
        const p = point(event.touches[0]);
        tap = { x: p.x, y: p.y, moved: false };
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      if (pinch && event.touches.length === 2) {
        event.preventDefault();
        const a = point(event.touches[0]);
        const b = point(event.touches[1]);
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        pinch.target = clamp(pinch.startScale * (dist / pinch.startDist), MIN_SCALE * 0.85, MAX_SCALE * 1.1);
        // Cheap visual feedback while the fingers move; the real re-layout happens on release.
        if (contentRef.current) contentRef.current.style.transform = `scale(${pinch.target / pinch.startScale})`;
      } else if (tap && event.touches.length === 1) {
        const p = point(event.touches[0]);
        if (Math.hypot(p.x - tap.x, p.y - tap.y) > 10) tap.moved = true;
      }
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (pinch && event.touches.length < 2) {
        const { target, midX, midY, startScale } = pinch;
        pinch = null;
        const committed = clamp(target);
        if (committed === startScale) {
          if (contentRef.current) contentRef.current.style.transform = '';
        } else {
          zoomTo(committed, midX, midY);
        }
        lastTap = null;
        return;
      }

      if (tap && !tap.moved && event.touches.length === 0) {
        const now = Date.now();
        if (lastTap && now - lastTap.time < 300 && Math.hypot(tap.x - lastTap.x, tap.y - lastTap.y) < 30) {
          event.preventDefault();
          zoomTo(scaleRef.current > 1.2 ? 1 : DOUBLE_TAP_SCALE, tap.x, tap.y);
          lastTap = null;
        } else {
          lastTap = { time: now, x: tap.x, y: tap.y };
        }
      }
      tap = null;
    };

    // iOS Safari fires its own gesture events; stop them from zooming the whole page.
    const preventGesture = (event: Event) => event.preventDefault();

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: false });
    el.addEventListener('touchcancel', onTouchEnd, { passive: false });
    el.addEventListener('gesturestart', preventGesture);
    el.addEventListener('gesturechange', preventGesture);
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
      el.removeEventListener('gesturestart', preventGesture);
      el.removeEventListener('gesturechange', preventGesture);
    };
  }, [zoomTo]);

  // Escape closes (useful on tablets with keyboards).
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  const pageWidth = Math.max(0, (viewportWidth - SIDE_PADDING * 2) * scale);
  const pageCount = state.kind === 'pdf' ? state.pages.length : null;
  const canZoom = state.kind === 'pdf' || state.kind === 'docx';

  return (
    <div className="fixed inset-0 z-[90] flex flex-col bg-[#E9EDF5]" role="dialog" aria-modal="true" aria-label={`Resume: ${title}`}>
      <header
        className="flex shrink-0 items-center gap-2 border-b border-[#0f1b3d]/10 bg-white px-2 py-2"
        style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}
      >
        <button
          type="button"
          onClick={close}
          className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-[#0f1b3d] active:bg-[#F0F5FF]"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div className="min-w-0 flex-1 text-center">
          <p className="truncate text-sm font-bold text-[#0f1b3d]">{title}</p>
          <p className="truncate text-[0.68rem] text-[#0f1b3d]/50">
            {fileName || 'Resume'}
            {pageCount ? ` · ${pageCount} page${pageCount === 1 ? '' : 's'}` : ''}
          </p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="rounded-full p-2.5 text-[#0f1b3d]/70 active:bg-[#F0F5FF]"
          aria-label="Open or download the original file"
          title="Open original"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v11m0 0 4-4m-4 4-4-4M5 19h14" />
          </svg>
        </a>
      </header>

      <div
        ref={scrollRef}
        className="relative min-h-0 flex-1 overflow-auto overscroll-contain"
        style={{ touchAction: 'pan-x pan-y', WebkitOverflowScrolling: 'touch' }}
      >
        {state.kind === 'loading' && (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-sm text-[#0f1b3d]/60">
            <svg className="h-6 w-6 animate-spin text-[#0f1b3d]/50" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Loading resume…
          </div>
        )}

        {(state.kind === 'error' || state.kind === 'unsupported') && (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
            <p className="text-sm text-[#0f1b3d]/70">
              {state.kind === 'unsupported'
                ? 'This file type can’t be previewed in the app (only PDF and DOCX can).'
                : `We couldn’t preview this resume. ${state.message}`}
            </p>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-[#0f1b3d] px-5 py-2.5 text-sm font-bold text-white"
            >
              Open original file
            </a>
          </div>
        )}

        {state.kind === 'pdf' && viewportWidth > 0 && (
          <div
            ref={contentRef}
            className="flex w-max flex-col"
            style={{ padding: SIDE_PADDING, paddingBottom: BOTTOM_PADDING, gap: PAGE_GAP, minWidth: '100%', willChange: 'transform' }}
          >
            {state.pages.map((page, index) => (
              <PdfPage key={index} page={page} pageNumber={index + 1} cssWidth={pageWidth} />
            ))}
          </div>
        )}

        {state.kind === 'docx' && viewportWidth > 0 && (
          <div ref={contentRef} style={{ padding: SIDE_PADDING, paddingBottom: BOTTOM_PADDING, width: 'max-content', minWidth: '100%', willChange: 'transform' }}>
            <div style={{ width: viewportWidth - SIDE_PADDING * 2, zoom: scale }}>
              <div
                className="rich-text-content prose prose-sm max-w-none break-words bg-white p-5 text-[#0f1b3d] shadow-[0_4px_18px_rgba(0,0,0,0.18)]"
                dangerouslySetInnerHTML={{ __html: state.html }}
              />
            </div>
          </div>
        )}
      </div>

      {canZoom && (
        <div
          className="pointer-events-none absolute inset-x-0 flex justify-center"
          style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          <div className="pointer-events-auto flex items-center gap-1 rounded-full bg-[#0f1b3d]/90 p-1 text-white shadow-lg backdrop-blur">
            <button
              type="button"
              onClick={() => zoomTo(scaleRef.current / 1.4)}
              disabled={scale <= MIN_SCALE}
              className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold active:bg-white/15 disabled:opacity-35"
              aria-label="Zoom out"
            >
              −
            </button>
            <button
              type="button"
              onClick={() => zoomTo(1)}
              className="min-w-[3.75rem] rounded-full px-2 py-1.5 text-xs font-bold tabular-nums active:bg-white/15"
              aria-label="Fit to width"
              title="Fit to width"
            >
              {Math.round(scale * 100)}%
            </button>
            <button
              type="button"
              onClick={() => zoomTo(scaleRef.current * 1.4)}
              disabled={scale >= MAX_SCALE}
              className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold active:bg-white/15 disabled:opacity-35"
              aria-label="Zoom in"
            >
              +
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
