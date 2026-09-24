export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pfundit.com';

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    '@id': `${SITE_URL}/#organization`,
    name: 'Pfundit',
    legalName: 'Pfundit Pte. Ltd.',
    url: SITE_URL,
    logo: `${SITE_URL}/logo-main.svg`,
    description:
      'Pfundit is a Singapore holding company building a regulated, technology-enabled lending platform for Asia — focused on short-tenor, asset-backed financing in the real economy across India, Southeast Asia and the GCC.',
    foundingDate: '2025',
    identifier: {
      '@type': 'PropertyValue',
      name: 'ACRA UEN',
      value: '202544131H',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'SG',
      addressLocality: 'Singapore',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'info@pfundit.com',
      contactType: 'customer inquiries',
      areaServed: ['SG', 'IN', 'SEA', 'GCC'],
      availableLanguage: ['English'],
    },
    areaServed: [
      { '@type': 'Country', name: 'Singapore' },
      { '@type': 'Country', name: 'India' },
      { '@type': 'AdministrativeArea', name: 'Southeast Asia' },
      { '@type': 'AdministrativeArea', name: 'GCC' },
    ],
    knowsAbout: [
      'Asset-Backed Lending',
      'Regulated Private Credit',
      'Non-Banking Financial Company (NBFC)',
      'AI-Powered Underwriting',
      'Real Economy Debt Financing',
      'Short-Tenor Working Capital',
    ],
  };
}

export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'Pfundit',
    description: 'Disciplined Credit for the Real Economy | Singapore Holding Company',
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    inLanguage: 'en-US',
  };
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function getFinancialProductSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    '@id': `${SITE_URL}/platform/#financial-product`,
    name: 'Short-Tenor Asset-Backed Lending Facilities',
    description:
      'Collateralized, short-tenor institutional and mid-market credit solutions designed for India and Pan-Asian real economy businesses.',
    provider: {
      '@id': `${SITE_URL}/#organization`,
    },
    areaServed: ['Singapore', 'India', 'Southeast Asia', 'GCC'],
    category: 'Asset-Backed Private Credit',
    feesAndCommissionsSpecification: 'Competitive risk-adjusted rates backed by ring-fenced collateral.',
  };
}

export function getJobPostingsSchema(
  jobs: Array<{
    id: string;
    title: string;
    type: string;
    category: string;
    tags: string[];
    description?: string;
    location?: string;
  }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Open Careers and Founding Opportunities at Pfundit',
    itemListElement: jobs.map((job, index) => {
      const lowerType = (job.type || '').toLowerCase();
      let employmentType = 'OTHER';
      if (lowerType.includes('full')) employmentType = 'FULL_TIME';
      else if (lowerType.includes('consult') || lowerType.includes('contract')) employmentType = 'CONTRACTOR';
      else if (lowerType.includes('advisor') || lowerType.includes('part')) employmentType = 'PART_TIME';

      return {
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'JobPosting',
          '@id': `${SITE_URL}/hiring/#job-${job.id}`,
          title: job.title,
          description: job.description?.replace(/<[^>]+>/g, ' ').slice(0, 500) || '',
          datePosted: '2026-09-01',
          employmentType,
          hiringOrganization: {
            '@type': 'Organization',
            name: 'Pfundit Capital Private Ltd.',
            sameAs: SITE_URL,
          },
          jobLocation: {
            '@type': 'Place',
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'IN',
              addressLocality: job.location || 'Bengaluru',
            },
          },
          industry: 'FinTech / Credit / NBFC',
          occupationalCategory: job.category,
          skills: job.tags.join(', '),
        },
      };
    }),
  };
}
