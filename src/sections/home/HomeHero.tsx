"use client";

import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Nav, Photo, TextLink } from "@/components/ui";
import { heroVideo, pageImages } from "@/content/page-images";
import { asset } from "@/content/assets";
import { DESKTOP_IMAGE_MOTION, ENTER_EVENT, introActive, motionEnabled } from "@/motion/enabled";

gsap.registerPlugin(ScrollTrigger);

/** Home hero: full-height photo, title revealed on load,
 *  then the photo drifts and the copy lifts away as you scroll. */
export default function HomeHero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(true);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      if (!motionEnabled()) return;
      // behind the intro screen the entrance waits until the visitor clicks through
      const waiting = introActive();
      const intro = gsap.timeline({ defaults: { ease: "power3.out" }, paused: waiting });
      const play = () => intro.play();
      if (waiting) window.addEventListener(ENTER_EVENT, play, { once: true });
      intro
        .from(".hero__media", { scale: 1.08, duration: 2.2, ease: "power2.out" }, 0)
        .from(".hero-title .reveal-line__inner", { yPercent: 105, duration: 1.2, stagger: 0.1 }, 0.25)
        .from(".hero-sub, .hero__cta", { y: 24, autoAlpha: 0, duration: 1, stagger: 0.1 }, 0.75)
        .from(".nav--overlay", { autoAlpha: 0, duration: 1 }, 0.4);

      gsap.to(".hero__content", {
        y: -60,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: { trigger: el, start: "35% top", end: "85% top", scrub: true },
      });
      return () => window.removeEventListener(ENTER_EVENT, play);
    }, el);
    // the photo drifts with the scroll on desktop only
    mm.add(DESKTOP_IMAGE_MOTION, () => {
      if (!motionEnabled()) return;
      gsap.to(".hero__media", {
        yPercent: 14,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
    }, el);
    return () => mm.revert();
  }, []);

  return (
    <section className="hero" ref={root}>
      <div className="hero__media">
        {heroVideo ? (
          <HeroVideo ref={video} onState={setPaused} />
        ) : (
          <Photo src={pageImages["home-hero"]} alt="KARTÚ interior, Shepherd's Bush Maisonette" priority sizes="(max-aspect-ratio: 16/9) 189vh, 100vw" position="center 38%" className="photo--fill" />
        )}
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
        <p className="hero-sub">
          A London-based interior design studio{" "}
          <br />
          creating homes shaped by the people who live in them.
        </p>
        <div className="hero__cta">
          <TextLink href="/projects/" tone="white">
            View Projects
          </TextLink>
        </div>
      </div>
      {heroVideo && (
        <button
          type="button"
          className="hero__video-toggle"
          onClick={() => {
            const v = video.current;
            if (!v) return;
            if (v.paused) v.play().catch(() => {});
            else v.pause();
          }}
        >
          {paused ? "Play video" : "Pause video"}
        </button>
      )}
    </section>
  );
}

/** Full-bleed background video (spec: docs/hero-video-spec.md). Muted, looping, decorative.
 *  Starts on the poster; plays only when the visitor allows motion. The pause control lives
 *  in HomeHero (WCAG 2.2.2) and follows the real playback state. */
const HeroVideo = forwardRef<HTMLVideoElement, { onState: (paused: boolean) => void }>(function HeroVideo({ onState }, ref) {
  const local = useRef<HTMLVideoElement>(null);
  useImperativeHandle(ref, () => local.current as HTMLVideoElement);
  useEffect(() => {
    const v = local.current;
    if (!v || !heroVideo) return;
    const mobile = window.matchMedia("(max-width: 760px)").matches;
    if (mobile && heroVideo.posterMobile) v.poster = asset(heroVideo.posterMobile);
    const sync = () => onState(v.paused);
    v.addEventListener("play", sync);
    v.addEventListener("pause", sync);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) v.play().catch(sync);
    return () => {
      v.removeEventListener("play", sync);
      v.removeEventListener("pause", sync);
    };
  }, [onState]);
  if (!heroVideo) return null;
  return (
    <video ref={local} className="hero__video" muted loop playsInline preload="metadata" poster={asset(heroVideo.poster)} aria-hidden="true">
      {heroVideo.mobile && <source media="(max-width: 760px)" src={asset(heroVideo.mobile)} type="video/mp4" />}
      <source src={asset(heroVideo.desktop)} type="video/mp4" />
    </video>
  );
});
