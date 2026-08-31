/**
 * Editorial Typography System
 * Calm, institutional scale inspired by modern fintech infrastructure websites.
 */

export const typography = {
  headings: {
    h1: 'font-satoshi text-[clamp(1.9rem,1.7rem+1.05vw,2.62rem)] font-[560] leading-[1.14] tracking-[-0.022em] text-[#101828]',
    h2: 'font-satoshi text-[clamp(1.6rem,1.45rem+0.78vw,2.12rem)] font-[560] leading-[1.2] tracking-[-0.018em] text-[#101828]',
    h3: 'font-satoshi text-[clamp(1.34rem,1.23rem+0.54vw,1.72rem)] font-[540] leading-[1.26] tracking-[-0.014em] text-[#101828]',
    h4: 'font-satoshi text-[clamp(1.1rem,1.03rem+0.34vw,1.32rem)] font-[540] leading-[1.34] tracking-[-0.01em] text-[#101828]',
    h5: 'font-satoshi text-[clamp(0.95rem,0.92rem+0.16vw,1.05rem)] font-[530] leading-[1.42] tracking-[-0.005em] text-[#101828]',
  },
  body: {
    lead: 'font-manrope text-[clamp(1.1rem,1.03rem+0.34vw,1.32rem)] leading-[1.58] tracking-[-0.005em] text-[#344054]',
    base: 'font-manrope text-[clamp(0.95rem,0.92rem+0.16vw,1.05rem)] leading-[1.72] tracking-[0] text-[#475467]',
    sm: 'font-manrope text-[clamp(0.8rem,0.78rem+0.08vw,0.88rem)] leading-[1.62] tracking-[0.01em] text-[#667085]',
  },
  label: 'font-manrope text-[clamp(0.82rem,0.8rem+0.08vw,0.9rem)] font-semibold tracking-[0.02em] leading-[1.45] text-[#667085]',
};

export const responsiveScale = {
  display: {
    hero: 'text-[clamp(1.9rem,1.7rem+1.05vw,2.62rem)] leading-[1.14] tracking-[-0.022em]',
    section: 'text-[clamp(1.6rem,1.45rem+0.78vw,2.12rem)] leading-[1.2] tracking-[-0.018em]',
    cardTitle: 'text-[clamp(1.1rem,1.03rem+0.34vw,1.32rem)] leading-[1.34] tracking-[-0.01em]',
  },
  reading: {
    lead: 'text-[clamp(1.1rem,1.03rem+0.34vw,1.32rem)] leading-[1.58] tracking-[-0.005em]',
    base: 'text-[clamp(0.95rem,0.92rem+0.16vw,1.05rem)] leading-[1.72]',
    compact: 'text-[clamp(0.8rem,0.78rem+0.08vw,0.88rem)] leading-[1.62] tracking-[0.01em]',
  },
};

export const presets = {
  heroTitle: `${typography.headings.h1} max-w-[20ch]`,
  sectionTitle: `${typography.headings.h2} max-w-[26ch]`,
  featureTitle: typography.headings.h4,
  bodyText: `${typography.body.base} max-w-[72ch]`,
  leadText: `${typography.body.lead} max-w-[62ch]`,
  uiLabel: typography.label,
};

export const letterSpacing = {
  tighter: 'tracking-[-0.022em]',
  tight: 'tracking-[-0.018em]',
  base: 'tracking-[0]',
  ui: 'tracking-[0.02em]',
};

export const lineHeights = {
  hero: 'leading-[1.14]',
  heading: 'leading-[1.2]',
  lead: 'leading-[1.58]',
  body: 'leading-[1.72]',
};
