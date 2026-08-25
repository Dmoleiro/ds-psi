#!/usr/bin/env python3
"""Generate api/src/lib/questionnaires/definitions/vineland.ts from Vineland-II synthetic form items."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "scripts/vineland_data.json"
OUT = ROOT / "api/src/lib/questionnaires/definitions/vineland.ts"

SUBDOMAIN_LABELS = {
    "receptiva": "Receptiva",
    "expressiva": "Expressiva",
    "escrita": "Escrita",
    "pessoal": "Pessoal",
    "domestica": "Doméstica",
    "comunidade": "Comunidade",
    "interpessoal": "R. Interpessoais",
    "jogos_lazer": "Jogos e Lazer",
    "regras_sociais": "Regras Sociais",
    "global": "Global",
    "fina": "Fina",
}

VINELAND_RESPONSE_LABELS = [
    "2 — Sim, normalmente",
    "1 — Algumas vezes, ou parcialmente",
    "0 — Não, nunca",
    "N — Não teve oportunidade",
    "D — Desconhecido",
]

MALADAPTIVE_PART2_LABELS = [
    "28. Envolve-se em comportamentos sexuais inapropriados.",
    "29. Tem preocupações excessivas ou peculiares com objectos ou actividades.",
    "30. Expressa pensamentos que revelam pouca sensibilidade.",
    "31. Exibe maneirismos ou hábitos extremamente peculiares.",
    "32. Exibe comportamentos auto-agressivos.",
    "33. Destrói intencionalmente os seus bens ou os dos outros.",
    "34. Utiliza linguagem bizarra.",
    "35. Não tem consciência do que acontece ao seu redor.",
    "36. Balanceia-se quando sentado ou em pé.",
]

VINELAND_COTATION_CONFIG = {
    "comunicacao": {
        "pageRows": [
            {"id": "pag3", "label": "Soma de 2, 1, 0 da pág. 3", "from": 34, "to": 67},
            {"id": "pag2", "label": "Soma de 2, 1, 0 da pág. 2", "from": 1, "to": 33},
        ],
        "nLabel": "N.º de N das pág. 2 e 3",
        "dLabel": "N.º de D das pág. 2 e 3",
        "totalLabel": "Cotação total da área",
    },
    "autonomia": {
        "pageRows": [
            {"id": "pag6", "label": "Soma de 2, 1, 0 da pág. 6", "from": 64, "to": 92},
            {"id": "pag5", "label": "Soma de 2, 1, 0 da pág. 5", "from": 34, "to": 63},
            {"id": "pag4", "label": "Soma de 2, 1, 0 da pág. 4", "from": 1, "to": 33},
        ],
        "nLabel": "N.º de N das pág. 4, 5 e 6",
        "dLabel": "N.º de D das pág. 4, 5 e 6",
        "totalLabel": "Cotação total da área",
    },
    "socializacao": {
        "pageRows": [
            {"id": "pag8", "label": "Soma de 2, 1, 0 da pág. 8", "from": 38, "to": 66},
            {"id": "pag7", "label": "Soma de 2, 1, 0 da pág. 7", "from": 1, "to": 37},
        ],
        "nLabel": "N.º de N das pág. 7 e 8",
        "dLabel": "N.º de D das pág. 7 e 8",
        "totalLabel": "Cotação total da área",
    },
    "motricidade": {
        "pageRows": [
            {"id": "pag9", "label": "Soma de 2, 1, 0 da pág. 9", "from": 1, "to": 36},
        ],
        "nLabel": "N.º de N da pág. 9",
        "dLabel": "N.º de D da pág. 9",
        "totalLabel": "Cotação total da área",
    },
}

VINELAND_MALADAPTIVE_COTATION = {
    "part1Label": "A. PARTE 1 Cotação Total (Soma de 2, 1, 0 da Parte 1)",
    "part2Label": "B. Soma de 2, 1, 0 da Parte 2",
    "totalLabel": "PARTES 1 e 2 Cotação Total (Somar A e B)",
}


def item_id(prefix: str, num: int) -> str:
    return f"{prefix}_{num:02d}"


def js_string(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


def main() -> None:
    data = json.loads(DATA.read_text(encoding="utf-8"))
    meta_areas: list[str] = []

    for area in data["areas"]:
        area_items: list[str] = []
        for item in area["items"]:
            rules = item.get("rules") or []
            rules_js = ", ".join(js_string(r) for r in rules)
            age = item.get("age")
            age_js = js_string(age) if age else "undefined"
            area_items.append(
                f'      {{ "num": {item["num"]}, "id": "{item_id(area["prefix"], item["num"])}", '
                f'"text": {js_string(item["text"])}, "subdomain": "{item["subdomain"]}", '
                f'"age": {age_js}, "rules": [{rules_js}] }},'
            )
        subdomains_js = ",\n".join(
            f'      {{ "id": "{sd["id"]}", "label": {js_string(sd["label"])}, "max": {sd.get("max", 0)} }}'
            for sd in area["subdomains"]
        )
        obs_id = area.get("observationsId", "")
        area_items_block = "\n".join(area_items)
        meta_areas.append(
            f"""  {{
    "id": "{area["id"]}",
    "title": {js_string(area["title"])},
    "prefix": "{area["prefix"]}",
    "subdomains": [
{subdomains_js}
    ],
    "items": [
{area_items_block}
    ],
    "observationsId": "{obs_id}"
  }}"""
        )

    ident_js = ",\n".join(
        f'  {{ "id": "{f["id"]}", "text": {js_string(f["text"])}, '
        f'"inputType": {js_string(f.get("inputType", "text"))}, '
        f'"section": {js_string(f.get("section", ""))}, '
        f'"wide": {json.dumps(f.get("wide", False))} }}'
        for f in data["identification"]
    )

    interview_js = ",\n".join(
        f'  {{ "id": "{n["id"]}", "text": {js_string(n["text"])}, "rows": {n.get("rows", 3)} }}'
        for n in data["interviewNotes"]
    )

    mbd1_block = ",\n".join(
        f'  {{ "num": {i + 1}, "id": "{item_id("mbd", i + 1)}", "text": {js_string(t)} }}'
        for i, t in enumerate(data["maladaptivePart1"])
    )
    mbd2_block = ",\n".join(
        f'  {{ "num": {28 + i}, "id": "{item_id("mbd", 28 + i)}", "text": {js_string(t)} }}'
        for i, t in enumerate(MALADAPTIVE_PART2_LABELS)
    )
    response_labels_block = ",\n".join(f"  {js_string(l)}" for l in VINELAND_RESPONSE_LABELS)
    meta_areas_block = ",\n".join(meta_areas)
    subdomain_labels_json = json.dumps(SUBDOMAIN_LABELS, ensure_ascii=False)
    cotation_config_json = json.dumps(VINELAND_COTATION_CONFIG, ensure_ascii=False)
    maladaptive_cotation_json = json.dumps(VINELAND_MALADAPTIVE_COTATION, ensure_ascii=False)

    ts = f"""// Auto-generated from scripts/vineland_data.json — do not edit by hand.
import {{ z }} from 'zod'
import {{ defineQuestionnaire }} from '../helpers.js'
import {{ QUESTIONNAIRE_NOTES_FIELD }} from '../types.js'
import type {{ QuestionnaireItem }} from '../types.js'

export const VINELAND_RESPONSE_LABELS = [
{response_labels_block}
] as const

export const VINELAND_IDENTIFICATION = [
{ident_js}
] as const

export const VINELAND_INTERVIEW_NOTES = [
{interview_js}
] as const

export const VINELAND_AREAS = [
{meta_areas_block}
] as const

export const VINELAND_MALADAPTIVE_PART1 = [
{mbd1_block}
] as const

export const VINELAND_MALADAPTIVE_PART2 = [
{mbd2_block}
] as const

export const VINELAND_COTATION_CONFIG = {cotation_config_json} as const

export const VINELAND_MALADAPTIVE_COTATION = {maladaptive_cotation_json} as const

const PRESENTATION_ITEMS: QuestionnaireItem[] = VINELAND_AREAS.flatMap((area) =>
  area.items.map((item) => ({{ id: item.id, text: item.text }})),
)

export const vinelandItemId = (prefix: string, num: number) => `${{prefix}}_${{String(num).padStart(2, '0')}}`

export const vinelandSeverityId = (num: number) => `mbd_${{String(num).padStart(2, '0')}}_sev`

const vinelandScoreValue = z.union([
  z.literal(2),
  z.literal(1),
  z.literal(0),
  z.literal('N'),
  z.literal('D'),
])

const maladaptiveScoreValue = z.union([z.literal(2), z.literal(1), z.literal(0)])

export function buildVinelandSchema() {{
  const shape: Record<string, z.ZodTypeAny> = {{}}
  for (const field of VINELAND_IDENTIFICATION) {{
    shape[field.id] = z.string().optional()
  }}
  for (const area of VINELAND_AREAS) {{
    for (const item of area.items) {{
      shape[item.id] = vinelandScoreValue.optional()
    }}
    if (area.observationsId) {{
      shape[area.observationsId] = z.string().optional()
    }}
  }}
  for (const item of VINELAND_MALADAPTIVE_PART1) {{
    shape[item.id] = maladaptiveScoreValue.optional()
  }}
  for (const item of VINELAND_MALADAPTIVE_PART2) {{
    shape[item.id] = maladaptiveScoreValue.optional()
    shape[vinelandSeverityId(item.num)] = z.union([z.literal('S'), z.literal('M')]).optional()
  }}
  shape.mbd_observations = z.string().optional()
  for (const note of VINELAND_INTERVIEW_NOTES) {{
    shape[note.id] = z.string().optional()
  }}
  shape[QUESTIONNAIRE_NOTES_FIELD] = z.string().optional()
  return z.object(shape).strict()
}}

export const vinelandQuestionnaire = defineQuestionnaire({{
  id: 'vineland',
  title: 'VINELAND — Escala de Comportamento Adaptativo',
  description:
    'Vineland-II, Forma Sintética de Entrevista (versão portuguesa). Comunicação, Autonomia, Socialização, Motricidade e Comportamento Desajustado.',
  instructions:
    'Entrevista estruturada com informador. Cotar cada item com 2 (sim, normalmente), 1 (algumas vezes), 0 (não, nunca), N (sem oportunidade) ou D (desconhecido). Estabelecer base (sete 2 consecutivos) e máximo (sete 0 consecutivos). Na Área do Comportamento Desajustado (opcional, ≥5 anos) usar apenas 2, 1 ou 0.',
  respondent: 'Pais, educadores ou outros informadores',
  responseType: 'vineland_item',
  responseLabels: [...VINELAND_RESPONSE_LABELS],
  items: PRESENTATION_ITEMS,
  scoring: {{ type: 'vineland' }},
  meta: {{
    identification: VINELAND_IDENTIFICATION,
    areas: VINELAND_AREAS,
    maladaptivePart1: VINELAND_MALADAPTIVE_PART1,
    maladaptivePart2: VINELAND_MALADAPTIVE_PART2,
    interviewNotes: VINELAND_INTERVIEW_NOTES,
    responseLabels: VINELAND_RESPONSE_LABELS,
    subdomainLabels: {subdomain_labels_json},
    cotationConfig: VINELAND_COTATION_CONFIG,
    maladaptiveCotation: VINELAND_MALADAPTIVE_COTATION,
  }},
}})
"""

    OUT.write_text(ts, encoding="utf-8")
    item_count = sum(len(a["items"]) for a in data["areas"])
    print(f"Wrote {OUT} ({item_count} adaptive items)")


if __name__ == "__main__":
    main()
