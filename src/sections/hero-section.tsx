'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { TalkToUsButton } from '@/components/button';

export function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const nav = document.querySelector('div[class*="fixed left-0 top-0"]') as HTMLElement | null;
    const offset = nav ? nav.offsetHeight : 130;
    const lenis = (typeof window !== 'undefined' ? (window as any).__lenis : null);
    if (lenis?.scrollTo) {
      lenis.scrollTo(el, { offset: -offset });
    } else {
      const bodyRect = document.body.getBoundingClientRect().top;
      const elRect = el.getBoundingClientRect().top;
      const targetY = elRect - bodyRect - offset;
      window.scrollTo({
        top: targetY,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    if (!sectionRef.current || typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      timeline
        .fromTo('[data-hero-reveal]', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.75, stagger: 0.09 })
        .fromTo('[data-hero-graphic]', { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: 'back.out(1.7)' }, 0.15);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="Hero"
      className="relative isolate flex flex-col overflow-hidden bg-[#F9F8F4] text-[#0f1b3d]"
      style={{
        minHeight: '100svh',
        /* 
          Navbar = hiring strip (~42px) + nav bar (88px) = ~130px total.
          We use 136px as base so eyebrow clears the nav comfortably.
        */
        paddingTop: 'clamp(136px, 12vw, 160px)',
        paddingBottom: 'clamp(48px, 6vw, 72px)',
      }}
    >
      {/* ── Background image — fully visible on right side ── */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/ChatGPT%20Image%20Jul%2015%2C%202026%2C%2011_07_58%20AM.png')",
          backgroundPosition: 'center right',
          backgroundSize: 'cover',
        }}
      />
      {/* Gradient overlay: near-opaque on the left (text side), fades out on the right (image side) */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, rgba(249,248,244,0.99) 0%, rgba(249,248,244,0.94) 40%, rgba(249,248,244,0.60) 65%, rgba(249,248,244,0.08) 100%)',
        }}
      />
      {/* Subtle radial gold glow */}
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_28%_55%,rgba(211, 163, 55,0.07),transparent_52%)]" />

      {/* ── Small Animated Graphic Elements ── */}

      {/* Left Side Decorative Image */}
      <div data-hero-graphic aria-hidden
        className="pointer-events-none absolute left-[-7%] top-[35%] hidden lg:block"
        style={{ width: 260, height: 260 }}>
        <img
          src="/ChatGPT%20Image%20Jul%2015%2C%202026%2C%2003_06_11%20PM.png"
          alt=""
          className="w-full h-full object-contain mix-blend-multiply animate-[spin_50s_linear_infinite]"
          style={{ opacity: 0.25 }}
        />
      </div>

      {/* Top-left: dashed ring + gold centre dot */}
      <div data-hero-graphic aria-hidden
        className="pointer-events-none absolute left-[7%] top-[29%] hidden lg:block illustration-float-fast"
        style={{ width: 34, height: 34 }}>
        <svg viewBox="0 0 34 34" className="h-full w-full" fill="none">
          <circle cx="17" cy="17" r="12" stroke="rgba(211, 163, 55,0.36)" strokeWidth="1" strokeDasharray="2 5" />
          <circle cx="17" cy="17" r="3" fill="#D3A337" />
          <circle cx="9" cy="11" r="1.4" fill="rgba(15,27,61,0.22)" />
        </svg>
      </div>

      {/* Top-right: solid ring + dot */}
      <div data-hero-graphic aria-hidden
        className="pointer-events-none absolute right-[8%] top-[30%] hidden lg:block illustration-float"
        style={{ width: 26, height: 26, animationDelay: '0.7s' }}>
        <svg viewBox="0 0 26 26" className="h-full w-full" fill="none">
          <circle cx="13" cy="13" r="9.5" stroke="rgba(211, 163, 55,0.40)" strokeWidth="1.2" />
          <circle cx="13" cy="13" r="2.5" fill="#D3A337" fillOpacity="0.85" />
        </svg>
      </div>

      {/* Mid-left: diamond outline */}
      <div data-hero-graphic aria-hidden
        className="pointer-events-none absolute left-[5%] top-[56%] hidden lg:block illustration-float"
        style={{ width: 17, height: 17, animationDelay: '1.1s' }}>
        <svg viewBox="0 0 17 17" className="h-full w-full" fill="none">
          <rect x="8.5" y="1" width="10" height="10" rx="1.2" transform="rotate(45 8.5 8.5)"
            stroke="rgba(211, 163, 55,0.42)" strokeWidth="1.2" />
        </svg>
      </div>

      {/* Mid-right: plus cross */}
      <div data-hero-graphic aria-hidden
        className="pointer-events-none absolute right-[6%] top-[54%] hidden lg:block illustration-float-fast"
        style={{ width: 14, height: 14, animationDelay: '0.35s' }}>
        <svg viewBox="0 0 14 14" className="h-full w-full" fill="none">
          <path d="M7 1v12M1 7h12" stroke="rgba(211, 163, 55,0.48)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Bottom-right: dashed bezier curve with endpoint dots */}
      <div data-hero-graphic aria-hidden
        className="pointer-events-none absolute bottom-[18%] right-[13%] hidden lg:block illustration-float"
        style={{ width: 68, height: 44, animationDelay: '0.55s' }}>
        <svg viewBox="0 0 68 44" className="h-full w-full" fill="none">
          <path d="M5 36 C20 14 44 38 63 16" stroke="rgba(211, 163, 55,0.30)" strokeWidth="1.2" strokeDasharray="3 6" />
          <circle cx="5" cy="36" r="2.5" fill="#D3A337" fillOpacity="0.70" />
          <circle cx="63" cy="16" r="2.5" fill="#D3A337" fillOpacity="0.70" />
        </svg>
      </div>

      {/* Scattered micro-dots */}
      <div data-hero-graphic aria-hidden className="pointer-events-none absolute left-[19%] top-[19%] hidden lg:block" style={{ width: 5, height: 5 }}>
        <svg viewBox="0 0 5 5" className="h-full w-full" fill="none"><circle cx="2.5" cy="2.5" r="2.2" fill="rgba(211, 163, 55,0.52)" /></svg>
      </div>
      <div data-hero-graphic aria-hidden className="pointer-events-none absolute right-[21%] top-[66%] hidden lg:block" style={{ width: 5, height: 5 }}>
        <svg viewBox="0 0 5 5" className="h-full w-full" fill="none"><circle cx="2.5" cy="2.5" r="1.8" fill="rgba(15,27,61,0.18)" /></svg>
      </div>
      <div data-hero-graphic aria-hidden className="pointer-events-none absolute left-[13%] top-[73%] hidden lg:block" style={{ width: 4, height: 4 }}>
        <svg viewBox="0 0 4 4" className="h-full w-full" fill="none"><circle cx="2" cy="2" r="1.6" fill="rgba(211, 163, 55,0.44)" /></svg>
      </div>

      {/* ── Main content ── */}
      <div className="layout-shell relative z-10 flex flex-1 flex-col justify-center">
        <div className="mx-auto flex w-full max-w-[940px] flex-col items-center text-center">

          {/* Eyebrow — sits comfortably below navbar */}
          <div data-hero-reveal className="mb-6 flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D3A337]" />
            <span className="section-label">SINGAPORE-BASED · BUILDING IN INDIA</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif-display text-[clamp(2.8rem,5.5vw,4.8rem)] font-medium leading-[0.92] tracking-[-0.05em] text-[#0f1b3d]">
            <span data-hero-reveal className="block">Disciplined Credit</span>
            <span data-hero-reveal className="block">for the <span className="text-[#D3A337]">Real Economy.</span></span>
          </h1>

          {/* Supporting text */}
          <p data-hero-reveal className="mt-6 max-w-[58ch] typo-body text-[clamp(1rem,1.3vw,1.2rem)] leading-[1.7] text-navy/70">
            Pfundit is building a technology-led lending business in India: short-tenor, asset-backed credit tied to real transaction flows, led by former HSBC and J.P. Morgan bankers and underwritten with the discipline of a regulated institution from day one.
          </p>

          {/* CTAs */}
          <div data-hero-reveal className="mt-8 flex flex-col sm:flex-row w-full sm:w-auto items-center justify-center gap-3.5">
            <button
              className="w-full sm:w-auto typo-button rounded-full bg-[#0f1b3d] px-8 py-3.5 font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#172a58] hover:shadow-lg"
              onClick={() => scrollToId('thesis')}
            >
              See what we're building
            </button>
            <TalkToUsButton
              className="w-full sm:w-auto"
              onClick={() => scrollToId('contact')}
            >
              Write to us
            </TalkToUsButton>
          </div>

          {/* Status note */}
          <p
            data-hero-reveal
            className="mt-8 max-w-[62ch] text-[12.5px] sm:text-[13px] leading-relaxed text-navy/55 text-center font-normal not-italic"
          >
            Pfundit Capital Private Limited, a wholly-owned subsidiary of Pfundit Pte. Ltd., is incorporated in India and is at the pre-application stage for RBI registration as an NBFC. Neither entity lends, and no lending will begin until an RBI Certificate of Registration is granted.
          </p>

        </div>
      </div>
    </section>
  );
}