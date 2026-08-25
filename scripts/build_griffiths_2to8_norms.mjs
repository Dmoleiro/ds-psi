/**
 * Extract Griffiths 2–8 norm grids from img-814172850.pdf into JSON.
 * Run: node scripts/build_griffiths_2to8_norms.mjs
 */
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { parseMentalAgeToMonths } from './build_griffiths_0to2_norms.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const isMain =
  process.argv[1] &&
  (process.argv[1].endsWith('build_griffiths_2to8_norms.mjs') ||
    process.argv[1].includes('build_griffiths_2to8_norms'))

async function loadPdfParser() {
  const modulePath = join(root, 'node_modules/pdf-parse/dist/pdf-parse/esm/index.js')
  const module = await import(modulePath)
  return module.PDFParse
}

const pdfPath =
  process.env.GRIFFITHS_2TO8_NORMS_PDF ??
  join(process.env.HOME ?? '', 'Downloads', 'img-814172850.pdf')

const SUBSCALES_2TO8 = ['a', 'b', 'c', 'd', 'e', 'f']
const PERCENTILES = [41, 42, 43, 44, 45, 46, 47, 48, 49, 50]

const SUBSCALE_PAGE_RANGES = {
  a: [0, 1, 2],
  b: [3, 4, 5],
  c: [6, 7, 8],
  d: [9, 10, 11],
  e: [12, 14, 15, 17, 18],
  f: [15],
}

const GENERAL_PAGE_RANGES = [18, 19, 20]

function normalizeOcr(text) {
  return text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[‘’´`]/g, "'")
    .replace(/[–—−]/g, '-')
    .replace(/[Oo]/g, (match, offset, full) => {
      const before = full[offset - 1]
      const after = full[offset + 1]
      if (/\d/.test(before) && /\d/.test(after)) return '0'
      return match
    })
    .replace(/[Ss]/g, (match, offset, full) => {
      if (/\d/.test(full[offset - 1]) && /\d/.test(full[offset + 1])) return '5'
      return match
    })
    .replace(/l(?=\d)/g, '1')
    .toLowerCase()
}

function isChronologicalAgeMonths(value) {
  if (!Number.isFinite(value) || value < 24 || value > 96) return false
  const fractional = Math.abs((value * 2) % 1)
  return fractional < 0.001 || Math.abs(fractional - 0.5) < 0.001
}

function parseAgeToken(token) {
  const normalized = normalizeOcr(token).replace(/,/g, '.').trim()
  if (!normalized) return null

  const labelMonths = parseMentalAgeToMonths(normalized)
  if (labelMonths !== null && isChronologicalAgeMonths(labelMonths)) {
    return Number(labelMonths.toFixed(1))
  }

  const digitsOnly = normalized.replace(/[^\d.]/g, '')
  if (!digitsOnly) return null

  if (/^\d{3}$/.test(digitsOnly)) {
    const asTenth = Number.parseInt(digitsOnly, 10) / 10
    if (isChronologicalAgeMonths(asTenth)) {
      return Number(asTenth.toFixed(1))
    }
  }

  if (/^\d{2}$/.test(digitsOnly)) {
    const value = Number.parseInt(digitsOnly, 10)
    if (isChronologicalAgeMonths(value)) {
      return Number(value.toFixed(1))
    }
  }

  const parsed = Number.parseFloat(digitsOnly)
  if (!isChronologicalAgeMonths(parsed)) {
    return null
  }
  return Number(parsed.toFixed(1))
}

function parseIntegerToken(token) {
  const cleaned = normalizeOcr(token).replace(/[^\d-]/g, '')
  if (!cleaned || cleaned === '-') return null
  const value = Number.parseInt(cleaned, 10)
  return Number.isFinite(value) ? value : null
}

function parseDecimalToken(token) {
  const normalized = normalizeOcr(token).replace(/,/g, '.')
  const cleaned = normalized.replace(/[^\d.]/g, '')
  if (!cleaned) return null
  const value = Number.parseFloat(cleaned)
  if (!Number.isFinite(value)) return null
  if (value < 20 || value > 100) return null
  return Number(value.toFixed(1))
}

function parseMentalValueToken(token) {
  const decimal = parseDecimalToken(token)
  if (decimal !== null) return decimal

  const integer = parseIntegerToken(token)
  if (integer === null) return null

  if (integer >= 200 && integer <= 999) {
    return Number((integer / 10).toFixed(1))
  }

  if (integer >= 20 && integer <= 100) {
    return Number(integer.toFixed(1))
  }

  return null
}

function parseRawValueToken(token) {
  const integer = parseIntegerToken(token)
  if (integer === null) return null
  if (integer >= 40 && integer <= 999) return integer
  return null
}

function isHeaderLine(line) {
  return /^manual|^cegoc|^subescala|^escala geral|^idade$|^nota|^percent|^resultado|^bruto|^tabela|^normas|^exemplos|^insucesso|^item |^--|^-$|^\($|^[a-z]\.{2,}$|^[a-z]{1,2}$/i.test(
    line.trim(),
  )
}

function splitTokens(line) {
  return line
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean)
}

function parseAgeBothEndsRow(line) {
  const tokens = splitTokens(line)
  if (tokens.length < 4) return null

  const startAge = parseAgeToken(tokens[0])
  if (startAge === null) return null

  const endAge = parseAgeToken(tokens[tokens.length - 1])
  const hasEndAge = endAge !== null && Math.abs(endAge - startAge) < 0.01
  const middleTokens = tokens.slice(1, hasEndAge ? -1 : undefined)

  return { ageMonths: startAge, middleTokens }
}

function parseRawScoreRow(line) {
  const row = parseAgeBothEndsRow(line)
  if (!row) return null

  const rawScores = row.middleTokens
    .map((token) => parseRawValueToken(token))
    .filter((value) => value !== null)

  if (rawScores.length < 3) return null
  return { ageMonths: row.ageMonths, rawScores }
}

function parseMentalValuesFromTokens(tokens, expectedCount) {
  const values = []
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index]
    if (index === 0 && parseAgeToken(token) !== null) {
      continue
    }
    const mental = parseMentalValueToken(token)
    if (mental !== null) {
      values.push(mental)
    }
  }

  if (values.length < Math.max(3, expectedCount - 4)) {
    return null
  }

  return values.slice(0, expectedCount)
}

function parseSingleLineRawMentalRow(line) {
  const row = parseAgeBothEndsRow(line)
  if (!row || row.middleTokens.length < 3) return null

  const tokens = splitTokens(line)
  const endAge = parseAgeToken(tokens[tokens.length - 1])
  const startAge = parseAgeToken(tokens[0])
  if (endAge === null || startAge === null || Math.abs(endAge - startAge) >= 0.01) {
    return null
  }

  const entries = []
  for (const token of row.middleTokens) {
    const rawScore = parseRawValueToken(token)
    if (rawScore === null || rawScore < 100) continue
    const mentalAgeMonths = Number((rawScore / 10).toFixed(1))
    if (mentalAgeMonths < 20 || mentalAgeMonths > 100) continue
    entries.push([row.ageMonths, rawScore, mentalAgeMonths])
  }

  return entries.length >= 3 ? entries : null
}

function parsePercentileThresholdRow(line) {
  const row = parseAgeBothEndsRow(line)
  if (!row || row.middleTokens.length < 5) return null

  const thresholds = row.middleTokens
    .map((token) => parseMentalValueToken(token))
    .filter((value) => value !== null && value >= 20 && value <= 100)

  if (thresholds.length < 5) return null

  return thresholds.map((rawThreshold, index) => [
    row.ageMonths,
    rawThreshold,
    PERCENTILES[Math.min(index, PERCENTILES.length - 1)],
  ])
}

function parsePercentileMentalRow(line) {
  const row = parseAgeBothEndsRow(line)
  if (!row || row.middleTokens.length < 5) return null

  const mentalAges = row.middleTokens
    .map((token) => parseMentalValueToken(token))
    .filter((value) => value !== null && value >= 20 && value <= 100)

  if (mentalAges.length < 5) return null

  return mentalAges.map((mentalAgeMonths, index) => [
    row.ageMonths,
    PERCENTILES[Math.min(index, PERCENTILES.length - 1)],
    mentalAgeMonths,
  ])
}

function buildSubscaleEntriesFromPercentiles(thresholdRows, mentalRows) {
  const mentalByAgePercentile = new Map()
  for (const [ageMonths, percentile, mentalAgeMonths] of mentalRows) {
    mentalByAgePercentile.set(`${ageMonths}|${percentile}`, mentalAgeMonths)
  }

  const entries = []
  for (const [ageMonths, threshold, percentile] of thresholdRows) {
    const mentalAgeMonths = mentalByAgePercentile.get(`${ageMonths}|${percentile}`)
    if (mentalAgeMonths !== undefined) {
      entries.push([ageMonths, threshold, mentalAgeMonths])
    }
  }

  const thresholdByAge = new Map()
  for (const [ageMonths, threshold, percentile] of thresholdRows) {
    if (!thresholdByAge.has(ageMonths)) thresholdByAge.set(ageMonths, [])
    thresholdByAge.get(ageMonths).push([threshold, percentile])
  }

  for (const [ageMonths, pairs] of thresholdByAge.entries()) {
    pairs.sort((a, b) => a[0] - b[0])
    for (const [rawScore, percentile] of pairs) {
      const mentalAgeMonths = mentalByAgePercentile.get(`${ageMonths}|${percentile}`)
      if (mentalAgeMonths !== undefined) {
        entries.push([ageMonths, rawScore, mentalAgeMonths])
      }
    }
  }

  return mergeGridEntries(entries)
}

function mergeGridEntries(entries) {
  const map = new Map()
  for (const [ageMonths, rawScore, mentalAgeMonths] of entries) {
    const key = `${ageMonths}|${rawScore}`
    map.set(key, [ageMonths, rawScore, mentalAgeMonths])
  }
  return [...map.values()].sort((a, b) => a[0] - b[0] || a[1] - b[1])
}

function parsePageAgeBand(pageText) {
  const header = normalizeOcr(pageText.split('\n').slice(0, 4).join(' '))
  const match = header.match(/(\d+(?:\.\d)?)\s*-\s*(\d+(?:\.\d)?)\s*mes/)
  if (!match) return null
  return `${match[1]}-${match[2]}`
}

function parseOcrRawToken(token) {
  const cleaned = token.replace(/[^\d]/g, '')
  if (!cleaned) return null
  const parsed = Number.parseInt(cleaned, 10)
  if (!Number.isFinite(parsed)) return null
  if (cleaned.length >= 3) return Number((parsed / 10).toFixed(2))
  return parsed
}

function sanitizeMedianRows(rows) {
  const sorted = [...rows].sort((a, b) => a[0] - b[0])
  const cleaned = []
  for (const row of sorted) {
    if (!cleaned.length) {
      cleaned.push(row)
      continue
    }
    const previous = cleaned[cleaned.length - 1]
    if (row[0] === previous[0]) continue
    if (row[1] < previous[1] - 1.5) continue
    cleaned.push(row)
  }
  return cleaned
}

function parseMedianColumnRowsLegacy(pageText) {
  const entries = []
  for (const line of pageText.split('\n')) {
    const trimmed = line.trim()
    const match = trimmed.match(/^(\d{2}(?:\.\d)?)\s+([\d\s.~,]+)$/)
    if (!match) continue

    const ageMonths = Number.parseFloat(match[1])
    if (!isChronologicalAgeMonths(ageMonths)) continue

    const tokens = match[2]
      .split(/\s+/)
      .map((token) => token.replace(/[^\d.]/g, ''))
      .filter(Boolean)
    const numericTokens = tokens
      .map((token) => Number.parseFloat(token))
      .filter((value) => Number.isFinite(value) && value >= 20)

    if (numericTokens.length < 3) continue

    const lastToken = numericTokens[numericTokens.length - 1]
    const medianRaw = lastToken >= 100 ? Number((lastToken / 10).toFixed(2)) : lastToken
    if (medianRaw < 20 || medianRaw > 100) continue

    entries.push([Number(ageMonths.toFixed(1)), medianRaw])
  }

  return entries
}

function parseMedianColumnRowsFromDigitLines(pageText) {
  const entries = []

  for (const line of pageText.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed) continue

    const startMatch = trimmed.match(/^(\d{2}(?:\.\d)?)\s+(.*)$/)
    if (!startMatch) continue

    const ageMonths = Number.parseFloat(startMatch[1])
    if (!isChronologicalAgeMonths(ageMonths)) continue

    let rest = startMatch[2].replace(/\s+\d{2}(?:\.\d)?\s*$/, '')
    const digitChunks = rest.match(/\d{3,4}|\d{1,2}(?:\.\d)?/g) ?? []
    const rawValues = []

    for (const chunk of digitChunks) {
      if (chunk.includes('.')) {
        const value = Number.parseFloat(chunk)
        if (Number.isFinite(value) && value >= 20 && value <= 100) {
          rawValues.push(value)
        }
        continue
      }

      const value = parseOcrRawToken(chunk)
      if (value !== null && value >= 20 && value <= 100) {
        rawValues.push(value)
      }
    }

    if (rawValues.length < 8) continue

    const medianIndex = rawValues.length >= 10 ? 9 : rawValues.length - 1
    const medianRaw = rawValues[medianIndex]
    entries.push([Number(ageMonths.toFixed(1)), medianRaw])
  }

  return entries
}

/** Rows are chronological ages; column 50 (z=0) holds the median raw score at that age. */
function parseMedianColumnRows(pageText) {
  const map = new Map()
  for (const [ageMonths, medianRaw] of [
    ...parseMedianColumnRowsLegacy(pageText),
    ...parseMedianColumnRowsFromDigitLines(pageText),
  ]) {
    map.set(ageMonths, medianRaw)
  }

  return sanitizeMedianRows([...map.entries()])
}

function mergeMedianRows(rows) {
  const map = new Map(rows)
  return [...map.entries()].sort((a, b) => a[0] - b[0])
}

export function parseGriffiths28GridPage(pageText, { mode = 'general' } = {}) {
  const entries = []
  const percentileThresholds = []
  const percentileMentalAges = []
  const lines = pageText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !isHeaderLine(line))

  let pendingRaw = null

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]

    const singleLineEntries = parseSingleLineRawMentalRow(line)
    if (singleLineEntries) {
      entries.push(...singleLineEntries)
      pendingRaw = null
      continue
    }

    if (mode === 'subscale') {
      const thresholdRow = parsePercentileThresholdRow(line)
      if (thresholdRow) {
        percentileThresholds.push(...thresholdRow)
        pendingRaw = null
        continue
      }

      const mentalPercentileRow = parsePercentileMentalRow(line)
      if (mentalPercentileRow) {
        percentileMentalAges.push(...mentalPercentileRow)
        pendingRaw = null
        continue
      }
    }

    const rawRow = parseRawScoreRow(line)
    if (rawRow) {
      const nextLine = lines[index + 1] ?? ''
      const mentalValues = parseMentalValuesFromTokens(splitTokens(nextLine), rawRow.rawScores.length)
      if (mentalValues) {
        const pairCount = Math.min(rawRow.rawScores.length, mentalValues.length)
        for (let cellIndex = 0; cellIndex < pairCount; cellIndex += 1) {
          entries.push([
            rawRow.ageMonths,
            rawRow.rawScores[cellIndex],
            mentalValues[cellIndex],
          ])
        }
        index += 1
        pendingRaw = null
        continue
      }

      pendingRaw = rawRow
      continue
    }

    if (pendingRaw) {
      const mentalValues = parseMentalValuesFromTokens(splitTokens(line), pendingRaw.rawScores.length)
      if (mentalValues) {
        const pairCount = Math.min(pendingRaw.rawScores.length, mentalValues.length)
        for (let cellIndex = 0; cellIndex < pairCount; cellIndex += 1) {
          entries.push([
            pendingRaw.ageMonths,
            pendingRaw.rawScores[cellIndex],
            mentalValues[cellIndex],
          ])
        }
      }
      pendingRaw = null
    }
  }

  if (mode === 'subscale' && percentileThresholds.length > 0 && percentileMentalAges.length > 0) {
    entries.push(...buildSubscaleEntriesFromPercentiles(percentileThresholds, percentileMentalAges))
  }

  if (mode === 'subscale' && entries.length === 0 && percentileMentalAges.length > 0) {
    for (const [ageMonths, percentile, mentalAgeMonths] of percentileMentalAges) {
      entries.push([ageMonths, percentile * 10, mentalAgeMonths])
    }
  }

  return mergeGridEntries(entries)
}

function buildGridFromPages(pages, mode) {
  const entries = []
  for (const pageText of pages) {
    entries.push(...parseGriffiths28GridPage(pageText, { mode }))
  }
  return mergeGridEntries(entries)
}

async function main() {
  if (!fs.existsSync(pdfPath)) {
    throw new Error(`PDF not found: ${pdfPath}`)
  }

  const PDFParse = await loadPdfParser()
  const parser = new PDFParse({ data: fs.readFileSync(pdfPath) })
  const textResult = await parser.getText()
  await parser.destroy()

  const tableSubscaleRawToMentalAgeMonths = {}
  const tableSubscaleMedianRawByMentalAgeMonths = {}
  for (const subscale of SUBSCALES_2TO8) {
    const pageIndexes = SUBSCALE_PAGE_RANGES[subscale] ?? []
    const pages = pageIndexes.map((index) => textResult.pages[index]?.text ?? '')
    tableSubscaleRawToMentalAgeMonths[subscale] = buildGridFromPages(pages, 'subscale')

    const bandMedians = {}
    for (const pageIndex of pageIndexes) {
      const pageText = textResult.pages[pageIndex]?.text ?? ''
      const band = parsePageAgeBand(pageText)
      if (!band) continue
      const medianRows = parseMedianColumnRows(pageText)
      if (medianRows.length === 0) continue
      bandMedians[band] = mergeMedianRows([
        ...(bandMedians[band] ?? []),
        ...medianRows,
      ])
    }
    tableSubscaleMedianRawByMentalAgeMonths[subscale] = bandMedians
  }

  const generalPages = GENERAL_PAGE_RANGES.map((index) => textResult.pages[index]?.text ?? '')
  const tableGeneralRawToMentalAgeMonths = buildGridFromPages(generalPages, 'general')

  const tableGeneralMedianRawByMentalAgeMonths = {}
  for (const pageIndex of GENERAL_PAGE_RANGES) {
    const pageText = textResult.pages[pageIndex]?.text ?? ''
    const band = parsePageAgeBand(pageText)
    if (!band) continue
    const medianRows = parseMedianColumnRows(pageText)
    if (medianRows.length === 0) continue
    tableGeneralMedianRawByMentalAgeMonths[band] = mergeMedianRows([
      ...(tableGeneralMedianRawByMentalAgeMonths[band] ?? []),
      ...medianRows,
    ])
  }

  const output = {
    source: 'img-814172850.pdf',
    scale: 'griffiths_2_8',
    subscales: SUBSCALES_2TO8,
    lookupDimensions: ['chronologicalAgeMonths', 'rawScore'],
    tableSubscaleRawToMentalAgeMonths,
    tableGeneralRawToMentalAgeMonths,
    tableSubscaleMedianRawByMentalAgeMonths,
    tableGeneralMedianRawByMentalAgeMonths,
    notes: [
      '2–8 developmental mental age: inverse lookup on subscale median column (z=0) per IC age band; row = chronological age.',
      '2–8 quociente parcial (QDA) per subescala: (idade desenvolvimento ÷ IC) × 100.',
      '0–2 global mental age uses Table 20 on the sum of subescala totals (see griffiths0to2Norms.json).',
      'Subescala F only has a 24–47.5 months table in this PDF; 48–96 months is not present.',
    ],
  }

  const outPath = join(root, 'src/lib/griffiths2to8Norms.json')
  fs.writeFileSync(outPath, `${JSON.stringify(output, null, 2)}\n`)
  fs.writeFileSync(join(root, 'api/src/lib/griffiths2to8Norms.json'), `${JSON.stringify(output, null, 2)}\n`)

  console.log('Wrote', outPath)
  console.log(
    'Subscale grid sizes:',
    Object.fromEntries(
      SUBSCALES_2TO8.map((key) => [key, tableSubscaleRawToMentalAgeMonths[key]?.length ?? 0]),
    ),
  )
  console.log('General grid size:', tableGeneralRawToMentalAgeMonths.length)
  console.log(
    'Subscale median bands:',
    Object.fromEntries(
      SUBSCALES_2TO8.map((key) => [
        key,
        Object.fromEntries(
          Object.entries(tableSubscaleMedianRawByMentalAgeMonths[key] ?? {}).map(([band, rows]) => [
            band,
            rows.length,
          ]),
        ),
      ]),
    ),
  )
  console.log(
    'General median bands:',
    Object.fromEntries(
      Object.entries(tableGeneralMedianRawByMentalAgeMonths).map(([band, rows]) => [band, rows.length]),
    ),
  )
}

if (isMain) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}

export {
  parseMentalValueToken,
  parseMedianColumnRows,
  parseSingleLineRawMentalRow,
  parseRawScoreRow,
  parseMentalValuesFromTokens,
  splitTokens,
}
