"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

function cleanText(value: string | null) {
  return value?.replace(/\s+/g, " ").trim().slice(0, 100) || "unknown";
}

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!gaMeasurementId || !window.gtag) return;

    window.gtag("config", gaMeasurementId, {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;

      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;

      const url = new URL(link.href, window.location.href);
      const common = {
        link_text: cleanText(link.textContent),
        // Never send pre-filled WhatsApp messages (which may contain personal data) to GA4.
        link_url: `${url.origin}${url.pathname}`,
        page_path: window.location.pathname,
      };

      if (url.hostname === "wa.me" || url.hostname.endsWith("whatsapp.com")) {
        trackEvent("whatsapp_click", {
          ...common,
          cta_location: link.closest("header")
            ? "header"
            : link.closest("footer")
              ? "footer"
              : "page_content",
        });
        return;
      }

      if (url.origin !== window.location.origin) return;

      if (url.pathname === "/journeys" || url.pathname === "/journeys/") {
        trackEvent("explore_journeys_click", common);
      } else if (url.pathname.startsWith("/journeys/")) {
        trackEvent("journey_detail_click", {
          ...common,
          journey_slug: url.pathname.split("/").filter(Boolean)[1] || "unknown",
        });
      }
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
