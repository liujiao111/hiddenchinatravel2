import { useLocale, useTranslations } from "next-intl";
import type { ContentItem } from "@/lib/content";
import { LocaleLink as Link } from "@/components/locale-link";
import { ContentFooter } from "@/components/content-footer";
import { JsonLd, breadcrumbList } from "@/components/json-ld";
import { MarkdownContent } from "@/components/markdown-content";
import { SiteHeader } from "@/components/site-header";
import { localeUrl, type AppLocale, type LocaleAlternate } from "@/lib/i18n-seo";

/**
 * Booking has its own layout, distinct from legal documents and journey listings.
 * English and Chinese booking.md remain the single content source for the
 * booking/payment/cancellation wording. No journey CTA or tracking code changes.
 */
function bookingSections(markdown: string) {
  const blocks = markdown.trim().split(/^## /m);
  const intro = blocks.shift()?.trim() || "";
  const sections = blocks.map((block) => {
    const newline = block.indexOf("\n");
    return {
      title: (newline < 0 ? block : block.slice(0, newline)).trim(),
      body: newline < 0 ? "" : block.slice(newline + 1).trim(),
    };
  });
  return { intro, sections };
}

const copy = {
  en: {
    breadcrumb: "Booking & payment",
    kicker: "BOOKING & SERVICE",
    updated: "Last updated",
    sections: ["01 / THE PROCESS", "02 / PAYMENT", "03 / CANCELLATIONS", "04 / YOUR OPERATOR"],
    closingHeading: "Ready to plan your journey?",
    closingText: "Start with your dates and travel ideas. You can review the itinerary and quote before deciding to book.",
    cta: "Start Planning My Journey",
    explore: "Explore private journeys",
  },
  zh: {
    breadcrumb: "预订与付款",
    kicker: "预订与服务",
    updated: "最近更新",
    sections: ["01 / 预订流程", "02 / 付款方式", "03 / 取消与退款", "04 / 签约旅行社"],
    closingHeading: "准备规划你的旅程了吗？",
    closingText: "告诉我们你的出行日期和想法。先查看书面行程与报价，再决定是否预订。",
    cta: "开始规划我的行程",
    explore: "查看云南私家行程",
  },
} as const;

export function BookingPage({ item, alternate }: { item: ContentItem; alternate?: LocaleAlternate }) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("contentUi");
  const ui = copy[locale];
  const { intro, sections } = bookingSections(item.body);
  const sectionIds = ["process", "payment", "cancellations", "operator"];
  const sectionNames = ["booking-process", "booking-payment", "booking-cancellations", "booking-operator"];

  return (
    <main className="booking-page">
      <SiteHeader alternate={alternate} />

      <header className="booking-hero">
        <div className="shell">
          <nav className="breadcrumbs booking-breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">{t("home")}</Link>
            <span aria-hidden="true">›</span>
            <span>{ui.breadcrumb}</span>
          </nav>
          <p className="booking-eyebrow">{ui.kicker}</p>
          <h1>{item.frontmatter.title}</h1>
          <div className="booking-lead"><MarkdownContent>{intro}</MarkdownContent></div>
          {item.frontmatter.lastUpdated ? (
            <p className="booking-updated">{ui.updated}: {item.frontmatter.lastUpdated}</p>
          ) : null}
        </div>
      </header>

      {sections.map((section, index) => (
        <section
          className={["booking-section", sectionNames[index] || "booking-other-section"].join(" ")}
          id={sectionIds[index] || undefined}
          key={section.title}
        >
          <div className="shell">
            <div className="booking-section-heading">
              <span>{ui.sections[index] || ""}</span>
              <h2>{section.title}</h2>
            </div>
            <div className="booking-section-body">
              <MarkdownContent>{section.body}</MarkdownContent>
            </div>
          </div>
        </section>
      ))}

      <section className="booking-close">
        <div className="shell">
          <h2>{ui.closingHeading}</h2>
          <p>{ui.closingText}</p>
          <Link href="/contact" className="button booking-close-button" data-cta-location="booking_final_contact">
            {ui.cta} <span aria-hidden="true">→</span>
          </Link>
          <Link href="/private-yunnan-tours#routes" className="booking-close-link">{ui.explore}</Link>
        </div>
      </section>
      <ContentFooter />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [breadcrumbList([
          { name: t("home"), href: localeUrl(locale, "/") },
          { name: item.frontmatter.title, href: localeUrl(locale, "/booking") },
        ])],
      }} />
    </main>
  );
}
