export type PiccaModulo4Answers = {
  sentouSemApoio: string
  gatinhou: string
  primeirosPassos: string
  subiaEscadas: string
  motorGrossoObs: string
  preensaoAdequada: '' | 'sim' | 'nao'
  manipulacaoObjetos: string
  grafomotricidade: string
  primeirasPalavras: string
  primeirasFrases: string
  compreensao: string
  expressao: string
  pragmatica: string
  atrasoLinguagem: '' | 'sim' | 'nao'
  comunicacaoSocial: string[]
  brincadeira: string[]
  brincadeirasPreferidas: string
  reconheceEmocoes: string
  expressaEmocoes: string
  regulacaoEmocional: string
  regulacaoSemAdulto: '' | 'sim' | 'nao'
  vestir: string
  alimentacaoAutonomia: string
  higiene: string
  controloEsfinteres: string
  controloEsfinteresTipo: string[]
  perfilSensorial: string[]
  perfilSensorialObs: string
  alertas: Record<string, { presente: boolean; notas: string; gravidade?: string }>
  integracaoFortes: string
  integracaoVulnerabilidades: string
  integracaoPredisponentes: string
  integracaoHipoteses: string
  integracaoAvaliacoes: string
}

export const defaultPiccaModulo4Answers = (): PiccaModulo4Answers => ({
  sentouSemApoio: '',
  gatinhou: '',
  primeirosPassos: '',
  subiaEscadas: '',
  motorGrossoObs: '',
  preensaoAdequada: '',
  manipulacaoObjetos: '',
  grafomotricidade: '',
  primeirasPalavras: '',
  primeirasFrases: '',
  compreensao: '',
  expressao: '',
  pragmatica: '',
  atrasoLinguagem: '',
  comunicacaoSocial: [],
  brincadeira: [],
  brincadeirasPreferidas: '',
  reconheceEmocoes: '',
  expressaEmocoes: '',
  regulacaoEmocional: '',
  regulacaoSemAdulto: '',
  vestir: '',
  alimentacaoAutonomia: '',
  higiene: '',
  controloEsfinteres: '',
  controloEsfinteresTipo: [],
  perfilSensorial: [],
  perfilSensorialObs: '',
  alertas: {},
  integracaoFortes: '',
  integracaoVulnerabilidades: '',
  integracaoPredisponentes: '',
  integracaoHipoteses: '',
  integracaoAvaliacoes: '',
})

export function mergePiccaModulo4Answers(raw: Record<string, unknown>): PiccaModulo4Answers {
  const defaults = defaultPiccaModulo4Answers()
  const partial = raw as Partial<PiccaModulo4Answers>
  const legacyPreensao = raw.preensaoAdequada
  let preensaoAdequada = partial.preensaoAdequada ?? defaults.preensaoAdequada
  if (legacyPreensao === 'Sim') preensaoAdequada = 'sim'
  if (legacyPreensao === 'Não' || legacyPreensao === 'Nao') preensaoAdequada = 'nao'
  return {
    ...defaults,
    ...partial,
    preensaoAdequada,
  }
}
