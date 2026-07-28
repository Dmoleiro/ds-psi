import {
  emptyPaiMaeAmbos,
  type PaiMaeAmbosCell,
  WEEKDAY_KEYS,
  type WeekdayKey,
} from './piccaInteractiveShared'

export const KIT_SONO_ROTINA_STEPS = [
  { id: 'ecras', label: 'Desligar ecrãs' },
  { id: 'brinquedos', label: 'Arrumar brinquedos' },
  { id: 'banho', label: 'Tomar banho' },
  { id: 'pijama', label: 'Vestir o pijama' },
  { id: 'dentes', label: 'Escovar os dentes' },
  { id: 'wc', label: 'Ir à casa de banho' },
  { id: 'historia', label: 'Ler uma história' },
  { id: 'conversar', label: 'Conversar brevemente sobre o dia' },
  { id: 'abraco', label: 'Dar o abraço de boa-noite' },
  { id: 'adormecer', label: 'Acompanhar o adormecer' },
] as const

export const KIT_SONO_INDICADORES = [
  { id: 'cama_propria', label: 'Dormiu na própria cama' },
  { id: 'chamou', label: 'Chamou pelo pai ou mãe' },
  { id: 'cama_pais', label: 'Passou para a cama dos pais' },
  { id: 'pesadelos', label: 'Teve pesadelos ou terrores noturnos' },
  { id: 'sesta', label: 'Dormiu sesta' },
  { id: 'bem_disposto', label: 'Acordou bem-disposto' },
] as const

export type KitSonoRotinaRow = {
  responsavel: PaiMaeAmbosCell
  hora: string
  concluido: boolean
}

export type KitSonoDiaRow = {
  deitou: string
  adormeceu: string
  latencia: string
  despertares: string
  acordou: string
  acompanhamento: PaiMaeCell
}

type PaiMaeCell = { pai: boolean; mae: boolean }

function emptyPaiMae(): PaiMaeCell {
  return { pai: false, mae: false }
}

export type KitSonoIndicadorRow = {
  sim: boolean
  nao: boolean
  pai: boolean
  mae: boolean
  observacoes: string
}

export type PiccaInteractiveKitSonoAnswers = {
  rotina: Record<string, KitSonoRotinaRow>
  registoSemanal: Record<WeekdayKey, KitSonoDiaRow>
  indicadores: Record<string, KitSonoIndicadorRow>
}

export const defaultPiccaInteractiveKitSonoAnswers = (): PiccaInteractiveKitSonoAnswers => {
  const rotina: PiccaInteractiveKitSonoAnswers['rotina'] = {}
  for (const step of KIT_SONO_ROTINA_STEPS) {
    rotina[step.id] = { responsavel: emptyPaiMaeAmbos(), hora: '', concluido: false }
  }
  const registoSemanal = {} as Record<WeekdayKey, KitSonoDiaRow>
  for (const day of WEEKDAY_KEYS) {
    registoSemanal[day] = {
      deitou: '',
      adormeceu: '',
      latencia: '',
      despertares: '',
      acordou: '',
      acompanhamento: emptyPaiMae(),
    }
  }
  const indicadores: PiccaInteractiveKitSonoAnswers['indicadores'] = {}
  for (const ind of KIT_SONO_INDICADORES) {
    indicadores[ind.id] = { sim: false, nao: false, pai: false, mae: false, observacoes: '' }
  }
  return { rotina, registoSemanal, indicadores }
}

export function mergePiccaInteractiveKitSonoAnswers(
  raw: Record<string, unknown>,
): PiccaInteractiveKitSonoAnswers {
  const defaults = defaultPiccaInteractiveKitSonoAnswers()
  const partial = raw as Partial<PiccaInteractiveKitSonoAnswers>
  return {
    ...defaults,
    ...partial,
    rotina: { ...defaults.rotina, ...partial.rotina },
    registoSemanal: { ...defaults.registoSemanal, ...partial.registoSemanal },
    indicadores: { ...defaults.indicadores, ...partial.indicadores },
  }
}
