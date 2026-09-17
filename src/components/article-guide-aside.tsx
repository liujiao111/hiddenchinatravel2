import Link from "next/link";

const hubs = [
  { terms: ["payment"], label: "Payments in China", href: "/payments-in-china" },
  { terms: ["internet", "vpn", "sim"], label: "Internet in China", href: "/internet-in-china" },
  { terms: ["maps", "navigation"], label: "Maps & navigation", href: "/maps-navigation-in-china" },
  { terms: ["transport", "train"], label: "Transport in China", href: "/transport-in-china" },
  { terms: ["hotel"], label: "Hotels in China", href: "/hotels-in-china" },
  { terms: ["attraction", "ticket"], label: "Attraction tickets", href: "/attraction-tickets-in-china" },
  { terms: ["food", "delivery"], label: "Food & delivery", href: "/food-delivery-in-china" },
  { terms: ["itinerary", "planning"], label: "Itinerary planning", href: "/china-itinerary-planning" },
];

export function ArticleGuideAside({ section }: { section?: string }) {
  const normalized = section?.toLowerCase() || "";
  const hub = hubs.find(({ terms }) => terms.some(term => normalized.includes(term))) || {
    label: "China travel essentials", href: "/china-travel-essentials",
  };

  return <aside className="article-aside" aria-label="Plan your China trip">
    <div>
      <p>PREPARE FOR CHINA</p>
      <h2>Everything to sort before you go.</h2>
      <span>Follow one checklist for entry, bookings, internet, payments and arrival.</span>
      <Link className="article-aside-primary" href="/survival-kit">OPEN THE SURVIVAL KIT <span aria-hidden="true">→</span></Link>
      <div className="article-aside-related"><span>READ MORE ON THIS TOPIC</span><Link href={hub.href}>{hub.label} →</Link></div>
    </div>
  </aside>;
}
