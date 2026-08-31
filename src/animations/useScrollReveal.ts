import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function useScrollReveal(containerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return;
    
    const container = containerRef.current;
    
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // Find elements
      const eyebrow = container.querySelector('[data-reveal="eyebrow"]');
      const heading = container.querySelector('[data-reveal="heading"]');
      const paragraphs = container.querySelectorAll('[data-reveal="paragraph"]');
      const blocks = container.querySelectorAll('[data-reveal="block"]');
      const statNumbers = container.querySelectorAll('[data-reveal="stat"]');
      const underlines = container.querySelectorAll('[data-reveal="underline"]');
      const texture = container.querySelector('[data-reveal="texture"]');
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top 85%', // Trigger slightly before it fully enters
        },
        defaults: { 
          ease: 'power3.out',
          duration: 0.8
        }
      });

      if (prefersReducedMotion) {
        // Fallback for reduced motion
        tl.to([eyebrow, heading, paragraphs, blocks, statNumbers, underlines, texture], {
          opacity: 1,
          duration: 0.5,
          stagger: 0.1
        });
        return;
      }

      // 1. Texture fade in (if exists)
      if (texture) {
        gsap.to(texture, {
          opacity: 0.04, // Default low opacity for textures
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 90%',
          }
        });
      }

      // 2. Eyebrow: fade + rise
      if (eyebrow) {
        tl.fromTo(eyebrow, 
          { opacity: 0, y: 12 }, 
          { opacity: 1, y: 0 }
        );
      }

      // 3. Heading: fade + rise, 80ms after eyebrow
      if (heading) {
        tl.fromTo(heading,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0 },
          eyebrow ? '+=0.08' : 0
        );
      }

      // 4. Paragraphs: fade + rise, 80ms after heading
      if (paragraphs.length) {
        tl.fromTo(paragraphs,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, stagger: 0.1 },
          heading ? '+=0.08' : 0
        );
      }

      // 5. Content blocks: fade + rise, stagger 140ms
      if (blocks.length) {
        tl.fromTo(blocks,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, stagger: 0.14 },
          paragraphs.length ? '+=0.15' : '+=0.08'
        );
      }

      // 6. Stat Numbers: subtle scale in
      if (statNumbers.length) {
        tl.fromTo(statNumbers,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(1.2)' },
          blocks.length ? '<' : '-=0.2'
        );
      }

      // 7. Underlines: scaleX from left
      if (underlines.length) {
        tl.fromTo(underlines,
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
          blocks.length ? '<0.1' : '-=0.2'
        );
      }

    }, container); // Scope selections to the container

    return () => ctx.revert();
  }, [containerRef]);
}
