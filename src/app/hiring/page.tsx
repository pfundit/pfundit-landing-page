import type { Metadata } from 'next';
import { PremiumBackground } from '@/components/background/premium-background';
import { Navbar } from '@/components/navbar/Navbar';
import { Hiring, Contact } from '@/sections';
import { getBreadcrumbSchema, getJobPostingsSchema } from '@/lib/seo/schemas';
import { getJobsCollection } from '@/lib/db/collections';
import type { JobRecord } from '@/lib/db/types';

export const dynamic = 'force-dynamic';

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

async function getJobsFromDatabase(): Promise<JobRecord[]> {
  try {
    const jobsCollection = await getJobsCollection();
    const jobs = await jobsCollection
      .find({}, { projection: { _id: 0 } })
      .sort({ id: 1 })
      .toArray();
    return jobs;
  } catch (error) {
    console.error('Failed to fetch jobs directly from DB in HiringPage:', error);
    return [];
  }
}

export default async function HiringPage() {
  const jobs = await getJobsFromDatabase();
  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Careers & Hiring', url: '/hiring' },
  ]);
  const jobListingsSchema = getJobPostingsSchema(jobs);

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
          <Hiring initialRoles={jobs as any} />
        </div>

        <div className="section-cinematic section-cinematic-alt">
          <Contact />
        </div>
      </main>
    </div>
  );
}