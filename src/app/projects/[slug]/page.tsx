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
  return p ? { title: p.title, description: `${p.concept} ${p.location}, ${p.year}.` } : {};
}

const placeClass = (c: Placement) => `place--${c}`;

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = projects.findIndex((p) => p.slug === slug);
  if (i < 0) notFound();
  const p = projects[i];
  const next = projects[(i + 1) % projects.length];

  let gi = 0;
  const rows = p.layout.map((row, k) => {
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
    // Side-by-side photos: widths proportional to their ratios, so heights match and nothing is cropped
    if (row.length === 2) {
      const pair = [p.gallery[gi++], p.gallery[gi++]].filter(Boolean);
      return (
        <div key={k} className="gallery-row gallery-pair" style={{ ["--pair-r" as string]: pair.reduce((a, src) => a + photoRatio(src), 0) }}>
          {pair.map((src, j) => (
            <figure key={src} className="gallery-figure" style={{ flex: `${photoRatio(src)} 1 0` }}>
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
            <figure key={src} className={`gallery-figure ${placeClass(cls)}`}>
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
