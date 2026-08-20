import { describe, expect, it } from 'vitest'
import type { PatientSummary } from './api'
import {
  buildPatientsListPrintHtml,
  defaultPatientListExportColumnIds,
  resolvePatientListExportColumns,
} from './exportPatientsListPdf'

const samplePatient: PatientSummary = {
  id: 'p1',
  fullName: 'Ana Silva',
  email: 'ana@example.com',
  email2: null,
  phone: '912345678',
  phone2: null,
  birthDate: '2015-03-10T00:00:00.000Z',
  sessionFee: 45,
  active: true,
  createdAt: '2024-01-15T10:00:00.000Z',
  location: { id: 'loc1', name: 'Póvoa de Santa Iria' },
  therapist: { id: 't1', name: 'Daniela Santos' },
  intakeSessions: [{ id: 's1', status: 'completed', createdAt: '2024-02-01T10:00:00.000Z', completedAt: null }],
}

describe('exportPatientsListPdf', () => {
  it('includes only selected columns in the generated HTML', () => {
    const html = buildPatientsListPrintHtml(
      [samplePatient],
      {},
      resolvePatientListExportColumns(['fullName', 'email']),
    )

    expect(html).toContain('<th>Nome</th>')
    expect(html).toContain('<th>Email</th>')
    expect(html).not.toContain('<th>Local</th>')
    expect(html).toContain('Ana Silva')
    expect(html).toContain('ana@example.com')
  })

  it('defaults to the original five columns', () => {
    expect(defaultPatientListExportColumnIds()).toEqual([
      'fullName',
      'location',
      'sessionFee',
      'contact',
      'latestForms',
    ])
  })

  it('requires at least one column', () => {
    expect(() => buildPatientsListPrintHtml([samplePatient], {}, [])).toThrow(
      'Seleccione pelo menos uma coluna para exportar.',
    )
  })
})
