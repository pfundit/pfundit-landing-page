'use client';

import React, { PropsWithChildren, useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';
import useStoryScroll from '@/hooks/use-story-scroll';
import gsap from 'gsap';

interface ParallaxLayerProps extends PropsWithChildren {
  speed?: number; // percent movement (positive moves up)
  className?: string;
  start?: string;
  end?: string;
  scrub?: number;
}

export function ParallaxLayer({ children, speed = 20, className, start = 'top bottom', end = 'bottom top', scrub = 0.6 }: ParallaxLayerProps) {
  const { ScrollTrigger } = useStoryScroll();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !ScrollTrigger) return;

    gsap.set(node, { willChange: 'transform' });
    const tween = gsap.to(node, {
      yPercent: -speed,
      ease: 'none',
      scrollTrigger: {
        trigger: node,
        start,
        end,
        scrub,
      },
    });

    return () => {
      try {
        tween.kill();
      } catch (e) {}
    };
  }, [ScrollTrigger, speed, start, end, scrub]);

  return (
    <div ref={ref} className={cn('absolute inset-0 pointer-events-none', className)}>
      {children}
    </div>
  );
}

export default ParallaxLayer;
