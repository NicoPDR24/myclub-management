/** @type {import('next').NextConfig} */
const nextConfig = {
  // Export static files for Firebase hosting
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  trailingSlash: true,
  
  // Image optimization
  images: {
    unoptimized: process.env.NODE_ENV === 'production',
    domains: [
      'localhost',
      'firebasestorage.googleapis.com'
    ]
  },
  
  // Experimental features
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['firebase-admin']
  },
  
  // Webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@firebase/auth': '@firebase/auth/dist/esm2017/index.js',
        '@firebase/firestore': '@firebase/firestore/dist/esm2017/index.js',
      }
    }
    
    return config
  },
  
  // Environment variables available to the client
  env: {
    CUSTOM_KEY: 'myclub-management'
  },
  
  // Redirects for better UX
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/auth/signin',
        permanent: true
      },
      {
        source: '/register', 
        destination: '/auth/signup',
        permanent: true
      },
      {
        source: '/app',
        destination: '/dashboard',
        permanent: true
      }
    ]
  },
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options', 
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig