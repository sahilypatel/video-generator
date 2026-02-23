import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow server-side rendering of remotion bundler/renderer (Node.js only)
  serverExternalPackages: [
    "@remotion/bundler",
    "@remotion/renderer",
    "@mendable/firecrawl-js",
  ],
  // Increase body size limit for video uploads/responses
  experimental: {},
};

export default nextConfig;
