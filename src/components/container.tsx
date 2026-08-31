/**
 * Responsive container wrapper
 * Provides responsive padding and max-width constraints
 */

import { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Container({
  children,
  className,
  size = 'xl',
  padding = 'md',
}: ContainerProps) {
  const sizes = {
    sm: 'max-w-[64rem]',
    md: 'max-w-[76rem]',
    lg: 'max-w-[88rem]',
    xl: 'max-w-[var(--container-xl,96rem)]',
    full: 'max-w-full',
  };

  const paddings = {
    none: 'px-0',
    sm: 'px-[calc(var(--gutter,1.5rem)*0.5)]',
    md: 'px-[var(--gutter,1.5rem)]',
    lg: 'px-[calc(var(--gutter,1.5rem)*1.5)]',
  };

  return (
    <div className={cn('mx-auto w-full', sizes[size], paddings[padding], className)}>
      {children}
    </div>
  );
}
