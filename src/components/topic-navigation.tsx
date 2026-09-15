import Link from "next/link";

const topics = [
  ["Essentials", "/china-travel-essentials"],
  ["Payments", "/payments-in-china"],
  ["Internet", "/internet-in-china"],
  ["Maps", "/maps-navigation-in-china"],
  ["Transport", "/transport-in-china"],
  ["Hotels", "/hotels-in-china"],
  ["Tickets", "/attraction-tickets-in-china"],
];

export function TopicNavigation({ active }: { active?: string }) {
  return <nav className="topic-nav" aria-label="China travel guide topics">
    <div className="shell topic-nav-inner">
      {topics.map(([label, href]) => <Link key={href} href={href} className={active?.toLowerCase().includes(label.toLowerCase()) ? "active" : ""}>{label}</Link>)}
    </div>
  </nav>;
}
