import withPWA from 'next-pwa'
const isProd = process.env.NODE_ENV === 'production'
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: false,
  disable: !isProd,
  cacheOnFrontEndNav: true,
  fallbacks: {
    document: '/offline.html',
  },
})(nextConfig)
