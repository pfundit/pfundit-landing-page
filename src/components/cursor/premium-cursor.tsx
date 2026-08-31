'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/hooks/use-theme';

type CursorMode = 'default' | 'button' | 'card' | 'interactive';

interface RippleItem {
  id: number;
  x: number;
  y: number;
}

interface Vec2 {
  x: number;
  y: number;
}

function getModeFromTarget(target: EventTarget | null): CursorMode {
  if (!(target instanceof HTMLElement)) return 'default';
  const el = target.closest('[data-cursor]') as HTMLElement | null;
  if (!el) return 'default';

  const mode = el.dataset.cursor;
  if (mode === 'button' || mode === 'card' || mode === 'interactive') {
    return mode;
  }

  return 'default';
}

function getMagneticElement(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof HTMLElement)) return null;
  return target.closest('[data-cursor-magnetic]') as HTMLElement | null;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function PremiumCursor() {
  const { resolvedTheme } = useTheme();
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<CursorMode>('default');
  const [pressed, setPressed] = useState(false);
  const [ripples, setRipples] = useState<RippleItem[]>([]);

  const isDark = resolvedTheme !== 'light';

  const target = useRef<Vec2>({ x: -100, y: -100 });
  const core = useRef<Vec2>({ x: -100, y: -100 });
  const trail = useRef<Vec2>({ x: -100, y: -100 });

  const coreEl = useRef<HTMLDivElement | null>(null);
  const trailEl = useRef<HTMLDivElement | null>(null);

  const magneticEl = useRef<HTMLElement | null>(null);
  const magneticPull = useRef<Vec2>({ x: 0, y: 0 });
  const rippleCounter = useRef(0);
  const lastRipplePoint = useRef<Vec2>({ x: -9999, y: -9999 });

  useEffect(() => {
    const pointerFine = window.matchMedia('(pointer: fine)');
    const hoverCapable = window.matchMedia('(hover: hover)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateEnabled = () => {
      const active = pointerFine.matches && hoverCapable.matches && !reducedMotion.matches;
      setEnabled(active);
      if (active) {
        document.body.classList.add('has-premium-cursor');
      } else {
        document.body.classList.remove('has-premium-cursor');
      }
    };

    updateEnabled();

    pointerFine.addEventListener('change', updateEnabled);
    hoverCapable.addEventListener('change', updateEnabled);
    reducedMotion.addEventListener('change', updateEnabled);

    return () => {
      pointerFine.removeEventListener('change', updateEnabled);
      hoverCapable.removeEventListener('change', updateEnabled);
      reducedMotion.removeEventListener('change', updateEnabled);
      document.body.classList.remove('has-premium-cursor');
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let rafId = 0;

    const onMouseMove = (event: MouseEvent) => {
      target.current.x = event.clientX;
      target.current.y = event.clientY;

      if (magneticEl.current) {
        const rect = magneticEl.current.getBoundingClientRect();
        const cx = rect.left + rect.width * 0.5;
        const cy = rect.top + rect.height * 0.5;
        const dx = cx - event.clientX;
        const dy = cy - event.clientY;

        magneticPull.current.x = clamp(dx * 0.18, -18, 18);
        magneticPull.current.y = clamp(dy * 0.18, -18, 18);
      } else {
        magneticPull.current.x *= 0.85;
        magneticPull.current.y *= 0.85;
      }

      const hero = document.querySelector('[data-hero-graphics]') as HTMLElement | null;
      if (!hero) return;

      const rect = hero.getBoundingClientRect();
      const insideHero =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!insideHero) return;

      const distance = Math.hypot(
        event.clientX - lastRipplePoint.current.x,
        event.clientY - lastRipplePoint.current.y,
      );

      if (distance < 60) return;

      lastRipplePoint.current.x = event.clientX;
      lastRipplePoint.current.y = event.clientY;

      const id = rippleCounter.current++;
      const next = { id, x: event.clientX, y: event.clientY };

      setRipples((prev) => [...prev.slice(-4), next]);

      window.setTimeout(() => {
        setRipples((prev) => prev.filter((item) => item.id !== id));
      }, 850);
    };

    const onMouseOver = (event: MouseEvent) => {
      setMode(getModeFromTarget(event.target));
      magneticEl.current = getMagneticElement(event.target);
    };

    const onMouseDown = () => setPressed(true);
    const onMouseUp = () => setPressed(false);

    const tick = () => {
      const tx = target.current.x + magneticPull.current.x;
      const ty = target.current.y + magneticPull.current.y;

      core.current.x += (tx - core.current.x) * 0.22;
      core.current.y += (ty - core.current.y) * 0.22;

      trail.current.x += (tx - trail.current.x) * 0.12;
      trail.current.y += (ty - trail.current.y) * 0.12;

      if (coreEl.current) {
        coreEl.current.style.transform = `translate3d(${core.current.x}px, ${core.current.y}px, 0)`;
      }

      if (trailEl.current) {
        trailEl.current.style.transform = `translate3d(${trail.current.x}px, ${trail.current.y}px, 0)`;
      }

      rafId = window.requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });

    tick();

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  const modeScale = mode === 'button' ? 2.25 : mode === 'card' ? 1.55 : mode === 'interactive' ? 1.85 : 1;
  const trailScale = mode === 'button' ? 1.65 : mode === 'card' ? 1.35 : mode === 'interactive' ? 1.45 : 1;

  const coreBaseColor = isDark ? 'rgba(120, 200, 255, 0.95)' : 'rgba(27, 42, 82, 0.9)';
  const trailColor = isDark ? 'rgba(90, 170, 235, 0.33)' : 'rgba(27, 42, 82, 0.2)';

  const glowOpacity = mode === 'button' ? 0.9 : mode === 'card' ? 0.62 : mode === 'interactive' ? 0.75 : 0.48;

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[120] overflow-hidden" aria-hidden>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute block rounded-full"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 16,
              height: 16,
              marginLeft: -8,
              marginTop: -8,
              border: isDark ? '1px solid rgba(140, 220, 255, 0.38)' : '1px solid rgba(27, 42, 82, 0.24)',
              boxShadow: isDark
                ? '0 0 36px rgba(110, 200, 255, 0.3)'
                : '0 0 24px rgba(27, 42, 82, 0.16)',
              willChange: 'transform, opacity',
            }}
            initial={{ opacity: 0.32, scale: 0.35 }}
            animate={{ opacity: 0, scale: 4.2 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
          />
        ))}
      </div>

      <motion.div
        ref={trailEl}
        className="pointer-events-none fixed left-0 top-0 z-[130]"
        style={{
          width: 34,
          height: 34,
          marginLeft: -17,
          marginTop: -17,
          borderRadius: 999,
          border: isDark ? '1px solid rgba(130, 210, 255, 0.45)' : '1px solid rgba(27, 42, 82, 0.24)',
          background: trailColor,
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          willChange: 'transform, opacity',
        }}
        animate={{
          scale: pressed ? trailScale * 0.92 : trailScale,
          opacity: glowOpacity,
        }}
        transition={{ type: 'spring', stiffness: 240, damping: 24, mass: 0.35 }}
        aria-hidden
      />

      <motion.div
        ref={coreEl}
        className="pointer-events-none fixed left-0 top-0 z-[140]"
        style={{
          width: 8,
          height: 8,
          marginLeft: -4,
          marginTop: -4,
          borderRadius: 999,
          background: coreBaseColor,
          boxShadow: isDark
            ? '0 0 18px rgba(126, 210, 255, 0.95), 0 0 36px rgba(80, 170, 240, 0.45)'
            : '0 0 12px rgba(27, 42, 82, 0.52), 0 0 24px rgba(27, 42, 82, 0.24)',
          willChange: 'transform, opacity',
        }}
        animate={{
          scale: pressed ? modeScale * 0.82 : modeScale,
          opacity: pressed ? 0.95 : 1,
        }}
        transition={{ type: 'spring', stiffness: 280, damping: 28, mass: 0.28 }}
        aria-hidden
      />
    </>
  );
}
