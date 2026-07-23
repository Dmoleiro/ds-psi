import { mkdir, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const PATIENT_DOCUMENTS_UPLOAD_DIR = path.join(__dirname, '../../uploads/patients')

export const PATIENT_DOCUMENT_MAX_BYTES = 10 * 1024 * 1024

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
])

const EXTENSION_BY_MIME: Record<string, string> = {
  'application/pdf': '.pdf',
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
}

function isPdfBuffer(buffer: Buffer): boolean {
  return buffer.length >= 4 && buffer.subarray(0, 4).toString('ascii') === '%PDF'
}

function isJpegBuffer(buffer: Buffer): boolean {
  return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff
}

function isPngBuffer(buffer: Buffer): boolean {
  return buffer.length >= 4 && buffer.subarray(0, 4).toString('hex') === '89504e47'
}

function isGifBuffer(buffer: Buffer): boolean {
  return (
    buffer.length >= 6 &&
    (buffer.subarray(0, 6).toString('ascii') === 'GIF87a' ||
      buffer.subarray(0, 6).toString('ascii') === 'GIF89a')
  )
}

function isWebpBuffer(buffer: Buffer): boolean {
  return (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  )
}

export function detectPatientDocumentMimeType(buffer: Buffer, mimetype: string): string | null {
  if (!ALLOWED_MIME_TYPES.has(mimetype)) return null

  switch (mimetype) {
    case 'application/pdf':
      return isPdfBuffer(buffer) ? mimetype : null
    case 'image/jpeg':
      return isJpegBuffer(buffer) ? mimetype : null
    case 'image/png':
      return isPngBuffer(buffer) ? mimetype : null
    case 'image/gif':
      return isGifBuffer(buffer) ? mimetype : null
    case 'image/webp':
      return isWebpBuffer(buffer) ? mimetype : null
    default:
      return null
  }
}

export async function savePatientDocumentBuffer(
  patientId: string,
  buffer: Buffer,
  mimetype: string,
): Promise<{ storagePath: string; mimeType: string }> {
  const detectedMimeType = detectPatientDocumentMimeType(buffer, mimetype)
  if (!detectedMimeType) {
    throw new Error('INVALID_DOCUMENT_TYPE')
  }
  if (buffer.length > PATIENT_DOCUMENT_MAX_BYTES) {
    throw new Error('DOCUMENT_TOO_LARGE')
  }

  const patientDir = path.join(PATIENT_DOCUMENTS_UPLOAD_DIR, patientId)
  await mkdir(patientDir, { recursive: true })

  const extension = EXTENSION_BY_MIME[detectedMimeType] ?? '.bin'
  const filename = `${randomUUID()}${extension}`
  const absolutePath = path.join(patientDir, filename)
  await writeFile(absolutePath, buffer)

  return {
    storagePath: `${patientId}/${filename}`,
    mimeType: detectedMimeType,
  }
}

export function getAbsoluteDocumentPath(storagePath: string): string {
  const normalized = path.normalize(storagePath).replace(/^(\.\.(\/|\\|$))+/, '')
  const absolutePath = path.join(PATIENT_DOCUMENTS_UPLOAD_DIR, normalized)
  if (!absolutePath.startsWith(PATIENT_DOCUMENTS_UPLOAD_DIR)) {
    throw new Error('INVALID_STORAGE_PATH')
  }
  return absolutePath
}

export async function deletePatientDocumentFile(storagePath: string): Promise<void> {
  const absolutePath = getAbsoluteDocumentPath(storagePath)
  await unlink(absolutePath).catch(() => undefined)
}

export function isImageMimeType(mimeType: string): boolean {
  return mimeType.startsWith('image/')
}
