import type { ReactNode } from 'react'

export type PatientFormRendererProps = {
  values: Record<string, unknown>
  onChange: (values: Record<string, unknown>) => void
  readOnly: boolean
  patientToken?: string
}

export const patientFormRenderers: Record<
  string,
  (props: PatientFormRendererProps) => ReactNode
> = {}

export const patientFormValueNormalizers: Record<
  string,
  (values: Record<string, unknown>) => Record<string, unknown>
> = {}

export function hasPatientFormRenderer(formId: string) {
  return formId in patientFormRenderers
}

export function normalizePatientFormValues(
  formId: string,
  values: Record<string, unknown>,
): Record<string, unknown> {
  const normalizer = patientFormValueNormalizers[formId]
  return normalizer ? normalizer(values) : values
}
