import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Add turbopack config to avoid conflicts
  turbopack: {},
};

export default nextConfig;
