"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Photo, TextLink, Wrap } from "@/components/ui";
import { RevealImage } from "@/motion/reveal";
import type { Project } from "@/content/types";
import { DESKTOP_IMAGE_MOTION, motionEnabled } from "@/motion/enabled";

gsap.registerPlugin(ScrollTrigger);

const SCENE_RATIO = 2 / 3;

/** Desktop: a pinned scene — each project's photo opens over the previous one
 *  and the caption switches cleanly to the project in view. Every change plays to the end
 *  on its own (one flick = one project), so two photos never rest half over each other.
 *  Photos keep their own proportions (client: "don't make the squares format").
 *  Phone / reduced motion / no JS / automated browsers: a plain stack of cards. */
export default function HomeProjects({ projects }: { projects: Pick<Project, "slug" | "title" | "concept" | "thumb">[] }) {
  const root = useRef<HTMLElement>(null);
  const n = projects.length;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(DESKTOP_IMAGE_MOTION, () => {
      if (!motionEnabled()) return;
      const slides = gsap.utils.toArray<HTMLElement>(".projects-scene__slide", el);
      const titles = gsap.utils.toArray<HTMLElement>(".projects-scene__caption", el);
      const counter = el.querySelector<HTMLElement>(".projects-scene__current");

      // each photo wipes up over the previous one: the slide rises while its photo holds still
      // (two opposite transforms — composited, no clip-path repaint)
      const photos = slides.map((s) => s.querySelector<HTMLElement>(".photo"));
      // y:0 drops the CSS pre-paint offset GSAP would otherwise read as pixels
      gsap.set(slides[0], { y: 0, yPercent: 0 });
      gsap.set(slides.slice(1), { y: 0, yPercent: 101 });
      gsap.set(photos.slice(1), { yPercent: -101 });

      let active = -1;
      const setActive = (idx: number) => {
        if (idx === active) return;
        active = idx;
        titles.forEach((t, i) => t.classList.toggle("is-active", i === idx));
        if (counter) counter.textContent = String(idx + 1).padStart(2, "0");
      };
      setActive(0);

      // ---- Auto-complete (client 11/10): a photo never stops half-way. One flick of the wheel or
      // trackpad in either direction plays the whole change to the next / previous project; input is
      // held while it plays and until the gesture (incl. trackpad inertia) has died down, so one
      // flick = one project. Arriving from above/below, the scene first settles on the first/last one.
      const THRESHOLD = 0.04; // share of one change that counts as intent (≈30px)
      const QUIET_MS = 160; // wheel silence that ends a gesture
      const HOLD_MAX_MS = 1400; // never hold input longer than this after a change
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
      type LenisLike = { scrollTo: (y: number, o: Record<string, unknown>) => void; isLocked: boolean };
      const getLenis = () => (window as unknown as { __lenis?: LenisLike }).__lenis;
      let settled = 0; // project currently at rest
      let busy = false;
      let arriving = false;
      let lastWheel = 0;
      let holdTimer = 0;
      const onWheel = () => (lastWheel = performance.now());
      window.addEventListener("wheel", onWheel, { passive: true });

      const release = (lenis: LenisLike, since: number) => {
        const quiet = performance.now() - lastWheel >= QUIET_MS;
        if (quiet || performance.now() - since > HOLD_MAX_MS) {
          lenis.isLocked = false;
          busy = false;
          return;
        }
        holdTimer = window.setTimeout(() => release(lenis, since), 50);
      };

      const settle = (self: ScrollTrigger, target: number, from: number) => {
        const lenis = getLenis();
        if (!lenis) return;
        busy = true;
        arriving = false;
        // rest 1px inside the pinned range, so the first/last project still counts as "in the scene"
        // (at exactly start/end ScrollTrigger reports leave/enter and a step would read as an arrival)
        const y = Math.min(self.end - 1, Math.max(self.start + 1, self.start + ((self.end - self.start) * target) / (n - 1)));
        lenis.scrollTo(y, {
          duration: 0.35 + 0.6 * Math.min(1, Math.abs(target - from)),
          easing: easeOut,
          lock: true,
          force: true,
          onComplete: () => {
            settled = target;
            lenis.isLocked = true; // keep swallowing the tail of the gesture
            release(lenis, performance.now());
          },
        });
      };

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut", duration: 1 },
        scrollTrigger: {
          trigger: ".projects-scene__stage",
          start: "top top",
          end: () => `+=${window.innerHeight * (n - 1) * 0.9}`,
          pin: true,
          scrub: 0.3,
          onEnter: () => ((settled = 0), (arriving = true)),
          onEnterBack: () => ((settled = n - 1), (arriving = true)),
          onUpdate: (self) => {
            const pos = self.progress * (n - 1);
            // caption follows the photo that is more than half open
            setActive(Math.min(n - 1, Math.round(pos)));
            if (busy || Math.abs(pos - settled) < THRESHOLD) return;
            const dir = Math.sign(pos - settled);
            const target = arriving
              ? Math.round(pos) // catch the visitor on the project they scrolled into
              : Math.abs(pos - settled) <= 1
                ? settled + dir // the next project in the direction of the flick
                : Math.round(pos); // a jump (scrollbar, keyboard End…) → nearest project
            settle(self, Math.max(0, Math.min(n - 1, target)), pos);
          },
        },
      });

      // Keyboard: tabbing to a project's caption scrolls the scene to that project
      const st = tl.scrollTrigger!;
      const onFocus = (idx: number) => () => {
        const y = st.start + ((st.end - st.start) * idx) / (n - 1);
        settled = idx;
        arriving = false;
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
        else window.scrollTo({ top: y, behavior: "auto" });
        ScrollTrigger.update();
        const box = el.querySelector<HTMLElement>(".projects-scene__captions");
        if (box) box.scrollTop = 0;
        setActive(idx);
      };
      const handlers = titles.map((t, idx) => {
        const h = onFocus(idx);
        t.addEventListener("focus", h);
        return () => t.removeEventListener("focus", h);
      });

      for (let i = 1; i < n; i++) {
        const at = i - 1;
        // slides differ slightly in width, so the outgoing one fades while the next opens
        tl.to(slides[i], { yPercent: 0 }, at).to(photos[i], { yPercent: 0 }, at);
      }
      return () => {
        window.removeEventListener("wheel", onWheel);
        window.clearTimeout(holdTimer);
        const lenis = getLenis();
        if (lenis && busy) lenis.isLocked = false;
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
                  <span className="projects-scene__concept">{p.concept}</span>
                </Link>
              ))}
            </div>

            <div className="projects-scene__more">
              <TextLink href="/projects/">View all projects</TextLink>
            </div>
          </div>

          {/* one shared 2:3 frame: each photo wipes over the previous one exactly (07/10 — the
              three photos are 3:4, 3:5 and 2:3, and differing widths made the wipe look ragged).
              Portrait, never square; at most ~11% is trimmed from one edge. */}
          <div className="projects-scene__frame" style={{ ["--frame-r" as string]: SCENE_RATIO }}>
            {projects.map((p, i) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}/`}
                className="projects-scene__slide"
                style={{ zIndex: i + 1, ["--r" as string]: SCENE_RATIO }}
                aria-hidden="true"
                tabIndex={-1}
              >
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
              <Photo src={p.thumb} alt="" sizes="(min-width: 561px) 30vw, 100vw" />
            </RevealImage>
            <span className="project-card__title">{p.title}</span>
          </Link>
        ))}
        <TextLink href="/projects/">View all projects</TextLink>
      </Wrap>
    </section>
  );
}
