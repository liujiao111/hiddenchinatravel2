import createNextIntlPlugin from "next-intl/plugin";
import { legacyRedirects } from "./legacy-redirects.mjs";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      {
        source: "/traveler-stories/finding-another-side-of-china-in-yunnan",
        destination: "/traveler-stories/from-chinas-cities-to-yunnans-landscapes",
        permanent: true,
      },
      {
        source: "/traveler-stories/finding-another-side-of-china-in-yunnan/",
        destination: "/traveler-stories/from-chinas-cities-to-yunnans-landscapes",
        permanent: true,
      },
      ...legacyRedirects(),
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

export default withNextIntl(nextConfig);
