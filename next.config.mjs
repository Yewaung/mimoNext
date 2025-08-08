/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode
  reactStrictMode: true,
  
  // Enable SWC minification for better performance
  swcMinify: true,
  
  // Enable experimental features for Next.js 15
  experimental: {
    // Enable Server Components
    serverComponentsExternalPackages: [],
    // Enable experimental features
    ppr: false,
  },
  
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
  },
  
  // Enable compression
  compress: true,
  
  // PWA-ready headers
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
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Enable static optimization
  trailingSlash: false,
  
  // Font optimization
  optimizeFonts: true,
  
  // Webpack configuration for optimizations
  webpack: (config) => {
    // Enable tree shaking for better bundle size
    config.optimization.usedExports = true;
    return config;
  },
};

export default nextConfig;
