#!/usr/bin/env node
/**
 * Generate src/components/picca/modules/vol2/piccaVol2ManualContent.ts
 * from scripts/picca_vol2_manual_extract.txt (extracted from PICCA DS_26 PDF).
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const extractPath = join(__dirname, 'picca_vol2_manual_extract.txt')
const outPath = join(__dirname, '../src/components/picca/modules/vol2/piccaVol2ManualContent.ts')

const CHAPTERS = [
  { number: 1, title: 'Desenvolvimento infantil: conceito e princípios' },
  { number: 2, title: 'Domínios do desenvolvimento' },
  { number: 3, title: 'Idade cronológica, idade corrigida e idade de desenvolvimento' },
  { number: 4, title: 'Desenvolvimento típico, atraso, desvio e regressão' },
  { number: 5, title: 'Variabilidade individual e contexto' },
  { number: 6, title: 'Fatores de risco e fatores de proteção' },
  { number: 7, title: 'Marcos do desenvolvimento e critérios de aquisição' },
  { number: 8, title: 'Sinais de alerta e tomada de decisão clínica' },
  { number: 9, title: 'Princípios de observação e interpretação' },
  { number: 10, title: 'Integração clínica e formulação inicial' },
  { number: 11, title: 'Checklists e grelhas de apoio' },
  { number: 12, title: 'Referências de enquadramento' },
]

function escapeTsString(value) {
  return JSON.stringify(value)
}

function normalizeWhitespace(text) {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .trim()
}

function toParagraphs(raw) {
  let text = raw
  text = text.replace(/☐\s*/g, '\n• ')
  text = text.replace(/\s{2,}/g, ' ')
  text = text.replace(/([.!?])\s+(?=[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ])/g, '$1\n\n')
  text = text.replace(/(\d+\.\d+)\s+/g, '\n\n$1 ')
  return text
    .split(/\n{2,}/)
    .map((p) => normalizeWhitespace(p))
    .filter(Boolean)
    .join('\n\n')
}

const raw = readFileSync(extractPath, 'utf8')
const contentStart = raw.search(
  /1\.\s+Desenvolvimento infantil: conceito e princípios\s+O desenvolvimento infantil/,
)
if (contentStart < 0) {
  console.error('Could not find Vol II chapter 1 body in extract')
  process.exit(1)
}

const prefaceEnd = raw.search(/1\.\s+Desenvolvimento infantil: conceito e princípios/)
const prefaceRaw = raw.slice(0, prefaceEnd).trim()
const bodyText = raw.slice(contentStart)

const preface = toParagraphs(
  prefaceRaw
    .replace(/^Fundamentos do Desenvolvimento Infantil\s*/i, '')
    .replace(/Conteúdos do módulo[\s\S]*$/i, ''),
)

const chapters = []
for (let i = 0; i < CHAPTERS.length; i++) {
  const { number, title } = CHAPTERS[i]
  const heading = `${number}. ${title}`
  const start = bodyText.search(new RegExp(`${number}\\.\\s+${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i'))
  if (start < 0) {
    console.error(`Missing chapter ${number}: ${title}`)
    process.exit(1)
  }
  const next = CHAPTERS[i + 1]
  const end = next
    ? bodyText.search(
        new RegExp(`${next.number}\\.\\s+${next.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i'),
      )
    : bodyText.search(/PICCA\s+Protocolo Integrado de Conceptualização/i)
  const slice = bodyText.slice(start, end > start ? end : undefined)
  const body = toParagraphs(slice.replace(new RegExp(`^${number}\\.\\s+${title}\\s*`, 'i'), ''))
  chapters.push({ number, title, body })
}

const ts = `// Auto-generated from scripts/picca_vol2_manual_extract.txt — run: node scripts/generate_picca_vol2_manual.mjs

export type Vol2ManualChapter = { number: number; title: string; body: string }

export const PICCA_VOL2_MANUAL_TITLE =
  "Manual Clínico dos Marcos do Desenvolvimento (0–6 anos)"

export const PICCA_VOL2_MANUAL_PREFACE = ${escapeTsString(preface)}

export const PICCA_VOL2_MANUAL_CHAPTERS: Vol2ManualChapter[] = [
${chapters
  .map(
    (ch) =>
      `  { number: ${ch.number}, title: ${escapeTsString(ch.title)}, body: ${escapeTsString(ch.body)} },`,
  )
  .join('\n')}
]
`

writeFileSync(outPath, ts, 'utf8')
console.log(`Wrote ${outPath} (${chapters.length} chapters, preface ${preface.length} chars)`)
