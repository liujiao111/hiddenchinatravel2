import type { Metadata } from "next";
import { routing, type AppLocale } from "@/i18n/routing";

export type { AppLocale };
export const locales = routing.locales;
export const defaultLocale = routing.defaultLocale;

/**
 * Per-locale path of a page's translation (unprefixed, e.g. "/dali-travel-guide").
 * null = no translation in that locale (locale switcher falls back to home).
 */
export type LocaleAlternate = Partial<Record<AppLocale, string | null>>;

const siteUrl = "https://hiddenchinatravel.com";

/** <html lang> values per locale. */
export const htmlLang: Record<AppLocale, string> = {
  en: "en",
  zh: "zh-Hans",
};

/**
 * Paths that are approved for Chinese indexing (i.e. actually translated,
 * not English scaffolding). Everything under /zh NOT listed here renders
 * with noindex and stays out of the sitemap until its translation lands
 * (see docs/i18n-plan.md §6 — 渐进发布).
 *
 * Blog post and hub paths are included because their Chinese translations
 * now exist in _posts-zh/ and content-zh/hubs/. If a translation is removed
 * or marked as draft, remove its path here too.
 */
export const zhLivePaths = new Set<string>([
  // — Static pages (translated via i18n messages) —
  "/", // 中文首页已翻译上线
  "/journeys/kunming-dali-shaxi-lijiang-6-days",
  "/journeys/kunming-dali-lijiang-shangri-la-private-tour",
  "/private-yunnan-tours",
  "/yunnan-tour-packages",
  "/contact",
  "/about-us",
  "/survival-kit",
  "/china-destinations/yunnan",
  "/china-visa-checker",
  "/china-currency-converter",
  "/traveler-stories",

  // — Blog posts (_posts-zh/) —
  "/alipay-for-foreigners-china",
  "/alipay-wechat-pay-verification-failed",
  "/best-esim-for-china-travel",
  "/best-vpn-for-china",
  "/book-china-high-speed-rail-foreigners",
  "/china-attraction-ticket-booking-foreigners-2026",
  "/china-real-name-system-foreigners",
  "/china-sim-card-for-foreigners",
  "/china-visa-free-countries-2026",
  "/chinese-id-number-foreigners",
  "/dali-hidden-gems-off-the-beaten-path",
  "/dali-travel-guide",
  "/digital-survival-china-internet-guide",
  "/digital-survival-china-payment-guide",
  "/digital-survival-china-transport-guide",
  "/do-i-need-a-visa-for-china",
  "/do-you-need-vpn-china",
  "/google-maps-china-not-working",
  "/hotels-in-china-for-foreigners",
  "/how-to-plan-china-itinerary",
  "/how-to-use-didi-china-foreigners",
  "/how-to-use-meituan",
  "/independent-travel-china",
  "/kunming-travel-guide",
  "/lijiang-travel-guide",
  "/order-food-china-without-chinese-number",
  "/shangri-la-travel-guide",
  "/shaxi-ancient-town-guide",
  "/trip-com-esim-china-review",
  "/wechat-pay-for-foreigners-china",
  "/where-to-stay-in-dali",
  "/why-china-attractions-require-reservations",
  "/why-your-payment-fails-in-china",
  "/yunnan-travel-from-australia",
  "/yunnan-travel-from-malaysia",
  "/yunnan-travel-from-singapore",
  "/yunnan-travel-from-uk",
  "/yunnan-travel-from-usa",

  // — Hub pages (content-zh/hubs/) —
  "/attraction-tickets-in-china",
  "/china-itinerary-planning",
  "/china-travel-essentials",
  "/food-delivery-in-china",
  "/hotels-in-china",
  "/internet-in-china",
  "/maps-navigation-in-china",
  "/payments-in-china",
  "/transport-in-china",
]);

export function isZhLive(path: string): boolean {
  return zhLivePaths.has(path);
}

/** Locale-prefixed path: "/journeys" for en, "/zh/journeys" for zh. */
export function localePath(locale: AppLocale, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return locale === defaultLocale ? normalized : `/${locale}${normalized}`;
}

export function localeUrl(locale: AppLocale, path: string): string {
  return `${siteUrl}${localePath(locale, path)}`;
}

/**
 * Metadata `alternates` for one page:
 * - canonical always self-references the CURRENT locale URL (never point a
 *   translated page's canonical at the English one);
 * - hreflang links are only emitted for locales where the page truly exists
 *   (`available`), plus x-default → English.
 */
export function alternatesFor(
  locale: AppLocale,
  path: string,
  available: readonly AppLocale[] = locales,
): { canonical: string; languages: Record<string, string> } {
  const languages: Record<string, string> = {};
  for (const lang of available) {
    languages[htmlLang[lang]] = localeUrl(lang, path);
  }
  languages["x-default"] = localeUrl(defaultLocale, path);
  return { canonical: localeUrl(locale, path), languages };
}

/**
 * robots directive: English pages always index; Chinese pages index only
 * once their translation is live, to keep English-content scaffolding under
 * /zh out of Google's index (avoids soft-duplicate dilution).
 */
export function robotsFor(locale: AppLocale, path: string): { index: boolean; follow: boolean } {
  const index = locale === defaultLocale || isZhLive(path);
  return { index, follow: true };
}

/**
 * Wraps a static page's existing metadata with locale-aware canonical,
 * hreflang and robots. hreflang only advertises zh once the path is listed
 * in `zhLivePaths` (translation actually published). og:url follows the
 * current locale's canonical.
 */
export function localizedStaticMetadata(
  locale: AppLocale,
  path: string,
  base: Metadata,
): Metadata {
  const available: AppLocale[] = ["en"];
  if (isZhLive(path)) available.push("zh");
  const alternates = alternatesFor(locale, path, available);
  return {
    ...base,
    robots: robotsFor(locale, path),
    alternates,
    openGraph: base.openGraph ? { ...base.openGraph, url: alternates.canonical } : base.openGraph,
  };
}
