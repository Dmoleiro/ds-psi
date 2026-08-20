#!/usr/bin/env node
/**
 * Extract plain text from scripts/picca_ds26.pdf for diffing and content generation.
 * Usage: node scripts/extract_ds26.mjs [pdfPath] [outPath]
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pdfPath = process.argv[2] ?? join(__dirname, 'picca_ds26.pdf')
const outPath = process.argv[3] ?? join(__dirname, 'picca_ds26_extract.txt')

const data = new Uint8Array(readFileSync(pdfPath))
const doc = await getDocument({ data, useSystemFonts: true }).promise

const pages = []
for (let i = 1; i <= doc.numPages; i++) {
  const page = await doc.getPage(i)
  const content = await page.getTextContent()
  const text = content.items.map((item) => ('str' in item ? item.str : '')).join(' ')
  pages.push(text)
}

writeFileSync(outPath, pages.join('\n'), 'utf8')
console.log(`Extracted ${doc.numPages} pages (${pages.join('').length} chars) → ${outPath}`)
