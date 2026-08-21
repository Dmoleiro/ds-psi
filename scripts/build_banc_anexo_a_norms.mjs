/**
 * Builds bancAnexoANorms.json from transcribed Anexo A tables (ages 5–15).
 *
 * Source: scripts/banc_anexo_a_fragments/*.json
 * Run: node scripts/build_banc_anexo_a_norms.mjs
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const fragmentsDir = join(root, 'scripts/banc_anexo_a_fragments')

const ALL_MEASURE_KEYS = [
  'teste_orientacao',
  'reconhecimento_imediato',
  'reconhecimento_diferido',
  'nomeacao_rapida_cores',
  'nomeacao_rapida_fc',
  'nomeacao_rapida_digitos',
  'fluencia_fonemica',
  'fluencia_semantica',
  'memoria_historias_ei',
  'memoria_historias_ed',
  'memoria_historias_rd',
  'torre_ensaios',
  'torre_problemas_sucesso',
  'torre_problemas_1_ensaio',
  'cancelamento_sinais',
  'fc_rey_copia',
  'fc_rey_edic',
  'fc_rey_edil',
  'compreensao_instrucoes',
  'cf_eliminacao',
  'cf_substituicao',
  'lista_palavras_ei',
  'lista_palavras_ta',
  'lista_palavras_interferencia',
  'lista_palavras_edic',
  'lista_palavras_edil',
  'lista_palavras_rd',
  'trilhas_a',
  'trilhas_b',
  'tabuleiro_corsi',
  'motricidade_mao_dominante',
  'motricidade_mao_nao_dominante',
  'motricidade_ambas_maos',
]

function parseNumber(value) {
  return Number.parseFloat(String(value).trim().replace(',', '.'))
}

/** Parse manual table cell → [minRb, maxRb] for a given RP row */
function parseCell(text) {
  const raw = String(text).trim()
  if (!raw || raw === '-' || raw === '—') return null

  if (raw.startsWith('≤') || raw.startsWith('<=')) {
    const value = parseNumber(raw.replace(/[^\d.,-]/g, ''))
    return Number.isFinite(value) ? [-9999, value] : null
  }
  if (raw.startsWith('≥') || raw.startsWith('>=')) {
    const value = parseNumber(raw.replace(/[^\d.,-]/g, ''))
    return Number.isFinite(value) ? [value, 9999] : null
  }
  if (raw.startsWith('<') && !raw.startsWith('<=')) {
    const value = parseNumber(raw.slice(1))
    return Number.isFinite(value) ? [-9999, value - 0.001] : null
  }
  if (raw.startsWith('>') && !raw.startsWith('>=')) {
    const value = parseNumber(raw.slice(1))
    return Number.isFinite(value) ? [value + 0.001, 9999] : null
  }

  if (/\s+a\s+/i.test(raw)) {
    const [left, right] = raw.split(/\s+a\s+/i)
    const min = parseNumber(left)
    const max = parseNumber(right)
    if (Number.isFinite(min) && Number.isFinite(max)) {
      return [Math.min(min, max), Math.max(min, max)]
    }
  }

  const rangeMatch = raw.match(/^(-?\d+(?:[.,]\d+)?)\s*-\s*(-?\d+(?:[.,]\d+)?)$/)
  if (rangeMatch) {
    const min = parseNumber(rangeMatch[1])
    const max = parseNumber(rangeMatch[2])
    if (Number.isFinite(min) && Number.isFinite(max)) {
      return [Math.min(min, max), Math.max(min, max)]
    }
  }

  const single = parseNumber(raw)
  if (Number.isFinite(single)) return [single, single]
  return null
}

function mergeRanges(ranges) {
  if (ranges.length === 0) return []
  ranges.sort((a, b) => a[0] - b[0] || a[2] - b[2])
  const out = []
  for (const entry of ranges) {
    const last = out[out.length - 1]
    if (last && last[2] === entry[2] && entry[0] <= last[1] + 0.001) {
      last[1] = Math.max(last[1], entry[1])
    } else {
      out.push([...entry])
    }
  }
  return out
}

function buildRangesFromTable(measureTable) {
  if (!measureTable) return []
  const ranges = []
  for (let rp = 1; rp <= 19; rp++) {
    const cell = measureTable[String(rp)] ?? measureTable[rp]
    if (!cell) continue
    const parsed = parseCell(cell)
    if (!parsed) continue
    const min = Math.round(parsed[0] * 1000) / 1000
    const max = Math.round(parsed[1] * 1000) / 1000
    ranges.push([min, max, rp])
  }
  return mergeRanges(ranges)
}

function loadSourceTables() {
  const source = {}
  for (const file of readdirSync(fragmentsDir).filter((name) => name.endsWith('.json'))) {
    const data = JSON.parse(readFileSync(join(fragmentsDir, file), 'utf8'))
    for (const [ageKey, measures] of Object.entries(data)) {
      source[ageKey] = { ...(source[ageKey] ?? {}), ...measures }
    }
  }
  return source
}

const source = loadSourceTables()
const ageBands = []

for (let years = 5; years <= 15; years++) {
  const ageTables = source[String(years)] ?? {}
  const measures = {}

  for (const measureKey of ALL_MEASURE_KEYS) {
    const ranges = buildRangesFromTable(ageTables[measureKey])
    if (ranges.length > 0) {
      measures[measureKey] = ranges
    }
  }

  ageBands.push({ years, measures })
}

const output = { ageBands }
const outPath = join(root, 'src/lib/bancAnexoANorms.json')
writeFileSync(outPath, `${JSON.stringify(output, null, 2)}\n`)
writeFileSync(join(root, 'api/src/lib/bancAnexoANorms.json'), `${JSON.stringify(output, null, 2)}\n`)

const summary = ageBands.map(({ years, measures }) => ({
  years,
  measures: Object.keys(measures).length,
  orientacao: measures.teste_orientacao?.length ?? 0,
}))
console.log('Wrote', outPath)
console.table(summary)
