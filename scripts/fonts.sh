#!/usr/bin/env sh
# Subset the licensed brand fonts (fonts-src/) to Latin for the web → public/fonts/.
# Futura PT drops from ~38 KB to ~16 KB per weight. Needs: pip install fonttools brotli
set -e
RANGE="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2190-2193,U+2212,U+2215,U+2248,U+FEFF,U+FFFD"
mkdir -p public/fonts
for f in fonts-src/*.woff2; do
  python3 -m fontTools.subset "$f" --unicodes="$RANGE" --layout-features='*' --flavor=woff2 --output-file="public/fonts/$(basename "$f")"
done
