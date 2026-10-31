import { defineRouting } from "next-intl/routing";

/**
 * Locale strategy (see docs/i18n-plan.md):
 * - English stays at the root with NO prefix, so every existing URL keeps
 *   working byte-for-byte (legacy redirects, sitemap, backlinks, GSC).
 * - Chinese (Simplified) lives under /zh.
 * - Future languages: add to `locales` and create matching content dirs.
 */
export const routing = defineRouting({
  locales: ["en", "zh"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  // URLs are the single source of truth: / is always English and /zh is
  // always Chinese. Automatic cookie/browser detection otherwise redirects
  // English fallback links back into untranslated /zh paths.
  localeDetection: false,
  // Each page emits complete HTML alternates via localizedStaticMetadata.
  // Disable next-intl's duplicate HTTP Link header (incorrect on /zh root).
  alternateLinks: false,
});

export type AppLocale = (typeof routing.locales)[number];
