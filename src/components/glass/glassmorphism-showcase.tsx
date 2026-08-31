'use client';

import React from 'react';
import {
  GlassCard,
  GlassPanel,
  GlassButton,
  GlassLayer,
  GlassPremiumCard,
  GlassFloatingPanel,
} from '@/components/glass';

/**
 * Glassmorphism Component Showcase
 * Comprehensive example of all glass components in use
 */
export function GlassmorphismShowcase() {
  return (
    <div className="space-y-12 py-12">
      {/* Section 1: Hero Floating Panel */}
      <section className="px-4">
        <GlassFloatingPanel
          title="Premium Glassmorphism System"
          subtitle="Institutional futurism meets elegant minimalism"
        >
          <div className="space-y-4">
            <p className="body-lg font-manrope text-gray-800 dark:text-slate-200">
              Experience cutting-edge glassmorphism with Apple-inspired
              aesthetics, institutional elegance, and cinematic depth effects.
              Fully GPU-optimized for 60fps smooth interactions.
            </p>
            <div className="flex flex-wrap gap-3 pt-4">
              <GlassButton variant="primary" size="md">
                Explore Components
              </GlassButton>
              <GlassButton variant="secondary" size="md">
                View Documentation
              </GlassButton>
            </div>
          </div>
        </GlassFloatingPanel>
      </section>

      {/* Section 2: Intensity Levels */}
      <section className="px-4">
        <div className="mb-8">
          <h2 className="h2 font-satoshi text-4xl md:text-5xl font-bold leading-snug tracking-tight text-gray-900 dark:text-slate-50">
            Glass Intensity Levels
          </h2>
          <p className="body-lg font-manrope text-gray-700 dark:text-slate-300 mt-2">
            From subtle to ultra-frosted, choose the perfect glass intensity
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {[
            { intensity: 'sm', label: 'Subtle', desc: '4px blur' },
            { intensity: 'md', label: 'Standard', desc: '8px blur' },
            { intensity: 'lg', label: 'Deep', desc: '12px blur' },
            { intensity: 'xl', label: 'Ultra', desc: '16px blur' },
          ].map((item) => (
            <GlassCard
              key={item.intensity}
              intensity={item.intensity as any}
              interactive
              padding="md"
            >
              <div className="text-center">
                <h4 className="h6 font-satoshi font-semibold text-gray-900 dark:text-white mb-1">
                  {item.label}
                </h4>
                <p className="caption-sm font-manrope text-gray-700 dark:text-slate-400">
                  {item.desc}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Section 3: Interactive Features */}
      <section className="px-4">
        <div className="mb-8">
          <h2 className="h2 font-satoshi text-4xl md:text-5xl font-bold leading-snug tracking-tight text-gray-900 dark:text-slate-50">
            Interactive Features
          </h2>
          <p className="body-lg font-manrope text-gray-700 dark:text-slate-300 mt-2">
            Hover to see depth effects and glow interactions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Card without glow */}
          <GlassPremiumCard glow={false}>
            <div className="text-3xl mb-4">🎯</div>
            <h4 className="h5 font-satoshi font-semibold text-gray-900 dark:text-white mb-2">
              Clean & Minimal
            </h4>
            <p className="body-sm font-manrope text-gray-700 dark:text-slate-300">
              Glass without glow for a sophisticated, clean aesthetic. Perfect
              for professional content.
            </p>
          </GlassPremiumCard>

          {/* Card with glow */}
          <GlassPremiumCard glow>
            <div className="text-3xl mb-4">✨</div>
            <h4 className="h5 font-satoshi font-semibold text-gray-900 dark:text-white mb-2">
              Cinematic Glow
            </h4>
            <p className="body-sm font-manrope text-gray-700 dark:text-slate-300">
              Enhanced with subtle cyan glow. Hover to see the effect intensify.
              Perfect for highlights.
            </p>
          </GlassPremiumCard>
        </div>
      </section>

      {/* Section 4: Button Variants */}
      <section className="px-4">
        <div className="mb-8">
          <h2 className="h2 font-satoshi text-4xl md:text-5xl font-bold leading-snug tracking-tight text-gray-900 dark:text-slate-50">
            Button Variants
          </h2>
          <p className="body-lg font-manrope text-gray-700 dark:text-slate-300 mt-2">
            Primary, Secondary, and Ghost styles
          </p>
        </div>

        <div className="space-y-6">
          {/* Primary */}
          <div>
            <h4 className="h6 font-satoshi font-semibold text-gray-900 dark:text-white mb-3">
              Primary Buttons
            </h4>
            <div className="flex flex-wrap gap-3">
              <GlassButton variant="primary" size="sm">
                Small Primary
              </GlassButton>
              <GlassButton variant="primary" size="md">
                Medium Primary
              </GlassButton>
              <GlassButton variant="primary" size="lg">
                Large Primary
              </GlassButton>
              <GlassButton variant="primary" disabled>
                Disabled
              </GlassButton>
            </div>
          </div>

          {/* Secondary */}
          <div>
            <h4 className="h6 font-satoshi font-semibold text-gray-900 dark:text-white mb-3">
              Secondary Buttons
            </h4>
            <div className="flex flex-wrap gap-3">
              <GlassButton variant="secondary" size="sm">
                Small Secondary
              </GlassButton>
              <GlassButton variant="secondary" size="md">
                Medium Secondary
              </GlassButton>
              <GlassButton variant="secondary" size="lg">
                Large Secondary
              </GlassButton>
            </div>
          </div>

          {/* Ghost */}
          <div>
            <h4 className="h6 font-satoshi font-semibold text-gray-900 dark:text-white mb-3">
              Ghost Buttons
            </h4>
            <div className="flex flex-wrap gap-3">
              <GlassButton variant="ghost" size="sm">
                Small Ghost
              </GlassButton>
              <GlassButton variant="ghost" size="md">
                Medium Ghost
              </GlassButton>
              <GlassButton variant="ghost" size="lg">
                Large Ghost
              </GlassButton>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Layered Composition */}
      <section className="px-4">
        <div className="mb-8">
          <h2 className="h2 font-satoshi text-4xl md:text-5xl font-bold leading-snug tracking-tight text-gray-900 dark:text-slate-50">
            Layered Composition
          </h2>
          <p className="body-lg font-manrope text-gray-700 dark:text-slate-300 mt-2">
            Stack multiple glass layers for depth and visual hierarchy
          </p>
        </div>

        <GlassPanel title="Layered Glass Composition" glow>
          <div className="space-y-4">
            {[
              { intensity: 'sm', title: 'Layer 1: Surface', desc: 'Subtle glass with 4px blur' },
              { intensity: 'md', title: 'Layer 2: Mid', desc: 'Standard glass with 8px blur' },
              { intensity: 'lg', title: 'Layer 3: Deep', desc: 'Deep glass with 12px blur' },
            ].map((item, idx) => (
              <GlassLayer
                key={idx}
                intensity={item.intensity as any}
                className="bg-white/30 dark:bg-white/12 p-4"
              >
                <h5 className="h6 font-satoshi font-semibold text-gray-900 dark:text-white mb-1">
                  {item.title}
                </h5>
                <p className="body-sm font-manrope text-gray-700 dark:text-slate-300">
                  {item.desc}
                </p>
              </GlassLayer>
            ))}
          </div>
        </GlassPanel>
      </section>

      {/* Section 6: Feature Grid */}
      <section className="px-4">
        <div className="mb-8">
          <h2 className="h2 font-satoshi text-4xl md:text-5xl font-bold leading-snug tracking-tight text-gray-900 dark:text-slate-50">
            Features & Benefits
          </h2>
          <p className="body-lg font-manrope text-gray-700 dark:text-slate-300 mt-2">
            Production-ready glassmorphism system
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: '⚡',
              title: '60fps Performance',
              desc: 'GPU-optimized with will-change and hardware acceleration',
            },
            {
              icon: '🎨',
              title: 'Apple Aesthetic',
              desc: 'Premium minimal design inspired by Apple design language',
            },
            {
              icon: '🌙',
              title: 'Dark Mode Ready',
              desc: 'Perfect light and dark theme variants included',
            },
            {
              icon: '♿',
              title: 'Accessible',
              desc: 'WCAG AA compliant with reduced motion support',
            },
            {
              icon: '📱',
              title: 'Responsive',
              desc: 'Works beautifully on mobile, tablet, and desktop',
            },
            {
              icon: '🎯',
              title: 'Interactive',
              desc: 'Smooth depth effects and cinematic glow interactions',
            },
          ].map((feature, idx) => (
            <GlassPremiumCard key={idx}>
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h4 className="h6 font-satoshi font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h4>
              <p className="body-sm font-manrope text-gray-700 dark:text-slate-300">
                {feature.desc}
              </p>
            </GlassPremiumCard>
          ))}
        </div>
      </section>

      {/* Section 7: Code Examples */}
      <section className="px-4">
        <div className="mb-8">
          <h2 className="h2 font-satoshi text-4xl md:text-5xl font-bold leading-snug tracking-tight text-gray-900 dark:text-slate-50">
            Implementation Examples
          </h2>
          <p className="body-lg font-manrope text-gray-700 dark:text-slate-300 mt-2">
            Quick examples to get started
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <GlassCard intensity="lg" padding="lg">
            <h4 className="h6 font-satoshi font-semibold text-gray-900 dark:text-white mb-3">
              Basic Card
            </h4>
            <pre className="mono text-xs leading-relaxed overflow-auto text-gray-900 dark:text-slate-100 bg-black/20 p-3 rounded">
{`<GlassCard 
  intensity="md" 
  interactive 
  glow
>
  Content here
</GlassCard>`}
            </pre>
          </GlassCard>

          <GlassCard intensity="lg" padding="lg">
            <h4 className="h6 font-satoshi font-semibold text-gray-900 dark:text-white mb-3">
              Floating Panel
            </h4>
            <pre className="mono text-xs leading-relaxed overflow-auto text-gray-900 dark:text-slate-100 bg-black/20 p-3 rounded">
{`<GlassFloatingPanel
  title="Title"
  subtitle="Subtitle"
  glow
>
  Content here
</GlassFloatingPanel>`}
            </pre>
          </GlassCard>

          <GlassCard intensity="lg" padding="lg">
            <h4 className="h6 font-satoshi font-semibold text-gray-900 dark:text-white mb-3">
              Button CTA
            </h4>
            <pre className="mono text-xs leading-relaxed overflow-auto text-gray-900 dark:text-slate-100 bg-black/20 p-3 rounded">
{`<GlassButton 
  variant="primary" 
  size="lg"
>
  Get Started
</GlassButton>`}
            </pre>
          </GlassCard>

          <GlassCard intensity="lg" padding="lg">
            <h4 className="h6 font-satoshi font-semibold text-gray-900 dark:text-white mb-3">
              Layered Composition
            </h4>
            <pre className="mono text-xs leading-relaxed overflow-auto text-gray-900 dark:text-slate-100 bg-black/20 p-3 rounded">
{`<GlassLayer intensity="md">
  <GlassLayer intensity="lg">
    Nested glass
  </GlassLayer>
</GlassLayer>`}
            </pre>
          </GlassCard>
        </div>
      </section>

      {/* Section 8: CTA */}
      <section className="px-4">
        <GlassFloatingPanel title="Ready to Build?" subtitle="Start using glassmorphism today">
          <div className="grid md:grid-cols-2 gap-4 pt-2">
            <div>
              <h5 className="h6 font-satoshi font-semibold text-gray-900 dark:text-white mb-2">
                Components
              </h5>
              <p className="body-sm font-manrope text-gray-700 dark:text-slate-300 mb-4">
                7 reusable components covering all common patterns
              </p>
            </div>
            <div>
              <h5 className="h6 font-satoshi font-semibold text-gray-900 dark:text-white mb-2">
                Documentation
              </h5>
              <p className="body-sm font-manrope text-gray-700 dark:text-slate-300 mb-4">
                Complete guides, examples, and best practices
              </p>
            </div>
          </div>
          <div className="flex gap-3 pt-6 border-t border-white/20 dark:border-white/10">
            <GlassButton variant="primary" size="lg">
              Start Building
            </GlassButton>
            <GlassButton variant="secondary" size="lg">
              View Docs
            </GlassButton>
          </div>
        </GlassFloatingPanel>
      </section>
    </div>
  );
}

export default GlassmorphismShowcase;
