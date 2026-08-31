import type { Metadata } from 'next';

import { PremiumBackground } from '@/components/background/premium-background';
import { Navbar } from '@/components/navbar/Navbar';
import { Hiring, Contact } from '@/sections';

export const metadata: Metadata = {
  title: 'Hiring | Pfundit',
  description: 'Open roles and founding-team opportunities at Pfundit.',
};

export default function HiringPage() {
  return (
    <div className="relative min-h-screen text-text-primary">
      <PremiumBackground />
      <Navbar />

      <main className="relative z-10">
        <div className="section-cinematic">
          <Hiring />
        </div>

        <div className="section-cinematic section-cinematic-alt">
          <Contact />
        </div>
      </main>
    </div>
  );
}