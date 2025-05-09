import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  productionBrowserSourceMaps: true, 
  eslint: {
    ignoreDuringBuilds: true, // Skip ESLint during build
  },
  images: {
    domains: [
      // Include your existing domains here
      'storage.googleapis.com',
      'logos.covalenthq.com',
    ],
  }
};

export default nextConfig;
