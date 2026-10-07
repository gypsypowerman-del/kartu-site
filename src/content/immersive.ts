// Alternative "immersive" project template — client experiment (debrief 06/10, slide 12),
// inspired by the Róisín Lafferty reference: large-scale imagery, almost no unused space,
// text integrated between the images. Applied to Shepherd's Bush only for review.
import { pageImages } from "./page-images";

const sb = (n: number) => `/images/photos/shepherds-bush-${String(n).padStart(2, "0")}.jpg`;

export type PanelKind = "intro" | "concept" | "story";
export type PanelTone = "khaki" | "black" | "sky";

export type ImmersiveRow =
  /** large image beside the project introduction (title, concept line, facts) */
  | { kind: "intro"; image: string }
  /** one full-width image */
  | { kind: "full"; image: string }
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
