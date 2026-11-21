import { analyticsDenied, getAttribution } from "./attribution";

// Browser helper: never send traveller details to the attribution store or GA.
export function createFormTracking(ref: string, formName: string, productId = "") {
  const allowed = !analyticsDenied();
  return {
    ref, form_name: formName, product_id: productId,
    conversion_url: allowed ? window.location.href : window.location.origin + window.location.pathname,
    ...(allowed ? { attribution: getAttribution() } : {}),
  };
}

export function createPassiveRecord(
  ref: string,
  status: "qr_view" | "qr_download" | "wechat_id_copy",
  channel: "whatsapp" | "wechat",
) {
  if (analyticsDenied()) return null;
  const attr = getAttribution();
  return {
    ref, status, channel,
    captured_at: new Date().toISOString(),
    conversion_url: window.location.href,
    whatsapp_location: "floating_contact",
    first: attr.first, last: attr.last, session: attr.session,
  };
}

export function savePassiveRecord(payload: ReturnType<typeof createPassiveRecord>) {
  if (!payload) return;
  const body = JSON.stringify(payload);
  try {
    const blob = new Blob([body], { type: "application/json" });
    const queued = typeof navigator.sendBeacon === "function" && navigator.sendBeacon("/api/whatsapp-ref", blob);
    if (!queued) void fetch("/api/whatsapp-ref", {
      method: "POST", headers: { "content-type": "application/json" },
      body, keepalive: true, credentials: "same-origin",
    }).catch(() => {});
  } catch { /* QR actions must remain usable */ }
}
