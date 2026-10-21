# Hidden China Travel product architecture

This document records the intended product structure without exposing products
that are not yet ready to sell.

## Live now

### Private Yunnan journeys

Multi-day sample routes that can be adjusted around the traveler's dates,
party, pace and comfort preferences.

- Dali, Lijiang & Lugu Lake
- First Encounter Yunnan
- The Essence of Yunnan

Published journey content uses:

```yaml
status: published
displayOrder: 1
navFeatured: true
```

Only `published` journeys are returned by `getAllJourneys()`. Content marked
`draft` or `planned` remains hidden from listings, navigation, sitemap-driven
journey routes and related-content modules.

### Tailor-Made Yunnan

This is a planning service, not a third fixed itinerary. It should be visually
separate from journey cards and lead to `/custom-china-tour`.

## Planned, not displayed

Do not add navigation links or empty collection pages for these families until
the launch criteria are met.

### Signature journeys

Photography, hiking, food and other specialist interests. Launch a public
collection only when a theme has at least two or three routes with confirmed
operations, realistic timings, suitable guides and usable media.

Luxury is a service and delivery standard, not a theme by itself. Show it
through accommodation, access, specialist guiding, transport and support.

### Private driver and road travel

Treat this as a transport service rather than a complete journey. Before
launch, define:

- operating regions and route limits;
- vehicle classes and passenger/luggage capacity;
- daily hours, mileage and overtime;
- driver language and the difference between driver and guide;
- inclusions, exclusions, pricing method and cancellation terms.

### Day tours and short escapes

Launch a separate collection after at least three consistently deliverable
one- or two-day products exist. Every product needs pickup details, duration,
route, guide language, vehicle, inclusions, price or quote basis, and
cancellation terms.

## Navigation rules

- The JOURNEYS menu reads published journeys marked `navFeatured`.
- Tailor-made Yunnan is always shown as a separate planning service.
- Draft and planned products are never rendered as placeholders.
- Add a new public product family only after real inventory exists.

## Recommended growth order

1. Expand Private Yunnan Journeys to cover useful durations, regions and
   traveler needs.
2. Turn proven interests into Signature Journey collections.
3. Launch Private Driver only when service boundaries and pricing are clear.
4. Launch Day Tours & Short Escapes when short-product operations are stable.
