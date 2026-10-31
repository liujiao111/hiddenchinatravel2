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
 */
export const zhLivePaths = new Set<string>([
  "/", // 中文首页已翻译上线
  "/journeys",
  "/journeys/kunming-dali-shaxi-lijiang-6-days",
  "/journeys/kunming-dali-lijiang-shangri-la-private-tour",
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
