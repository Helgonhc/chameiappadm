/** @type {import('next').NextConfig} */
const nextConfig = {
  // Minimal config to avoid Vercel conflicts
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true }
};

module.exports = nextConfig;
