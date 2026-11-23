#!/usr/bin/env python3
"""One-off loss-controlled WebP migration for four oversized published images."""
from __future__ import annotations

import io
import subprocess
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
LIMIT_BYTES = 500_000
ASSETS = (
    ("public/assets/destinations/yunnan/shaxi/AEA90834-C386-4023-84A9-B7E29C6569E7.png",
     "public/assets/destinations/yunnan/shaxi/AEA90834-C386-4023-84A9-B7E29C6569E7.webp"),
    ("public/assets/destinations/yunnan/shaxi/38F5AAF2-AD1C-4D3D-B035-5B9109C589D9.png",
     "public/assets/destinations/yunnan/shaxi/38F5AAF2-AD1C-4D3D-B035-5B9109C589D9.webp"),
    ("public/assets/blog/china-visa-free-countries-2026/passport-with-entry-stamps-from-multiple-countries-scaled.webp",
     "public/assets/blog/china-visa-free-countries-2026/passport-with-entry-stamps-from-multiple-countries-scaled.webp"),
    ("public/assets/destinations/yunnan/lijiang-shangri-la/lijiang-railway-station-entrance.webp",
     "public/assets/destinations/yunnan/lijiang-shangri-la/lijiang-railway-station-entrance.webp"),
)
TEXT_EXTENSIONS = {".md", ".mdx", ".tsx", ".ts", ".js", ".mjs", ".css", ".json", ".yaml", ".yml", ".html"}


def optimize_image(source: Path, destination: Path) -> None:
    if not source.exists():
        if destination.is_file() and destination.stat().st_size <= LIMIT_BYTES:
            print(f"Already converted: {destination.relative_to(ROOT)}")
            return
        raise FileNotFoundError(f"Original image missing: {source}")

    original_bytes = source.stat().st_size
    if source == destination and original_bytes <= LIMIT_BYTES:
        print(f"Already compressed: {source.relative_to(ROOT)}")
        return

    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original).convert("RGB")
        original_dimensions = image.size
        if max(image.size) > 2200:
            image.thumbnail((2200, 2200), Image.Resampling.LANCZOS)

        quality = 84
        while True:
            output = io.BytesIO()
            image.save(output, format="WEBP", quality=quality, method=6)
            if output.tell() <= LIMIT_BYTES:
                break
            if quality > 72:
                quality -= 4
            else:
                image.thumbnail((round(image.width * .92), round(image.height * .92)), Image.Resampling.LANCZOS)
                quality = 80
                if min(image.size) < 500:
                    raise ValueError(f"Cannot compress without sacrificing legibility: {source}")

    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes(output.getvalue())
    with Image.open(destination) as verify:
        if verify.format != "WEBP" or verify.size != image.size:
            raise ValueError(f"Invalid optimized WebP: {destination}")
    if source != destination:
        source.unlink()
    print(f"{source.relative_to(ROOT)}: {original_bytes:,} bytes {original_dimensions} -> "
          f"{destination.stat().st_size:,} bytes {image.size} (WebP quality {quality})")


def replace_legacy_references() -> None:
    replacements = {
        Path(old).name: Path(new).name
        for old, new in ASSETS
        if old != new
    }
    tracked = subprocess.check_output(["git", "ls-files", "-z"], cwd=ROOT).decode().split("\0")
    edits = 0
    for filename in tracked:
        if not filename or filename == "scripts/optimize-site-images.py":
            continue
        path = ROOT / filename
        if path.suffix.lower() not in TEXT_EXTENSIONS or not path.is_file():
            continue
        try:
            old_text = path.read_text(encoding="utf-8")
        except UnicodeError:
            continue
        new_text = old_text
        for old_basename, new_basename in replacements.items():
            new_text = new_text.replace(old_basename, new_basename)
        if new_text != old_text:
            path.write_text(new_text, encoding="utf-8")
            edits += 1
            print(f"Updated image references: {filename}")
    print(f"Updated {edits} text files; old PNG asset paths are no longer used in tracked content.")


if __name__ == "__main__":
    for before, after in ASSETS:
        optimize_image(ROOT / before, ROOT / after)
    replace_legacy_references()
