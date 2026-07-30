import type { PatientSummary } from './api'

export function matchesPatientSearch(patient: PatientSummary, query: string): boolean {
  const normalized = query.trim().toLocaleLowerCase('pt-PT')
  if (!normalized) return true

  const haystack = [patient.fullName, patient.email, patient.email2, patient.phone, patient.phone2]
    .filter(Boolean)
    .join(' ')
    .toLocaleLowerCase('pt-PT')

  return haystack.includes(normalized)
}

export function patientContactHint(patient: PatientSummary): string | null {
  return patient.email || patient.phone || patient.email2 || patient.phone2 || null
}
