export type Placement =
  | "full" | "wide" | "half-l" | "half-r" | "nar-l" | "nar-r" | "mid" | "small-l" | "small-r" | "drop";

export type PairVariant = "even" | "lead-l" | "lead-r";

export type Project = {
  slug: string;
  title: string;
  /** Not displayed anywhere (client decision, debrief 06/10) — kept for internal reference only. */
  location: string;
  year: string;
  size: string;
  scope: string;
  thumb: string;   // Home card, 3/4
  index: string;   // Projects index card, 4/3
  hero: string;
  /** CSS object-position for the hero crop (measured from the client's mock-ups) */
  heroPosition?: string;
  conceptName: string;
  concept: string;
  conceptText: string;
  story: string;
  gallery: string[];
  /** Rows of placements; the literal "STORY" inserts the project-story block.
   *  A two-image row ["half-l","half-r"] gets an automatic size rhythm; { pair } pins its variant. */
  layout: (Placement[] | "STORY" | { pair: PairVariant })[];
};
