import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const whatsapp = `https://wa.me/${siteConfig.whatsappNumber}?text=Hi%2C%20I%27d%20like%20help%20planning%20my%20China%20trip`;

export function ContentCta() {
  return <section className="content-cta"><div><p>PLANNING A TRIP TO YUNNAN?</p><h2>Travel China at your own pace.</h2><span>Tell Joy your dates, interests and preferred rhythm. We’ll help make the unfamiliar parts easier.</span><Link className="button button-light" href={whatsapp}>START ON WHATSAPP</Link></div></section>;
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
        </section>

        <nav className="footer-nav" aria-label="Journeys">
          <h3>Journeys</h3>
          <Link href="/journeys/kunming-dali-shaxi-lijiang-6-days">Dali, Shaxi &amp; Lijiang Private Journey</Link>
          <Link href="/journeys">Yunnan Journeys</Link>
          <Link href="/journeys">Private Travel</Link>
          <span className="footer-coming-soon">Coming Soon</span>
        </nav>

        <nav className="footer-nav footer-resources" aria-label="Resources">
          <h3>Resources</h3>
          <Link href="/survival-kit">China Survival Kit</Link>
          <div className="footer-guide-group">
            <Link className="footer-guide-title" href="/search">Travel Guides</Link>
            <div className="footer-topic-links" aria-label="Travel guides by destination">
              <Link href="/china-destinations/yunnan">Yunnan</Link>
              <Link href="/dali-travel-guide">Dali</Link>
              <Link href="/search?q=Lijiang">Lijiang</Link>
              <Link href="/search?q=Kunming">Kunming</Link>
              <Link className="footer-explore-more" href="/search">Explore more →</Link>
            </div>
          </div>
          <Link href="/payments-in-china">Payments</Link>
          <Link href="/internet-in-china">Internet &amp; eSIM</Link>
          <Link href="/transport-in-china">Transportation</Link>
          <Link href="/attraction-tickets-in-china">Booking</Link>
        </nav>

        <nav className="footer-nav" aria-label="Company">
          <h3>Company</h3>
          <Link href="/about-us">About Joy Liu</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/faq">FAQ</Link>
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
          <Link href="/terms-of-service">Terms of Use</Link>
          <Link href="/affiliate-disclosure">Affiliate Disclosure</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/about-us">About</Link>
        </nav>
      </div>
    </footer>
  );
}
