'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function ScrollToTop() {
  const pathname = usePathname();
  const prevPathnameRef = useRef<string | null>(null);

  // Disable automatic browser scroll restoration to prevent browsers from
  // keeping stale scroll positions across route changes in Next.js App Router.
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    // If navigating to a specific hash anchor (e.g. /#thesis or #leadership),
    // give the element priority and let it scroll into view.
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashId = window.location.hash.replace(/^#/, '');
      const element = document.getElementById(hashId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        prevPathnameRef.current = pathname;
        return;
      }
    }

    const resetScrollPosition = () => {
      // 1. Lenis smooth scroll instance if initialized
      const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number, opts?: { immediate: boolean }) => void } }).__lenis;
      if (lenis && typeof lenis.scrollTo === 'function') {
        lenis.scrollTo(0, { immediate: true });
      }

      // 2. Native window and document scrolling
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' as ScrollBehavior,
      });

      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body) {
        document.body.scrollTop = 0;
      }
    };

    // Immediate scroll reset
    resetScrollPosition();

    // Frame-aligned reset to handle Next.js DOM commit phase
    const rafId = requestAnimationFrame(() => {
      resetScrollPosition();
    });

    // Short timeout to guarantee top position after async RSC hydration / dynamic content
    const timeoutId = setTimeout(() => {
      if (typeof window !== 'undefined' && !window.location.hash) {
        resetScrollPosition();
      }
    }, 60);

    prevPathnameRef.current = pathname;

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
    };
  }, [pathname]);

  return null;
}
