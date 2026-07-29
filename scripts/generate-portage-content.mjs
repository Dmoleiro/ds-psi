import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const extractPath = path.join(__dirname, 'portage-extract.txt')
const outPath = path.join(__dirname, '../src/components/picca/interactive/portage/piccaPortageContent.ts')

const DOMAIN_MAP = {
  SOCIALIZAÇÃO: { id: 'socializacao', title: 'Socialização' },
  LINGUAGEM: { id: 'linguagem', title: 'Linguagem' },
  COGNIÇÃO: { id: 'cognicao', title: 'Cognição' },
  'AUTO CUIDADOS': { id: 'auto_cuidados', title: 'Auto cuidados' },
  'DESENVOLVIMENTO MOTOR': { id: 'desenvolvimento_motor', title: 'Desenvolvimento Motor' },
}

const AGE_BAND_RE =
  /^(Socialização|Linguagem|Cognição|Auto cuidados|Desenvolvimento Motor)\s*[–-]\s*(.+)$/i
const ITEM_RE = /^(\d{1,3})([A-Za-zÀ-ÿ"“].*)$/

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
}

function parseExtract(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  const domains = []
  let currentDomain = null
  let currentBand = null

  for (const line of lines) {
    if (line.startsWith('PICCA |') || line.startsWith('Guia Portage') || line.startsWith('-- ')) {
      continue
    }
    if (
      line.startsWith('N.º') ||
      line === 'AV Observações' ||
      line.startsWith('S - Sim') ||
      line.startsWith('Orientação:') ||
      line.startsWith('Organização do Inventário') ||
      line.startsWith('') ||
      line.startsWith('Orientações de utilização') ||
      line.startsWith('Autoria e') ||
      line.startsWith('Autor:') ||
      line.startsWith('Título:') ||
      line.startsWith('Nota editorial:') ||
      line.startsWith('A escala Portage') ||
      line.startsWith('Nome do educando') ||
      line.startsWith('Data de nascimento') ||
      line.startsWith('Diagnóstico:') ||
      line.startsWith('Avaliador') ||
      line.startsWith('Legenda de registo') ||
      line.startsWith('Apresentação gráfica') ||
      line === 'PICCA' ||
      line === 'Guia Portage de Educação Pré-Escolar'
    ) {
      continue
    }

    const domainHeader = DOMAIN_MAP[line]
    if (domainHeader) {
      currentDomain = {
        id: domainHeader.id,
        title: domainHeader.title,
        ageBands: [],
      }
      domains.push(currentDomain)
      currentBand = null
      continue
    }

    const bandMatch = line.match(AGE_BAND_RE)
    if (bandMatch && currentDomain) {
      const ageLabel = bandMatch[2].trim()
      currentBand = {
        id: `${currentDomain.id}_${slugify(ageLabel)}`,
        ageLabel,
        items: [],
      }
      currentDomain.ageBands.push(currentBand)
      continue
    }

    const itemMatch = line.match(ITEM_RE)
    if (itemMatch && currentBand) {
      const number = Number(itemMatch[1])
      currentBand.items.push({
        id: `item_${number}`,
        number,
        label: itemMatch[2].trim(),
      })
      continue
    }

    if (
      currentBand?.items.length &&
      !line.startsWith('PICCA') &&
      !line.startsWith('Guia Portage') &&
      !line.startsWith('N.º')
    ) {
      const last = currentBand.items[currentBand.items.length - 1]
      last.label = `${last.label} ${line}`.trim()
    }
  }

  return domains
}

function emitTs(domains) {
  const itemCount = domains.reduce(
    (sum, domain) => sum + domain.ageBands.reduce((s, band) => s + band.items.length, 0),
    0,
  )

  return `// Auto-generated from Guia_Portage_Formato_PICCA.pdf (${itemCount} items)

export type PortageItem = { id: string; number: number; label: string }
export type PortageAgeBand = { id: string; ageLabel: string; items: PortageItem[] }
export type PortageDomain = { id: string; title: string; ageBands: PortageAgeBand[] }

export const PICCA_PORTAGE_GUIDANCE = [
  'Marque o resultado com base no Manual do Inventário Operacionalizado Portage.',
  'S — Sim (alcançou) · N — Não (ainda não alcançou) · AV — Às vezes',
  'Selecionar como prioritários os objetivos ainda não alcançados.',
  'Reforçar os objetivos assinalados como «Às vezes» até à sua consolidação.',
  'Rever periodicamente o perfil e substituir os objetivos alcançados por novos objetivos funcionais.',
] as const

export const PICCA_PORTAGE_USAGE_NOTES = [
  'Manter o reforço das competências já adquiridas e favorecer a sua generalização.',
  'Selecionar objetivos funcionais de diferentes áreas, ajustados às necessidades atuais da criança.',
  'Não restringir a intervenção aos itens do inventário; integrar dificuldades emergentes e interesses da criança.',
  'Respeitar a individualidade, o ritmo de desenvolvimento e os contextos de participação de cada criança.',
] as const

export const PICCA_PORTAGE_DOMAINS: PortageDomain[] = ${JSON.stringify(domains, null, 2)}

export const PICCA_PORTAGE_ITEM_COUNT = ${itemCount}
`
}

const text = fs.readFileSync(extractPath, 'utf8')
const domains = parseExtract(text)
fs.writeFileSync(outPath, emitTs(domains))
console.log(`Wrote ${outPath} (${domains.length} domains)`)
