import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { QuickAsk } from "@/components/quick-ask";

type Props = {
  id: string;
  source: string;
  sourceTitle: string;
  whatsapp?: string;
  showRouteLink?: boolean;
  compact?: boolean;
};

export function JourneyQuoteBand({ id, source, sourceTitle, whatsapp, showRouteLink, compact }: Props) {
  const t = useTranslations("journey");
  const planPoints = t.raw("planPoints") as string[];
  const whatsappHref = whatsapp ?? buildWhatsAppUrl();

  return <section className={compact ? "journey-quote-band journey-quote-band-compact" : "journey-quote-band"}>
    <div className="shell journey-plan">
      <div className="journey-plan-head">
        <div>
          <h2>{t("quoteHeading")}</h2>
          <p>{t("quotePayment")}</p>
        </div>
        {compact ? <a className="button journey-plan-whatsapp" href={whatsappHref} data-cta-location={`journey_plan_whatsapp_${id}`}>{t("startPlanning")}</a> : null}
      </div>
      {compact ? null : <>
        <ul className="journey-plan-points">{planPoints.map((point) => <li key={point}><span>✓</span>{point}</li>)}</ul>
        <QuickAsk layout="plain" id={id} source={source} sourceTitle={sourceTitle} intent="trip" />
        <a className="journey-plan-alternative" href={whatsappHref} data-cta-location={`journey_plan_whatsapp_${id}`}>{t("chatWhatsapp")} <span aria-hidden="true">↗</span></a>
      </>}
      {showRouteLink ? <div className="journey-quote-links"><Link href="/private-yunnan-tours" data-cta-location="journey_custom_alternative">{t("customRouteLink")}</Link></div> : null}
    </div>
  </section>;
}
