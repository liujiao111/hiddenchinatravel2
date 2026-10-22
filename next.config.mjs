/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/journeys/dali-lijiang-lugu-lake-private-tour", destination: "/journeys", permanent: true },
      { source: "/journeys/dali-lijiang-lugu-lake-6-days", destination: "/journeys", permanent: true },
      { source: "/sitemap_index.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/shuhe-ancient-town-the-quiet-retreat-youre-actually-looking-for-in-lijiang", destination: "/lijiang-travel-guide", permanent: true },
      { source: "/travel-china-guide", destination: "/china-travel-essentials", permanent: true },
      { source: "/services", destination: "/booking", permanent: true },
      { source: "/services/custom-itinerary", destination: "/custom-china-tour", permanent: true },
      { source: "/china-itinerary-planner", destination: "/custom-china-tour", permanent: true },
      { source: "/about", destination: "/about-us", permanent: true },
      { source: "/blog", destination: "/china-travel-essentials", permanent: true },
      { source: "/category/yunnan", destination: "/china-destinations/yunnan", permanent: true },
      { source: "/lijiang", destination: "/lijiang-travel-guide", permanent: true },
      { source: "/shangri-la", destination: "/shangri-la-travel-guide", permanent: true },
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
