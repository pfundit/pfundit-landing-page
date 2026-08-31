# Glassmorphism Component Quick Start

## Installation

Already included! Just import:

```tsx
import {
  GlassCard,
  GlassPanel,
  GlassButton,
  GlassLayer,
  GlassContainer,
  GlassPremiumCard,
  GlassFloatingPanel,
} from '@/components/glass';
```

## 5-Minute Setup

### 1. Basic Glass Card

```tsx
import { GlassCard } from '@/components/glass';

export function MyCard() {
  return (
    <GlassCard intensity="md" padding="md">
      <h3>Hello Glass</h3>
      <p>This is a glass card</p>
    </GlassCard>
  );
}
```

### 2. Interactive Card with Glow

```tsx
import { GlassPremiumCard } from '@/components/glass';

export function Feature() {
  return (
    <GlassPremiumCard glow>
      <h4>Premium Feature</h4>
      <p>Hover to see the glow effect!</p>
    </GlassPremiumCard>
  );
}
```

### 3. Floating Panel

```tsx
import { GlassFloatingPanel } from '@/components/glass';

export function Hero() {
  return (
    <GlassFloatingPanel
      title="Welcome"
      subtitle="To our platform"
    >
      <p>Automatic header styling included!</p>
    </GlassFloatingPanel>
  );
}
```

### 4. Action Buttons

```tsx
import { GlassButton } from '@/components/glass';

export function CTA() {
  return (
    <>
      <GlassButton variant="primary" size="lg">
        Get Started
      </GlassButton>
      <GlassButton variant="secondary" size="md">
        Learn More
      </GlassButton>
    </>
  );
}
```

### 5. Feature Grid

```tsx
import { GlassPremiumCard } from '@/components/glass';

export function Features() {
  const items = [
    { icon: '⚡', title: 'Fast', desc: '60fps smooth' },
    { icon: '✨', title: 'Premium', desc: 'Apple aesthetic' },
    { icon: '🌙', title: 'Dark Mode', desc: 'Theme ready' },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {items.map((item) => (
        <GlassPremiumCard key={item.title}>
          <div className="text-4xl mb-2">{item.icon}</div>
          <h4 className="h6 font-satoshi font-semibold mb-2">
            {item.title}
          </h4>
          <p className="body-sm text-gray-700 dark:text-slate-300">
            {item.desc}
          </p>
        </GlassPremiumCard>
      ))}
    </div>
  );
}
```

## Component Cheat Sheet

### GlassCard
```tsx
<GlassCard
  intensity="md"      // sm, md, lg, xl
  interactive         // hover depth effect
  glow               // animated glow
  padding="lg"       // none, sm, md, lg, xl
  rounded="xl"       // md, lg, xl, 2xl
>
  Content
</GlassCard>
```

### GlassPanel
```tsx
<GlassPanel
  title="Title"       // optional
  subtitle="Subtitle" // optional
  interactive         // hover depth
  glow               // animated glow
  floating           // shadow2xl
>
  Content
</GlassPanel>
```

### GlassButton
```tsx
<GlassButton
  variant="primary"   // primary, secondary, ghost
  size="md"          // sm, md, lg
  loading={false}    // optional
  disabled={false}   // optional
  icon={<Icon />}    // optional
>
  Text
</GlassButton>
```

### GlassPremiumCard
```tsx
<GlassPremiumCard glow={true}>
  Content
</GlassPremiumCard>
```

### GlassFloatingPanel
```tsx
<GlassFloatingPanel
  title="Title"
  subtitle="Subtitle"
>
  Content
</GlassFloatingPanel>
```

## Intensity Guide

| Level | Blur | Transparency | Use Case |
|-------|------|---|---|
| **sm** | 4px | Subtle | Backgrounds, watermarks |
| **md** | 8px | Moderate | Most cards & content **[default]** |
| **lg** | 12px | Deep | Important sections |
| **xl** | 16px | Maximum | Hero sections, modals |

## Common Patterns

### Hero Section
```tsx
<GlassFloatingPanel
  title="Premium Fintech"
  subtitle="Next-generation experience"
>
  <p className="body-lg">Your hero content</p>
  <div className="flex gap-3 mt-6">
    <GlassButton variant="primary" size="lg">
      Start
    </GlassButton>
    <GlassButton variant="secondary">
      Learn
    </GlassButton>
  </div>
</GlassFloatingPanel>
```

### Feature Grid
```tsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {features.map((feature) => (
    <GlassPremiumCard key={feature.id}>
      <div className="text-4xl mb-4">{feature.icon}</div>
      <h4 className="h6 font-semibold">{feature.title}</h4>
      <p className="body-sm text-gray-700 dark:text-slate-300">
        {feature.description}
      </p>
    </GlassPremiumCard>
  ))}
</div>
```

### Layered Composition
```tsx
<GlassPanel title="Layers" glow>
  <GlassLayer intensity="sm">Layer 1</GlassLayer>
  <GlassLayer intensity="md">Layer 2</GlassLayer>
  <GlassLayer intensity="lg">Layer 3</GlassLayer>
</GlassPanel>
```

### CTA Section
```tsx
<GlassPanel title="Ready to start?" glow floating>
  <p className="body mb-6">Description of action</p>
  <div className="flex gap-3">
    <GlassButton variant="primary" size="lg">
      Get Started
    </GlassButton>
    <GlassButton variant="secondary">
      Learn More
    </GlassButton>
  </div>
</GlassPanel>
```

## Styling Tips

### Add Custom Class
```tsx
<GlassCard className="border-l-4 border-cyan-400">
  Content with custom border
</GlassCard>
```

### Combine with Framer Motion
```tsx
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/glass';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
>
  <GlassCard>Content</GlassCard>
</motion.div>
```

### Responsive Padding
```tsx
<GlassCard padding="md" className="md:p-8 lg:p-12">
  Responsive padding
</GlassCard>
```

## Accessibility Notes

✅ **Automatically Included**:
- Keyboard navigation on buttons
- Focus states
- High contrast support
- Reduced motion support

✅ **Best Practices**:
- Use semantic headings (h1-h6)
- Add descriptive text
- Don't rely only on glass transparency to convey info
- Ensure sufficient contrast on light mode

## Performance Tips

1. Limit visible glass to <5 elements per viewport
2. Use `md` intensity for most elements
3. Use `sm` for subtle backgrounds
4. Avoid nesting multiple glass panels
5. Mobile: test on actual devices

## Theme Support

✅ Automatic light/dark mode - no setup needed!

```tsx
// Light mode: brighter glass
// Dark mode: darker, more subtle glass
// Just works with next-themes!

import { useTheme } from '@/hooks/use-theme';

export function MyComponent() {
  const { theme } = useTheme();
  // Both light and dark glass automatically applied
}
```

## Browser Support

✅ Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## Troubleshooting

### Glass not visible?
→ Check `intensity` level (use `md` as default)

### Not responding to hover?
→ Add `interactive` prop to GlassCard

### Glow not showing?
→ Add `glow` prop to component

### Text hard to read?
→ Increase `intensity` or use darker theme

## More Examples

See comprehensive examples in:
- `src/components/glass/GLASS_EXAMPLES.md` - Full usage guide
- `src/components/glass/glassmorphism-showcase.tsx` - Interactive demo
- `docs/GLASSMORPHISM_SYSTEM.md` - Complete documentation

## Summary

**7 Components, Infinite Possibilities**

- **GlassCard**: Basic content card
- **GlassPanel**: Floating panel with header
- **GlassButton**: Interactive button (3 variants, 3 sizes)
- **GlassLayer**: Transparent layered surface
- **GlassContainer**: Base container
- **GlassPremiumCard**: Pre-configured card
- **GlassFloatingPanel**: Pre-configured panel

**All with**:
- ✅ Dark/light theme support
- ✅ GPU optimization
- ✅ 60fps smooth animations
- ✅ WCAG AA accessibility
- ✅ Reduced motion support
- ✅ Mobile optimized

---

**Start building with glass today!** 🎨
