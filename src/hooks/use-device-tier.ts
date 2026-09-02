'use client';

import { useEffect, useMemo, useState } from 'react';

interface DeviceTier {
  isMobile: boolean;
  prefersReducedMotion: boolean;
  isLowPower: boolean;
  particleCount: number;
  dpr: [number, number];
}

/**
 * Classify device performance tier to keep animation smooth on mobile devices.
 */
export function useDeviceTier(): DeviceTier {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 900px)');
    const coarsePointerQuery = window.matchMedia('(pointer: coarse)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const update = () => {
      setIsMobile(mobileQuery.matches || coarsePointerQuery.matches);
      setPrefersReducedMotion(reducedMotionQuery.matches);
    };

    const addListener = (query: MediaQueryList, handler: () => void) => {
      if (typeof query.addEventListener === 'function') {
        query.addEventListener('change', handler);
      } else if (typeof (query as any).addListener === 'function') {
        (query as any).addListener(handler);
      }
    };

    const removeListener = (query: MediaQueryList, handler: () => void) => {
      if (typeof query.removeEventListener === 'function') {
        query.removeEventListener('change', handler);
      } else if (typeof (query as any).removeListener === 'function') {
        (query as any).removeListener(handler);
      }
    };

    update();

    addListener(mobileQuery, update);
    addListener(coarsePointerQuery, update);
    addListener(reducedMotionQuery, update);

    return () => {
      removeListener(mobileQuery, update);
      removeListener(coarsePointerQuery, update);
      removeListener(reducedMotionQuery, update);
    };
  }, []);

  return useMemo(() => {
    const isLowPower = isMobile || prefersReducedMotion;

    return {
      isMobile,
      prefersReducedMotion,
      isLowPower,
      particleCount: isLowPower ? 72 : 180,
      dpr: isLowPower ? [1, 1.2] : [1, 1.8],
    };
  }, [isMobile, prefersReducedMotion]);
}
