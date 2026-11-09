"use client";

import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

/* ------------------------------------------------------------------ */
/*  Configuration                                                      */
/* ------------------------------------------------------------------ */
const BUBBLE_DELAY = 3000;           // chat bubble pops after 3s
const BUBBLE_AUTO_DISMISS = 8000;    // auto-dismiss bubble after 8s

function basePath(path: string) {
  return (path.replace(/^\/zh(?=\/|$)/, "") || "/").replace(/\/+$/, "") || "/";
}

function eligiblePath(path: string) {
  const pathname = basePath(path);
  if (/^\/(?:go|api)(?:\/|$)/.test(pathname)) return false;
  if (/^\/(?:china-currency-converter|china-visa-checker|search)(?:\/|$)/.test(pathname)) return false;
  if (["/booking", "/privacy-policy", "/terms-of-service", "/affiliate-disclosure", "/licensed-operator"].includes(pathname)) return false;
  return true;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export function FloatingWhatsAppExperiment() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("floatingChat");

  /* Visibility: hidden on first render (avoids SSR flash), shown after
     mount if eligible. Derived from pathname so it auto-updates on route
     change without setState-in-effect. */
  const eligible = eligiblePath(pathname);
  const [mounted, setMounted] = useState(false);
  const [bubbleOpen, setBubbleOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  /* Compute WhatsApp URL directly — tracking layer (whatsapp-tracking.ts)
     intercepts the click, injects leadId, and fires GA4 events. */
  const whatsappHref = buildWhatsAppUrl(undefined, locale === "zh" ? "zh" : "en");

  /* Mount flag — standard client-only mount pattern to avoid SSR flash.
     This is the canonical "mounted" idiom; the lint rule is overly strict here. */
  useEffect(() => { setMounted(true); }, []); // eslint-disable-line react-hooks/set-state-in-effect

  /* Bubble schedule — only timers, no synchronous setState except
     inside setTimeout callbacks (which is fine) */
  useEffect(() => {
    if (!mounted || !eligible) return;

    const bubbleTimer = setTimeout(() => setBubbleOpen(true), BUBBLE_DELAY);
    const dismissTimer = setTimeout(() => setBubbleOpen(false), BUBBLE_DELAY + BUBBLE_AUTO_DISMISS);

    return () => {
      clearTimeout(bubbleTimer);
      clearTimeout(dismissTimer);
    };
  }, [mounted, eligible, pathname, locale]);

  useEffect(() => {
    const checkScroll = () => setShowBackToTop(window.scrollY > 360);
    checkScroll();
    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => window.removeEventListener("scroll", checkScroll);
  }, [pathname]);

  const handleBackToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setBubbleOpen(true);
  }, []);

  const handleBubbleClose = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBubbleOpen(false);
  }, []);

  if (!mounted || !eligible) return null;

  return (
    <div className="wa-float" onMouseEnter={handleMouseEnter}>
      {/* Chat bubble popup */}
      {bubbleOpen && (
        <div className="wa-bubble" role="dialog" aria-label={t("ariaLabel")}>
          <button
            className="wa-bubble-close"
            onClick={handleBubbleClose}
            aria-label={t("bubbleClose")}
            type="button"
          >
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path d="M3.5 3.5 L12.5 12.5 M12.5 3.5 L3.5 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
            </svg>
          </button>
          <p className="wa-bubble-text">{t("bubbleText")}</p>
          <span className="wa-bubble-hint">{t("tooltip")}</span>
        </div>
      )}

      {/* Floating button with persistent badge label */}
      <div className="wa-float-action">
        <span className="wa-float-badge" aria-hidden="true">{t("badge")}</span>
        <a
          className="wa-float-btn"
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("ariaLabel")}
          data-cta-location="floating_whatsapp"
        >
          <span className="wa-float-pulse" aria-hidden="true" />
          <svg className="wa-float-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none">
            <path d="M20.5 11.6a8.5 8.5 0 0 1-12.4 7.5L3 20.5l1.5-4.8A8.5 8.5 0 1 1 20.5 11.6Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            <path d="M8.2 8.6c.4 3.1 2.1 4.8 5.3 5.7l1.1-1.2 2 1c-.3 1.6-1.5 2.4-2.8 2.1-4.2-1-6.8-3.6-7.6-7.6-.2-1.1.6-2.4 1.9-2.8l1.1 2-1.1 1Z" fill="currentColor" />
          </svg>
        </a>
      </div>
      {showBackToTop && (
        <button className="wa-back-to-top" type="button" onClick={handleBackToTop} aria-label={locale === "zh" ? "返回顶部" : "Back to top"} title={locale === "zh" ? "返回顶部" : "Back to top"}>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 14 6-6 6 6" />
            <path d="M12 8v12" />
          </svg>
        </button>
      )}
    </div>
  );
}
