# Hidden China Travel — UI Design System

Version: 1.0  
Applies to: homepage, destination hubs, journey/product pages, practical guides, About pages, and conversion landing pages.

## 1. Design direction

Hidden China Travel should feel like a calm, knowledgeable local host: refined enough for a considered private journey, but never formal, distant, or artificially luxurious.

The visual system takes structural inspiration from established tailor-made travel websites while remaining an original Hidden China Travel design. Do not reproduce another brand's copy, logo, photography, awards, reviews, proprietary illustrations, or distinctive branded assets.

### Core qualities

- Immersive: lead with real, place-specific photography.
- Unhurried: generous spacing and a restrained content rhythm.
- Trustworthy: clear language, real capabilities, no invented social proof.
- Experience-led: emphasize pace, people, local life, and feeling—not attraction checklists.
- Practical: conversion paths and China travel preparation should remain easy to find.

## 2. Brand palette

| Token | Value | Use |
|---|---:|---|
| `--ink` | `#282821` | Primary text and dark details |
| `--cream` | `#F5F5EF` | Default page background |
| `--sand` | `#D8D4BB` | Editorial sections and process panels |
| `--green` | `#4E7671` | Brand panels, Mega Menu, trust sections |
| `--blue` | `#087EB8` | Primary high-intent CTA only |
| White | `#FFFFFF` | Cards, text on dark photography, reverse buttons |
| Footer charcoal | `#474746` | Footer background |

### Color rules

- Green is the main brand color; blue is reserved for strong enquiry actions.
- Avoid introducing unrelated accent colors page by page.
- Use cream and sand to create hierarchy without excessive borders or card boxes.
- Ensure text remains readable over photography with a dark gradient overlay.

## 3. Typography

### Display type

Use Georgia or a compatible editorial serif for:

- `h1`, `h2`, `h3`
- testimonials or editorial quotations
- large destination and journey titles

Headings use regular weight, tight line height, and sentence case. Avoid bold sans-serif marketing headlines.

### Interface and body type

Use Geist Sans for:

- body copy
- navigation
- buttons
- metadata
- form fields

Body text should normally be at least `16px`, with line height around `1.7`.

### Section headings

- Use one clear module title as the heading.
- Do not stack an uppercase kicker, a second headline, and a subtitle that repeat the same idea.
- Supporting copy is optional and should add information rather than rename the module.
- Reserve small uppercase labels for card metadata or rare contextual cues, not standard section headings.

## 4. Layout and spacing

- Main content width: maximum `1180px`.
- Standard horizontal gutter: `20px` mobile, `20–40px` desktop.
- Standard section spacing: approximately `96px` desktop and `70px` mobile.
- Narrow editorial copy: maximum `790–840px`.
- Prefer full-width visual bands alternating with constrained editorial sections.
- Avoid placing every section inside a rounded card.

## 5. Header and Mega Menu

The header uses two levels:

1. White brand bar with logo, short positioning message, and primary planning CTA.
2. Pale navigation bar with compact uppercase navigation and search.

### Desktop Mega Menu

- Opens on hover or click and closes on mouse exit, close button, or selecting a link.
- Full viewport width beneath the navigation.
- Brand green background with white text.
- Small triangular pointer marks the active navigation item.
- Use editorial serif headings and compact sans-serif links.
- Divide content into three or four meaningful columns.
- Include no more than two featured content cards.
- Use a subtle white divider between major groups.

Destination menu structure:

- Most popular destinations
- Explore by region
- Featured or recently added Yunnan content
- Clear “All destinations” link

Other menus may use:

- Three link groups
- One highlighted conversion panel

### Mobile navigation

- Keep only the most important top-level options visible.
- Mega Menu becomes a vertically scrollable overlay below the header.
- Columns stack vertically.
- Close control remains fixed and easy to reach.

## 6. Buttons and links

### Primary CTA

- Blue background with white text.
- Use for `Plan my journey`, `Chat on WhatsApp`, or equivalent high-intent actions.
- Only one visually dominant CTA per viewport.

### Secondary CTA

- Green background with white text.
- Use for browsing journeys, guides, and destination pages.

### Reverse CTA

- White background with dark text.
- Use on photographs or dark green panels.

### Button shape

- Nearly square corners (`2px` radius).
- Minimum height `46px`.
- Uppercase compact label.
- Do not use pill-shaped buttons.

Text links may use a simple underline or arrow. Avoid filling editorial sections with buttons.

## 7. Photography

- Use real destination photography only.
- Prefer supplied or licensed images from Unsplash, Pexels, or Wikimedia Commons.
- Convert final assets to WebP.
- Do not use AI-generated images for real destinations or travel experiences.
- Keep people and local life present where possible; do not rely only on empty landscapes.
- Hero images should have a clear focal point and enough negative space for copy.
- Apply overlays for readability rather than editing text directly into images.

## 8. Core page modules

### Immersive Hero

- Full-width destination image.
- One emotional headline, one concise supporting sentence, and no more than two actions.
- Desktop height around `530–670px`; mobile around `460–590px`.
- Use a cream editorial bridge that slightly overlaps the Hero when the next module is visually heavy.

### Editorial introduction

- Centered, narrow column on cream or sand.
- One clear positioning statement followed by short supporting copy.

### Destination cards

- Photography-led vertical cards.
- Use overlay copy near the bottom.
- Include destination, short context, and one exploration action.
- Four columns desktop, two tablet, one mobile.

### Guide explorer

- Use topic tabs such as First trip, Payments, Internet, and Getting around.
- Every article card must include a real cover image.
- Cards use a vertical editorial-photo treatment rather than plain text boxes.
- On mobile, preserve image size with intentional horizontal scrolling.

### Preparation checklist

- Treat checklist topics as an editorial index with thin dividers and numbered entries.
- Avoid floating rounded SaaS-style feature cards and decorative app icons.
- Keep the checklist visually quieter than the article and journey modules.

### Journey cards

- Present itineraries as starting points, not rigid packages.
- Show region, journey name, duration, and travel format.
- Use three columns desktop and horizontal scrolling on mobile.
- Never invent exact pricing before a local partner confirms it.

### Process section

- Three to six numbered steps.
- Keep explanations concise and focused on what the traveler experiences.
- Clearly distinguish Hidden China Travel's planning/lead role from the licensed operator's contracting and delivery role.

### Trust section

- Green background, white text, three or four promises.
- Use only verifiable claims.
- Do not imitate awards, review counts, years in business, or 24/7 support unless those claims are confirmed.

### Conversion band

- Full-width real photograph with overlay.
- Address one planning uncertainty.
- Drive to WhatsApp or an active lead-capture flow.

### Newsletter / lead magnet

- Dark background immediately before the footer.
- One clear resource, such as the Free Dali Local Guide.
- Do not show a working form until its Brevo integration is active.

## 9. Content and conversion rules

- Lead with the traveler's desired experience, not company claims.
- Use “at your pace”, “local insight”, and “personalized journey” consistently but not repetitively.
- Prefer specific promises over generic luxury language.
- Current service wording should describe connections to licensed local operators, drivers, and guides—not imply that Hidden China Travel directly operates tours.
- WhatsApp links should use scenario-specific prefilled messages.
- Survival guides build trust; journey pages and contextual CTAs drive enquiries.
- Low-, medium-, and high-intent actions should remain distinct.

## 10. Responsive and accessibility rules

- Design mobile behavior at the same time as desktop behavior.
- Keep body and interface text readable at 200% zoom.
- Every meaningful image requires descriptive alt text.
- Interactive navigation items must be real buttons or links with visible focus states.
- Mega Menu triggers require `aria-expanded`; close buttons require accessible labels.
- Never rely only on color to indicate state.
- Avoid horizontal overflow except intentional card carousels or the compact mobile navigation row.

## 11. Implementation rules

- Next.js App Router and TypeScript.
- Default to Server Components; use Client Components only for interaction.
- Shared navigation, footer, buttons, and cards belong in `src/components/`.
- Use `next/image` for photographs and declare external sources in `next.config.ts`.
- Use shared CSS tokens rather than adding arbitrary colors in individual components.
- Run `npm run lint` and `npm run build` before every deployment.
- A successful push to `main` must be followed by confirming the Vercel deployment status.

## 12. Pre-publish checklist

- Does the page feel like Hidden China Travel rather than an Audley clone?
- Are all claims currently true and supportable?
- Is the distinction between referral/planning and licensed tour delivery clear?
- Is there one obvious next action for the user?
- Are real photos licensed or already owned by the project?
- Do desktop and mobile layouts both work?
- Are SEO metadata, heading order, alt text, and internal links present?
- Do lint, type checking, and the production build pass?


## 13. Shared article-flow components

Article detail pages use one fixed post-body sequence:

`Continue Exploring China → Start with Yunnan → Talk With Joy`

- `GuideCard` is the single reusable article-card component for article recommendations and guide explorers. It uses a 4:3 real cover image, editorial title overlay, excerpt, optional reading time, and the text action `READ THIS GUIDE`.
- `JourneyCard` is the single reusable product-card component for article recommendations and the Journeys index. It uses a photography-led 4:5 treatment, a dark readability gradient, optional journey facts, and the text action `Explore the journey →`.
- Article pages show 4–6 related guides, exclude the current article, then link to the complete China Survival Kit.
- The featured Yunnan journey comes from published journey data. Do not hardcode price or availability into the article template.
- `Talk With Joy` is a full-width conversion band, never a card or a side-by-side module.
- If no published journey exists, hide `Start with Yunnan`; keep the guide and Joy sections.
