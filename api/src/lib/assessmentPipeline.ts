import type { AssessmentPipelineStage } from '@prisma/client'

export const PIPELINE_STAGE_ORDER = [
  'intake',
  'avaliacao',
  'picca',
  'relatorio',
  'concluido',
] as const satisfies readonly AssessmentPipelineStage[]

export type PipelineStageId = (typeof PIPELINE_STAGE_ORDER)[number]
export type PipelineStageStatus = 'pending' | 'in_progress' | 'complete' | 'skipped'

export const OVERRIDABLE_PIPELINE_STAGES = [
  'intake',
  'avaliacao',
  'picca',
  'relatorio',
] as const satisfies readonly PipelineStageId[]

export type OverridablePipelineStageId = (typeof OVERRIDABLE_PIPELINE_STAGES)[number]
export type PipelineStageOverrides = Partial<Record<OverridablePipelineStageId, true>>

export const PIPELINE_STAGE_LABELS: Record<PipelineStageId, string> = {
  intake: 'Admissão',
  avaliacao: 'Avaliação',
  picca: 'PICCA',
  relatorio: 'Relatório',
  concluido: 'Concluído',
}

export const PIPELINE_STATUS_LABELS: Record<PipelineStageStatus, string> = {
  pending: 'Por iniciar',
  in_progress: 'Em curso',
  complete: 'Concluída',
  skipped: 'N/A',
}

export const REQUIRED_INTAKE_FORM_IDS = ['ficha-inscricao', 'queixa-inicial'] as const

export const INTAKE_FORM_LABELS: Record<(typeof REQUIRED_INTAKE_FORM_IDS)[number], string> = {
  'ficha-inscricao': 'Ficha de inscrição',
  'queixa-inicial': 'Queixa inicial',
}

type IntakeSessionInput = {
  status: string
  forms: Array<{ formId: string; status: string }>
}

type PiccaSessionInput = {
  status: string
  modules: Array<{ status: string }>
}

type PiccaInteractiveSessionInput = {
  status: string
  forms: Array<{ formId: string }>
}

export type PipelineStageSnapshot = {
  id: PipelineStageId
  label: string
  status: PipelineStageStatus
  blockers: string[]
  manuallyComplete: boolean
}

export function sanitizeStageOverrides(value: unknown): PipelineStageOverrides {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {}
  }

  const result: PipelineStageOverrides = {}
  for (const stage of OVERRIDABLE_PIPELINE_STAGES) {
    if ((value as Record<string, unknown>)[stage] === true) {
      result[stage] = true
    }
  }
  return result
}

function applyStageOverride(
  stageId: OverridablePipelineStageId,
  overrides: PipelineStageOverrides,
  computed: { status: PipelineStageStatus; blockers: string[] },
): { status: PipelineStageStatus; blockers: string[]; manuallyComplete: boolean } {
  if (overrides[stageId]) {
    return { status: 'complete', blockers: [], manuallyComplete: true }
  }

  return { ...computed, manuallyComplete: false }
}

export function getVisiblePipelineStages(piccaEnabled: boolean): PipelineStageId[] {
  if (piccaEnabled) return [...PIPELINE_STAGE_ORDER]
  return PIPELINE_STAGE_ORDER.filter((stage) => stage !== 'picca')
}

export function getNextPipelineStage(
  current: PipelineStageId,
  piccaEnabled: boolean,
): PipelineStageId | null {
  const stages = getVisiblePipelineStages(piccaEnabled)
  const index = stages.indexOf(current)
  if (index < 0 || index >= stages.length - 1) return null
  return stages[index + 1] ?? null
}

export function isIntakeComplete(sessions: IntakeSessionInput[]): boolean {
  return getIntakePipelineState(sessions).status === 'complete'
}

export function getIntakePipelineState(sessions: IntakeSessionInput[]): {
  status: PipelineStageStatus
  blockers: string[]
} {
  const activeSessions = sessions.filter((session) => session.status !== 'revoked')
  const submitted = new Map<string, boolean>()

  for (const session of activeSessions) {
    for (const form of session.forms) {
      if (!REQUIRED_INTAKE_FORM_IDS.includes(form.formId as (typeof REQUIRED_INTAKE_FORM_IDS)[number])) {
        continue
      }
      if (form.status === 'submitted') {
        submitted.set(form.formId, true)
      } else if (!submitted.has(form.formId)) {
        submitted.set(form.formId, false)
      }
    }
  }

  const allSubmitted = REQUIRED_INTAKE_FORM_IDS.every((formId) => submitted.get(formId) === true)
  if (allSubmitted) {
    return { status: 'complete', blockers: [] }
  }

  const hasAnySession = activeSessions.some((session) =>
    session.forms.some((form) =>
      REQUIRED_INTAKE_FORM_IDS.includes(form.formId as (typeof REQUIRED_INTAKE_FORM_IDS)[number]),
    ),
  )

  const blockers: string[] = []
  if (!hasAnySession) {
    blockers.push('Enviar formulários de admissão ao paciente')
  } else {
    for (const formId of REQUIRED_INTAKE_FORM_IDS) {
      if (submitted.get(formId) !== true) {
        blockers.push(`Por submeter: ${INTAKE_FORM_LABELS[formId]}`)
      }
    }
  }

  return {
    status: hasAnySession ? 'in_progress' : 'pending',
    blockers,
  }
}

export function getAvaliacaoPipelineState(
  wiscSelections: string[],
  bancSelections: string[],
  additionalMethodSelections: string[],
  intakeComplete: boolean,
): { status: PipelineStageStatus; blockers: string[] } {
  if (!intakeComplete) {
    return { status: 'pending', blockers: ['Concluir admissão primeiro'] }
  }

  if (
    wiscSelections.length === 0 &&
    bancSelections.length === 0 &&
    additionalMethodSelections.length === 0
  ) {
    return { status: 'in_progress', blockers: ['Indicar testes planeados'] }
  }

  return { status: 'complete', blockers: [] }
}

function isPiccaSessionComplete(session: PiccaSessionInput): boolean {
  if (session.status === 'completed') return true
  return session.modules.length > 0 && session.modules.every((module) => module.status === 'submitted')
}

function isPiccaInteractiveSessionComplete(session: PiccaInteractiveSessionInput): boolean {
  return session.status === 'completed'
}

export function getPiccaPipelineState(
  piccaSessions: PiccaSessionInput[],
  interactiveSessions: PiccaInteractiveSessionInput[],
): { status: PipelineStageStatus; blockers: string[] } {
  const sessions = piccaSessions.filter((session) => session.status !== 'revoked')
  const interactive = interactiveSessions.filter((session) => session.status !== 'revoked')
  const hasAny = sessions.length > 0 || interactive.length > 0

  if (sessions.some(isPiccaSessionComplete) || interactive.some(isPiccaInteractiveSessionComplete)) {
    return { status: 'complete', blockers: [] }
  }

  if (!hasAny) {
    return { status: 'pending', blockers: ['Criar sessão PICCA com módulos de avaliação'] }
  }

  const blockers: string[] = []
  const latestPicca = sessions[0]
  if (latestPicca) {
    const pendingModules = latestPicca.modules.filter((module) => module.status !== 'submitted').length
    if (pendingModules > 0) {
      blockers.push(`${pendingModules} módulo(s) PICCA por submeter`)
    }
  }

  const latestInteractive = interactive[0]
  if (latestInteractive && latestInteractive.status !== 'completed') {
    if (latestInteractive.forms.length > 0) {
      blockers.push('Sessão PICCA interativa em curso')
    }
  }

  if (blockers.length === 0) {
    blockers.push('Concluir módulos PICCA em curso')
  }

  return { status: 'in_progress', blockers }
}

export function getRelatorioPipelineState(reportDeliveredAt: Date | null, documentCount: number): {
  status: PipelineStageStatus
  blockers: string[]
} {
  if (reportDeliveredAt) {
    return { status: 'complete', blockers: [] }
  }

  const blockers = ['Registar entrega do relatório à família']
  if (documentCount === 0) {
    blockers.push('Carregar relatório na secção Documentos')
  }

  return { status: 'in_progress', blockers }
}

export function getConcluidoPipelineState(
  relatorioComplete: boolean,
  currentStage: PipelineStageId,
): { status: PipelineStageStatus; blockers: string[] } {
  if (currentStage === 'concluido') {
    return { status: 'complete', blockers: [] }
  }

  if (!relatorioComplete) {
    return { status: 'pending', blockers: ['Concluir relatório primeiro'] }
  }

  return { status: 'pending', blockers: ['Marcar caso como concluído'] }
}

export function buildAssessmentPipelineView(input: {
  currentStage: PipelineStageId
  notes: string | null
  reportDeliveredAt: Date | null
  piccaEnabled: boolean
  stageOverrides: PipelineStageOverrides
  wiscSelections: string[]
  bancSelections: string[]
  additionalMethodSelections: string[]
  intakeSessions: IntakeSessionInput[]
  piccaSessions: PiccaSessionInput[]
  piccaInteractiveSessions: PiccaInteractiveSessionInput[]
  documentCount: number
}) {
  const overrides = input.stageOverrides
  const intake = applyStageOverride('intake', overrides, getIntakePipelineState(input.intakeSessions))
  const intakeComplete = intake.status === 'complete'
  const avaliacao = applyStageOverride(
    'avaliacao',
    overrides,
    getAvaliacaoPipelineState(
      input.wiscSelections,
      input.bancSelections,
      input.additionalMethodSelections,
      intakeComplete,
    ),
  )
  const picca = input.piccaEnabled
    ? applyStageOverride(
        'picca',
        overrides,
        getPiccaPipelineState(input.piccaSessions, input.piccaInteractiveSessions),
      )
    : { status: 'skipped' as const, blockers: [] as string[], manuallyComplete: false }
  const relatorio = applyStageOverride(
    'relatorio',
    overrides,
    getRelatorioPipelineState(input.reportDeliveredAt, input.documentCount),
  )
  const concluido = getConcluidoPipelineState(
    relatorio.status === 'complete',
    input.currentStage,
  )

  const stageStates: Record<PipelineStageId, { status: PipelineStageStatus; blockers: string[]; manuallyComplete: boolean }> = {
    intake,
    avaliacao,
    picca,
    relatorio,
    concluido: { ...concluido, manuallyComplete: false },
  }

  const visibleStages = getVisiblePipelineStages(input.piccaEnabled)
  const stages: PipelineStageSnapshot[] = visibleStages.map((id) => ({
    id,
    label: PIPELINE_STAGE_LABELS[id],
    status: stageStates[id].status,
    blockers: stageStates[id].blockers,
    manuallyComplete: stageStates[id].manuallyComplete,
  }))

  const currentStageBlockers = stageStates[input.currentStage]?.blockers ?? []
  const nextStage = getNextPipelineStage(input.currentStage, input.piccaEnabled)

  return {
    currentStage: input.currentStage,
    currentStageLabel: PIPELINE_STAGE_LABELS[input.currentStage],
    notes: input.notes,
    reportDeliveredAt: input.reportDeliveredAt,
    piccaEnabled: input.piccaEnabled,
    stages,
    currentStageBlockers,
    nextStage,
    nextStageLabel: nextStage ? PIPELINE_STAGE_LABELS[nextStage] : null,
    canAdvance: nextStage !== null && currentStageBlockers.length === 0,
  }
}
