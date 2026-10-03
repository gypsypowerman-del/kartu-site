import { pageMeta } from "@/content/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow, Footer, Nav, Photo, Wrap, ContactBand } from "@/components/ui";
import { FadeUp, RevealImage, RevealLines } from "@/motion/reveal";
import { projects } from "@/content/site";

export const metadata: Metadata = pageMeta({ path: "/projects/", og: "projects", title: "Projects", description: "Selected residential and commercial projects across the UK and Europe." });

// Two projects per row, wide + narrow alternating. Widths follow the image ratios (4/3 and 1/1),
// so both photos in a row share one height (≈ the approved 7/5 column split).
const isWide = (i: number) => i % 4 === 0 || i % 4 === 3;
const ratioOf = (i: number) => (isWide(i) ? 4 / 3 : 1);

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
              <p className="page-intro__body">Selected residential and commercial projects across the UK and Europe.</p>
            </FadeUp>
          </header>

          <div className="projects-grid">
            {[0, 2, 4].map((start) => (
              <div key={start} className="projects-grid__row">
                {projects.slice(start, start + 2).map((p, j) => {
                  const i = start + j;
                  return (
                    <Link key={p.slug} href={`/projects/${p.slug}/`} className="project-card projects-grid__item" style={{ flex: `${ratioOf(i)} 1 0` }}>
                      <RevealImage>
                        <Photo src={p.index} alt={`${p.title}, ${p.location}`} ratio={isWide(i) ? "4/3" : "1/1"} sizes="(min-width: 561px) 55vw, 100vw" priority={i < 2} />
                      </RevealImage>
                      <span className="project-card__title project-card__title--index">{p.title}</span>
                      <span className="project-card__location">{p.location}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </Wrap>
        <ContactBand />
      </main>
      <Footer />
    </>
  );
}
