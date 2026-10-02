import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import SmoothScroll from "@/motion/SmoothScroll";
import "@/styles/tokens.css";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "KARTÚ — Interior Design Studio, London", template: "%s — KARTÚ" },
  description: "A London-based interior design studio creating distinctive, thoughtful spaces for contemporary living.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#ffffff" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="preload" href="/fonts/agatho-light.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/futura-pt-300.woff2" as="font" type="font/woff2" crossOrigin="" />
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
