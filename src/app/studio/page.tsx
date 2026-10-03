import { FOUNDER_PORTRAITS } from "@/content/assets";
import { pageMeta } from "@/content/seo";
import type { Metadata } from "next";
import { ColourBlock, ContactBand, Eyebrow, Footer, Grid12, Nav, Photo, Wrap } from "@/components/ui";
import { FadeUp, Parallax, RevealImage, RevealLines } from "@/motion/reveal";
import { pageImages } from "@/content/page-images";

export const metadata: Metadata = pageMeta({ path: "/studio/", og: "studio", title: "Studio", description: "KARTÚ means “together” in Lithuanian — a London interior design studio founded by Anna Prycheva and Jurgita MacNaughton." });

export default function StudioPage() {
  return (
    <>
      <Nav current="studio" />
      <main id="main">
        <Wrap>
          <header className="page-intro">
            <Eyebrow>Studio</Eyebrow>
            <RevealLines as="h1" lines={["Creating together."]} className="page-intro__title" immediate />
            <FadeUp>
              <p className="page-intro__lead">
                KARTÚ means “together” in Lithuanian — a name that reflects how we work. We create together as a studio, and together with our clients, shaping each project through
                collaboration and shared ideas.
              </p>
            </FadeUp>
          </header>

          <Grid12 className="studio-composition">
            <FadeUp className="studio-composition__block">
              <ColourBlock>
                <p>KARTÚ was founded by Anna Prycheva and Jurgita MacNaughton, whose paths came together in London after careers in very different worlds.</p>
                <p>
                  Anna came from events and creative production, bringing experience in developing ideas and turning them into carefully orchestrated experiences. Jurgita came from
                  finance, with a strong background in planning, structure, and commercial thinking.
                </p>
              </ColourBlock>
            </FadeUp>
            <figure className="studio-composition__figure">
              <RevealImage>
                <Photo src={pageImages["studio-01"]} alt="KARTÚ interior detail" sizes="(min-width: 901px) 40vw, 100vw" priority />
              </RevealImage>
            </figure>
            <Parallax speed={0.1} className="studio-composition__detail">
              <RevealImage>
                <Photo src={pageImages["studio-02"]} alt="KARTÚ interior, open-plan living" sizes="(min-width: 901px) 50vw, 100vw" />
              </RevealImage>
            </Parallax>
          </Grid12>

          <Grid12 className="studio-story">
          <FadeUp className="studio-story__quote">
            What began as a friendship grew into a creative partnership, bringing these two perspectives together in a shared approach to interiors.
          </FadeUp>
          <FadeUp className="studio-text">
            <p>
              Both originally from Lithuania, we found the name for the studio in our native language. We create together as founders, and we create together with our clients. We see
              every project as a dialogue rather than the expression of a single point of view.
            </p>
            <p>That dialogue extends into the way we design. KARTÚ creates interiors through dialogue — bringing together emotion and structure, intuition and strategy, people and space.</p>
            <p>
              Our different professional backgrounds allow us to approach a project from both sides: with creativity and emotional sensitivity, but also with structure, clarity and an
              understanding of how ideas are translated into reality. We believe the best interiors need both.
            </p>
            <p>
              For us, good design is not about imposing a signature style. It is about finding the right answer together — for the people, the place, and the way life happens within it.
            </p>
          </FadeUp>
          </Grid12>

          {/* Founder portraits: shown once the client supplies them (open item) */}
          {FOUNDER_PORTRAITS && (
            <div className="studio-founders">
              {["Anna Prycheva", "Jurgita MacNaughton"].map((name) => (
                <div key={name} className="studio-founders__slot">
                  {name}
                </div>
              ))}
            </div>
          )}
        </Wrap>
        <ContactBand />
      </main>
      <Footer />
    </>
  );
}
