import Link from "next/link";
import { ContentFooter } from "@/components/content-footer";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return <main><SiteHeader /><section className="not-found"><div><p>404</p><h1>This path leads somewhere else.</h1><span>The guide may have moved, or the address may be incomplete.</span><Link href="/" className="button button-green">BACK TO HIDDEN CHINA</Link></div></section><ContentFooter /></main>;
}
