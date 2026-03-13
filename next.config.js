/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: false
  },
  // SEO 최적화
  experimental: {
    appDir: true
  }
}

module.exports = nextConfig