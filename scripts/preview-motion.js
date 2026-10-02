// Vanilla mirror of src/motion/* and src/sections/home/* for the single-file preview.
// Keep timings in sync with the React components.
(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.registerPlugin(ScrollTrigger);
  var EASE = "power3.out";

  if (window.Lenis) {
    var lenis = new Lenis({ duration: 1.15, easing: function (t) { return 1 - Math.pow(1 - t, 3); } });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  // Hero intro + scroll-out
  var hero = document.querySelector(".hero");
  if (hero) {
    gsap.timeline({ defaults: { ease: EASE } })
      .from(".hero__media", { scale: 1.08, duration: 2.2, ease: "power2.out" }, 0)
      .from(".hero-title .reveal-line__inner", { yPercent: 105, duration: 1.2, stagger: 0.1 }, 0.25)
      .from(".hero-sub, .hero__cta", { y: 24, autoAlpha: 0, duration: 1, stagger: 0.1 }, 0.75)
      .from(".nav--overlay", { autoAlpha: 0, duration: 1 }, 0.4);
    gsap.to(".hero__media", { yPercent: 14, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".hero__content", { y: -60, autoAlpha: 0, ease: "none", scrollTrigger: { trigger: hero, start: "35% top", end: "85% top", scrub: true } });
  }

  // Generic reveals
  document.querySelectorAll('[data-motion="lines"]').forEach(function (el) {
    gsap.from(el.querySelectorAll(".reveal-line__inner"), { yPercent: 105, duration: 1.1, ease: EASE, stagger: 0.09, scrollTrigger: { trigger: el, start: "top 85%", once: true } });
  });
  document.querySelectorAll('[data-motion="fade"]').forEach(function (el) {
    gsap.from(el, { y: 28, autoAlpha: 0, duration: 1, ease: EASE, scrollTrigger: { trigger: el, start: "top 90%", once: true } });
  });
  document.querySelectorAll('[data-motion="image"]').forEach(function (el) {
    var tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 88%", once: true } });
    tl.from(el, { clipPath: "inset(100% 0% 0% 0%)", duration: 1.3, ease: "power4.inOut" });
    if (el.firstElementChild) tl.from(el.firstElementChild, { scale: 1.12, duration: 1.8, ease: EASE }, 0);
  });
  var mm = gsap.matchMedia();
  mm.add("(min-width: 561px)", function () {
    document.querySelectorAll('[data-motion="parallax"]').forEach(function (el) {
      var s = parseFloat(el.dataset.speed || "0.12");
      gsap.fromTo(el, { yPercent: -s * 50 }, { yPercent: s * 50, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    });
  });

  // Pinned projects scene (desktop)
  mm.add("(min-width: 901px)", function () {
    var el = document.querySelector(".projects-scene");
    if (!el) return;
    var slides = gsap.utils.toArray(".projects-scene__slide", el);
    var titles = gsap.utils.toArray(".projects-scene__caption", el);
    var counter = el.querySelector(".projects-scene__current");
    var n = slides.length;
    if (n < 2) return;
    gsap.set(slides.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });
    gsap.set(titles.slice(1), { yPercent: 100, autoAlpha: 0 });
    var tl = gsap.timeline({
      defaults: { ease: "power2.inOut", duration: 1 },
      scrollTrigger: {
        trigger: ".projects-scene__stage", start: "top top",
        end: function () { return "+=" + window.innerHeight * (n - 1) * 0.9; },
        pin: true, scrub: 0.6,
        snap: { snapTo: 1 / (n - 1), duration: 0.5, ease: "power1.inOut" },
        onUpdate: function (self) { if (counter) counter.textContent = String(Math.min(n, Math.round(self.progress * (n - 1)) + 1)).padStart(2, "0"); }
      }
    });
    for (var i = 1; i < n; i++) {
      var at = i - 1;
      tl.to(slides[i], { clipPath: "inset(0% 0% 0% 0%)" }, at)
        .fromTo(slides[i].querySelector(".photo"), { scale: 1.15 }, { scale: 1 }, at)
        .to(slides[i - 1].querySelector(".photo"), { scale: 0.94, autoAlpha: 0.6 }, at)
        .to(titles[i - 1], { yPercent: -100, autoAlpha: 0, duration: 0.6 }, at)
        .to(titles[i], { yPercent: 0, autoAlpha: 1, duration: 0.6 }, at + 0.4);
    }
  });

  // Other pages aren't built yet in the preview
  document.querySelectorAll("a[data-soon]").forEach(function (a) { a.addEventListener("click", function (e) { e.preventDefault(); }); });
})();
