import Image from "next/image";
import Link from "next/link";

const destinations = [
  { name: "Dali", image: "https://hiddenchinatravel.com/assets/blog/where-to-stay-in-dali/caicun-ecological-corridor.webp", note: "Lake villages & Bai culture" },
  { name: "Shaxi", image: "https://hiddenchinatravel.com/assets/blog/dali-hidden-gems-off-the-beaten-path/cover-shaxi.webp", note: "Tea Horse Road town" },
  { name: "Xizhou", image: "https://hiddenchinatravel.com/assets/blog/dali-hidden-gems-off-the-beaten-path/xizhou-bai-courtyard.webp", note: "Courtyards & local craft" },
  { name: "Weishan", image: "https://hiddenchinatravel.com/assets/blog/dali-hidden-gems-off-the-beaten-path/weishan-xinggong-tower.webp", note: "A quieter ancient town" },
];

const journeys = [
  { eyebrow: "Yunnan", title: "Dali at an unhurried pace", meta: "5 days · private journey", image: "https://hiddenchinatravel.com/assets/blog/where-to-stay-in-dali/panshan-tinghai-erhai-balcony.webp" },
  { eyebrow: "Yunnan", title: "Dali, Shaxi & the old Tea Horse Road", meta: "7 days · private journey", image: "https://hiddenchinatravel.com/assets/blog/dali-hidden-gems-off-the-beaten-path/shaxi-river-goats.webp" },
  { eyebrow: "Yunnan", title: "Villages, makers & hidden courtyards", meta: "6 days · private journey", image: "https://hiddenchinatravel.com/assets/blog/dali-hidden-gems-off-the-beaten-path/zhoucheng-bai-tie-dye.webp" },
];

const reasons = [
  ["◇", "A journey shaped around you", "Your interests, comfort and preferred pace come before a fixed sightseeing checklist."],
  ["○", "One local point of contact", "We connect you with trusted local drivers and guides, and keep the planning clear."],
  ["△", "Useful support before arrival", "From payments to maps, our practical guides help you arrive ready for China."],
  ["24", "Help while you travel", "Local support matters most when plans change or something feels unfamiliar."],
];

const whatsapp = "https://wa.me/8618880441791?text=Hi%2C%20I%27d%20like%20help%20planning%20a%20Yunnan%20journey";

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <div className="topbar shell">
          <Link href="/" className="brand" aria-label="Hidden China Travel home">
            <span className="brand-mark">H</span>
            <span><b>Hidden China</b><small>TRAVEL</small></span>
          </Link>
          <div className="header-contact">
            <span>Local insight for independent-minded travelers</span>
            <Link className="button button-blue" href={whatsapp}>PLAN MY JOURNEY</Link>
          </div>
        </div>
        <nav className="nav-row" aria-label="Main navigation">
          <div className="shell nav-inner">
            <div className="nav-links">
              <Link href="#destinations">DESTINATIONS⌄</Link><Link href="#journeys">JOURNEYS⌄</Link><Link href="#guides">TRAVEL GUIDES⌄</Link><Link href="/about-us">ABOUT US</Link><Link href={whatsapp}>LOCAL SUPPORT</Link>
            </div>
            <label className="search-box"><span className="sr-only">Search</span><input placeholder="Search China guides..." /><b>⌕</b></label>
          </div>
        </nav>
      </header>

      <section className="hero">
        <Image src="https://hiddenchinatravel.com/assets/blog/dali-hidden-gems-off-the-beaten-path/cover-shaxi.webp" alt="A historic street in Shaxi, Yunnan" fill priority sizes="100vw" />
        <div className="hero-shade" />
        <div className="hero-copy"><p>CHINA, AT YOUR PACE</p><h1>Discover the China<br />most visitors miss.</h1><Link href="#journeys" className="button button-light">START YOUR JOURNEY</Link></div>
      </section>

      <section className="intro section-sand" id="guides">
        <div className="narrow"><p className="kicker">TRAVEL DEEPER, WORRY LESS</p><h2>We make China feel possible</h2><p>Great trips are not built by rushing between famous sights. They begin with understanding how you want to travel—then adding the right places, people and practical support around you.</p><Link href={whatsapp} className="button button-green">TELL US ABOUT YOUR TRIP</Link></div>
      </section>

      <section className="section" id="destinations">
        <div className="shell">
          <div className="section-heading"><p className="kicker">BEGIN WITH A PLACE</p><h2>Where in Yunnan are you drawn to?</h2><div className="tabs"><span className="active">Destinations</span><span>Travel styles</span><span>Practical guides</span></div></div>
          <div className="destination-grid">
            {destinations.map((item) => <article className="image-card" key={item.name}><Image src={item.image} alt={`${item.name}, Yunnan`} fill sizes="(max-width: 700px) 100vw, 25vw" /><div className="card-shade" /><div className="image-card-copy"><p>{item.note}</p><h3>{item.name}</h3><Link href="#journeys" className="button button-light">EXPLORE {item.name.toUpperCase()}</Link></div></article>)}
          </div>
          <div className="center"><Link href="#journeys" className="button button-green">VIEW YUNNAN JOURNEYS</Link></div>
        </div>
      </section>

      <section className="section process section-sand">
        <div className="narrow"><p className="kicker">DESIGNED AROUND YOU</p><h2>Personal without being complicated</h2><p>Tell us what feels exciting and what feels difficult. We help turn that into a realistic route, connect you with the right local team, and stay available when you need support.</p></div>
        <div className="shell process-grid"><div><i>1</i><h3>We listen first</h3><p>Your pace, priorities and concerns shape the brief.</p></div><div><i>2</i><h3>We shape the route</h3><p>Flexible days and meaningful experiences, not a checklist.</p></div><div><i>3</i><h3>Local experts deliver it</h3><p>Trusted drivers and guides handle the journey on the ground.</p></div></div>
      </section>

      <section className="section journeys" id="journeys">
        <div className="shell journey-layout">
          <div className="journey-intro"><p className="kicker">STARTING POINTS, NOT PACKAGES</p><h2>Journeys to make your own</h2><p>Use these routes as inspiration. Each can be slowed down, shortened or reshaped around your interests.</p><Link href={whatsapp}>Ask for a route recommendation →</Link></div>
          <div className="journey-cards">{journeys.map((item) => <article className="journey-card" key={item.title}><Image src={item.image} alt={item.title} fill sizes="(max-width: 900px) 90vw, 27vw" /><div className="card-shade" /><div className="journey-copy"><span>{item.eyebrow}</span><h3>{item.title}</h3><b>{item.meta}</b><Link href={whatsapp} className="button button-light">VIEW THIS JOURNEY</Link></div></article>)}</div>
        </div>
      </section>

      <section className="story section-sand">
        <div className="shell story-grid"><div><p className="kicker">THE HIDDEN CHINA APPROACH</p><h2>Small moments make the journey</h2></div><blockquote>“The best day is often the one with room for a village market, a long lunch, or a conversation you never planned.”<cite>Our approach to slower travel</cite></blockquote><div className="story-note"><b>No invented experiences.</b><p>Our guides separate verified facts, local recommendations and genuine traveler feedback—so you know what you can rely on.</p></div></div>
      </section>

      <section className="cta-band"><Image src="https://hiddenchinatravel.com/assets/blog/dali-hidden-gems-off-the-beaten-path/shaxi-street-corner.webp" alt="A quiet street corner in Shaxi" fill sizes="100vw" /><div className="hero-shade" /><div><p className="kicker">YOUR TRIP CAN START WITH ONE MESSAGE</p><h2>Not sure where to begin?</h2><p>Send us your dates, travel style and a rough idea of what you want to see.</p><Link href={whatsapp} className="button button-blue">CHAT ON WHATSAPP</Link></div></section>

      <section className="section why" id="why-us"><div className="shell"><div className="section-heading light"><p className="kicker">TRAVEL WITH CONFIDENCE</p><h2>Why journey with us?</h2></div><div className="reason-grid">{reasons.map(([icon,title,text]) => <article key={title}><i>{icon}</i><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

      <section className="newsletter"><div className="shell newsletter-inner"><div><p className="kicker">FREE DALI LOCAL GUIDE</p><h2>Practical ideas for your inbox</h2><p>Get our Dali guide and occasional, useful China travel advice.</p></div><form><label><span className="sr-only">First name</span><input type="text" placeholder="First name" /></label><label><span className="sr-only">Email</span><input type="email" placeholder="Email address" /></label><button type="button" className="button button-green">GET THE GUIDE</button></form></div></section>

      <footer className="footer"><div className="shell footer-grid"><div className="footer-brand"><span className="brand-mark">H</span><h2>Hidden China Travel</h2><p>Travel guides, local expertise, and personalized journeys across Yunnan and beyond.</p></div><div><h3>Explore</h3><Link href="#destinations">Yunnan</Link><Link href="#journeys">Journey ideas</Link><Link href="#guides">China travel guides</Link></div><div><h3>Plan</h3><Link href={whatsapp}>Talk to us</Link><Link href="#why-us">How it works</Link><Link href="/china-visa-checker">China visa checker</Link></div><div><h3>Practical</h3><Link href="/payments-in-china">Payments</Link><Link href="/internet-in-china">Internet & eSIM</Link><Link href="/transport-in-china">Getting around</Link></div></div><div className="shell footer-bottom"><span>© 2026 Hidden China Travel</span><span>Independent guidance · Local connections · Yunnan first</span></div></footer>
    </main>
  );
}
