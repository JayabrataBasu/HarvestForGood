import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add redirects from /forum/* to /forums/*
  async redirects() {
    return [
      // Redirect from /forum to /forums
      {
        source: '/forum',
        destination: '/forums',
        permanent: true, // This is a 301 redirect
      },
      // Redirect from /forum/anything to /forums/anything
      {
        source: '/forum/:path*',
        destination: '/forums/:path*',
        permanent: true, // This is a 301 redirect
      }
    ];
  },
  // Add only necessary options
  reactStrictMode: true,
};

export default nextConfig;
