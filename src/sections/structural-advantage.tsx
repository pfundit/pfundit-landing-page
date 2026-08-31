"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollReveal } from "@/animations/useScrollReveal";

const ctiRows = [
  { label: "Traditional NBFC", value: "55–65%", width: "62%", tone: "muted" as const },
  { label: "Existing Digital Lenders", value: "38–48%", width: "46%", tone: "digital" as const },
  { label: "Pfundit — Greenfield", value: "25–30%*", width: "28%", tone: "highlight" as const },
];


type Tone = "muted" | "digital" | "highlight";

function toneStyles(tone: Tone) {
  if (tone === "highlight") return {
    label: "text-[#9e7b22]", value: "text-[#9e7b22]",
    fill: "bg-gradient-to-r from-[#b48a2d] via-[#d4a437] to-[#e8c96a] shadow-[0_0_12px_rgba(212,164,55,0.25)]",
  };
  if (tone === "digital") return {
    label: "text-[#0f1b3d]/65", value: "text-[#0f1b3d]",
    fill: "bg-gradient-to-r from-[rgba(15,27,61,0.55)] to-[rgba(26,48,94,0.7)]",
  };
  return {
    label: "text-[#0f1b3d]/45", value: "text-[#0f1b3d]/65",
    fill: "bg-[rgba(15,27,61,0.12)]",
  };
}

export function Infrastructure() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const barRefs = useRef<Array<HTMLDivElement | null>>([]);

  useScrollReveal(sectionRef);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    // Custom animation just for the CTI progress bars
    const ctx = gsap.context(() => {
      barRefs.current.forEach((bar, i) => {
        if (!bar) return;
        const targetWidth = bar.dataset.width || "0%";
        gsap.fromTo(bar, { width: 0 },
          { width: targetWidth, duration: 1.1, ease: "power3.out", delay: i * 0.14,
            scrollTrigger: { trigger: "[data-cti-panel]", start: "top 80%" } }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="ai-edge"
      className="relative overflow-hidden section-padding"
      style={{ background: 'var(--bg-base)' }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(15,27,61,0.08)] to-transparent" />
      {/* Very subtle ambient radial */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4A437]/8 blur-[120px]" />
      </div>

      <div className="layout-shell editorial-container relative z-10">

        {/* Header + illustration side by side */}
        <div className="header-group flex items-start justify-between gap-8">
          <div className="max-w-[40rem]">
            <div data-reveal="eyebrow" className="reveal-hidden mb-6 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4A437]" />
              <span className="section-label">THE STRUCTURAL ADVANTAGE</span>
            </div>
            <h2 data-reveal="heading" className="reveal-hidden font-serif-display text-[clamp(2.5rem,5vw,4.2rem)] leading-none tracking-[-0.03em] text-navy header-heading">
              Why the Model is Built <br className="hidden sm:block" />
              to <span className="text-[#C9A84C]">Compound Differently</span>
            </h2>
            <p data-reveal="paragraph" className="reveal-hidden typo-body text-navy/60 max-w-[44rem]">
              A greenfield build means zero legacy cost. A technology-first credit stack means faster decisions at lower operating cost. A Hub & Spoke distribution model means national reach without proportionate headcount. These design choices produce unit economics that incumbents cannot replicate without replacing their entire operating stack — and that improve as the platform scales.
            </p>
          </div>

          {/* Illustration — blended with multiply */}
          <div data-reveal="texture" className="reveal-hidden hidden lg:block flex-shrink-0 illustration-float" style={{ width: 220, marginTop: '-1rem' }}>
            <Image
              src="/ChatGPT Image Jul 9, 2026, 04_58_32 PM.png"
              alt="Concentric precision circles"
              width={220}
              height={220}
              className="w-full h-auto select-none"
              style={{ mixBlendMode: 'multiply' }}
            />
          </div>
        </div>

        {/* ── CTI Panel (Open Editorial Style) ── */}
        <div data-reveal="block" data-cti-panel
          className="reveal-hidden mb-16 relative mt-4">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-navy/[0.08] via-navy/[0.04] to-transparent" />

          <div className="pt-10 grid lg:grid-cols-[1fr_2fr] gap-10">
            <div>
              <p className="typo-eyebrow text-navy/35 mb-2">Cost-to-Income Ratio</p>
              <h3 className="typo-h3 text-navy font-serif-editorial">
                The Advantage is Structural, Not Cyclical
              </h3>
            </div>

            <div className="space-y-6">
              {ctiRows.map((row, i) => {
                const t = toneStyles(row.tone);
                return (
                  <div key={row.label} className="group relative">
                    <div className="mb-2 flex items-end justify-between gap-3">
                      <span className={`typo-button ${t.label} transition-colors duration-300 group-hover:text-[#9e7b22]`}>{row.label}</span>
                      <span className={`typo-button font-bold ${t.value} transition-colors duration-300 group-hover:text-[#9e7b22]`}>{row.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-navy/[0.04] overflow-hidden">
                      <div ref={(el) => { barRefs.current[i] = el; }}
                        data-width={row.width}
                        className={`relative h-full rounded-full overflow-hidden ${t.fill}`}
                        style={{ width: 0 }}>
                        <span className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white/30 to-transparent" />
                      </div>
                    </div>
                  </div>
                );
              })}
              <p className="mt-5 text-[10px] italic leading-[1.6] text-navy/40 max-w-[80ch]">
                * 25-30% cost-to-income target is projected to be achievable within 24-36 months of launch in India, based on technology-led cost architecture, Hub &amp; Spoke design and digital-first origination. Subject to regulatory approvals and market conditions. Not a financial guarantee.
              </p>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
}
