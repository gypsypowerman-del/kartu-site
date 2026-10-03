import { pageMeta } from "@/content/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer, Grid12, Nav, NextProject, Photo, ProjectMeta, Wrap, photoRatio } from "@/components/ui";
import { FadeUp, RevealImage, RevealLines } from "@/motion/reveal";
import { projects } from "@/content/site";
import type { Placement } from "@/content/types";

export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return p ? pageMeta({ path: `/projects/${p.slug}/`, og: p.slug, title: p.title, description: `${p.concept} ${p.location}, ${p.year}.` }) : {};
}

const placeClass = (c: Placement) => `place--${c}`;
const PAIR_VARIANTS = [
  { name: "even", w: [1, 1] },
  { name: "lead-l", w: [1.55, 1] },
  { name: "lead-r", w: [1, 1.55] },
] as const;

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = projects.findIndex((p) => p.slug === slug);
  if (i < 0) notFound();
  const p = projects[i];
  const next = projects[(i + 1) % projects.length];

  let gi = 0;
  let run = 0; // position within a run of consecutive pairs
  const rows = p.layout.map((row, k) => {
    if (row === "STORY" || row.length !== 2) run = 0;
    if (row === "STORY") {
      return (
        <Grid12 key={k} className="gallery-row">
          <FadeUp className="project-story">
            <div className="project-story__label">Project Story</div>
            <p className="project-story__body">{p.story}</p>
          </FadeUp>
        </Grid12>
      );
    }
    // Side-by-side photos, never cropped: flex-grow = ratio × weight.
    // Long runs of pairs alternate even → large-left → large-right (smaller photo dropped)
    // so the gallery changes scale without changing the approved photo order.
    if (row.length === 2) {
      const pair = [p.gallery[gi++], p.gallery[gi++]].filter(Boolean);
      const variant = pair.length === 2 ? PAIR_VARIANTS[run++ % PAIR_VARIANTS.length] : PAIR_VARIANTS[0];
      const sum = pair.reduce((a, src, j) => a + photoRatio(src) * variant.w[j], 0);
      return (
        <div key={k} className={`gallery-row gallery-pair gallery-pair--${variant.name}`} style={{ ["--pair-r" as string]: sum / Math.max(...variant.w) }}>
          {pair.map((src, j) => (
            <figure key={src} className="gallery-figure" style={{ flex: `${photoRatio(src) * variant.w[j]} 1 0` }}>
              <RevealImage>
                <Photo src={src} alt={`${p.title} — view ${gi - pair.length + j + 1}`} sizes="(min-width: 561px) 50vw, 100vw" />
              </RevealImage>
            </figure>
          ))}
        </div>
      );
    }
    return (
      <Grid12 key={k} className="gallery-row">
        {row.map((cls) => {
          const src = p.gallery[gi++];
          if (!src) return null;
          const n = gi;
          return (
            <figure key={src} className={`gallery-figure gallery-figure--single ${placeClass(cls)}`} style={{ ["--r" as string]: photoRatio(src) }}>
              <RevealImage>
                <Photo src={src} alt={`${p.title} — view ${n}`} sizes={cls === "full" ? "100vw" : "(min-width: 901px) 50vw, 100vw"} />
              </RevealImage>
            </figure>
          );
        })}
      </Grid12>
    );
  });

  return (
    <>
      <Nav current="projects" />
      <main id="main">
        <div className="project-hero">
          <Photo src={p.hero} alt={`${p.title} — ${p.location}`} priority sizes="100vw" />
        </div>
        <Wrap>
          <Grid12 className="project-head">
            <RevealLines as="h1" lines={[p.title]} className="project-head__title" immediate />
            <ProjectMeta
              className="project-head__meta"
              items={[
                { label: "Location", value: p.location },
                { label: "Year", value: p.year },
                { label: "Size", value: p.size },
                { label: "Scope", value: p.scope, wide: true },
              ]}
            />
          </Grid12>

          <Grid12 className="project-concept">
            <div className="project-concept__label">Concept — {p.conceptName}</div>
            <div className="project-concept__text">
              <RevealLines as="h2" lines={[p.concept]} className="project-concept__title" />
              <FadeUp>
                <p className="project-concept__body">{p.conceptText}</p>
              </FadeUp>
            </div>
          </Grid12>

          <div className="gallery">{rows}</div>
        </Wrap>
        <NextProject slug={next.slug} title={next.title} location={next.location} />
      </main>
      <Footer />
    </>
  );
}
