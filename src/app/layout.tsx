import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import SmoothScroll from "@/motion/SmoothScroll";
import { motionBootScript } from "@/motion/enabled";
import { metadataBase, SITE_DESCRIPTION } from "@/content/seo";
import "@/styles/tokens.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase,
  title: { default: "KARTÚ — Interior Design Studio, London", template: "%s — KARTÚ" },
  description: SITE_DESCRIPTION,
  // Review preview: keep out of search engines until launch on the real domain
  robots: process.env.NEXT_PUBLIC_PREVIEW === "1" ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#ffffff" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head>
        {/* Sets html.js-motion before first paint — see src/motion/enabled.ts */}
        <script dangerouslySetInnerHTML={{ __html: motionBootScript }} />
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
