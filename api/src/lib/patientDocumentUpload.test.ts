import { describe, expect, it } from 'vitest'
import { savePatientDocumentBuffer } from './patientDocumentUpload.js'

describe('savePatientDocumentBuffer', () => {
  it('rejects non-pdf files', async () => {
    await expect(
      savePatientDocumentBuffer('patient-1', Buffer.from('not a pdf'), 'application/pdf'),
    ).rejects.toThrow('INVALID_DOCUMENT_TYPE')
  })

  it('rejects non-pdf mime types', async () => {
    await expect(
      savePatientDocumentBuffer('patient-1', Buffer.from('%PDF-1.4'), 'text/plain'),
    ).rejects.toThrow('INVALID_DOCUMENT_TYPE')
  })
})
