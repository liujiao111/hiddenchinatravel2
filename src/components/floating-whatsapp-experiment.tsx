"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site-config";

// Desktop rollout across travel content; preserve existing journey CTAs.
const FLOATING_WHATSAPP_ENABLED = true;
const DESKTOP_QUERY = "(min-width: 1025px)";
const SHOW_AFTER_SCROLL = 360;
const PAID_SIX_DAY_PAGE = "/journeys/kunming-dali-shaxi-lijiang-6-days";

// Normalize the public URL (including locale) before matching.
function basePath(path: string) {
  return (path.replace(/^\/zh(?=\/|$)/, "") || "/").replace(/\/+$/, "") || "/";
}

function eligiblePath(path: string) {
  const pathname = basePath(path);
  // Preserve the paid six-day landing page and exclude transaction/legal pages
  // and tools; public travel content (including future guides) is eligible.
  if (pathname === PAID_SIX_DAY_PAGE) return false;
  if (/^\/(?:go|api)(?:\/|$)/.test(pathname)) return false;
  if (/^\/(?:china-currency-converter|china-visa-checker|search)(?:\/|$)/.test(pathname)) return false;
  if (["/booking", "/privacy-policy", "/terms-of-service", "/affiliate-disclosure", "/licensed-operator"].includes(pathname)) return false;
  return true;
}

function buildWhatsAppHref(path: string) {
  const sourceUrl = new URL(path, siteConfig.url).toString();
  const pathname = basePath(path);
  const yunnanFocused = pathname === "/" || pathname === "/journeys" ||
    pathname.startsWith("/journeys/") || pathname === "/custom-china-tour" ||
    pathname.startsWith("/china-destinations/yunnan");
  const intro = yunnanFocused
    ? "Hi Joy, I'd like help planning a private Yunnan journey."
    : "Hi Joy, I found your website and would like help planning a trip to China.";
  const message = `${intro}\n\nPage: ${sourceUrl}`;
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
export function FloatingWhatsAppExperiment() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [whatsappHref, setWhatsAppHref] = useState(() => buildWhatsAppHref("/"));

  useEffect(() => {
    const path = window.location.pathname.replace(/\/+$/, "") || "/";
    setVisible(false);
    setWhatsAppHref(buildWhatsAppHref(path));
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
