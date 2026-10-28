export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "js",
      target: string | Date,
      params?: AnalyticsParams,
    ) => void;
  }
}

const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const googleAdsLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;
const googleAdsWhatsAppLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_WHATSAPP_CONVERSION_LABEL;

export function newAnalyticsEventId() {
  return crypto.randomUUID();
}

export function trackEvent(eventName: string, params: AnalyticsParams = {}) {
  if (typeof window === "undefined") return;

  const payload =
    eventName === "generate_lead"
      ? { currency: "USD", value: 1, ...params }
      : params;

  if (window.gtag) window.gtag("event", eventName, payload);

  const conversionLabel =
    eventName === "generate_lead"
      ? googleAdsLabel
      : eventName === "whatsapp_click"
        ? googleAdsWhatsAppLabel
        : undefined;

  if (
    conversionLabel
    && window.gtag
    && googleAdsId?.startsWith("AW-")
    && /^[A-Za-z0-9_-]+$/.test(conversionLabel)
  ) {
    window.gtag("event", "conversion", {
      send_to: `${googleAdsId}/${conversionLabel}`,
      ...(typeof payload.event_id === "string" ? { event_id: payload.event_id } : {}),
    });
  }
}
