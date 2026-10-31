import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { LocaleLink as Link } from "@/components/locale-link";
import { licensedOperator, operatorCredentials } from "@/lib/journey-trust";

export function JourneyWhy() {
  const t = useTranslations("journey");
  const lang = useLocale() as "en" | "zh";
  return <section className="journey-why" id="why-us" aria-labelledby="why-us-title">
    <div className="shell">
      <h2 id="why-us-title">{t("whyHeading")}</h2>
      <div className="journey-why-proof">
        <article>
          <figure>
            <Image src="/brand/founder/portrait.webp" alt={t("whyJoyAlt")} fill sizes="(max-width:700px) 86vw, 280px" unoptimized />
          </figure>
          <div>
            <h3>{t("whyJoyTitle")}</h3>
            <p>{t("whyJoyCopy")}</p>
            <Link href="/about-us">{t("whyMeetJoy")}</Link>
          </div>
        </article>
        <article>
          <div>
            <h3>{t("whyAgencyTitle")}</h3>
            <p>{t("whyAgencyCopy", { agencyEn: licensedOperator.nameEn, agencyZh: licensedOperator.nameZh, permit: licensedOperator.permitNumber, address: lang === "zh" ? licensedOperator.addressZh : licensedOperator.addressEn })}</p>
            <Link href="/licensed-operator">{t("whyInsurance")}</Link>
          </div>
          <div className="journey-why-docs">
            {operatorCredentials.documents.map((document) => <a key={document.href} href={document.href} target="_blank" rel="noopener noreferrer">
              <Image src={document.src} alt={document.alt} width={document.width} height={document.height} unoptimized />
              <span>{lang === "zh" ? (document.href.includes("business-license") ? "查看营业执照 ↗" : "查看旅行社业务经营许可证 ↗") : document.label}</span>
            </a>)}
          </div>
        </article>
      </div>
    </div>
  </section>;
}
