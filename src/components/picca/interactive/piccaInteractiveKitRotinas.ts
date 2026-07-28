import {
  emptyPaiMae,
  emptyPaiMaeAmbos,
  type PaiMaeAmbosCell,
  type PaiMaeCell,
  type TriStateOutcome,
  WEEKDAY_KEYS,
  type WeekdayKey,
} from './piccaInteractiveShared'

export const KIT_ROTINAS_TASKS = [
  { id: 'acordar', label: 'Acordar a criança' },
  { id: 'higiene_manha', label: 'Higiene da manhã' },
  { id: 'vestir', label: 'Supervisionar o vestir' },
  { id: 'pequeno_almoco', label: 'Preparar o pequeno-almoço' },
  { id: 'levar_escola', label: 'Levar à escola' },
  { id: 'buscar_escola', label: 'Ir buscar à escola' },
  { id: 'lanche', label: 'Acompanhar o lanche' },
  { id: 'brincadeira', label: 'Tempo exclusivo de brincadeira' },
  { id: 'ar_livre', label: 'Atividade ao ar livre' },
  { id: 'arrumar_brinquedos', label: 'Apoiar a arrumação dos brinquedos' },
  { id: 'jantar', label: 'Preparar o jantar' },
  { id: 'banho', label: 'Acompanhar o banho' },
  { id: 'mochila', label: 'Preparar a mochila' },
  { id: 'historia', label: 'Ler uma história' },
  { id: 'adormecer', label: 'Acompanhar o adormecer' },
] as const

export const KIT_ROTINAS_MOMENTOS = [
  { id: 'manha', label: 'Rotina da manhã' },
  { id: 'transicao_escola', label: 'Transição para a escola' },
  { id: 'regresso', label: 'Regresso a casa' },
  { id: 'brincadeira', label: 'Tempo de brincadeira' },
  { id: 'refeicao', label: 'Refeição' },
  { id: 'higiene', label: 'Rotina de higiene' },
  { id: 'sono', label: 'Rotina de sono' },
] as const

export type PiccaInteractiveKitRotinasAnswers = {
  planeamento: Record<string, Record<WeekdayKey, PaiMaeCell>>
  registoDiario: Record<string, { responsavel: PaiMaeAmbosCell; resultado: TriStateOutcome }>
  observacoesBem: string
  observacoesDificil: string
  observacoesEstrategia: string
}

export const defaultPiccaInteractiveKitRotinasAnswers = (): PiccaInteractiveKitRotinasAnswers => {
  const planeamento: PiccaInteractiveKitRotinasAnswers['planeamento'] = {}
  for (const task of KIT_ROTINAS_TASKS) {
    planeamento[task.id] = {} as Record<WeekdayKey, PaiMaeCell>
    for (const day of WEEKDAY_KEYS) {
      planeamento[task.id][day] = emptyPaiMae()
    }
  }
  const registoDiario: PiccaInteractiveKitRotinasAnswers['registoDiario'] = {}
  for (const momento of KIT_ROTINAS_MOMENTOS) {
    registoDiario[momento.id] = { responsavel: emptyPaiMaeAmbos(), resultado: '' }
  }
  return {
    planeamento,
    registoDiario,
    observacoesBem: '',
    observacoesDificil: '',
    observacoesEstrategia: '',
  }
}

export function mergePiccaInteractiveKitRotinasAnswers(
  raw: Record<string, unknown>,
): PiccaInteractiveKitRotinasAnswers {
  const defaults = defaultPiccaInteractiveKitRotinasAnswers()
  const partial = raw as Partial<PiccaInteractiveKitRotinasAnswers>
  return { ...defaults, ...partial, planeamento: { ...defaults.planeamento, ...partial.planeamento }, registoDiario: { ...defaults.registoDiario, ...partial.registoDiario } }
}
