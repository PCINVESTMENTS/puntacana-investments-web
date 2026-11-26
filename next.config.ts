import type { NextConfig } from "next";
import path from "path";

const isLocalSandboxEnv = Boolean(process.env.LOCAL_PROPERTIES_SANDBOX_FILE);

const nextConfig: NextConfig = {
  distDir: process.env.LOCAL_NEXT_DIST_DIR || '.next',
  experimental: {
    optimizeCss: !isLocalSandboxEnv,
    optimizePackageImports: ['react-icons', 'lucide-react', 'framer-motion'],
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },

  webpack: (config, { dev }) => {
    if (isLocalSandboxEnv) {
      // Prevent macOS iCloud / Desktop filesystem races on persistent webpack .pack.gz cache in local dev
      if (dev) {
        config.cache = { type: 'memory' };
      }
      // In local isolated sandbox, Dashboard (:3110) replaces Sanity Studio (/studio);
      // stubbing Sanity Studio avoids bundling 15k Studio modules during local mirror builds.
      const studioStub = path.resolve(__dirname, 'src/lib/localStudioStub.tsx');
      config.resolve = config.resolve || {};
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        'next-sanity/studio$': studioStub,
        'sanity$': studioStub,
        'sanity/structure$': studioStub,
        '@sanity/vision$': studioStub,
      };
    }
    return config;
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: isLocalSandboxEnv,
    formats: ['image/avif', 'image/webp'],
    qualities: [50, 60, 65, 75, 90, 100],
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
        hostname: '**.up.railway.app',
      },
      {
        protocol: 'https',
        hostname: '**.vercel.app',
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
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
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
        permanent: true,
      },
      {
        source: "/:lang(es|en|fr)/services/vacation-villas",
        destination: "/:lang/investments/vacation-villas",
        permanent: true,
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
        permanent: true,
      },
      {
        source: "/services/vacation-villas",
        destination: "/es/investments/vacation-villas",
        permanent: true,
      },
    ];
  },
  // Trigger reload for image cache clear
  async headers() {
    const isLocalSandbox = Boolean(process.env.LOCAL_PROPERTIES_SANDBOX_FILE);
    const frameHeaders = isLocalSandbox
      ? [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' http://127.0.0.1:3110 http://localhost:3110;",
          },
        ]
      : [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self';" },
        ];
    const sandboxCorsRules = isLocalSandbox
      ? [
          {
            source: '/:lang(es|en|fr)/properties/:slug',
            headers: [
              { key: 'Access-Control-Allow-Origin', value: '*' },
              { key: 'Access-Control-Allow-Methods', value: 'GET, HEAD, OPTIONS' },
            ],
          },
          {
            source: '/sitemap.xml',
            headers: [
              { key: 'Access-Control-Allow-Origin', value: '*' },
              { key: 'Access-Control-Allow-Methods', value: 'GET, HEAD, OPTIONS' },
            ],
          },
          {
            source: '/robots.txt',
            headers: [
              { key: 'Access-Control-Allow-Origin', value: '*' },
              { key: 'Access-Control-Allow-Methods', value: 'GET, HEAD, OPTIONS' },
            ],
          },
        ]
      : [];
    return [
      ...sandboxCorsRules,
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          ...frameHeaders,
        ]
      }
    ];
  },
};

export default nextConfig;
