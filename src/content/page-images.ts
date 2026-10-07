// Page-level photos (client-specified, see handover brief §3).
export const pageImages = {
  "home-hero": "/images/photos/home-hero.jpg",
  "home-studio": "/images/photos/shepherds-bush-22.jpg", // 9385.jpg — debrief 06/10, shown uncropped
  "studio-01": "/images/photos/studio-01.jpg",
  "studio-02": "/images/photos/studio-02.jpg",
  "services-01": "/images/photos/services-01.jpg",
  "services-02": "/images/photos/services-02.jpg",
  "services-03": "/images/photos/services-03.jpg",
  "services-04": "/images/photos/shepherds-bush-20.jpg", // 9374.jpg — debrief 06/10 (replaces the kitchen detail)
  "services-05": "/images/photos/shepherds-bush-10.jpg" // 9292.jpg — debrief 06/10
} as const;

/** Home hero background video. null = still photo. When the films arrive (spec: docs/hero-video-spec.md), e.g.:
 *  { desktop: "/video/kartu-hero-desktop.mp4", mobile: "/video/kartu-hero-mobile.mp4",
 *    poster: "/video/kartu-hero-poster.jpg", posterMobile: "/video/kartu-hero-poster-mobile.jpg" } */
export const heroVideo: { desktop: string; mobile?: string; poster: string; posterMobile?: string } | null = null;
