#!/usr/bin/env python3
"""Extract Conners norm tables from PDFs into api/src/lib/connersNorms.json."""
from __future__ import annotations

import json
import re
from collections import defaultdict
from pathlib import Path

try:
    import fitz
except ImportError:
    raise SystemExit("pip install pymupdf")

ROOT = Path(__file__).resolve().parents[1]
OUT_API = ROOT / "api/src/lib/connersNorms.json"
OUT_SRC = ROOT / "src/lib/connersNorms.json"
PDF_DIR = Path("/Users/danielferreira/Downloads/cotaodaprovadeconners")

PAIS_COLUMNS = [
    ("t", 79),
    ("b_raw", 140),
    ("b_pt", 205),
    ("c_raw", 279),
    ("c_pt", 345),
    ("d_raw", 418),
    ("d_pt", 484),
]

PROF_COLUMNS = [
    ("t", 68),
    ("a_raw", 129),
    ("a_pt", 180),
    ("b_raw", 239),
    ("b_pt", 290),
    ("c_raw", 351),
    ("c_pt", 405),
    ("d_raw", 463),
    ("d_pt", 515),
]

FILES = [
    ("pais_masculino", "1698274373_Tabelas_Conners_Pais__sexo_masculino_.pdf", PAIS_COLUMNS),
    ("pais_feminino", "1698274373_Tabelas_Conners_Pais__sexo_feminino_.pdf", PAIS_COLUMNS),
    ("professores_masculino", "1698274372_Tabelas_Conners_Professores__sexo_masculino_.pdf", PROF_COLUMNS),
    ("professores_feminino", "1698274372_Tabelas_Conners_Professores__sexo_feminino_.pdf", PROF_COLUMNS),
]


def nearest_column(x: float, columns: list[tuple[str, float]]) -> str | None:
    best_name: str | None = None
    best_dist = float("inf")
    for name, center in columns:
        dist = abs(x - center)
        if dist < best_dist:
            best_dist = dist
            best_name = name
    # Reject words too far from any column header (stray labels)
    if best_dist > 45:
        return None
    return best_name


def parse_columns(pdf_path: Path, columns: list[tuple[str, float]]) -> list[dict]:
    doc = fitz.open(pdf_path)
    words = doc[0].get_text("words")
    rows: dict[float, dict[str, str]] = defaultdict(dict)
    for w in words:
        x0, y0, _, _, t = w[0], w[1], w[2], w[3], w[4]
        if not t.strip() or t == ".":
            continue
        col = nearest_column(x0, columns)
        if not col:
            continue
        ykey = round(y0, 0)
        prev = rows[ykey].get(col, "")
        rows[ykey][col] = (prev + " " + t).strip() if prev else t

    entries: list[dict] = []
    for y in sorted(rows.keys()):
        row = rows[y]
        if "t" not in row:
            continue
        t_text = row["t"].strip()
        if not re.match(r"^\d+$", t_text):
            continue
        tscore = int(t_text)
        if tscore < 38 or tscore > 90:
            continue
        entry: dict = {"t": tscore}
        for k, v in row.items():
            if k != "t":
                entry[k] = v.strip()
        entries.append(entry)
    return entries


def main() -> None:
    tables: dict[str, list[dict]] = {}
    for key, filename, columns in FILES:
        pdf = PDF_DIR / filename
        if not pdf.exists():
            raise FileNotFoundError(pdf)
        tables[key] = parse_columns(pdf, columns)
        print(f"{key}: {len(tables[key])} rows")
        for prefix in ["a", "b", "c", "d"]:
            raw_n = sum(1 for r in tables[key] if f"{prefix}_raw" in r)
            pt_n = sum(1 for r in tables[key] if f"{prefix}_pt" in r)
            if raw_n or pt_n:
                print(f"  {prefix}: raw={raw_n} pt={pt_n}")

    payload = {"ageBand": "6-10", "tables": tables}
    text = json.dumps(payload, indent=2, ensure_ascii=False)
    OUT_API.write_text(text, encoding="utf-8")
    OUT_SRC.write_text(text, encoding="utf-8")
    print(f"Wrote {OUT_API} and {OUT_SRC}")


if __name__ == "__main__":
    main()
