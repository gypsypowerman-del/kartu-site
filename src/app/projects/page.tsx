import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow, Footer, Nav, Photo, Wrap } from "@/components/ui";
import { FadeUp, RevealImage, RevealLines } from "@/motion/reveal";
import { projects } from "@/content/site";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected residential and commercial projects across the UK and Europe.",
};

// Aligned grid: two projects per row, wide (7 cols) + narrow (5 cols) alternating, 4/3, equal heights.
const span = (i: number) => (i % 4 === 0 || i % 4 === 3 ? "projects-grid__item--wide" : "projects-grid__item--narrow");

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
            {projects.map((p, i) => (
              <Link key={p.slug} href={`/projects/${p.slug}/`} className={`project-card projects-grid__item ${span(i)}`}>
                <RevealImage>
                  <Photo src={p.index} alt={`${p.title}, ${p.location}`} ratio="4/3" sizes="(min-width: 901px) 55vw, 100vw" priority={i < 2} />
                </RevealImage>
                <span className="project-card__title project-card__title--index">{p.title}</span>
                <span className="project-card__location">{p.location}</span>
              </Link>
            ))}
          </div>
        </Wrap>
      </main>
      <Footer />
    </>
  );
}
