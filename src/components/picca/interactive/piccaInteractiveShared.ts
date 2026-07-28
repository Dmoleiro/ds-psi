export const WEEKDAY_KEYS = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'] as const
export type WeekdayKey = (typeof WEEKDAY_KEYS)[number]

export const WEEKDAY_LABELS: Record<WeekdayKey, string> = {
  seg: 'Seg',
  ter: 'Ter',
  qua: 'Qua',
  qui: 'Qui',
  sex: 'Sex',
  sab: 'Sáb',
  dom: 'Dom',
}

export type PaiMaeCell = { pai: boolean; mae: boolean }
export type PaiMaeAmbosCell = { pai: boolean; mae: boolean; ambos: boolean }
export type TriStateOutcome = '' | 'sim' | 'parcial' | 'nao'
export type FuncionouLevel = '' | 'sim' | 'parcial' | 'nao'

export function emptyPaiMae(): PaiMaeCell {
  return { pai: false, mae: false }
}

export function emptyPaiMaeAmbos(): PaiMaeAmbosCell {
  return { pai: false, mae: false, ambos: false }
}
