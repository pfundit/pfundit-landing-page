'use client';

import React, { PropsWithChildren, useEffect, useRef } from 'react';
import useStoryScroll from '@/hooks/use-story-scroll';
import gsap from 'gsap';

interface TextSyncProps extends PropsWithChildren {
  className?: string;
  /** multiplier for velocity-based offset */
  velocityMultiplier?: number;
  start?: string;
  end?: string;
}

export function TextSync({ children, className, velocityMultiplier = 40, start = 'top bottom', end = 'bottom top' }: TextSyncProps) {
  const { ScrollTrigger } = useStoryScroll();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !ScrollTrigger) return;

    gsap.set(node, { willChange: 'transform, opacity' });

    const st = ScrollTrigger.create({
      trigger: node,
      start,
      end,
      onUpdate: (self: any) => {
        // use scroll velocity for subtle parallax and fade
        const v = Math.min(4, Math.abs(self.getVelocity()) / 1000);
        const offset = (self.direction > 0 ? -1 : 1) * v * velocityMultiplier;
        gsap.to(node, { y: offset, opacity: 1 - Math.min(0.25, v * 0.12), duration: 0.4, ease: 'power3.out' });
      },
    });

    return () => st.kill();
  }, [ScrollTrigger, velocityMultiplier, start, end]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export default TextSync;
