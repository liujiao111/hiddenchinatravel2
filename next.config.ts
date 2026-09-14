import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hiddenchinatravel.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
