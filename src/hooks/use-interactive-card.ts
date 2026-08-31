"use client";

import { useEffect, useRef } from 'react';

interface Options {
  tiltMax?: number; // degrees
  strength?: number; // multiplier for translation
  scale?: number; // hover scale
  enabled?: boolean;
}

export function useInteractiveCard(opts: Options = {}) {
  const { tiltMax = 8, strength = 12, scale = 1.02, enabled = true } = opts;
  const ref = useRef<HTMLElement | null>(null);
  const raf = useRef<number | null>(null);
  const state = useRef({ tx: 0, ty: 0, rx: 0, ry: 0, vx: 0, vy: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    if (prefersReduced || isTouch) return;

    el.style.transformStyle = 'preserve-3d';
    el.style.willChange = 'transform';

    function onMove(e: MouseEvent) {
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2); // -1..1
      const dy = (e.clientY - cy) / (rect.height / 2);
      state.current.vx = dx;
      state.current.vy = dy;
    }

    function onEnter() {
      const node = ref.current;
      if (!node) return;
      node.style.transition = 'box-shadow 300ms ease, transform 400ms cubic-bezier(.2,.9,.2,1)';
      start();
    }

    function onLeave() {
      stop();
      state.current.vx = 0; state.current.vy = 0;
      const node = ref.current;
      if (!node) return;
      node.style.transform = '';
      node.style.boxShadow = '';
      node.style.willChange = '';
    }

    function start() {
      if (raf.current) return;
      raf.current = requestAnimationFrame(tick);
    }

    function stop() {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = null;
    }

    function tick() {
      const s = state.current;
      // simple easing towards velocity
      s.tx += (s.vx * strength - s.tx) * 0.12;
      s.ty += (s.vy * strength - s.ty) * 0.12;
      s.ry += (s.vx * tiltMax - s.ry) * 0.12; // rotateY
      s.rx += (-s.vy * tiltMax - s.rx) * 0.12; // rotateX

      const node = ref.current;
      if (node) {
        const transform = `perspective(900px) translate3d(${s.tx.toFixed(2)}px, ${s.ty.toFixed(2)}px, 0) rotateX(${s.rx.toFixed(2)}deg) rotateY(${s.ry.toFixed(2)}deg) scale(${scale})`;
        node.style.transform = transform;
        const shadowX = Math.round(-s.ry * 1.4);
        const shadowY = Math.round(Math.abs(s.rx) * 1.4 + 8);
        node.style.boxShadow = `${shadowX}px ${shadowY}px 40px rgba(6,10,30,0.12), 0 1px 0 rgba(255,255,255,0.02)`;
      }

      raf.current = requestAnimationFrame(tick);
    }

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiltMax, strength, scale, enabled]);

  return ref;
}

export default useInteractiveCard;
