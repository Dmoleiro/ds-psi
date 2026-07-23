import { describe, expect, it } from 'vitest'
import { shouldCompleteSession } from './formIds.js'

describe('shouldCompleteSession', () => {
  it('completes when all standard forms are submitted', () => {
    expect(
      shouldCompleteSession([
        { formId: 'ficha-inscricao', status: 'submitted' },
        { formId: 'queixa-inicial', status: 'submitted' },
      ]),
    ).toBe(true)
  })

  it('does not complete while standard forms are pending', () => {
    expect(
      shouldCompleteSession([
        { formId: 'ficha-inscricao', status: 'submitted' },
        { formId: 'queixa-inicial', status: 'in_progress' },
      ]),
    ).toBe(false)
  })

  it('does not complete when only the document upload form is assigned', () => {
    expect(shouldCompleteSession([{ formId: 'anexar-documentos', status: 'not_started' }])).toBe(
      false,
    )
  })

  it('does not complete when a document upload form is part of the session', () => {
    expect(
      shouldCompleteSession([
        { formId: 'ficha-inscricao', status: 'submitted' },
        { formId: 'anexar-documentos', status: 'in_progress' },
      ]),
    ).toBe(false)
  })
})
