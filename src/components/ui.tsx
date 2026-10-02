import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { asset, LOGO_READY, PHOTOS_READY } from "@/content/assets";
import photoMeta from "@/content/photo-meta.json";

const META = photoMeta as Record<string, { w: number; h: number }>;

const NAV = [
  { href: "/projects/", label: "Projects" },
  { href: "/studio/", label: "Studio" },
  { href: "/services/", label: "Services" },
  { href: "/contact/", label: "Contact" },
];

export function Wrap({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={`wrap ${className}`} style={style}>
      {children}
    </div>
  );
}

/* ---------- Logo (real files only — never set in type) ---------- */
export function Logo({ variant = "black", kind = "wordmark", className = "" }: { variant?: "black" | "white"; kind?: "wordmark" | "symbol"; className?: string }) {
  const src =
    kind === "symbol"
      ? `/images/logo/Symbol_${variant}.png`
      : variant === "white"
        ? "/images/logo/Logo_white.svg"
        : "/images/logo/Logo.svg";
  return (
    <Link href="/" aria-label="KARTÚ — home" className={`logo logo--${kind} ${className}`}>
      {LOGO_READY ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={asset(src)} alt="KARTÚ" />
      ) : (
        <span className={`logo__placeholder logo__placeholder--${variant}`} aria-hidden="true">
          {kind === "symbol" ? "K" : "logo svg"}
        </span>
      )}
    </Link>
  );
}

/* ---------- Photo: pre-optimised AVIF/WebP via <picture>, or a sized placeholder ---------- */
export function Photo({
  src,
  alt,
  ratio,
  priority = false,
  sizes = "100vw",
  className = "",
  position,
}: {
  src: string;
  alt: string;
  ratio?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  position?: string;
}) {
  const stemName = src.split("/").pop()!.replace(/\.\w+$/, "");
  const m = META[stemName];
  const natural = m ? `${m.w}/${m.h}` : undefined;
  const style: CSSProperties = ratio ? { aspectRatio: ratio } : natural && !className.includes("photo--fill") ? { aspectRatio: natural } : {};
  if (!PHOTOS_READY) {
    const name = src.split("/").pop()?.replace(/\.\w+$/, "");
    return (
      <div className={`photo photo--placeholder ${className}`} style={{ aspectRatio: ratio ?? "4/3" }} role="img" aria-label={alt}>
        <span className="photo__label">{name}</span>
      </div>
    );
  }
  const stem = asset(src.replace(/\.\w+$/, ""));
  const widths = [640, 1080, 1600, 2400];
  const set = (ext: string) => widths.map((w) => `${stem}-${w}.${ext} ${w}w`).join(", ");
  return (
    <picture className={`photo ${className}`} style={style}>
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${stem}-1600.webp`}
        alt={alt}
        width={m?.w}
        height={m?.h}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        style={position ? { objectPosition: position } : undefined}
      />
    </picture>
  );
}

/* ---------- Navigation ---------- */
export function Nav({ current, overlay = false }: { current?: string; overlay?: boolean }) {
  return (
    <header className={`nav ${overlay ? "nav--overlay" : ""}`}>
      <Logo variant={overlay ? "white" : "black"} />
      <nav className="nav__menu" aria-label="Main">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className="nav__link" aria-current={current === n.label.toLowerCase() ? "page" : undefined}>
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <Wrap>
        <div className="footer__top">
          <div className="footer__contact">
            <span>London, UK</span>
            <a href="mailto:hello@kartuinteriors.com">hello@kartuinteriors.com</a>
            {/* TODO: client to confirm the Instagram handle */}
            <span>Instagram</span>
          </div>
          <nav className="footer__nav" aria-label="Footer">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href}>
                {n.label}
              </Link>
            ))}
          </nav>
          <Logo kind="symbol" className="footer__symbol" />
        </div>
        <div className="footer__bottom">
          <span>© KARTÚ {new Date().getFullYear()}</span>
          <Link href="/privacy/">Privacy Policy</Link>
        </div>
      </Wrap>
    </footer>
  );
}

/* ---------- Small pieces ---------- */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="eyebrow">{children}</div>;
}

export function TextLink({ href, children, tone = "ink" }: { href: string; children: ReactNode; tone?: "ink" | "white" }) {
  return (
    <Link href={href} className={`text-link text-link--${tone}`}>
      {children}
    </Link>
  );
}

export function ServiceRow({ index, title, last }: { index: string; title: string; last?: boolean }) {
  return (
    <div className={`service-row ${last ? "service-row--last" : ""}`}>
      <span>{title}</span>
      <span className="service-row__index">{index}</span>
    </div>
  );
}

export function ContactBand({ title = "Start a conversation.", link = "Get in touch" }: { title?: string; link?: string }) {
  return (
    <section className="contact-band">
      <Wrap className="contact-band__inner">
        <h2 className="contact-band__title">{title}</h2>
        <TextLink href="/contact/">{link}</TextLink>
      </Wrap>
    </section>
  );
}

/* ---------- Grid + content blocks ---------- */
export function Grid12({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`grid12 ${className}`}>{children}</div>;
}

export function ColourBlock({ tone = "khaki", title, children, className = "" }: { tone?: "khaki" | "sky"; title?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`colour-block colour-block--${tone} ${className}`}>
      {title && <h3 className="colour-block__title">{title}</h3>}
      <div className="colour-block__body">{children}</div>
    </div>
  );
}

export function Stage({ index, title, children, className = "" }: { index: string; title: string; children: ReactNode; className?: string }) {
  return (
    <div className={`stage ${className}`}>
      <div className="stage__index">{index}</div>
      <div>
        <h3 className="stage__title">{title}</h3>
        <p className="stage__body">{children}</p>
      </div>
    </div>
  );
}

export function ProjectMeta({ items, className = "" }: { items: { label: string; value: string; wide?: boolean }[]; className?: string }) {
  return (
    <dl className={`project-meta ${className}`}>
      {items.map((it) => (
        <div key={it.label} className={it.wide ? "project-meta__item project-meta__item--wide" : "project-meta__item"}>
          <dt>{it.label}</dt>
          <dd>{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function NextProject({ slug, title, location }: { slug: string; title: string; location: string }) {
  return (
    <Link href={`/projects/${slug}/`} className="next-project">
      <Wrap>
        <div className="next-project__label">Next project</div>
        <h2 className="next-project__title">{title}</h2>
        <div className="next-project__location">{location}</div>
      </Wrap>
    </Link>
  );
}
