'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/* ─────────────────── data ─────────────────── */
const leaders = [
  {
    id: '01',
    name: 'Sanath Shetty',
    role: 'Founder & Director',
    focus: 'Consumer Credit Risk & Payments · 25+ Years',
    image: '/founders/sanath.png',
    bio: "Sanath is the credit and operational architect of Pfundit. Twenty-five years across HSBC India, Singapore and J.P. Morgan Singapore — running retail lending portfolios, building collections frameworks and leading corporate payments origination across Asia-Pacific — give him direct, hands-on command of everything Pfundit's lending model requires.",
  },
  {
    id: '02',
    name: 'Atin Bhutani',
    role: 'Co-Founder & Director',
    focus: 'Corporate Banker · Entrepreneur · Governance Expert',
    image: '/founders/atin1.webp',
    bio: "Atin brings the rare combination of institutional banker and proven entrepreneur. A decade at HSBC India and Singapore — culminating as Country Head of International Subsidiary Banking in Singapore — was followed by co-founding and scaling In.Corp Global to a private equity exit. At Pfundit he leads governance, capital strategy and investor relations.",
  },
  {
    id: '03',
    name: 'Madhujeet Chimni',
    role: 'Co-Founder & Director',
    focus: 'Serial Entrepreneur · Institutional Capital · Technology',
    image: '/founders/madhujeet.webp',
    bio: "Madhujeet has built, scaled and exited companies across Asia, Europe and Latin America over two decades — from Stone Apple (acquired by Hitachi Consulting) to In.Corp Global (PE exit) to Blue Planet Environmental Solutions, backed by IFU and Novo Holdings. At Pfundit he leads capital strategy, board governance and the regional platform build.",
  },
];

/* ─────────────────── ProfileCircle ─────────────────── */
function ProfileCircle({ leader, index }: { leader: typeof leaders[0]; index: number }) {
  return (
    <div className="relative flex items-center justify-start" style={{ width: 'clamp(140px, 58vw, 200px)', height: 'clamp(140px, 58vw, 200px)' }}>

      <div
        aria-hidden
        className="absolute inset-0"
        style={{ transform: 'translateX(calc(-1 * clamp(13px, 2.5vw, 19px)))' }}
      >
        {/* Outermost rotating ring — dashed, slow */}
        <div
          data-anim="ring"
          className="absolute inset-0 rounded-full"
          style={{
            border: '1px dashed rgba(212,164,55,0.25)',
            borderRadius: '50%',
          }}
        />

        {/* Secondary solid ring */}
        <div
          className="absolute rounded-full"
          style={{
            inset: 14,
            border: '1px solid rgba(212,164,55,0.18)',
            borderRadius: '50%',
          }}
        />

        {/* Warm atmospheric glow — radiates from bottom-center outward */}
        <div
          data-anim="glow"
          className="absolute rounded-full"
          style={{
            inset: 18,
            background: 'radial-gradient(ellipse 80% 60% at 50% 80%, rgba(180,130,30,0.55) 0%, rgba(120,80,15,0.25) 45%, transparent 80%)',
            filter: 'blur(6px)',
          }}
        />
      </div>

      {/* Main image circle */}
      <div
        data-anim="profile"
        className="relative overflow-hidden rounded-full"
        style={{
          width: 'clamp(114px, 48vw, 162px)',
          height: 'clamp(114px, 48vw, 162px)',
          border: '2px solid rgba(212,164,55,0.55)',
          background: 'linear-gradient(180deg, #0d1a36 0%, #1a2840 40%, #2a1c08 100%)',
          boxShadow: '0 0 50px rgba(180,120,20,0.35), inset 0 -20px 40px rgba(180,120,20,0.2)',
        }}
      >
        <Image
          src={leader.image}
          alt={leader.name}
          fill
          priority
          sizes="(max-width: 768px) 48vw, 162px"
          className="object-cover object-top"
        />
      </div>

      {/* Small glowing dot — accent, positioned on the ring arc (bottom-right) */}
      <div
        data-anim="accent-dot"
        className="absolute rounded-full bg-gold"
        style={{
          width: 10,
          height: 10,
          bottom: 18,
          right: 'calc(14px + clamp(13px, 2.5vw, 19px))',
          boxShadow: '0 0 10px rgba(212,164,55,0.9)',
        }}
      />
    </div>
  );
}

/* ─────────────────── main component ─────────────────── */
export function Leadership() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const st = { trigger: section, start: 'top 70%' };

      const runFromTo = (selector: string, fromVars: any, toVars: any) => {
        const els = section.querySelectorAll(selector);
        if (!els || els.length === 0) return;
        gsap.fromTo(els as any, fromVars, toVars);
      };

      runFromTo('[data-anim="badge"]',
        { opacity: 0, scale: 0.5, y: -16 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'back.out(2.2)', scrollTrigger: st }
      );

      runFromTo('[data-anim="headline"]',
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', delay: 0.08, scrollTrigger: st }
      );

      runFromTo('[data-anim="connector"]',
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 1.4, ease: 'power3.inOut', delay: 0.45, transformOrigin: 'center', scrollTrigger: st }
      );

      runFromTo('[data-anim="profile"]',
        { scale: 0.55, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.3, stagger: 0.22, ease: 'elastic.out(0.8,0.45)', delay: 0.55, scrollTrigger: st }
      );

      runFromTo('[data-anim="card"]',
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.18, ease: 'power3.out', delay: 0.75, scrollTrigger: st }
      );

      runFromTo('[data-anim="inner"]',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.055, ease: 'power2.out', delay: 0.95, scrollTrigger: st }
      );

      /* continuous: outer ring rotation */
      gsap.utils.toArray<HTMLElement>('[data-anim="ring"]').forEach((el, i) => {
        gsap.to(el, { rotation: 360, duration: 24 + i * 4, ease: 'none', repeat: -1 });
      });

      /* continuous: floating (each card slightly different phase) */
      gsap.utils.toArray<HTMLElement>('[data-anim="profile"]').forEach((el, i) => {
        gsap.to(el, { y: 8, duration: 3.8 + i * 0.5, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: i * 0.35 });
      });

      /* continuous: glow pulse */
      gsap.utils.toArray<HTMLElement>('[data-anim="glow"]').forEach((el, i) => {
        gsap.to(el, { opacity: 0.9, duration: 3, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: i * 0.6 });
      });

      /* continuous: accent dot pulse */
      gsap.utils.toArray<HTMLElement>('[data-anim="accent-dot"]').forEach((el, i) => {
        gsap.to(el, { scale: 1.7, opacity: 0.6, duration: 2.2, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: i * 0.45 });
      });

      /* interactive: profile scale on card hover */
      const cards = gsap.utils.toArray<HTMLElement>('[data-anim="card"]');
      cards.forEach((card) => {
        const profile = card.querySelector('[data-anim="profile"]');
        card.addEventListener('mouseenter', () => {
          if (profile) gsap.to(profile, { scale: 1.07, duration: 0.45, ease: 'power2.out', overwrite: 'auto' });
        });
        card.addEventListener('mouseleave', () => {
          if (profile) gsap.to(profile, { scale: 1, duration: 0.45, ease: 'power2.out', overwrite: 'auto' });
        });
      });

    }, section);

    return () => ctx.revert();
  }, []);

  const CIRCLE_H = 200;  // matches the ProfileCircle wrapper height

  return (
    <section
      ref={sectionRef}
      id="leadership"
      className="relative overflow-hidden section-padding bg-tier-anchor"
    >
      {/* ambient blobs */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div style={{ position: 'absolute', left: '-10%', top: '-5%', width: 'min(78vw, 520px)', height: 'min(78vw, 520px)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,164,55,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', right: '-8%', bottom: '-5%', width: 'min(82vw, 560px)', height: 'min(82vw, 560px)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,164,55,0.16) 0%, transparent 70%)', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', left: '50%', bottom: '0', transform: 'translateX(-50%)', width: 'min(72vw, 60rem)', height: 'min(28vw, 200px)', background: 'radial-gradient(ellipse, rgba(212,164,55,0.07) 0%, transparent 70%)', filter: 'blur(30px)' }} />
      </div>

      <div className="layout-shell editorial-container relative z-10">

        {/* Header - Left Aligned to match screenshot */}
        <div className="mb-14 max-w-[54rem]">
          <div data-anim="badge" className="header-eyebrow">
            <div className="header-eyebrow-dot" />
            <span className="section-label">THE FOUNDING TEAM</span>
          </div>
          <h2
            data-anim="headline"
            className="font-serif-display text-[clamp(2.5rem,5vw,4.2rem)] leading-none tracking-[-0.03em] text-white"
            style={{ margin: 0 }}
          >
            Three founders. Three exits.<br className="hidden sm:block" />
            <span className="text-[#D4A437]">60+ years across HSBC and J.P. Morgan.</span>
          </h2>
          <p data-anim="headline" className="mt-4 text-[1.1rem] text-white/60">Bankers who have built. Founders who have exited.</p>
        </div>

        {/* ─── founders grid ─── */}
        <div style={{ position: 'relative' }}>

          {/* CONNECTOR LINE — sits at the vertical midpoint of the profile circles */}
          <div
            className="hidden md:block"
            style={{ position: 'absolute', top: CIRCLE_H / 2, left: 0, right: 0, height: 1, pointerEvents: 'none', zIndex: 0 }}
          >
            <div
              data-anim="connector"
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, transparent 2%, rgba(212,164,55,0.35) 20%, rgba(212,164,55,0.35) 80%, transparent 98%)',
                transformOrigin: 'center',
              }}
            />
          </div>

          {/* columns */}
          <div
            className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-12 md:grid-cols-3 md:gap-y-0"
          >
            {leaders.map((leader, i) => (
              <div
                key={leader.id}
                data-anim="card"
                className={`border-b border-white/8 pb-8 md:border-b-0 md:pb-0 md:border-r ${i === 2 ? 'md:border-r-0' : ''}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  width: '100%',
                  padding: '0 clamp(0.75rem, 3vw, 1.5rem)',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {/* profile circle */}
                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }} className="md:justify-start">
                  <ProfileCircle leader={leader} index={i} />
                </div>

                {/* name */}
                <h3 data-anim="inner" className="font-serif-editorial text-[clamp(1.5rem,2vw,1.9rem)] font-medium text-white" style={{ marginBottom: 6, width: '100%' }}>
                  {leader.name}
                </h3>

                {/* role */}
                <p data-anim="inner" className="text-[clamp(0.85rem,1.1vw,0.95rem)] font-medium text-[#D4A437]" style={{ marginBottom: 18, width: '100%' }}>
                  {leader.role}
                </p>

                {/* bio */}
                <p data-anim="inner" className="typo-body-sm text-white/70 leading-relaxed" style={{ marginBottom: 20, width: '100%' }}>
                  {leader.bio}
                </p>

                {/* focus */}
                <p data-anim="inner" className="text-[clamp(0.75rem,0.9vw,0.85rem)] text-white/40 tracking-wide mt-auto" style={{ width: '100%' }}>
                  {leader.focus}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
