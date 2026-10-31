import Image from "next/image";
import { useLocale } from "next-intl";
import { licensedOperator } from "@/lib/journey-trust";
import { getOperatorCredentials } from "@/lib/journey-trust-i18n";

export function OperatorCredentials() {
  const lang = useLocale() as "en" | "zh";
  const operatorCredentials = getOperatorCredentials(lang);
  return <div className="journey-proof-license">
    <div><span>{operatorCredentials.kicker}</span><h3>{operatorCredentials.title}</h3><p>{operatorCredentials.copy}</p><p><a href={licensedOperator.creditRegistryUrl} target="_blank" rel="noopener noreferrer">{lang === "zh" ? `前往国家企业信用信息公示系统查询 ${licensedOperator.unifiedSocialCreditCode} ↗` : `Look up ${licensedOperator.unifiedSocialCreditCode} on gsxt.gov.cn ↗`}</a></p></div>
    <div className="journey-proof-documents">{operatorCredentials.documents.map((document) => <a key={document.href} href={document.href} target="_blank" rel="noopener noreferrer"><Image src={document.src} alt={document.alt} width={document.width} height={document.height} unoptimized /><span>{document.label}</span></a>)}</div>
  </div>;
}
