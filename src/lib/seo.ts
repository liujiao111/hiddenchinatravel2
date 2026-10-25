import { licensedOperator } from "@/lib/journey-trust";
import { siteConfig } from "@/lib/site-config";

export const defaultOgImage = siteConfig.ogImage;

export const organizationJsonLd = {
  "@type": "TravelAgency",
  name: siteConfig.name,
  legalName: licensedOperator.nameEn,
  url: siteConfig.url,
  logo: `${siteConfig.url}/brand/logo.webp`,
  email: siteConfig.enquiryEmail,
  telephone: `+${siteConfig.whatsappNumber}`,
  address: {
    "@type": "PostalAddress",
    streetAddress: licensedOperator.addressEn,
    addressLocality: "Kunming",
    addressRegion: "Yunnan",
    addressCountry: "CN",
  },
  sameAs: [siteConfig.instagram, siteConfig.tiktok],
} as const;
