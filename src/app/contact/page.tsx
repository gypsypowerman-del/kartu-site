import { pageMeta } from "@/content/seo";
import type { Metadata } from "next";
import { Eyebrow, Footer, Nav, Wrap } from "@/components/ui";
import { FadeUp, RevealLines } from "@/motion/reveal";
import ContactForm from "@/sections/contact/ContactForm";
import { contactChannels as CH, conversation as C, studioEmail as EMAIL } from "@/content/site";

export const metadata: Metadata = pageMeta({ path: "/contact/", og: "contact", title: "Contact", description: "Start a conversation with KARTÚ — interior design studio based in London, working across the UK and internationally." });

// The 20-minute call is booked on the studio's own booking page (Microsoft Bookings, client 10/11), opened in a new tab:
// no third-party calendar or its cookies load on our page (no cookie banner at launch). Without a booking link,
// "Request a call" opens an email with the same three questions.
const callRequest =
  `mailto:${EMAIL}?subject=${encodeURIComponent("Introductory call")}&body=` +
  encodeURIComponent(
    "Hello KARTÚ,\n\nI’d like to book a 20-minute introductory call.\n\n" +
      C.questions.map((q) => `${q.q} (${q.a.join(" / ")})\n— \n`).join("\n") +
      "\nTimes that suit me:\n— \n\nName:\n",
  );

/** Contact — three ways to begin (client-approved 07/10): book a call, message, or write. */
export default function ContactPage() {
  const whatsapp = CH.whatsapp ? `https://wa.me/${CH.whatsapp}?text=${encodeURIComponent(C.message.first)}` : "";
  const telegram = CH.telegram ? `https://t.me/${CH.telegram}` : "";
  const hasMessengers = Boolean(whatsapp || telegram);
  return (
    <>
      <Nav current="contact" />
      <main id="main">
        <Wrap>
          <header className="page-intro conv-intro">
            <Eyebrow>Contact</Eyebrow>
            <RevealLines as="h1" lines={["Start a conversation."]} className="page-intro__title" immediate />
            <FadeUp>
              <p className="page-intro__lead">
                Whether you are planning a full renovation, looking for help with a particular stage of your project, or simply want to discuss an idea, we would love to hear from you.
              </p>
            </FadeUp>
          </header>

          {/* Two rows on one two-column grid (client 08/10): call + message on top,
              "Write to us" below — its text under 01, the form under 02 — so 01·02·03 align. */}
          <div className="conv-ways">
            <FadeUp className="conv-way">
              <span className="conv-way__index">01</span>
              <h2 className="conv-way__title">{C.call.title}</h2>
              <p className="conv-way__meta">{C.call.meta}</p>
              <p className="conv-way__text">{C.call.text}</p>
              {CH.booking ? (
                <a className="text-link conv-way__action" href={CH.booking} target="_blank" rel="noopener noreferrer">
                  Choose a time
                </a>
              ) : (
                <a className="text-link conv-way__action" href={callRequest}>
                  Request a call
                </a>
              )}
            </FadeUp>
            {hasMessengers && (
              <FadeUp className="conv-way">
                <span className="conv-way__index">02</span>
                <h2 className="conv-way__title">{C.message.title}</h2>
                <p className="conv-way__text">{C.message.text}</p>
                <span className="conv-way__links conv-way__action">
                  {whatsapp && (
                    <a className="text-link" href={whatsapp} target="_blank" rel="noopener noreferrer">
                      WhatsApp
                    </a>
                  )}
                  {telegram && (
                    <a className="text-link" href={telegram} target="_blank" rel="noopener noreferrer">
                      Telegram
                    </a>
                  )}
                </span>
              </FadeUp>
            )}

            <section id="write" className="conv-ways__write" aria-labelledby="write-title">
              <FadeUp className="conv-way">
                <span className="conv-way__index">{hasMessengers ? "03" : "02"}</span>
                <h2 id="write-title" className="conv-way__title">
                  {C.write.title}
                </h2>
                <p className="conv-way__text">{C.write.text}</p>
                <a className="contact__email" href={`mailto:${EMAIL}`}>
                  {EMAIL}
                </a>
                <p className="contact__note">Based in London, working across the UK and internationally.</p>
              </FadeUp>
              <div className="conv-way conv-way--form">
                <ContactForm />
              </div>
            </section>
          </div>

        </Wrap>
      </main>
      <Footer />
    </>
  );
}
