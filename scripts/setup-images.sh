#!/usr/bin/env bash
# Copies the product images downloaded earlier (~/Downloads/voltedge-*.webp)
# into public/images. Some downloads were left with temporary hidden names by
# the browser, so those are matched by their exact file size instead.
set -euo pipefail

cd "$(dirname "$0")/.."
SRC="${1:-$HOME/Downloads}"
DEST="public/images"
mkdir -p "$DEST/hero" "$DEST/products"

# target | downloaded file name | size in bytes (fallback match)
MAP=(
  "hero/iphone-17-pro-deep-blue.webp|voltedge-hero-blue.webp|12414"
  "hero/iphone-17-pro-silver.webp|voltedge-hero-silver.webp|11992"
  "hero/iphone-17-pro-cosmic-orange.webp|voltedge-hero-orange.webp|15522"
  "products/galaxy-s25-ultra.webp|voltedge-p-s25ultra.webp|7048"
  "products/galaxy-s25.webp|voltedge-p-s25.webp|5754"
  "products/galaxy-a36.webp|voltedge-p-a36.webp|5294"
  "products/airpods-pro-3.webp|voltedge-p-airpods.webp|5098"
  "products/macbook-air.webp|voltedge-p-mba.webp|16762"
)

file_size() { stat -f%z "$1" 2>/dev/null || stat -c%s "$1"; }

missing=0
for entry in "${MAP[@]}"; do
  IFS="|" read -r target name size <<<"$entry"
  if [[ -f "$SRC/$name" ]]; then
    cp "$SRC/$name" "$DEST/$target"
    echo "✓ $target"
    continue
  fi
  found=""
  for f in "$SRC"/.*claudefordesktop*; do
    [[ -f "$f" ]] || continue
    if [[ "$(file_size "$f")" == "$size" ]]; then found="$f"; break; fi
  done
  if [[ -n "$found" ]]; then
    cp "$found" "$DEST/$target"
    echo "✓ $target (recovered from temporary download)"
  else
    echo "✗ $target not found — add it manually"
    missing=$((missing + 1))
  fi
done

echo
if [[ $missing -eq 0 ]]; then echo "All images are in place."; else echo "$missing image(s) missing."; fi
