import { WEEKDAY_KEYS, type WeekdayKey } from './piccaInteractiveShared'

export const KIT_AUTONOMIA_COMPETENCIAS = [
  { id: 'vestir_superior', label: 'Vestir a parte superior' },
  { id: 'vestir_calcoes', label: 'Vestir calças ou calções' },
  { id: 'escolher_roupa', label: 'Escolher entre duas opções de roupa' },
  { id: 'calcado', label: 'Calçar os sapatos' },
  { id: 'lavar_maos', label: 'Lavar as mãos' },
  { id: 'escovar_dentes', label: 'Escovar os dentes' },
  { id: 'roupa_cesto', label: 'Guardar a roupa no cesto' },
  { id: 'arrumar_brinquedos', label: 'Arrumar brinquedos' },
  { id: 'prato_cozinha', label: 'Levar o prato à cozinha' },
  { id: 'por_mesa', label: 'Ajudar a pôr a mesa' },
  { id: 'mochila', label: 'Preparar a mochila' },
  { id: 'pertences', label: 'Guardar os seus pertences' },
] as const

export type AutonomiaCompetenciaRow = {
  sozinho: boolean
  comAjuda: boolean
  recusou: boolean
  pai: boolean
  mae: boolean
}

export type AutonomiaPlanoGradual = {
  objetivo: string
  passo1: string
  passo2: string
  passo3: string
  reforco: string
}

export type AutonomiaDiaRow = {
  tarefa: string
  ajuda: string
  pai: boolean
  mae: boolean
  resultado: string
}

export type PiccaInteractiveKitAutonomiaAnswers = {
  competencias: Record<string, AutonomiaCompetenciaRow>
  planoGradual: AutonomiaPlanoGradual
  registoSemanal: Record<WeekdayKey, AutonomiaDiaRow>
}

export const defaultPiccaInteractiveKitAutonomiaAnswers = (): PiccaInteractiveKitAutonomiaAnswers => {
  const competencias: PiccaInteractiveKitAutonomiaAnswers['competencias'] = {}
  for (const c of KIT_AUTONOMIA_COMPETENCIAS) {
    competencias[c.id] = { sozinho: false, comAjuda: false, recusou: false, pai: false, mae: false }
  }
  const registoSemanal = {} as Record<WeekdayKey, AutonomiaDiaRow>
  for (const day of WEEKDAY_KEYS) {
    registoSemanal[day] = { tarefa: '', ajuda: '', pai: false, mae: false, resultado: '' }
  }
  return {
    competencias,
    planoGradual: { objetivo: '', passo1: '', passo2: '', passo3: '', reforco: '' },
    registoSemanal,
  }
}

export function mergePiccaInteractiveKitAutonomiaAnswers(
  raw: Record<string, unknown>,
): PiccaInteractiveKitAutonomiaAnswers {
  const defaults = defaultPiccaInteractiveKitAutonomiaAnswers()
  const partial = raw as Partial<PiccaInteractiveKitAutonomiaAnswers>
  return {
    ...defaults,
    ...partial,
    competencias: { ...defaults.competencias, ...partial.competencias },
    planoGradual: { ...defaults.planoGradual, ...partial.planoGradual },
    registoSemanal: { ...defaults.registoSemanal, ...partial.registoSemanal },
  }
}
