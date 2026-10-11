"use client";

import { useEffect, useState } from "react";

/** Booking calendar (Cal.com / Calendly).
 *  The provider's iframe is only inserted after the visitor asks for it — by following
 *  the "Choose a time" link (hash #book) or pressing the button. Scrolling past the
 *  section loads nothing, so no third-party request or cookie is made on an ordinary
 *  visit. That is what keeps the launch decision "no cookie banner" honest.
 */
export default function BookingEmbed({ src, title }: { src: string; title: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const check = () => {
      if (window.location.hash === "#book") setOpen(true);
    };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, []);

  if (!open) {
    return (
      <div className="conv-book__placeholder">
        <p className="conv-book__consent">
          The calendar is provided by our booking service. Opening it loads their page inside ours.
        </p>
        <button type="button" className="text-link" onClick={() => setOpen(true)}>
          Choose a time
        </button>
      </div>
    );
  }

  return <iframe className="conv-book__embed" src={src} title={title} />;
}
