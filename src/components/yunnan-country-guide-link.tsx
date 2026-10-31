"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { LocaleLink as Link } from "@/components/locale-link";
import { defaultYunnanCountryGuide, yunnanCountryGuides } from "@/lib/yunnan-country-guides";

export function YunnanCountryGuideLink({ onSelect }: { onSelect: () => void }) {
  const [guide, setGuide] = useState(defaultYunnanCountryGuide);
  const t = useTranslations("header.countryGuide");
  const countries = t.raw("countries") as Record<string, string>;

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 3000);

    async function loadGuide() {
      try {
        const response = await fetch("/api/yunnan-country-guide", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) return;

        const data: unknown = await response.json();
        if (!data || typeof data !== "object" || !("countryCode" in data)) return;
        const match = yunnanCountryGuides.find((candidate) => candidate.countryCode === data.countryCode);
        if (match && !controller.signal.aborted) setGuide(match);
      } catch {
        // Singapore remains usable when geolocation is unavailable or slow.
      } finally {
        window.clearTimeout(timeout);
      }
    }

    void loadGuide();
    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, []);

  return <div className="mega-country-guides">
    <h3>{t("title")}</h3>
    <Link href={`/${guide.slug}`} prefetch={false} onClick={onSelect}>{t("from", { country: countries[guide.countryCode] ?? guide.country })}</Link>
    <Link href="/china-destinations/yunnan#from-abroad" onClick={onSelect}>{t("all")}</Link>
  </div>;
}
