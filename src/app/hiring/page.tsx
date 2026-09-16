import type { Metadata } from 'next';
import { PremiumBackground } from '@/components/background/premium-background';
import { Navbar } from '@/components/navbar/Navbar';
import { Hiring, Contact } from '@/sections';
import { getBreadcrumbSchema, getJobPostingsSchema } from '@/lib/seo/schemas';
import jobsData from '@/data/jobs.json';

export const metadata: Metadata = {
  title: 'Careers & Founding Opportunities',
  description:
    'Join Pfundit in building Asia’s regulated credit infrastructure. Explore founding leadership, risk, compliance, product, and engineering opportunities.',
  alternates: {
    canonical: '/hiring',
  },
  openGraph: {
    title: 'Careers & Founding Opportunities | Pfundit',
    description:
      'Join Pfundit in building Asia’s regulated credit infrastructure. Explore founding leadership, risk, compliance, product, and engineering opportunities.',
    url: 'https://pfundit.com/hiring',
    type: 'website',
  },
};

export default function HiringPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Careers & Hiring', url: '/hiring' },
  ]);
  const jobListingsSchema = getJobPostingsSchema(jobsData);

  return (
    <div className="relative min-h-screen text-text-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobListingsSchema) }}
      />
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