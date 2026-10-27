"use client";

import { useEffect, useState } from "react";
import { HashLink } from "@/components/hash-link";

const hideWhenVisible = ["ask-joy", "ask-joy-price", "ask-joy-final", "hero-quote"];

export function JourneyMobileCta({ href = "#ask-joy", label = "Start Planning My Journey" }: { href?: string; label?: string }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let cancelled = false;
    let attempts = 0;

    function watch() {
      if (cancelled) return;
      const forms = hideWhenVisible.flatMap((id) => {
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
  }, []);

  return (
    <HashLink
      href={href}
      className={hidden ? "journey-mobile-cta ask-bar-hidden" : "journey-mobile-cta"}
      onJump={() => setHidden(true)}
    >
      {label} <span>→</span>
    </HashLink>
  );
}
