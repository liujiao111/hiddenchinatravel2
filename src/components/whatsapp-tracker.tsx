"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getAttribution } from "@/lib/attribution";
import { installWhatsAppTracking } from "@/lib/whatsapp-tracking";

export function WhatsAppTracker() {
  const pathname = usePathname();
  useEffect(() => { getAttribution(); }, [pathname]);
  useEffect(() => installWhatsAppTracking(), []);
  return null;
}
