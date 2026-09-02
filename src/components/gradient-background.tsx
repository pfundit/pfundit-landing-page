/**
 * Animated gradient background
 * Premium gradient component with cinematic animations
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface GradientBackgroundProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'neon' | 'dark';
  animated?: boolean;
  opacity?: number;
}

const gradients = {
  primary:
    'bg-gradient-to-br from-[#1b2a52] via-[#2a3d6a] to-[#0f1a32] dark:from-[#0a0e27] dark:via-[#0f1428] dark:to-[#1a1f3a]',
  secondary:
    'bg-gradient-to-br from-[#00d4ff] via-[#33e0ff] to-[#00a8cc] dark:from-[#0a0e27] dark:via-[#00d4ff] dark:to-[#0f1428]',
  accent:
    'bg-gradient-to-br from-[#ff6b35] via-[#ff8c5a] to-[#cc5428] dark:from-[#0a0e27] dark:via-[#ff6b35] dark:to-[#0f1428]',
  neon: 'bg-gradient-to-br from-[#1b2a52] via-[#00d4ff] to-[#ff6b35] dark:from-[#0a0e27] dark:via-[#00d4ff] dark:to-[#ff6b35]',
  dark: 'bg-gradient-to-br from-[#0a0e27] to-[#0f1428] dark:from-[#0a0e27] dark:to-[#1a1f3a]',
};

export function GradientBackground({
  className,
  variant = 'primary',
  animated = true,
  opacity = 1,
}: GradientBackgroundProps) {
  if (!animated) {
    return (
      <div
        className={cn(
          'absolute inset-0 w-full h-full pointer-events-none',
          gradients[variant],
        )}
        style={{ opacity }}
      />
    );
  }

  return (
    <motion.div
      className={cn(
        'absolute inset-0 w-full h-full pointer-events-none',
        gradients[variant],
      )}
      style={{ opacity }}
      animate={{
        backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}

/**
 * Grain overlay effect
 */
export function GrainOverlay({ opacity = 0.02 }: { opacity?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: 'radial-gradient(rgba(15, 27, 61, 0.08) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        opacity,
      }}
    />
  );
}

/**
 * Animated background with noise
 */
export function AnimatedBackground({
  children,
  variant = 'primary',
  className,
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'neon' | 'dark';
  className?: string;
}) {
  return (
    <div className={cn('relative w-full overflow-hidden', className)}>
      <GradientBackground variant={variant} animated />
      <GrainOverlay />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
