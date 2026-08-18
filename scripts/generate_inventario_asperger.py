#!/usr/bin/env python3
"""Generate inventario_asperger.ts from scripts/inventario_asperger_extract.txt"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXTRACT = ROOT / "scripts/inventario_asperger_extract.txt"
OUT = ROOT / "api/src/lib/questionnaires/definitions/inventario_asperger.ts"

text = EXTRACT.read_text(encoding="utf-8")

COMPLEMENTARY = [
    {
        "title": "Desenvolvimento da Linguagem",
        "items": [
            {"id": "comp_idade_fala", "text": "Com que idade começou a falar? (meses)", "inputType": "text"},
            {"id": "comp_lang_01", "text": "Dizia palavras por volta dos 2 anos."},
            {"id": "comp_lang_02", "text": "Dizia frases para comunicar por volta dos 3 anos."},
            {"id": "comp_lang_03", "text": "Compreende o vocabulário de acordo com o que é esperado para a sua idade."},
            {"id": "comp_lang_04", "text": "Tem um vocabulário apropriado para a sua idade."},
            {"id": "comp_lang_05", "text": "Parece ouvir bem."},
        ],
    },
    {
        "title": "Desenvolvimento Motor",
        "items": [
            {"id": "comp_idade_andar", "text": "Com que idade começou a andar? (meses)", "inputType": "text"},
        ],
    },
    {
        "title": "Competências de Cuidados Pessoais",
        "items": [
            {"id": "comp_cuidados_01", "text": "Consegue vestir-se de acordo com o esperado para a sua idade."},
            {"id": "comp_cuidados_02", "text": "Consegue alimentar-se de acordo com o que é esperado para a sua idade."},
            {
                "id": "comp_cuidados_03",
                "text": "Tem cuidados de higiene apropriados para a sua idade (i.e., lavar os dentes, pentear-se, tomar banho, lavar o cabelo).",
            },
        ],
    },
    {
        "title": "Comportamento Adaptativo",
        "items": [
            {"id": "comp_adapt_01", "text": "Ocupa os seus tempos livres com as atividades habituais das pessoas da sua idade e do mesmo sexo."},
            {
                "id": "comp_adapt_02",
                "text": "Usa os recursos da comunidade de forma tão independente como as pessoas da sua idade e do mesmo sexo (por ex., correios, fazer compras).",
            },
            {"id": "comp_adapt_03", "text": "Sabe o seu número de telefone e morada."},
            {"id": "comp_adapt_04", "text": "Assume a responsabilidade das suas tarefas."},
        ],
    },
    {
        "title": "Competências Cognitivas",
        "items": [
            {"id": "comp_cogn_01", "text": "As suas capacidades de aprendizagem situam-se na média ou acima da média das pessoas da sua idade."},
            {
                "id": "comp_cogn_02",
                "text": "Demonstra conhecimentos ou competências superiores numa área específica (relacionados com os seus interesses).",
            },
            {
                "id": "comp_cogn_03",
                "text": "Tem uma memória a longo-prazo excecional, relativamente a acontecimentos ou factos (por ex. recorda-se da matrícula do antigo carro dos vizinhos ou de situações que aconteceram há anos).",
            },
            {
                "id": "comp_cogn_04",
                "text": "Mostra um interesse intenso, obsessivo em determinadas áreas intelectuais (por ex., dinossauros, máquinas, geografia).",
            },
            {"id": "comp_cogn_05", "text": "Aprende melhor quando a informação é apresentada visualmente (imagens)."},
            {"id": "comp_cogn_06", "text": "Aprende melhor quando a informação é apresentada oralmente."},
            {"id": "comp_cogn_07", "text": "As suas capacidades intelectuais situam-se na média ou acima da média das pessoas da sua idade."},
            {"id": "comp_cogn_08", "text": "É desorganizado."},
            {"id": "comp_cogn_09", "text": "Tem boa memória visual (i.e., memoriza facilmente caminhos, imagens)."},
            {
                "id": "comp_cogn_10",
                "text": "Lê ou vê programas de televisão para obter informação acerca de certos temas e não como forma de entretenimento.",
            },
            {"id": "comp_cogn_11", "text": "É surpreendentemente bom em algumas áreas."},
            {"id": "comp_cogn_12", "text": "Dá a impressão de que compreende mais do que aquilo que realmente compreende."},
            {"id": "comp_cogn_13", "text": "Tem boa memória auditiva (i.e., memoriza facilmente o que ouve)."},
            {"id": "comp_cogn_14", "text": "Tem dificuldade em pensar em várias alternativas para resolver um problema."},
            {"id": "comp_cogn_15", "text": "Distraí-se facilmente (por ex., com pequenos ruídos, objetos, etc.)."},
            {"id": "comp_cogn_16", "text": "Está frequentemente concentrado «no seu mundo», sem dar atenção ao que está à sua volta."},
        ],
    },
    {
        "title": "Curiosidade pelo ambiente",
        "items": [
            {
                "id": "comp_cur_01",
                "text": "Mostra-se curioso em relação a vários aspetos do ambiente (i.e., faz perguntas do tipo «porquê», «quando», «como», «onde» para saber porque é que as coisas são assim).",
            },
            {"id": "comp_cur_02", "text": "Lê/vê para obter informação."},
            {"id": "comp_cur_03", "text": "Lê/vê para ter prazer."},
            {"id": "comp_cur_04", "text": "Tenta saber como as coisas funcionam (por ex., máquinas)."},
        ],
    },
]

IDENTIFICATION = [
    {"id": "id_nome", "text": "Nome", "inputType": "text"},
    {"id": "id_sexo", "text": "Sexo", "inputType": "choice", "options": ["Feminino", "Masculino"]},
    {"id": "id_data_avaliacao", "text": "Data da avaliação", "inputType": "text"},
    {"id": "id_escola", "text": "Escola", "inputType": "text"},
    {"id": "id_data_nascimento", "text": "Data de nascimento", "inputType": "text"},
    {"id": "id_examinador", "text": "Examinador", "inputType": "text"},
    {"id": "id_idade_cronologica", "text": "Idade cronológica", "inputType": "text"},
    {"id": "id_preenchido_por", "text": "Preenchido por", "inputType": "text"},
]

SUBSCALE_RANGES = {
    "interacao_social": (1, 21),
    "comunicacao": (22, 43),
    "padroes_comportamento": (44, 54),
    "motora": (55, 60),
    "sensibilidade_sensorial": (61, 75),
}


def skip_rating_block(lines: list[str], index: int) -> int:
    while index < len(lines):
        token = lines[index].strip()
        if token in ("0", "1", "2", "3"):
            index += 1
            continue
        if token == "":
            index += 1
            continue
        break
    return index


def parse_likert_sections(raw: str) -> list[dict]:
    sections: list[dict] = []
    current: dict | None = None
    lines = raw.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if line.startswith("=== PAGE"):
            i += 1
            continue
        if re.match(r"^(I{1,3}|IV|V)\.", line) and "Subescala" in line:
            current = {"title": line, "items": []}
            sections.append(current)
            i += 1
            continue
        if re.match(r"^\d+\.$", line):
            num = int(line[:-1])
            i += 1
            parts: list[str] = []
            while i < len(lines):
                token = lines[i].strip()
                if re.match(r"^\d+\.$", token):
                    break
                if re.match(r"^(I{1,3}|IV|V)\.", token) and "Subescala" in token:
                    break
                if token.startswith("3. QUESTÕES"):
                    break
                if token == "0":
                    i = skip_rating_block(lines, i)
                    break
                if token and not token.startswith("==="):
                    parts.append(token)
                i += 1
            if current is not None and parts and not any(item["num"] == num for item in current["items"]):
                current["items"].append({"num": num, "text": " ".join(parts)})
            continue
        i += 1
    return sections


LIKERT_SECTIONS = parse_likert_sections(text)


def item_id(num: int) -> str:
    return f"item_{num:02d}"


def build_presentation_items() -> list[dict]:
    items: list[dict] = []
    for field in IDENTIFICATION:
        entry = {"id": field["id"], "text": field["text"]}
        if field.get("inputType") == "text":
            entry["inputType"] = "text"
        elif field.get("inputType") == "choice":
            entry["options"] = field["options"]
        items.append(entry)
    for section in LIKERT_SECTIONS:
        for item in section["items"]:
            items.append({"id": item_id(item["num"]), "text": f"{item['num']}. {item['text']}"})
    for section in COMPLEMENTARY:
        for item in section["items"]:
            entry = {"id": item["id"], "text": item["text"]}
            if item.get("inputType") == "text":
                entry["inputType"] = "text"
            items.append(entry)
    return items


presentation_items = build_presentation_items()
all_nums = sorted(item["num"] for section in LIKERT_SECTIONS for item in section["items"])
missing = sorted(set(range(1, 76)) - set(all_nums))

if missing:
    raise SystemExit(f"Missing likert item numbers: {missing}")

ts = f"""// Auto-generated from scripts/inventario_asperger_extract.txt — do not edit by hand.
import {{ z }} from 'zod'
import {{ defineQuestionnaire }} from '../helpers.js'
import {{ QUESTIONNAIRE_NOTES_FIELD }} from '../types.js'
import type {{ QuestionnaireItem }} from '../types.js'

export const INVENTARIO_ASPERGER_LIKERT_LABELS = [
  '0 — Não é problema / não apresenta',
  '1 — Ligeiro / pouco acentuada',
  '2 — Moderado',
  '3 — Grave / muito acentuada',
] as const

export const INVENTARIO_ASPERGER_LIKERT_SECTIONS = {json.dumps(LIKERT_SECTIONS, ensure_ascii=False, indent=2)} as const

export const INVENTARIO_ASPERGER_COMPLEMENTARY = {json.dumps(COMPLEMENTARY, ensure_ascii=False, indent=2)} as const

export const INVENTARIO_ASPERGER_IDENTIFICATION = {json.dumps(IDENTIFICATION, ensure_ascii=False, indent=2)} as const

export const INVENTARIO_ASPERGER_SUBSCALES = {json.dumps(SUBSCALE_RANGES)} as const

const PRESENTATION_ITEMS: QuestionnaireItem[] = {json.dumps(presentation_items, ensure_ascii=False, indent=2)}

export function inventarioAspergerItemId(num: number): string {{
  return `item_${{String(num).padStart(2, '0')}}`
}}

export function buildInventarioAspergerSchema() {{
  const shape: Record<string, z.ZodTypeAny> = {{}}
  for (const field of INVENTARIO_ASPERGER_IDENTIFICATION) {{
    if (field.inputType === 'choice') {{
      shape[field.id] = z.union([z.literal(0), z.literal(1)]).optional()
    }} else {{
      shape[field.id] = z.string().optional()
    }}
  }}
  for (const section of INVENTARIO_ASPERGER_LIKERT_SECTIONS) {{
    for (const item of section.items) {{
      shape[inventarioAspergerItemId(item.num)] = z
        .union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)])
        .optional()
    }}
  }}
  for (const section of INVENTARIO_ASPERGER_COMPLEMENTARY) {{
    for (const item of section.items) {{
      if ('inputType' in item && item.inputType === 'text') {{
        shape[item.id] = z.string().optional()
      }} else {{
        shape[item.id] = z.union([z.literal(0), z.literal(1)]).optional()
      }}
    }}
  }}
  shape[QUESTIONNAIRE_NOTES_FIELD] = z.string().optional()
  return z.object(shape).strict()
}}

export const inventarioAspergerQuestionnaire = defineQuestionnaire({{
  id: 'inventario_asperger',
  title: 'Inventário de Síndrome de Asperger',
  description:
    'Inventário clínico de comportamentos e características associadas à síndrome de Asperger (75 itens, escala 0–3).',
  instructions:
    'Avalie cada item de 0 a 3 conforme as instruções do inventário. Para características de temperamento (itens sombreados no original), use a mesma escala 0–3. Responda também às questões complementares.',
  respondent: 'Pais, professores ou outros informadores',
  responseType: 'likert4',
  responseLabels: [...INVENTARIO_ASPERGER_LIKERT_LABELS],
  items: PRESENTATION_ITEMS,
  scoring: {{ type: 'inventario_asperger' }},
  meta: {{
    identification: INVENTARIO_ASPERGER_IDENTIFICATION,
    likertSections: INVENTARIO_ASPERGER_LIKERT_SECTIONS,
    complementary: INVENTARIO_ASPERGER_COMPLEMENTARY,
    likertLabels: INVENTARIO_ASPERGER_LIKERT_LABELS,
  }},
}})
"""

OUT.write_text(ts, encoding="utf-8")
print(f"Wrote {OUT}")
print(f"Likert items: {len(all_nums)}")
print(f"Sections: {len(LIKERT_SECTIONS)}")
