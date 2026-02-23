import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Add turbopack config to avoid conflicts
  turbopack: {},
  // ✅ Allow Cloudinary images to load via next/image
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dgrttneu8/**',
      },
    ],
  },
};

export default nextConfig;
