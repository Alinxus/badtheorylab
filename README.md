# badtheorylabs.com

The BTL site. Next.js App Router, TypeScript, CSS modules, deployed on Vercel.

## Running it

```bash
npm install
npm run dev
```

The site comes up at http://localhost:3000.

## Layout

- `src/app` — routes. Each product, paper, and benchmark has its own directory with a `page.tsx`, an optional `layout.tsx` for metadata, and a scoped `.module.css`.
- `src/components` — `SiteNav` is the only shared component with real logic. It holds the single source of truth for the navigation groups.
- `src/app/api` — contact, hackathon, presence, and admin routes.
- `public` — brand assets and paper PDFs.

## Brand

The mark is called The Hold: a level bar over a descending staircase. Precision drops, behaviour holds.

- `btl-mark.svg`, `btl-mark-dark.svg` — two-colour, light and dark ground
- `btl-mark-mono.svg` — single colour, inherits `currentColor`
- `btl-favicon.svg` — redrawn at a heavier stroke, not a scaled-down mark
- `btl-lockup*.svg` — mark plus wordmark, with and without the descriptor
- `og-image.png` — 1200x630

Type is Archivo for display and body, JetBrains Mono for labels and data, loaded through `next/font` in `src/app/layout.tsx` and exposed as `--font-d`, `--font-s`, and `--font-m`. Do not hardcode font families in page styles; use the variables.

The palette lives at the top of each page's `.module.css`: `--ink` `#0b0c0d`, `--paper` `#edeeea`, `--signal` `#ff4d00`. The signal marks the value under measurement. One per screen.

Write "BTL" everywhere. "Bad Theory Labs" stays on the lockup descriptor, the copyright line, and email sender headers.

## Environment

Copy `.env.example` if present, or set `NEXT_PUBLIC_SITE_URL` plus the database and mail keys the API routes read. Without them the site renders but contact and stats will fail.
