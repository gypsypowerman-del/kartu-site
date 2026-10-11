import type { Metadata } from "next";
import { pageMeta } from "@/content/seo";
import { ContactBand, Footer, Nav, Photo, ServiceRow, TextLink, Wrap } from "@/components/ui";
import IntroScreen from "@/sections/home/IntroScreen";
import HomeHero from "@/sections/home/HomeHero";
import HomeProjects from "@/sections/home/HomeProjects";
import { FadeUp, RevealImage, RevealLines } from "@/motion/reveal";
import { projects, services } from "@/content/site";
import { pageImages } from "@/content/page-images";

export const metadata: Metadata = pageMeta({ path: "/", og: "home" });

export default function HomePage() {
  return (
    <>
      <IntroScreen />
      {/* overlay nav is positioned over the hero; kept outside <main> so the hero (and its h1) is main content */}
      <Nav overlay />

      <main id="main">
        <HomeHero />
        {/* Client 11/10: the rail carries every project, not a selection of three */}
        <HomeProjects projects={projects.map(({ slug, title, concept, thumb }) => ({ slug, title, concept, thumb }))} />

        <section className="home-studio" aria-labelledby="home-studio-title">
          {/* Client 11/10: the section is titled by its own name, like Projects and Services.
              "Creating together." moves to the subtitle step (Futura, per the brand type ladder) —
              it used to be the big line with "Studio" as a small label above it, which made the
              three Home sections read inconsistently. */}
          <div className="home-studio__text">
            <RevealLines as="h2" lines={["Studio"]} className="home-studio__title" />
            <FadeUp>
              <p className="home-studio__lead">Creating together.</p>
              <p className="home-studio__body">
                KARTÚ means “together” in Lithuanian — a name that reflects how we work. We create together as a studio, and together with our clients, shaping each project through
                collaboration and shared ideas.
              </p>
              <TextLink href="/studio/">Discover the Studio</TextLink>
            </FadeUp>
          </div>
          {/* 9385.jpg at its original proportions (client: don't change the format) */}
          <RevealImage className="home-studio__media">
            <Photo src={pageImages["home-studio"]} alt="Washstand and arched mirror under the skylight, Shepherd's Bush Maisonette" sizes="(min-width: 901px) 42vw, 100vw" />
          </RevealImage>
        </section>

        <section className="home-services" aria-labelledby="home-services-title">
          <Wrap>
            <div className="section-heading">
              <RevealLines as="h2" lines={["Services"]} className="section-heading__title" />
            </div>
            <FadeUp className="home-services__list">
              <ul className="home-services__items">
                {services.map((s, i) => (
                  <ServiceRow key={s} index={String(i + 1).padStart(2, "0")} title={s} last={i === services.length - 1} />
                ))}
              </ul>
              <div className="home-services__more">
                <TextLink href="/services/">Explore our services</TextLink>
              </div>
            </FadeUp>
          </Wrap>
        </section>

        <ContactBand />
      </main>

      <Footer />
    </>
  );
}
