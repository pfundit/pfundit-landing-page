import type { Metadata } from 'next';
import { HomeClient } from '@/components/pages/home-client';
import { getBreadcrumbSchema, getOrganizationSchema } from '@/lib/seo/schemas';

export const metadata: Metadata = {
  title: 'Disciplined Credit for the Real Economy | Singapore Holding Company',
  description:
    'Pfundit is a Singapore holding company building a technology-enabled lending business, starting with a proposed RBI-registered NBFC in India.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Pfundit — Disciplined Credit for the Real Economy',
    description:
      'Singapore holding company building a technology-enabled lending business, starting with a proposed RBI-registered NBFC in India.',
    url: 'https://pfundit.com',
    type: 'website',
  },
};

export default function HomePage() {
  const breadcrumbSchema = getBreadcrumbSchema([{ name: 'Home', url: '/' }]);
  const orgSchema = getOrganizationSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <HomeClient />
    </>
  );
}
