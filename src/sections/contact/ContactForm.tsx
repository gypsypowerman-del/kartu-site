"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";

const EMAIL = "hello@kartuinteriors.com";
/** Form service URL (e.g. Formspree/Basin), set at build time. Until it is set,
 *  the form hands the message to the visitor's email app — it never fakes a "sent". */
const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT || "";

type State = "idle" | "sending" | "sent" | "mailto" | "error";

export default function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const doneRef = useRef<HTMLHeadingElement>(null);
  const [mailHref, setMailHref] = useState(`mailto:${EMAIL}`);

  useEffect(() => {
    if (state === "sent" || state === "mailto") doneRef.current?.focus();
  }, [state]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const data = new FormData(form);
    if (data.get("company_website")) return; // honeypot: bots fill hidden fields
    const name = String(data.get("name") || "");
    const email = String(data.get("email") || "");
    const message = String(data.get("message") || "");
    const href = `mailto:${EMAIL}?subject=${encodeURIComponent(`Project enquiry — ${name}`)}&body=${encodeURIComponent(`${message}\n\n${name}\n${email}`)}`;
    setMailHref(href);

    if (!ENDPOINT) {
      window.location.href = href;
      setState("mailto");
      return;
    }

    setState("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, _subject: `Project enquiry — ${name}` }),
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="contact-form__done" role="status">
        <h2 className="contact-form__done-title" tabIndex={-1} ref={doneRef}>
          Thank you for getting in touch.
        </h2>
        <p>We’ll come back to you shortly.</p>
      </div>
    );
  }

  if (state === "mailto") {
    return (
      <div className="contact-form__done" role="status">
        <h2 className="contact-form__done-title" tabIndex={-1} ref={doneRef}>
          Your message is ready to send.
        </h2>
        <p>
          It should have opened in your email app — press send there. If nothing opened, <a href={mailHref}>try again</a> or write to us at{" "}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
        </p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="contact-name">Name</label>
        <input id="contact-name" name="name" type="text" autoComplete="name" required />
      </div>
      <div className="field">
        <label htmlFor="contact-email">Email</label>
        <input id="contact-email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="field">
        <label htmlFor="contact-message">Tell us a little about your project</label>
        <textarea id="contact-message" name="message" rows={4} required />
      </div>
      <div className="field field--trap" aria-hidden="true">
        <label htmlFor="contact-company-website">Leave this empty</label>
        <input id="contact-company-website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <button type="submit" className="button" disabled={state === "sending"} aria-busy={state === "sending"}>
        {state === "sending" ? "Sending…" : "Send enquiry"}
      </button>
      {state === "error" && (
        <p className="contact-form__error" role="alert">
          Sorry — your message didn’t go through. Please <a href={mailHref}>send it by email</a> instead.
        </p>
      )}
      <p className="contact-form__legal">
        By submitting, you agree to our <Link href="/privacy/">Privacy Policy</Link>.
      </p>
    </form>
  );
}
