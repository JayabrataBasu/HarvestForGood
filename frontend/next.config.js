/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add redirects from /forum/* to /forums/*
  async redirects() {
    return [
      {
        source: '/forum',
        destination: '/forums',
        permanent: true,
      },
      {
        source: '/forum/:path*',
        destination: '/forums/:path*',
        permanent: true,
      }
    ];
  },
  reactStrictMode: true,
};

module.exports = nextConfig;