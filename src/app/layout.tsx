import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { getOrganizationSchema, getWebsiteSchema } from '@/lib/seo/schemas';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pfundit.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Pfundit — Regulated Credit for the Real Economy | Singapore',
    template: '%s | Pfundit',
  },
  description:
    'Pfundit is a Singapore holding company building a regulated, technology-enabled lending platform for Asia — focused on short-tenor, asset-backed financing in the real economy across India, Southeast Asia and the GCC.',
  applicationName: 'Pfundit',
  keywords: [
    'Pfundit',
    'Asset-Backed Lending',
    'Regulated Credit',
    'Private Credit Asia',
    'Singapore Holding Company',
    'India NBFC',
    'Real Economy Financing',
    'Fintech Asia',
    'Short-Tenor Credit',
    'Trade Finance Asia',
    'Credit Underwriting',
    'AI Lending Stack',
  ],
  authors: [{ name: 'Pfundit Pte. Ltd.', url: siteUrl }],
  creator: 'Pfundit Pte. Ltd.',
  publisher: 'Pfundit Pte. Ltd.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Pfundit — Regulated Credit for the Real Economy | Singapore',
    description:
      'Singapore holding company building a regulated, technology-enabled lending platform for Asia — focused on short-tenor, asset-backed financing in the real economy across India, Southeast Asia and the GCC.',
    url: siteUrl,
    siteName: 'Pfundit',
    locale: 'en_SG',
    type: 'website',
    images: [
      {
        url: '/hero4.png',
        width: 1200,
        height: 630,
        alt: 'Pfundit — Regulated Credit for the Real Economy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pfundit — Regulated Credit for the Real Economy | Singapore',
    description:
      'Singapore holding company building a regulated, technology-enabled lending platform for Asia.',
    images: ['/hero4.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FCFBF8',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgSchema = getOrganizationSchema();
  const websiteSchema = getWebsiteSchema();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col selection:bg-[#0f1b3d] selection:text-white">
        {children}
      </body>
    </html>
  );
}
