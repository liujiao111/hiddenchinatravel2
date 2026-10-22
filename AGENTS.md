<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

- Install with `npm ci`. Node.js 22 is enough for this Next.js 16 app.
- Dev server: `npm run dev -- --hostname 0.0.0.0 --port 3000`. Open `http://localhost:3000`. Next.js blocks dev resources, including the HMR websocket, for `127.0.0.1` when the server hostname is `0.0.0.0`. `localhost` is allowed, and client components do not hydrate at `127.0.0.1`.
- Checks: `npm run lint` and `npm run build` (`next build` typechecks). `npx tsc --noEmit` reports a missing `LayoutProps` until Next has generated route types.
- Tests: `node --test tests/yunnan-country-guides.test.mjs`.
- `RESEND_API_KEY` is optional in development. `/api/enquiry` logs the note and returns success when the key is unset. Real email needs `RESEND_API_KEY`, `ENQUIRY_FROM_EMAIL`, and `ENQUIRY_TO_EMAIL` from `.env.example`.
