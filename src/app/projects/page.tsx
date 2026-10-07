import { pageMeta } from "@/content/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow, Footer, Nav, Photo, Wrap, ContactBand, photoRatio } from "@/components/ui";
import { FadeUp, RevealImage, RevealLines } from "@/motion/reveal";
import { projects } from "@/content/site";

const INTRO = "Explore our residential and commercial interior projects.";

export const metadata: Metadata = pageMeta({ path: "/projects/", og: "projects", title: "Projects", description: INTRO });

// Two projects per row, photos at their own proportions (the client-chosen images are portrait).
// Rows alternate large-left / large-right — the approved 7/5 then 5/7 rhythm — with the
// smaller card dropped slightly, as in the project galleries.
const WEIGHTS: [number, number][] = [
  [1.4, 1],
  [1, 1.4],
];

export default function ProjectsPage() {
  return (
    <>
      <Nav current="projects" />
      <main id="main">
        <Wrap>
          <header className="page-intro page-intro--compact">
            <Eyebrow>Projects</Eyebrow>
            <RevealLines as="h1" lines={["Our Projects"]} className="page-intro__title page-intro__title--compact" immediate />
            <FadeUp>
              <p className="page-intro__body">{INTRO}</p>
            </FadeUp>
          </header>

          <div className="projects-grid">
            {[0, 2, 4].map((start, r) => {
              const w = WEIGHTS[r % 2];
              const row = projects.slice(start, start + 2);
              const lead = w[0] > w[1] ? 0 : 1;
              return (
                <div key={start} className="projects-grid__row" style={{ ["--pair-r" as string]: row.reduce((a, p, j) => a + photoRatio(p.index) * w[j], 0) / Math.max(...w) }}>
                  {row.map((p, j) => {
                    const i = start + j;
                    return (
                      <Link
                        key={p.slug}
                        href={`/projects/${p.slug}/`}
                        className={`project-card projects-grid__item ${j === lead ? "" : "projects-grid__item--drop"}`}
                        style={{ flex: `${photoRatio(p.index) * w[j]} 1 0` }}
                      >
                        <RevealImage>
                          <Photo src={p.index} alt={p.title} sizes="(min-width: 561px) 50vw, 100vw" priority={i < 2} />
                        </RevealImage>
                        <span className="project-card__title project-card__title--index">{p.title}</span>
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </Wrap>
        <ContactBand />
      </main>
      <Footer />
    </>
  );
}
