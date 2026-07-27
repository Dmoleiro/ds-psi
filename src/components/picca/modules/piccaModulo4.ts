export type PiccaModulo4Answers = {
  sentouSemApoio: string
  gatinhou: string
  primeirosPassos: string
  subiaEscadas: string
  motorGrossoObs: string
  preensaoAdequada: string
  manipulacaoObjetos: string
  grafomotricidade: string
  primeirasPalavras: string
  primeirasFrases: string
  compreensao: string
  expressao: string
  pragmatica: string
  comunicacaoSocial: string[]
  brincadeira: string[]
  brincadeirasPreferidas: string
  reconheceEmocoes: string
  expressaEmocoes: string
  regulacaoEmocional: string
  vestir: string
  alimentacaoAutonomia: string
  higiene: string
  controloEsfinteres: string
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
  comunicacaoSocial: [],
  brincadeira: [],
  brincadeirasPreferidas: '',
  reconheceEmocoes: '',
  expressaEmocoes: '',
  regulacaoEmocional: '',
  vestir: '',
  alimentacaoAutonomia: '',
  higiene: '',
  controloEsfinteres: '',
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
  return { ...defaultPiccaModulo4Answers(), ...(raw as Partial<PiccaModulo4Answers>) }
}
