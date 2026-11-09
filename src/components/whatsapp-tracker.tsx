"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getAttribution } from "@/lib/attribution";
import { installWhatsAppTracking } from "@/lib/whatsapp-tracking";
import { clearContactOriginWhenAway, installContactOriginTracking } from "@/lib/contact-origin";

export function WhatsAppTracker() {
  const pathname = usePathname();
  useEffect(() => { getAttribution(); clearContactOriginWhenAway(); }, [pathname]);
  useEffect(() => installContactOriginTracking(), []);
  useEffect(() => installWhatsAppTracking(), []);
  return null;
}
