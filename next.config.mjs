import createNextIntlPlugin from "next-intl/plugin";
import { legacyRedirects } from "./legacy-redirects.mjs";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      // Only the directory moves; /journeys/<slug> detail pages retain their URLs.
      ...["", "/zh", "/en"].flatMap((prefix) => ["", "/"].map((slash) => ({
        source: `${prefix}/journeys${slash}`,
        destination: `${prefix === "/en" ? "" : prefix}/private-yunnan-tours`,
        statusCode: 301,
      }))),
      // Consolidate the former custom-tour page directly into the Yunnan service page.
      // Query parameters pass through; legacy fragments have matching anchors there.
      ...["", "/zh", "/en"].flatMap((prefix) => ["", "/"].map((slash) => ({
        source: `${prefix}/custom-china-tour${slash}`,
        destination: `${prefix === "/en" ? "" : prefix}/private-yunnan-tours`,
        statusCode: 301,
      }))),
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
      // Keep old public PNG URLs working after their replacement with optimized WebP.
      ...[
        "AEA90834-C386-4023-84A9-B7E29C6569E7",
        "38F5AAF2-AD1C-4D3D-B035-5B9109C589D9",
      ].map((name) => ({
        source: `/assets/destinations/yunnan/shaxi/${name}.png`,
        destination: `/assets/destinations/yunnan/shaxi/${name}.webp`,
        permanent: true,
      })),
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
