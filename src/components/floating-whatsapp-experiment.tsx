"use client";

import { usePathname } from "next/navigation";
import { YunnanContactWidget } from "./yunnan-contact-widget";

/** One shared contact panel on every public page; redirect endpoints hand off directly. */
export function FloatingWhatsAppExperiment() {
  const pathname = usePathname();
  const path = pathname.replace(/^\/zh(?=\/|$)/, "").replace(/\/+$/, "") || "/";
  if (/^\/(?:go|api|whatsapp)(?:\/|$)/.test(path)) return null;
  // Remount on navigation so open state and QR impressions belong to the current page.
  return <YunnanContactWidget key={pathname} />;
}
