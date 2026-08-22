"""Create publication preview images from the first numbered figure in each PDF.

If a usable Figure 1 caption cannot be located, the first page is used as a
paper-specific fallback. Generated website assets go to public/papers and
inspection artifacts go to tmp/pdfs.
"""

from __future__ import annotations

import re
import shutil
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
PDF_DIR = ROOT / "source-pdfs"
TMP_DIR = ROOT / "tmp" / "pdfs"
BBOX_DIR = TMP_DIR / "bbox"
RENDER_DIR = TMP_DIR / "rendered"
PREVIEW_DIR = ROOT / "public" / "papers"
BIB_PATH = ROOT / "content" / "publications.bib"
PAGE_LIMIT = 6
OUTPUT_SIZE = (1000, 563)


def locate_first_figure(xml_path: Path) -> tuple[int, float, float, float, float, float, float, str] | None:
    # Poppler's bbox output can contain publisher-supplied control characters
    # that strict XML parsers reject, so parse its simple page/block structure
    # defensively as text.
    source = xml_path.read_text(encoding="utf-8", errors="replace")
    pages = re.findall(r'<page\s+width="([0-9.]+)"\s+height="([0-9.]+)">(.*?)</page>', source, re.S)
    caption_pattern = re.compile(r"^(?:fig(?:ure)?\.?\s*1(?:\.|:)?|图\s*1)", re.I)
    for page_number, (width, height, page_source) in enumerate(pages, start=1):
        page_width = float(width)
        page_height = float(height)
        blocks = re.findall(
            r'<block\s+xMin="([0-9.]+)"\s+yMin="([0-9.]+)"\s+xMax="([0-9.]+)"\s+yMax="([0-9.]+)">(.*?)</block>',
            page_source,
            re.S,
        )
        for x_min, y_min, x_max, y_max, block_source in blocks:
            words = re.findall(r"<word\s+[^>]*>(.*?)</word>", block_source, re.S)
            caption = " ".join(re.sub(r"<[^>]+>", "", word) for word in words).strip()
            if caption_pattern.match(caption):
                return (
                    page_number,
                    page_width,
                    page_height,
                    float(x_min),
                    float(x_max),
                    float(y_min),
                    float(y_max),
                    caption,
                )
    return None


def render_page(pdf_path: Path, page_number: int, output_prefix: Path) -> Path:
    pdftoppm = shutil.which("pdftoppm.exe") or shutil.which("pdftoppm")
    if not pdftoppm:
        raise RuntimeError("pdftoppm was not found")
    subprocess.run(
        [
            pdftoppm,
            "-f",
            str(page_number),
            "-l",
            str(page_number),
            "-singlefile",
            "-r",
            "180",
            "-png",
            str(pdf_path),
            str(output_prefix),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
    )
    return output_prefix.with_suffix(".png")


def figure_crop(image: Image.Image, info: tuple[int, float, float, float, float, float, float, str]) -> Image.Image:
    _, page_width, page_height, x_min, x_max, y_min, _, _ = info
    center = (x_min + x_max) / 2
    block_width = x_max - x_min
    margin = page_width * 0.055

    if block_width > page_width * 0.54 or (abs(center - page_width / 2) < page_width * 0.10 and x_min > page_width * 0.18):
        left, right = margin, page_width - margin
    elif center < page_width / 2:
        left, right = margin, page_width / 2 - page_width * 0.012
    else:
        left, right = page_width / 2 + page_width * 0.012, page_width - margin

    bottom = max(page_height * 0.14, y_min - 3)
    top = max(page_height * 0.055, bottom - page_height * 0.34)
    scale_x = image.width / page_width
    scale_y = image.height / page_height
    box = (
        round(left * scale_x),
        round(top * scale_y),
        round(right * scale_x),
        round(bottom * scale_y),
    )
    return image.crop(box)


def first_page_fallback(image: Image.Image) -> Image.Image:
    # Keep the title, author line, and abstract so the fallback still uniquely
    # identifies the paper instead of showing a generic illustration.
    return image.crop((round(image.width * 0.04), round(image.height * 0.06), round(image.width * 0.96), round(image.height * 0.62)))


def place_on_canvas(source: Image.Image) -> Image.Image:
    canvas = Image.new("RGB", OUTPUT_SIZE, "white")
    source = source.convert("RGB")
    source.thumbnail((OUTPUT_SIZE[0] - 40, OUTPUT_SIZE[1] - 36), Image.Resampling.LANCZOS)
    x = (OUTPUT_SIZE[0] - source.width) // 2
    y = (OUTPUT_SIZE[1] - source.height) // 2
    canvas.paste(source, (x, y))
    return canvas


def update_bib(keys: list[str]) -> None:
    bib = BIB_PATH.read_text(encoding="utf-8")
    for key in keys:
        pattern = re.compile(rf"(@\w+\{{{re.escape(key)},\s*.*?)(\n\}})", re.DOTALL)
        match = pattern.search(bib)
        if not match:
            raise ValueError(f"BibTeX entry not found: {key}")
        entry = match.group(1)
        field = f"  preview = {{{key}.jpg}}"
        if re.search(r"(?m)^\s*preview\s*=", entry):
            entry = re.sub(r"(?m)^\s*preview\s*=.*$", field, entry)
        else:
            if not entry.rstrip().endswith(","):
                entry = entry.rstrip() + ","
            entry += "\n" + field
        bib = bib[:match.start()] + entry + match.group(2) + bib[match.end():]
    BIB_PATH.write_text(bib, encoding="utf-8", newline="\n")


def make_contact_sheet(rows: list[tuple[str, Path, str]]) -> Path:
    thumb_size = (320, 180)
    label_height = 44
    columns = 3
    sheet_rows = (len(rows) + columns - 1) // columns
    sheet = Image.new("RGB", (columns * thumb_size[0], sheet_rows * (thumb_size[1] + label_height)), "#e5e7eb")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()
    for index, (key, image_path, method) in enumerate(rows):
        image = Image.open(image_path).convert("RGB")
        image.thumbnail(thumb_size, Image.Resampling.LANCZOS)
        column = index % columns
        row = index // columns
        x = column * thumb_size[0] + (thumb_size[0] - image.width) // 2
        y = row * (thumb_size[1] + label_height) + (thumb_size[1] - image.height) // 2
        sheet.paste(image, (x, y))
        draw.text((column * thumb_size[0] + 8, row * (thumb_size[1] + label_height) + thumb_size[1] + 5), key, fill="black", font=font)
        draw.text((column * thumb_size[0] + 8, row * (thumb_size[1] + label_height) + thumb_size[1] + 21), method, fill="#374151", font=font)
    output = TMP_DIR / "preview-contact-sheet.jpg"
    sheet.save(output, quality=90)
    return output


def main() -> None:
    pdftotext = shutil.which("pdftotext.exe") or shutil.which("pdftotext")
    if not pdftotext:
        raise RuntimeError("pdftotext was not found")
    BBOX_DIR.mkdir(parents=True, exist_ok=True)
    RENDER_DIR.mkdir(parents=True, exist_ok=True)
    PREVIEW_DIR.mkdir(parents=True, exist_ok=True)

    results: list[tuple[str, Path, str]] = []
    for pdf_path in sorted(PDF_DIR.glob("*.pdf")):
        key = pdf_path.stem
        bbox_path = BBOX_DIR / f"{key}.html"
        subprocess.run(
            [pdftotext, "-f", "1", "-l", str(PAGE_LIMIT), "-bbox-layout", str(pdf_path), str(bbox_path)],
            check=True,
        )
        info = locate_first_figure(bbox_path)
        page_number = info[0] if info else 1
        rendered = render_page(pdf_path, page_number, RENDER_DIR / f"{key}-p{page_number}")
        page_image = Image.open(rendered)
        if info:
            cropped = figure_crop(page_image, info)
            method = f"Figure 1, page {page_number}"
        else:
            cropped = first_page_fallback(page_image)
            method = "first-page fallback"
        preview = place_on_canvas(cropped)
        output = PREVIEW_DIR / f"{key}.jpg"
        preview.save(output, quality=88, optimize=True, progressive=True)
        results.append((key, output, method))
        print(f"{key}: {method}")

    update_bib([key for key, _, _ in results])
    sheet = make_contact_sheet(results)
    print(f"Updated {len(results)} previews in {BIB_PATH}")
    print(f"Contact sheet: {sheet}")


if __name__ == "__main__":
    main()
