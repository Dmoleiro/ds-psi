export type PiccaTherapyAreaRow = {
  objetivo: string
  estrategias: string
  responsavel: string
  prazo: string
}

export type PiccaModulo9Answers = {
  diagnosticoHipoteses: string
  prioridadesIntervencao: string
  objetivosSmart: string
  planoTerapeutico: Record<string, PiccaTherapyAreaRow>
  estrategiasFamilia: string
  estrategiasEscola: string
  articulacaoMultidisciplinar: string
  indicadoresEvolucao: Array<Record<string, string>>
  reavaliacao: string[]
  reavaliacaoOutro: string
  criteriosAlta: string
  notasClinicas: string
}

export const PICCA_MOD9_THERAPY_AREAS = [
  { id: 'cognicao', label: 'Cognição' },
  { id: 'linguagem', label: 'Linguagem' },
  { id: 'motricidade', label: 'Motricidade' },
  { id: 'emocoes', label: 'Emoções' },
  { id: 'comportamento', label: 'Comportamento' },
  { id: 'competencias_sociais', label: 'Competências Sociais' },
  { id: 'autonomia', label: 'Autonomia' },
  { id: 'aprendizagem', label: 'Aprendizagem' },
] as const

export const PICCA_MOD9_INDICADOR_COLUMNS = [
  { key: 'indicador', label: 'Indicador' },
  { key: 'linhaBase', label: 'Linha de Base' },
  { key: 'meta', label: 'Meta' },
  { key: 'data', label: 'Data' },
] as const

export const defaultPiccaModulo9Answers = (): PiccaModulo9Answers => ({
  diagnosticoHipoteses: '',
  prioridadesIntervencao: '',
  objetivosSmart: '',
  planoTerapeutico: {},
  estrategiasFamilia: '',
  estrategiasEscola: '',
  articulacaoMultidisciplinar: '',
  indicadoresEvolucao: [{ indicador: '', linhaBase: '', meta: '', data: '' }],
  reavaliacao: [],
  reavaliacaoOutro: '',
  criteriosAlta: '',
  notasClinicas: '',
})

export function mergePiccaModulo9Answers(raw: Record<string, unknown>): PiccaModulo9Answers {
  const defaults = defaultPiccaModulo9Answers()
  const partial = raw as Partial<PiccaModulo9Answers>
  return {
    ...defaults,
    ...partial,
    indicadoresEvolucao: partial.indicadoresEvolucao?.length
      ? partial.indicadoresEvolucao
      : defaults.indicadoresEvolucao,
  }
}
