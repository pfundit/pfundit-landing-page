'use client';

import React from 'react';
import { useAnimatedNumber } from '@/hooks/use-animated-number';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  format?: (n: number) => string;
  className?: string;
  start?: number;
  enabled?: boolean;
}

export function AnimatedNumber({ value, duration = 1200, format, className, start = 0, enabled = true }: AnimatedNumberProps) {
  const { formatted } = useAnimatedNumber(value, { duration, format, start, enabled });

  return (
    <span aria-live="polite" className={className}>
      {formatted}
    </span>
  );
}

export default AnimatedNumber;
