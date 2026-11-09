"use client";

import { useEffect, useState } from "react";
import { HashLink } from "@/components/hash-link";

/* ------------------------------------------------------------------ */
/*  Mobile sticky CTA bar                                              */
/*                                                                      */
/*  Split layout:                                                      */
/*    - Left  (primary, ~62%): WhatsApp green, icon + label           */
/*      -> jumps straight to WhatsApp with a pre-filled message       */
/*    - Right (secondary, ~38%): brand dark green, label              */
/*      -> scrolls to the enquiry form on the page                    */
/*                                                                      */
/*  The bar auto-hides when an enquiry form scrolls into view so it   */
/*  never covers the form the user is actually filling in.             */
/* ------------------------------------------------------------------ */

/* Hide only when an actual enquiry form is in view — not when the hero
   "Start Planning" button (#hero-quote) is visible, since the bar's
   WhatsApp CTA serves a different purpose than the hero's form-scroll CTA. */
const hideWhenVisible = ["ask-joy", "ask-joy-price", "ask-joy-final"];

type Props = {
  /** WhatsApp deep link (already built with buildWhatsAppUrl). */
  whatsappHref: string;
  /** Anchor id of the enquiry form on the page. */
  formHref?: string;
  /** Primary (WhatsApp) label. */
  whatsappLabel: string;
  /** Secondary (form) label. */
  formLabel: string;
  /** Small status line under the primary label, e.g. "Usually replies within 2 hours". */
  statusLabel?: string;
  /** Tracking label for the secondary CTA. */
  formCtaLocation?: string;
  /** Optional form-only preview mode; leaves existing two-action bars unchanged. */
  formOnly?: boolean;
};

export function MobileCtaBar({
  whatsappHref,
  formHref = "#ask-joy",
  whatsappLabel,
  formLabel,
  statusLabel,
  formCtaLocation = "mobile_button",
  formOnly = false,
}: Props) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let cancelled = false;
    let attempts = 0;

    function watch() {
      if (cancelled) return;
      const targets = formOnly ? [formHref.replace(/^#/, "")] : hideWhenVisible;
      const forms = targets.flatMap((id) => {
        const el = document.getElementById(id);
        return el ? [el] : [];
      });
      if (forms.length === 0 && attempts < 60) {
        attempts += 1;
        requestAnimationFrame(watch);
        return;
      }
      if (forms.length === 0) return;
      const visible = new Set<string>();
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        setHidden(visible.size > 0);
      }, { threshold: 0.05 });
      forms.forEach((form) => observer?.observe(form));
    }

    watch();
    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [formOnly, formHref]);

  const barClass = hidden ? "mobile-cta-bar ask-bar-hidden" : "mobile-cta-bar";

  if (formOnly) return <div className={barClass + " mobile-cta-form-only"}><HashLink href={formHref} className="mobile-cta-form" data-cta-location={formCtaLocation} onJump={() => setHidden(true)}><span className="mobile-cta-label">{formLabel}</span></HashLink></div>;

  return (
    <div className={barClass}>
      {/* Primary — WhatsApp direct chat */}
      <a
        className="mobile-cta-whatsapp"
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        data-cta-location="floating_whatsapp"
      >
        <svg className="mobile-cta-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none">
          <path d="M20.5 11.6a8.5 8.5 0 0 1-12.4 7.5L3 20.5l1.5-4.8A8.5 8.5 0 1 1 20.5 11.6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M8.2 8.6c.4 3.1 2.1 4.8 5.3 5.7l1.1-1.2 2 1c-.3 1.6-1.5 2.4-2.8 2.1-4.2-1-6.8-3.6-7.6-7.6-.2-1.1.6-2.4 1.9-2.8l1.1 2-1.1 1Z" fill="currentColor" />
        </svg>
        <span className="mobile-cta-copy">
          <span className="mobile-cta-label">{whatsappLabel}</span>
          {statusLabel ? <span className="mobile-cta-status">{statusLabel}</span> : null}
        </span>
      </a>

      {/* Secondary — jump to the enquiry form */}
      <HashLink href={formHref} className="mobile-cta-form" data-cta-location={formCtaLocation} onJump={() => setHidden(true)}>
        <span className="mobile-cta-label">{formLabel}</span>
      </HashLink>
    </div>
  );
}
