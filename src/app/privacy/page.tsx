import { pageMeta } from "@/content/seo";
import type { Metadata } from "next";
import { Footer, Nav, Wrap } from "@/components/ui";
import { privacyIntro, privacySections, privacyUpdated } from "@/content/privacy";

export const metadata: Metadata = pageMeta({ path: "/privacy/", og: "home", title: "Privacy Policy" });

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main id="main">
        <Wrap>
          <article className="legal">
            <p className="legal__updated">Last updated: {privacyUpdated}</p>
            <h1 className="legal__title">Privacy Policy</h1>
            <p className="legal__intro">{privacyIntro}</p>
            {privacySections.map((s) => (
              <section key={s.title} className="legal__section">
                <h2>{s.title}</h2>
                {s.body.map((para, i) => (
                  <p key={i}>
                    {para.split("\n").map((line, j, arr) => (
                      <span key={j}>
                        {line}
                        {j < arr.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                ))}
              </section>
            ))}
          </article>
        </Wrap>
      </main>
      <Footer />
    </>
  );
}
