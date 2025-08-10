/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',          // this makes Next put the site in /out
  images: { unoptimized: true },
  // optional but nice for Azure Storage:
  trailingSlash: true
};
module.exports = nextConfig;
