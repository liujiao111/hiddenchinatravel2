import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Script from "next/script";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { routing } from "@/i18n/routing";
import { htmlLang } from "@/lib/i18n-seo";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.match(/^AW-\d+$/)?.[0];
const gtagSrcId = gaMeasurementId || googleAdsId;

export const metadata: Metadata = {
  metadataBase: new URL("https://hiddenchinatravel.com"),
  title: {
    default: "Hidden China Travel",
    template: "%s | Hidden China Travel",
  },
  description:
    "Practical China travel guides, local insight, and personalized journeys across Yunnan and beyond.",
};

export function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }));
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(routing.locales, lang)) notFound();
  setRequestLocale(lang);

  return (
    <html
      lang={htmlLang[lang]}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
      <Script id="microsoft-clarity" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "ynmcix0ju8");
        `}
      </Script>
      </head>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        {gtagSrcId ? <AnalyticsTracker /> : null}
      {gtagSrcId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gtagSrcId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              ${gaMeasurementId ? `gtag('config', '${gaMeasurementId}', { send_page_view: false });` : ""}
              ${googleAdsId ? `gtag('config', '${googleAdsId}');` : ""}
              window.dispatchEvent(new Event('ga-ready'));
            `}
          </Script>
        </>
      ) : null}
      </body>
    </html>
  );
}
