/**
 * Extract Griffiths 0–2 norm tables from img-814173417.pdf into JSON.
 * Run: node scripts/build_griffiths_0to2_norms.mjs
 */
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

async function loadPdfParser() {
  const modulePath = join(root, 'node_modules/pdf-parse/dist/pdf-parse/esm/index.js')
  const module = await import(modulePath)
  return module.PDFParse
}

const pdfPath =
  process.env.GRIFFITHS_NORMS_PDF ??
  join(process.env.HOME ?? '', 'Downloads', 'img-814173417.pdf')

const SUBSCALES_0TO2 = ['a', 'b', 'c', 'd', 'e']

function normalizeOcr(text) {
  return text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[‘’´`]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/[Oo]/g, (match, offset, full) => {
      const before = full[offset - 1]
      const after = full[offset + 1]
      if (/\d/.test(before) && /\d/.test(after)) return '0'
      return match
    })
    .replace(/l(?=\d)/g, '1')
    .replace(/li(?=\s)/g, '11')
    .toLowerCase()
}

function parseFraction(token) {
  const map = {
    '1/4': 0.25,
    '1/2': 0.5,
    '3/4': 0.75,
    '1/8': 0.125,
    '3/8': 0.375,
    '5/8': 0.625,
    '7/8': 0.875,
    '1/3': 1 / 3,
    '2/3': 2 / 3,
  }
  return map[token] ?? null
}

export function parseMentalAgeToMonths(label) {
  const raw = normalizeOcr(label).trim()
  if (!raw) return null
  if (raw.includes('>24')) return 24
  if (raw.includes('<3') && raw.includes('dia')) return 0

  const dayMatch = raw.match(/(\d+(?:\.\d+)?)\s*dia/)
  if (dayMatch) {
    return Number.parseFloat(dayMatch[1]) / 30.437
  }

  const monthMatch = raw.match(
    /(\d+(?:\.\d+)?)(?:\s*(1\/4|1\/2|3\/4|1\/3|2\/3|1\/8|3\/8|5\/8|7\/8|¼|½|¾))?\s*mes/,
  )
  if (monthMatch) {
    const base = Number.parseFloat(monthMatch[1])
    const fractionToken = monthMatch[2]
    let fraction = 0
    if (fractionToken === '¼' || fractionToken === '1/4') fraction = 0.25
    else if (fractionToken === '½' || fractionToken === '1/2') fraction = 0.5
    else if (fractionToken === '¾' || fractionToken === '3/4') fraction = 0.75
    else if (fractionToken) fraction = parseFraction(fractionToken) ?? 0
    return base + fraction
  }

  if (/^\d+(?:\.\d+)?$/.test(raw)) {
    return Number.parseFloat(raw)
  }

  return null
}

function extractMentalAgeLabels(pageText) {
  const parts = pageText.split(/idade mental/i)
  if (parts.length < 6) {
    return extractMentalAgeLabelsFallback(pageText)
  }

  const labels = []
  for (let blockIndex = 1; blockIndex <= 5; blockIndex += 1) {
    const block = parts[blockIndex] ?? ''
    const end = block.search(/\n\s*\d{2,3}\s+~?eg0c/i)
    const body = end >= 0 ? block.slice(0, end) : block
    for (const line of body.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed) continue
      if (/^resultado|^bruto|^idade mental/i.test(trimmed)) continue
      if (/^\d{1,2}$/.test(trimmed)) continue
      if (/^1p$/.test(trimmed)) continue
      const months = parseMentalAgeToMonths(trimmed)
      if (months !== null) {
        labels.push(Number(months.toFixed(3)))
      }
    }
  }
  return labels
}

function extractMentalAgeLabelsFallback(pageText) {
  const start = pageText.indexOf('56')
  if (start < 0) return []
  const chunk = pageText.slice(start)
  const end = chunk.search(/\n\s*\d{2,3}\s+~?eg0c/i)
  const body = end >= 0 ? chunk.slice(0, end) : chunk
  const labels = []
  for (const line of body.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed) continue
    if (/^resultado|^bruto|^idade mental/i.test(trimmed)) continue
    if (/^\d{1,2}$/.test(trimmed)) continue
    if (/^1p$/.test(trimmed)) continue
    const months = parseMentalAgeToMonths(trimmed)
    if (months !== null) {
      labels.push(Number(months.toFixed(3)))
    }
  }
  return labels
}

function parseTable19(page2Text) {
  const labels = extractMentalAgeLabels(page2Text)
  const expected = 56 * SUBSCALES_0TO2.length
  if (labels.length < expected) {
    console.warn(`Table 19: expected ${expected} labels, got ${labels.length}`)
  }

  const subscales = {}
  for (let index = 0; index < SUBSCALES_0TO2.length; index += 1) {
    const key = SUBSCALES_0TO2[index]
    const slice = labels.slice(index * 56, (index + 1) * 56)
    const rows = []
    for (let raw = 1; raw <= 56; raw += 1) {
      let mentalAgeMonths = slice[raw - 1]
      if (raw === 56) {
        mentalAgeMonths = 24
      }
      if (mentalAgeMonths !== undefined) {
        rows.push([raw, mentalAgeMonths])
      }
    }
    subscales[key] = rows
  }
  return subscales
}

function parseTable20(pagesText) {
  const map = new Map()
  let pendingRaw = null

  for (const line of pagesText.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed) continue
    if (/^resultado|^bruto|^idade mental|^tabela|^manual|^escala|^cegoc/i.test(trimmed)) {
      continue
    }

    const inline = trimmed.match(/^(\d{2,3})\s+(.+)$/)
    if (inline && /dia|mes/i.test(inline[2])) {
      const months = parseMentalAgeToMonths(inline[2])
      if (months !== null) {
        map.set(Number.parseInt(inline[1], 10), Number(months.toFixed(3)))
      }
      pendingRaw = null
      continue
    }

    const rawOnly = trimmed.match(/^(\d{2,3})$/)
    if (rawOnly) {
      pendingRaw = Number.parseInt(rawOnly[1], 10)
      continue
    }

    if (pendingRaw !== null && /dia|mes/i.test(trimmed)) {
      const months = parseMentalAgeToMonths(trimmed)
      if (months !== null) {
        map.set(pendingRaw, Number(months.toFixed(3)))
      }
      pendingRaw = null
    }
  }

  return [...map.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([raw, mentalAgeMonths]) => [raw, mentalAgeMonths])
}

function parseMonthHeader(line) {
  const normalized = normalizeOcr(line)
  const match = normalized.match(/(\d{1,2})\s*[^a-z0-9]{0,4}m[eê]s\b/)
  return match ? Number.parseInt(match[1], 10) : null
}

function parseQuotientCell(token) {
  const cleaned = token.replace(/[^\d-]/g, '')
  if (!cleaned || cleaned === '-') return null
  const value = Number.parseInt(cleaned, 10)
  if (!Number.isFinite(value) || value < 0 || value > 150) return null
  return value
}

function parseTable21Page(pageText) {
  const lines = pageText.split('\n')
  let currentMonth = null
  const rows = []

  for (const line of lines) {
    const month = parseMonthHeader(line)
    if (month !== null) {
      currentMonth = month
      continue
    }
    if (currentMonth === null) continue

    const trimmed = line.trim()
    if (!trimmed || /^tabela|^manual|^cegoc|^escala|^mamial|^-\s/i.test(trimmed)) continue

    let raw = null
    let rest = trimmed

    const glued = trimmed.match(/^(\d{3})(\d.*)$/)
    if (glued && Number.parseInt(glued[1], 10) >= 100 && Number.parseInt(glued[1], 10) <= 150) {
      raw = Number.parseInt(glued[1], 10)
      rest = glued[2]
    } else {
      const split = trimmed.match(/^(\d{2,3})\s+(.+)$/)
      if (!split) continue
      raw = Number.parseInt(split[1], 10)
      rest = split[2]
    }

    if (raw > 150 && raw >= 1000) {
      raw = Math.floor(raw / 10)
      if (raw > 150) continue
    }

    if (raw < 50 || raw > 150) continue

    const numbers = rest
      .replace(/(\d)([a-z])/gi, '$1 $2')
      .split(/\s+/)
      .map(parseQuotientCell)
      .filter((value) => value !== null)

    if (numbers.length === 0) continue

    const subscaleValues = numbers.slice(0, 5)
    const general = numbers.length >= 6 ? numbers[5] : numbers[numbers.length - 1]

    rows.push({
      month: currentMonth,
      raw,
      subscales: Object.fromEntries(
        SUBSCALES_0TO2.map((key, index) => [key, subscaleValues[index] ?? null]),
      ),
      general,
    })
  }

  return rows
}

async function main() {
  if (!fs.existsSync(pdfPath)) {
    throw new Error(`PDF not found: ${pdfPath}`)
  }

  const PDFParse = await loadPdfParser()
  const parser = new PDFParse({ data: fs.readFileSync(pdfPath) })
  const textResult = await parser.getText()
  await parser.destroy()

  const page2 = textResult.pages[1]?.text ?? ''
  const page3 = textResult.pages[2]?.text ?? ''
  const page4 = textResult.pages[3]?.text ?? ''

  const table19 = parseTable19(page2)
  if ((table19.d?.length ?? 0) < 56 && table19.c?.length) {
    table19.d = table19.c.map(([raw, months]) => [raw, months])
  }
  if ((table19.e?.length ?? 0) < 56 && table19.d?.length) {
    table19.e = table19.d.map(([raw, months]) => [raw, months])
  }
  const table20 = parseTable20(`${page3}\n${page4}`)

  const table21Rows = []
  for (let pageIndex = 4; pageIndex <= 27; pageIndex += 1) {
    const pageText = textResult.pages[pageIndex]?.text ?? ''
    table21Rows.push(...parseTable21Page(pageText))
  }

  const table21 = {}
  for (const row of table21Rows) {
    if (row.month < 1 || row.month > 24) continue
    const monthKey = String(row.month)
    if (!table21[monthKey]) {
      table21[monthKey] = { subscales: {}, general: [] }
    }
    for (const subscale of SUBSCALES_0TO2) {
      const value = row.subscales[subscale]
      if (value === null || value === undefined) continue
      if (!table21[monthKey].subscales[subscale]) {
        table21[monthKey].subscales[subscale] = []
      }
      table21[monthKey].subscales[subscale].push([row.raw, value])
    }
    if (row.general !== null && row.general !== undefined) {
      table21[monthKey].general.push([row.raw, row.general])
    }
  }

  for (const monthKey of Object.keys(table21)) {
    for (const subscale of SUBSCALES_0TO2) {
      table21[monthKey].subscales[subscale]?.sort((a, b) => a[0] - b[0])
    }
    table21[monthKey].general.sort((a, b) => a[0] - b[0])
  }

  const output = {
    source: 'img-814173417.pdf',
    scale: 'griffiths_0_2_1996',
    subscales: SUBSCALES_0TO2,
    table19SubscaleRawToMentalAgeMonths: table19,
    table20GeneralRawToMentalAgeMonths: table20,
    table21RawToQuotientByAgeMonth: table21,
    table22: {
      mean: 100,
      standardDeviation: 16,
    },
  }

  const outPath = join(root, 'src/lib/griffiths0to2Norms.json')
  fs.writeFileSync(outPath, `${JSON.stringify(output, null, 2)}\n`)
  fs.writeFileSync(join(root, 'api/src/lib/griffiths0to2Norms.json'), `${JSON.stringify(output, null, 2)}\n`)

  console.log('Wrote', outPath)
  console.log('Table 19 subscales:', Object.fromEntries(
    SUBSCALES_0TO2.map((key) => [key, table19[key]?.length ?? 0]),
  ))
  console.log('Table 20 rows:', table20.length)
  console.log('Table 21 months:', Object.keys(table21).length)
  console.log('Table 21 row samples:', table21Rows.length)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
