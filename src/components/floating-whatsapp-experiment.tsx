"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { YunnanContactWidget } from "./yunnan-contact-widget";

const desktopQuery = "(min-width: 701px)";
function subscribe(callback: () => void) {
  const media = window.matchMedia(desktopQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
function isDesktop() { return window.matchMedia(desktopQuery).matches; }
function serverSnapshot() { return false; }

/** Shared desktop-only floating contact; mobile uses page-level CTAs. */
export function FloatingWhatsAppExperiment() {
  const pathname = usePathname();
  const desktop = useSyncExternalStore(subscribe, isDesktop, serverSnapshot);
  const path = pathname.replace(/^\/zh(?=\/|$)/, "").replace(/\/+$/, "") || "/";
  if (!desktop) return null;
  if (/^\/(?:go|api|whatsapp)(?:\/|$)/.test(path)) return null;
  // Remount on navigation so open state and QR impressions belong to the current page.
  return <YunnanContactWidget key={pathname} />;
}
