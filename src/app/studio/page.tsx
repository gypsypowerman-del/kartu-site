import { pageMeta } from "@/content/seo";
import type { Metadata } from "next";
import { ContactBand, ConversationPrompt, Eyebrow, Footer, Grid12, Nav, Photo, Wrap } from "@/components/ui";
import { FadeUp, RevealImage, RevealLines } from "@/motion/reveal";
import { founders } from "@/content/site";

export const metadata: Metadata = pageMeta({ path: "/studio/", og: "studio", title: "Studio", description: "KARTÚ means “together” in Lithuanian — a London interior design studio founded by Anna Prycheva and Jurgita MacNaughton." });

/** Built around the two founders' portraits (debrief 06/10): two vertical frames in dialogue,
 *  offset from one another, with the existing Studio copy placed around them. No interior photography. */
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

          <FadeUp className="studio-founded">
            <p>KARTÚ was founded by Anna Prycheva and Jurgita MacNaughton, whose paths came together in London after careers in very different worlds.</p>
          </FadeUp>

          <Grid12 className="studio-duo">
            {founders.map((f, i) => (
              <figure key={f.name} className={`studio-duo__item studio-duo__item--${i === 0 ? "a" : "b"}`}>
                <RevealImage>
                  {f.photo ? (
                    <Photo src={f.photo} alt={`Portrait of ${f.name}`} ratio="3/4" sizes="(min-width: 901px) 36vw, 100vw" />
                  ) : (
                    <div className="studio-duo__placeholder" aria-hidden="true" />
                  )}
                </RevealImage>
                <figcaption className="studio-duo__caption">
                  <span className="studio-duo__name">{f.name}</span>
                  <span className="studio-duo__bio">{f.bio}</span>
                </figcaption>
              </figure>
            ))}
          </Grid12>

          <FadeUp className="studio-quote">
            <p>What began as a friendship grew into a creative partnership, bringing these two perspectives together in a shared approach to interiors.</p>
            <ConversationPrompt text="We’d love to hear about your home." link="Meet us — book an introductory call" className="conv-prompt--studio" />
          </FadeUp>

          <Grid12 className="studio-columns">
            <FadeUp className="studio-columns__a">
              <p>
                Both originally from Lithuania, we found the name for the studio in our native language. We create together as founders, and we create together with our clients. We see
                every project as a dialogue rather than the expression of a single point of view.
              </p>
              <p>That dialogue extends into the way we design. KARTÚ creates interiors through dialogue — bringing together emotion and structure, intuition and strategy, people and space.</p>
            </FadeUp>
            <FadeUp className="studio-columns__b">
              <p>
                Our different professional backgrounds allow us to approach a project from both sides: with creativity and emotional sensitivity, but also with structure, clarity and an
                understanding of how ideas are translated into reality. We believe the best interiors need both.
              </p>
              <p>
                For us, good design is not about imposing a signature style. It is about finding the right answer together — for the people, the place, and the way life happens within it.
              </p>
            </FadeUp>
          </Grid12>
        </Wrap>
        <ContactBand />
      </main>
      <Footer />
    </>
  );
}
