/**
 * Glow effect component
 * Premium glow effect for cinematic UI
 */

import { cn } from '@/lib/cn';
import { ReactNode } from 'react';

interface GlowProps {
  children: ReactNode;
  className?: string;
  color?: 'primary' | 'secondary' | 'accent';
  intensity?: 'low' | 'medium' | 'high';
}

const colors = {
  primary: 'shadow-[0_0_20px_rgba(27,42,82,0.5)] dark:shadow-[0_0_30px_rgba(27,42,82,0.8)]',
  secondary: 'shadow-[0_0_20px_rgba(0,212,255,0.5)] dark:shadow-[0_0_30px_rgba(0,212,255,0.8)]',
  accent: 'shadow-[0_0_20px_rgba(255,107,53,0.5)] dark:shadow-[0_0_30px_rgba(255,107,53,0.8)]',
};

const intensities = {
  low: 'opacity-50',
  medium: 'opacity-75',
  high: 'opacity-100',
};

export function Glow({
  children,
  className,
  color = 'primary',
  intensity = 'medium',
}: GlowProps) {
  return (
    <div className={cn(colors[color], intensities[intensity], className)}>
      {children}
    </div>
  );
}
