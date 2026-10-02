# KARTÚ — website

Production build of the KARTÚ interior design studio website (London).

- **Stack:** Next.js 15 (static export) · TypeScript · GSAP + Lenis for motion
- **Design source:** approved KARTÚ Design System; rules for contributors in [`CLAUDE.md`](CLAUDE.md)
- **Preview:** deployed to GitHub Pages on every push to `main` (`.github/workflows/pages.yml`), marked `noindex`.

```bash
npm ci
npm run dev        # http://localhost:3000
npm run build      # static site in ./out
npm run images     # regenerate AVIF/WebP from assets-src/photos (originals not committed)
```

Open items before public launch are listed at the end of `CLAUDE.md` (font web licence, contact-form backend, Instagram handle, founder portraits, motion sign-off).
