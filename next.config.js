/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic Next.js configuration for Vercel deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;