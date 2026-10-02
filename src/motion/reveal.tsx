"use client";

import { createElement, useLayoutEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const EASE = "power3.out"; // ≈ --ease-out
const motionOK = "(prefers-reduced-motion: no-preference)";

/** Headline revealed line by line from under a mask.
 *  Pass the lines explicitly so breaks are designed, not left to the browser. */
export function RevealLines({
  as = "h2",
  lines,
  className,
  style,
  delay = 0,
  immediate = false,
}: {
  as?: ElementType;
  lines: ReactNode[];
  className?: string;
  style?: CSSProperties;
  delay?: number;
  /** true for above-the-fold text: plays on load instead of on scroll */
  immediate?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(motionOK, () => {
      gsap.from(el.querySelectorAll(".reveal-line__inner"), {
        yPercent: 105,
        duration: 1.1,
        ease: EASE,
        stagger: 0.09,
        delay,
        scrollTrigger: immediate ? undefined : { trigger: el, start: "top 85%", once: true },
      });
    });
    return () => mm.revert();
  }, [delay, immediate]);

  return createElement(
    as,
    { ref, className, style, "data-motion": "lines" },
    lines.map((line, i) => (
      <span className="reveal-line" key={i}>
        <span className="reveal-line__inner">{line}</span>
      </span>
    )),
  );
}

/** Fade-and-rise for body copy, links and small blocks. */
export function FadeUp({ children, className, style, delay = 0 }: { children: ReactNode; className?: string; style?: CSSProperties; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(motionOK, () => {
      gsap.from(el, {
        y: 28,
        autoAlpha: 0,
        duration: 1,
        ease: EASE,
        delay,
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    });
    return () => mm.revert();
  }, [delay]);
  return (
    <div ref={ref} className={className} style={style} data-motion="fade">
      {children}
    </div>
  );
}

/** Image opens like a blind (bottom → top) while settling from 1.12 to 1. */
export function RevealImage({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const media = el.firstElementChild as HTMLElement | null;
    const mm = gsap.matchMedia();
    mm.add(motionOK, () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      tl.from(el, { clipPath: "inset(100% 0% 0% 0%)", duration: 1.3, ease: "power4.inOut" });
      if (media) tl.from(media, { scale: 1.12, duration: 1.8, ease: EASE }, 0);
    });
    return () => mm.revert();
  }, []);
  return (
    <div ref={ref} className={className} style={{ overflow: "hidden", clipPath: "inset(0% 0% 0% 0%)", ...style }} data-motion="image">
      {children}
    </div>
  );
}

/** Moves its child vertically against the scroll. speed 0.1 = subtle. */
export function Parallax({ children, speed = 0.12, className, style }: { children: ReactNode; speed?: number; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(`${motionOK} and (min-width: 561px)`, () => {
      gsap.fromTo(
        el,
        { yPercent: -speed * 50 },
        { yPercent: speed * 50, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
      );
    });
    return () => mm.revert();
  }, [speed]);
  return (
    <div ref={ref} className={className} style={style} data-motion="parallax" data-speed={speed}>
      {children}
    </div>
  );
}
