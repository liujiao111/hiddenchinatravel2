# Microsoft Advertising conversion tracking

UET tag: 97281599. The shared locale root layout loads the base tag once and enables automatic SPA page tracking. Both English and Chinese routes are covered, including the six-day journey.

The existing trackEvent helper also queues these Microsoft custom events:
- generate_lead: only after an enquiry API confirms success.
- whatsapp_click: an intentional consultation link click, with existing click deduplication. This does not confirm a sent message.

Other analytics events are not sent as UET conversion events. Microsoft receives no form fields, lead references, attribution payload or nominal GA value through these custom events. Explicit analytics denial suppresses these conversion events. The existing site has no consent UI; this change does not add one or implement a complete regional UET Consent Mode flow.

## Microsoft Ads account configuration

Associate both event goals with tag 97281599. Set Action equals generate_lead or whatsapp_click respectively; do not require category, label or event value. Use no revenue value for enquiry goals, rather than variable sales revenue. Count Unique for leads. Prefer generate_lead as the bidding goal and observe whatsapp_click separately as a weaker signal. Review campaign-specific goal settings if both are included in bidding.

Enable Microsoft click ID auto-tagging. Existing attribution already captures msclkid.

## Verification

Run npm run test:whatsapp, npm run check:faq and next typegen followed by tsc --noEmit.

After deployment, use Microsoft UET Tag Helper on the journey page. Page loading alone must not emit either custom event. Validate one real successful form submission and one WhatsApp click; failed forms must not emit generate_lead. Tag active alone does not verify the two custom goals. Microsoft Ads attribution and goal recognition still require live account-side verification.

References:
- https://help.ads.microsoft.com/apex/index/3/en/56686
- https://help.ads.microsoft.com/apex/index/3/en/56688
