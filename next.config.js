/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',          // ← ensures Next.js writes to /out
  images: { unoptimized: true } // ← avoids next/image export issues
};
module.exports = nextConfig;
