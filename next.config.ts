import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/careers',
        destination: '/hiring',
        permanent: false,
      },
      {
        source: '/responsibledisclosure',
        destination: '/responsible-disclosure',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
