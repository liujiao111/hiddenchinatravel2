import Image from "next/image";
import { licensedOperator, operatorCredentials } from "@/lib/journey-trust";

export function OperatorCredentials() {
  return <div className="journey-proof-license">
    <div><span>{operatorCredentials.kicker}</span><h3>{operatorCredentials.title}</h3><p>{operatorCredentials.copy}</p><p><a href={licensedOperator.creditRegistryUrl} target="_blank" rel="noopener noreferrer">Look up {licensedOperator.unifiedSocialCreditCode} on gsxt.gov.cn ↗</a></p></div>
    <div className="journey-proof-documents">{operatorCredentials.documents.map((document) => <a key={document.href} href={document.href} target="_blank" rel="noopener noreferrer"><Image src={document.src} alt={document.alt} width={document.width} height={document.height} unoptimized /><span>{document.label}</span></a>)}</div>
  </div>;
}
