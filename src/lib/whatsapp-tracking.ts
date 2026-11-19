import { trackEvent } from "./analytics";
import { analyticsDenied, getAttribution } from "./attribution";
import { buildWhatsAppUrl, generateLeadId, isConsultationWhatsApp, withWhatsAppRef } from "./whatsapp";

export function whatsappLocation(link: HTMLAnchorElement) {
  if (link.dataset.ctaLocation === "floating_whatsapp") return "floating_button";
  if (link.closest(".site-header")) return "header";
  if (link.closest("footer")) return "footer";
  if (link.closest(".journey-mobile-cta, .article-mobile-ask")) return "mobile_button";
  if (link.closest(".journey-hero, .home-hero, .hero")) return "hero_section";
  const path = window.location.pathname.replace(/^\/zh(?=\/|$)/, "");
  if (path === "/contact") return "contact_page";
  if (path.startsWith("/journeys/")) return "tour_page";
  return "page_content";
}

// Keep the full on-site URL (including UTM and ad-click parameters) in the
// visitor-approved WhatsApp message, but never echo obvious personal/secret
// query fields into a third-party chat.
function safeSourceUrl(raw: string) {
  try {
    const url = new URL(raw);
    if (!["http:", "https:"].includes(url.protocol)) return "";
    url.username = "";
    url.password = "";
    for (const key of Array.from(url.searchParams.keys())) {
      if (/(^|[_-])(email|phone|mobile|password|passwd|token|secret|api[_-]?key|auth|session|address|name)([_-]|$)/i.test(key))
        url.searchParams.set(key, "[redacted]");
    }
    return url.toString().slice(0, 2400);
  } catch {
    return "";
  }
}

export function installWhatsAppTracking() {
  const recent = new WeakMap<HTMLAnchorElement, number>();
  function normalize(link: HTMLAnchorElement) {
    if (isConsultationWhatsApp(link.href)) {
      if (!new URL(link.href).searchParams.get("text")) link.href = buildWhatsAppUrl(undefined, window.location.pathname.startsWith("/zh") ? "zh" : "en");
    }
  }
  document.querySelectorAll<HTMLAnchorElement>("a[href]").forEach(normalize);
  const observer = new MutationObserver(records => {
    for (const record of records) for (const node of record.addedNodes) {
      if (!(node instanceof Element)) continue;
      if (node.matches("a[href]")) normalize(node as HTMLAnchorElement);
      node.querySelectorAll<HTMLAnchorElement>("a[href]").forEach(normalize);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
  function click(event: MouseEvent) {
    if (event.type === "auxclick" && event.button !== 1) return;
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>("a[href]");
    if (!link || !isConsultationWhatsApp(link.href)) return;
    const now = Date.now();
    if (now - (recent.get(link) || 0) < 1500) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    recent.set(link, now);
    const leadId = generateLeadId();
    const attribution = getAttribution();
    const denied = analyticsDenied();
    const landing = new URL(attribution.first.landing_page || "/", window.location.origin);
    for (const [key, value] of Object.entries(attribution.first.params)) {
      if (value) landing.searchParams.set(key, value);
    }
    const source = denied ? undefined : {
      sourcePageUrl: safeSourceUrl(window.location.href),
      channel: attribution.last.source_label,
      firstLandingUrl: safeSourceUrl(landing.href),
      firstChannel: attribution.first.source_label,
    };
    // Update synchronously and let the native anchor open with its original target.
    // No window.open, awaited request, extra screen or popup-blocker dependency.
    link.href = withWhatsAppRef(link.href, leadId, window.location.pathname.startsWith("/zh") ? "zh" : "en", source);
    if (denied) return;
    const conversionPage = window.location.pathname.slice(0, 500);
    const location = whatsappLocation(link);
    const payload = {
      lead_id: leadId, event_id: leadId, source_label: attribution.last.source_label,
      first_source: attribution.first.source, first_medium: attribution.first.medium,
      last_source: attribution.last.source, last_medium: attribution.last.medium,
      campaign: attribution.last.params.utm_campaign || "", conversion_page: conversionPage,
      whatsapp_location: location, cta_location: link.dataset.ctaLocation || location,
      page_path: conversionPage, lead_type: "whatsapp_click",
    };
    trackEvent("whatsapp_click", payload);
    // WhatsApp clicks are analytics events, not confirmed enquiries.\n    // Do not send an automatic inbox email for an unconfirmed click.
  }
  document.addEventListener("click", click, true);
  document.addEventListener("auxclick", click, true);
  return () => {
    observer.disconnect();
    document.removeEventListener("click", click, true);
    document.removeEventListener("auxclick", click, true);
  };
}
