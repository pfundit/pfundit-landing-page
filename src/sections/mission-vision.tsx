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
            Mission & <span style={{ color: '#D3A337' }}>Vision</span>
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
              <div className="h-1.5 w-1.5 rounded-full bg-[#D3A337]" />
              <span className="section-label">MISSION</span>
            </div>

            {/* Gold rule */}
            <div
              data-reveal="underline"
              ref={mRuleRef}
              style={{ width: 24, height: 1, background: "#D3A337", marginBottom: 28, transition: "width 0.35s ease" }}
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
              India&apos;s MSMEs face an addressable credit gap of about ₹30 lakh crore (about US$350 billion), around a quarter of their total credit demand. Only 14% of MSMEs have access to formal credit, even though 89% of Indian adults now hold a financial account. The barrier is not demand. It is the cost and complexity of serving these businesses well. We are building the infrastructure that makes disciplined lending at this scale commercially viable.
            </p>

            {/* Source line */}
            <p
              className="mt-4 text-xs sm:text-[12.5px] leading-relaxed text-navy/45"
              style={{ maxWidth: "60ch" }}
            >
              Sources:{" "}
              <a
                href="https://www.sidbi.in/uploads/publicationreport/Understanding-Indian-MSME-sector-Progress-and-Challenges%20-.Unabridged-Version-07-07-2025.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-navy transition-colors"
              >
                SIDBI, Understanding Indian MSME Sector: Progress and Challenges
              </a>{" "}
              (May 2025), US$ figure at about ₹85.5 per US$ in mid-May 2025; Deloitte, State of Financial Services in India (2026).
            </p>
          </div>

          {/* ─── VISION (right, narrower) ──────────────────────────────── */}
          <div
            data-reveal="block"
            className="reveal-hidden"
          >
            <div className="mb-6 inline-flex items-center gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-[#D3A337]" />
              <span className="section-label">VISION</span>
            </div>

            {/* Gold rule */}
            <div
              data-reveal="underline"
              ref={vRuleRef}
              style={{ width: 24, height: 1, background: "#D3A337", marginBottom: 28, transition: "width 0.35s ease" }}
            />

            {/* Heading */}
            <h3
              className="typo-h3 text-navy"
              style={{ margin: 0, marginBottom: 28 }}
            >
              To become a lender that borrowers, regulators and funders trust, starting in India and built to the standards of a regulated institution.
            </h3>

            {/* Body */}
            <p
              className="typo-body text-navy/60"
              style={{ margin: 0, marginBottom: 48 }}
            >
              We are not building a fintech app. We are building a financial institution that, once licensed, will manage its own loan book, stand behind every credit outcome and deepen its operating advantage with every loan made.
            </p>

          </div>
        </div>
      </div>
    </section>
  );
}
