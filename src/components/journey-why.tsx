import Image from "next/image";
import Link from "next/link";
import { OperatorCredentials } from "@/components/operator-credentials";
import { licensedOperator } from "@/lib/journey-trust";

export function JourneyWhy() {
  return <section className="journey-why journey-fact-cards" id="why-us" aria-labelledby="why-us-title">
    <div className="shell">
      <h2 id="why-us-title">Planned with Joy. Contracted with a licensed Kunming agency.</h2>
      <ul className="journey-fact-grid">
        <li>
          <span className="journey-fact-icon journey-fact-photo"><Image src="/brand/founder/portrait.webp" alt="Joy Liu, travel consultant at Hidden China Travel" fill sizes="48px" unoptimized /></span>
          <h3>You’ll be planning with Joy.</h3>
          <ul>
            <li>Joy Liu was born in Yunnan and plans from Kunming.</li>
            <li>You speak with him from the first enquiry through the trip.</li>
            <li><Link href="/about-us">Meet Joy</Link></li>
          </ul>
        </li>
        <li>
          <span className="journey-fact-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /></svg></span>
          <h3>Licensed agency</h3>
          <ul>
            <li>{licensedOperator.nameEn}</li>
            <li>{licensedOperator.nameZh}</li>
            <li>Permit {licensedOperator.permitNumber}</li>
            <li>The travel contract and all payments are with this agency.</li>
          </ul>
        </li>
      </ul>
      <details className="journey-why-licence-fold" id="why-us-licence">
        <summary>Inspect the licensed-agency documents<span aria-hidden="true">+</span></summary>
        <OperatorCredentials />
      </details>
    </div>
  </section>;
}
