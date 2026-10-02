import type { Metadata } from "next";
import { Footer, Nav, TextLink, Wrap } from "@/components/ui";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="main">
        <Wrap className="not-found">
          <h1 className="not-found__title">This page doesn’t exist.</h1>
          <TextLink href="/">Back to the home page</TextLink>
        </Wrap>
      </main>
      <Footer />
    </>
  );
}
