import Link from "next/link";
import { brandIdentity } from "@/lib/booking-terms";
import { siteConfig } from "@/lib/site-config";

const whatsapp = `https://wa.me/${siteConfig.whatsappNumber}?text=Hi%2C%20I%27d%20like%20help%20planning%20my%20China%20trip`;

export function ContentCta() {
  return <section className="content-cta"><div><p>PLANNING A TRIP TO YUNNAN?</p><h2>Travel China at your own pace.</h2><span>Dates, group size and a budget are enough for a route sketch and a price range.</span><a className="button button-light" href="#ask-joy">Start Planning My Journey</a></div></section>;
}

export function ContentFooter() {
  return (
    <footer className="footer">
      <div className="shell footer-grid">
        <section className="footer-brand" aria-labelledby="footer-brand-title">
          <h2 id="footer-brand-title">Hidden China Travel</h2>
          <p className="footer-tagline">China, at Your Pace.</p>
          <p>Thoughtfully designed journeys, practical guidance, and local insight for travelers exploring China.</p>
          <p className="footer-origin">Born in Yunnan. Shaped by experiences abroad.</p>
          <p className="footer-origin">{brandIdentity.footer}</p>
          <p className="footer-origin">{brandIdentity.address}</p>
          <p className="footer-origin"><a href={brandIdentity.registryHref} target="_blank" rel="noopener noreferrer">Look up the company on gsxt.gov.cn</a></p>
          <nav className="footer-social" aria-label="Social media">
            <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zm8 2H8a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3zm-4 3.2A4.8 4.8 0 1 1 7.2 13 4.8 4.8 0 0 1 12 8.2zm0 2A2.8 2.8 0 1 0 14.8 13 2.8 2.8 0 0 0 12 10.2zM17.35 6.4a1 1 0 1 1-1 1 1 1 0 0 1 1-1z"/></svg>
            </a>
            <a href={siteConfig.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.2 3h3.05c.22 2.02 1.54 3.5 3.55 3.72v3.02c-1.2.12-2.32-.2-3.45-.86v6.67c0 4.7-5.2 6.2-8.18 3.18A4.86 4.86 0 0 1 10.4 9.4v3.2a1.82 1.82 0 1 0 1.82 1.82V3z"/></svg>
            </a>
          </nav>
        </section>

        <nav className="footer-nav" aria-label="Journeys">
          <h3>Journeys</h3>
          <Link href="/journeys/kunming-dali-shaxi-lijiang-6-days">First Encounter Yunnan</Link>
          <Link href="/journeys/kunming-dali-lijiang-shangri-la-private-tour">The Essence of Yunnan</Link>
          <Link href="/journeys">Yunnan Journeys</Link>
          <Link href="/custom-china-tour">Tailor-Made Yunnan</Link>
        </nav>

        <nav className="footer-nav footer-resources" aria-label="Resources">
          <h3>Resources</h3>
          <Link href="/survival-kit">China Survival Kit</Link>
          <div className="footer-guide-group">
            <Link className="footer-guide-title" href="/china-travel-essentials">Travel Guides</Link>
            <div className="footer-topic-links" aria-label="Travel guides by destination">
              <Link href="/china-destinations/yunnan">Yunnan</Link>
              <Link href="/dali-travel-guide">Dali</Link>
              <Link href="/lijiang-travel-guide">Lijiang</Link>
              <Link href="/kunming-travel-guide">Kunming</Link>
              <Link className="footer-explore-more" href="/china-destinations/yunnan">Explore more →</Link>
            </div>
          </div>
          <Link href="/payments-in-china">Payments</Link>
          <Link href="/china-currency-converter">Currency Converter</Link>
          <Link href="/china-visa-checker">Visa Checker</Link>
          <Link href="/internet-in-china">Internet &amp; eSIM</Link>
          <Link href="/transport-in-china">Transportation</Link>
          <Link href="/attraction-tickets-in-china">Booking</Link>
        </nav>

        <nav className="footer-nav" aria-label="Company">
          <h3>Company</h3>
          <Link href="/about-us">About Joy Liu</Link>
          <Link href="/traveler-stories">Traveler stories</Link>
          <Link href="/licensed-operator">Licensed operator</Link>
          <Link href="/booking">Booking &amp; service</Link>
          <Link href="/contact">Contact</Link>
          <Link href={whatsapp}>WhatsApp</Link>
        </nav>
      </div>

      <div className="shell footer-cta">
        <p>Planning a trip to China?</p>
        <Link href={whatsapp}>Chat with Joy on WhatsApp <span aria-hidden="true">→</span></Link>
      </div>

      <div className="shell footer-bottom">
        <span>© 2026 Hidden China Travel</span>
        <nav className="footer-legal" aria-label="Legal and company links">
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/booking">Booking &amp; service</Link>
          <Link href="/terms-of-service">Terms of Use</Link>
          <Link href="/affiliate-disclosure">Affiliate Disclosure</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/about-us">About</Link>
        </nav>
      </div>
    </footer>
  );
}

