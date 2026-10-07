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
- Motion: GSAP + Lenis. Line-mask headline reveals, blind image reveals, gentle parallax, pinned projects scene on Home (desktop only).
  Decided 2 Oct 2026 by the project lead, overriding handover brief §8.3 ("no parallax or dramatic zoom") — **must be shown to the founders for sign-off.**
  Always honour `prefers-reduced-motion` (everything static).
  **Motion is progressive enhancement** (lesson, 3 Oct 2026): content is visible in the HTML by default; animations only run when `html.js-motion` is set by the inline head script (`src/motion/enabled.ts`), which skips automated browsers (`navigator.webdriver`) so screenshot/review tools and print never capture hidden blocks as empty space. Gate every new animation with `motionEnabled()`. Never use `autoAlpha`/`visibility:hidden` on blocks that contain links (breaks keyboard focus) — animate `opacity`.
  QA with Playwright: add init script `Object.defineProperty(Navigator.prototype,'webdriver',{get:()=>false})` to see the motion version.
  **Image motion is desktop-only** (client request 07/10): blind reveals, parallax, hero drift and the pinned scene run only under `DESKTOP_IMAGE_MOTION` (≥901px + mouse/trackpad). Phones and tablets get static photos; text reveals stay everywhere.
  **Performance rule** (lesson 07/10): animate only `transform`/`opacity`. No `clip-path` or `scale` animations on photos — they re-raster large images every frame (measured: −90% raster cost after switching reveals to two opposite translateY transforms). Lenis `lerp: 0.15`.

## Naming (BEM-like, mirrors design sections)
`section-element--modifier`, e.g. `hero-title`, `hero-sub`, `projects-card--wide`, `studio-founders`.
Use the same names in components, CSS classes and when discussing fixes.

## Images
- Sources: `~/Downloads/Assets - KARTU WEBSITE/03_PROJECTS/*` (originals). `assets-src/manifest.json` maps every web file to its original.
- Galleries use the complete approved set in folder order (handover §3). Hero = first file; Projects-index and Home thumbnails are the client-specified files.
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
- Never commit secrets. Contact form posts to `NEXT_PUBLIC_FORM_ENDPOINT` (GitHub Actions variable `FORM_ENDPOINT`, e.g. Formspree). Without it the form opens a prefilled mailto. **Never show a success state without a real 2xx response.**
- Share previews: `node scripts/og.mjs` regenerates `public/og/*.jpg` (1200×630) and the favicon. Set `SITE_URL` to the real domain at launch (canonical/og:url).
- When a correction is given, add the lesson to this file so it isn't repeated.

## Client debrief 06/10 — decisions now in the build
- Intro screen before Home: taupe (#A3968E, the brand colour shown in the debrief), white logo centred, click to enter (short fade), no auto-redirect. Shown once per browser session when the visit starts on Home (`src/sections/home/IntroScreen.tsx`, gate in `motionBootScript`).
- City/country is never displayed (cards, scene, project meta, next-project band, meta descriptions). `location` stays in data only.
- Photos keep their original proportions wherever the client picked them (Home scene, Home studio split = 9385, Projects index). Don't crop to squares.
- Underlined text links sit directly under their text, 30px gap (Home scene, Home studio, Home services, contact band).
- Footer: contact left, K symbol right, no nav.
- Project heroes/crops: `heroPosition` per project (measured from the client's mock-ups). Gallery orders follow the client's lists; hero image is excluded from its gallery. Layout grammar for reordered galleries: landscape → full row, portraits → pairs (auto even / lead-l / lead-r rhythm), a lone portrait → mid. `{ pair: "lead-l" }` pins a pair's variant.
- Family House: client order listed ADI_8274 twice and omitted ADI_8174 → 8174 placed in the repeated slot (confirm).
- All projects use the immersive template (decision 07/10 by the project lead; Shepherd's Bush was the test). Shepherd's Bush keeps its hand-tuned sequence in `src/content/immersive.ts`; the others are generated by `buildImmersive()` from the client's photo order: intro = client's main (index) image + facts, hero band with `heroPosition`, concept panel beside the first portrait, portraits in rows of 2/3, landscapes full width (two in a row sit side by side), story panel about halfway. The classic gallery code remains in the project page but is unused.
- Home projects scene: one shared 2:3 frame for all slides (07/10) — differing photo widths made the wipe look ragged.
- Project photos are never cropped (client 07/10): the hero is shown whole — a landscape hero fills the width at its own proportions, a portrait hero joins the gallery. `heroPosition` is no longer used on project pages.
- Project descriptions never mention remote work (client 07/10): "Remote" removed from scopes and stories. The Services "Designing across borders" copy is separate and unchanged.
- Studio: no interior photography; two 3:4 founder portrait placeholders (`founders` in site.ts — set `photo` when supplied).
- Services: copy per debrief; compact split layout; images services-01/02/03 kept, kitchen detail replaced by 9374 + 9292.
- Agatho has no Ú glyph — never set "KARTÚ" in Agatho; use Futura PT.

- Contact page = three ways to begin (approved by the client 07/10): book a 20-min introductory call · message (WhatsApp/Telegram) · write (form + email). Channels live in `contactChannels` (site.ts); anything empty is hidden — no booking link → "Request a call" opens a prefilled email with the 3 questions; no messengers → card 02 is hidden. Booking questions (no budget) are configured in Cal.com/Calendly. Never ship a mock calendar or placeholder numbers.

## Open client decisions (do not resolve silently)
- Booking link (Cal.com or Calendly), WhatsApp Business number, Telegram handle → `contactChannels`. When booking is connected, add the provider to the Privacy Policy.
- Not yet approved from the 07/10 proposal (branch `proposal/start-a-conversation`): "What happens next" + reply time, prompts at the end of projects / Services / Studio, two links in the contact band.
- Instagram handle → `INSTAGRAM_URL` in `src/content/assets.ts` (footer item hidden until set).
- Founder portraits → `founders[].photo` in site.ts (khaki 3:4 placeholders until supplied).
- Hero video: spec delivered; set `heroVideo` in `src/content/page-images.ts` when the files arrive.
- Form provider + reply-time line on Contact (new copy, needs approval).
- Home service names differ from the 5 stage names on Services (client copy — flag, don't rename).
- Hero image crop and scrim strength on Home.
- Font web licence + WOFF2 sign-off.
- Sea-side Residence high-res photography (current set is low-res).
- Motion layer vs client brief §8.3 (see Motion above).
- Home hero: approved crop of 9153 (door jamb removed); hero video deferred, markup should stay video-ready.
