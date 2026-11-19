import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { HashLink } from "@/components/hash-link";
import { QuickAsk } from "@/components/quick-ask";

export function PlanJourneyClose({
  id,
  source,
  sourceTitle,
  whatsapp,
  routeHref,
  showForm = true,
}: {
  id: string;
  source: string;
  sourceTitle: string;
  whatsapp: string;
  routeHref?: string;
  showForm?: boolean;
}) {
  const t = useTranslations("journey");
  return <section className="journey-final-cta journey-final-cta-ask" id={showForm ? undefined : id}>
    <div>
      <h2>{t("closeHeading")}</h2>
      <span>{t("closeText")}</span>
      <a className="button journey-primary-action" href={whatsapp} data-cta-location={`${id}_whatsapp`}>{t("startPlanning")}</a>
      {showForm ? <>
        <p className="journey-close-email">{t("closeEmailNote")}</p>
        <QuickAsk layout="plain" id={id} source={source} sourceTitle={sourceTitle} intent="trip" />
      </> : <HashLink className="journey-final-alt" href="#ask-joy" data-cta-location={`${id}_email`}>{t("chatEmail")}</HashLink>}
      {routeHref ? <Link className="journey-final-alt" href={routeHref} data-cta-location={`${id}_custom`}>{t("customRouteLink")}</Link> : null}
    </div>
  </section>;
}
