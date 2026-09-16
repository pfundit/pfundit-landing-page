'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const pillars = [
  {
    id: '01',
    headline: 'Institutional structure from day one',
    points: [
      'Singapore HoldCo (Pte. Ltd.) — ACRA registered (UEN: 202544131H, 2025)',
      'Board of Directors with independent oversight (in formation)',
      'Single-purpose corporate structure — no legacy entities or prior business history',
    ],
  },
  {
    id: '02',
    headline: 'Risk & Compliance',
    points: [
      'Regulatory compliant AI architecture as a founding constraint',
      'Mandatory human-in-the-loop at every decision gate',
      'Full explainability and audit trail on credit decisions',
    ],
  },
  {
    id: '03',
    headline: 'Data, Security & Audit',
    points: [
      'API-first architecture with controlled data access',
      'Asset-level monitoring from the first loan',
      'Transparent, institutional-grade reporting',
      'Clean capital architecture from day one',
    ],
  },
];

const timeline = [
  { year: '2025', label: 'Singapore HoldCo incorporated (ACRA)' },
  { year: '2026', label: 'India subsidiary incorporated & Board constituted Pfundit Capital Private Limited established in India.' },
  { year: '2026', label: 'RBI NBFC-ND-ICC application (Pre-application stage)' },
  { year: 'Target: 2026–27', label: 'Regulatory approvals & first-loan operations' },
];

export function Governance() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const st = { trigger: section, start: 'top 75%' };
      
      gsap.fromTo(
        '[data-reveal="header"] > *',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', scrollTrigger: st }
      );

      gsap.fromTo(
        '[data-reveal="card"]',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out', delay: 0.2, scrollTrigger: st }
      );

      // Timeline Animation
      gsap.fromTo(
        '[data-reveal="timeline-line"]',
        { scaleX: 0 },
        { scaleX: 1, duration: 1.5, ease: 'power3.inOut', transformOrigin: 'left', delay: 0.3, scrollTrigger: st }
      );

      gsap.fromTo(
        '[data-reveal="timeline-dot"]',
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.5, stagger: 0.2, ease: 'back.out(2)', delay: 0.6, scrollTrigger: st }
      );

      gsap.fromTo(
        '[data-reveal="timeline-item"]',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.2, ease: 'power2.out', delay: 0.7, scrollTrigger: st }
      );

      // Continuous pulsing animation for timeline dots
      gsap.utils.toArray<HTMLElement>('[data-reveal="timeline-dot"]').forEach((el, i) => {
        gsap.to(el, { 
          boxShadow: '0 0 16px 5px rgba(212,164,55,0.65)',
          scale: 1.25,
          duration: 1.2, 
          ease: 'sine.inOut', 
          repeat: -1, 
          yoyo: true, 
          delay: 1.2 + (i * 0.2) // start after the intro animation finishes
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="governance" className="relative overflow-hidden section-padding" style={{ background: 'var(--bg-base)' }}>
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[radial-gradient(ellipse_at_top,rgba(212,164,55,0.06),transparent_70%)]" />
      </div>

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(15,27,61,0.08)] to-transparent" />

      <div className="layout-shell editorial-container relative z-10">
        
        {/* Header Section */}
        <header data-reveal="header" className="max-w-[48rem] mb-12">
          <div className="header-eyebrow mb-6">
            <div className="header-eyebrow-dot shadow-[0_0_8px_rgba(212,164,55,0.6)]" />
            <span className="typo-eyebrow text-[#D4A437]">Governance &amp; Trust</span>
          </div>
          <h2 className="font-serif-display text-[clamp(2.5rem,5vw,4.2rem)] leading-none tracking-[-0.03em] text-navy mb-6">
            Built on <span className="text-[#C9A84C]">Regulated Rails</span>
          </h2>
          <p className="typo-body text-navy/60">
            A Singapore-incorporated holding company operating to institutional standards from day one — designed for the scrutiny of regulators, investors and partners.
          </p>
        </header>

        {/* 3 Pillars / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 mb-16">
          {pillars.map((pillar) => (
            <div 
              key={pillar.id}
              data-reveal="card"
              className="group relative flex flex-col p-6 sm:p-8 rounded-[1.25rem] bg-[rgba(15,27,61,0.02)] border border-[rgba(15,27,61,0.06)] hover:bg-[rgba(15,27,61,0.035)] hover:border-[rgba(212,164,55,0.25)] transition-all duration-500 overflow-hidden"
            >
              {/* Subtle hover glow */}
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(212,164,55,0.04),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="mb-6">
                <span className="inline-flex items-center justify-center px-3 py-1 rounded-full border border-[rgba(212,164,55,0.25)] bg-[rgba(212,164,55,0.05)] text-[#D4A437] font-mono text-xs tracking-widest">
                  {pillar.id}
                </span>
              </div>

              <h3 className="font-serif-editorial text-[1.3rem] lg:text-[1.4rem] font-medium leading-tight text-navy mb-5">
                {pillar.headline}
              </h3>

              <ul className="space-y-3 mt-auto">
                {pillar.points.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-[4px] h-[4px] rounded-full bg-[#D4A437] mt-[0.55rem] shadow-[0_0_6px_rgba(212,164,55,0.4)] flex-shrink-0" />
                    <span className="typo-body-sm text-navy/65 leading-relaxed text-[0.9rem]">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Timeline Roadmap */}
        <div className="relative pt-4">
          
          {/* The Line and Dots (Visible on Desktop) */}
          <div className="hidden lg:block relative h-[8px] mb-8">
             {/* Base static line */}
             <div className="absolute top-[3px] left-0 w-full h-px bg-[rgba(15,27,61,0.08)]" />
             
             {/* Animated golden line */}
             <div data-reveal="timeline-line" className="absolute top-[3px] left-0 h-px w-full bg-gradient-to-r from-[#D4A437] via-[#D4A437] to-transparent opacity-40 origin-left" />
             
             {/* The Dots Container */}
             <div className="absolute top-0 left-0 w-full h-full grid grid-cols-4 gap-x-8">
               {timeline.map((_, idx) => (
                 <div key={`dot-${idx}`} className="relative h-full flex items-center">
                   <div data-reveal="timeline-dot" className="w-[7px] h-[7px] rounded-full bg-[#D4A437] shadow-[0_0_8px_rgba(212,164,55,0.6)]" />
                 </div>
               ))}
             </div>
          </div>

          {/* Timeline Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 lg:gap-y-0">
            {timeline.map((item, idx) => (
              <div key={idx} data-reveal="timeline-item" className="flex flex-col relative">
                {/* Mobile/Tablet dot */}
                <div data-reveal="timeline-dot" className="lg:hidden w-[6px] h-[6px] rounded-full bg-[#D4A437] shadow-[0_0_8px_rgba(212,164,55,0.6)] mb-3" />
                
                <h4 className="font-serif-editorial text-[1.6rem] text-[#D4A437] mb-2 transition-colors duration-300">
                  {item.year}
                </h4>
                <p className="typo-body-sm text-navy/70 max-w-[24ch] leading-relaxed">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
