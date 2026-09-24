import { PremiumBackground } from '@/components/background/premium-background';
import { Navbar } from '@/components/navbar/Navbar';
import { JobCardSkeleton, HiringNotice } from '@/sections/hiring';

export default function HiringLoading() {
  return (
    <div className="relative min-h-screen text-text-primary">
      <PremiumBackground />
      <Navbar />

      <main className="relative z-10">
        <section className="relative overflow-hidden bg-[#F0F5FF]">
          <div className="layout-shell editorial-container relative z-10" style={{ paddingTop: '5.5rem', paddingBottom: '4rem' }}>
            {/* Filter bar skeleton */}
            <div className="w-full mb-8">
              <div className="grid w-full gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3">
                  <div className="h-10 rounded-full bg-[#0f1b3d]/10 animate-pulse" />
                  <div className="h-10 rounded-full bg-white/60 animate-pulse" />
                  <div className="h-10 rounded-full bg-white/60 animate-pulse" />
                  <div className="h-10 rounded-full bg-white/60 animate-pulse" />
                </div>
                <div className="justify-self-start lg:justify-self-end">
                  <div className="h-8 w-20 rounded-full bg-[#D4A437]/15 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Job card skeletons */}
            <div className="flex flex-col">
              <JobCardSkeleton />
              <JobCardSkeleton />
              <JobCardSkeleton />
            </div>

            {/* Hiring Notice (always visible outside loading) */}
            <HiringNotice />
          </div>
        </section>
      </main>
    </div>
  );
}
