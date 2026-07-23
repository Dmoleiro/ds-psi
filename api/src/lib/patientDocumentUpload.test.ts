import { describe, expect, it } from 'vitest'
import { detectPatientDocumentMimeType, savePatientDocumentBuffer } from './patientDocumentUpload.js'

describe('detectPatientDocumentMimeType', () => {
  it('accepts pdf files', () => {
    expect(detectPatientDocumentMimeType(Buffer.from('%PDF-1.4'), 'application/pdf')).toBe(
      'application/pdf',
    )
  })

  it('accepts jpeg files', () => {
    expect(
      detectPatientDocumentMimeType(Buffer.from([0xff, 0xd8, 0xff, 0xe0]), 'image/jpeg'),
    ).toBe('image/jpeg')
  })

  it('rejects mismatched content and mime type', () => {
    expect(detectPatientDocumentMimeType(Buffer.from('not a pdf'), 'application/pdf')).toBeNull()
    expect(detectPatientDocumentMimeType(Buffer.from('%PDF-1.4'), 'text/plain')).toBeNull()
  })
})

describe('savePatientDocumentBuffer', () => {
  it('rejects invalid files', async () => {
    await expect(
      savePatientDocumentBuffer('patient-1', Buffer.from('not a pdf'), 'application/pdf'),
    ).rejects.toThrow('INVALID_DOCUMENT_TYPE')
  })
})
