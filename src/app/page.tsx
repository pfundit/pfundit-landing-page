import type { Metadata } from 'next';
import { HomeClient } from '@/components/pages/home-client';
import { getBreadcrumbSchema, getOrganizationSchema } from '@/lib/seo/schemas';

export const metadata: Metadata = {
  title: 'Disciplined Credit for the Real Economy | Singapore Holding Company',
  description:
    'Pfundit is a Singapore holding company building a regulated, technology-enabled lending platform for Asia — focused on short-tenor, asset-backed financing across India, Southeast Asia and GCC.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Pfundit — Disciplined Credit for the Real Economy',
    description:
      'Singapore holding company building a regulated, technology-enabled lending platform for Asia — short-tenor, asset-backed financing across India, Southeast Asia and the GCC.',
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
