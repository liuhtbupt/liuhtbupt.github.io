"""Extract official abstracts from locally supplied PDFs and update publications.bib.

The source PDFs stay local. Intermediate plain text is written to tmp/pdfs/raw.
"""

from __future__ import annotations

import re
import shutil
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PDF_DIR = ROOT / "source-pdfs"
RAW_DIR = ROOT / "tmp" / "pdfs" / "raw"
BIB_PATH = ROOT / "content" / "publications.bib"


def clean_abstract(value: str) -> str:
    value = value.replace("\f", " ")
    value = value.translate(
        str.maketrans({"ﬁ": "fi", "ﬂ": "fl", "ﬀ": "ff", "ﬃ": "ffi", "ﬄ": "ffl"})
    )
    value = re.sub(r"(?<=[A-Za-z])-[ \t]*\r?\n[ \t]*(?=[a-z])", "", value)
    value = re.sub(r"[ \t]*\r?\n[ \t]*", " ", value)
    value = re.sub(r"\s+", " ", value).strip()
    return value


def extract_abstract(text: str, key: str) -> str:
    # This Chinese journal's raw text stream places the English label after
    # the English abstract. Anchor its bilingual English block explicitly.
    if key == "yang2026dualidentifier":
        start = text.index("With the development of intelligent manufacturing")
        end = text.index("AGV; Sybil attack;", start)
        abstract = clean_abstract(text[start:end])
        if 250 <= len(abstract) <= 5000:
            return abstract
        raise ValueError(f"Unexpected abstract length: {len(abstract)}")

    starts = [
        re.compile(r"(?im)^[ \t]*\[Abstract\][ \t]*"),
        re.compile(r"(?im)^[ \t]*Abstract[ \t]*[—:][ \t]*"),
        re.compile(r"(?im)^[ \t]*ABSTRACT[ \t]*$")
    ]
    matches = [match for pattern in starts if (match := pattern.search(text))]
    if not matches:
        raise ValueError("English abstract marker not found")
    start = min(matches, key=lambda match: match.start())
    tail = text[start.end():]
    end = re.search(
        r"(?im)^[ \t]*(?:Received\b|Index[ \t]+Terms|Key[ \t]+words|Keywords|\[Keywords\]|I\.[ \t]*INTRODUCTION|Introduction)[ \t]*[—:]?",
        tail,
    )
    if not end:
        raise ValueError("Abstract end marker not found")
    abstract = clean_abstract(tail[:end.start()])
    if not 250 <= len(abstract) <= 5000:
        raise ValueError(f"Unexpected abstract length: {len(abstract)}")
    return abstract


def extract_all() -> dict[str, str]:
    pdftotext = shutil.which("pdftotext.exe") or shutil.which("pdftotext")
    if not pdftotext:
        raise RuntimeError("pdftotext was not found")
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    abstracts: dict[str, str] = {}
    for pdf_path in sorted(PDF_DIR.glob("*.pdf")):
        raw_path = RAW_DIR / f"{pdf_path.stem}.txt"
        subprocess.run(
            [pdftotext, "-f", "1", "-l", "3", "-enc", "UTF-8", "-raw", str(pdf_path), str(raw_path)],
            check=True,
        )
        abstracts[pdf_path.stem] = extract_abstract(raw_path.read_text(encoding="utf-8"), pdf_path.stem)
    return abstracts


def update_bib(abstracts: dict[str, str]) -> None:
    bib = BIB_PATH.read_text(encoding="utf-8")
    for key, abstract in abstracts.items():
        pattern = re.compile(rf"(@\w+\{{{re.escape(key)},\s*.*?)(\n\}})", re.DOTALL)
        match = pattern.search(bib)
        if not match:
            raise ValueError(f"BibTeX entry not found: {key}")
        entry = match.group(1)
        if re.search(r"(?m)^\s*abstract\s*=", entry):
            entry = re.sub(r"(?m)^\s*abstract\s*=\s*\{.*?\},?\s*$", f"  abstract = {{{abstract}}},", entry)
        else:
            if not entry.rstrip().endswith(","):
                entry = entry.rstrip() + ","
            entry += f"\n  abstract = {{{abstract}}}"
        bib = bib[:match.start()] + entry + match.group(2) + bib[match.end():]
    BIB_PATH.write_text(bib, encoding="utf-8", newline="\n")


def main() -> None:
    abstracts = extract_all()
    update_bib(abstracts)
    for key, abstract in abstracts.items():
        print(f"{key}: {len(abstract)} chars — {abstract[:90]}…")
    print(f"Updated {len(abstracts)} abstracts in {BIB_PATH}")


if __name__ == "__main__":
    main()
