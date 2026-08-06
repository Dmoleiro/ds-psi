import type { ZodError } from 'zod'
import { getFormFieldLabels } from './formPresentation.js'

export function formatZodFormValidationError(formId: string, error: ZodError): string {
  const flattened = error.flatten()
  const labels = getFormFieldLabels(formId)
  const lines: string[] = []

  for (const message of flattened.formErrors) {
    if (message) lines.push(message)
  }

  for (const [field, messages] of Object.entries(flattened.fieldErrors)) {
    if (!messages?.length) continue
    const label = labels[field] ?? field
    lines.push(`${label}: ${messages.join(', ')}`)
  }

  if (lines.length === 0) {
    return 'Verifique os campos do formulário e tente novamente.'
  }

  if (lines.length === 1) {
    return lines[0]
  }

  return `Verifique os seguintes campos:\n${lines.map((line) => `• ${line}`).join('\n')}`
}
