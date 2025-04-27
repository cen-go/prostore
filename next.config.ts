import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "next-ecommerce-tutorial.s3.eu-north-1.amazonaws.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
