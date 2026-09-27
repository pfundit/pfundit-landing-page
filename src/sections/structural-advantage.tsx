"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollReveal } from "@/animations/useScrollReveal";

const advantagePoints = [
  {
    num: "01",
    title: "Built without legacy drag",
    desc: "Greenfield technology and operating design, without outdated systems, manual workarounds or a branch-heavy cost base.",
  },
  {
    num: "02",
    title: "Intelligence-led credit operations",
    desc: "Automated workflows and structured human review enable faster decisions, consistent underwriting and lower operating cost.",
  },
  {
    num: "03",
    title: "Scalable reach, centralised control",
    desc: "Hub & Spoke distribution combines local market access with centralised credit, risk, servicing, collections and compliance.",
  },
  {
    num: "04",
    title: "Economics that improve with scale",
    desc: "Growth does not require proportionate headcount or infrastructure, improving unit economics over time.",
  },
];

const ctiRows = [
  {
    label: "Traditional NBFC",
    value: "55–65%",
    width: "62%",
    isHighlight: false,
  },
  {
    label: "Existing digital lenders",
    value: "38–48%",
    width: "46%",
    isHighlight: false,
  },
  {
    label: "Pfundit — greenfield",
    value: "25–30%",
    width: "30%",
    isHighlight: true,
  },
];

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
        gsap.fromTo(
          bar,
          { width: 0 },
          {
            width: targetWidth,
            duration: 1.1,
            ease: "power3.out",
            delay: i * 0.14,
            scrollTrigger: { trigger: "[data-cti-panel]", start: "top 80%" },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="ai-edge"
      className="relative overflow-hidden section-padding"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(15,27,61,0.08)] to-transparent" />
      {/* Very subtle ambient radial */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D3A337]/8 blur-[120px]" />
      </div>

      <div className="layout-shell editorial-container relative z-10">
        {/* Header + illustration side by side */}
        <div className="flex items-start justify-between gap-8 mb-6 sm:mb-8 lg:mb-10 w-full">
          <div className="flex-1 max-w-[54rem]">
            <div
              data-reveal="eyebrow"
              className="reveal-hidden mb-4 sm:mb-5 flex items-center gap-2"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#D3A337]" />
              <span className="section-label">THE STRUCTURAL ADVANTAGE</span>
            </div>
            <h2
              data-reveal="heading"
              className="reveal-hidden font-serif-display text-[clamp(2.5rem,5vw,4.2rem)] leading-none tracking-[-0.03em] text-navy"
            >
              Why the Model is Built <br className="hidden sm:block" />
              to <span className="text-[#D3A337]">Compound Differently</span>
            </h2>
          </div>

          {/* Illustration — blended with multiply */}
          <div
            data-reveal="texture"
            className="reveal-hidden hidden lg:block flex-shrink-0 illustration-float pointer-events-none"
            style={{ width: 180, marginTop: "-1rem" }}
          >
            <Image
              src="/ChatGPT Image Jul 9, 2026, 04_58_32 PM.png"
              alt="Concentric precision circles"
              width={180}
              height={180}
              className="w-full select-none"
              style={{ mixBlendMode: "multiply", height: "auto" }}
            />
          </div>
        </div>

        {/* ── The Economics & CTI Comparison (Vertical Flow - Full Width) ── */}
        <div
          data-reveal="block"
          className="reveal-hidden relative w-full space-y-10 sm:space-y-12"
        >
          {/* Introductory Paragraph */}
          <p className="text-[14px] sm:text-[15.5px] leading-relaxed text-navy/70 w-full">
            Traditional NBFCs carry the cost of branches, manual credit files and legacy technology. Pfundit is built differently: a modern lending platform designed for lower cost-to-serve, disciplined credit and scalable growth.
          </p>

          {/* The 4 Advantage Points */}
          <div className="space-y-6 sm:space-y-7 w-full">
            {advantagePoints.map((item) => (
              <div key={item.num} className="group w-full">
                <div className="flex items-baseline gap-3.5">
                  <span className="font-mono text-xs sm:text-[13px] font-medium text-[#b49050] shrink-0 tracking-wider">
                    {item.num}
                  </span>
                  <h4 className="font-semibold text-navy text-[15px] sm:text-[16px] leading-snug">
                    {item.title}
                  </h4>
                </div>
                <p className="text-[13.5px] sm:text-[14px] leading-relaxed text-navy/70 mt-1.5 pl-8 sm:pl-9 w-full">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Cost-to-Income Comparison */}
          <div
            data-cti-panel
            className="pt-10 sm:pt-12 border-t border-[rgba(15,27,61,0.08)] w-full"
          >
            <div className="space-y-7 sm:space-y-8 w-full">
              {ctiRows.map((row, i) => (
                <div key={row.label} className="group w-full">
                  <div className="mb-2.5 flex items-baseline justify-between gap-4">
                    <span className="text-[14px] sm:text-[15px] font-medium text-navy/90">
                      {row.label}
                    </span>
                    <span className="text-[14px] sm:text-[15px] font-bold text-navy">
                      {row.value}
                    </span>
                  </div>
                  <div className="h-3 sm:h-3.5 w-full bg-[#ece8df] overflow-hidden">
                    {row.isHighlight ? (
                      <div
                        ref={(el) => {
                          barRefs.current[i] = el;
                        }}
                        data-width={row.width}
                        className="h-full flex overflow-hidden"
                        style={{ width: 0 }}
                      >
                        <div
                          className="h-full bg-[#b49050]"
                          style={{ width: "83.333%" }}
                        />
                        <div
                          className="h-full"
                          style={{
                            width: "16.667%",
                            backgroundImage:
                              "repeating-linear-gradient(45deg, #b49050, #b49050 2.5px, #dfcaa0 2.5px, #dfcaa0 6.5px)",
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        ref={(el) => {
                          barRefs.current[i] = el;
                        }}
                        data-width={row.width}
                        className="h-full bg-[#1b2b4d]"
                        style={{ width: 0 }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-8 text-sm font-semibold text-navy">
              That gap is the business. Everything else is execution.
            </p>

            <p className="mt-6 text-xs sm:text-[12.5px] leading-relaxed text-navy/60 w-full">
              Target of 25–30% is projected as achievable within 24–36 months of launch in India, based on a technology-led cost architecture, Hub &amp; Spoke design and digital-first origination. Benchmarks are management estimates. Subject to regulatory approval and market conditions. Not a financial guarantee.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
