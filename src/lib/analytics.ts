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

  if (
    eventName === "generate_lead"
    && window.gtag
    && googleAdsId?.startsWith("AW-")
    && googleAdsLabel
    && /^[A-Za-z0-9_-]+$/.test(googleAdsLabel)
  ) {
    window.gtag("event", "conversion", {
      send_to: `${googleAdsId}/${googleAdsLabel}`,
      event_id: payload.event_id,
    });
  }
}
