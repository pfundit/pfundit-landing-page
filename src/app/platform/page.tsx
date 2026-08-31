'use client';

import { Navbar } from '@/components/navbar/Navbar';
import { Footer } from '@/components/footer';
import { PlatformOverview } from '@/sections';
import { useLenisScroll } from '@/hooks/use-lenis-scroll';

export default function PlatformPage() {
  useLenisScroll();

  return (
    <div className="relative min-h-screen" style={{ background: '#F7F6F2' }}>
      <Navbar />

      <main className="relative z-10">
        <PlatformOverview />
      </main>

      <Footer />
    </div>
  );
}
