import type { ComponentType } from 'react'
import type { PiccaInteractiveFormKind } from '../../../lib/piccaInteractiveKinds'
import { defaultPiccaInteractiveEstrategiasAnswers } from './piccaInteractiveEstrategias'
import { PiccaInteractiveEstrategiasForm } from './PiccaInteractiveEstrategiasForm'
import { defaultPiccaInteractiveKitAutonomiaAnswers } from './piccaInteractiveKitAutonomia'
import { PiccaInteractiveKitAutonomiaForm } from './PiccaInteractiveKitAutonomiaForm'
import { defaultPiccaInteractiveKitBirrasAnswers } from './piccaInteractiveKitBirras'
import { PiccaInteractiveKitBirrasForm } from './PiccaInteractiveKitBirrasForm'
import { defaultPiccaInteractiveKitConquistasAnswers } from './piccaInteractiveKitConquistas'
import { PiccaInteractiveKitConquistasForm } from './PiccaInteractiveKitConquistasForm'
import { defaultPiccaInteractiveKitFlexibilidadeAnswers } from './piccaInteractiveKitFlexibilidade'
import { PiccaInteractiveKitFlexibilidadeForm } from './PiccaInteractiveKitFlexibilidadeForm'
import { defaultPiccaInteractiveKitRotinasAnswers } from './piccaInteractiveKitRotinas'
import { PiccaInteractiveKitRotinasForm } from './PiccaInteractiveKitRotinasForm'
import { defaultPiccaInteractiveKitSonoAnswers } from './piccaInteractiveKitSono'
import { PiccaInteractiveKitSonoForm } from './PiccaInteractiveKitSonoForm'
import { defaultPiccaInteractivePortageAnswers } from './piccaInteractivePortage'
import { PiccaInteractivePortageForm } from './PiccaInteractivePortageForm'
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
  kind: PiccaInteractiveFormKind
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
  'picca-interactive-kit-rotinas': {
    defaultAnswers: defaultPiccaInteractiveKitRotinasAnswers,
    Form: PiccaInteractiveKitRotinasForm,
    kind: 'weekly_kit',
  },
  'picca-interactive-kit-sono': {
    defaultAnswers: defaultPiccaInteractiveKitSonoAnswers,
    Form: PiccaInteractiveKitSonoForm,
    kind: 'weekly_kit',
  },
  'picca-interactive-kit-birras': {
    defaultAnswers: defaultPiccaInteractiveKitBirrasAnswers,
    Form: PiccaInteractiveKitBirrasForm,
    kind: 'weekly_kit',
  },
  'picca-interactive-kit-autonomia': {
    defaultAnswers: defaultPiccaInteractiveKitAutonomiaAnswers,
    Form: PiccaInteractiveKitAutonomiaForm,
    kind: 'weekly_kit',
  },
  'picca-interactive-kit-flexibilidade': {
    defaultAnswers: defaultPiccaInteractiveKitFlexibilidadeAnswers,
    Form: PiccaInteractiveKitFlexibilidadeForm,
    kind: 'weekly_kit',
  },
  'picca-interactive-kit-conquistas': {
    defaultAnswers: defaultPiccaInteractiveKitConquistasAnswers,
    Form: PiccaInteractiveKitConquistasForm,
    kind: 'weekly_kit',
  },
  'picca-interactive-portage': {
    defaultAnswers: defaultPiccaInteractivePortageAnswers,
    Form: PiccaInteractivePortageForm,
    kind: 'portage_assessment',
  },
}

export function getPiccaInteractiveFormDefaults(formId: string): Record<string, unknown> {
  return piccaInteractiveFormRegistry[formId]?.defaultAnswers() ?? {}
}

export function hasPiccaInteractiveFormRenderer(formId: string): boolean {
  return formId in piccaInteractiveFormRegistry
}
