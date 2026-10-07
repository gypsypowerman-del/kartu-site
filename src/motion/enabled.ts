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

/** Runs in <head> before first paint:
 *  1. motion gate (see above);
 *  2. intro screen: shown when a visit starts on the home page (once per browser session).
 *     Arriving on any other page counts as having entered, so going "home" later never shows it.
 *     Skipped for automated browsers, like motion, so tools capture the real page. */
export const motionBootScript = `(function(){try{var d=document.documentElement,w=navigator.webdriver;if(!w&&window.matchMedia('(prefers-reduced-motion: no-preference)').matches){d.classList.add('${MOTION_CLASS}')}var p=location.pathname,b='${base}',home=p===b+'/'||p===b||p===b+'/index.html',seen=false;try{seen=sessionStorage.getItem('${INTRO_KEY}')==='1'}catch(e){}if(home&&!seen&&!w){d.classList.add('${INTRO_CLASS}');document.addEventListener('click',function(e){var t=e.target;if(!window.__kartuIntroReady&&t&&t.closest&&t.closest('.intro__enter')){d.classList.remove('${INTRO_CLASS}');try{sessionStorage.setItem('${INTRO_KEY}','1')}catch(x){}}},true)}else{try{sessionStorage.setItem('${INTRO_KEY}','1')}catch(e){}}}catch(e){}})();`;

export function motionEnabled() {
  return typeof document !== "undefined" && document.documentElement.classList.contains(MOTION_CLASS);
}


export function introActive() {
  return typeof document !== "undefined" && document.documentElement.classList.contains(INTRO_CLASS);
}

/** Fired on window when the visitor clicks through the intro screen. */
export const ENTER_EVENT = "kartu:enter";
