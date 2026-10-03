/** Motion is progressive enhancement: content is always visible in the HTML,
 *  and only hidden for an entrance animation when all of these hold —
 *  JS ran, the visitor has no reduced-motion preference, and the page is not
 *  being driven by an automated browser (screenshot/preview/review tools),
 *  which would otherwise capture never-revealed blocks as empty space.
 *  The `js-motion` class is set by an inline script in <head> (see layout.tsx). */
export const MOTION_CLASS = "js-motion";

export const motionBootScript = `(function(){try{if(!navigator.webdriver&&window.matchMedia('(prefers-reduced-motion: no-preference)').matches){document.documentElement.classList.add('${MOTION_CLASS}')}}catch(e){}})();`;

export function motionEnabled() {
  return typeof document !== "undefined" && document.documentElement.classList.contains(MOTION_CLASS);
}

