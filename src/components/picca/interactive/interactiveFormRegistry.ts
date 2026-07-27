import type { ComponentType } from 'react'
import { defaultPiccaInteractiveEstrategiasAnswers } from './piccaInteractiveEstrategias'
import { PiccaInteractiveEstrategiasForm } from './PiccaInteractiveEstrategiasForm'
import { defaultPiccaInteractiveSonoAnswers } from './piccaInteractiveSono'
import { PiccaInteractiveSonoForm } from './PiccaInteractiveSonoForm'

export type PiccaInteractiveFormRendererProps = {
  value: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
  readOnly?: boolean
}

type PiccaInteractiveFormDefinition = {
  defaultAnswers: () => Record<string, unknown>
  Form: ComponentType<PiccaInteractiveFormRendererProps>
  kind: 'daily_sono' | 'weekly_estrategias'
}

export const piccaInteractiveFormRegistry: Record<string, PiccaInteractiveFormDefinition> = {
  'picca-interactive-sono': {
    defaultAnswers: defaultPiccaInteractiveSonoAnswers,
    Form: PiccaInteractiveSonoForm,
    kind: 'daily_sono',
  },
  'picca-interactive-estrategias': {
    defaultAnswers: defaultPiccaInteractiveEstrategiasAnswers,
    Form: PiccaInteractiveEstrategiasForm,
    kind: 'weekly_estrategias',
  },
}

export function getPiccaInteractiveFormDefaults(formId: string): Record<string, unknown> {
  return piccaInteractiveFormRegistry[formId]?.defaultAnswers() ?? {}
}

export function hasPiccaInteractiveFormRenderer(formId: string): boolean {
  return formId in piccaInteractiveFormRegistry
}
