import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pfundit — Regulated Credit for the Real Economy',
    short_name: 'Pfundit',
    description:
      'Singapore holding company building a regulated, technology-enabled lending platform for Asia.',
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
