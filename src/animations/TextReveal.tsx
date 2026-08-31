'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface TextRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  disabled?: boolean;
}

export function TextReveal({ children, className, delay = 0, disabled = false }: TextRevealProps) {
  const el = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || disabled) return;
    try {
      gsap.registerPlugin(ScrollTrigger);
    } catch (e) {}

    const ctx = gsap.context(() => {
      const targets = el.current?.querySelectorAll('.reveal-line') || [];
      targets.forEach((node) => {
        gsap.fromTo(
          node,
          { yPercent: 100, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            delay,
            scrollTrigger: {
              trigger: node,
              start: 'top 85%',
              end: 'bottom 60%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, el);

    return () => ctx.revert();
  }, [delay, disabled]);

  // children should be split into lines by caller, but we support a fallback
  return (
    <div ref={el} className={className} style={{ overflow: 'hidden' }}>
      {typeof children === 'string' ? (
        children.split('\n').map((line, i) => (
          <div key={i} className="reveal-line overflow-hidden">
            <div className="inline-block">{line}</div>
          </div>
        ))
      ) : (
        children
      )}
    </div>
  );
}

export default TextReveal;
