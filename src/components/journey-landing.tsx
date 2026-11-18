import Image from "next/image";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
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
  const t = useTranslations("journey");
  return <header className="journey-hero">
    <Image src={encodeURI(image)} alt={imageAlt} fill priority unoptimized sizes="100vw" />
    <div className="journey-hero-shade" />
    <nav className="breadcrumbs journey-breadcrumbs shell" aria-label={t("breadcrumbAria")}><Link href="/">{t("breadcrumbHome")}</Link><span>›</span><Link href="/yunnan-tour-packages">{t("breadcrumbJourneys")}</Link><span>›</span><span>{name || title}</span></nav>
    <div className="journey-hero-copy shell"><div><p>{eyebrow}</p><h1>{title}</h1><span>{description}</span>{price ? <b className="journey-hero-price">{price}</b> : null}{includes?.length ? <ul className="journey-hero-includes">{includes.map((item) => <li key={item}>{item}</li>)}</ul> : null}{bounds ? <ul className="journey-hero-bounds">{bounds.split(" · ").map((item) => <li key={item}>{item}</li>)}</ul> : null}{rating ? <a className="journey-hero-rating" href={rating.href}><StarRating value={rating.value} label={`Overall guest rating: ${rating.value.toFixed(1)} out of 5 stars`} /><span>{rating.label}</span></a> : null}<div className="journey-hero-actions"><HashLink id="hero-quote" className="button journey-primary-action" href={primary.href}>{primary.label}</HashLink><HashLink className="journey-text-action" href={secondary.href}>{secondary.label} <b>↓</b></HashLink></div>{chat ? (chat.href.startsWith("#") ? <HashLink className="journey-hero-whatsapp" href={chat.href}>{chat.label}</HashLink> : <Link className="journey-hero-whatsapp" href={chat.href}>{chat.label}</Link>) : null}<small>{note}</small></div></div>
  </header>;
}

export function JourneySectionNav({ links, action }: { links: Action[]; action: Action }) {
  const t = useTranslations("journey");
  return <nav className="journey-anchor-nav journey-anchor-nav-quiet" aria-label={t("navAria")}><div className="shell"><span>{t("navJumpTo")}</span><div>{links.map(link => link.href.startsWith("#") ? <HashLink href={link.href} key={link.href}>{link.label}</HashLink> : <Link href={link.href} key={link.href}>{link.label}</Link>)}</div><HashLink className="journey-nav-contact" href={action.href}>{action.label} →</HashLink></div></nav>;
}

export type FactIconName = "party" | "person" | "licence" | "star" | "calendar" | "route" | "meal" | "price" | "pin" | "note";

export type FactCard = { title: string; lines: string[]; icon: FactIconName; badge?: ReactNode };

export function JourneyFactCards({ id, title, cards, action, className = "" }: {
  id: string; title: string; cards: FactCard[]; action?: Action; className?: string;
}) {
  const headingId = `${id}-title`;
  return <section className={`journey-fact-cards ${className}`.trim()} id={id} aria-labelledby={headingId}>
    <div className="shell">
      <h2 id={headingId}>{title}</h2>
      <ul className="journey-fact-grid">
        {cards.map((card, index) => <li key={card.title}>
          {card.badge ? <span className="journey-fact-badge" aria-hidden="true">{card.badge}</span>
            : <span className="journey-fact-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>}
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
  if (text.includes("day") || text.includes("night") || /天|晚/.test(text)) return "calendar";
  if (text.includes("meal") || text.includes("餐")) return "meal";
  if (text.includes("price") || text.includes("quote") || text.includes("us$") || text.includes("$") || text.includes("价")) return "price";
  if (text.includes("where")) return "pin";
  if (text.includes("journey") || text.includes("how") || text.includes("行程") || text.includes("路线")) return "route";
  return "note";
}

function cardTitle(label: string) {
  if (label !== label.toUpperCase()) return label;
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
