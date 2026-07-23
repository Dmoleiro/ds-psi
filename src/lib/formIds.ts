export const DOCUMENT_UPLOAD_FORM_ID = 'anexar-documentos'

export function isDocumentUploadForm(formId: string): boolean {
  return formId === DOCUMENT_UPLOAD_FORM_ID
}
