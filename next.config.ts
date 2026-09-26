import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['react-icons', 'lucide-react', 'framer-motion'],
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [50, 75, 90, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upcrealestate.com',
      },
      {
        protocol: 'https',
        hostname: 'puntacana-fortress-production.up.railway.app',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'www.puntacanainvestmentsrd.com',
      },
      {
        protocol: 'https',
        hostname: 'puntacanainvestmentsrd.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:lang(es|en|fr)/about",
        destination: "/:lang#about",
        permanent: true,
      },
      {
        source: "/:lang(es|en|fr)/projects",
        destination: "/:lang/futuros-proyectos",
        permanent: true,
      },
      {
        source: "/:lang(es|en|fr)/hotels",
        destination: "/:lang/properties?type=commercial",
        permanent: false,
      },
      {
        source: "/about",
        destination: "/es#about",
        permanent: true,
      },
      {
        source: "/projects",
        destination: "/es/futuros-proyectos",
        permanent: true,
      },
      {
        source: "/hotels",
        destination: "/es/properties?type=commercial",
        permanent: false,
      },
    ];
  },
  // Trigger reload for image cache clear
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self';" }
        ]
      }
    ];
  },
};

export default nextConfig;
