import fs from 'node:fs'
import zlib from 'node:zlib'

const pdf = fs.readFileSync(new URL('./portage.pdf', import.meta.url))
const binary = pdf.toString('binary')
const parts = []
const streamRe = /stream\r?\n([\s\S]*?)\r?\nendstream/g
const textRe = /\(([^()\\]*(?:\\.[^()\\]*)*)\)/g

let match
while ((match = streamRe.exec(binary)) !== null) {
  try {
    const inflated = zlib.inflateSync(Buffer.from(match[1], 'binary'))
    const stream = inflated.toString('latin1')
    let textMatch
    while ((textMatch = textRe.exec(stream)) !== null) {
      const value = textMatch[1]
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\\(/g, '(')
        .replace(/\\\)/g, ')')
        .replace(/\\\\/g, '\\')
      if (value.length > 2 && /[A-Za-zÀ-ÿ]/.test(value)) {
        parts.push(value)
      }
    }
  } catch {
    // skip non-flate streams
  }
}

const text = parts.join('\n')
fs.writeFileSync(new URL('./portage-extract.txt', import.meta.url), text)
console.log(`extracted ${parts.length} chunks, ${text.length} chars`)
console.log(text.slice(0, 400))
