import { pageMeta } from "@/content/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { ContactBand, Eyebrow, Footer, Nav, Photo, Wrap, photoRatio } from "@/components/ui";
import { FadeUp, RevealImage, RevealLines } from "@/motion/reveal";
import { indexOrder, projects } from "@/content/site";

const INTRO = "Explore our residential and commercial interior projects.";

export const metadata: Metadata = pageMeta({ path: "/projects/", og: "projects", title: "Projects", description: INTRO });

const isLandscape = (src: string) => photoRatio(src) >= 1.2;

/** Projects index — editorial, project by project (client 10/11, replaces the two-per-row grid).
 *  Each project is one horizontal composition: two photographs of the same interior (one landscape,
 *  one portrait — or three portraits where there is no landscape), then the title and "View project"
 *  on the right. Rows alternate landscape→portrait and portrait→landscape. Photos are never cropped:
 *  every frame keeps its own proportions and the row's widths are shared out by aspect ratio, so all the
 *  photographs of a project stand at exactly the same height (client 10/11, second round). */
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

          <div className="pi">
            {indexOrder.map((slug) => projects.find((q) => q.slug === slug)!).map((p, i) => {
              const flip = i % 2 === 1;
              const land = p.indexImages.filter(isLandscape);
              const port = p.indexImages.filter((s) => !isLandscape(s));
              const images = land.length ? (flip ? [...port, ...land] : [...land, ...port]) : port;
              const total = images.reduce((a, s) => a + photoRatio(s), 0);
              const href = `/projects/${p.slug}/`;
              return (
                <article key={p.slug} className={`pi-row ${flip ? "pi-row--flip" : ""}`} aria-labelledby={`pi-${p.slug}`}>
                  {/* the photographs repeat the title link for the pointer only; keyboard and screen readers use the title */}
                  <Link href={href} className="pi-row__images" tabIndex={-1} aria-hidden="true">
                    {images.map((src, k) => {
                      // photos share 9 of 12 columns on desktop (~72vw) and the full width on phones (~88vw after gutters and seams)
                      const share = Math.round((photoRatio(src) / total) * 72);
                      const shareM = Math.round((photoRatio(src) / total) * 88);
                      return (
                        <div
                          key={src}
                          className="pi-row__photo"
                          style={{ flex: `${photoRatio(src)} 1 0` }}
                        >
                          <RevealImage>
                            <Photo src={src} alt="" sizes={`(min-width: 901px) ${share}vw, ${shareM}vw`} priority={i === 0 && k < 2} />
                          </RevealImage>
                        </div>
                      );
                    })}
                  </Link>
                  <FadeUp className="pi-row__text">
                    <Link href={href} className="pi-row__link">
                      <span className="pi-row__index" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h2 id={`pi-${p.slug}`} className="pi-row__title">
                        {p.title}
                      </h2>
                      <span className="pi-row__cta">View project</span>
                    </Link>
                  </FadeUp>
                </article>
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
