/** @type {import('next').NextConfig} */
const nextConfig = {
  // Suppress the workspace root warning
  experimental: {
    turbo: {
      root: __dirname
    }
  }
};

module.exports = nextConfig;