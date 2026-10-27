"use client";

import { useEffect, useState } from "react";

const hideWhenVisible = ["ask-joy", "ask-joy-price", "ask-joy-final", "ask-joy-final-whatsapp", "hero-quote"];

export function JourneyFloatCta({ href }: { href: string }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let formsObserver: IntersectionObserver | null = null;
    let footerObserver: IntersectionObserver | null = null;
    let cancelled = false;
    let attempts = 0;

    function watch() {
      if (cancelled) return;
      const targets = hideWhenVisible.flatMap((id) => {
        const el = document.getElementById(id);
        return el ? [el] : [];
      });
      const footer = document.querySelector("footer.footer");
      if (targets.length === 0 && attempts < 60) {
        attempts += 1;
        requestAnimationFrame(watch);
        return;
      }
      const visible = new Set<Element>();
      function sync() {
        setHidden(visible.size > 0);
      }
      if (targets.length > 0) {
        formsObserver = new IntersectionObserver((entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) visible.add(entry.target);
            else visible.delete(entry.target);
          }
          sync();
        }, { threshold: 0.05 });
        targets.forEach((target) => formsObserver?.observe(target));
      }
      if (footer) {
        footerObserver = new IntersectionObserver((entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) visible.add(entry.target);
            else visible.delete(entry.target);
          }
          sync();
        }, { threshold: 0.2 });
        footerObserver.observe(footer);
      }
    }

    watch();
    return () => {
      cancelled = true;
      formsObserver?.disconnect();
      footerObserver?.disconnect();
    };
  }, []);

  return <a
    href={href}
    className={hidden ? "journey-float-cta ask-bar-hidden" : "journey-float-cta"}
    data-cta-location="journey_float_whatsapp"
  >
    <strong>Chat with Joy</strong>
    <small>Usually replies within a few hours</small>
  </a>;
}
