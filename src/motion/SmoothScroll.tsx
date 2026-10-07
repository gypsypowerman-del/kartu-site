"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ENTER_EVENT, introActive, motionEnabled } from "./enabled";

gsap.registerPlugin(ScrollTrigger);

/** Inertial scroll for the whole site, kept in sync with ScrollTrigger.
 *  Disabled entirely when the visitor prefers reduced motion. */
export default function SmoothScroll() {
  useEffect(() => {
    if (!motionEnabled()) return;

    // lerp 0.15 (default 0.1): the page follows the wheel closely — smooth, without feeling heavy
    const lenis = new Lenis({ lerp: 0.15 });
    lenis.on("scroll", ScrollTrigger.update);
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    // page stays still under the intro screen until the visitor enters
    const start = () => lenis.start();
    if (introActive()) {
      lenis.stop();
      window.addEventListener(ENTER_EVENT, start, { once: true });
    }
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener(ENTER_EVENT, start);
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
      lenis.destroy();
    };
  }, []);

  return null;
}
