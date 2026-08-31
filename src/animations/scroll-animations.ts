/**
 * Scroll-based animation utilities
 * Integration with GSAP ScrollTrigger for performance-optimized scroll animations
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * Animate element on scroll
 */
export function createScrollAnimation(
  element: HTMLElement | null,
  {
    from = {},
    to = {},
    duration = 0.6,
    markers = false,
  }: {
    from?: Record<string, any>;
    to?: Record<string, any>;
    duration?: number;
    markers?: boolean;
  } = {},
) {
  if (!element) return;

  // Check for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduce-motion: reduce)').matches;

  gsap.fromTo(
    element,
    from,
    {
      ...to,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'top 20%',
        scrub: false,
        markers,
        onEnter: () => {
          if (!prefersReducedMotion) {
            gsap.to(element, { ...to, duration });
          }
        },
      },
    },
  );
}

/**
 * Parallax scroll effect
 */
export function createParallaxEffect(
  element: HTMLElement | null,
  { speed = 0.5, markers = false }: { speed?: number; markers?: boolean } = {},
) {
  if (!element) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduce-motion: reduce)').matches;

  if (prefersReducedMotion) {
    element.style.transform = 'translateY(0)';
    return;
  }

  gsap.to(element, {
    y: 200 * speed,
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
      markers,
    },
  });
}

/**
 * Pin element during scroll
 */
export function createPinEffect(
  element: HTMLElement | null,
  { duration = 100, markers = false }: { duration?: number; markers?: boolean } = {},
) {
  if (!element) return;

  gsap.to(element, {
    scrollTrigger: {
      trigger: element,
      start: 'top top',
      end: `+=${duration}%`,
      pin: true,
      pinSpacing: true,
      markers,
    },
  });
}

/**
 * Stagger animation on scroll
 */
export function createStaggerScrollAnimation(
  elements: HTMLElement[],
  {
    from = {},
    to = {},
    duration = 0.6,
    stagger = 0.1,
    markers = false,
  }: {
    from?: Record<string, any>;
    to?: Record<string, any>;
    duration?: number;
    stagger?: number;
    markers?: boolean;
  } = {},
) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduce-motion: reduce)').matches;

  gsap.utils.toArray(elements).forEach((element: any, index: number) => {
    gsap.fromTo(
      element,
      from,
      {
        ...to,
        delay: prefersReducedMotion ? 0 : index * stagger,
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          markers,
        },
      },
    );
  });
}

/**
 * Text reveal animation
 */
export function createTextReveal(
  element: HTMLElement | null,
  { duration = 0.6, markers = false }: { duration?: number; markers?: boolean } = {},
) {
  if (!element) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduce-motion: reduce)').matches;

  if (prefersReducedMotion) {
    element.style.opacity = '1';
    element.style.clipPath = 'inset(0)';
    return;
  }

  gsap.to(element, {
    clipPath: 'inset(0)',
    opacity: 1,
    duration,
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      markers,
    },
  });
}

/**
 * Cleanup all ScrollTrigger instances
 */
export function cleanupScrollTriggers() {
  ScrollTrigger.getAll().forEach((trigger) => {
    trigger.kill();
  });
}

/**
 * Refresh all ScrollTrigger instances (call after DOM changes)
 */
export function refreshScrollTriggers() {
  ScrollTrigger.refresh();
}
