import { pageMeta } from "@/content/seo";
import type { Metadata } from "next";
import { Eyebrow, Footer, Grid12, Nav, Wrap } from "@/components/ui";
import { FadeUp, RevealLines } from "@/motion/reveal";
import ContactForm from "@/sections/contact/ContactForm";
import { BookingCalendarMock, BookingQuestionsMock } from "@/sections/contact/BookingMock";
import { conversation as C } from "@/content/site";

export const metadata: Metadata = pageMeta({ path: "/contact/", og: "contact", title: "Contact", description: "Start a conversation with KARTÚ — interior design studio based in London, working across the UK and internationally." });

/** Proposal 07/10: three ways to begin — book a call, message, or write. */
export default function ContactPage() {
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

          <Grid12 className="conv-ways">
            <FadeUp className="conv-way">
              <span className="conv-way__index">01</span>
              <h2 className="conv-way__title">{C.call.title}</h2>
              <p className="conv-way__text">{C.call.text}</p>
              <a className="text-link" href="#book">
                Choose a time
              </a>
            </FadeUp>
            <FadeUp className="conv-way">
              <span className="conv-way__index">02</span>
              <h2 className="conv-way__title">{C.message.title}</h2>
              <p className="conv-way__text">{C.message.text}</p>
              <span className="conv-way__links">
                <a className="text-link" href={C.message.whatsapp} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
                <a className="text-link" href={C.message.telegram} target="_blank" rel="noopener noreferrer">
                  Telegram
                </a>
              </span>
            </FadeUp>
            <FadeUp className="conv-way">
              <span className="conv-way__index">03</span>
              <h2 className="conv-way__title">{C.write.title}</h2>
              <p className="conv-way__text">{C.write.text}</p>
              <a className="text-link" href="#write">
                Send an enquiry
              </a>
            </FadeUp>
          </Grid12>

          <section id="book" className="conv-book" aria-labelledby="book-title">
            <div className="conv-book__intro">
              <h2 id="book-title" className="conv-book__title">{C.call.title}</h2>
              <p className="conv-book__meta">{C.call.meta}</p>
              <p className="conv-book__text">{C.call.text}</p>
            </div>
            <div className="conv-book__widgets">
              <BookingCalendarMock />
              <BookingQuestionsMock />
            </div>
          </section>

          <section className="conv-next" aria-labelledby="next-title">
            <h2 id="next-title" className="conv-next__title">What happens next</h2>
            <ol className="conv-next__steps">
              {C.steps.map(([t, d], i) => (
                <li key={t}>
                  <span className="conv-next__index">{String(i + 1).padStart(2, "0")}</span>
                  <span className="conv-next__name">{t}</span>
                  <span className="conv-next__text">{d}</span>
                </li>
              ))}
            </ol>
            <p className="conv-next__reply">{C.reply}</p>
          </section>

          <section id="write" className="contact conv-write" aria-labelledby="write-title">
            <div className="contact__intro">
              <h2 id="write-title" className="conv-book__title">{C.write.title}</h2>
              <p className="contact__body">{C.write.text}</p>
              <a className="contact__email" href="mailto:hello@kartuinteriors.com">
                hello@kartuinteriors.com
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
