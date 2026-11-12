/** Motion is progressive enhancement: content is always visible in the HTML,
 *  and only hidden for an entrance animation when all of these hold —
 *  JS ran, the visitor has no reduced-motion preference, and the page is not
 *  being driven by an automated browser (screenshot/preview/review tools),
 *  which would otherwise capture never-revealed blocks as empty space.
 *  The `js-motion` class is set by an inline script in <head> (see layout.tsx). */
export const MOTION_CLASS = "js-motion";

export const INTRO_CLASS = "has-intro";
export const INTRO_KEY = "kartu-entered";
const base = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** The intro counts as seen for 30 minutes after the visitor's last page view on the site.
 *  (It used to be "once per browser session" via sessionStorage — but iPhone Safari keeps a tab's
 *  session for days, so a phone that had entered once never saw the intro again. Lesson 11/11.)
 *  Stored as a timestamp in localStorage, refreshed on every page view, so browsing never re-triggers it. */
export const INTRO_TTL_MS = 30 * 60 * 1000;

/** How long the intro stays before it fades by itself; a click or tap anywhere skips it.
 *  Client 12/11: 1.75 s read as "almost instant" (the logo also had to wait for the page to load),
 *  so it is now 3.2 s from page load, and never less than INTRO_MIN_MS once the page is ready. */
export const INTRO_MS = 3200;
export const INTRO_MIN_MS = 2400;

/** Runs in <head> before first paint:
 *  1. motion gate (see above);
 *  2. intro screen: shown when a visit starts on the home page and the visitor has not been on the
 *     site in the last 30 minutes. Arriving on any other page counts as having entered.
 *     Skipped for automated browsers, like motion, so tools capture the real page. */
export const motionBootScript = `(function(){try{var d=document.documentElement,w=navigator.webdriver;if(!w&&window.matchMedia('(prefers-reduced-motion: no-preference)').matches){d.classList.add('${MOTION_CLASS}')}var p=location.pathname,b='${base}',home=p===b+'/'||p===b||p===b+'/index.html',k='${INTRO_KEY}',now=Date.now(),seen=false;function mark(){try{localStorage.setItem(k,String(Date.now()))}catch(e){}}try{var t=+localStorage.getItem(k);seen=t>0&&now-t<${INTRO_TTL_MS}}catch(e){}if(home&&!seen&&!w){d.classList.add('${INTRO_CLASS}');var off=function(){if(!window.__kartuIntroReady&&d.classList.contains('${INTRO_CLASS}')){d.classList.remove('${INTRO_CLASS}');mark()}};document.addEventListener('click',function(e){var t=e.target;if(t&&t.closest&&t.closest('.intro'))off()},true);setTimeout(off,${INTRO_MS}+3000)}else{mark()}}catch(e){}})();`;

/** Records that the visitor has entered (or is still browsing). */
export function markEntered() {
  try {
    localStorage.setItem(INTRO_KEY, String(Date.now()));
  } catch {}
}

/** Scroll-driven image motion (blind reveals, parallax, pinned scene) runs on desktop only:
 *  wide screen + mouse/trackpad. Phones and tablets get static photos (client request 07/10);
 *  text reveals stay everywhere. */
export const DESKTOP_IMAGE_MOTION = "(prefers-reduced-motion: no-preference) and (min-width: 901px) and (hover: hover) and (pointer: fine)";

export function motionEnabled() {
  return typeof document !== "undefined" && document.documentElement.classList.contains(MOTION_CLASS);
}


export function introActive() {
  return typeof document !== "undefined" && document.documentElement.classList.contains(INTRO_CLASS);
}

/** Fired on window when the visitor clicks through the intro screen. */
export const ENTER_EVENT = "kartu:enter";
