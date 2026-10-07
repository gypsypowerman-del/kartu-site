# KARTÚ — Hero video: technical specification

**For:** the video designer · **Used on:** Home page hero (full-width background behind the logo, navigation and "Interiors created through dialogue." text) — and, as the same standard, any other full-width video section on the site.

## 1. One reusable standard — two versions

The hero fills the whole screen, so the visible crop changes with the screen's proportions. A single horizontal film would lose ~70% of its width on a phone, so please deliver **two versions of the same film**:

| | Desktop / tablet | Mobile |
|---|---|---|
| Aspect ratio | **16:9** (landscape) | **9:16** (portrait) |
| Delivery resolution | **1920 × 1080** | **1080 × 1920** |
| Master (archive) | 3840 × 2160 ProRes 422 HQ | 2160 × 3840 ProRes 422 HQ |

The same pair (16:9 + 9:16) is the standard for any future full-width video section, so nothing has to be re-shot for other pages.

## 2. Format and encoding (web files)

| Setting | Value |
|---|---|
| Container / codec | **MP4, H.264** (High profile), `yuv420p`, 8-bit, Rec.709 |
| Optional second file | WebM (VP9 or AV1) of the same cut — smaller files for Chrome/Firefox; not required for launch |
| Frame rate | **25 fps**, constant (24 fps also fine). Not 50/60 fps — doubles the file size for no visible benefit at this pace |
| Bitrate | CRF ≈ 23–26 (two-pass), roughly **3–4 Mbps** desktop, **≈ 2 Mbps** mobile (at 12 s that gives ≈ 5–6 MB and ≈ 3 MB) |
| Keyframe interval | every 2 s |
| Audio | **None — remove the audio track** (the video plays muted; browsers only autoplay silent video) |
| Web optimisation | "Fast start" (moov atom at the front), metadata stripped |

## 3. Duration, size, loop

- **Length:** 8–15 s, ideally **10–12 s**.
- **File size:** desktop **≤ 6 MB** (aim for 4–5 MB), mobile **≤ 3 MB**. Above this the first seconds stutter on average connections.
- **Seamless loop: yes.** The last frame must flow into the first — a slow continuous camera move that returns to its start, or a gentle cross-dissolve built into the edit. No hard cut at the loop point.

## 4. Composition (what the layout covers)

- **Bottom-left ~45% of the width × lower 40% of the height** carries the headline, sub-line and "View Projects" link (white text on a soft dark gradient). Keep this area calm: no bright windows, busy pattern or fast movement there.
- **Top ~120 px** carries the white logo (left) and navigation (right) — keep it reasonably dark/quiet.
- Keep the main subject inside the **central 70%** of the frame: on wider or narrower screens the edges are cropped.
- **No text, logo or watermark in the video** — the site adds these.
- **Pace:** slow and calm (brand: understated, no dramatic zooms). Avoid flashes and rapid cuts.
- Avoid heavy film grain or noise — it inflates the file size and shimmers after compression.

## 5. Poster image (required)

A still taken from the opening frame of each version — **2400 × 1350 JPG** (desktop) and **1350 × 2400 JPG** (mobile), quality ~80. It is shown while the video loads, on slow connections, and to visitors who switch off motion in their device settings.

## 6. Deliverables and file names

```
kartu-hero-desktop.mp4      1920×1080, H.264, 25 fps, no audio, ≤ 6 MB
kartu-hero-mobile.mp4       1080×1920, H.264, 25 fps, no audio, ≤ 3 MB
kartu-hero-poster.jpg       2400×1350
kartu-hero-poster-mobile.jpg 1350×2400
(optional) kartu-hero-desktop.webm, kartu-hero-mobile.webm
(archive)  ProRes 422 HQ masters
```

## 7. How the site uses it

The video is decorative: it plays muted and looping, starts on the poster, shows only the poster for visitors with "reduce motion" switched on, and has a small "Pause video" control (accessibility requirement for moving content longer than 5 s). The site is already prepared — once the files arrive they are added in one place (`heroVideo` in `src/content/page-images.ts`).
