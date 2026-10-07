import { pageMeta } from "@/content/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConversationPrompt, Footer, Grid12, Nav, NextProject, Photo, ProjectMeta, Wrap, photoRatio } from "@/components/ui";
import { FadeUp, RevealImage, RevealLines } from "@/motion/reveal";
import { projects } from "@/content/site";
import { immersive } from "@/content/immersive";
import type { PairVariant, Placement, Project } from "@/content/types";
import ImmersiveProject from "@/sections/project/ImmersiveProject";

export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return p ? pageMeta({ path: `/projects/${p.slug}/`, og: p.slug, title: p.title, description: `${p.conceptName} — ${p.concept}` }) : {};
}

const placeClass = (c: Placement) => `place--${c}`;
const PAIR_WEIGHTS: Record<PairVariant, [number, number]> = { even: [1, 1], "lead-l": [1.55, 1], "lead-r": [1, 1.55] };
const AUTO_RHYTHM: PairVariant[] = ["even", "lead-l", "lead-r"];

function ClassicGallery({ p }: { p: Project }) {
  let gi = 0;
  let run = 0; // position within a run of consecutive pairs
  return (
    <div className="gallery">
      {p.layout.map((row, k) => {
        const isPair = typeof row === "object" && ("pair" in row || (Array.isArray(row) && row.length === 2));
        if (!isPair) run = 0;
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
        // Runs of pairs alternate even → large-left → large-right (the smaller photo drops down),
        // unless the row pins its variant with { pair }.
        if (isPair) {
          const pair = [p.gallery[gi++], p.gallery[gi++]].filter(Boolean);
          const auto = AUTO_RHYTHM[run++ % AUTO_RHYTHM.length];
          const variant: PairVariant = pair.length < 2 ? "even" : !Array.isArray(row) && "pair" in row ? row.pair : auto;
          const w = PAIR_WEIGHTS[variant];
          const sum = pair.reduce((a, src, j) => a + photoRatio(src) * w[j], 0);
          return (
            <div key={k} className={`gallery-row gallery-pair gallery-pair--${variant}`} style={{ ["--pair-r" as string]: sum / Math.max(...w) }}>
              {pair.map((src, j) => (
                <figure key={src} className="gallery-figure" style={{ flex: `${photoRatio(src) * w[j]} 1 0` }}>
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
            {(row as Placement[]).map((cls) => {
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
      })}
    </div>
  );
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = projects.findIndex((p) => p.slug === slug);
  if (i < 0) notFound();
  const p = projects[i];
  const next = projects[(i + 1) % projects.length];
  const alt = immersive[p.slug];

  return (
    <>
      <Nav current="projects" />
      <main id="main">
        {alt ? (
          <ImmersiveProject p={p} rows={alt} />
        ) : (
          <>
            <div className="project-hero">
              <Photo src={p.hero} alt={p.title} priority sizes="100vw" position={p.heroPosition} />
            </div>
            <Wrap>
              <Grid12 className="project-head">
                <RevealLines as="h1" lines={[p.title]} className="project-head__title" immediate />
                <ProjectMeta
                  className="project-head__meta"
                  items={[
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

              <ClassicGallery p={p} />
            </Wrap>
          </>
        )}
        <Wrap>
          <ConversationPrompt text="Imagining something like this for your home?" className="conv-prompt--project" />
        </Wrap>
        <NextProject slug={next.slug} title={next.title} />
      </main>
      <Footer />
    </>
  );
}
