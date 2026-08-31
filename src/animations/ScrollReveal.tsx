'use client';

import React, { PropsWithChildren } from 'react';
import { motion, Variants } from 'framer-motion';
import { fadeUp, scaleIn, staggerContainer } from './variants';

type VariantKey = 'fade-up' | 'scale' | 'stagger';

interface ScrollRevealProps extends PropsWithChildren {
  variant?: VariantKey | Variants;
  className?: string;
  threshold?: number; // viewport amount
  once?: boolean;
  disabled?: boolean;
}

export function ScrollReveal({
  children,
  variant = 'fade-up',
  className,
  threshold = 0.15,
  once = true,
  disabled = false,
}: ScrollRevealProps) {
  const variants: Variants =
    variant === 'fade-up' ? fadeUp : variant === 'scale' ? scaleIn : staggerContainer;

  if (disabled) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

export default ScrollReveal;
