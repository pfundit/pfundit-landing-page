'use client';

import { Navbar } from '@/components/navbar/Navbar';
import { Footer } from '@/components/footer';
import {
  Contact,
  Governance,
  HeroSection,
  Infrastructure as AIEdge,
  InvestmentThesis,
  Leadership,
  MissionVision,
  Stakeholders,
} from '@/sections';
import { useLenisScroll } from '@/hooks/use-lenis-scroll';

export function HomeClient() {
  useLenisScroll();

  return (
    <div className="relative min-h-screen" style={{ background: '#F7F6F2' }}>
      <Navbar />

      <main className="relative z-10">
        <HeroSection />
        <MissionVision />
        <InvestmentThesis />
        <AIEdge />
        <Leadership />
        <Stakeholders />
        <Governance />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
