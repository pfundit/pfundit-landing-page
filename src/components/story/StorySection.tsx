'use client';

import React, { PropsWithChildren, useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';
import useStoryScroll from '@/hooks/use-story-scroll';
import gsap from 'gsap';

interface StorySectionProps extends PropsWithChildren {
  id?: string;
  className?: string;
  /** height of the section in viewport heights (for sticky storytelling) */
  heightVh?: number;
  /** whether the panel content should be sticky (pinned) */
  pin?: boolean;
}

export function StorySection({ children, id, className, heightVh = 120, pin = true }: StorySectionProps) {
  const { ScrollTrigger } = useStoryScroll();
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !ScrollTrigger) return;
    // set height as a spacer
    el.style.minHeight = `${heightVh}vh`;

    if (pin) {
      const sections = el.querySelectorAll('[data-story-panel]');
      sections.forEach((panel) => {
        try {
          ScrollTrigger.create({
            trigger: panel,
            start: 'top top',
            end: '+=100%',
            pin: panel,
            pinSpacing: false,
          });
        } catch (e) {}
      });
    }

    return () => ScrollTrigger.getAll().forEach((t: any) => t.kill());
  }, [ScrollTrigger, heightVh, pin]);

  return (
    <section id={id} ref={ref} className={cn('relative w-full overflow-hidden', className)}>
      {children}
    </section>
  );
}

export default StorySection;
