'use client';

import React, { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  intensity?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  glow?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'md' | 'lg' | 'xl' | '2xl';
}

const paddingMap = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-12',
};

const roundedMap = {
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
};

/**
 * GlassCard - Premium glass card component
 * Combines glassmorphism with depth and optional glow effects
 */
export function GlassCard({
  children,
  className,
  intensity = 'md',
  interactive = false,
  glow = false,
  padding = 'md',
  rounded = 'xl',
}: GlassCardProps) {
  const glassClass = `glass-${intensity}`;
  const interactiveClass = interactive ? 'glass-depth' : '';
  const glowClass = glow ? 'glass-glow' : '';

  return (
    <div
      className={cn(
        'relative',
        glassClass,
        interactiveClass,
        glowClass,
        paddingMap[padding],
        roundedMap[rounded],
        className
      )}
    >
      {children}
    </div>
  );
}

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  interactive?: boolean;
  glow?: boolean;
  floating?: boolean;
}

/**
 * GlassPanel - Floating glass panel with header support
 * Designed for modal-like overlays and prominent sections
 */
export function GlassPanel({
  children,
  className,
  title,
  subtitle,
  interactive = true,
  glow = true,
  floating = true,
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl border backdrop-blur-lg',
        'bg-white/50 dark:bg-white/10 border-white/25 dark:border-white/5',
        interactive && 'glass-depth',
        glow && 'glass-glow-hover',
        floating && 'shadow-2xl',
        'p-8',
        className
      )}
    >
      {(title || subtitle) && (
        <div className="mb-6 pb-6 border-b border-white/20 dark:border-white/10">
          {title && (
            <h3 className="h5 font-satoshi text-xl md:text-2xl font-semibold leading-normal tracking-tight text-gray-900 dark:text-slate-50 mb-2">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="body-sm font-manrope text-sm md:text-base leading-normal text-gray-600 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  loading?: boolean;
}

const sizeMap = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

/**
 * GlassButton - Interactive glass button with multiple variants
 * Supports primary, secondary, and ghost styles
 */
export function GlassButton({
  children,
  className,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  disabled,
  ...props
}: GlassButtonProps) {
  const variantClass = {
    primary:
      'glass-button bg-white/40 dark:bg-white/10 border-white/30 dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/20 text-gray-900 dark:text-white font-medium',
    secondary:
      'bg-transparent border-2 border-white/40 dark:border-white/20 hover:border-white/60 dark:hover:border-white/30 text-gray-900 dark:text-white font-medium',
    ghost:
      'bg-transparent border border-transparent hover:border-white/20 dark:hover:border-white/10 text-gray-900 dark:text-white',
  };

  return (
    <button
      className={cn(
        'relative inline-flex items-center justify-center gap-2 rounded-lg',
        'transition-all duration-300 ease-out',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeMap[size],
        variantClass[variant],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {icon && !loading && <span className="flex items-center">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

interface GlassLayerProps {
  children: ReactNode;
  className?: string;
  intensity?: 'sm' | 'md' | 'lg';
}

/**
 * GlassLayer - Transparent layered surface for composing glass effects
 * Used for stacking multiple glass layers to create depth
 */
export function GlassLayer({
  children,
  className,
  intensity = 'md',
}: GlassLayerProps) {
  const glassClass = `glass-${intensity}`;

  return (
    <div
      className={cn(
        'relative',
        glassClass,
        'p-4 rounded-lg',
        className
      )}
    >
      {children}
    </div>
  );
}

interface GlassContainerProps {
  children: ReactNode;
  className?: string;
  variant?: 'card' | 'panel' | 'layer';
}

/**
 * GlassContainer - Base glass container for layout
 * Provides consistent glass styling for layout sections
 */
export function GlassContainer({
  children,
  className,
  variant = 'card',
}: GlassContainerProps) {
  const variantClass = {
    card: 'glass-md rounded-xl p-6',
    panel: 'glass-lg rounded-2xl p-8',
    layer: 'glass-sm rounded-lg p-4',
  };

  return (
    <div className={cn('relative', variantClass[variant], className)}>
      {children}
    </div>
  );
}

/**
 * Preset glass composition component
 * Pre-styled glass card with premium defaults
 */
interface GlassPremiumCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export function GlassPremiumCard({
  children,
  className,
  glow = true,
}: GlassPremiumCardProps) {
  return (
    <GlassCard
      intensity="md"
      interactive
      glow={glow}
      padding="lg"
      rounded="xl"
      className={cn('border border-white/25 dark:border-white/10', className)}
    >
      {children}
    </GlassCard>
  );
}

/**
 * Preset floating glass panel
 * Pre-styled floating panel with premium defaults
 */
interface GlassFloatingPanelProps {
  children: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  className?: string;
}

export function GlassFloatingPanel({
  children,
  title,
  subtitle,
  className,
}: GlassFloatingPanelProps) {
  return (
    <GlassPanel
      title={title}
      subtitle={subtitle}
      interactive
      glow
      floating
      className={cn('border-white/25 dark:border-white/5', className)}
    >
      {children}
    </GlassPanel>
  );
}
