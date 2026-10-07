import { pageMeta } from "@/content/seo";
import type { Metadata } from "next";
import { ColourBlock, ContactBand, ConversationPrompt, Eyebrow, Footer, Grid12, Nav, Photo, Stage, Wrap, photoRatio } from "@/components/ui";
import { FadeUp, RevealImage, RevealLines } from "@/motion/reveal";
import { servicesBorders, servicesIndependent, servicesIntro, stages } from "@/content/site";
import { pageImages } from "@/content/page-images";

export const metadata: Metadata = pageMeta({ path: "/services/", og: "services", title: "Services", description: servicesIntro });

const idx = (i: number) => String(i + 1).padStart(2, "0");

/** Compact editorial layout (debrief 06/10): stages stack one under another beside a tall photo,
 *  so no stage reserves a whole image height for a short text block. */
export default function ServicesPage() {
  const band = [pageImages["services-03"], pageImages["services-04"], pageImages["services-05"]];
  const bandAlt = ["Kitchen and dining, City Bay Apartment", "Rattan-fronted joinery and arched mirror, Shepherd's Bush Maisonette", "Bedroom with painted mural, Shepherd's Bush Maisonette"];
  return (
    <>
      <Nav current="services" />
      <main id="main">
        <Wrap>
          <header className="page-intro">
            <Eyebrow>Services</Eyebrow>
            <RevealLines as="h1" lines={["From first conversation", "to final implementation"]} className="page-intro__title page-intro__title--page" immediate />
            <FadeUp>
              <p className="page-intro__body page-intro__body--lg">{servicesIntro}</p>
            </FadeUp>
          </header>

          {/* 01–03 on the left while the first photo continues on the right */}
          <Grid12 className="svc-split">
            <div className="svc-split__text svc-split__text--l">
              {stages.slice(0, 3).map(([title, body], i) => (
                <FadeUp key={title}>
                  <Stage index={idx(i)} title={title} body={body} />
                </FadeUp>
              ))}
              <FadeUp>
                <ColourBlock title={servicesIndependent.title}>
                  {servicesIndependent.body.map((t) => (
                    <p key={t}>{t}</p>
                  ))}
                  <ConversationPrompt text="Not sure which stage you need? We’ll help you decide in a short call." className="conv-prompt--inline" />
                </ColourBlock>
              </FadeUp>
            </div>
            <figure className="svc-split__fig svc-split__fig--r">
              <RevealImage>
                <Photo src={pageImages["services-01"]} alt="Joinery and kitchen detail, Family House" sizes="(min-width: 901px) 40vw, 100vw" priority />
              </RevealImage>
            </figure>
          </Grid12>

          {/* mirrored: photo left, 04–05 and the international note on the right */}
          <Grid12 className="svc-split svc-split--mirror">
            <figure className="svc-split__fig svc-split__fig--l">
              <RevealImage>
                <Photo src={pageImages["services-02"]} alt="Display plinths, Jewellery Studio" sizes="(min-width: 901px) 40vw, 100vw" />
              </RevealImage>
            </figure>
            <div className="svc-split__text svc-split__text--r">
              {stages.slice(3).map(([title, body], i) => (
                <FadeUp key={title}>
                  <Stage index={idx(i + 3)} title={title} body={body} />
                </FadeUp>
              ))}
              <FadeUp>
                <ColourBlock tone="sky" title={servicesBorders.title}>
                  {servicesBorders.body.map((t) => (
                    <p key={t}>{t}</p>
                  ))}
                </ColourBlock>
              </FadeUp>
            </div>
          </Grid12>

          {/* three photos across the page, equal height, never cropped */}
          <div className="svc-band">
            {band.map((src, i) => (
              <figure key={src} className="svc-band__fig" style={{ flex: `${photoRatio(src)} 1 0` }}>
                <RevealImage>
                  <Photo src={src} alt={bandAlt[i]} sizes="(min-width: 561px) 33vw, 100vw" />
                </RevealImage>
              </figure>
            ))}
          </div>
        </Wrap>
        <ContactBand />
      </main>
      <Footer />
    </>
  );
}
