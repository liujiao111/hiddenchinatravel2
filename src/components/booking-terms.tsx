import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { bookingDocumentHref } from "@/lib/booking-terms";
import { getBookingTermCards } from "@/lib/booking-terms-i18n";

export function BookingTerms({
  heading,
  intro,
}: {
  heading?: string;
  intro?: string;
} = {}) {
  const t = useTranslations("bookingTerms");
  const lang = useLocale() as "en" | "zh";
  const cards = getBookingTermCards(lang);
  return (
    <section className="journey-booking-notes section section-sand journey-booking-notes-compact" id="booking-terms">
      <div className="shell">
        <div className="journey-editorial-heading">
          <span>{t("kicker")}</span>
          <h2>{heading ?? t("headingDefault")}</h2>
          <p>{intro ?? t("introDefault")}</p>
        </div>
        <div className="journey-booking-notes-grid">
          {cards.map(([title, detail]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>
        <p className="journey-booking-notes-source"><Link href={bookingDocumentHref}>{t("fullNoteLink")}</Link><Link href="/licensed-operator">{t("licenceLink")}</Link></p>
      </div>
    </section>
  );
}
