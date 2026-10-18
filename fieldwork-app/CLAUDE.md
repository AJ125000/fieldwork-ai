# Fieldwork app: agent instructions

Read these before touching any UI:

1. `DESIGN.md`: the visual and interaction contract. It is authoritative for visuals.
2. `../FIELDWORK-PRODUCT-BRIEF.md`: product behaviour, flows and copy.

## Decisions that override the design board image

The visual board image differs from `DESIGN.md` in places. These decisions are agreed:

- Fonts: IBM Plex Sans, Serif, Mono and Sans Devanagari. Söhne is not used.
- Colours: use the `DESIGN.md` hex values.
- Never show a confidence number in user-facing UI.
- No confetti or celebratory dots on results.
- No shield icon.
- Bottom navigation: Home, Buy, a centre Capture button, Sell, Help.

## Wording

Use the wording in `DESIGN.md`. Never use "Verified", "Certified", "Guaranteed", "AI decided" or "trust score".

## Environment

- Node is portable, at `C:\Users\Akshat Lathi\AppData\Local\Programs\node\node-v24.19.0-win-x64`. It is not on PATH, so call `node.exe`, `npm.cmd` and `npx.cmd` by their full path.
- Stack: Next.js (App Router) + TypeScript + CSS variables (`app/tokens.css`) + CSS Modules, with lucide-react icons and next/font/google for IBM Plex.
- No backend yet: screens use mock data from `lib/mock.ts`. The AI is wired in later (ADK service on Cloud Run).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
