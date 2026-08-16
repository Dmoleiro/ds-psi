#!/usr/bin/env python3
"""Extract PICCA Volume VII DC:0-5 checklist modules from docx sources."""

from __future__ import annotations

import json
import re
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "scripts" / "vol7_extract.json"

FILES = [
    (
        "cap1",
        Path(
            "/Users/danielferreira/Downloads/PICCA – Manual de Checklists Clínicas DC-0–5 - Capítulo 1 – Perturbações do Neurodesenvolvimento.docx"
        ),
    ),
    (
        "cap2",
        Path("/Users/danielferreira/Downloads/PICCA – Capítulo 2 – Perturbações de Ansiedade.docx"),
    ),
    (
        "cap3",
        Path(
            "/Users/danielferreira/Downloads/PICCA – Capítulo 3 – Perturbações do Sono, Alimentação e Choro.docx"
        ),
    ),
    (
        "cap4",
        Path("/Users/danielferreira/Downloads/PICCA – Capítulo 4 – Perturbações do Humor.docx"),
    ),
    (
        "cap5",
        Path("/Users/danielferreira/Downloads/PICCA – Capítulo 5 – POC e Perturbações Relacionadas.docx"),
    ),
]

TABLE_HEADER = {
    "Indicador clínico",
    "Indicador",
    "Sim",
    "Não",
    "Não observado",
    "Observações",
}
CHECKLIST_HEADERS = {
    "Checklist clínica",
    "Checklist Clínica",
    "Checklist",
    "Checklist por domínio",
    "Checklist de exploração",
}
FOOTER_HEADERS = {
    "Áreas que requerem exploração complementar",
    "Diagnóstico diferencial a considerar",
    "Diagnóstico diferencial",
    "Instrumentos que podem complementar a avaliação",
    "Instrumentos complementares",
    "Síntese clínica",
    "Comorbilidades a considerar",
    "Encaminhamentos sugeridos",
    "Referenciação sugerida",
    "Critérios de gravidade / impacto",
    "Notas clínicas finais",
    "Aspetos a excluir",
    "Integração clínica",
    "IMPACTO FUNCIONAL DO SONO",
    "Impacto funcional",
}


def read_docx(path: Path) -> list[str]:
    with zipfile.ZipFile(path) as z:
        root = ET.fromstring(z.read("word/document.xml"))
    paras: list[str] = []
    for p in root.iter(W + "p"):
        parts: list[str] = []
        for t in p.iter(W + "t"):
            if t.text:
                parts.append(t.text)
            if t.tail:
                parts.append(t.tail)
        text = re.sub(r"\s+", " ", "".join(parts)).strip()
        if text:
            paras.append(text)
    return paras


def is_disorder_title(text: str) -> bool:
    return bool(re.match(r"^\d+\.\s+\S", text))


def is_unnumbered_disorder_section(text: str) -> bool:
    return bool(re.match(r"^[IVX]+\.\s+(PERTURBAÇÃO|Perturbação|ATRASO|OUTRA|IRRITABILIDADE|COMPORTAMENTOS)", text))


def parse_section_disorder_title(text: str) -> str:
    return re.sub(r"^[IVX]+\.\s+", "", text).strip()


def is_section_heading(text: str) -> bool:
    return bool(re.match(r"^[IVX]+\.\s+[A-ZÁÉÍÓÚÃÕÇ]", text)) and not is_unnumbered_disorder_section(text)


def is_skip_line(text: str) -> bool:
    if text in {"PICCA", "☐"}:
        return True
    if text.startswith("CAPÍTULO"):
        return True
    if text.startswith("Nota clínica"):
        return True
    if text.startswith("Categorias contempladas"):
        return True
    if is_section_heading(text):
        return True
    return False


def count_checkboxes(paras: list[str], start: int) -> tuple[int, int]:
    count = 0
    i = start
    while i < len(paras) and paras[i] == "☐" and count < 4:
        count += 1
        i += 1
    return count, i


def has_indicator_header_ahead(paras: list[str], start: int, limit: int = 6) -> bool:
    for j in range(start, min(start + limit, len(paras))):
        if paras[j] in {"Indicador", "Indicador clínico"}:
            return True
        if is_disorder_title(paras[j]) or paras[j] in FOOTER_HEADERS:
            return False
    return False


def is_group_title(paras: list[str], index: int) -> bool:
    text = paras[index]
    if text in TABLE_HEADER or text in CHECKLIST_HEADERS or text in FOOTER_HEADERS:
        return False
    if is_disorder_title(text) or is_skip_line(text):
        return False
    if text.startswith("☐"):
        return False
    cb_count, _ = count_checkboxes(paras, index + 1)
    if cb_count in (2, 3):
        return False
    return has_indicator_header_ahead(paras, index + 1)


def parse_disorder_block(paras: list[str], start: int, *, chapter_id: str, local_number: int) -> tuple[dict, int]:
    title_line = paras[start]
    if is_disorder_title(title_line):
        match = re.match(r"^(\d+)\.\s+(.+)$", title_line)
        if not match:
            raise ValueError(f"Invalid disorder title: {title_line}")
        number = int(match.group(1))
        title = match.group(2).strip()
    elif is_unnumbered_disorder_section(title_line):
        number = local_number
        title = parse_section_disorder_title(title_line)
    else:
        raise ValueError(f"Invalid disorder title: {title_line}")
    i = start + 1

    guidance_parts: list[str] = []
    while i < len(paras):
        line = paras[i]
        if is_disorder_title(line) or is_unnumbered_disorder_section(line) or line.startswith("CAPÍTULO"):
            break
        if line in CHECKLIST_HEADERS:
            i += 1
            break
        cb_count, _ = count_checkboxes(paras, i + 1)
        if cb_count in (2, 3) and line not in TABLE_HEADER:
            break
        if is_group_title(paras, i) or line in FOOTER_HEADERS:
            break
        if line in TABLE_HEADER:
            j = i + 1
            while j < len(paras) and paras[j] in TABLE_HEADER:
                j += 1
            next_cb, _ = count_checkboxes(paras, j + 1)
            if next_cb in (2, 3) or has_indicator_header_ahead(paras, i):
                break
        if not is_skip_line(line) and line not in TABLE_HEADER:
            guidance_parts.append(line)
        i += 1

    groups: list[dict] = []
    footer: dict[str, list[str]] = {}
    current_group: dict | None = None
    three_column: bool | None = None
    current_footer: str | None = None

    while i < len(paras):
        line = paras[i]
        if is_disorder_title(line) or is_unnumbered_disorder_section(line) or line.startswith("CAPÍTULO"):
            break
        if line in FOOTER_HEADERS:
            current_footer = line
            footer.setdefault(line, [])
            current_group = None
            i += 1
            continue
        if current_footer is not None:
            footer[current_footer].append(line)
            i += 1
            continue
        if line in TABLE_HEADER or line in CHECKLIST_HEADERS:
            i += 1
            continue
        if is_group_title(paras, i):
            current_group = {"title": line, "items": []}
            groups.append(current_group)
            i += 1
            continue

        if line.startswith("☐"):
            if current_footer is not None:
                footer[current_footer].append(line)
            i += 1
            continue

        cb_count, next_i = count_checkboxes(paras, i + 1)
        if cb_count in (2, 3) and line not in TABLE_HEADER:
            if current_group is None:
                current_group = {"title": "Indicadores clínicos", "items": []}
                groups.append(current_group)
            if three_column is None:
                three_column = cb_count == 3
            current_group["items"].append(line)
            i = next_i
            continue
        i += 1

    if not groups:
        groups = [{"title": "Indicadores clínicos", "items": []}]

    return (
        {
            "number": number,
            "title": title,
            "guidance": " ".join(guidance_parts).strip(),
            "groups": groups,
            "footer": footer,
            "threeColumn": three_column if three_column is not None else False,
        },
        i,
    )


def parse_chapter(paras: list[str], chapter_id: str) -> list[dict]:
    disorders: list[dict] = []
    i = 0
    local_number = 0
    while i < len(paras):
        if is_disorder_title(paras[i]) or is_unnumbered_disorder_section(paras[i]):
            local_number += 1
            disorder, i = parse_disorder_block(
                paras, i, chapter_id=chapter_id, local_number=local_number
            )
            disorder["chapter"] = chapter_id
            disorders.append(disorder)
        else:
            i += 1
    return disorders


def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "_", text)
    return re.sub(r"_+", "_", text).strip("_")[:40]


def main() -> None:
    all_disorders: list[dict] = []
    module_number = 0

    for chapter_id, path in FILES:
        if not path.exists():
            raise SystemExit(f"Missing source file: {path}")
        disorders = parse_chapter(read_docx(path), chapter_id)
        for disorder in disorders:
            module_number += 1
            disorder["moduleNumber"] = module_number
            disorder["moduleId"] = f"picca-vol7-mod{module_number}"
        all_disorders.extend(disorders)
        item_count = sum(len(g["items"]) for d in disorders for g in d["groups"])
        print(f"{chapter_id}: {len(disorders)} modules, {item_count} indicators")

    OUT.write_text(
        json.dumps({"disorders": all_disorders}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"Wrote {OUT} ({module_number} modules)")

    for disorder in all_disorders:
        count = sum(len(g["items"]) for g in disorder["groups"])
        if count == 0:
            print(f"WARNING: mod{disorder['moduleNumber']} {disorder['title']} has 0 items")


if __name__ == "__main__":
    main()
