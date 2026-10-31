import { Link } from "@/i18n/navigation";

export function CustomJourneyLink({ prompt, label = "Explore Tailor-Made Yunnan →", location }: { prompt: string; label?: string; location: string }) {
  return <p className="custom-journey-link"><span>{prompt}</span><Link href="/custom-china-tour" data-cta-location={location}>{label}</Link></p>;
}
