import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { ContentFooter } from "@/components/content-footer";
import { CurrencyConverter } from "@/components/travel-tools/currency-converter";
import { getExchangeRates } from "@/lib/currency-converter/get-rates";
import "../travel-tools.css";

export const metadata: Metadata = {
  title: "China Currency Converter: USD to CNY & CNY to USD",
  description: "Convert USD, SGD, EUR, GBP and more to Chinese yuan with updated reference rates. Compare quick RMB amounts and plan your China travel budget.",
  alternates: { canonical: "/china-currency-converter" },
  openGraph: { title: "China Currency Converter | Hidden China Travel", description: "Live reference rates for your China travel budget.", type: "website", url: "/china-currency-converter" },
};

export const revalidate = 3600;

export default async function ChinaCurrencyConverterPage() {
  const rates = await getExchangeRates();
  return <main><SiteHeader /><header className="tool-hero"><Image src="/assets/blog/digital-survival-china-payment-guide/cover.webp" alt="Getting ready to pay while traveling in China" fill priority unoptimized sizes="100vw" /><div className="tool-hero-shade" /><nav className="breadcrumbs tool-breadcrumb shell"><Link href="/">Home</Link><span>›</span><Link href="/survival-kit">Survival Kit</Link><span>›</span><span>Currency Converter</span></nav><div className="shell tool-hero-copy"><span>CHINA TRAVEL TOOLS</span><h1>China Currency Converter</h1><p>See what prices in yuan mean for your travel budget, using updated reference exchange rates.</p><Link className="button button-light" href="#convert">CONVERT A PRICE ↓</Link></div></header>
    <section className="tool-section"><div className="shell tool-main"><CurrencyConverter initialRates={rates} /><aside className="tool-aside"><span>PAYING IN CHINA</span><h2>The number on your card statement may differ.</h2><p>Exchange rates here are a reference. Your bank, card, ATM or exchange counter may apply its own rate and fees.</p><Link href="/payments-in-china">Read the China payment guide →</Link><Link href="/alipay-for-foreigners-china">Set up Alipay before arrival →</Link></aside></div></section>
    <section className="tool-section tool-sand"><div className="shell tool-two-cols"><div><span className="tool-kicker">BEFORE YOU PAY</span><h2>Budget for the real cost.</h2><p>A mid-market rate is useful for comparison, but it is not a guaranteed rate at an airport counter or in a card payment. Ask whether your bank adds a foreign transaction fee, and when a terminal offers a choice, compare paying in CNY against a home-currency conversion.</p></div><div className="tool-info-card"><h3>Three quick checks</h3><ol><li>See the reference rate and its date above.</li><li>Check your bank or card’s currency conversion terms.</li><li>Keep another payment method ready in case a transaction fails.</li></ol><Link href="/survival-kit">Open the China Survival Kit →</Link></div></div></section>
    <section className="tool-section"><div className="shell tool-two-cols"><div><span className="tool-kicker">COMMON QUESTIONS</span><h2>Money questions for a China trip</h2></div><div className="tool-faq"><details><summary>Is RMB the same as CNY?<span>+</span></summary><p>Renminbi (RMB) is the name of China’s currency; yuan is its main unit. CNY is the currency code used by banks and converters.</p></details><details><summary>Are these the exact rates charged by Alipay or my bank?<span>+</span></summary><p>No. The converter shows reference market rates. Your provider’s rate, fees and timing determine the final amount.</p></details><details><summary>Can I exchange money with this tool?<span>+</span></summary><p>No. It is a budgeting calculator; it does not process payments or currency exchanges.</p></details></div></div></section><ContentFooter />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: "China Currency Converter", url: "https://hiddenchinatravel.com/china-currency-converter", applicationCategory: "FinanceApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }) }} />
  </main>;
}
