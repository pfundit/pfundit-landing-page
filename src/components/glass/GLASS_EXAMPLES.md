/**
 * Glass Components Usage Guide
 * Comprehensive examples and best practices for the glassmorphism component system
 */

// ======================
// BASIC IMPORTS
// ======================

// Import individual components:
import {
  GlassCard,
  GlassPanel,
  GlassButton,
  GlassLayer,
  GlassContainer,
  GlassPremiumCard,
  GlassFloatingPanel,
} from '@/components/glass';

// Import utilities:
import { glassmorphism } from '@/lib/glassmorphism';

// ======================
// COMPONENT EXAMPLES
// ======================

/**
 * Example 1: Basic Glass Card
 * Ideal for: Feature cards, content blocks, statistics displays
 */
export function BasicGlassCardExample() {
  return (
    <GlassCard intensity="md" padding="md" rounded="xl">
      <h3 className="h5 font-satoshi font-semibold text-gray-900 dark:text-white mb-2">
        Glass Card Title
      </h3>
      <p className="body-sm font-manrope text-gray-700 dark:text-slate-300">
        Standard glass card with medium blur and border effect. Perfect for
        grouping related content.
      </p>
    </GlassCard>
  );
}

/**
 * Example 2: Interactive Glass Card with Glow
 * Ideal for: Hover-responsive cards, premium features, highlights
 */
export function InteractiveGlassCardExample() {
  return (
    <GlassCard
      intensity="md"
      interactive
      glow
      padding="lg"
      rounded="xl"
      className="cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="h5 font-satoshi font-semibold text-gray-900 dark:text-white">
            Premium Feature
          </h3>
          <p className="caption font-manrope text-gray-600 dark:text-slate-400">
            Hover to see the effect
          </p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 opacity-80" />
      </div>
      <p className="body font-manrope text-gray-700 dark:text-slate-300">
        Interactive cards respond to hover with depth effect and glowing border.
      </p>
    </GlassCard>
  );
}

/**
 * Example 3: Floating Glass Panel
 * Ideal for: Hero sections, important announcements, modal backgrounds
 */
export function FloatingGlassPanelExample() {
  return (
    <GlassFloatingPanel
      title="Welcome to Premium Platform"
      subtitle="Experience fintech with cinematic glassmorphism"
    >
      <div className="space-y-6">
        <p className="body font-manrope text-gray-800 dark:text-slate-200">
          This floating panel demonstrates the premium glass panel component with
          title and subtitle support. The blur effect creates depth while
          maintaining readability.
        </p>

        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-4 bg-white/20 dark:bg-white/10 rounded-lg border border-white/20 dark:border-white/10"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-500 mb-1">
                  {i}00%
                </div>
                <p className="caption-sm font-manrope text-gray-700 dark:text-slate-400">
                  Feature {i}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-4">
          <GlassButton variant="primary" size="md">
            Get Started
          </GlassButton>
          <GlassButton variant="secondary" size="md">
            Learn More
          </GlassButton>
        </div>
      </div>
    </GlassFloatingPanel>
  );
}

/**
 * Example 4: Glass Button Variants
 * Ideal for: CTAs, interactive controls, navigation
 */
export function GlassButtonVariantsExample() {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="h6 font-satoshi font-semibold text-gray-900 dark:text-white mb-3">
          Primary Buttons
        </h4>
        <div className="flex flex-wrap gap-3">
          <GlassButton variant="primary" size="sm">
            Small
          </GlassButton>
          <GlassButton variant="primary" size="md">
            Medium
          </GlassButton>
          <GlassButton variant="primary" size="lg">
            Large
          </GlassButton>
          <GlassButton variant="primary" size="md" disabled>
            Disabled
          </GlassButton>
        </div>
      </div>

      <div>
        <h4 className="h6 font-satoshi font-semibold text-gray-900 dark:text-white mb-3">
          Secondary Buttons
        </h4>
        <div className="flex flex-wrap gap-3">
          <GlassButton variant="secondary" size="sm">
            Secondary
          </GlassButton>
          <GlassButton variant="secondary" size="md">
            Secondary
          </GlassButton>
          <GlassButton variant="secondary" size="lg">
            Secondary
          </GlassButton>
        </div>
      </div>

      <div>
        <h4 className="h6 font-satoshi font-semibold text-gray-900 dark:text-white mb-3">
          Ghost Buttons
        </h4>
        <div className="flex flex-wrap gap-3">
          <GlassButton variant="ghost" size="sm">
            Ghost
          </GlassButton>
          <GlassButton variant="ghost" size="md">
            Ghost
          </GlassButton>
          <GlassButton variant="ghost" size="lg">
            Ghost
          </GlassButton>
        </div>
      </div>
    </div>
  );
}

/**
 * Example 5: Layered Glass Composition
 * Ideal for: Complex layouts, premium sections, depth creation
 */
export function LayeredGlassCompositionExample() {
  return (
    <GlassPanel title="Layered Composition" glow>
      <div className="space-y-4">
        {/* Layer 1 - Surface glass */}
        <GlassLayer intensity="md" className="bg-white/30 dark:bg-white/12">
          <h4 className="h6 font-satoshi font-semibold text-gray-900 dark:text-white mb-2">
            Layer 1: Surface Glass
          </h4>
          <p className="body-sm font-manrope text-gray-700 dark:text-slate-300">
            First glass layer with medium intensity blur.
          </p>
        </GlassLayer>

        {/* Layer 2 - Deeper glass */}
        <GlassLayer intensity="lg" className="bg-white/40 dark:bg-white/15">
          <h4 className="h6 font-satoshi font-semibold text-gray-900 dark:text-white mb-2">
            Layer 2: Deep Glass
          </h4>
          <p className="body-sm font-manrope text-gray-700 dark:text-slate-300">
            Second glass layer with stronger blur and opacity.
          </p>
        </GlassLayer>

        {/* Layer 3 - Ultra glass */}
        <GlassLayer intensity="lg" className="bg-white/50 dark:bg-white/18">
          <h4 className="h6 font-satoshi font-semibold text-gray-900 dark:text-white mb-2">
            Layer 3: Ultra Glass
          </h4>
          <p className="body-sm font-manrope text-gray-700 dark:text-slate-300">
            Third glass layer with maximum frosted effect.
          </p>
        </GlassLayer>
      </div>
    </GlassPanel>
  );
}

/**
 * Example 6: Premium Card Grid
 * Ideal for: Feature displays, portfolios, pricing cards
 */
export function PremiumCardGridExample() {
  const features = [
    {
      title: 'Lightning Fast',
      description: 'GPU-optimized rendering for 60fps smooth interactions',
      icon: '⚡',
    },
    {
      title: 'Premium Aesthetic',
      description: 'Apple-inspired glassmorphism with elegant minimal design',
      icon: '✨',
    },
    {
      title: 'Dark Mode Ready',
      description: 'Perfectly calibrated colors for both light and dark themes',
      icon: '🌙',
    },
    {
      title: 'Accessible',
      description: 'WCAG AA compliant with reduced motion support',
      icon: '♿',
    },
    {
      title: 'Responsive',
      description: 'Scales beautifully across all device sizes',
      icon: '📱',
    },
    {
      title: 'Interactive',
      description: 'Smooth hover states with depth effects and glows',
      icon: '🎯',
    },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, idx) => (
        <GlassPremiumCard key={idx} glow>
          <div className="text-4xl mb-4">{feature.icon}</div>
          <h4 className="h6 font-satoshi font-semibold text-gray-900 dark:text-white mb-2">
            {feature.title}
          </h4>
          <p className="body-sm font-manrope text-gray-700 dark:text-slate-300">
            {feature.description}
          </p>
        </GlassPremiumCard>
      ))}
    </div>
  );
}

// ======================
// USAGE GUIDELINES
// ======================

/**
 * INTENSITY LEVELS
 * sm    - Barely visible glass, high transparency (use for subtle backgrounds)
 * md    - Standard glass, balanced blur and visibility (most common)
 * lg    - Deep glass, more opaque, less see-through (use for prominent content)
 * xl    - Ultra glass, heavily frosted (use for maximum impact)
 *
 * WHEN TO USE EACH:
 * - sm:  Background accents, watermarks, subtle dividers
 * - md:  Feature cards, regular content, standard panels
 * - lg:  Important content, hero sections, floating panels
 * - xl:  Modal backgrounds, overlay sections, premium highlights
 */

/**
 * COMPONENT SELECTION GUIDE
 *
 * GlassCard
 * - Use for: Regular content cards, feature displays, grouped content
 * - Props: intensity, interactive, glow, padding, rounded, className
 * - Default: intensity='md', padding='md', rounded='xl'
 *
 * GlassPanel
 * - Use for: Floating panels, important messages, hero content
 * - Props: title, subtitle, interactive, glow, floating, className
 * - Default: interactive=true, glow=true, floating=true
 *
 * GlassButton
 * - Use for: CTAs, interactive controls, navigation
 * - Props: variant, size, icon, loading, disabled + HTML button props
 * - Variants: 'primary' (filled), 'secondary' (bordered), 'ghost' (minimal)
 * - Sizes: 'sm', 'md', 'lg'
 *
 * GlassLayer
 * - Use for: Layered compositions, nested glass effects
 * - Props: intensity, className
 * - Default: intensity='md'
 *
 * GlassContainer
 * - Use for: Basic glass wrappers, layout sections
 * - Props: variant, className
 * - Variants: 'card', 'panel', 'layer'
 *
 * GlassPremiumCard
 * - Preset of GlassCard with premium defaults
 * - Use for: Quick, consistent premium cards
 *
 * GlassFloatingPanel
 * - Preset of GlassPanel with premium defaults
 * - Use for: Quick, consistent floating panels
 */

/**
 * STYLING COMBINATIONS
 *
 * For a "read-only" glass card:
 * <GlassCard intensity="md" glow={false} interactive={false} />
 *
 * For a clickable card with depth:
 * <GlassCard intensity="md" interactive glow />
 *
 * For a hero section glass:
 * <GlassPanel floating interactive glow title="..." />
 *
 * For subtle glass divider:
 * <GlassLayer intensity="sm" />
 *
 * For premium CTA:
 * <GlassButton variant="primary" size="lg">Call to Action</GlassButton>
 */

/**
 * PERFORMANCE CONSIDERATIONS
 *
 * ✅ All glass components use GPU optimization:
 * - will-change: transform, opacity
 * - backface-visibility: hidden
 * - backdrop-filter with -webkit- prefix
 *
 * ✅ Smooth animations:
 * - Use transition-all duration-300 for hover states
 * - Cubic-bezier easing for premium feel
 *
 * ✅ Mobile optimization:
 * - Reduced blur intensity on low-end devices possible via media queries
 * - Touch-friendly sizes with adequate padding
 *
 * For best performance:
 * - Limit glassmorphism to <5 visible glass elements per viewport
 * - Use less intense blur (sm/md) on low-power devices
 * - Avoid nested glass panels (use GlassLayer for compositing instead)
 */

/**
 * THEME INTEGRATION
 *
 * All components automatically support dark/light themes via next-themes
 * No additional setup needed - just import and use!
 *
 * Light mode colors:
 * - Background: rgba(255, 255, 255, 0.4-0.95)
 * - Border: rgba(255, 255, 255, 0.2-0.6)
 * - Text: #1f2937 (gray-900)
 *
 * Dark mode colors:
 * - Background: rgba(255, 255, 255, 0.1-0.3)
 * - Border: rgba(255, 255, 255, 0.05-0.2)
 * - Text: #e2e8f0 (slate-50)
 */

/**
 * ACCESSIBILITY NOTES
 *
 * ✅ Respects prefers-reduced-motion
 * ✅ Sufficient contrast ratios (WCAG AA)
 * ✅ Keyboard navigable buttons
 * ✅ Focus states on interactive elements
 * ✅ Semantic HTML structure
 *
 * Avoid:
 * - Using glass only to convey information (add text labels)
 * - Transparent text (ensure sufficient contrast)
 * - Rapid animations on interactive glass (use smooth 300ms transitions)
 */
