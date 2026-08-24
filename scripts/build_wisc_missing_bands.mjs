#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const fragment = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'wisc_missing_bands_fragment.json'), 'utf8'),
)

function parseCell(cell) {
  if (cell === null || cell === undefined || cell === '-') return null
  const trimmed = String(cell).trim()
  if (!trimmed) return null
  if (trimmed.includes('-')) {
    const [a, b] = trimmed.split('-').map((v) => Number(v.trim()))
    return [a, b]
  }
  const value = Number(trimmed)
  return [value, value]
}

function cellsToRanges(cells) {
  const ranges = []
  cells.forEach((cell, index) => {
    const parsed = parseCell(cell)
    if (!parsed) return
    ranges.push([parsed[0], parsed[1], index + 1])
  })
  return ranges
}

function normalizeBand(band) {
  const subtests = {}
  for (const [key, cells] of Object.entries(band.subtests)) {
    subtests[key] = cellsToRanges(cells)
  }
  return {
    years: band.years,
    monthsFrom: band.monthsFrom,
    monthsTo: band.monthsTo,
    subtests,
  }
}

const newBands = fragment.bands.map(normalizeBand)

for (const target of ['api/src/lib/wiscIiiNorms.json', 'src/lib/wiscIiiNorms.json']) {
  const path = join(root, target)
  const norms = JSON.parse(readFileSync(path, 'utf8'))
  const bands = norms.ageBands.filter(
    (band) =>
      !newBands.some(
        (item) =>
          item.years === band.years &&
          item.monthsFrom === band.monthsFrom &&
          item.monthsTo === band.monthsTo,
      ),
  )

  const merged = [...bands, ...newBands].sort((a, b) => {
    if (a.years !== b.years) return a.years - b.years
    return a.monthsFrom - b.monthsFrom
  })

  norms.ageBands = merged
  writeFileSync(path, `${JSON.stringify(norms)}\n`)
  console.log(`Updated ${target} (${merged.length} age bands)`)
}
