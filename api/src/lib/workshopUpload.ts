import { mkdir, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const WORKSHOPS_UPLOAD_DIR = path.join(__dirname, '../../uploads/workshops')

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const MAX_FILE_BYTES = 5 * 1024 * 1024

const EXTENSION_BY_MIME: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
}

export async function saveWorkshopImageBuffer(buffer: Buffer, mimetype: string): Promise<string> {
  if (!ALLOWED_MIME_TYPES.has(mimetype)) {
    throw new Error('INVALID_IMAGE_TYPE')
  }
  if (buffer.length > MAX_FILE_BYTES) {
    throw new Error('IMAGE_TOO_LARGE')
  }

  await mkdir(WORKSHOPS_UPLOAD_DIR, { recursive: true })

  const extension = EXTENSION_BY_MIME[mimetype] ?? '.jpg'
  const filename = `${randomUUID()}${extension}`
  const absolutePath = path.join(WORKSHOPS_UPLOAD_DIR, filename)

  await writeFile(absolutePath, buffer)

  return `/uploads/workshops/${filename}`
}

export async function deleteWorkshopImage(imagePath: string): Promise<void> {
  if (!imagePath.startsWith('/uploads/workshops/')) return
  const filename = path.basename(imagePath)
  const absolutePath = path.join(WORKSHOPS_UPLOAD_DIR, filename)
  await unlink(absolutePath).catch(() => undefined)
}
