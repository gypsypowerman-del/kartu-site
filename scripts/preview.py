"""Build a single-file preview of the static export for sharing as a claude.ai artifact.

- Inlines the compiled CSS and the brand fonts (as data URIs).
- Drops Next.js runtime scripts; motion is re-run by a small vanilla script that mirrors
  src/motion/* and src/sections/home/* using GSAP + Lenis from cdnjs/jsdelivr.
- Internal links are disabled (other pages aren't built yet).

Usage: python3 scripts/preview.py out/index.html preview/kartu-home.html
"""
import base64, pathlib, re, sys

src, dst = map(pathlib.Path, sys.argv[1:3])
root = src.parent
html = src.read_text()

css = "".join((root / m.lstrip("/")).read_text() for m in re.findall(r'href="(/_next/static/css/[^"]+\.css)"', html))

def font_uri(m):
    p = root / m.group(1).lstrip("/")
    return 'url("data:font/woff2;base64,' + base64.b64encode(p.read_bytes()).decode() + '")'
css = re.sub(r'url\("?(/fonts/[^")]+\.woff2)"?\)', font_uri, css)

body = html[html.index("<body>") + 6 : html.index("</body>")]
body = re.sub(r"<script\b[^>]*>.*?</script>", "", body, flags=re.S)
body = re.sub(r'<div hidden="">.*?</div>', "", body, count=1, flags=re.S)
body = re.sub(r'href="/(?!/)[^"]*"', 'href="#" data-soon=""', body)

# Images: make paths relative and list them so they can be published alongside the page
body = body.replace('"/images/', '"images/').replace(', /images/', ', images/')
used = sorted(set(re.findall(r'(images/[^\s",]+\.(?:webp|avif|svg|png|jpg))', body)))
(dst.parent / "preview-files.txt").write_text("\n".join(used))

motion = (root.parent / "scripts" / "preview-motion.js").read_text()

page = f"""<title>KARTÚ Home Preview</title>
<style>{css}
:root{{color-scheme:light}}
html,body{{background:var(--surface-page);color:var(--text-heading)}}
a[data-soon]{{cursor:default}}
</style>
{body}
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.3.26/dist/lenis.min.js"></script>
<script>{motion}</script>
"""
dst.parent.mkdir(parents=True, exist_ok=True)
dst.write_text(page)
print(dst, f"{len(page)//1024} KB")
