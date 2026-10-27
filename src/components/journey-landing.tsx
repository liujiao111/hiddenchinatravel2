import Image from "next/image";
import Link from "next/link";
import { HashLink } from "@/components/hash-link";
import { StarRating } from "@/components/star-rating";

type Action = { href: string; label: string };

export function JourneyHero({ title, name, image, imageAlt, eyebrow, description, primary, secondary, note, bounds, rating, price, includes, chat }: {
  title: string; name?: string; image: string; imageAlt: string; eyebrow: string; description: string;
  primary: Action; secondary: Action; note: string;
  bounds?: string;
  rating?: { href: string; label: string; value: number };
  price?: string;
  includes?: string[];
  chat?: Action;
}) {
  return <header className="journey-hero">
    <Image src={encodeURI(image)} alt={imageAlt} fill priority unoptimized sizes="100vw" />
    <div className="journey-hero-shade" />
    <nav className="breadcrumbs journey-breadcrumbs shell" aria-label="Breadcrumb"><Link href="/">Home</Link><span>›</span><Link href="/journeys">Journeys</Link><span>›</span><span>{name || title}</span></nav>
    <div className="journey-hero-copy shell"><div><p>{eyebrow}</p><h1>{title}</h1><span>{description}</span>{price ? <b className="journey-hero-price">{price}</b> : null}{includes?.length ? <ul className="journey-hero-includes">{includes.map((item) => <li key={item}>{item}</li>)}</ul> : null}{bounds ? <ul className="journey-hero-bounds">{bounds.split(" · ").map((item) => <li key={item}>{item}</li>)}</ul> : null}{rating ? <a className="journey-hero-rating" href={rating.href}><StarRating value={rating.value} label={`Overall guest rating: ${rating.value.toFixed(1)} out of 5 stars`} /><span>{rating.label}</span></a> : null}<div className="journey-hero-actions"><HashLink id="hero-quote" className="button journey-primary-action" href={primary.href}>{primary.label}</HashLink><HashLink className="journey-text-action" href={secondary.href}>{secondary.label} <b>↓</b></HashLink></div>{chat ? (chat.href.startsWith("#") ? <HashLink className="journey-hero-whatsapp" href={chat.href}>{chat.label}</HashLink> : <Link className="journey-hero-whatsapp" href={chat.href}>{chat.label}</Link>) : null}<small>{note}</small></div></div>
  </header>;
}

export function JourneySectionNav({ links, action }: { links: Action[]; action: Action }) {
  return <nav className="journey-anchor-nav journey-anchor-nav-quiet" aria-label="Jump to a section"><div className="shell"><span>Jump to:</span><div>{links.map(link => link.href.startsWith("#") ? <HashLink href={link.href} key={link.href}>{link.label}</HashLink> : <Link href={link.href} key={link.href}>{link.label}</Link>)}</div><HashLink className="journey-nav-contact" href={action.href}>{action.label} →</HashLink></div></nav>;
}

export type FactIconName = "party" | "person" | "licence" | "star" | "calendar" | "route" | "meal" | "price" | "pin" | "note";

const factIconPaths: Record<FactIconName, string[]> = {
  party: [
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
    "M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
    "M22 21v-2a4 4 0 0 0-3-3.87",
    "M16 3.13a4 4 0 0 1 0 7.75",
  ],
  person: [
    "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2",
    "M12 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  ],
  licence: [
    "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
    "M14 2v6h6",
    "M16 13H8",
    "M16 17H8",
    "M10 9H8",
  ],
  star: ["m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"],
  calendar: [
    "M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z",
    "M16 2v4",
    "M8 2v4",
    "M3 10h18",
  ],
  route: [
    "M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2",
    "M9 17h6",
    "M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
    "M17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  ],
  meal: [
    "M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2",
    "M7 2v20",
    "M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7",
  ],
  price: [
    "M12 2v20",
    "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  ],
  pin: [
    "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z",
    "M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  ],
  note: [
    "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
    "M14 2v6h6",
    "M16 13H8",
    "M16 17H8",
  ],
};

function FactIcon({ name }: { name: FactIconName }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true">{factIconPaths[name].map((d) => <path key={d} d={d} />)}</svg>;
}

export type FactCard = { title: string; lines: string[]; icon: FactIconName };

export function JourneyFactCards({ id, title, cards, action, className = "" }: {
  id: string; title: string; cards: FactCard[]; action?: Action; className?: string;
}) {
  const headingId = `${id}-title`;
  return <section className={`journey-fact-cards ${className}`.trim()} id={id} aria-labelledby={headingId}>
    <div className="shell">
      <h2 id={headingId}>{title}</h2>
      <ul className="journey-fact-grid">
        {cards.map((card) => <li key={card.title}>
          <span className="journey-fact-icon"><FactIcon name={card.icon} /></span>
          <h3>{card.title}</h3>
          <ul>{card.lines.map((line) => <li key={line}>{line}</li>)}</ul>
        </li>)}
      </ul>
      {action ? <HashLink href={action.href}>{action.label} →</HashLink> : null}
    </div>
  </section>;
}

function glanceIcon(label: string): FactIconName {
  const text = label.toLowerCase();
  if (text.includes("day") || text.includes("night")) return "calendar";
  if (text.includes("meal")) return "meal";
  if (text.includes("price") || text.includes("quote")) return "price";
  if (text.includes("where")) return "pin";
  if (text.includes("journey") || text.includes("how")) return "route";
  return "note";
}

function cardTitle(label: string) {
  const lower = label.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

export function JourneyOverview({ title, items, action }: {
  title: string; description: string; items: { label: string; value: string }[]; action: Action;
}) {
  const cards = items.map((item) => ({
    title: cardTitle(item.label),
    icon: glanceIcon(item.label),
    lines: item.value.split(" · ").map((line) => line.trim()).filter(Boolean),
  }));
  return <JourneyFactCards id="glance" className="journey-overview" title={title} cards={cards} action={action} />;
}
