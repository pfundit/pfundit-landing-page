import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pfundit — Disciplined Credit for the Real Economy',
    short_name: 'Pfundit',
    description:
      'Singapore holding company building a technology-enabled lending business, starting with a proposed RBI-registered NBFC in India.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f1b3d',
    theme_color: '#FCFBF8',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
