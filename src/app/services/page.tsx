import type { Metadata } from "next";
import { ColourBlock, ContactBand, Eyebrow, Footer, Grid12, Nav, Photo, Stage, Wrap } from "@/components/ui";
import { FadeUp, Parallax, RevealImage, RevealLines } from "@/motion/reveal";
import { stages } from "@/content/site";
import { pageImages } from "@/content/page-images";

export const metadata: Metadata = {
  title: "Services",
  description: "A full-service interior design studio — from first conversation and site visit to procurement and implementation.",
};

export default function ServicesPage() {
  const S = stages;
  return (
    <>
      <Nav current="services" />
      <main id="main">
        <Wrap>
          <header className="page-intro">
            <Eyebrow>Services</Eyebrow>
            <RevealLines as="h1" lines={["From first conversation", "to final implementation"]} className="page-intro__title page-intro__title--page" immediate />
            <FadeUp>
              <p className="page-intro__body page-intro__body--lg">
                KARTÚ is a full-service interior design studio. We can guide a project from the very first conversation and site visit through to procurement and implementation, staying
                involved throughout the process to ensure that the original idea is carried through into the finished space.
              </p>
            </FadeUp>
          </header>

          <Grid12 className="services-composition">
            <FadeUp className="svc svc--stage1">
              <Stage index="01" title={S[0][0]}>{S[0][1]}</Stage>
            </FadeUp>
            <figure className="svc svc--fig1">
              <RevealImage>
                <Photo src={pageImages["services-01"]} alt="Joinery and kitchen detail, Family House" sizes="(min-width: 901px) 40vw, 100vw" />
              </RevealImage>
            </figure>
            <FadeUp className="svc svc--block1">
              <ColourBlock>
                <p>Every project is different, but our full design service typically follows several key stages — each one building on the decisions made before it.</p>
              </ColourBlock>
            </FadeUp>
            <FadeUp className="svc svc--stage2">
              <Stage index="02" title={S[1][0]}>{S[1][1]}</Stage>
            </FadeUp>
            <FadeUp className="svc svc--stage3">
              <Stage index="03" title={S[2][0]}>{S[2][1]}</Stage>
            </FadeUp>
            <Parallax speed={0.1} className="svc svc--fig2">
              <RevealImage>
                <Photo src={pageImages["services-02"]} alt="Display plinths, Jewellery Studio" sizes="(min-width: 901px) 33vw, 100vw" />
              </RevealImage>
            </Parallax>
            <FadeUp className="svc svc--block2">
              <ColourBlock tone="sky" title="Designing across borders">
                <p>
                  With projects across the United Kingdom, Lithuania, Russia and the UAE, we are experienced in developing interiors remotely as well as working on site. For remote
                  projects, the process — from briefing through documentation — can be managed online, with regular meetings and a clear structure throughout.
                </p>
              </ColourBlock>
            </FadeUp>
            <FadeUp className="svc svc--stage4">
              <Stage index="04" title={S[3][0]}>{S[3][1]}</Stage>
            </FadeUp>
            <figure className="svc svc--fig3">
              <RevealImage>
                <Photo src={pageImages["services-03"]} alt="Dining and living space, City Bay Apartment" sizes="(min-width: 901px) 58vw, 100vw" />
              </RevealImage>
            </figure>
            <FadeUp className="svc svc--stage5">
              <Stage index="05" title={S[4][0]}>{S[4][1]}</Stage>
            </FadeUp>
            <figure className="svc svc--fig4">
              <RevealImage>
                <Photo src={pageImages["services-04"]} alt="Kitchen detail, Shepherd's Bush Maisonette" sizes="(min-width: 901px) 25vw, 100vw" />
              </RevealImage>
            </figure>
          </Grid12>

          <Grid12 className="services-closing">
            <FadeUp className="services-closing__a">
              <h2 className="services-closing__title">Not every project needs the full process.</h2>
              <p>
                Each stage of our service can also work independently. You may need help finding the right layout and developing a concept for your home, support with sourcing and
                procurement, or a designer to help carry an existing project through implementation.
              </p>
              <p>We can step in where our expertise is most useful and shape the scope around what your project actually needs.</p>
            </FadeUp>
            <FadeUp className="services-closing__b">
              <h2 className="services-closing__title">A service shaped around your project.</h2>
              <p>
                Our studio is based in London, but our work has never been limited by geography. Our understanding of different markets and an international network of suppliers allow
                us to work confidently beyond the UK.
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
