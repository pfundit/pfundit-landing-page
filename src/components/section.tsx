/**
 * Section wrapper with gradient background and animations
 * Premium section component for cinematic sections
 */

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { Container } from './container';
import { ScrollReveal } from '@/animations';

type Padding = 'none' | 'sm' | 'md' | 'lg' | 'xl';
type Variant = 'default' | 'muted' | 'panel' | 'soft';
type Layout = 'story' | 'metrics' | 'editorial' | 'timeline' | 'showcase' | 'default';

interface SectionProps extends React.ComponentPropsWithoutRef<'section'> {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  padding?: Padding;
  id?: string;
  /** optional background layers (SVGs, gradients, R3F canvases) */
  background?: ReactNode;
  /** whether a portion of the section should be sticky */
  sticky?: boolean | { top?: string };
  /** container size forwarded to `Container` */
  containerSize?: 'sm' | 'md' | 'lg' | 'xl';
  /** layout semantic hint for consistent spacing */
  layout?: Layout;
  /** disable automatic reveal wrappers (useful for hero) */
  disableReveal?: boolean;
  /** full width content, bypassing Container */
  fullWidth?: boolean;
}

export function Section({
  children,
  className,
  variant = 'default',
  padding = 'lg',
  id,
  background,
  sticky,
  containerSize = 'xl',
  layout = 'default',
  disableReveal = false,
  fullWidth = false,
  ...props
}: SectionProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [mountBackground, setMountBackground] = useState(Boolean(background));

  useEffect(() => {
    if (!background) return;
    if (!ref.current) return setMountBackground(true);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setMountBackground(true);
            obs.disconnect();
          }
        });
      },
      { root: null, threshold: 0.01 },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [background]);

  const variantsMap: Record<Variant, string> = {
    default: 'bg-transparent',
    muted: 'bg-[var(--surface-subtle)]',
    panel: 'bg-[var(--surface)] border-y border-[var(--line)]',
    soft: 'bg-gradient-to-b from-[var(--surface-subtle)] to-[var(--surface-muted)]',
  };

  const paddings: Record<Padding, string> = {
    none: 'py-0',
    sm: 'py-[clamp(4.25rem,6vw,6rem)]',
    md: 'py-[clamp(5.5rem,8vw,7.75rem)]',
    lg: 'py-[clamp(7rem,10vw,10rem)]',
    xl: 'py-[clamp(8.5rem,12vw,12rem)]',
  };

  const layoutSpacing: Record<Layout, string> = {
    default: '',
    story: 'max-w-[72rem]',
    metrics: 'max-w-[84rem]',
    editorial: 'max-w-[66rem]',
    timeline: 'max-w-[74rem]',
    showcase: 'max-w-[92rem]',
  };

  const base = cn(
    'relative w-full overflow-hidden transition-colors duration-300',
    variantsMap[variant],
    paddings[padding],
    className,
  );

  const content = (
    <div className="relative z-10">
      {fullWidth ? (
        children
      ) : (
        <Container size={containerSize}>{children}</Container>
      )}
    </div>
  );

  // sticky wrapper
  const stickyStyle = typeof sticky === 'object' && sticky?.top ? sticky.top : 'top-24';

  return (
    <section id={id} ref={ref} {...props} className={base}>
      {/* background layers (lazy mount) */}
      {mountBackground && background ? (
        <div aria-hidden className="absolute inset-0 pointer-events-none z-0">
          {background}
        </div>
      ) : null}

      {/* soft grain overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.02] mix-blend-multiply" />

      {/* content with optional reveal or sticky */}
      {sticky ? (
        <div className={cn('relative')}> 
          <div className={cn('sticky', stickyStyle)} style={{ zIndex: 10 }}>
            {disableReveal ? content : <ScrollReveal>{content}</ScrollReveal>}
          </div>
        </div>
      ) : disableReveal ? (
        content
      ) : (
        <ScrollReveal>
          <div className={layoutSpacing[layout]}>{content}</div>
        </ScrollReveal>
      )}
    </section>
  );
}
