# 8-day private Yunnan journey: pricing audit

Status: NOT VERIFIED — request an initial quotation (9 November 2026).

## Confirmed inputs
- The reference route is Kunming, Dali, Lijiang, Shangri-La and return to Kunming; seven hotel nights, private sightseeing transport, transfers and some train / attraction services.
- A US$799 per-person advertised price for two adults has appeared in the English and Chinese pages. No supplier-cost calculation matching those exact inclusions, dates and two-person group size was located.
- A distinct November 2026 quotation for three adults totals RMB 10,263 and excludes hotel costs. Its vehicle, rail and activity segments are different from this 8-day journey. This is useful only as a cross-check, not as an 8-day supplier quote.

## Illustrative two-adult cost stress test (RMB, NOT supplier quotes)

| Component | Lower scenario | Higher scenario | What to verify |
| --- | ---: | ---: | --- |
| 7 hotel nights, one shared room | 2,100 | 4,200 | Actual hotel and date |
| 6 private-vehicle days with driver | 4,800 | 7,200 | Mileage, fuel, driver hours |
| Attraction tickets for 2 | 1,000 | 2,000 | Cable cars, parks and visits |
| Second-class train for 2 | 600 | 1,200 | Exact legs and dates |
| Airport / railway transfers | 300 | 600 | Deduplicate if in vehicle rate |
| Coordination / English guide reserve | 400 | 800 | Deduplicate if in vehicle rate |
| ILLUSTRATIVE TOTAL | 9,200 | 16,000 | Assumptions, not bids |

Illustrative direct cost per traveler for two people: RMB 4,600–8,000 before profit, advertising spend, tax, payment fees, insurance and contingency. Neither these boundaries nor the original US$799 are verified supplier prices.

## Implementation decision
1. Remove US$799 from public English and Chinese 8-day references, including metadata and dynamic cards, pending a supplier quotation.
2. Set the published data field fromPrice to zero so no unverified price offer is emitted in schema, hero or listing components.
3. Display Request an initial price (Chinese: 获取初步报价). Maintain actual included-service descriptions where they refer to written quotations and explicitly named services, not guaranteed generic inclusions.
4. Only restore a numeric starting price after confirming two-person and four-person group rates, hotel standards, English service, vehicle days, ticket plan, train classes, seasonal rates, supplier margin and offer validity.

## Review evidence
- Curated reviews are in content/testimonials.json but those entries do not include source links, original messages or documented release permissions.
- A search of the user's accessible files found no identifiable original reviews matching those entries.
- This is not a determination that reviews are fabricated. The new Preview omits them until source evidence and usage rights can be verified. Existing public journey pages are not rewritten as part of this preview trust audit.
