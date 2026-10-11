import { pageMeta } from "@/content/seo";
import type { Metadata } from "next";
import { Footer, Nav, Wrap } from "@/components/ui";
import { privacyIntro, privacySections, privacyUpdated } from "@/content/privacy";

export const metadata: Metadata = pageMeta({ path: "/privacy/", og: "home", title: "Privacy Policy", description: "How KARTÚ collects, uses and protects your personal information, and your rights under UK data protection law." });

/** Email addresses in the policy text become mailto links. */
function withLinks(text: string) {
  return text.split(/([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/).map((part, i) => (i % 2 ? <a key={i} href={`mailto:${part}`}>{part}</a> : part));
}

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
                        {withLinks(line)}
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
