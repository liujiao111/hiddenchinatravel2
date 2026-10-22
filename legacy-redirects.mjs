/** WordPress and pre-rebuild URLs reported as 404 in Search Console. */

const pages = {
  "/tools": "/china-travel-essentials",
  "/reviews": "/about-us",
  "/partners": "/about-us",
  "/services": "/booking",
  "/services/custom-itinerary": "/custom-china-tour",
  "/about": "/about-us",
  "/survival-guides": "/survival-kit",
  "/faq": "/china-travel-essentials",
  "/blog": "/china-travel-essentials",
  "/china-destinations": "/china-destinations/yunnan",
  "/zhangjiajie-travel-foreigners": "/china-itinerary-planning",
  "/yunnan-hidden-gems": "/dali-hidden-gems-off-the-beaten-path",
  "/yubeng-trekking-guide": "/china-destinations/yunnan",
  "/comments/feed": "/",
  "/hello-world": "/",
  "/china-travel-planner": "/custom-china-tour",
  "/china-itinerary-planner": "/custom-china-tour",
  "/travel-china-guide": "/china-travel-essentials",
  "/china-sim-card-vs-esim": "/internet-in-china",
  "/explore-china-next": "/journeys",
  "/yunnan-itinerary": "/china-destinations/yunnan",
  "/china-l-visa-tourist-guide": "/do-i-need-a-visa-for-china",
  "/china-240-hour-transit-visa-free": "/do-i-need-a-visa-for-china",
  "/lijiang": "/lijiang-travel-guide",
  "/shangri-la": "/shangri-la-travel-guide",
  "/shuhe-ancient-town-the-quiet-retreat-youre-actually-looking-for-in-lijiang": "/lijiang-travel-guide",
  "/journeys/dali-lijiang-lugu-lake-private-tour": "/journeys",
  "/journeys/dali-lijiang-lugu-lake-6-days": "/journeys",
  "/sitemap_index.xml": "/sitemap.xml",
};

const tags = {
  "vpn-for-tourists": "/best-vpn-for-china",
  "google-maps-china": "/google-maps-china-not-working",
  "google-maps-in-china": "/google-maps-china-not-working",
  "visa-free-china": "/china-visa-free-countries-2026",
  "hotels-in-china": "/hotels-in-china",
  "china-visa-travel-tips": "/do-i-need-a-visa-for-china",
  "yunnan-travel": "/china-destinations/yunnan",
  "china-travel-internet": "/internet-in-china",
  "payments-in-china": "/payments-in-china",
  "china-mobile-data": "/internet-in-china",
  "china-transportation": "/transport-in-china",
  "didi-guide": "/how-to-use-didi-china-foreigners",
  "digital-survival-china": "/china-travel-essentials",
  "china-for-foreigners": "/china-travel-essentials",
  "china-visa-free-countries-2026": "/china-visa-free-countries-2026",
  "china-visa-free": "/china-visa-free-countries-2026",
  "china-immigration": "/do-i-need-a-visa-for-china",
  "cashless-payment-china": "/payments-in-china",
  "china-visa-2026": "/china-visa-checker",
  "vpn-2026": "/best-vpn-for-china",
  "real-name-verification-china": "/china-real-name-system-foreigners",
  "dali-travel": "/dali-travel-guide",
  "china-visa-free-canada": "/china-visa-checker/canada",
  "meituan-guide": "/how-to-use-meituan",
  "high-altitude": "/shangri-la-travel-guide",
  "china-local-deals": "/food-delivery-in-china",
  "china-30-day-visa-free": "/china-visa-free-countries-2026",
  "china-vpn": "/best-vpn-for-china",
  "china-visa": "/china-visa-checker",
  "travel-tips": "/china-travel-essentials",
  "meituan-china-guide": "/how-to-use-meituan",
  "china-food-deals": "/food-delivery-in-china",
  "great-firewall": "/internet-in-china",
  "china-visa-free-uk": "/china-visa-checker/united-kingdom",
  "china-entry-requirements": "/do-i-need-a-visa-for-china",
  "china-real-name-system": "/china-real-name-system-foreigners",
  "travel-china-without-tour": "/independent-travel-china",
  "foreigners-in-china": "/china-travel-essentials",
};

const categories = {
  yunnan: "/china-destinations/yunnan",
  "yunnan-travel": "/china-destinations/yunnan",
  "travel-china-guide": "/china-travel-essentials",
  "travel-china-essentials": "/china-travel-essentials",
  "china-food-delivery": "/food-delivery-in-china",
  "china-attraction-tickets": "/attraction-tickets-in-china",
  "payments-in-china": "/payments-in-china",
  "china-transport": "/transport-in-china",
  "china-internet-vpn": "/internet-in-china",
  "china-maps-navigation": "/maps-navigation-in-china",
  "visa-entry": "/china-visa-checker",
};

function withSlash(source, destination) {
  const rules = [{ source, destination, permanent: true }];
  if (source !== "/" && !source.endsWith("/")) {
    rules.push({ source: `${source}/`, destination, permanent: true });
  }
  return rules;
}

function prefixed(prefix, map) {
  return Object.entries(map).flatMap(([slug, destination]) => [
    ...withSlash(`${prefix}/${slug}`, destination),
    ...withSlash(`${prefix}/${slug}/feed`, destination),
  ]);
}

export function legacyRedirects() {
  return [
    ...Object.entries(pages).flatMap(([source, destination]) => withSlash(source, destination)),
    ...withSlash("/:slug/feed", "/:slug"),
    ...prefixed("/tag", tags),
    ...prefixed("/category", categories),
    ...withSlash("/tag/:slug*", "/china-travel-essentials"),
    ...withSlash("/category/:slug*", "/china-travel-essentials"),
  ];
}
