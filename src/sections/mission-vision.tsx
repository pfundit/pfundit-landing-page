"use client";

import React, { useRef } from "react";
import { useScrollReveal } from "@/animations/useScrollReveal";
import { glassOpacityDark } from "@/lib/glassmorphism";

export function MissionVision() {
  const sectionRef = useRef<HTMLElement | null>(null);

  // Initialize global scroll reveal
  useScrollReveal(sectionRef);
  const mRuleRef = useRef<HTMLDivElement | null>(null);
  const vRuleRef = useRef<HTMLDivElement | null>(null);

  return (
    <section
      ref={sectionRef}
      id="mission"
      aria-label="Mission and Vision"
      className="bg-tier-base"
      style={{
        paddingTop: 'clamp(96px, 10vw, 132px)',
        paddingBottom: 'clamp(96px, 10vw, 132px)',
        position: "relative",
        backgroundImage: "linear-gradient(rgba(249, 248, 244, 0.52), rgba(249, 248, 244, 0.52)), url('/m%26vbg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Top rule */}
      <div aria-hidden style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(to right, transparent, rgba(15,27,61,0.07), transparent)",
      }} />

      <div className="layout-shell">
        {/* ── INTRO HEADER ─────────────────────────────────────────────── */}
        <div className="mb-8 md:mb-12">
          <h2 className="font-serif-display text-[clamp(2.5rem,5vw,4.2rem)] leading-none tracking-[-0.03em] text-navy">
            Mission & <span style={{ color: '#C9A84C' }}>Vision</span>
          </h2>
        </div>

        {/* ── MAIN COMPOSITION ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* ─── MISSION (left, wider) ─────────────────────────────────── */}
          <div
            data-reveal="block"
            className="reveal-hidden"
          >
            <div className="mb-6 inline-flex items-center gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-[#C9A84C]" />
              <span className="section-label">MISSION</span>
            </div>

            {/* Gold rule */}
            <div
              data-reveal="underline"
              ref={mRuleRef}
              style={{ width: 24, height: 1, background: "#C9A84C", marginBottom: 28, transition: "width 0.35s ease" }}
            />

            {/* Heading */}
            <h3
              className="typo-h3 text-navy"
              style={{ margin: 0, marginBottom: 28 }}
            >
              To expand access to regulated credit by financing productive real-economy activity across Asia — compliantly, efficiently and at scale.
            </h3>

            {/* Body */}
            <p
              className="typo-body text-navy/60"
              style={{ margin: 0, maxWidth: "60ch" }}
            >
              India's MSME sector faces a credit gap of approximately $530 billion. Southeast Asia adds a further $300 billion shortfall. Across both regions, over 700 million adults remain outside the regulated credit system. The barrier is not demand — it is the cost and complexity of serving them. We are building the infrastructure that makes disciplined lending at this scale commercially viable.
            </p>
          </div>

          {/* ─── VISION (right, narrower) ──────────────────────────────── */}
          <div
            data-reveal="block"
            className="reveal-hidden"
          >
            <div className="mb-6 inline-flex items-center gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-[#C9A84C]" />
              <span className="section-label">VISION</span>
            </div>

            {/* Gold rule */}
            <div
              data-reveal="underline"
              ref={vRuleRef}
              style={{ width: 24, height: 1, background: "#C9A84C", marginBottom: 28, transition: "width 0.35s ease" }}
            />

            {/* Heading */}
            <h3
              className="typo-h3 text-navy"
              style={{ margin: 0, marginBottom: 28 }}
            >
              To be Asia's most trusted technology-enabled credit platform by 2030 — regulated, scalable and built on infrastructure that compounds over time.
            </h3>

            {/* Body */}
            <p
              className="typo-body text-navy/60"
              style={{ margin: 0, marginBottom: 48 }}
            >
              We are not building a fintech app. We are building a regulated financial institution that holds a licence, manages a loan book, stands behind every credit outcome and deepens its operating advantage with every loan made. Across India first, and across Asia by design — not by extension.
            </p>

          </div>
        </div>
      </div>
    </section>
  );
}
