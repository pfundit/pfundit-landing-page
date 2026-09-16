import type { Metadata } from 'next';
import { PlatformClient } from '@/components/pages/platform-client';
import { getBreadcrumbSchema, getFinancialProductSchema } from '@/lib/seo/schemas';

export const metadata: Metadata = {
  title: 'Platform Architecture & Asset-Backed Lending Stack',
  description:
    'Explore the Pfundit lending platform — an AI-native, API-first regulated credit architecture purpose-built for short-tenor asset-backed financing across India and Asia.',
  alternates: {
    canonical: '/platform',
  },
  openGraph: {
    title: 'Platform Architecture & Asset-Backed Lending Stack | Pfundit',
    description:
      'Explore the Pfundit lending platform — an AI-native, API-first regulated credit architecture purpose-built for short-tenor asset-backed financing across India and Asia.',
    url: 'https://pfundit.com/platform',
    type: 'website',
  },
};

export default function PlatformPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Platform', url: '/platform' },
  ]);
  const productSchema = getFinancialProductSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <PlatformClient />
    </>
  );
}
