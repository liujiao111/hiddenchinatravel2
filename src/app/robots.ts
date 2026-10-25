import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/tools/"],
    },
    sitemap: "https://hiddenchinatravel.com/sitemap.xml",
    host: "https://hiddenchinatravel.com",
  };
}
