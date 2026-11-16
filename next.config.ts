import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'volcano.si.edu',
        pathname: '/**',
      },
    ],
    // Image optimization
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },
  
  // Rebuilt volcano pages re-render on the server once an hour (weekly report box), so their data files must ship with the function.
  outputFileTracingIncludes: {
    '/volcano/[slug]': ['./data/sources/*.json', './data/profiles/*.json'],
  },

  // Performance optimizations
  compress: true,
  
  // Optimize production builds
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // The Vercel project address is a second public copy of the site. Send it to the real domain.
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'volcanoatlas.vercel.app' }],
        destination: 'https://www.volcanosatlas.com/:path*',
        permanent: true,
      },
    ];
  },

  // Headers for caching
  async headers() {
    return [
      {
        // Font files never change under the same name.
        source: '/fonts/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
        ],
      },
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
