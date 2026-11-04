"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site-config";

// Full rollout for the existing eligible desktop pages. Never modifies journey CTAs.
const FLOATING_WHATSAPP_ENABLED = true;
const DESKTOP_QUERY = "(min-width: 1025px)";
const SHOW_AFTER_SCROLL = 360;
const PAID_SIX_DAY_PAGE = "/journeys/kunming-dali-shaxi-lijiang-6-days";

function eligiblePath(path: string) {
  // The first test deliberately excludes Chinese, informational articles,
  // and the six-day Google Ads landing page.
  if (path === "/" || path === "/custom-china-tour" || path === "/journeys") return true;
  return /^\/journeys\/[^/]+$/.test(path) && path !== PAID_SIX_DAY_PAGE;
}

const whatsappHref =
  "https://wa.me/" +
  siteConfig.whatsappNumber +
  "?text=" +
  encodeURIComponent("Hi Joy, I'd like help planning a private Yunnan journey.");

export function FloatingWhatsAppExperiment() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const path = window.location.pathname.replace(/\/+$/, "") || "/";
    setVisible(false);
    if (!FLOATING_WHATSAPP_ENABLED || !eligiblePath(path)) return;

    const desktop = window.matchMedia(DESKTOP_QUERY);
    function updateVisibility() {
      setVisible(
        desktop.matches &&
        window.scrollY >= SHOW_AFTER_SCROLL
      );
    }

    window.addEventListener("scroll", updateVisibility, { passive: true });
    desktop.addEventListener("change", updateVisibility);
    updateVisibility();

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      desktop.removeEventListener("change", updateVisibility);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <a
      className="floating-whatsapp"
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Joy on WhatsApp"
      data-cta-location="floating_whatsapp"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none">
        <path d="M20.5 11.6a8.5 8.5 0 0 1-12.4 7.5L3 20.5l1.5-4.8A8.5 8.5 0 1 1 20.5 11.6Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
        <path d="M8.2 8.6c.4 3.1 2.1 4.8 5.3 5.7l1.1-1.2 2 1c-.3 1.6-1.5 2.4-2.8 2.1-4.2-1-6.8-3.6-7.6-7.6-.2-1.1.6-2.4 1.9-2.8l1.1 2-1.1 1Z" fill="currentColor"/>
      </svg>
      <span>Chat with Joy</span>
      <span className="floating-whatsapp-channel">WhatsApp</span>
    </a>
  );
}
