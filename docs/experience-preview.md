# Local experiences — P0/P1 preview
- Product configuration: src/lib/experiences.ts. Add a bilingual record, not a separate detail-page implementation.
- Collection and dynamic product routes render the shared experience template with the existing driver CSS, site header/footer, JourneyHero, JourneyFactCards, driver product/FAQ/process classes and contact-form layout.
- Images are optional in configuration; placeholders do not fetch stock imagery. Use real WebP assets under the project's existing /assets convention once supplied.
- Draft pricing from 大理扎染.docx, not confirmed sell prices. Premium and add-ons are shown in the source currency symbol; verify before launch. No fabricated slots, inventory, ratings, payment, enquiry or order submission. The participant count cap in the preview is only a UI guard.
- Both locales are noindex/nofollow. No production navigation or sitemap changes. P2/P3: confirm supplier address, language, price by piece, capacity/age, booking/cancellation rules, photos; then integrate the existing transaction flow with server-side availability/pricing and payment verification. P4/P5: validate analytics, metadata, responsive layout, release gate and publish.
