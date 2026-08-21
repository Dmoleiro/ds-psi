#!/usr/bin/env python3
"""Generate adir.ts from scripts/adir_extract.txt (ADI-R manual)."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXTRACT = ROOT / "scripts/adir_extract.txt"
OUT = ROOT / "api/src/lib/questionnaires/definitions/adir.ts"

INDEX_TEXT = " ".join(EXTRACT.read_text(encoding="utf-8").split("\n")[1:5])

TITLES: dict[str, str] = {}
for num, raw in re.findall(
    r"(?:^|\s)(\d+[A]?)\.\s+(.+?)(?=\s+\d+[A]?\.\s+|\s+\d{3}\.|\s+[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ]{6,}\s+[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ]|\s*$)",
    INDEX_TEXT,
):
    title = re.sub(r"\s+", " ", raw).strip(" .")
    if len(title) >= 5:
        TITLES[num.lower()] = title

TITLES.update(
    {
        "64": "JOGO IMAGINATIVO COM COLEGAS",
        "65": "JOGO SOCIAL IMITATIVO",
        "72": "USO REPETITIVO DE OBJECTOS OU INTERESSE POR PARTES DE OBJECTOS",
        "79": "MEDOS INVULGARES",
        "34a": "COMPREENSÃO DE LINGUAGEM SIMPLES",
        "100": "CAPACIDADE DE ADAPTAÇÃO",
        "101": "CAPACIDADES PRÉ-ACADÉMICAS, ACADÉMICAS OU VOCACIONAIS",
        "102": "CAPACIDADES MOTORAS",
        "103": "IDADE EM QUE A PERDA PRINCIPAL DE CAPACIDADE FOI INICIALMENTE APARENTE",
        "104": "DETERIORAÇÃO PROGRESSIVA",
        "105": "DURAÇÃO DO PERÍODO DE DETERIORAÇÃO",
        "106": "HABILIDADE VISUO-ESPACIAL",
        "107": "CAPACIDADE DE MEMÓRIA",
        "108": "HABILIDADE MUSICAL",
        "109": "HABILIDADE PARA DESENHO",
        "110": "CAPACIDADE DE LEITURA",
        "111": "CAPACIDADE DE CÁLCULO",
    }
)

ITEM_ORDER = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
    "32",
    "33",
    "34",
    "34a",
    "35",
    "36",
    "37",
    "38",
    "39",
    "40",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
    "47",
    "48",
    "49",
    "50",
    "51",
    "52",
    "53",
    "54",
    "55",
    "56",
    "57",
    "58",
    "59",
    "60",
    "61",
    "62",
    "63",
    "64",
    "65",
    "66",
    "67",
    "68",
    "69",
    "70",
    "71",
    "72",
    "73",
    "74",
    "75",
    "76",
    "77",
    "78",
    "79",
    "80",
    "81",
    "82",
    "83",
    "84",
    "85",
    "86",
    "87",
    "88",
    "89",
    "90",
    "91",
    "92",
    "93",
    "94",
    "95",
    "96",
    "97",
    "98",
    "99",
    "100",
    "101",
    "102",
    "103",
    "104",
    "105",
    "106",
    "107",
    "108",
    "109",
    "110",
    "111",
]

CONCERNS_ITEMS = {"1", "3"}
AGE_ITEMS = {"2", "4", "6", "7", "8", "9", "10", "12", "13", "93", "94", "103"}
RETRO_ITEMS = {"5"}
LOSS_ITEMS = {"38", "39", "40", "41"}

SECTIONS_SPEC: list[tuple[str, list[str]]] = [
    ("Perguntas introdutórias e início dos sintomas", ["1", "2", "3", "4", "5"]),
    ("Etapas motoras", ["6", "7"]),
    ("Controlo de esfincteres", ["8", "9", "10"]),
    ("Comunicação", [str(n) for n in range(11, 42)] + ["34a"]),
    ("Desenvolvimento social e jogo", [str(n) for n in range(42, 61)]),
    ("Actividades e brinquedos favoritos", [str(n) for n in range(61, 70)]),
    ("Interesses e comportamentos repetitivos", [str(n) for n in range(70, 86)]),
    ("Comportamentos gerais", [str(n) for n in range(86, 93)]),
    ("Idade da anomalia", ["93", "94"]),
    ("Perda de capacidades", ["95", "96"]),
    ("Áreas de perda", [str(n) for n in range(97, 106)]),
    ("Capacidades especiais", [str(n) for n in range(106, 112)]),
]

INTRO_SCRIPT = (
    "Gostaria de começar por obter um quadro geral da sua criança. Deixe-me rapidamente "
    "pôr-lhe algumas questões, e depois poderemos voltar a algum dos pontos em mais detalhe. "
    "Pode falar-me um pouco do(a) _______? Como é o seu dia? Quando está no seu melhor? "
    "Como descreveria o(a) _______ a alguém que tivesse de o identificar no meio de um grupo?"
)

IDENTIFICATION = [
    {"id": "id_nome", "text": "Nome do probando", "inputType": "text"},
    {"id": "id_familia_id", "text": "Número ID da família", "inputType": "text"},
    {"id": "id_individual_id", "text": "Número ID individual do sujeito", "inputType": "text"},
    {"id": "id_sexo", "text": "Sexo", "inputType": "choice", "options": ["Masculino", "Feminino"]},
    {"id": "id_data_entrevista", "text": "Data da entrevista", "inputType": "text"},
    {"id": "id_idade_anos", "text": "Idade do sujeito na entrevista (anos)", "inputType": "text"},
    {"id": "id_data_nascimento", "text": "Data de nascimento (mês/dia/ano)", "inputType": "text"},
    {"id": "id_investigador", "text": "Investigador / entrevistador", "inputType": "text"},
    {"id": "id_informador", "text": "Nome do informador", "inputType": "text"},
    {
        "id": "id_informador_relacao",
        "text": "Informador",
        "inputType": "choice",
        "options": ["Mãe", "Pai", "Outro acompanhante", "Combinação"],
    },
    {"id": "id_telefone_informador", "text": "Telefone do informador", "inputType": "text"},
    {"id": "id_local_entrevista", "text": "Local e circunstâncias da entrevista", "inputType": "textarea"},
]

BACKGROUND = [
    {
        "id": "bg_antecedentes",
        "text": "Antecedentes — estrutura familiar (nomes, idades, historial relevante)",
        "inputType": "textarea",
    },
    {"id": "bg_historia_medica", "text": "História médica / social", "inputType": "textarea"},
    {"id": "bg_escolaridade", "text": "Escolaridade (pré-escolar e escolar)", "inputType": "textarea"},
    {"id": "bg_medicacao", "text": "Medicação", "inputType": "textarea"},
    {"id": "bg_diagnostico_previo", "text": "Diagnósticos médicos prévios (registo livre)", "inputType": "textarea"},
]

CONCERNS_CODES = [
    {"code": 0, "text": "Sem problemas, pais ou profissionais"},
    {"code": 1, "text": "Atraso/desvio no desenvolvimento da fala e/ou linguagem expressiva"},
    {"code": 2, "text": "Problemas médicos ou atraso para além da linguagem"},
    {"code": 3, "text": "Falta de interesse ou anomalia na resposta emocional e social"},
    {"code": 4, "text": "Dificuldade de comportamento não específica do autismo"},
    {"code": 5, "text": "Comportamento tipo autista"},
    {"code": 6, "text": "Falta de capacidade de viver independente ou feliz"},
    {"code": 7, "text": "Preocupações não directamente associadas ao comportamento"},
    {"code": 8, "text": "Profissionais preocupados, pais não"},
    {"code": 9, "text": "Não conhecido ou não perguntado"},
]

RETRO_CODES = [
    {"code": 0, "text": "Problemas presentes nos primeiros 12 meses"},
    {"code": 1, "text": "Problemas notados aos 24 meses ou antes (não antes dos 12)"},
    {"code": 2, "text": "Problemas notados aos 36 meses ou antes (não antes dos 24)"},
    {"code": 3, "text": "Problemas notados aos 4 anos ou antes (não antes dos 36 meses)"},
    {"code": 4, "text": "Problemas notados aos 5 anos ou antes (não antes dos 4)"},
    {"code": 5, "text": "Problemas notados aos 6 anos ou antes (não antes dos 5)"},
    {"code": 6, "text": "Problemas notados mais tarde (especificar)"},
    {"code": 7, "text": "Criança sempre «diferente», sem anomalia percebida"},
    {"code": 8, "text": "Não foram notados problemas pelos pais"},
    {"code": 9, "text": "Não conhecido ou não perguntado"},
]

LOSS_CODES = [
    {"code": 0, "text": "Sem perda"},
    {"code": 1, "text": "Perda provável de uma capacidade específica"},
    {"code": 2, "text": "Perda completa de uma capacidade específica"},
    {"code": 8, "text": "Linguagem insuficiente para mostrar alterações"},
    {"code": 9, "text": "Não conhecido ou não perguntado"},
]

TIMEPOINT_LABELS = {
    "actual": "Actual (últimos 3 meses)",
    "ever": "Alguma vez",
    "anomal_45": "Mais anómalo 4,0–5,0 anos",
}

AGE_HINT = "Idade em meses. Códigos especiais: 991–999 conforme manual."


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def item_header(num: str) -> str:
    return num.upper() if num != "34a" else "34A"


def find_item_positions(body: str) -> list[tuple[int, str]]:
    positions: list[tuple[int, str]] = []
    for num in ITEM_ORDER:
        header = item_header(num)
        pattern = rf"\b{header}[.:]\s*"
        match = re.search(pattern, body, re.I)
        if not match and num in TITLES:
            words = TITLES[num].split()[:3]
            pattern = rf"\b{header}[.:]\s*{re.escape(words[0])}"
            match = re.search(pattern, body, re.I)
        if match:
            positions.append((match.start(), num))
        else:
            raise SystemExit(f"Could not locate item {num} in extract")
    return positions


def extract_notes_and_title(chunk: str) -> tuple[list[str], str, str]:
    chunk = normalize(chunk)
    notes: list[str] = []
    while chunk.startswith("("):
        end = chunk.find(")")
        if end == -1:
            break
        notes.append(chunk[1:end].strip())
        chunk = chunk[end + 1 :].strip()

    code_match = re.search(r"\b0\s*[=–-]\s*", chunk)
    probe_end = code_match.start() if code_match else len(chunk)
    middle = chunk[:probe_end].strip()

    if notes:
        title = notes[0].split(")")[0][:120] if not middle else middle.split("?")[0][:120]
    else:
        title = middle.split("?")[0][:120] if "?" in middle[:200] else middle[:120]

    title = TITLES.get(chunk[:1], title)  # noop safeguard
    rest = chunk[probe_end:].strip() if code_match else chunk
    probe_text = chunk[len(title) : probe_end].strip() if not code_match else chunk[:probe_end]
    if title == chunk[: len(title)]:
        probe_text = chunk[len(title) : probe_end].strip()

    return notes, title, probe_text + (" " + rest if rest else "")


def extract_probes(probe_blob: str, codes: list[dict]) -> list[str]:
    text = probe_blob
    if codes:
        first_code = re.search(r"\b0\s*[=–-]\s*", text)
        if first_code:
            text = text[: first_code.start()]
    probes: list[str] = []
    for part in re.split(r"(?<=[?.!])\s+", text):
        part = normalize(part)
        if len(part) < 20:
            continue
        if part.startswith("(") and ")" in part and "?" not in part:
            continue
        if "?" in part or part.lower().startswith(("como", "que", "quando", "ele", "o ", "a ", "se ", "alguma", "pode", "nota", "para ")):
            if not part.endswith("?"):
                part = part + "?"
            probes.append(part)
    return probes[:10]


def extract_codes(text: str) -> list[dict]:
    codes: list[dict] = []
    for match in re.finditer(r"\b(\d+)\s*[=–-]\s*([^0-9]+?)(?=\s+\d+\s*[=–-]|\s+ACTUAL|\s+ALGUMA|\s+MAIS|\s+AOS|\s+ANTES|\s+\(MENOS|\s+8\s*[=–-]|\Z)", text, re.I):
        label = normalize(match.group(2))
        if len(label) < 8:
            continue
        codes.append({"code": int(match.group(1)), "text": label[:220]})
    return codes[:14]


def detect_timepoints(text: str, num: str) -> list[str]:
    upper = text.upper()
    points: list[str] = []
    if num in LOSS_ITEMS or ("ALGUMA VEZ" in upper and num in {"35", "37", "53"}):
        return ["ever"]
    if "ACTUAL" in upper or num in {"11", "19"}:
        points.append("actual")
    if "ALGUMA VEZ" in upper:
        points.append("ever")
    if "MAIS ANÓMALO" in upper or "MAIS ANOMALO" in upper or "AOS 5.0" in upper or "AOS 5" in upper:
        points.append("anomal_45")
    if not points and num not in CONCERNS_ITEMS | AGE_ITEMS | RETRO_ITEMS:
        points = ["actual"]
    return points


def parse_item(num: str, raw_chunk: str) -> dict:
    header = item_header(num)
    chunk = re.sub(rf"^{re.escape(header)}[.:]\s*", "", raw_chunk.strip(), flags=re.I)
    chunk = normalize(chunk)

    notes, _, blob = extract_notes_and_title(chunk)
    title = TITLES.get(num, chunk[:100])
    codes = extract_codes(blob)
    probes = extract_probes(blob, codes)
    timepoints = detect_timepoints(blob, num)

    if num in CONCERNS_ITEMS:
        item_type = "concerns"
    elif num in AGE_ITEMS:
        item_type = "age"
    elif num in RETRO_ITEMS:
        item_type = "retrospective"
    elif num in LOSS_ITEMS:
        item_type = "loss"
    else:
        item_type = "coded"

    base_id = f"item_{num.lower()}"
    return {
        "num": num.upper() if num != "34a" else "34A",
        "id": base_id,
        "text": title,
        "type": item_type,
        "notes": notes[:4],
        "probes": probes,
        "codes": codes if codes else (CONCERNS_CODES if num in CONCERNS_ITEMS else RETRO_CODES if num in RETRO_ITEMS else LOSS_CODES if num in LOSS_ITEMS else []),
        "timepoints": timepoints,
    }


def parse_all_items() -> dict[str, dict]:
    text = EXTRACT.read_text(encoding="utf-8")
    start = text.find("1. PREOCUPAÇÕES ACTUAIS")
    if start == -1:
        raise SystemExit("Could not find start of ADI-R items in extract")
    body = text[start:]
    positions = find_item_positions(body)
    parsed: dict[str, dict] = {}
    for i, (pos, num) in enumerate(positions):
        end = positions[i + 1][0] if i + 1 < len(positions) else len(body)
        parsed[num] = parse_item(num, body[pos:end])
    return parsed


def build_sections(parsed: dict[str, dict]) -> list[dict]:
    sections: list[dict] = []
    for title, nums in SECTIONS_SPEC:
        items = [parsed[num.lower() if num != "34A" else "34a"] for num in nums]
        sections.append({"title": title, "items": items})
    return sections


def schema_field_ids(item: dict) -> list[str]:
    base = item["id"]
    t = item["type"]
    if t == "concerns":
        return [f"{base}_a", f"{base}_b", f"{base}_c", f"{base}_d", f"{base}_detalhe"]
    if t == "age":
        return [base, f"{base}_detalhe"]
    if t == "retrospective":
        return [base, f"{base}_detalhe"]
    if t == "loss":
        return [f"{base}_ever", f"{base}_detalhe"]
    ids = [f"{base}_detalhe"]
    for tp in item.get("timepoints") or ["actual"]:
        ids.insert(0, f"{base}_{tp}")
    return ids


def build_presentation_items(sections: list[dict]) -> list[dict]:
    items: list[dict] = []
    for field in IDENTIFICATION + BACKGROUND:
        if field.get("inputType") == "choice":
            continue
        items.append(
            {
                "id": field["id"],
                "text": field["text"],
                "inputType": "textarea" if field.get("inputType") == "textarea" else "text",
            }
        )
    for section in sections:
        for item in section["items"]:
            items.append({"id": item["id"], "text": f"{item['num']}. {item['text']}"})
    return items


PARSED = parse_all_items()
SECTIONS = build_sections(PARSED)
PRESENTATION_ITEMS = build_presentation_items(SECTIONS)

schema_lines: list[str] = []
for section in SECTIONS:
    for item in section["items"]:
        for field_id in schema_field_ids(item):
            if field_id.endswith("_detalhe"):
                schema_lines.append(f"  shape[{json.dumps(field_id)}] = z.string().optional()")
            elif item["type"] == "loss" and not field_id.endswith("_detalhe"):
                schema_lines.append(f"  shape[{json.dumps(field_id)}] = lossSchema")
            else:
                schema_lines.append(f"  shape[{json.dumps(field_id)}] = codeSchema")

schema_block = "\n".join(schema_lines)

ts = f"""// Auto-generated from scripts/adir_extract.txt — do not edit by hand.
import {{ z }} from 'zod'
import {{ defineQuestionnaire }} from '../helpers.js'
import {{ QUESTIONNAIRE_NOTES_FIELD }} from '../types.js'
import type {{ QuestionnaireItem }} from '../types.js'

export const ADIR_TIMEPOINT_LABELS = {json.dumps(TIMEPOINT_LABELS, ensure_ascii=False, indent=2)} as const

export const ADIR_CONCERNS_CODES = {json.dumps(CONCERNS_CODES, ensure_ascii=False, indent=2)} as const

export const ADIR_RETRO_CODES = {json.dumps(RETRO_CODES, ensure_ascii=False, indent=2)} as const

export const ADIR_LOSS_CODES = {json.dumps(LOSS_CODES, ensure_ascii=False, indent=2)} as const

export const ADIR_AGE_HINT = {json.dumps(AGE_HINT, ensure_ascii=False)}

export const ADIR_INTRO_SCRIPT = {json.dumps(INTRO_SCRIPT, ensure_ascii=False)}

export const ADIR_IDENTIFICATION = {json.dumps(IDENTIFICATION, ensure_ascii=False, indent=2)} as const

export const ADIR_BACKGROUND = {json.dumps(BACKGROUND, ensure_ascii=False, indent=2)} as const

export const ADIR_SECTIONS = {json.dumps(SECTIONS, ensure_ascii=False, indent=2)} as const

const PRESENTATION_ITEMS: QuestionnaireItem[] = {json.dumps(PRESENTATION_ITEMS, ensure_ascii=False, indent=2)}

const codeSchema = z
  .union([
    z.literal(0),
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
    z.literal(6),
    z.literal(7),
    z.literal(8),
    z.literal(9),
  ])
  .optional()

const lossSchema = z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(8), z.literal(9)]).optional()

export function adirFieldId(itemId: string, suffix: string): string {{
  return `${{itemId}}_${{suffix}}`
}}

export function buildAdirSchema() {{
  const shape: Record<string, z.ZodTypeAny> = {{}}
  for (const field of ADIR_IDENTIFICATION) {{
    if (field.inputType === 'choice') {{
      shape[field.id] = z.number().int().min(0).max(field.options.length - 1).optional()
    }} else {{
      shape[field.id] = z.string().optional()
    }}
  }}
  for (const field of ADIR_BACKGROUND) {{
    shape[field.id] = z.string().optional()
  }}
{schema_block}
  shape[QUESTIONNAIRE_NOTES_FIELD] = z.string().optional()
  return z.object(shape).strict()
}}

export const adirQuestionnaire = defineQuestionnaire({{
  id: 'adir',
  title: 'ADI-R — Entrevista para autismo',
  description:
    'Autism Diagnostic Interview — Revised (ADI-R). Entrevista estruturada para diagnóstico de autismo (3.ª edição, versão portuguesa).',
  instructions:
    'Conduza a entrevista com o informador seguindo os textos e sondagens de cada item. Registe descrições de comportamento (campo «Detalhes») antes de codificar. Use Actual / Alguma vez / Mais anómalo 4–5 anos conforme indicado no manual.',
  respondent: 'Informador (pais ou cuidador) com clínico',
  responseType: 'likert4',
  items: PRESENTATION_ITEMS,
  meta: {{
    introScript: ADIR_INTRO_SCRIPT,
    identification: ADIR_IDENTIFICATION,
    background: ADIR_BACKGROUND,
    sections: ADIR_SECTIONS,
    timepointLabels: ADIR_TIMEPOINT_LABELS,
    concernsCodes: ADIR_CONCERNS_CODES,
    retroCodes: ADIR_RETRO_CODES,
    lossCodes: ADIR_LOSS_CODES,
    ageHint: ADIR_AGE_HINT,
  }},
}})
"""

OUT.write_text(ts, encoding="utf-8")
print(f"Wrote {OUT}")
print(f"Items parsed: {len(PARSED)}, sections: {len(SECTIONS)}")
print(f"Sample item 11 probes: {len(PARSED['11']['probes'])}, timepoints: {PARSED['11']['timepoints']}")
