# KARTÚ website — rules for Claude Code

London interior design studio, two founders. Brand idea: "duality and dialogue"; KARTÚ = "together" in Lithuanian.
Source of truth for design: the approved **KARTÚ Design System** (claude.ai artifact). Do not invent new visual language.

## Stack
- Next.js (App Router) + TypeScript, static-first (`output: "export"` → `out/`).
- **Live: https://kartuinteriors.com on Cloudflare Pages** (since 10/11/2026). Project `kartu-site` in the account "Jurgita.macnaughton@hotmail.co.uk's Account" (the project lead is a member). Every push to `main` builds and deploys automatically: build `npm run build`, output `out`, env `SITE_URL=https://kartuinteriors.com`, `NODE_VERSION=22`. Fallback URL: kartu-site.pages.dev. The Cloudflare GitHub app has access to this one repo only.
- DNS (same Cloudflare zone): `@` and `www` CNAME → kartu-site.pages.dev (proxied). Redirect rule "www → kartuinteriors.com": `*://www.kartuinteriors.com/*` → `https://kartuinteriors.com/${2}`, 301, query string kept. **Never touch the Microsoft 365 mail records** (MX, SPF TXT, autodiscover CNAME, MS= verification TXT).
- GitHub Pages workflow still builds a noindex review preview at gypsypowerman-del.github.io/kartu-site.
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
  **Home projects rail** (client 11/10, replaced the pinned scene the same evening): the Home "Projects" block is a horizontal rail of all six projects — `overflow-x` + `scroll-snap-type: x mandatory` + `scroll-snap-stop: always`, so one flick moves exactly one project with no JS in the loop. **Lesson: never hijack the page scroll.** The scene it replaced pinned with ScrollTrigger, scrubbed off scroll position, and then locked Lenis for up to 1.4s per change to force one-flick-one-project — two systems driving the same scroll, which is exactly why it stuttered and dropped gestures. JS in `HomeProjects.tsx` now only drives the arrows, the counter and drag-to-scroll; the rail works without it. Rolling back = revert the commit; nothing else depends on it.
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
- **Production build needs `SITE_URL`** (the real domain): canonical, og:url/og:image, robots.txt and sitemap.xml are built from it, and the build fails without it. Preview builds set `NEXT_PUBLIC_PREVIEW=1` (noindex + robots disallow). On Cloudflare Pages set `SITE_URL` (done) and `NEXT_PUBLIC_FORM_ENDPOINT` (Formspree, pending); never `BASE_PATH`/`NEXT_PUBLIC_PREVIEW`. Local QA: `NEXT_PUBLIC_PREVIEW=1 npm run build`.
- Fonts: Latin subsets in `public/fonts/` (`npm run fonts`, originals in `fonts-src/`), declared in `layout.tsx` with the base path; Futura PT 300 + Agatho are preloaded. Studio email lives in `studioEmail` (site.ts).
- Header and hero copy align with the page grid (`.wrap`) at every width; rules and photos stay full-bleed.
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
- Home projects rail (client 11/10): all six projects, cards at a fixed 3/4 frame, the track bleeding into the right gutter so the next card is visibly cut off — that cut, not the arrows, is the main signal there is more to the side. **No counter** (client 11/10, after two attempts): with two or three cards on screen at once there is no single "current" project, so every way of numbering one read as wrong — `round(scrollLeft / cardWidth)` stopped at 04 of 06 at the end (the last card can never reach its snap position), and a visible-span range ("04–05 / 06") just read as noise. Position is now shown by a hairline bar whose thumb is as wide a share of the track as is on screen and sits at `scrollLeft / maxScroll` — scroll geometry, nothing counted, so it cannot disagree with what the visitor sees. Arrows are bare long-stemmed glyphs (no box: the brand has no rounded UI and no buttons of that kind) that shift 5px on hover, with a hairline between them. Supersedes the 07/10 shared-2:3-frame note and the three-project selection on Home. **If the portfolio grows past ~8, cut the rail back to a selection and let Projects carry the rest** — otherwise the index page loses its job.
- Project photos are never cropped (client 07/10): the hero is shown whole — a landscape hero fills the width at its own proportions, a portrait hero joins the gallery. `heroPosition` is no longer used on project pages.
- Project descriptions never mention remote work (client 07/10): "Remote" removed from scopes and stories. The Services "Designing across borders" copy is separate and unchanged.
- Studio: both founder portraits start on one line (client 11/10) — they were staggered by two `--grid-drop`s, and with equal 3/4 frames that read as a misalignment, not as rhythm. No interior photography; two founder portraits in 3:4 frames (`founders[].photo` in site.ts; supplied 11/10 — Anna 3:4, Jurgita 2:3 shown centred in the 3:4 frame).
- Services: copy per debrief; compact split layout; images services-01/02/03 kept, kitchen detail replaced by 9374 + 9292.
- Agatho has no Ú glyph — never set "KARTÚ" in Agatho; use Futura PT.

- Contact layout (client 11/10): two rows on one two-column grid — 01 Call + 02 Message on top; 03 "Write to us" below with its text under 01 and the form under 02 (no separate "Write to us" card). Card links align on one line.
- Home section headings (client 11/10): **every Home section is titled by its own name, in Agatho at `--type-h2`** — Projects, Studio, Services. The Studio block used to lead with a small "Studio" eyebrow over a large "Creating together.", so the one word naming the section was the smallest thing on screen while the other two sections had their name as the big line. The client read that as inconsistent, and she was right. "Studio" is now the h2, the eyebrow is gone, and "Creating together." sits under it at the subtitle step (`--type-subtitle`: Futura Book 28 / 26 / 24px — the Subtitle row of the brand guidelines' type ladder, which the site had no token for until now). **Lesson: a section's name is its heading — don't demote it to a label above a phrase.** A related bug found on the way: `.home-studio__title` was hard-coded at 38px and so ignored the `--text-h2` steps (40 / 34 / 30), making it 38px next to the others' 30px on a phone; it now uses the token. **Never hard-code a heading size.** Still hard-coded elsewhere and due the same fix: `.contact__title` 48px, `.project-head__title` 44px, `.colour-block__title` 28px, `.contact-form__done-title` 28px, `.legal__section h2` 26px.
- Beregovoy image order (client 11/10): the bedroom (19) sat beside the concept panel; the client wants it down with the other bedroom view (20) and the kitchen/dining (03) in its place. Done in data, not by hand-authoring the sequence: `hero` is now 03 (a portrait hero just leads the gallery, and every Beregovoy photo is portrait, so `hero` only decides what `buildImmersive()` puts in the concept slot), and 19 was inserted into `gallery` before 20. Result: concept + 03, then rows 02/01 · 06/04/05 · **19/20** · 07/17, story panel + 18 (was 17), 08/10 · 11/14/15 · 16/12/13.
- Contact page = three ways to begin (approved by the client 07/10): book a 20-min introductory call · message (WhatsApp/Telegram) · write (form + email). Channels live in `contactChannels` (site.ts); anything empty is hidden — no booking link → "Request a call" opens a prefilled email with the 3 questions; no messengers → card 02 is hidden. Booking questions (no budget) are configured in Cal.com/Calendly. Never ship a mock calendar or placeholder numbers.

## Client final revisions 10/11 (launch round)
- Beregovoy renamed **Riverside Apartment** everywhere; slug `riverside-apartment` (old /projects/beregovoy/ link is gone — it was only on the review preview). Image files keep the `beregovoy-NN` names; that is internal.
- Home order is its own list (`homeOrder` in site.ts): Shepherd's Bush, Jewellery Studio, City Bay, Riverside, Family House, Sea-side. Projects page and "Next project" keep `projects` order.
- Projects page redesigned (client's preferred option): one horizontal composition per project — 9 columns of photos (landscape + portrait, or three portraits for Riverside), title + "View project" in the last 3. Rows alternate landscape→portrait / portrait→landscape. Never cropped: widths shared by aspect ratio, the landscape scaled to 0.8 of the portrait's height so each row has a lead image; bottom-aligned on odd rows, top-aligned on even. Data: `indexImages` per project. One link per project for keyboard/AT (the title); the photo link is pointer-only.
- Studio spacing tightened: founders paragraph follows the intro (32px), portraits on columns 1–5 and 6–10, captions 16px under the photos, quote 72/56px instead of a full section padding. **Lesson: on text pages, spacing between related paragraphs is paragraph spacing, not section padding.**
- Family House: last two photos (kids' room, family-house-10/11) removed from the page.
- Instagram live: https://www.instagram.com/kartuinteriors/ (tracking parameters stripped).
- Fonts: client has no web licence for Agatho / Futura PT yet but wants them kept — launch risk is theirs, flagged in writing.
- Hero video: still to come; `heroVideo` in page-images.ts.
- **Client file names → web files:** the client refers to originals (ADI_8274++, Гостевая 10000, Photo-50, 2.jpg…). Look them up in `~/Downloads/kartu-web-assets/manifest.json` (each web file → its source). Beregovoy files were renamed in the folder since the client named them: Гостевая NNNNN = `living NNNNN` (10000 → beregovoy-08, 50000 → 09). Sea-side numbered files: 1.jpg = sea-side-06 (dining/kitchen), 2.jpg = 01, 3.jpg = 08 (added 10/11), 4.jpg = 04, 5.jpg = 07 — this corrects the 11/10 note below. New single photos: encode with the `images.mjs` settings and merge into photo-meta.json (never re-run the full script without all originals in assets-src — it rewrites photo-meta from whatever is there).
- Home thumbnails 10/11: Family House = ADI_8274 (family-house-12), Riverside = Гостевая 10000 (beregovoy-08); Sea-side = "Warm Rustic Green Kitchen Interior" (emailed PNG, 1024×1536) as sea-side-09 — Home card only, not in the project gallery.
- Projects page pairs 10/11: SB 9153 + 9235 (01, 06) · Riverside 020000, 100000, 130000 (01, 04, 06) · Jewellery ADI_1547 + ADI_1491 (01, 04) · City Bay Photo-44 + Photo-50 (13, 17) · Family House ADI_8345 + ADI_8366 (17, 18) · Sea-side 3.jpg + 558397436…_n (08, 02).
- Riverside: Гостевая 10000 sits beside Project Story via `storyImage` (buildImmersive removes it from the gallery so it appears once); the previous story photo (18) stays in the gallery.
- Sea-side: hand-tuned sequence in immersive.ts per the client's list. Her list said "landscape 2" twice (steps 4 and 6); 1.jpg, the only landscape left, closes the page — **confirm**. 559380628… and 558931645… weren't in her list and sit as a pair before the story.

## Client revisions 10/11 — second round (PDF "KARTÚ Interiors")
- Projects page: all photos in a row at **equal height** (the 0.8 landscape scale is gone); order `indexOrder` in site.ts: SB, Jewellery, City Bay, Family House, Riverside, Sea-side (Home keeps `homeOrder`).
- Photos beside Concept / Story panels are framed at least 3:4 (`PANEL_PHOTO_MIN` in ImmersiveProject) — a 1:2 portrait read as a sliver next to the panel. Wider photos keep their proportions. This is the one exception to "never cropped", asked for by the client.
- Sea-side sequence: intro 02 · 08 (3.jpg) · Concept + 05 · 06 (1.jpg) · Story + 07 · row 04/07/09 · 01 (2.jpg); 03 removed. Her row "4, 5, kitchen" repeats 5.jpg = the Story photo — flagged.
- Riverside sequence is written in immersive.ts as `riverside-apartment-pending` until Гостевая 20000 / 40000 (emailed) are added as beregovoy-21 / -22; then rename the key. Her list puts Гостевая 20000 both by the intro and in the guest row — flagged. Коридор 10000 (hall 10000 = 14) removed.
- Riverside folder names (English now): Спальня = Spalna, Гардеробная мастер = garderob, Мастер СУ 10000 = Master 10000 (17), Мастер СУ 30000 = Master bath 30000 (18), Гостевая ванная = guest bathroom (10000 → 10, 40000 → 11), Коридор = hall (10000 → 14, 30000 → 15, 50000 → 16).

## Open client decisions (do not resolve silently)
- Booking: Microsoft Bookings since 10/11 (`contactChannels.booking`) — opens in a new tab, no iframe, so no third-party cookies on our pages; the Privacy Policy names it automatically. (WhatsApp +44 7768 392053 set 07/10; Telegram @annaprycheva set 11/10 — it renders in card 02 "Message us" beside WhatsApp, and the Privacy Policy messengers line picks it up automatically.)
- Not yet approved from the 07/10 proposal (branch `proposal/start-a-conversation`): "What happens next" + reply time, prompts at the end of projects / Services / Studio, two links in the contact band.
- Hero video: spec delivered; set `heroVideo` in `src/content/page-images.ts` when the files arrive.
- Form provider: Formspree chosen 10/11 — the project lead creates the account on hello@kartuinteriors.com and sends the form URL → add `NEXT_PUBLIC_FORM_ENDPOINT` in Cloudflare Pages (Settings → Variables) and redeploy. Reply-time line on Contact still needs copy approval.
- Home service names differ from the 5 stage names on Services (client copy — flag, don't rename).
- Hero image crop and scrim strength on Home.
- Font web licence + WOFF2 sign-off.
- Sea-side Residence: 11/10 four photos replaced by the client's better files (folder 1.jpg→01, 4.jpg→04, 1.jpg dining→06, 5.jpg→07; same 2048px max but far less compression). 02, 03, 05 still the low-res originals; 3.jpg (wide living room) unused — 05 is a portrait crop of that scene. Full-size originals (>3000px) still welcome.
- Place names inside client concept/story copy (Beregovoy: Italy/France/Moscow; Shepherd's Bush: "London exterior") vs the "no city/country" rule — confirm with the client; don't edit silently.
- Privacy Policy (client copy): published address in Offord D’Arcy (Cambridgeshire) and "… MacNaughton is the data controller" (are?) — confirm. The Messaging/Booking section is generated from `contactChannels` (added 11/10 with the project lead's OK).
- Gallery alt texts are generic ("<Project> — view N"); short descriptions per photo would help accessibility/SEO (content task).
- Motion layer vs client brief §8.3 (see Motion above).
- Home hero: approved crop of 9153 (door jamb removed); hero video deferred, markup should stay video-ready.
