"use client";

import { useEffect, useRef } from "react";

interface Options {
  strength?: number; // translation multiplier
  scale?: number; // hover scale
  enabled?: boolean;
}

export function usePremiumButton(options: Options = {}) {
  const { strength = 20, scale = 1.03, enabled = true } = options;
  const ref = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const pos = useRef({ tx: 0, ty: 0, vx: 0, vy: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (prefersReduced || isTouch) return;

    function onMove(e: MouseEvent) {
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width; // -0.5..0.5
      const dy = (e.clientY - cy) / rect.height;
      pos.current.vx = dx * strength;
      pos.current.vy = dy * strength;
    }

    function onEnter() {
      const node = ref.current;
      if (!node) return;
      node.style.transition = 'box-shadow 280ms ease, transform 280ms cubic-bezier(.2,.9,.2,1)';
      node.style.willChange = 'transform, box-shadow';
      startRaf();
    }

    function onLeave() {
      const node = ref.current;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      pos.current.vx = 0; pos.current.vy = 0;
      pos.current.tx = 0; pos.current.ty = 0;
      if (!node) return;
      node.style.transform = '';
      node.style.boxShadow = '';
      node.style.willChange = '';
    }

    function update() {
      const p = pos.current;
      const node = ref.current;
      if (!node) return;
      // simple spring smoothing
      p.tx += (p.vx - p.tx) * 0.12;
      p.ty += (p.vy - p.ty) * 0.12;
      node.style.transform = `translate3d(${p.tx}px, ${p.ty}px, 0) scale(${scale})`;
      // subtle depth shadow
      const shadowX = Math.round(-p.tx * 0.25);
      const shadowY = Math.round(Math.abs(p.ty) * 0.25 + 6);
      node.style.boxShadow = `${shadowX}px ${shadowY}px 30px rgba(10,14,39,0.12), inset 0 1px 0 rgba(255,255,255,0.02)`;
      rafRef.current = requestAnimationFrame(update);
    }

    function startRaf() {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(update);
    }

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [strength, scale, enabled]);

  return ref;
}

export default usePremiumButton;
