"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import type { AppLocale } from "@/lib/i18n-seo";

type Props = {
  /**
   * Explicit path of this page's translation per locale (unprefixed, e.g.
   * "/dali-travel-guide"). Pass only for locales where the translation truly
   * exists — the switcher falls back to the other locale's home otherwise,
   * never to a /zh URL that would 404.
   */
  alternate?: Partial<Record<AppLocale, string | null>>;
};

export function LocaleSwitcher({ alternate }: Props) {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const t = useTranslations("localeSwitcher");

  const other: AppLocale = locale === "en" ? "zh" : "en";
  // Explicit alternate wins; missing/null means "no translation" → locale home;
  // undefined (static pages that exist in both locales) → same path.
  const targetPath =
    alternate && other in alternate ? alternate[other] ?? "/" : pathname;

  return (
    <nav className="locale-switcher" aria-label={t("label")}>
      <span className="locale-current" aria-current="true">{t(locale)}</span>
      <span className="locale-divider" aria-hidden="true">/</span>
      <Link href={targetPath} locale={other} className="locale-link" hrefLang={other === "zh" ? "zh-Hans" : "en"}>
        {t(other)}
      </Link>
    </nav>
  );
}
