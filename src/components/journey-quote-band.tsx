import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { QuickAsk } from "@/components/quick-ask";
import { siteConfig } from "@/lib/site-config";

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
  const tq = useTranslations("quickAsk");
  const planPoints = t.raw("planPoints") as string[];
  const whatsappHref = whatsapp ?? `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(tq("whatsappPrompt", { sourceTitle }))}`;

  return <section className={compact ? "journey-quote-band journey-quote-band-compact" : "journey-quote-band"}>
    <div className="shell journey-plan">
      <div className="journey-plan-head">
        <div>
          <h2>{t("quoteHeading")}</h2>
          <p>{t("quotePayment")}</p>
        </div>
        <a className="button journey-plan-whatsapp" href={whatsappHref} data-cta-location={`journey_plan_whatsapp_${id}`}>{t("startPlanning")}</a>
      </div>
      {compact ? null : <>
        <ul className="journey-plan-points">{planPoints.map((point) => <li key={point}><span>✓</span>{point}</li>)}</ul>
        <p className="journey-plan-switch">{t("emailSwitch")}</p>
        <QuickAsk layout="plain" id={id} source={source} sourceTitle={sourceTitle} intent="trip" />
      </>}
      {showRouteLink ? <div className="journey-quote-links"><Link href="/custom-china-tour" data-cta-location="journey_custom_alternative">{t("customRouteLink")}</Link></div> : null}
    </div>
  </section>;
}
