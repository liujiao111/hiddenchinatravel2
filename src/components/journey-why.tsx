import Image from "next/image";
import Link from "next/link";
import { licensedOperator, operatorCredentials } from "@/lib/journey-trust";

export function JourneyWhy() {
  return <section className="journey-why" id="why-us" aria-labelledby="why-us-title">
    <div className="shell">
      <h2 id="why-us-title">Planned with Joy. Contracted with a licensed Kunming agency.</h2>
      <div className="journey-why-proof">
        <article>
          <figure>
            <Image src="/brand/founder/portrait.webp" alt="Joy Liu, travel consultant at Hidden China Travel" fill sizes="(max-width:700px) 86vw, 280px" unoptimized />
          </figure>
          <div>
            <h3>You’ll be planning with Joy.</h3>
            <p>Joy Liu was born in Yunnan and plans from Kunming. You speak with him from the first enquiry through the trip.</p>
            <Link href="/about-us">Meet Joy →</Link>
          </div>
        </article>
        <article>
          <div>
            <h3>Licensed agency</h3>
            <p>{licensedOperator.nameEn} ({licensedOperator.nameZh}). Permit {licensedOperator.permitNumber}. The travel contract and all payments are with this agency.</p>
          </div>
          <div className="journey-why-docs">
            {operatorCredentials.documents.map((document) => <a key={document.href} href={document.href} target="_blank" rel="noopener noreferrer">
              <Image src={document.src} alt={document.alt} width={document.width} height={document.height} unoptimized />
              <span>{document.label}</span>
            </a>)}
          </div>
        </article>
      </div>
    </div>
  </section>;
}
