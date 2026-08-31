'use client';

import React, { useRef } from 'react';
import { useScrollReveal } from '@/animations/useScrollReveal';

const stakeholdersContent = [
  {
    title: 'The Leadership',
    description: 'Founded by former HSBC and J.P. Morgan banking executives alongside serial entrepreneurs with a track record of Private Equity exits.'
  },
  {
    title: 'The Opportunity',
    description: 'A greenfield entry into Asia credit, pairing institutional-scale compliance with native artificial intelligence from day one.'
  },
  {
    title: 'The Discipline',
    description: 'Data-driven workflows and autonomous monitoring operate within a mandatory human oversight protocol — compounding efficiency without compounding risk. Every credit decision carries a named, accountable signatory.'
  },
];

export function Stakeholders() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useScrollReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-clip section-padding"
      style={{ background: '#FFFFFF' }}
      id="stakeholders"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(15,27,61,0.08)] to-transparent" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-6%] top-16 h-72 w-72 rounded-full bg-[#D4A437]/5 blur-[120px]" />
      </div>

      <div className="layout-shell editorial-container relative z-10">

        <header className="max-w-[42rem] mb-16">
          <div data-reveal="eyebrow" className="reveal-hidden mb-6 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4A437]" />
            <span className="section-label">FOR OUR STAKEHOLDERS</span>
          </div>

          <h2 data-reveal="heading" className="reveal-hidden font-serif-display text-[clamp(2.5rem,5vw,4.2rem)] leading-none tracking-[-0.03em] text-navy header-heading">
            One institution, built for the <span className="text-[#C9A84C]">people who back it.</span>
          </h2>
        </header>

        {/* ── 3 Columns (Open Editorial Layout) ── */}
        <div className="relative mt-8">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-navy/[0.08] via-navy/[0.04] to-transparent" />

          <div className="grid md:grid-cols-3 gap-x-10 gap-y-12 pt-10">
            {stakeholdersContent.map((item, i) => (
              <div key={item.title} data-reveal="block" className={`reveal-hidden group relative pt-4 ${i > 0 ? 'md:pl-10' : ''}`}>

                {/* Vertical separator line */}
                {i > 0 && <div className="hidden md:block absolute left-0 top-0 h-full w-px bg-gradient-to-b from-navy/[0.06] to-transparent" />}

                {/* Icon & Animated Gold Line */}
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border border-[rgba(212,164,55,0.3)] bg-[rgba(212,164,55,0.05)] text-[#D4A437] transition-transform duration-500 group-hover:scale-110 group-hover:bg-[rgba(212,164,55,0.1)]">
                    {i === 0 && (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    )}
                    {i === 1 && (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
                    )}
                    {i === 2 && (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    )}
                  </div>
                  {/* Animated Gold Line */}
                  <div className="h-px flex-1 ml-6 bg-navy/[0.04] relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-full w-full origin-left scale-x-0 bg-gradient-to-r from-[#D4A437] to-transparent transition-transform duration-700 ease-out group-hover:scale-x-100" />
                  </div>
                </div>

                <h3 className="typo-button text-navy mb-4 transition-colors duration-300 group-hover:text-[#9e7b22]">
                  {item.title}
                </h3>
                <p className="typo-body-sm text-navy/60 leading-relaxed">
                  {item.description}
                </p>

                {/* Subtle hover background glow behind column */}
                <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(ellipse_at_top_left,rgba(212,164,55,0.04),transparent_60%)] pointer-events-none" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
