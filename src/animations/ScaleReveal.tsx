'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { scaleIn } from './variants';

interface ScaleRevealProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  once?: boolean;
  disabled?: boolean;
}

export function ScaleReveal({ children, className, threshold = 0.15, once = true, disabled = false }: ScaleRevealProps) {
  if (disabled) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      variants={scaleIn as Variants}
    >
      {children}
    </motion.div>
  );
}

export default ScaleReveal;
