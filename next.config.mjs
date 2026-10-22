/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/journeys/dali-lijiang-lugu-lake-private-tour",
        destination: "/journeys",
        permanent: true,
      },
      {
        source: "/journeys/dali-lijiang-lugu-lake-6-days",
        destination: "/journeys",
        permanent: true,
      },
    ];
  },
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
