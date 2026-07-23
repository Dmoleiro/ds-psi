export const DOCUMENT_UPLOAD_FORM_ID = 'anexar-documentos'

export function isDocumentUploadForm(formId: string): boolean {
  return formId === DOCUMENT_UPLOAD_FORM_ID
}

export function shouldCompleteSession(
  forms: Array<{ formId: string; status: string }>,
): boolean {
  if (forms.some((form) => isDocumentUploadForm(form.formId))) {
    return false
  }
  if (forms.length === 0) return false
  return forms.every((form) => form.status === 'submitted')
}
