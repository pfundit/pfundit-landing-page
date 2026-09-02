/**
 * Lenis smooth scrolling hook
 * Integrates smooth scrolling with GSAP ScrollTrigger
 */

'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useLenisScroll = () => {
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    // On touch devices (iOS/mobile) or reduced motion, rely on native smooth momentum scrolling
    if (prefersReducedMotion || isTouch) {
      return;
    }

    // Initialize Lenis for desktop wheel scrolling
    const lenis = new Lenis({
      duration: 1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    } as any);

    // Connect Lenis to ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    (window as any).__lenis = lenis;

    // Use gsap ticker for optimal performance
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(500, 33);

    return () => {
      gsap.ticker.remove(updateTicker);
      delete (window as any).__lenis;
      lenis.destroy();
    };
  }, []);
};
