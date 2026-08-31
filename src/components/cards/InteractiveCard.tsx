'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/cn';
import useInteractiveCard from '@/hooks/use-interactive-card';

type Variant = 'elevated' | 'glass' | 'flat';

interface InteractiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  className?: string;
  glow?: boolean;
  tilt?: boolean;
  children?: React.ReactNode;
}

export const InteractiveCard = forwardRef<HTMLDivElement, InteractiveCardProps>(function InteractiveCard(
  { variant = 'glass', className = '', glow = false, tilt = true, children, ...props },
  ref,
) {
  const hookRef = useInteractiveCard({ tiltMax: 4, strength: 8, scale: 1.008, enabled: tilt });

  // combine refs
  const setRef = (node: HTMLDivElement | null) => {
    // @ts-ignore
    hookRef.current = node;
    if (!ref) return;
    if (typeof ref === 'function') ref(node);
    else (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
  };

  const base = 'relative overflow-hidden rounded-xl transform-gpu transition-transform duration-200';
  const variantClass =
    variant === 'glass'
      ? 'bg-white border border-[#e4e7ec]'
      : variant === 'elevated'
      ? 'bg-white border border-[#e4e7ec] shadow-[0_10px_28px_rgba(16,24,40,0.06)]'
      : 'bg-transparent';

  const glowClass = glow ? 'hover:shadow-[0_12px_28px_rgba(16,24,40,0.08)]' : '';

  return (
    <div ref={setRef} className={cn(base, variantClass, glowClass, className)} {...props} role="group">
      {/* reflection layer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: 'linear-gradient(125deg, rgba(255,255,255,0.2), rgba(255,255,255,0) 42%)' }}
      />

      {/* content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
});

export default InteractiveCard;
