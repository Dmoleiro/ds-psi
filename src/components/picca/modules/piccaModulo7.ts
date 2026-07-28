export type PiccaClinicalObservationRow = {
  observacao: string
  alerta: boolean
  integracao5Ps: string
}

export type PiccaModulo7Answers = {
  impressaoGeral: Record<string, PiccaClinicalObservationRow>
  comunicacao: Record<string, PiccaClinicalObservationRow>
  atencaoMotora: Record<string, PiccaClinicalObservationRow>
  afetoHumor: Record<string, PiccaClinicalObservationRow>
  interacaoSocial: Record<string, PiccaClinicalObservationRow>
  brincadeira: Record<string, PiccaClinicalObservationRow>
  textoRelatorio: string
  sinteseFortes: string
  sinteseVulnerabilidades: string
  sinteseHipoteses: string
  sinteseProvas: string
}

export const PICCA_MOD7_IMPRESSAO_GERAL = [
  { id: 'aspeto_geral', label: 'Aspeto geral' },
  { id: 'cuidados_higiene', label: 'Cuidados de higiene' },
  { id: 'postura', label: 'Postura' },
  { id: 'contacto_inicial', label: 'Contacto inicial' },
  { id: 'cooperacao', label: 'Cooperação' },
  { id: 'motivacao', label: 'Motivação' },
] as const

export const PICCA_MOD7_COMUNICACAO = [
  { id: 'contacto_ocular', label: 'Contacto ocular' },
  { id: 'expressao_facial', label: 'Expressão facial' },
  { id: 'compreensao_verbal', label: 'Compreensão verbal' },
  { id: 'expressao_verbal', label: 'Expressão verbal' },
  { id: 'pragmatica', label: 'Pragmática' },
  { id: 'prosodia', label: 'Prosódia' },
] as const

export const PICCA_MOD7_ATENCAO = [
  { id: 'atencao_sustentada', label: 'Atenção sustentada' },
  { id: 'distrabilidade', label: 'Distratibilidade' },
  { id: 'hiperatividade', label: 'Hiperatividade' },
  { id: 'impulsividade', label: 'Impulsividade' },
  { id: 'planeamento_motor', label: 'Planeamento motor' },
] as const

export const PICCA_MOD7_AFETO = [
  { id: 'humor_predominante', label: 'Humor predominante' },
  { id: 'labilidade', label: 'Labilidade emocional' },
  { id: 'ansiedade_observavel', label: 'Ansiedade observável' },
  { id: 'tolerancia_frustracao', label: 'Tolerância à frustração' },
] as const

export const PICCA_MOD7_INTERACAO = [
  { id: 'iniciativa_social', label: 'Iniciativa social' },
  { id: 'reciprocidade', label: 'Reciprocidade' },
  { id: 'relacao_pais', label: 'Relação com os pais' },
  { id: 'relacao_avaliador', label: 'Relação com o avaliador' },
] as const

export const PICCA_MOD7_BRINCADEIRA = [
  { id: 'jogo_simbolico', label: 'Jogo simbólico' },
  { id: 'criatividade', label: 'Criatividade' },
  { id: 'flexibilidade', label: 'Flexibilidade' },
  { id: 'interesses_restritos', label: 'Interesses restritos' },
] as const

export const defaultPiccaModulo7Answers = (): PiccaModulo7Answers => ({
  impressaoGeral: {},
  comunicacao: {},
  atencaoMotora: {},
  afetoHumor: {},
  interacaoSocial: {},
  brincadeira: {},
  textoRelatorio: '',
  sinteseFortes: '',
  sinteseVulnerabilidades: '',
  sinteseHipoteses: '',
  sinteseProvas: '',
})

export function mergePiccaModulo7Answers(raw: Record<string, unknown>): PiccaModulo7Answers {
  const defaults = defaultPiccaModulo7Answers()
  return { ...defaults, ...(raw as Partial<PiccaModulo7Answers>) }
}
