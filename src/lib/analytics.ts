export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "js",
      target: string | Date,
      params?: AnalyticsParams,
    ) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

function cookieValue(name: string) {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

export function newAnalyticsEventId() {
  return crypto.randomUUID();
}

export function metaClickIds() {
  if (typeof window === "undefined") return { fbp: "", fbc: "", sourceUrl: "" };
  const fbp = cookieValue("_fbp");
  const fbclid = new URLSearchParams(window.location.search).get("fbclid") || "";
  const fbc = cookieValue("_fbc") || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : "");
  return { fbp, fbc, sourceUrl: window.location.href };
}

export function trackEvent(eventName: string, params: AnalyticsParams = {}) {
  if (typeof window === "undefined") return;

  if (window.gtag) window.gtag("event", eventName, params);

  if (eventName === "generate_lead" && window.fbq) {
    const eventID = typeof params.event_id === "string" ? params.event_id : undefined;
    window.fbq("track", "Lead", {
      content_name: params.form_name,
      content_category: params.page_path,
    }, eventID ? { eventID } : undefined);
  }
}
