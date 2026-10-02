# KARTÚ website — rules for Claude Code

London interior design studio, two founders. Brand idea: "duality and dialogue"; KARTÚ = "together" in Lithuanian.
Source of truth for design: the approved **KARTÚ Design System** (claude.ai artifact). Do not invent new visual language.

## Stack
- Next.js (App Router) + TypeScript, static-first. Deploy: Vercel.
- Content: `src/content/site.ts` (final client copy — never rewrite it). CMS (Sanity or Payload) comes later; keep content access behind `src/content/*` so swapping is local.
- Styles: tokens in `src/styles/tokens.css`. Components use CSS Modules or token-based inline styles. **No hard-coded colours, fonts or font sizes** — always a `var(--…)` token.

## Brand guardrails (non-negotiable)
- Colours: only the 7 brand colours in tokens. `--kartu-taupe` is never used for text (fails WCAG AA) — use `--text-muted`.
- Terracotta is for focus rings and submit hover only, never links.
- Logo: real SVG/PNG files from `/public/images/logo/` only. Never set the logo in text. White on hero/overlay, black elsewhere. Footer uses the K symbol.
- Fonts: Agatho Light (display), Futura PT 300–600 (UI/body). Self-hosted WOFF2. Licence for web use must be confirmed before launch.
- No rounded corners, no shadows, no gradients except `--hero-scrim`.
- Motion: subtle and soft — `--ease-out`, durations from tokens. Always honour `prefers-reduced-motion`.

## Naming (BEM-like, mirrors design sections)
`section-element--modifier`, e.g. `hero-title`, `hero-sub`, `projects-card--wide`, `studio-founders`.
Use the same names in components, CSS classes and when discussing fixes.

## Images
- Originals go in `/assets-src/photos/` (git-ignored if large). Run `npm run images` to generate AVIF/WebP at 640/1080/1600/2400 into `/public/images/photos/`.
- Always `next/image` (or the `Photo` component) with `sizes`, real `alt` text, lazy-loading below the fold. Hero images get `priority`.
- Mixed ratios: `object-fit: cover` at fixed ratios; wide images always start a new row.

## Layout rules learned from the prototype
- 12-column grid, `--grid-gap` 48px desktop. Gallery placements: full, wide, half-l/r, nar-l/r, mid, small-l/r, drop.
- Projects index: alternating 7/5 then 5/7 columns, ratio 4/3, equal heights.
- Below 560px the header stacks; all grids collapse to one column.

## Accessibility baseline
- Semantic landmarks, one `h1` per page, real `<a href>` / `<button>`.
- `:focus-visible` terracotta outline. Contrast ≥4.5:1 for text.
- Slideshow: keyboard arrows scoped to the component (not global), visible controls, slide counter.

## Workflow
- Build one section at a time; check at 1440px and 390px (Playwright screenshots) before moving on.
- Never commit secrets. Contact form posts to `/api/contact` (serverless); provider key in env.
- When a correction is given, add the lesson to this file so it isn't repeated.

## Open client decisions (do not resolve silently)
- Hero image crop and scrim strength on Home.
- Font web licence + WOFF2 sign-off.
- Sea-side Residence high-res photography (current set is low-res).
- Founder portraits for Studio page.
