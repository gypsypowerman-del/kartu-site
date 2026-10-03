import type { Metadata } from "next";
import { pageMeta } from "@/content/seo";
import { ContactBand, Eyebrow, Footer, Photo, ServiceRow, TextLink, Wrap } from "@/components/ui";
import HomeHero from "@/sections/home/HomeHero";
import HomeProjects from "@/sections/home/HomeProjects";
import { FadeUp, Parallax, RevealImage, RevealLines } from "@/motion/reveal";
import { projects, services } from "@/content/site";
import { pageImages } from "@/content/page-images";

export const metadata: Metadata = pageMeta({ path: "/", og: "home" });

export default function HomePage() {
  return (
    <>
      <HomeHero />

      <main id="main">
        {/* Approved build shows the first three projects */}
        <HomeProjects projects={projects.slice(0, 3)} />

        <section className="home-studio" aria-labelledby="home-studio-title">
          <div className="home-studio__text">
            <Eyebrow>Studio</Eyebrow>
            <RevealLines as="h2" lines={["Creating together."]} className="home-studio__title" />
            <FadeUp>
              <p className="home-studio__body">
                KARTÚ means “together” in Lithuanian — a name that reflects how we work. We create together as a studio, and together with our clients, shaping each project through
                collaboration and shared ideas.
              </p>
              <TextLink href="/studio/">Discover the Studio</TextLink>
            </FadeUp>
          </div>
          <RevealImage className="home-studio__media">
            <Parallax speed={0.18} className="home-studio__parallax">
              <Photo src={pageImages["home-studio"]} alt="Hallway, Beregovoy Residential Complex" sizes="(min-width: 901px) 50vw, 100vw" className="photo--fill" />
            </Parallax>
          </RevealImage>
        </section>

        <section className="home-services" aria-labelledby="home-services-title">
          <Wrap>
            <div className="section-heading">
              <RevealLines as="h2" lines={["Services"]} className="section-heading__title" />
              <TextLink href="/services/">Explore our services</TextLink>
            </div>
            <FadeUp className="home-services__list">
              <ul className="home-services__items">
                {services.map((s, i) => (
                  <ServiceRow key={s} index={String(i + 1).padStart(2, "0")} title={s} last={i === services.length - 1} />
                ))}
              </ul>
            </FadeUp>
          </Wrap>
        </section>

        <ContactBand />
      </main>

      <Footer />
    </>
  );
}
