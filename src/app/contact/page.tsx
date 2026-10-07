import { pageMeta } from "@/content/seo";
import type { Metadata } from "next";
import { Eyebrow, Footer, Nav, Wrap } from "@/components/ui";
import { FadeUp, RevealLines } from "@/motion/reveal";
import ContactForm from "@/sections/contact/ContactForm";
import { contactChannels as CH, conversation as C } from "@/content/site";

export const metadata: Metadata = pageMeta({ path: "/contact/", og: "contact", title: "Contact", description: "Start a conversation with KARTÚ — interior design studio based in London, working across the UK and internationally." });

const EMAIL = "hello@kartuinteriors.com";

// Until the booking tool is connected, "Book an introductory call" opens an email with the same three questions.
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
  const embed = CH.booking ? bookingEmbed(CH.booking) : "";
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

          <div className={`conv-ways ${hasMessengers ? "" : "conv-ways--two"}`}>
            <FadeUp className="conv-way">
              <span className="conv-way__index">01</span>
              <h2 className="conv-way__title">{C.call.title}</h2>
              <p className="conv-way__meta">{C.call.meta}</p>
              <p className="conv-way__text">{C.call.text}</p>
              <a className="text-link" href={embed ? "#book" : callRequest}>
                {embed ? "Choose a time" : "Request a call"}
              </a>
            </FadeUp>
            {hasMessengers && (
              <FadeUp className="conv-way">
                <span className="conv-way__index">02</span>
                <h2 className="conv-way__title">{C.message.title}</h2>
                <p className="conv-way__text">{C.message.text}</p>
                <span className="conv-way__links">
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
            <FadeUp className="conv-way">
              <span className="conv-way__index">{hasMessengers ? "03" : "02"}</span>
              <h2 className="conv-way__title">{C.write.title}</h2>
              <p className="conv-way__text">{C.write.text}</p>
              <a className="text-link" href="#write">
                Send an enquiry
              </a>
            </FadeUp>
          </div>

          {embed && (
            <section id="book" className="conv-book" aria-labelledby="book-title">
              <div className="conv-book__intro">
                <h2 id="book-title" className="conv-book__title">{C.call.title}</h2>
                <p className="conv-book__meta">{C.call.meta}</p>
                <p className="conv-book__text">{C.call.text}</p>
              </div>
              <iframe className="conv-book__embed" src={embed} title="Book an introductory call with KARTÚ" loading="lazy" />
            </section>
          )}

          <section id="write" className="contact conv-write" aria-labelledby="write-title">
            <div className="contact__intro">
              <h2 id="write-title" className="conv-book__title">{C.write.title}</h2>
              <p className="contact__body">{C.write.text}</p>
              <a className="contact__email" href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>
              <p className="contact__note">Based in London, working across the UK and internationally.</p>
            </div>
            <ContactForm />
          </section>
        </Wrap>
      </main>
      <Footer />
    </>
  );
}

/** Inline embed URL for Calendly or Cal.com, themed in KARTÚ colours (white, ink, black accent). */
function bookingEmbed(url: string) {
  const u = new URL(url);
  if (u.hostname.includes("calendly.com")) {
    u.searchParams.set("hide_gdpr_banner", "1");
    u.searchParams.set("background_color", "ffffff");
    u.searchParams.set("text_color", "2a2a2a");
    u.searchParams.set("primary_color", "000000");
  } else {
    u.searchParams.set("embed", "true");
    u.searchParams.set("theme", "light");
    u.searchParams.set("layout", "month_view");
  }
  return u.toString();
}
