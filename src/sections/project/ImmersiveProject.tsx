import { Photo, photoRatio } from "@/components/ui";
import { FadeUp, RevealImage, RevealLines } from "@/motion/reveal";
import type { ImmersiveRow, PanelKind, PanelTone } from "@/content/immersive";
import type { Project } from "@/content/types";

// A text panel takes the space of a square image, so a portrait + panel row
// lands at roughly one screen high on desktop.
const PANEL_RATIO = 1;

function Panel({ p, kind, tone, h1 }: { p: Project; kind: PanelKind; tone: PanelTone; h1?: boolean }) {
  return (
    <div className={`imm-panel imm-panel--${tone} imm-panel--${kind}`} style={{ flex: `${PANEL_RATIO} 1 0` }}>
      {kind === "intro" && (
        <>
          <div className="imm-panel__top">
            <div className="imm-panel__label">Project</div>
            <RevealLines as={h1 ? "h1" : "h2"} lines={[p.title]} className="imm-panel__title" immediate />
            <FadeUp>
              <p className="imm-panel__lead">{p.concept}</p>
            </FadeUp>
          </div>
          <FadeUp>
            <dl className="imm-facts">
              <div>
                <dt>Year</dt>
                <dd>{p.year}</dd>
              </div>
              <div>
                <dt>Size</dt>
                <dd>{p.size}</dd>
              </div>
              <div className="imm-facts__wide">
                <dt>Scope</dt>
                <dd>{p.scope}</dd>
              </div>
            </dl>
          </FadeUp>
        </>
      )}
      {kind === "concept" && (
        <FadeUp className="imm-panel__text">
          <div className="imm-panel__label">Concept — {p.conceptName}</div>
          <p className="imm-panel__body">{p.conceptText}</p>
        </FadeUp>
      )}
      {kind === "story" && (
        <FadeUp className="imm-panel__text">
          <div className="imm-panel__label">Project Story</div>
          <p className="imm-panel__body">{p.story}</p>
        </FadeUp>
      )}
    </div>
  );
}

function Img({ src, alt, share, priority }: { src: string; alt: string; share: number; priority?: boolean }) {
  return (
    <figure className="imm-figure" style={{ flex: `${photoRatio(src)} 1 0` }}>
      <RevealImage>
        <Photo src={src} alt={alt} priority={priority} sizes={`(min-width: 761px) ${Math.max(25, Math.round(share * 100))}vw, 100vw`} />
      </RevealImage>
    </figure>
  );
}

export default function ImmersiveProject({ p, rows }: { p: Project; rows: ImmersiveRow[] }) {
  let n = 0;
  const alt = () => `${p.title} — view ${++n}`;
  return (
    <div className="imm">
      {rows.map((row, k) => {
        if (row.kind === "full") {
          return (
            <div key={k} className="imm-row imm-row--full">
              <Img src={row.image} alt={alt()} share={1} />
            </div>
          );
        }
        if (row.kind === "banner") {
          // the client's crop of the hero (same band as the classic template)
          return (
            <div key={k} className="imm-row imm-row--banner project-hero">
              <Photo src={row.image} alt={alt()} priority sizes="100vw" position={row.position} />
            </div>
          );
        }
        if (row.kind === "row") {
          const sum = row.images.reduce((a, s) => a + photoRatio(s), 0);
          return (
            <div key={k} className={`imm-row imm-row--${row.images.length}`}>
              {row.images.map((s) => (
                <Img key={s} src={s} alt={alt()} share={photoRatio(s) / sum} />
              ))}
            </div>
          );
        }
        const share = photoRatio(row.image) / (photoRatio(row.image) + PANEL_RATIO);
        const image = <Img src={row.image} alt={alt()} share={share} priority={row.kind === "intro"} />;
        const panel =
          row.kind === "intro" ? <Panel p={p} kind="intro" tone="khaki" h1 /> : <Panel p={p} kind={row.panel} tone={row.tone} />;
        const textFirst = row.kind === "text" && row.side === "left";
        return (
          <div key={k} className={`imm-row imm-row--text ${textFirst ? "imm-row--text-first" : ""}`}>
            {textFirst ? panel : image}
            {textFirst ? image : panel}
          </div>
        );
      })}
    </div>
  );
}
