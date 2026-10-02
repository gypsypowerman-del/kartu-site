"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";

/** Short enquiry form. Until the serverless endpoint is connected (open item),
 *  a successful submit shows the confirmation state, as in the approved prototype. */
export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const doneRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (sent) doneRef.current?.focus();
  }, [sent]);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) return;
    setSent(true);
  }

  if (sent) {
    return (
      <div className="contact-form__done" role="status">
        <h2 className="contact-form__done-title" tabIndex={-1} ref={doneRef}>Thank you for getting in touch.</h2>
        <p>We’ll come back to you shortly.</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate={false}>
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
      <button type="submit" className="button">
        Send enquiry
      </button>
      <p className="contact-form__legal">
        By submitting, you agree to our <Link href="/privacy/">Privacy Policy</Link>.
      </p>
    </form>
  );
}
