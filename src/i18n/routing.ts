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
});

export type AppLocale = (typeof routing.locales)[number];
