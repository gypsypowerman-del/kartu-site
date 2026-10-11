import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import SmoothScroll from "@/motion/SmoothScroll";
import { motionBootScript } from "@/motion/enabled";
import { abs, IS_PREVIEW, metadataBase, SITE_DESCRIPTION, SITE_NAME } from "@/content/seo";
import { founders, studioEmail } from "@/content/site";
import { INSTAGRAM_URL } from "@/content/assets";
import "@/styles/tokens.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase,
  title: { default: "KARTÚ — Interior Design Studio, London", template: "%s — KARTÚ" },
  description: SITE_DESCRIPTION,
  // Review preview: keep out of search engines until launch on the real domain
  robots: IS_PREVIEW ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#ffffff" };

// Brand fonts: Latin subsets in /public/fonts (npm run fonts). Declared here rather than in
// tokens.css so the URLs carry the base path and the two faces used above the fold can be
// preloaded — the page no longer jumps when they arrive.
const BASE = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/+$/, "");
const FONTS: [family: string, file: string, weight: number][] = [
  ["Agatho", "agatho-light", 300],
  ["Agatho Caps", "agatho-light-caps", 300],
  ["Futura PT", "futura-pt-300", 300],
  ["Futura PT", "futura-pt-400", 400],
  ["Futura PT", "futura-pt-500", 500],
  ["Futura PT", "futura-pt-600", 600],
];
const PRELOAD = ["futura-pt-300", "agatho-light"];
const fontFaces = FONTS.map(
  ([family, file, weight]) =>
    `@font-face{font-family:"${family}";src:url("${BASE}/fonts/${file}.woff2") format("woff2");font-weight:${weight};font-style:normal;font-display:swap}`,
).join("");

// Structured data: who the studio is (no project locations — client rule).
const organisation = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  alternateName: "KARTÚ Interiors",
  description: SITE_DESCRIPTION,
  url: abs("/"),
  logo: abs("/images/logo/Logo.svg"),
  email: studioEmail,
  areaServed: ["London", "United Kingdom"],
  founder: founders.map((f) => ({ "@type": "Person", name: f.name })),
  ...(INSTAGRAM_URL ? { sameAs: [INSTAGRAM_URL] } : {}),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head>
        {/* Sets html.js-motion before first paint — see src/motion/enabled.ts */}
        <script dangerouslySetInnerHTML={{ __html: motionBootScript }} />
        {PRELOAD.map((f) => (
          <link key={f} rel="preload" href={`${BASE}/fonts/${f}.woff2`} as="font" type="font/woff2" crossOrigin="anonymous" />
        ))}
        <style dangerouslySetInnerHTML={{ __html: fontFaces }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organisation) }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
