"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { defaultYunnanCountryGuide, yunnanCountryGuides } from "@/lib/yunnan-country-guides";

export function YunnanCountryGuideLink({ onSelect }: { onSelect: () => void }) {
  const [guide, setGuide] = useState(defaultYunnanCountryGuide);

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
    <h3>Plan from your country</h3>
    <Link href={`/${guide.slug}`} prefetch={false} onClick={onSelect}>Yunnan from {guide.country}</Link>
    <Link href="/china-destinations/yunnan#from-abroad" onClick={onSelect}>All departure guides →</Link>
  </div>;
}
