import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    // Use remotePatterns instead of the deprecated `domains` option
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      // Allow localhost for development
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/uploads/**",
      },
      // Add your production API domain here when deploying
      // {
      //   protocol: "https",
      //   hostname: "your-api-domain.com",
      //   pathname: "/uploads/**",
      // },
    ],
  },
};

export default nextConfig;
