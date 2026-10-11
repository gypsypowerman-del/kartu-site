"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Photo, TextLink, Wrap } from "@/components/ui";
import { RevealLines } from "@/motion/reveal";
import type { Project } from "@/content/types";

/** Home "Projects": one horizontal rail holding every project (client 11/10, replacing the
 *  pinned GSAP scene). The scrolling is the browser's own — `overflow-x` + `scroll-snap`, with
 *  `scroll-snap-stop: always` so one flick moves exactly one project. No ScrollTrigger pin, no
 *  wheel listener, no Lenis lock: the old scene fought the page scroll, which is what made it
 *  stutter and swallow gestures. JavaScript here only drives the arrows, the counter and
 *  drag-to-scroll; without it the rail still scrolls by swipe, trackpad and keyboard.
 *  Same markup at every width — the phone gets the same rail, where swiping is the native gesture. */
export default function HomeProjects({ projects }: { projects: Pick<Project, "slug" | "title" | "concept" | "thumb">[] }) {
  const rail = useRef<HTMLDivElement>(null);
  /** the span of projects actually on screen — not a single "current" slide: two or three
   *  cards are visible at once, and at the end of the track the last card can never reach the
   *  snap position, so scrollLeft / cardWidth would stop counting before the last project. */
  const [span, setSpan] = useState<[number, number]>([0, 0]);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const n = projects.length;

  const step = useCallback(() => {
    const el = rail.current;
    if (!el) return 0;
    const cards = el.children;
    if (cards.length < 2) return el.clientWidth;
    return (cards[1] as HTMLElement).offsetLeft - (cards[0] as HTMLElement).offsetLeft;
  }, []);

  const sync = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    const left = el.scrollLeft;
    const right = left + el.clientWidth;
    let first = -1;
    let last = 0;
    Array.from(el.children).forEach((node, i) => {
      const c = node as HTMLElement;
      // a card counts as on screen once more than half of it is inside the track
      const shown = Math.min(c.offsetLeft + c.offsetWidth, right) - Math.max(c.offsetLeft, left);
      if (shown > c.offsetWidth * 0.5) {
        if (first < 0) first = i;
        last = i;
      }
    });
    if (first < 0) {
      first = Math.max(0, Math.min(n - 1, Math.round(left / (step() || 1))));
      last = first;
    }
    setSpan([first, last]);
    setAtStart(left <= 1);
    setAtEnd(left >= el.scrollWidth - el.clientWidth - 1);
  }, [n, step]);

  const go = useCallback(
    (dir: 1 | -1) => {
      rail.current?.scrollBy({ left: dir * step(), behavior: "smooth" });
    },
    [step],
  );

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        sync();
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", sync);
    sync();

    // drag to scroll with a mouse; a drag must not then follow the card's link
    let down = false;
    let moved = false;
    let startX = 0;
    let startLeft = 0;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch" || e.button !== 0) return;
      down = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      el.classList.add("is-dragging");
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 4) {
        moved = true;
        el.setPointerCapture(e.pointerId);
      }
      if (moved) el.scrollLeft = startLeft - dx;
    };
    const release = () => {
      if (!down) return;
      down = false;
      el.classList.remove("is-dragging");
      if (moved) {
        const s = step() || 1;
        el.scrollTo({ left: Math.round(el.scrollLeft / s) * s, behavior: "smooth" });
      }
      setTimeout(() => {
        moved = false;
      }, 0);
    };
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", release);
    el.addEventListener("pointercancel", release);
    el.addEventListener("click", onClick, true);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", sync);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", release);
      el.removeEventListener("pointercancel", release);
      el.removeEventListener("click", onClick, true);
    };
  }, [step, sync]);

  // keyboard arrows stay scoped to the rail (never global)
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };

  return (
    <section className="projects-rail" aria-labelledby="home-projects-title">
      <Wrap>
        <div className="projects-rail__head">
          <RevealLines as="h2" lines={["Projects"]} className="projects-rail__title" />
          <span className="projects-rail__counter" aria-hidden="true">
            {String(span[0] + 1).padStart(2, "0")}
            {span[1] > span[0] ? `–${String(span[1] + 1).padStart(2, "0")}` : ""} / {String(n).padStart(2, "0")}
          </span>
        </div>

        <div ref={rail} className="projects-rail__track" tabIndex={0} role="group" aria-label="Projects — scroll sideways" onKeyDown={onKeyDown}>
          {projects.map((p, i) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}/`}
              className="projects-rail__card"
              onFocus={() => rail.current?.scrollTo({ left: i * step(), behavior: "smooth" })}
            >
              <Photo src={p.thumb} alt="" ratio="3/4" priority={i < 2} sizes="(min-width:901px) 32vw, 78vw" />
              <span className="projects-rail__name">{p.title}</span>
              <span className="projects-rail__concept">{p.concept}</span>
            </Link>
          ))}
        </div>

        <div className="projects-rail__controls">
          <div className="projects-rail__arrows">
            <button type="button" className="projects-rail__arrow" aria-label="Previous project" onClick={() => go(-1)} disabled={atStart}>
              <svg viewBox="0 0 40 12" aria-hidden="true" focusable="false">
                <path d="M39 6H1m0 0 6.5-5M1 6l6.5 5" fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              </svg>
            </button>
            <span className="projects-rail__divider" aria-hidden="true" />
            <button type="button" className="projects-rail__arrow" aria-label="Next project" onClick={() => go(1)} disabled={atEnd}>
              <svg viewBox="0 0 40 12" aria-hidden="true" focusable="false">
                <path d="M1 6h38m0 0-6.5-5M39 6l-6.5 5" fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              </svg>
            </button>
          </div>

          <div className="projects-rail__progress" aria-hidden="true">
            {projects.map((p, i) => (
              <span key={p.slug} className={i >= span[0] && i <= span[1] ? "is-on" : undefined} />
            ))}
          </div>

          <div className="projects-rail__more">
            <TextLink href="/projects/">View all projects</TextLink>
          </div>
        </div>
      </Wrap>
    </section>
  );
}
