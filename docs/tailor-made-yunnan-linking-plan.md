# Tailor-made Yunnan tour: internal linking and conversion plan

Status: landing-page conversion updates and shared entrance rollout implemented in PR #30. Contextual links are also added to the four country guides, Dali guide, Dali hidden-gems guide and itinerary-planning hub. Further destination articles can receive editorial links when their route-planning sections are revised.

## Positioning and destination

Keep /custom-china-tour as the canonical URL. Lead with tailor-made private Yunnan tours in the title, H1, Service schema and first-screen copy. Other China destinations remain enquiries subject to feasibility. Use /custom-china-tour for product discovery; use /custom-china-tour#plan when a visitor already wants to request a route.

The custom page complements the existing journey catalogue. Keep the two six-day products as clear starting points and offer customization when duration, pace, destinations or party needs differ.

## Current entrances

- Journeys mega menu: Tailor-made journeys link and a custom planning callout.
- /journeys: a tailor-made JourneyCard.
- Existing journey detail template: Looking for a different journey? section, affecting both products.
- Shared footer: Tailor-Made Private Journeys.
- Custom page: reverse links to both existing journeys.
- Sitemap: custom page included.

## Implemented rollout

| Priority | Surface | Placement and CTA | Destination / role |
| --- | --- | --- | --- |
| P1 | Shared header, desktop and mobile | Keep existing main navigation categories. Point PLAN MY JOURNEY at the custom page; keep the Journeys mega-menu callout and label it Tailor-made Yunnan tours. | /custom-china-tour; the site-wide service entry |
| P1 | Homepage Hero | Keep EXPLORE JOURNEYS primary; use DESIGN MY YUNNAN TRIP as the secondary discovery action. Preserve WhatsApp access in contact/footers. | /custom-china-tour |
| P1 | Homepage featured journey | Below the existing itinerary link, add a brief alternative: Different dates or another route in mind? Design your own Yunnan journey → | /custom-china-tour; captures a product mismatch |
| P1 | Homepage private-travel CTA | Adapt the existing mid-page block, rather than adding a duplicate section. Ask visitors to share dates, party and pace; make the primary action PLAN MY PRIVATE TOUR. | /custom-china-tour#plan |
| P1 | Shared article discovery flow | Keep related guides → one real itinerary card → Talk With Joy. In the existing itinerary section add a quiet alternative: A different route or pace in mind? Plan a tailor-made Yunnan tour → | /custom-china-tour; one shared component change covers all article pages |
| P1 | Yunnan destination hub | Add a custom alternative after the sample itinerary; make the existing final route-planning CTA lead to the custom form. Retain the guide and ready-made route links. | /custom-china-tour or #plan, depending on the placement |
| P2 | Four country guides and two Dali guides (implemented); further destination guides (future editorial work) | One contextual link where the reader chooses duration, route, family pace or transport. Example: If the six-day route does not fit your dates, ask us to plan a private Yunnan itinerary. | /custom-china-tour; article-specific relevance |
| P2 | Survival Kit | Keep preparation tasks first. Make the existing final private-route banner point to the custom product, with WhatsApp secondary. | /custom-china-tour; turn completed preparation into trip planning |
| P2 | About / Contact | Add one explicit custom-planning link beside relevant planning text. Keep practical questions and WhatsApp accessible. Do not redirect a general advice enquiry into a tour lead. | /custom-china-tour#plan |
| Existing | Journeys catalogue / footer / products | Preserve and improve labels where needed; avoid additional duplicate cards or full-width CTAs. | Product discovery and alternate route |
| No extra promotion | Article practical sidebar and payment/VPN problem-solving steps | Keep Survival Kit and the relevant practical hub as primary assistance. Let the shared end-of-article product block handle the optional tour invitation. | Protect the reader's immediate task |

## Reusable implementation

- Header changes belong in SiteHeader, not separate homepage/mobile markup.
- End-of-article alternative belongs in ArticleDiscoveryFlow; keep the real JourneyCard and the three-section information flow.
- Product mismatch CTA stays in JourneyPage.
- Use a small configurable text-link bridge for homepage/hub/manual article placements if repeated; do not introduce another product-card design.
- Keep partner evidence in HuataiServiceProof. Its compact variant serves the custom page without importing six-day inclusions. The full variant remains on the existing itinerary.
- Contextual article links require editorial placement; do not inject a sales CTA after every generic heading or replace unrelated article titles and metadata.

## Copy and visual hierarchy

Discovery actions describe the product: Tailor-made Yunnan tours, Design your Yunnan journey.
Form actions describe the next step: Tell us your plans, Request my private journey.
WhatsApp remains the alternative contact channel.

Keep one visually primary action per block. Use a text link for the custom alternative below a fixed itinerary. The first visit should not require a third product card in every article.

The landing form initially shows name, email, approximate dates, adults/children and rough trip notes. WhatsApp, trip length, destinations, hotel preference, budget and interests are optional within native expandable details. Closed optional fields still submit defaults compatible with the existing API. Consent remains required. The success confirmation stays focused and visible.

Use the existing approved expectation, Usually replies within 24 hours, as a usual response time rather than a guaranteed completed quotation. Joy discusses the route before preparing the proposal.

## Measurement and release

Use existing custom_journey_click/custom_journey_plan_click, custom_journey_form_start and generate_lead events. Set a distinct data-cta-location for header, home hero, home itinerary alternative, article alternative, Yunnan hub and Survival Kit. Do not send visitor name, email, WhatsApp or free-text plans to analytics.

Compare each entrance's custom-page visits → form starts → accepted submissions, and separately assess actual qualified enquiries and sales. No SEO search-volume or conversion-rate lift has been measured yet.

Verify desktop/mobile menu links, anchor landing, form with optional fields closed/open, failure preserving inputs and success remaining in view. Confirm that related reading and real itinerary discovery still work. Merge/deploy PR #30 separately when approved; include the email configuration in Production and Preview.
