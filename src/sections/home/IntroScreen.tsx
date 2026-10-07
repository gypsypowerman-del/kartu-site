"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/content/assets";
import { ENTER_EVENT, INTRO_CLASS, INTRO_KEY, introActive } from "@/motion/enabled";

const FADE_MS = 500; // --duration-base: a very short, quiet fade

/** Landing screen before the homepage (debrief 06/10, slide 1): brand colour, centred logo, nothing else.
 *  The visitor enters by clicking the logo — no automatic redirect. Visibility is decided before
 *  first paint by html.has-intro (see motionBootScript), so there is no flash of the homepage. */
export default function IntroScreen() {
  const ref = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    (window as unknown as { __kartuIntroReady?: boolean }).__kartuIntroReady = true; // React handles the click from here
    if (!introActive()) return;
    // keep keyboard and screen-reader focus on the intro while it is shown
    const others = Array.from(document.body.children).filter((el) => el !== ref.current && el.tagName !== "SCRIPT") as HTMLElement[];
    others.forEach((el) => (el.inert = true)); // the first Tab lands on the logo; no forced focus ring on arrival
    return () => others.forEach((el) => (el.inert = false));
  }, []);

  function enter() {
    if (leaving) return;
    setLeaving(true);
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {}
    window.dispatchEvent(new Event(ENTER_EVENT));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => {
      document.documentElement.classList.remove(INTRO_CLASS);
      Array.from(document.body.children).forEach((el) => ((el as HTMLElement).inert = false));
      window.scrollTo(0, 0);
    }, reduce ? 0 : FADE_MS);
  }

  return (
    <div ref={ref} className={`intro ${leaving ? "intro--leaving" : ""}`} onKeyDown={(e) => e.key === "Escape" && enter()}>
      <button ref={btn} type="button" className="intro__enter" onClick={enter} aria-label="Enter the KARTÚ website">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/images/logo/Logo_white.svg")} alt="" width={769} height={237} />
      </button>
    </div>
  );
}
