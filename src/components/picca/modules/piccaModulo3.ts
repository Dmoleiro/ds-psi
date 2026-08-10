export type PiccaModulo3Answers = {
  gravidezPlaneada: string[]
  idadeMaterna: string
  idadePaterna: string
  planeamentoObs: string
  gravidezIntercorrencias: string[]
  gravidezMedicacao: string
  gravidezCrianca: string[]
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
  sonoRegular: string[]
  sonoHorasNoturnas: string
  berçoQuartosPaisMeses: string
  quartoProprioIdade: string
  alimentacao: string
  alimentacaoTipo: string[]
  temperamento: string[]
  vinculacaoPrecoce: string
  vinculacaoTipo: string[]
  vinculacaoOutroCuidador: string
  alteracoesAuditivas: '' | 'sim' | 'nao'
  convulsoesFebris: '' | 'sim' | 'nao'
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
  gravidezCrianca: [],
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
  sonoRegular: [],
  sonoHorasNoturnas: '',
  berçoQuartosPaisMeses: '',
  quartoProprioIdade: '',
  alimentacao: '',
  alimentacaoTipo: [],
  temperamento: [],
  vinculacaoPrecoce: '',
  vinculacaoTipo: [],
  vinculacaoOutroCuidador: '',
  alteracoesAuditivas: '',
  convulsoesFebris: '',
  alertas: {},
  integracaoPredisponentes: '',
  integracaoProtetores: '',
  integracaoQuestoes: '',
  integracaoHipoteses: '',
})

export function mergePiccaModulo3Answers(raw: Record<string, unknown>): PiccaModulo3Answers {
  const defaults = defaultPiccaModulo3Answers()
  const partial = raw as Partial<PiccaModulo3Answers>
  const gravidezIntercorrencias = (partial.gravidezIntercorrencias ?? []).map((id) =>
    id === 'alcool_tabaco' ? 'alcool_tabaco_drogas' : id,
  )
  const neonatal = (partial.neonatal ?? []).map((id) =>
    id === 'alimentacao' ? 'alimentacao_materna' : id,
  )
  return {
    ...defaults,
    ...partial,
    gravidezIntercorrencias,
    neonatal,
  }
}
