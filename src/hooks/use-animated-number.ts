"use client";

import { useEffect, useRef, useState } from 'react';

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export interface UseAnimatedNumberOptions {
  duration?: number;
  format?: (v: number) => string;
  start?: number;
  end?: number;
  enabled?: boolean;
}

export function useAnimatedNumber(value: number, opts: UseAnimatedNumberOptions = {}) {
  const { duration = 1000, format, start = 0, enabled = true } = opts;
  const [current, setCurrent] = useState<number>(enabled ? start : value);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef<number>(start);

  useEffect(() => {
    if (!enabled) {
      setCurrent(value);
      return;
    }

    const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setCurrent(value);
      return;
    }

    fromRef.current = startRef.current ?? current ?? start;
    const from = fromRef.current;
    const to = value;
    const startTime = performance.now();

    function step(now: number) {
      if (!startRef.current) startRef.current = startTime;
      const elapsed = now - startTime;
      const t = Math.min(1, Math.max(0, elapsed / duration));
      const eased = easeOutCubic(t);
      const v = from + (to - from) * eased;
      setCurrent(v);
      if (t < 1) rafRef.current = requestAnimationFrame(step);
      else {
        startRef.current = null;
        rafRef.current = null;
      }
    }

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration, enabled]);

  const formatted = format ? format(current) : Math.round(current).toLocaleString();
  return { value: current, formatted };
}

export default useAnimatedNumber;
