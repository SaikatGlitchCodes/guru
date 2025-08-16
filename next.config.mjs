/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static optimization for pages using useSearchParams
  experimental: {
    scrollRestoration: true,
  },
  
  // SEO and Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    domains: ['toptutor.com', 'cdn.toptutor.com'],
  },

  // Headers for SEO and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
        ],
      },
    ]
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/tutor',
        destination: '/find-tutors',
        permanent: true,
      },
      {
        source: '/tutors',
        destination: '/find-tutors',
        permanent: true,
      },
      {
        source: '/jobs',
        destination: '/tutor-jobs',
        permanent: true,
      },
      {
        source: '/request',
        destination: '/request-tutor',
        permanent: true,
      },
    ]
  },

  // Rewrites for better URLs
  async rewrites() {
    return [
      {
        source: '/maths-tutors',
        destination: '/tutors/mathematics',
      },
      {
        source: '/physics-tutors',
        destination: '/tutors/physics',
      },
      {
        source: '/chemistry-tutors',
        destination: '/tutors/chemistry',
      },
    ]
  },
};

export default nextConfig;
