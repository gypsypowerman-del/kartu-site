"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Nav, Photo, TextLink } from "@/components/ui";
import { pageImages } from "@/content/page-images";

gsap.registerPlugin(ScrollTrigger);

/** Home hero: full-height photo, title revealed on load,
 *  then the photo drifts and the copy lifts away as you scroll. */
export default function HomeHero() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .from(".hero__media", { scale: 1.08, duration: 2.2, ease: "power2.out" }, 0)
        .from(".hero-title .reveal-line__inner", { yPercent: 105, duration: 1.2, stagger: 0.1 }, 0.25)
        .from(".hero-sub, .hero__cta", { y: 24, autoAlpha: 0, duration: 1, stagger: 0.1 }, 0.75)
        .from(".nav--overlay", { autoAlpha: 0, duration: 1 }, 0.4);

      gsap.to(".hero__media", {
        yPercent: 14,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero__content", {
        y: -60,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: { trigger: el, start: "35% top", end: "85% top", scrub: true },
      });
    }, el);
    return () => mm.revert();
  }, []);

  return (
    <section className="hero" ref={root}>
      <div className="hero__media">
        <Photo src={pageImages["home-hero"]} alt="KARTÚ interior, Shepherd's Bush Maisonette" priority sizes="(max-aspect-ratio: 16/9) 189vh, 100vw" position="center 38%" className="photo--fill" />
      </div>
      <div className="hero__scrim" />
      <Nav overlay />
      <div className="hero__content">
        <h1 className="hero-title">
          <span className="reveal-line">
            <span className="reveal-line__inner">Interiors created</span>
          </span>
          <span className="reveal-line">
            <span className="reveal-line__inner">through dialogue.</span>
          </span>
        </h1>
        <p className="hero-sub">A London-based interior design studio creating distinctive, thoughtful spaces for contemporary living.</p>
        <div className="hero__cta">
          <TextLink href="/projects/" tone="white">
            View Projects
          </TextLink>
        </div>
      </div>
    </section>
  );
}
