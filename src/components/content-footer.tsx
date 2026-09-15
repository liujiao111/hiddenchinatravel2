import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const whatsapp = `https://wa.me/${siteConfig.whatsappNumber}?text=Hi%2C%20I%27d%20like%20help%20planning%20my%20China%20trip`;

export function ContentCta() {
  return <section className="content-cta"><div><p>PLANNING A TRIP TO YUNNAN?</p><h2>Travel China at your own pace.</h2><span>Tell Joy your dates, interests and preferred rhythm. We’ll help make the unfamiliar parts easier.</span><Link className="button button-light" href={whatsapp}>START ON WHATSAPP</Link></div></section>;
}

export function ContentFooter() {
  return <footer className="footer"><div className="shell footer-grid"><div className="footer-brand"><span className="brand-mark">H</span><h2>Hidden China Travel</h2><p>Practical guidance, local insight and personalized journeys across Yunnan and beyond.</p></div><div><h3>Explore</h3><Link href="/china-itinerary-planning">Planning</Link><Link href="/dali-travel-guide">Dali</Link><Link href="/about-us">About us</Link></div><div><h3>Prepare</h3><Link href="/payments-in-china">Payments</Link><Link href="/internet-in-china">Internet</Link><Link href="/transport-in-china">Transport</Link></div><div><h3>Get help</h3><Link href={whatsapp}>WhatsApp Joy</Link><Link href="/china-travel-essentials">Travel essentials</Link><Link href="/attraction-tickets-in-china">Tickets</Link></div></div><div className="shell footer-bottom"><span>© 2026 Hidden China Travel</span><span>Independent guidance · Local connections · Yunnan first</span></div></footer>;
}
