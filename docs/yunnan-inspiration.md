# Yunnan destination inspiration

Shared YunnanInspiration reads eight places from src/lib/yunnan-inspiration.ts. Its display variant can be reused on the destination hub. The custom page uses selectable mode within JourneyInspirationProvider; form submission joins selected place names with the existing manual destination text, without changing that input. Selection remains in memory until navigation/reload and is optional. Remove buttons sync back to cards. Backend destination limit is 700 characters to accommodate the original 300-character manual preference plus all eight choices.

Guide links target existing Dali and Shaxi headings. Other places link to the published Yunnan hub and are labeled Explore Yunnan, not an unpublished destination guide. Replace the data entry when a dedicated guide is published; keep links crawlable. No new thin destination pages are created.

Photos are optimized WebP derivatives of existing repository images (800px longest edge, quality 84). Dali, Erhai, Shaxi, Lijiang, Tiger Leaping Gorge and Shangri-La reuse the existing article photographs and their source attribution. Jade Dragon Snow Mountain and Blue Moon Valley reuse public/assets/resources/晴天的玉龙雪山.jpg and 丽江-蓝月谷-310.jpg supplied with the project materials. Original images are retained.

Analytics: journey_place_select (destination, selected), journey_place_guide_click (destination), journey_inspiration_plan (selected_count); all carry cta_location=custom_inspiration. No manual preferences or other personal fields are tracked. Existing custom form events remain.

Validation: production build, TypeScript and changed-file ESLint; local desktop/mobile card layout and photographs; selection to enquiry payload with manual text; failed submission retaining draft and selection; focused visible success using mocked API (no email sent); existing Shaxi/Dali heading targets.
