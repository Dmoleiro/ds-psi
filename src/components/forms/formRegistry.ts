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

export function hasPatientFormRenderer(formId: string) {
  return formId in patientFormRenderers
}
