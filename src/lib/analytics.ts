import { analyticsDenied } from "./attribution";

export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    uetq?: { push: (...args: unknown[]) => unknown };
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

  // Only confirmed form submissions and intentional consultation clicks are goals.
  // Queue early actions until bat.js loads. Do not forward PII or GA's nominal value.
  if ((eventName === "generate_lead" || eventName === "whatsapp_click") && !analyticsDenied()) {
    window.uetq = window.uetq || ([] as unknown[]);
    window.uetq.push("event", eventName, {});
  }

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

// E-commerce events have nested items. Do not reuse the lead goal conversion mapping.
// These represent intent, not revenue; the separately Stripe-verified order page sends purchase.
export function trackEcommerceEvent(eventName: "begin_checkout", details: {
  amountDueFen: number; productId: string; paymentType: "full" | "deposit";
  serviceCategory?: string;
}) {
  if (typeof window === "undefined" || analyticsDenied() || !window.gtag) return;
  const { amountDueFen, productId, paymentType, serviceCategory } = details;
  if (!Number.isSafeInteger(amountDueFen) || amountDueFen < 1 || !/^[a-z0-9-]{1,80}$/.test(productId)) return;
  const value = amountDueFen / 100;
  window.gtag("event", eventName, {
    currency: "USD", value,
    payment_type: paymentType,
    service_category: serviceCategory,
    items: [{ item_id: productId, item_name: productId, price: value, quantity: 1 }],
    transport_type: "beacon",
  } as Parameters<NonNullable<Window["gtag"]>>[2]);
}
