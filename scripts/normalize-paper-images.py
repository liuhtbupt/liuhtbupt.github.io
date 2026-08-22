"""Normalize publication previews without cropping their scientific content.

Each source image is fitted proportionally inside a 1200 x 900 frame. A soft,
full-bleed version of the same image fills the remaining area, so every label,
legend and subfigure stays visible without white letterboxing or distortion.
Images already at that size are skipped, making the script safe to run after
adding new screenshots.
"""

from __future__ import annotations

import argparse
import re
import shutil
from datetime import datetime
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter, ImageOps


OUTPUT_SIZE = (1200, 900)

def referenced_previews(bib_path: Path) -> list[str]:
    text = bib_path.read_text(encoding="utf-8")
    return re.findall(r"^\s*preview\s*=\s*\{([^}]+)\}", text, re.MULTILINE)


def normalize(source: Path, backup_dir: Path, force: bool) -> bool:
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original).convert("RGB")
        if image.size == OUTPUT_SIZE and not force:
            return False

        backup_dir.mkdir(parents=True, exist_ok=True)
        backup = backup_dir / source.name
        if not backup.exists():
            shutil.copy2(source, backup)

        # The background may be cropped because it is decorative only. The
        # sharp foreground below always contains the complete source image.
        background = ImageOps.fit(image, OUTPUT_SIZE, method=Image.Resampling.LANCZOS)
        background = background.filter(ImageFilter.GaussianBlur(radius=34))
        background = ImageEnhance.Color(background).enhance(0.72)
        background = ImageEnhance.Brightness(background).enhance(0.78).convert("RGBA")

        foreground = ImageOps.contain(image, (1160, 860), method=Image.Resampling.LANCZOS)
        foreground = foreground.convert("RGBA")
        x = (OUTPUT_SIZE[0] - foreground.width) // 2
        y = (OUTPUT_SIZE[1] - foreground.height) // 2

        # A restrained shadow separates white paper figures from their
        # adaptive background without creating an empty border.
        shadow_mask = Image.new("L", OUTPUT_SIZE, 0)
        shadow_block = Image.new("L", foreground.size, 185)
        shadow_mask.paste(shadow_block, (x, y + 8))
        shadow_mask = shadow_mask.filter(ImageFilter.GaussianBlur(radius=14))
        shadow = Image.new("RGBA", OUTPUT_SIZE, (15, 23, 42, 0))
        shadow.putalpha(shadow_mask)
        background.alpha_composite(shadow)
        background.alpha_composite(foreground, (x, y))

        background.convert("RGB").save(
            source, format="JPEG", quality=90, optimize=True, progressive=True
        )
        return True


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--force", action="store_true", help="reprocess 1200x900 images")
    args = parser.parse_args()

    project = Path(__file__).resolve().parents[1]
    paper_dir = project / "public" / "papers"
    run_id = datetime.now().strftime("%Y%m%d-%H%M%S")
    backup_dir = project.parent / "tmp" / f"paper-images-original-{run_id}"
    names = referenced_previews(project / "content" / "publications.bib")

    changed = 0
    for name in names:
        source = paper_dir / name
        if not source.exists():
            raise FileNotFoundError(f"Missing preview image: {source}")
        if normalize(source, backup_dir, args.force):
            changed += 1
            print(f"normalized: {name}")
        else:
            print(f"skipped:    {name}")

    print(f"Done: {changed} of {len(names)} images normalized to 1200x900.")
    print(f"Originals: {backup_dir}")


if __name__ == "__main__":
    main()
