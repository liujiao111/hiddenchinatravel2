// Functional enquiry context: the page and CTA that led a visitor to /contact.
// Keep this separate from marketing attribution and do not store query strings or PII.
export type ContactOrigin = { page: string; cta: string; target: string; capturedAt: number };

const KEY = "hct_contact_origin_v1";
const MAX_AGE_MS = 30 * 60 * 1000;

export function isContactPage(pathname: string) {
  return /^\/(?:en\/|zh\/)?contact\/?$/.test(pathname);
}

export function clearContactOrigin() {
  try { sessionStorage.removeItem(KEY); } catch { /* storage unavailable */ }
}

export function clearContactOriginWhenAway() {
  if (typeof window !== "undefined" && !isContactPage(window.location.pathname)) clearContactOrigin();
}

export function readContactOrigin(): ContactOrigin | null {
  if (typeof window === "undefined" || !isContactPage(window.location.pathname)) return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<ContactOrigin>;
    if (
      typeof value.page !== "string" ||
      !value.page.startsWith("/") ||
      value.page.startsWith("//") ||
      isContactPage(value.page) ||
      typeof value.cta !== "string" ||
      typeof value.target !== "string" ||
      value.target !== window.location.pathname ||
      typeof value.capturedAt !== "number" ||
      value.capturedAt > Date.now() ||
      Date.now() - value.capturedAt > MAX_AGE_MS
    ) {
      clearContactOrigin();
      return null;
    }
    return { page: value.page, cta: value.cta, target: value.target, capturedAt: value.capturedAt };
  } catch {
    clearContactOrigin();
    return null;
  }
}

export function installContactOriginTracking() {
  function handleClick(event: MouseEvent) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>("a[href]");
    if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
    let target: URL;
    try { target = new URL(link.href, window.location.href); } catch { return; }
    if (target.origin !== window.location.origin) return;

    // A visitor who leaves the contact page should not carry its old origin
    // into a later, unrelated visit.
    if (isContactPage(window.location.pathname) && !isContactPage(target.pathname)) {
      clearContactOrigin();
      return;
    }
    if (!isContactPage(target.pathname) || isContactPage(window.location.pathname)) return;

    const ctaLocation = link.dataset.ctaLocation ||
      link.closest<HTMLElement>("[data-cta-location]")?.dataset.ctaLocation || "";
    const label = link.getAttribute("aria-label") || link.textContent || "link";
    const cta = (ctaLocation ? `${label} [${ctaLocation}]` : label)
      .replace(/[\u0000-\u001f\u007f<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, 100);

    const origin: ContactOrigin = {
      page: window.location.pathname,
      cta: cta || "link",
      target: target.pathname,
      capturedAt: Date.now(),
    };
    try { sessionStorage.setItem(KEY, JSON.stringify(origin)); } catch { /* storage unavailable */ }
  }

  document.addEventListener("click", handleClick, true);
  return () => document.removeEventListener("click", handleClick, true);
}
