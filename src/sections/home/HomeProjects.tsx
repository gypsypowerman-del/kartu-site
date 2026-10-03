"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Photo, TextLink, Wrap } from "@/components/ui";
import { RevealImage } from "@/motion/reveal";
import type { Project } from "@/content/types";
import { motionEnabled } from "@/motion/enabled";

gsap.registerPlugin(ScrollTrigger);

/** Desktop: a pinned scene — each project's photo opens over the previous one
 *  and the caption switches cleanly to the project in view (no scroll snapping).
 *  Phone / reduced motion / no JS / automated browsers: a plain stack of cards. */
export default function HomeProjects({ projects }: { projects: Project[] }) {
  const root = useRef<HTMLElement>(null);
  const n = projects.length;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference) and (min-width: 901px)", () => {
      if (!motionEnabled()) return;
      const slides = gsap.utils.toArray<HTMLElement>(".projects-scene__slide", el);
      const titles = gsap.utils.toArray<HTMLElement>(".projects-scene__caption", el);
      const counter = el.querySelector<HTMLElement>(".projects-scene__current");

      gsap.set(slides[0], { clipPath: "inset(0% 0% 0% 0%)" });
      gsap.set(slides.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });

      let active = -1;
      const setActive = (idx: number) => {
        if (idx === active) return;
        active = idx;
        titles.forEach((t, i) => t.classList.toggle("is-active", i === idx));
        if (counter) counter.textContent = String(idx + 1).padStart(2, "0");
      };
      setActive(0);

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut", duration: 1 },
        scrollTrigger: {
          trigger: ".projects-scene__stage",
          start: "top top",
          end: () => `+=${window.innerHeight * (n - 1) * 0.9}`,
          pin: true,
          scrub: 0.6,
          // caption follows the photo that is more than half open
          onUpdate: (self) => setActive(Math.min(n - 1, Math.round(self.progress * (n - 1)))),
        },
      });

      // Keyboard: tabbing to a project's caption scrolls the scene to that project
      const st = tl.scrollTrigger!;
      const onFocus = (idx: number) => () => {
        const y = st.start + ((st.end - st.start) * idx) / (n - 1);
        const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o: { immediate: boolean }) => void } }).__lenis;
        if (lenis) lenis.scrollTo(y, { immediate: true });
        else window.scrollTo({ top: y, behavior: "auto" });
        ScrollTrigger.update();
        const box = el.querySelector<HTMLElement>(".projects-scene__captions");
        if (box) box.scrollTop = 0;
      };
      const handlers = titles.map((t, idx) => {
        const h = onFocus(idx);
        t.addEventListener("focus", h);
        return () => t.removeEventListener("focus", h);
      });

      for (let i = 1; i < n; i++) {
        const at = i - 1;
        tl.to(slides[i], { clipPath: "inset(0% 0% 0% 0%)" }, at)
          .fromTo(slides[i].querySelector(".photo"), { scale: 1.15 }, { scale: 1 }, at)
          .to(slides[i - 1].querySelector(".photo"), { scale: 0.96, autoAlpha: 0.7 }, at);
      }
      return () => {
        handlers.forEach((off) => off());
        titles.forEach((t) => t.classList.remove("is-active"));
      };
    }, el);
    return () => mm.revert();
  }, [n]);

  return (
    <section className="projects-scene" ref={root} aria-labelledby="home-projects-title">
      <div className="projects-scene__stage">
        <Wrap className="projects-scene__grid">
          <div className="projects-scene__side">
            <div className="projects-scene__head">
              <h2 id="home-projects-title" className="projects-scene__title">
                Projects
              </h2>
              <span className="projects-scene__counter" aria-hidden="true">
                <span className="projects-scene__current">01</span> / {String(n).padStart(2, "0")}
              </span>
            </div>

            <div className="projects-scene__captions">
              {projects.map((p) => (
                <Link key={p.slug} href={`/projects/${p.slug}/`} className="projects-scene__caption">
                  <span className="projects-scene__name">{p.title}</span>
                  <span className="projects-scene__location">{p.location}</span>
                  <span className="projects-scene__concept">{p.concept}</span>
                </Link>
              ))}
            </div>

            <TextLink href="/projects/">View all projects</TextLink>
          </div>

          <div className="projects-scene__frame">
            {projects.map((p, i) => (
              <Link key={p.slug} href={`/projects/${p.slug}/`} className="projects-scene__slide" style={{ zIndex: i + 1 }} aria-hidden="true" tabIndex={-1}>
                <Photo src={p.thumb} alt="" sizes="(min-width: 901px) 55vw, 100vw" className="photo--fill" />
              </Link>
            ))}
          </div>
        </Wrap>
      </div>

      {/* Phone / tablet / reduced-motion layout */}
      <Wrap className="projects-stack">
        <h2 className="projects-stack__title">Projects</h2>
        {projects.map((p) => (
          <Link key={p.slug} href={`/projects/${p.slug}/`} className="project-card">
            <RevealImage>
              <Photo src={p.thumb} alt={p.title} ratio="3/4" sizes="(min-width: 901px) 28vw, (min-width: 561px) 50vw, 100vw" />
            </RevealImage>
            <span className="project-card__title">{p.title}</span>
            <span className="project-card__location">{p.location}</span>
          </Link>
        ))}
        <TextLink href="/projects/">View all projects</TextLink>
      </Wrap>
    </section>
  );
}
