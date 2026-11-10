import { useTranslations } from "next-intl";
import { LocaleLink as Link } from "@/components/locale-link";

export function CustomJourneyLink({ prompt, label, location }: { prompt: string; label?: string; location: string }) {
  const t = useTranslations("contentUi");
  return <p className="custom-journey-link"><span>{prompt}</span><Link href="/private-yunnan-tours" data-cta-location={location}>{label || t("customYunnan")}</Link></p>;
}
