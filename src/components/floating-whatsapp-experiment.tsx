"use client";

import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

/* ------------------------------------------------------------------ */
/*  Configuration                                                      */
/* ------------------------------------------------------------------ */
const BUBBLE_DELAY = 20_000;        // desktop: at least 20 seconds on this page
const BUBBLE_SCROLL_PROGRESS = 0.4; // and at least 40% page reading progress
const BUBBLE_AUTO_DISMISS = 5_000;
const SESSION_NOTICE_KEY = "hct_whatsapp_nudge_seen_v1";

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
  const [suppressed, setSuppressed] = useState(false);

  /* Compute WhatsApp URL directly — tracking layer (whatsapp-tracking.ts)
     intercepts the click, injects leadId, and fires GA4 events. */
  const whatsappHref = buildWhatsAppUrl(undefined, locale === "zh" ? "zh" : "en");

  /* Mount flag — standard client-only mount pattern to avoid SSR flash.
     This is the canonical "mounted" idiom; the lint rule is overly strict here. */
  useEffect(() => { setMounted(true); }, []); // eslint-disable-line react-hooks/set-state-in-effect

  /* A small desktop-only, one-time nudge after BOTH time and reading progress.
     The session flag is set at display time, so a route change or dismissal
     cannot re-trigger it in the same tab/session. */
  useEffect(() => {
    if (!mounted || !eligible) return;
    const desktop = window.matchMedia("(min-width: 701px) and (hover: hover)");
    if (!desktop.matches) return;
    try { if (sessionStorage.getItem(SESSION_NOTICE_KEY)) return; } catch { /* storage can be unavailable */ }

    let ready = false;
    let finished = false;
    let dismissTimer: ReturnType<typeof setTimeout> | undefined;
    const readProgress = () => {
      if (!ready || finished || !desktop.matches || document.hidden) return;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? window.scrollY / total : 0;
      if (progress < BUBBLE_SCROLL_PROGRESS) return;
      // A dialog, visible form or mobile bar should never be covered.
      if (document.querySelector("dialog[open], [role='dialog'][aria-modal='true']")) return;
      if (document.activeElement instanceof HTMLElement && document.activeElement.closest("form")) return;
      if (Array.from(document.querySelectorAll("form.contact-form, form.preview-enquiry, form.custom-journey-form")).some(form => {
        const rect = form.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
      })) return;
      finished = true;
      try { sessionStorage.setItem(SESSION_NOTICE_KEY, "1"); } catch { /* ignore unavailable storage */ }
      setBubbleOpen(true);
      dismissTimer = setTimeout(() => setBubbleOpen(false), BUBBLE_AUTO_DISMISS);
    };
    const timer = setTimeout(() => { ready = true; readProgress(); }, BUBBLE_DELAY);
    window.addEventListener("scroll", readProgress, { passive: true });
    window.addEventListener("resize", readProgress);
    const mediaChanged = () => { if (!desktop.matches) setBubbleOpen(false); else readProgress(); };
    desktop.addEventListener("change", mediaChanged);
    document.addEventListener("visibilitychange", readProgress);
    return () => {
      clearTimeout(timer);
      if (dismissTimer) clearTimeout(dismissTimer);
      window.removeEventListener("scroll", readProgress);
      window.removeEventListener("resize", readProgress);
      desktop.removeEventListener("change", mediaChanged);
      document.removeEventListener("visibilitychange", readProgress);
      setBubbleOpen(false);
    };
  }, [mounted, eligible, pathname]);

  /* Suppress the entire floating widget when a real enquiry form, focused form
     field, or photo/modal dialog is in use. Keep observation independent of the
     popup timer so the small button also stays out of the way. */
  useEffect(() => {
    if (!mounted || !eligible) return;
    const formSelector = "form.contact-form, form.preview-enquiry, form.custom-journey-form, #plan form";
    const visibleForms = new Set<Element>();
    const sync = () => {
      const focusedForm = document.activeElement instanceof HTMLElement && Boolean(document.activeElement.closest("form"));
      const dialogOpen = Boolean(document.querySelector("dialog[open], [role='dialog'][aria-modal='true']"));
      const isSuppressed = Boolean(visibleForms.size || focusedForm || dialogOpen);
      setSuppressed(isSuppressed);
      if (isSuppressed) setBubbleOpen(false);
    };
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) visibleForms.add(entry.target);
        else visibleForms.delete(entry.target);
      }
      sync();
    }, { threshold: 0.01 });
    const observed = new Set<Element>();
    const discover = () => {
      for (const form of document.querySelectorAll(formSelector)) {
        if (observed.has(form)) continue;
        observed.add(form);
        observer.observe(form);
      }
      sync();
    };
    const mutation = new MutationObserver(discover);
    mutation.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["open", "aria-modal"] });
    document.addEventListener("focusin", sync);
    document.addEventListener("focusout", sync);
    discover();
    return () => {
      observer.disconnect(); mutation.disconnect();
      document.removeEventListener("focusin", sync);
      document.removeEventListener("focusout", sync);
    };
  }, [mounted, eligible, pathname]);

  useEffect(() => {
    const checkScroll = () => setShowBackToTop(window.scrollY > 360);
    checkScroll();
    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => window.removeEventListener("scroll", checkScroll);
  }, [pathname]);

  const handleBackToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }, []);

  const handleBubbleClose = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBubbleOpen(false);
    try { sessionStorage.setItem(SESSION_NOTICE_KEY, "1"); } catch { /* ignore */ }
  }, []);

  if (!mounted || !eligible || suppressed) return null;

  return (
    <div className="wa-float">
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
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 14 6-6 6 6" />
            <path d="M12 8v12" />
          </svg>
        </button>
      )}
    </div>
  );
}
