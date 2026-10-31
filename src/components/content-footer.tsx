"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { licensedOperator } from "@/lib/journey-trust";
import { siteConfig } from "@/lib/site-config";

const whatsapp = `https://wa.me/${siteConfig.whatsappNumber}?text=Hi%2C%20I%27d%20like%20help%20planning%20my%20China%20trip`;

export function ContentCta() {
  return <section className="content-cta"><div><p>PLANNING A TRIP TO YUNNAN?</p><h2>Travel China at your own pace.</h2><span>Dates, group size and a budget are enough for a route sketch and a price range.</span><a className="button button-light" href="#ask-joy">Start Planning My Journey</a></div></section>;
}

export function ContentFooter() {
  const t = useTranslations("footer");
  const fill = (s: string) =>
    s.replaceAll("{agencyEn}", licensedOperator.nameEn)
      .replaceAll("{agencyZh}", licensedOperator.nameZh)
      .replaceAll("{permit}", licensedOperator.permitNumber)
      .replaceAll("{credit}", licensedOperator.unifiedSocialCreditCode)
      .replaceAll("{addressEn}", licensedOperator.addressEn)
      .replaceAll("{addressZh}", licensedOperator.addressZh);

  return (
    <footer className="footer">
      <div className="shell footer-grid">
        <section className="footer-brand" aria-labelledby="footer-brand-title">
          <h2 id="footer-brand-title">Hidden China Travel</h2>
          <p className="footer-tagline">{t("tagline")}</p>
          <p>{t("intro")}</p>
          <p className="footer-origin">{t("origin")}</p>
          <p className="footer-origin">{fill(t("companyLine"))}</p>
          <p className="footer-origin">{fill(t("address"))}</p>
          <p className="footer-origin"><a href={licensedOperator.creditRegistryUrl} target="_blank" rel="noopener noreferrer">{t("registry")}</a></p>
          <nav className="footer-social" aria-label="Social media">
            <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zm8 2H8a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3zm-4 3.2A4.8 4.8 0 1 1 7.2 13 4.8 4.8 0 0 1 12 8.2zm0 2A2.8 2.8 0 1 0 14.8 13 2.8 2.8 0 0 0 12 10.2zM17.35 6.4a1 1 0 1 1-1 1 1 1 0 0 1 1-1z"/></svg>
            </a>
            <a href={siteConfig.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.2 3h3.05c.22 2.02 1.54 3.5 3.55 3.72v3.02c-1.2.12-2.32-.2-3.45-.86v6.67c0 4.7-5.2 6.2-8.18 3.18A4.86 4.86 0 0 1 10.4 9.4v3.2a1.82 1.82 0 1 0 1.82 1.82V3z"/></svg>
            </a>
          </nav>
        </section>

        <nav className="footer-nav" aria-label={t("journeysHeading")}>
          <h3>{t("journeysHeading")}</h3>
          <Link href="/journeys/kunming-dali-shaxi-lijiang-6-days">{t("journeyFirst")}</Link>
          <Link href="/journeys/kunming-dali-lijiang-shangri-la-private-tour">{t("journeyEssence")}</Link>
          <Link href="/journeys">{t("journeyAll")}</Link>
          <Link href="/custom-china-tour">{t("journeyCustom")}</Link>
        </nav>

        <nav className="footer-nav footer-resources" aria-label={t("resourcesHeading")}>
          <h3>{t("resourcesHeading")}</h3>
          <Link href="/survival-kit">{t("survivalKit")}</Link>
          <div className="footer-guide-group">
            <Link className="footer-guide-title" href="/china-travel-essentials">{t("travelGuides")}</Link>
            <div className="footer-topic-links" aria-label="Travel guides by destination">
              <Link href="/china-destinations/yunnan">{t("destYunnan")}</Link>
              <Link href="/dali-travel-guide">{t("destDali")}</Link>
              <Link href="/lijiang-travel-guide">{t("destLijiang")}</Link>
              <Link href="/kunming-travel-guide">{t("destKunming")}</Link>
              <Link className="footer-explore-more" href="/china-destinations/yunnan">{t("exploreMore")}</Link>
            </div>
          </div>
          <Link href="/payments-in-china">{t("payments")}</Link>
          <Link href="/china-currency-converter">{t("currencyConverter")}</Link>
          <Link href="/china-visa-checker">{t("visaChecker")}</Link>
          <Link href="/internet-in-china">{t("internet")}</Link>
          <Link href="/transport-in-china">{t("transport")}</Link>
          <Link href="/attraction-tickets-in-china">{t("booking")}</Link>
        </nav>

        <nav className="footer-nav" aria-label={t("companyHeading")}>
          <h3>{t("companyHeading")}</h3>
          <Link href="/about-us">{t("about")}</Link>
          <Link href="/traveler-stories">{t("stories")}</Link>
          <Link href="/licensed-operator">{t("licensed")}</Link>
          <Link href="/booking">{t("bookingService")}</Link>
          <Link href="/contact">{t("contact")}</Link>
          <Link href={whatsapp}>WhatsApp</Link>
        </nav>
      </div>

      <div className="shell footer-cta">
        <p>{t("ctaText")}</p>
        <Link href={whatsapp}>{t("ctaLink")} <span aria-hidden="true">→</span></Link>
      </div>

      <div className="shell footer-bottom">
        <span>{t("copyright")}</span>
        <nav className="footer-legal" aria-label="Legal and company links">
          <Link href="/privacy-policy">{t("privacy")}</Link>
          <Link href="/booking">{t("bookingService")}</Link>
          <Link href="/terms-of-service">{t("terms")}</Link>
          <Link href="/affiliate-disclosure">{t("affiliate")}</Link>
          <Link href="/contact">{t("contact")}</Link>
          <Link href="/about-us">{t("aboutShort")}</Link>
        </nav>
      </div>
    </footer>
  );
}
