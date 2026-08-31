# Premium Futuristic Fintech Architecture

Next.js App Router architecture for cinematic fintech experiences with smooth motion, premium visuals, and scalable folder structure.

## Stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS
- Framer Motion
- GSAP + ScrollTrigger
- Lenis smooth scrolling
- React Three Fiber + Drei + Postprocessing
- next-themes for dark and light modes

## Key Features

- Dark and light themes with system support
- Primary brand color: #1b2a52
- Global design token system
- Smooth scrolling with Lenis integrated with ScrollTrigger
- Scroll-based reveal utilities
- Global gradient background + grain overlay system
- Reusable section and container wrappers
- Motion-safe optimization for reduced motion users
- Performance-first setup targeted for smooth 60fps animation

## Scalable Structure

- src/components
- src/sections
- src/animations
- src/shaders
- src/hooks
- src/lib
- src/styles

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Notes

- Theme switching is implemented via next-themes provider in app layout.
- Global motion and reveal helpers are placed in src/animations.
- Design tokens are centralized in src/lib/design-tokens.ts.
