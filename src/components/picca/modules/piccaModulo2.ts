export type PiccaModulo2Answers = {
  fontesInformacao: string[]
  fontesOutros: string
  composicaoFamiliar: Array<{
    name: string
    age: string
    parentesco: string
    viveCom: string
    qualidadeRelacao: string
  }>
  alteracoesFamiliares: string[]
  alteracoesOutro: string
  vinculacaoPrincipal: string[]
  vinculacaoOutro: string
  reacaoSeparacao: string[]
  relacaoMae: string
  relacaoPai: string
  relacaoIrmaos: string
  estiloEducativo: Record<string, string>
  antecedentes: Record<string, { mae: boolean; pai: boolean; famMaterna: boolean; famPaterna: boolean }>
  acontecimentosVida: string
  integracaoPredisponentes: string
  integracaoProtetores: string
  integracaoVulnerabilidades: string
  integracaoRecursos: string
  integracaoHipoteses: string
  integracaoQuestoes: string
}

export const defaultPiccaModulo2Answers = (): PiccaModulo2Answers => ({
  fontesInformacao: [],
  fontesOutros: '',
  composicaoFamiliar: [
    { name: '', age: '', parentesco: '', viveCom: '', qualidadeRelacao: '' },
  ],
  alteracoesFamiliares: [],
  alteracoesOutro: '',
  vinculacaoPrincipal: [],
  vinculacaoOutro: '',
  reacaoSeparacao: [],
  relacaoMae: '',
  relacaoPai: '',
  relacaoIrmaos: '',
  estiloEducativo: {},
  antecedentes: {},
  acontecimentosVida: '',
  integracaoPredisponentes: '',
  integracaoProtetores: '',
  integracaoVulnerabilidades: '',
  integracaoRecursos: '',
  integracaoHipoteses: '',
  integracaoQuestoes: '',
})

export function mergePiccaModulo2Answers(raw: Record<string, unknown>): PiccaModulo2Answers {
  const defaults = defaultPiccaModulo2Answers()
  return { ...defaults, ...(raw as Partial<PiccaModulo2Answers>) }
}
