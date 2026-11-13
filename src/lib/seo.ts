import { siteConfig } from "@/lib/site-config";

export const defaultOgImage = siteConfig.ogImage;

// Hidden China Travel is an independently managed brand, NOT the legal name
// or licence holder of the local operating travel agency.
export const organizationJsonLd = {
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/brand/logo.webp`,
  email: siteConfig.enquiryEmail,
  sameAs: [siteConfig.facebook, siteConfig.instagram, siteConfig.tiktok],
  founder: {
    "@type": "Person",
    name: "Joy Liu",
  },
} as const;
