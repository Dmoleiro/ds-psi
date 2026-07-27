export type PiccaModulo3Answers = {
  gravidezPlaneada: string[]
  idadeMaterna: string
  idadePaterna: string
  planeamentoObs: string
  gravidezIntercorrencias: string[]
  gravidezMedicacao: string
  gravidezObs: string
  semanasGestacao: string
  tipoParto: string[]
  peso: string
  comprimento: string
  apgar1: string
  apgar5: string
  apgar10: string
  partoComplicacoes: string
  neonatal: string[]
  neonatalObs: string
  sono: string
  alimentacao: string
  temperamento: string[]
  vinculacaoPrecoce: string
  alertas: Record<string, { presente: boolean; notas: string }>
  integracaoPredisponentes: string
  integracaoProtetores: string
  integracaoQuestoes: string
  integracaoHipoteses: string
}

export const defaultPiccaModulo3Answers = (): PiccaModulo3Answers => ({
  gravidezPlaneada: [],
  idadeMaterna: '',
  idadePaterna: '',
  planeamentoObs: '',
  gravidezIntercorrencias: [],
  gravidezMedicacao: '',
  gravidezObs: '',
  semanasGestacao: '',
  tipoParto: [],
  peso: '',
  comprimento: '',
  apgar1: '',
  apgar5: '',
  apgar10: '',
  partoComplicacoes: '',
  neonatal: [],
  neonatalObs: '',
  sono: '',
  alimentacao: '',
  temperamento: [],
  vinculacaoPrecoce: '',
  alertas: {},
  integracaoPredisponentes: '',
  integracaoProtetores: '',
  integracaoQuestoes: '',
  integracaoHipoteses: '',
})

export function mergePiccaModulo3Answers(raw: Record<string, unknown>): PiccaModulo3Answers {
  return { ...defaultPiccaModulo3Answers(), ...(raw as Partial<PiccaModulo3Answers>) }
}
