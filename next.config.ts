import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  productionBrowserSourceMaps: true, 
  eslint: {
    ignoreDuringBuilds: true, // Skip ESLint during build
  },
  images: {
    domains: ["logos.covalenthq.com", "storage.googleapis.com","coin-images.coingecko.com"],
  },
};

export default nextConfig;
