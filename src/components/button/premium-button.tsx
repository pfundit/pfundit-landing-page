'use client';

import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

type Variant = 'solid' | 'glass' | 'outline';
type Size = 'sm' | 'md' | 'lg';

type MotionButtonProps = Omit<HTMLMotionProps<'button'>, 'ref'>;

interface PremiumButtonProps extends MotionButtonProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
}

const sizeMap: Record<Size, string> = {
  sm: 'px-4 py-2 text-[0.7rem]',
  md: 'px-6 py-3 text-xs',
  lg: 'px-8 py-4 text-xs',
};

export const PremiumButton = forwardRef<HTMLButtonElement, PremiumButtonProps>(function PremiumButton(
  {
    children,
    variant = 'solid',
    size = 'md',
    loading = false,
    icon,
    className = '',
    disabled,
    ...rest
  },
  forwardedRef
) {
  const base = 'inline-flex items-center justify-center rounded-sm font-bold tracking-[0.08em] transition-all duration-300 ease-out focus:outline-none';

  const solid = 'bg-brand text-white hover:bg-brand-accent hover:shadow-[0_10px_20px_-10px_rgba(15,76,129,0.3)]';
  const glass = 'bg-surface-subtle border border-line text-brand hover:border-brand-accent hover:text-brand-accent';
  const outline = 'bg-transparent border border-line text-brand hover:border-brand hover:bg-surface-subtle';

  const variantClass = variant === 'glass' ? glass : variant === 'outline' ? outline : solid;

  const classes = `${base} ${sizeMap[size]} ${variantClass} ${className}`;

  return (
    <motion.button
      ref={forwardedRef}
      className={classes}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={disabled || loading}
      {...(rest as MotionButtonProps)}
    >
      <span className="flex items-center gap-3">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span className="relative">
          {loading ? <span aria-hidden>Processing...</span> : (children as React.ReactNode)}
        </span>
      </span>
    </motion.button>
  );
});

export default PremiumButton;
