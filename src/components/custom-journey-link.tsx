import Link from "next/link";

export function CustomJourneyLink({ prompt, label = "Plan a tailor-made Yunnan tour →", location }: { prompt: string; label?: string; location: string }) {
  return <p className="custom-journey-link"><span>{prompt}</span><Link href="/custom-china-tour" data-cta-location={location}>{label}</Link></p>;
}
