export const WISC_EVALUATION_OPTIONS = [
  { key: 'complemento_de_gravuras', label: 'Complemento de Gravuras' },
  { key: 'informacao', label: 'Informação' },
  { key: 'codigo', label: 'Código' },
  { key: 'semelhancas', label: 'Semelhanças' },
  { key: 'disposicao_de_gravuras', label: 'Disposição de Gravuras' },
  { key: 'aritmetica', label: 'Aritmética' },
  { key: 'cubos', label: 'Cubos' },
  { key: 'vocabularios', label: 'Vocabulários' },
  { key: 'composicao_de_objectos', label: 'Composição de Objectos' },
  { key: 'compreensao', label: 'Compreensão' },
  { key: 'pesquisa_de_simbolos', label: 'Pesquisa de Símbolos' },
  { key: 'memoria_de_digitos', label: 'Memória de Dígitos' },
  { key: 'labirintos', label: 'Labirintos' },
  { key: 'soma_dos_resultados_padronizados', label: 'Soma dos Resultados Padronizados' },
] as const

export const BANC_EVALUATION_OPTIONS = [
  { key: 'teste_de_orientacao', label: 'Teste de Orientação' },
  { key: 'reconhecimento_de_faces', label: 'Reconhecimento de Faces' },
  { key: 'lateralidade', label: 'Lateralidade' },
  { key: 'nomeacao_rapida', label: 'Nomeação Rápida' },
  { key: 'fluencia_verbal', label: 'Fluência Verbal' },
  { key: 'memoria_de_historias', label: 'Memória de Histórias' },
  { key: 'torre', label: 'Torre' },
  { key: 'cancelamento_de_sinais', label: 'Cancelamento de Sinais' },
  { key: 'figura_complexa_de_rey', label: 'Figura Complexa de Rey' },
  { key: 'compreensao_de_instrucoes', label: 'Compreensão de Instruções' },
  { key: 'consciencia_fonologica', label: 'Consciência Fonológica' },
  { key: 'lista_de_palavras', label: 'Lista de Palavras' },
  { key: 'trilhas', label: 'Trilhas' },
  { key: 'tabuleiro_de_corsi', label: 'Tabuleiro de Corsi' },
  { key: 'tabuleiro_de_motricidade', label: 'Tabuleiro de Motricidade' },
] as const

export type PatientEvaluationSelections = {
  wiscSelections: string[]
  bancSelections: string[]
}
