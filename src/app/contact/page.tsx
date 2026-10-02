import type { Metadata } from "next";
import { Eyebrow, Footer, Nav, Wrap } from "@/components/ui";
import { FadeUp, RevealLines } from "@/motion/reveal";
import ContactForm from "@/sections/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a conversation with KARTÚ — interior design studio based in London, working across the UK and internationally.",
};

export default function ContactPage() {
  return (
    <>
      <Nav current="contact" />
      <main id="main">
        <Wrap className="contact">
          <div className="contact__intro">
            <Eyebrow>Contact</Eyebrow>
            <RevealLines as="h1" lines={["Start a conversation."]} className="contact__title" immediate />
            <FadeUp>
              <p className="contact__body">
                Whether you are planning a full renovation, looking for help with a particular stage of your project, or simply want to discuss an idea, we would love to hear from you.
              </p>
              <a className="contact__email" href="mailto:hello@kartuinteriors.com">
                hello@kartuinteriors.com
              </a>
              <p className="contact__note">Based in London, working across the UK and internationally.</p>
            </FadeUp>
          </div>
          <FadeUp>
            <ContactForm />
          </FadeUp>
        </Wrap>
      </main>
      <Footer />
    </>
  );
}
