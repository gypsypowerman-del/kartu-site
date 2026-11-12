"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/content/assets";
import { ENTER_EVENT, INTRO_CLASS, INTRO_MIN_MS, INTRO_MS, introActive, markEntered } from "@/motion/enabled";

const FADE_MS = 500; // --duration-base: a very short, quiet fade

/** Landing screen before the homepage (debrief 06/10, slide 1): brand colour, centred logo, nothing else.
 *  It fades by itself after INTRO_MS (client 12/11), and a click anywhere on it enters at once. Visibility is decided before
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
    const timer = window.setTimeout(() => enterRef.current(), Math.max(INTRO_MIN_MS, INTRO_MS - performance.now()));
    return () => {
      window.clearTimeout(timer);
      others.forEach((el) => (el.inert = false));
    };
  }, []);

  const left = useRef(false);
  function enter() {
    if (left.current) return;
    left.current = true;
    setLeaving(true);
    markEntered();
    window.dispatchEvent(new Event(ENTER_EVENT));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // keyboard visitors continue from the top of the page (skip link), not from the hidden button
    const byKeyboard = btn.current?.matches(":focus-visible") ?? false;
    window.setTimeout(() => {
      document.documentElement.classList.remove(INTRO_CLASS);
      Array.from(document.body.children).forEach((el) => ((el as HTMLElement).inert = false));
      window.scrollTo(0, 0);
      if (byKeyboard) document.querySelector<HTMLElement>(".skip-link")?.focus({ preventScroll: true });
    }, reduce ? 0 : FADE_MS);
  }

  const enterRef = useRef(enter);
  enterRef.current = enter;

  return (
    <div ref={ref} onClick={enter} className={`intro ${leaving ? "intro--leaving" : ""}`} onKeyDown={(e) => e.key === "Escape" && enter()}>
      <button ref={btn} type="button" className="intro__enter" aria-label="Enter the KARTÚ website">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/images/logo/Logo_white.svg")} alt="" width={769} height={237} />
      </button>
    </div>
  );
}
