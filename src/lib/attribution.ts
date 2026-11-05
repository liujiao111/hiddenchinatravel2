export const TRACKING_KEYS = ["gclid", "gbraid", "wbraid", "msclkid", "fbclid", "utm_source", "utm_medium", "utm_campaign", "utm_id", "utm_term", "utm_content"] as const;
export type TrackingParams = Partial<Record<typeof TRACKING_KEYS[number], string>>;
export type Touch = { source: string; medium: string; source_label: string; landing_page: string; referrer: string; time: string; params: TrackingParams };
export type Attribution = { version: 1; first: Touch; last: Touch; session: Touch; expires: number };
export const ATTRIBUTION_KEY = "hct_attribution_v1";
const SESSION_KEY = "hct_source_session_v1";
const TTL = 90 * 86400_000;
export function cleanTracking(value: unknown, limit = 160) {
  return typeof value === "string" ? value.replace(/[\u0000-\u001f\u007f<>]/g, "").trim().slice(0, limit) : "";
}
export function readTrackingParams(url: URL): TrackingParams {
  return Object.fromEntries(TRACKING_KEYS.flatMap(key => {
    const value = cleanTracking(url.searchParams.get(key));
    return value ? [[key, value]] : [];
  }));
}
export function externalReferrer(raw: string, host: string) {
  try {
    const url = new URL(raw);
    const normalize = (name: string) => name.toLowerCase().replace(/^www\./, "");
    return /^https?:$/.test(url.protocol) && normalize(url.hostname) !== normalize(host) ? url.origin : "";
  } catch { return ""; }
}
export function detectSource(params: TrackingParams, referrer: string) {
  const source = params.utm_source?.toLowerCase() || "";
  const medium = params.utm_medium?.toLowerCase() || "";
  const paid = /^(cpc|ppc|paid|paid_search|paid_social|display|cpm)$/.test(medium);
  if (params.gclid || params.gbraid || params.wbraid || (source === "google" && /^(cpc|ppc|paid|paid_search)$/.test(medium))) return { source: "google", medium: "cpc", source_label: "Google Ads" };
  if (medium === "paid_social" || (["facebook", "instagram", "meta"].includes(source) && paid)) return { source: source || "meta", medium: medium || "paid_social", source_label: "Meta Ads" };
  if (["facebook", "instagram", "meta"].includes(source) && !paid) return { source, medium: medium || "social", source_label: "Organic Social" };
  if (params.msclkid) return { source: "bing", medium: "cpc", source_label: "Microsoft Ads" };
  if (source === "google" && medium === "organic") return { source: "google", medium: "organic", source_label: "Google Organic" };
  if (Object.keys(params).some(key => key.startsWith("utm_"))) return { source: source || "unknown", medium: medium || "unknown", source_label: source && medium ? (paid ? "Paid Campaign" : medium === "organic" ? "Organic Search" : "Campaign") : "Unknown" };
  if (params.fbclid) return { source: "facebook", medium: "social", source_label: "Organic Social" };
  if (referrer) {
    let host = "";
    try { host = new URL(referrer).hostname.toLowerCase(); } catch { return { source: "unknown", medium: "unknown", source_label: "Unknown" }; }
    const engines: [RegExp, string][] = [[/(^|\.)google\.(com|[a-z]{2}|co\.[a-z]{2}|com\.[a-z]{2})$/, "google"], [/(^|\.)bing\.com$/, "bing"], [/(^|\.)search\.yahoo\.[a-z.]+$/, "yahoo"], [/(^|\.)duckduckgo\.com$/, "duckduckgo"], [/(^|\.)baidu\.com$/, "baidu"]];
    const engine = engines.find(([pattern]) => pattern.test(host));
    if (engine) return { source: engine[1], medium: "organic", source_label: engine[1] === "google" ? "Google Organic" : "Organic Search" };
    return { source: host, medium: "referral", source_label: "Referral" };
  }
  return { source: "direct", medium: "none", source_label: "Direct" };
}
export function createTouch(url: URL, rawReferrer: string, now: number): Touch {
  const params = readTrackingParams(url);
  const referrer = externalReferrer(rawReferrer, url.hostname);
  return { ...detectSource(params, referrer), params, landing_page: cleanTracking(url.pathname, 500), referrer, time: new Date(now).toISOString() };
}
export function updateAttribution(previous: Attribution | null, touch: Touch, now: number, newEntry = true): Attribution {
  if (!previous || previous.expires <= now) return { version: 1, first: touch, last: touch, session: touch, expires: now + TTL };
  const valid = Object.keys(touch.params).length > 0 || Boolean(touch.referrer);
  return { ...previous, last: newEntry && valid ? touch : previous.last, session: newEntry ? touch : previous.session };
}
function validTouch(value: unknown): value is Touch {
  if (!value || typeof value !== "object") return false;
  const t = value as Touch;
  return [t.source, t.medium, t.source_label, t.landing_page, t.referrer, t.time].every(v => typeof v === "string" && v.length <= 500) && Boolean(t.params && typeof t.params === "object") && Object.entries(t.params).every(([key, value]) => TRACKING_KEYS.includes(key as typeof TRACKING_KEYS[number]) && typeof value === "string" && value.length <= 160);
}
export function parseAttribution(raw: unknown): Attribution | null {
  try {
    const data = typeof raw === "string" ? JSON.parse(raw) : raw;
    return data?.version === 1 && Number.isFinite(data.expires) && validTouch(data.first) && validTouch(data.last) && validTouch(data.session) ? data : null;
  } catch { return null; }
}
// Reuse host Consent Mode. No events or storage when analytics is explicitly denied.
// No consent UI exists in this checkout; these checks also support future updates.
export function analyticsDenied() {
  if (typeof window === "undefined") return true;
  const win = window as Window & { dataLayer?: ArrayLike<unknown>[]; google_tag_data?: { ics?: { entries?: { analytics_storage?: { update?: boolean; default?: boolean } } } } };
  const entry = win.google_tag_data?.ics?.entries?.analytics_storage;
  let denied = entry?.update === false || (entry?.update === undefined && entry?.default === false);
  for (const item of win.dataLayer || []) {
    if (item?.[0] === "consent" && (item[1] === "default" || item[1] === "update")) {
      const consent = item[2] as { analytics_storage?: string };
      if (consent?.analytics_storage) denied = consent.analytics_storage === "denied";
    }
  }
  return denied;
}
let memory: Attribution | null = null;
export function getAttribution(): Attribution {
  const now = Date.now();
  const url = new URL(window.location.href);
  const touch = createTouch(url, document.referrer, now);
  if (analyticsDenied()) {
    memory = null;
    try { localStorage.removeItem(ATTRIBUTION_KEY); sessionStorage.removeItem(SESSION_KEY); } catch { /* unavailable */ }
    try { document.cookie = `${ATTRIBUTION_KEY}=; Max-Age=0; Path=/; SameSite=Lax`; } catch { /* blocked */ }
    return updateAttribution(null, { ...touch, source: "unknown", medium: "unknown", source_label: "Unknown", params: {}, referrer: "" }, now);
  }
  let previous = memory;
  let stored: Attribution | null = null;
  let readable = false;
  try {
    const cookie = document.cookie.split("; ").find(v => v.startsWith(`${ATTRIBUTION_KEY}=`));
    readable = true;
    stored = parseAttribution(cookie ? decodeURIComponent(cookie.slice(ATTRIBUTION_KEY.length + 1)) : null);
  } catch { /* cookies unavailable; try localStorage independently */ }
  try {
    const local = parseAttribution(localStorage.getItem(ATTRIBUTION_KEY));
    readable = true;
    stored ||= local;
  } catch { /* localStorage unavailable */ }
  if (readable) previous = stored;
  // Deduplicate campaign-bearing reloads and internal navigation. A fresh Direct
  // document may update session context without replacing the last marketing touch.
  let entry = true;
  const fingerprint = JSON.stringify([touch.params, touch.referrer]);
  try {
    const session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
    const active = session && now - session.time < 30 * 60_000;
    const campaign = Object.keys(touch.params).length > 0;
    const external = Boolean(touch.referrer);
    const newDocument = session?.document !== window.performance.timeOrigin;
    const directEntry = newDocument && !document.referrer && !campaign;
    entry = !active || directEntry || ((campaign || external) && fingerprint !== session.fingerprint && (newDocument || campaign));
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ time: now, fingerprint: entry ? fingerprint : session?.fingerprint, document: window.performance.timeOrigin }));
  } catch { entry = !previous || JSON.stringify(previous.last.params) !== JSON.stringify(touch.params) && Object.keys(touch.params).length > 0; }
  memory = updateAttribution(previous, touch, now, entry);
  const serialized = JSON.stringify(memory);
  try { localStorage.setItem(ATTRIBUTION_KEY, serialized); } catch { /* cookie remains */ }
  // Keep comfortably below browser cookie limits, falling back to localStorage.
  const encoded = encodeURIComponent(serialized);
  try {
    if (encoded.length < 3500) document.cookie = `${ATTRIBUTION_KEY}=${encoded}; Max-Age=${Math.max(0, Math.floor((memory.expires - now) / 1000))}; Path=/; SameSite=Lax${url.protocol === "https:" ? "; Secure" : ""}`;
    else document.cookie = `${ATTRIBUTION_KEY}=; Max-Age=0; Path=/; SameSite=Lax`;
  } catch { /* storage blocked; keep in-memory fallback for this document */ }
  return memory;
}
