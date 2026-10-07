// "Immersive" project template — inspired by the Róisín Lafferty reference (debrief 06/10, slide 12):
// large-scale imagery, almost no unused space, text integrated between the images.
// Shepherd's Bush has a hand-tuned sequence; since 07/10 every other project uses the same
// layout, generated from the client's photo order by buildImmersive() below.
import { pageImages } from "./page-images";
import photoMeta from "./photo-meta.json";
import type { Project } from "./types";

const sb = (n: number) => `/images/photos/shepherds-bush-${String(n).padStart(2, "0")}.jpg`;

export type PanelKind = "intro" | "concept" | "story";
export type PanelTone = "khaki" | "black" | "sky";

export type ImmersiveRow =
  /** large image beside the project introduction (title, concept line, facts) */
  | { kind: "intro"; image: string }
  /** one full-width image */
  | { kind: "full"; image: string }
  /** full-width hero band with the client's crop (project.heroPosition) */
  | { kind: "banner"; image: string; position?: string }
  /** an image paired with a text panel */
  | { kind: "text"; image: string; panel: PanelKind; tone: PanelTone; side: "left" | "right" }
  /** 2–3 images side by side across the full width, equal height, never cropped */
  | { kind: "row"; images: string[] };

export const immersive: Record<string, ImmersiveRow[]> = {
  "shepherds-bush": [
    { kind: "intro", image: sb(2) },
    { kind: "full", image: pageImages["home-hero"] }, // approved crop of 9153 (door jamb removed)
    { kind: "text", image: sb(3), panel: "concept", tone: "black", side: "left" },
    { kind: "row", images: [sb(4), sb(5)] },
    { kind: "row", images: [sb(6), sb(7)] },
    { kind: "full", image: sb(8) },
    { kind: "text", image: sb(9), panel: "story", tone: "sky", side: "right" },
    { kind: "row", images: [sb(10), sb(11), sb(12)] },
    { kind: "row", images: [sb(13), sb(14)] },
    { kind: "row", images: [sb(15), sb(16), sb(17)] },
    { kind: "row", images: [sb(18), sb(19)] },
    { kind: "row", images: [sb(20), sb(21)] },
    { kind: "row", images: [sb(22), sb(23), sb(24)] },
  ],
};

const META = photoMeta as Record<string, { w: number; h: number }>;
const ratio = (src: string) => {
  const m = META[src.split("/").pop()!.replace(/\.\w+$/, "")];
  return m ? m.w / m.h : 1;
};
const isLandscape = (src: string) => ratio(src) >= 1.2;

/** Same visual grammar as the Shepherd's Bush page, applied to any project:
 *  intro (client's main image + project facts) → hero band with the client's crop →
 *  concept panel beside the first portrait → the gallery in the client's order, portraits in
 *  rows of 2 and 3 (alternating), landscapes full width (or beside a lone portrait) →
 *  story panel about halfway → rest of the gallery. Nothing is cropped except the hero band. */
export function buildImmersive(p: Project): ImmersiveRow[] {
  const seq = p.gallery.filter((s) => s !== p.index && s !== p.hero);
  const rows: ImmersiveRow[] = [
    { kind: "intro", image: p.index },
    { kind: "banner", image: p.hero, position: p.heroPosition },
  ];

  const take = (from: number) => {
    const i = seq.findIndex((s, k) => k >= from && !isLandscape(s));
    return i < 0 ? null : seq.splice(i, 1)[0];
  };
  const conceptImg = take(0);
  if (conceptImg) rows.push({ kind: "text", image: conceptImg, panel: "concept", tone: "black", side: "left" });
  const mid = Math.floor(seq.length / 2);
  const storyImg = take(mid);
  const storyAt = storyImg ? Math.min(mid, seq.length) : -1; // story panel goes before this gallery position

  let three = false; // alternate pair / trio for runs of portraits
  const flush = (buf: string[]) => {
    let n = buf.length;
    while (n > 0) {
      let size = n <= 3 ? n : n === 4 ? 2 : three ? 3 : 2;
      if (n - size === 1) size = size === 3 ? 2 : 3;
      if (size === 1) {
        // a lone portrait joins the previous portrait row rather than filling the width alone
        const last = rows[rows.length - 1];
        if (last && last.kind === "row" && last.images.length < 3) last.images.push(buf[buf.length - n]);
        else rows.push({ kind: "row", images: [buf[buf.length - n]] });
      } else {
        rows.push({ kind: "row", images: buf.slice(buf.length - n, buf.length - n + size) });
        three = !three;
      }
      n -= size;
    }
  };

  let buf: string[] = [];
  let lastFull = false; // previous row was a single full-width landscape
  const story = () => rows.push({ kind: "text", image: storyImg!, panel: "story", tone: "sky", side: "right" });
  seq.forEach((src, i) => {
    if (i === storyAt && storyImg) {
      // a single waiting portrait carries over past the panel and joins the next group
      if (buf.length !== 1) {
        flush(buf);
        buf = [];
      }
      story();
      lastFull = false;
    }
    if (isLandscape(src)) {
      if (buf.length === 1) rows.push({ kind: "row", images: [buf[0], src] });
      else if (!buf.length && lastFull) {
        // two landscapes in a row sit side by side instead of two full-width screens
        const prev = rows.pop() as { kind: "full"; image: string };
        rows.push({ kind: "row", images: [prev.image, src] });
        lastFull = false;
        return;
      } else {
        flush(buf);
        rows.push({ kind: "full", image: src });
        buf = [];
        lastFull = true;
        return;
      }
      buf = [];
      lastFull = false;
    } else {
      buf.push(src);
      lastFull = false;
    }
  });
  if (buf.length === 1 && rows[rows.length - 1]?.kind === "full") {
    const prev = rows.pop() as { kind: "full"; image: string };
    rows.push({ kind: "row", images: [prev.image, buf[0]] });
  } else flush(buf);
  if (storyImg && storyAt >= seq.length) story();
  return rows;
}

export function immersiveRows(p: Project): ImmersiveRow[] {
  return immersive[p.slug] ?? buildImmersive(p);
}
