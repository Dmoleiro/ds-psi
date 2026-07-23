import type { Multipart } from '@fastify/multipart'

export type ParsedDocumentUpload = {
  buffer: Buffer
  mimetype: string
  originalName: string
}

export async function parseDocumentUpload(
  parts: AsyncIterableIterator<Multipart>,
): Promise<ParsedDocumentUpload> {
  let file: ParsedDocumentUpload | null = null

  for await (const part of parts) {
    if (part.type === 'field') {
      continue
    }

    if (part.fieldname === 'file') {
      file = {
        buffer: await part.toBuffer(),
        mimetype: part.mimetype,
        originalName: part.filename || 'documento',
      }
    } else {
      await part.toBuffer()
    }
  }

  if (!file) {
    throw new Error('FILE_REQUIRED')
  }

  return file
}
