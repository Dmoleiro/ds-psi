import { mkdir, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const PATIENT_DOCUMENTS_UPLOAD_DIR = path.join(__dirname, '../../uploads/patients')

export const PATIENT_DOCUMENT_MAX_BYTES = 10 * 1024 * 1024
const ALLOWED_MIME_TYPES = new Set(['application/pdf'])

function isPdfBuffer(buffer: Buffer): boolean {
  return buffer.length >= 4 && buffer.subarray(0, 4).toString('ascii') === '%PDF'
}

export async function savePatientDocumentBuffer(
  patientId: string,
  buffer: Buffer,
  mimetype: string,
): Promise<string> {
  if (!ALLOWED_MIME_TYPES.has(mimetype) || !isPdfBuffer(buffer)) {
    throw new Error('INVALID_DOCUMENT_TYPE')
  }
  if (buffer.length > PATIENT_DOCUMENT_MAX_BYTES) {
    throw new Error('DOCUMENT_TOO_LARGE')
  }

  const patientDir = path.join(PATIENT_DOCUMENTS_UPLOAD_DIR, patientId)
  await mkdir(patientDir, { recursive: true })

  const filename = `${randomUUID()}.pdf`
  const absolutePath = path.join(patientDir, filename)
  await writeFile(absolutePath, buffer)

  return `${patientId}/${filename}`
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
