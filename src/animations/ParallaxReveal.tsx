'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ParallaxRevealProps {
  children: React.ReactNode;
  speed?: number; // multiplier for movement
  className?: string;
  disabled?: boolean;
}

export function ParallaxReveal({ children, speed = 30, className, disabled = false }: ParallaxRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || disabled) return;
    try {
      gsap.registerPlugin(ScrollTrigger);
    } catch (e) {}

    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent: -speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [speed, disabled]);

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform' }}>
      {children}
    </div>
  );
}

export default ParallaxReveal;
