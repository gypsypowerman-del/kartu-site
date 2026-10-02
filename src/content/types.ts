export type Placement =
  | "full" | "wide" | "half-l" | "half-r" | "nar-l" | "nar-r" | "mid" | "small-l" | "small-r" | "drop";

export type Project = {
  slug: string;
  title: string;
  location: string;
  year: string;
  size: string;
  scope: string;
  thumb: string;   // Home card, 3/4
  index: string;   // Projects index card, 4/3
  hero: string;
  conceptName: string;
  concept: string;
  conceptText: string;
  story: string;
  gallery: string[];
  /** Rows of placements; the literal "STORY" inserts the project-story block. */
  layout: (Placement[] | "STORY")[];
};
