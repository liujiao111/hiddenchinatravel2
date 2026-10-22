import Image from "next/image";
import Link from "next/link";
import { StarRating } from "@/components/star-rating";

type Action = { href: string; label: string };

export function JourneyHero({ title, image, imageAlt, eyebrow, description, primary, secondary, note, rating, price, includes, chat }: {
  title: string; image: string; imageAlt: string; eyebrow: string; description: string;
  primary: Action; secondary: Action; note: string;
  rating?: { href: string; label: string; value: number };
  price?: string;
  includes?: string[];
  chat?: Action;
}) {
  return <header className="journey-hero">
    <Image src={encodeURI(image)} alt={imageAlt} fill priority unoptimized sizes="100vw" />
    <div className="journey-hero-shade" />
    <nav className="breadcrumbs journey-breadcrumbs shell" aria-label="Breadcrumb"><Link href="/">Home</Link><span>›</span><Link href="/journeys">Journeys</Link><span>›</span><span>{title}</span></nav>
    <div className="journey-hero-copy shell"><div><p>{eyebrow}</p><h1>{title}</h1><span>{description}</span>{price ? <b className="journey-hero-price">{price}</b> : null}{includes?.length ? <ul className="journey-hero-includes">{includes.map((item) => <li key={item}>{item}</li>)}</ul> : null}{rating ? <a className="journey-hero-rating" href={rating.href}><StarRating value={rating.value} label={`Overall rating: ${rating.value.toFixed(1)} out of 5 stars`} /><span>{rating.label}</span></a> : null}<div className="journey-hero-actions"><Link className="button journey-primary-action" href={primary.href}>{primary.label}</Link><Link className="journey-text-action" href={secondary.href}>{secondary.label} <b>↓</b></Link></div>{chat ? <Link className="journey-hero-whatsapp" href={chat.href}>{chat.label}</Link> : null}<small>{note}</small></div></div>
  </header>;
}

export function JourneySectionNav({ links, action }: { links: Action[]; action: Action }) {
  return <nav className="journey-anchor-nav journey-anchor-nav-quiet" aria-label="Jump to a section"><div className="shell"><span>Jump to:</span><div>{links.map(link => link.href.startsWith("#") ? <a href={link.href} key={link.href}>{link.label}</a> : <Link href={link.href} key={link.href}>{link.label}</Link>)}</div><Link className="journey-nav-contact" href={action.href}>{action.label} →</Link></div></nav>;
}

export function JourneyOverview({ title, description, items, action }: {
  title: string; description: string; items: { label: string; value: string }[]; action: Action;
}) {
  return <section className="journey-overview" id="glance"><div className="shell"><div className="journey-overview-heading"><h2>{title}</h2><p>{description}</p></div><div className="journey-overview-items">{items.map(item => <div key={item.label}><span>{item.label}</span><b>{item.value}</b></div>)}</div><Link href={action.href}>{action.label} →</Link></div></section>;
}
