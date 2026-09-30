export type YunnanCountryGuide = {
  countryCode: string;
  country: string;
  slug: string;
  description: string;
};

export const yunnanCountryGuides: readonly YunnanCountryGuide[] = [
  {
    countryCode: "SG",
    country: "Singapore",
    slug: "yunnan-travel-from-singapore",
    description: "Check the visa-free route, flights to Kunming and how to fit Dali, Shaxi and Lijiang into your time away.",
  },
  {
    countryCode: "US",
    country: "the USA",
    slug: "yunnan-travel-from-usa",
    description: "Compare visa and transit options, connecting flights and a slower route that makes the long journey worthwhile.",
  },
  {
    countryCode: "AU",
    country: "Australia",
    slug: "yunnan-travel-from-australia",
    description: "Check the 30-day visa-free policy, routes to Kunming and a realistic 6–8 day first journey.",
  },
  {
    countryCode: "GB",
    country: "the UK",
    slug: "yunnan-travel-from-uk",
    description: "Check the current visa-free window, connecting flights to Kunming and a slower 10–14 day route from Britain.",
  },
  {
    countryCode: "MY",
    country: "Malaysia",
    slug: "yunnan-travel-from-malaysia",
    description: "Plan flights from Malaysia, check entry rules for your passport and choose a 6–8 day route through Kunming, Dali, Shaxi and Lijiang.",
  },
];

export const defaultYunnanCountryGuide = yunnanCountryGuides[0];

function normalizeCountry(value: string | null): string | undefined {
  const country = value?.trim().toUpperCase();
  return country && /^[A-Z]{2}$/.test(country) && country !== "XX" ? country : undefined;
}

export function getVisitorCountry(headers: Pick<Headers, "get">): string | undefined {
  // Cloudflare knows the visitor's country when it proxies a Vercel origin.
  // Otherwise Vercel's country header describes the visitor directly.
  if (headers.get("cf-ray")) {
    return normalizeCountry(headers.get("cf-ipcountry"));
  }
  return normalizeCountry(headers.get("x-vercel-ip-country"));
}

export function selectYunnanCountryGuide(
  countryCode: string | undefined,
  availableGuides: readonly YunnanCountryGuide[],
): YunnanCountryGuide {
  return availableGuides.find((guide) => guide.countryCode === countryCode)
    ?? defaultYunnanCountryGuide;
}
