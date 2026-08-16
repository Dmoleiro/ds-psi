#!/usr/bin/env python3
"""Generate piccaVol7Content.ts from scripts/vol7_extract.json."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXTRACT = ROOT / "scripts" / "vol7_extract.json"
OUT = ROOT / "src" / "components" / "picca" / "modules" / "vol7" / "piccaVol7Content.ts"

CHAPTER_LABELS = {
    "cap1": "Cap. 1 — Neurodesenvolvimento",
    "cap2": "Cap. 2 — Ansiedade",
    "cap3": "Cap. 3 — Sono, Alimentação e Choro",
    "cap4": "Cap. 4 — Humor",
    "cap5": "Cap. 5 — POC",
}


def js_string(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


def title_case(title: str) -> str:
    lower_words = {
        "de",
        "do",
        "da",
        "dos",
        "das",
        "e",
        "em",
        "com",
        "ou",
        "perante",
        "a",
        "o",
        "as",
        "os",
        "na",
        "no",
        "nas",
        "nos",
    }
    known_acronyms = {"PHDA", "POC", "PEA", "DC", "ADOS", "CARS", "M-CHAT", "SDQ", "ASEBA", "RCMAS", "SCARED"}
    words = title.split()
    result: list[str] = []
    for index, word in enumerate(words):
        upper = word.upper()
        if upper in known_acronyms:
            result.append(upper)
        elif word.isupper():
            lower = word.lower()
            if index > 0 and lower in lower_words:
                result.append(lower)
            else:
                result.append(lower.capitalize())
        elif index == 0 or word.lower() not in lower_words:
            result.append(word)
        else:
            result.append(word.lower())
    return " ".join(result)


def main() -> None:
    data = json.loads(EXTRACT.read_text(encoding="utf-8"))
    disorders = data["disorders"]

    manual_module = {
        "moduleId": "picca-vol7-mod33",
        "moduleNumber": 33,
        "number": 33,
        "title": "Checklist Clínica de Observação Sistemática",
        "chapter": "manual",
        "guidance": (
            "Extraído do Manual Clínico de Diagnóstico em Idade Pré-Escolar (PICCA). "
            "Registar observação sistemática durante a avaliação clínica."
        ),
        "threeColumn": False,
        "groups": [
            {
                "title": "Domínios de observação",
                "items": [
                    "Contacto ocular",
                    "Comunicação verbal",
                    "Comunicação não verbal",
                    "Atenção conjunta",
                    "Jogo simbólico",
                    "Reciprocidade social",
                    "Expressão emocional",
                    "Autorregulação",
                    "Comportamento adaptativo",
                    "Funções executivas",
                    "Processamento sensorial",
                    "Motricidade",
                    "Autonomia",
                    "Interação com os cuidadores",
                ],
            }
        ],
        "footer": {},
    }
    disorders = disorders + [manual_module]

    lines: list[str] = [
        "// Auto-generated from PICCA Volume VII DC:0-5 checklist docx sources",
        "",
        "export type Vol7IndicatorAnswer = {",
        "  resposta: '' | 'sim' | 'nao' | 'nao_observado'",
        "  observacoes: string",
        "}",
        "",
        "export type Vol7IndicatorItem = { id: string; label: string }",
        "export type Vol7IndicatorGroup = { id: string; title: string; items: Vol7IndicatorItem[] }",
        "",
        "export type Vol7FooterSection = { id: string; title: string; hint: string }",
        "",
        "export type Vol7DisorderDefinition = {",
        "  moduleId: string",
        "  number: number",
        "  title: string",
        "  chapter: string",
        "  chapterLabel: string",
        "  guidance: string",
        "  threeColumn: boolean",
        "  groups: Vol7IndicatorGroup[]",
        "  footerSections: Vol7FooterSection[]",
        "}",
        "",
        "export const PICCA_VOL7_DISORDERS: Vol7DisorderDefinition[] = [",
    ]

    for disorder in disorders:
        mod_num = disorder["moduleNumber"]
        slug_base = re.sub(r"[^a-z0-9]+", "_", disorder["title"].lower())[:30].strip("_")
        lines.append("  {")
        lines.append(f"    moduleId: {js_string(disorder['moduleId'])},")
        lines.append(f"    number: {mod_num},")
        lines.append(f"    title: {js_string(title_case(disorder['title']))},")
        lines.append(f"    chapter: {js_string(disorder['chapter'])},")
        lines.append(
            f"    chapterLabel: {js_string(CHAPTER_LABELS.get(disorder['chapter'], disorder['chapter']))},"
        )
        lines.append(f"    guidance: {js_string(disorder.get('guidance', ''))},")
        lines.append(f"    threeColumn: {'true' if disorder.get('threeColumn') else 'false'},")
        lines.append("    groups: [")
        for group_index, group in enumerate(disorder["groups"], start=1):
            group_id = f"{slug_base}_g{group_index}"
            lines.append("      {")
            lines.append(f"        id: {js_string(group_id)},")
            lines.append(f"        title: {js_string(group['title'])},")
            lines.append("        items: [")
            for item_index, item in enumerate(group["items"], start=1):
                item_id = f"{group_id}_i{item_index}"
                lines.append(
                    f"          {{ id: {js_string(item_id)}, label: {js_string(item)} }},"
                )
            lines.append("        ],")
            lines.append("      },")
        lines.append("    ],")
        lines.append("    footerSections: [")
        for footer_index, (footer_title, footer_lines) in enumerate(
            disorder.get("footer", {}).items(), start=1
        ):
            footer_id = f"{slug_base}_f{footer_index}"
            hint = "\n".join(f"• {line.rstrip(';')}" for line in footer_lines if line.strip())
            lines.append("      {")
            lines.append(f"        id: {js_string(footer_id)},")
            lines.append(f"        title: {js_string(footer_title)},")
            lines.append(f"        hint: {js_string(hint)},")
            lines.append("      },")
        lines.append("    ],")
        lines.append("  },")

    lines.extend(
        [
            "]",
            "",
            "export const PICCA_VOL7_BY_NUMBER: Record<number, Vol7DisorderDefinition> = Object.fromEntries(",
            "  PICCA_VOL7_DISORDERS.map((disorder) => [disorder.number, disorder]),",
            ")",
            "",
            "export const PICCA_VOL7_BY_ID: Record<string, Vol7DisorderDefinition> = Object.fromEntries(",
            "  PICCA_VOL7_DISORDERS.map((disorder) => [disorder.moduleId, disorder]),",
            ")",
            "",
        ]
    )

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
