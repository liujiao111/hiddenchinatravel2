<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Hidden China Travel article content rule — required

Before editing or publishing `_posts/*.md` or `_posts-zh/*.md`, read `PROJECT.md` §19.

- Article FAQs have one source of truth: YAML frontmatter `faqs` rendered by `src/components/article-page.tsx`, including JSON-LD.
- Never add an inline `## FAQ`, `## Frequently Asked Questions`, `## 常见问题` or `## 常见问答` section to a post that has frontmatter `faqs`.
- If a supplied draft contains inline questions, put them in `faqs` only. Preserve useful information, links, tables, pictures, and author notes when migrating older FAQ sections.
- English and Chinese content must follow the same rule. Posts without FAQs do not require them.
- Run `npm run check:faq` before finishing; do not bypass failing checks.
