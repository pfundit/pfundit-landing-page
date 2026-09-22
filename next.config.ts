import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/careers',
        destination: '/hiring',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
