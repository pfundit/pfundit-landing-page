/**
 * Scroll-based reveal component utility
 * Provides performance-optimized reveal animations
 */

import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

export const useScrollReveal = (
  options: {
    threshold?: number | 'some' | 'all';
    margin?: number | string;
  } = {},
) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: (options.threshold as any) || 'some',
  });

  return { ref, isInView };
};

export const ScrollReveal = ({
  children,
  delay = 0,
  duration = 0.45,
  threshold = 'some',
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  threshold?: 'some' | 'all' | number;
}) => {
  const { ref, isInView } = useScrollReveal({ threshold });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{
        duration,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
};
