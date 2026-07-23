export const PATIENT_DOCUMENT_ACCEPT =
  'application/pdf,.pdf,image/jpeg,.jpg,.jpeg,image/png,.png,image/webp,.webp,image/gif,.gif'

export function isImageMimeType(mimeType: string): boolean {
  return mimeType.startsWith('image/')
}
