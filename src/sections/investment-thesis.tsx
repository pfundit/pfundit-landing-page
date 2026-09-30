'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollReveal } from '@/animations/useScrollReveal';

const capabilities = [
  { title: 'Hub & Spoke Model', description: 'National reach without proportionate headcount or physical infrastructure.' },
  { title: 'Regulation-First Architecture', description: 'Mandatory human oversight at every decision gate. Compliance by design, not by retrofit.' },
  { title: 'API-First Integration', description: 'Partners connect through documented, stable interfaces. Integration is a founding design principle, not a future roadmap item.' },
  { title: 'Technology-Driven Underwriting', description: 'Credit workflows built on data and decisioning tools from the first loan originated.' },
];


export function InvestmentThesis() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const esgRef = useRef<HTMLElement | null>(null);

  useScrollReveal(esgRef);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Intro stagger
      gsap.fromTo(
        '[data-reveal="intro"]',
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: '#thesis-intro', start: 'top 80%' }
        }
      );

      // Capabilities & Illustration stagger
      const capTrigger = { trigger: '#thesis-caps', start: 'top 80%' };

      gsap.fromTo('[data-reveal="cap-label"]',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: capTrigger }
      );

      gsap.fromTo('[data-reveal="cap-line"]',
        { scaleX: 0 },
        { scaleX: 1, transformOrigin: 'left', duration: 0.8, stagger: 0.15, ease: 'power3.out', scrollTrigger: capTrigger }
      );

      gsap.fromTo('[data-reveal="cap-item"]',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', scrollTrigger: capTrigger }
      );

      gsap.to('[data-diagram="line"]', {
        strokeDashoffset: -36,
        duration: 1.5,
        ease: 'none',
        repeat: -1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ── INVESTMENT THESIS ── */}
      <section ref={sectionRef} id="thesis"
        className="relative overflow-hidden section-padding bg-tier-anchor scroll-mt-28 sm:scroll-mt-36"
        style={{ scrollMarginTop: '136px' }}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.08)] to-transparent" />

        <div className="layout-shell editorial-container relative z-10">
          {/* Section Header */}
          <div className="mb-8 md:mb-12">
            <div className="mb-6 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D3A337]" />
              <span className="section-label">INVESTMENT THESIS</span>
            </div>
            <h2 className="font-serif-display text-[clamp(2.5rem,5vw,4.2rem)] leading-none tracking-[-0.03em] text-white">
              What We Are <span style={{ color: '#D3A337' }}>Building</span>
            </h2>
          </div>

          {/* Top Row: India & SEA/GCC */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-14 items-start mb-20 lg:mb-24">

            {/* Left: India NBFC */}
            <div id="thesis-intro" className="header-group max-w-[42rem] !mb-0">
              <div data-reveal="intro" className="flex items-center gap-4 flex-wrap mb-6">
                <span className="section-label rounded-full border border-[rgba(211, 163, 55,0.28)] bg-[rgba(211, 163, 55,0.08)] px-3 py-1.5 text-[#D3A337]">INDIA · GREENFIELD</span>
              </div>
              <h3 className="typo-h3 text-white mb-6">India NBFC</h3>
              <div className="space-y-5 max-w-[42rem]">
                <p data-reveal="intro" className="typo-body text-white/60">Pfundit is establishing an NBFC in India, subject to registration with the RBI, focused on shorter-tenor, asset-aware credit tied to real transaction flows — with every exposure underwritten and monitored at the asset level from day one.</p>
                <p data-reveal="intro" className="typo-body text-white/60">The platform targets segments where structured, data-driven financing improves risk-adjusted returns: consumer and MSME working capital, advance on income from assets and secured lending to MSMEs, with a particular interest in businesses supporting a circular economy.</p>
                <p data-reveal="intro" className="typo-body text-white/60">Institutional-grade governance, explainable technology-driven underwriting and transparent portfolios — designed to meet institutional expectations on risk sharing, reporting and regulatory alignment from the outset.</p>
              </div>
            </div>

            {/* Right: SEA & GCC */}
            <div id="thesis-sea" className="header-group max-w-[42rem] !mb-0 lg:pl-10">
              <div data-reveal="intro" className="flex items-center gap-4 flex-wrap mb-6">
                <span className="section-label rounded-full border border-[rgba(211, 163, 55,0.28)] bg-[rgba(211, 163, 55,0.08)] px-3 py-1.5 text-[#D3A337]">GROUP AMBITION</span>
              </div>
              <h3 className="typo-h3 text-white mb-6">Southeast Asia &amp; Gulf Cooperation Council (GCC)</h3>
              <div className="space-y-5 max-w-[42rem]">
                <p data-reveal="intro" className="typo-body text-white/60">
                  Pfundit Pte. Ltd. is incorporated in Singapore because its founders&apos; banking careers have been regional. Over the longer term, the group may explore lending in Southeast Asia and the GCC through separate entities, each licensed in its own market.
                </p>
                <p data-reveal="intro" className="typo-body text-white/60">
                  This is separate from the proposed Indian NBFC. Pfundit Capital Private Limited is focused on lending in India. Any regional activity would be undertaken by the Singapore group, not the Indian NBFC, and only after the relevant approvals in each jurisdiction.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Row: Capabilities */}
          <div id="thesis-caps">
            <div data-reveal="cap-label" className="mb-10">
              <span className="section-label">KEY CAPABILITIES</span>
              <div data-reveal="cap-line" className="mt-3 h-px w-8 bg-[#D3A337]" />
            </div>

            <div className="grid gap-px overflow-hidden rounded-[1.25rem] border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.12)] sm:grid-cols-2 xl:grid-cols-4">
              {capabilities.map((cap) => (
                <div
                  key={cap.title}
                  data-reveal="cap-item"
                  className="group relative min-h-[260px] overflow-hidden bg-[rgba(10,24,57,0.84)] p-7 transition-colors duration-500 hover:bg-[rgba(211, 163, 55,0.16)] sm:p-8"
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full border border-[rgba(211, 163, 55,0.13)] transition-transform duration-700 group-hover:scale-125" />
                  <div className="relative flex h-full flex-col gap-7">
                    <div>
                      <div className="mb-7 flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(211, 163, 55,0.36)] bg-[rgba(211, 163, 55,0.10)] text-[#D3A337]">
                          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            {cap.title === 'Hub & Spoke Model' && <path d="M12 12 5.5 6.5M12 12l6.5-5.5M12 12l-6.5 5.5M12 12l6.5 5.5M4 5h3v3H4zM17 5h3v3h-3zM4 16h3v3H4zM17 16h3v3h-3z" />}
                            {cap.title === 'Regulation-First Architecture' && <path d="M12 4v16M7 8l5-4 5 4M5 12h14M7 16l5 4 5-4" />}
                            {cap.title === 'API-First Integration' && <path d="M8 8 4 12l4 4M16 8l4 4-4 4M14 5l-4 14" />}
                            {cap.title === 'Technology-Driven Underwriting' && <><circle cx="12" cy="12" r="7" /><path d="M12 8v4l3 2M5 4l2 2M19 4l-2 2M5 20l2-2M19 20l-2-2" /></>}
                          </svg>
                        </div>
                        <div className="h-px w-10 bg-[#D3A337]/60" />
                      </div>
                      <h3 className="font-serif-editorial text-[1.6rem] font-medium leading-tight tracking-[-0.03em] text-white">
                        {cap.title}
                      </h3>
                    </div>
                    <p className="typo-body-sm mt-auto max-w-[25ch] text-white/62 leading-relaxed">
                      {cap.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── ESG & CIRCULAR ECONOMY ── */}
      <section ref={esgRef} id="esg"
        className="relative overflow-hidden section-padding"
        style={{ background: '#FFFFFF' }}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(15,27,61,0.08)] to-transparent" />

        <div className="layout-shell editorial-container relative z-10">
          <div className="header-group max-w-[42rem]">
            <div data-reveal="eyebrow" className="reveal-hidden mb-6 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D3A337]" />
              <span className="section-label">ESG &amp; IMPACT</span>
            </div>
            <h2 data-reveal="heading" className="reveal-hidden font-serif-display text-[clamp(2.5rem,5vw,4.2rem)] leading-none tracking-[-0.03em] text-navy header-heading">
              Credit for India&apos;s circular economy
            </h2>
            <div className="space-y-5 mt-6">
              <p data-reveal="paragraph" className="reveal-hidden typo-body text-navy/60">
                Once registered with the RBI, Pfundit intends to start by offering MSMEs secured business loans against property. Among the businesses we expect to serve are refurbishment and repair operators, and battery repurposing and recycling businesses. These are established MSMEs with steady customers and cash flows we can verify, which traditional lenders often find hard to underwrite.
              </p>
              <p data-reveal="paragraph" className="reveal-hidden typo-body text-navy/60">
                As our loan book and track record build, we will consider more specialised financing for these businesses, subject to applicable regulatory requirements.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
