/**
 * Premium Glassmorphism Design System
 * Reusable glass effect utilities for the fintech platform
 */

/**
 * Glass blur system - graduated blur levels for depth
 */
export const glassBlur = {
  none: '0px',
  sm: '4px',       // Subtle, high transparency
  md: '8px',       // Standard glass, readable through
  lg: '12px',      // Medium glass, slightly obscured
  xl: '16px',      // Deep glass, mostly obscured
  '2xl': '20px',   // Ultra-frosted glass effect
};

/**
 * Backdrop filter specifications
 * GPU-optimized with will-change and transform hints
 */
export const backdropFilters = {
  sm: 'backdrop-blur(4px) backdrop-brightness(1.05)',
  md: 'backdrop-blur(8px) backdrop-brightness(1.05)',
  lg: 'backdrop-blur(12px) backdrop-brightness(1.08)',
  xl: 'backdrop-blur(16px) backdrop-brightness(1.1)',
  '2xl': 'backdrop-blur(20px) backdrop-brightness(1.12)',
};

/**
 * Glass opacity presets for light mode
 * Balances visibility with glass effect
 */
export const glassOpacityLight = {
  subtle: '0.4',    // Barely visible
  default: '0.6',   // Standard glass
  medium: '0.75',   // Stronger presence
  opaque: '0.85',   // Nearly opaque
};

/**
 * Glass opacity presets for dark mode
 * Higher opacity needed for dark backgrounds
 */
export const glassOpacityDark = {
  subtle: '0.1',    // Barely visible
  default: '0.15',  // Standard glass
  medium: '0.2',    // Stronger presence
  opaque: '0.25',   // Nearly opaque
};

/**
 * Border specifications for glass surfaces
 * Premium minimal borders with soft glow integration
 */
export const glassBorders = {
  subtle: {
    light: '1px solid rgba(255, 255, 255, 0.2)',
    dark: '1px solid rgba(255, 255, 255, 0.05)',
  },
  default: {
    light: '1px solid rgba(255, 255, 255, 0.3)',
    dark: '1px solid rgba(255, 255, 255, 0.1)',
  },
  glowing: {
    light: '1px solid rgba(0, 212, 255, 0.2)',
    dark: '1px solid rgba(0, 212, 255, 0.15)',
  },
};

/**
 * Glow effects for glass surfaces
 * Subtle, cinematic glows that avoid excess neon feel
 */
export const glassGlows = {
  none: 'none',
  subtle: 'inset 0 0 20px rgba(0, 212, 255, 0.1)',
  default: 'inset 0 0 30px rgba(0, 212, 255, 0.15)',
  hover: 'inset 0 0 40px rgba(0, 212, 255, 0.25)',
};

/**
 * Glass layer presets for rapid composition
 * Ready-to-use combinations for common patterns
 */
export const glassPresets = {
  // Card: Standard glass card with moderate blur and soft border
  card: {
    light:
      'bg-white/60 backdrop-blur-md border border-white/30 rounded-xl shadow-lg',
    dark: 'bg-white/15 backdrop-blur-md border border-white/10 rounded-xl shadow-lg',
  },

  // Panel: Floating panel with deeper blur, cinematic depth
  panel: {
    light:
      'bg-white/50 backdrop-blur-lg border border-white/25 rounded-2xl shadow-2xl',
    dark: 'bg-white/10 backdrop-blur-lg border border-white/5 rounded-2xl shadow-2xl',
  },

  // Button: Subtle glass button with interactive states
  button: {
    light:
      'bg-white/40 hover:bg-white/60 active:bg-white/70 backdrop-blur border border-white/25 rounded-lg transition-all duration-300',
    dark: 'bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur border border-white/10 rounded-lg transition-all duration-300',
  },

  // Layer: Transparent layered surface for stacking
  layer: {
    light: 'bg-white/30 backdrop-blur-sm border border-white/20 rounded-lg',
    dark: 'bg-white/8 backdrop-blur-sm border border-white/5 rounded-lg',
  },

  // Input: Glass form input field
  input: {
    light:
      'bg-white/40 backdrop-blur border border-white/30 focus:border-blue-400 rounded-lg placeholder-gray-600 text-gray-900',
    dark: 'bg-white/10 backdrop-blur border border-white/10 focus:border-cyan-400 rounded-lg placeholder-slate-500 text-slate-100',
  },
};

/**
 * Glass animation presets
 * Smooth transitions for interactive glass elements
 */
export const glassAnimations = {
  // Hover depth effect: Subtle scale and shadow increase
  hoverDepth:
    'hover:shadow-xl hover:scale-100 transition-all duration-300 ease-out',

  // Focus glow: Animated glow on interaction
  focusGlow: 'focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400',

  // Entrance: Fade and scale in smoothly
  entrance: 'animate-in fade-in duration-500',

  // Exit: Fade and scale out
  exit: 'animate-out fade-out duration-300',
};

/**
 * Accessibility-focused glass utilities
 * Ensures readable contrast while maintaining glass aesthetic
 */
export const glassAccessibility = {
  // Increased opacity for reduced motion preference
  reducedMotion: 'motion-safe:opacity-100 motion-reduce:opacity-90',

  // Sufficient border contrast for visibility
  contrastBorder: 'border-opacity-40',

  // High contrast mode support
  highContrast:
    'forced-colors:border-[CanvasText] forced-colors:bg-Canvas forced-colors:text-[CanvasText]',
};

/**
 * GPU optimization hints
 * Will-change, transform, and backface-visibility for performance
 */
export const gpuOptimization = {
  // Hardware acceleration for glass layers
  accelerate: 'will-change-[transform,opacity] translate-z-0 backface-hidden',

  // Optimized hover state
  hoverAccelerate:
    'hover:will-change-[transform,box-shadow] hover:translate-z-0',

  // Smooth scroll performance
  scrollOptimize: 'contain-layout contain-paint',
};

/**
 * Composite glass layer definitions
 * Complete specifications for complex glass compositions
 */
export const glassComposites = {
  // Premium card with glow and depth
  premiumCard: {
    base: 'relative p-6 rounded-xl border',
    light: 'bg-white/60 backdrop-blur-lg border-white/30',
    dark: 'bg-white/15 backdrop-blur-lg border-white/10',
    shadow: 'shadow-lg hover:shadow-xl',
    glow: 'hover:shadow-[inset_0_0_20px_rgba(0,212,255,0.1)]',
  },

  // Floating panel with layered depth
  floatingPanel: {
    base: 'relative p-8 rounded-2xl border',
    light: 'bg-white/50 backdrop-blur-xl border-white/25',
    dark: 'bg-white/10 backdrop-blur-xl border-white/5',
    shadow: 'shadow-2xl',
    effects: 'hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]',
  },

  // Interactive glass button
  interactiveButton: {
    base: 'relative px-6 py-3 rounded-lg border font-medium',
    light: 'bg-white/40 border-white/30 hover:bg-white/60 active:bg-white/70',
    dark: 'bg-white/10 border-white/10 hover:bg-white/20 active:bg-white/30',
    transition: 'transition-all duration-300 ease-out',
  },

  // Transparent layer stack
  layerStack: {
    base: 'absolute inset-0 rounded-xl border pointer-events-none',
    light: 'bg-white/20 border-white/15',
    dark: 'bg-white/5 border-white/3',
  },
};

/**
 * Export all as single utility object
 */
export const glassmorphism = {
  blur: glassBlur,
  backdropFilters,
  opacityLight: glassOpacityLight,
  opacityDark: glassOpacityDark,
  borders: glassBorders,
  glows: glassGlows,
  presets: glassPresets,
  animations: glassAnimations,
  accessibility: glassAccessibility,
  gpu: gpuOptimization,
  composites: glassComposites,
};

export default glassmorphism;
