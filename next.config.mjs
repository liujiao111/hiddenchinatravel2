/** @type {import('next').NextConfig} */
const nextConfig = {
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
