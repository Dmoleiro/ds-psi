import { mergePiccaModulo1Answers } from '../components/picca/modules/piccaModulo1'
import { mergePiccaModulo2Answers } from '../components/picca/modules/piccaModulo2'
import { mergePiccaModulo3Answers } from '../components/picca/modules/piccaModulo3'
import { mergePiccaModulo4Answers } from '../components/picca/modules/piccaModulo4'
import {
  mergePiccaModulo5Answers,
  PICCA_MOD5_INSTRUMENTS,
} from '../components/picca/modules/piccaModulo5'
import {
  mergePiccaModulo6Answers,
  PICCA_MOD6_ACADEMIC_ROWS,
} from '../components/picca/modules/piccaModulo6'
import {
  mergePiccaModulo7Answers,
  PICCA_MOD7_AFETO,
  PICCA_MOD7_ATENCAO,
  PICCA_MOD7_BRINCADEIRA,
  PICCA_MOD7_COMUNICACAO,
  PICCA_MOD7_IMPRESSAO_GERAL,
  PICCA_MOD7_INTERACAO,
} from '../components/picca/modules/piccaModulo7'
import {
  mergePiccaModulo8Answers,
  PICCA_MOD8_INSTRUMENTS,
} from '../components/picca/modules/piccaModulo8'
import {
  mergePiccaModulo9Answers,
  PICCA_MOD9_INDICADOR_COLUMNS,
  PICCA_MOD9_THERAPY_AREAS,
} from '../components/picca/modules/piccaModulo9'
import {
  mergePiccaModulo10Answers,
  PICCA_MOD10_FOLLOWUP_COLUMNS,
  PICCA_MOD10_INSTRUMENTS,
} from '../components/picca/modules/piccaModulo10'
import {
  mergePiccaVol6DisorderAnswers,
  mergePiccaVol6SinteseAnswers,
  type PiccaVol6HipoteseRow,
} from '../components/picca/modules/vol6/piccaVol6Answers'
import {
  PICCA_VOL6_BY_NUMBER,
  PICCA_VOL6_DISORDERS,
  PICCA_VOL6_SINTESE_TEXT_FIELDS,
  type Vol6IndicatorAnswer,
  type Vol6IndicatorGroup,
} from '../components/picca/modules/vol6/piccaVol6Content'
import { PICCA_VOL6_SINTESE_GROUPS } from '../components/picca/modules/vol6/piccaVol6SinteseContent'

export type PiccaPresentationField = {
  label: string
  value: string
}

export type PiccaPresentationSection = {
  title: string
  fields: PiccaPresentationField[]
}

const EM_DASH = '—'

const FREQUENCY_LABELS: Record<string, string> = {
  nunca: 'Nunca',
  as_vezes: 'Às vezes',
  frequentemente: 'Frequentemente',
}

const GRAVIDADE_LABELS: Record<string, string> = {
  ligeiro: 'Ligeiro',
  moderado: 'Moderado',
  grave: 'Grave',
}

const ANSIEDADE_LABELS: Record<string, string> = {
  ausente: 'Ausente',
  ligeira: 'Ligeira',
  moderada: 'Moderada',
  grave: 'Grave',
}

const SEGUE_INSTRUCOES_LABELS: Record<string, string> = {
  sim: 'Sim',
  parcialmente: 'Parcialmente',
  nao: 'Não',
}

const ADAPTACAO_LABELS: Record<string, string> = {
  facil: 'Fácil',
  moderada: 'Moderada',
  dificil: 'Difícil',
}

const ACADEMIC_LABELS: Record<string, string> = {
  sem: 'Sem dificuldade',
  alguma: 'Alguma dificuldade',
  significativa: 'Dificuldade significativa',
}

const ANTECEDENTES_COLUMNS = [
  { key: 'mae', label: 'Mãe' },
  { key: 'pai', label: 'Pai' },
  { key: 'famMaterna', label: 'Família materna' },
  { key: 'famPaterna', label: 'Família paterna' },
] as const

function text(value: string | null | undefined): string {
  const trimmed = value?.trim()
  return trimmed ? trimmed : EM_DASH
}

function simNao(value: '' | 'sim' | 'nao' | string | undefined): string {
  if (value === 'sim') return 'Sim'
  if (value === 'nao') return 'Não'
  return EM_DASH
}

function labelsFromIds(ids: string[], options: Record<string, string>): string {
  if (!ids.length) return EM_DASH
  return ids.map((id) => options[id] ?? id).join(', ')
}

function field(label: string, value: string): PiccaPresentationField {
  return { label, value }
}

function section(title: string, fields: PiccaPresentationField[]): PiccaPresentationSection | null {
  const visible = fields.filter((f) => f.value !== EM_DASH)
  if (visible.length === 0) return null
  return { title, fields: visible }
}

function formatAntecedentes(
  value: Record<string, { mae?: boolean; pai?: boolean; famMaterna?: boolean; famPaterna?: boolean }>,
  conditions: Record<string, string>,
): string {
  const lines: string[] = []
  for (const [id, label] of Object.entries(conditions)) {
    const row = value[id]
    if (!row) continue
    const cols = ANTECEDENTES_COLUMNS.filter((col) => row[col.key]).map((col) => col.label)
    if (cols.length > 0) {
      lines.push(`${label}: ${cols.join(', ')}`)
    }
  }
  return lines.length ? lines.join('\n') : EM_DASH
}

function formatFamilyTable(
  rows: Array<{
    name: string
    age: string
    parentesco: string
    viveCom: string
    qualidadeRelacao: string
  }>,
): string {
  const filled = rows.filter((row) =>
    Object.values(row).some((v) => v.trim()),
  )
  if (!filled.length) return EM_DASH
  return filled
    .map((row, index) => {
      const parts = [
        row.name && `Nome: ${row.name}`,
        row.age && `Idade: ${row.age}`,
        row.parentesco && `Parentesco: ${row.parentesco}`,
        row.viveCom && `Vive com a criança: ${row.viveCom}`,
        row.qualidadeRelacao && `Qualidade da relação: ${row.qualidadeRelacao}`,
      ].filter(Boolean)
      return parts.length ? `${index + 1}. ${parts.join(' · ')}` : ''
    })
    .filter(Boolean)
    .join('\n')
}

function formatFrequencyMatrix(
  rows: Record<string, string>,
  labels: Record<string, string>,
): string {
  const lines = Object.entries(labels)
    .map(([id, label]) => {
      const value = rows[id]
      if (!value) return null
      return `${label}: ${FREQUENCY_LABELS[value] ?? value}`
    })
    .filter(Boolean) as string[]
  return lines.length ? lines.join('\n') : EM_DASH
}

function formatAlertasSimple(
  rows: Record<string, { presente?: boolean; notas?: string }>,
  labels: Record<string, string>,
): string {
  const lines: string[] = []
  for (const [id, label] of Object.entries(labels)) {
    const row = rows[id]
    if (!row?.presente) continue
    const notas = row.notas?.trim()
    lines.push(notas ? `${label} (notas: ${notas})` : label)
  }
  return lines.length ? lines.join('\n') : EM_DASH
}

function formatAlertasWithSeverity(
  rows: Record<string, { presente?: boolean; notas?: string; gravidade?: string }>,
  labels: Record<string, string>,
): string {
  const lines: string[] = []
  for (const [id, label] of Object.entries(labels)) {
    const row = rows[id]
    if (!row?.presente) continue
    const parts = [label]
    if (row.gravidade) {
      parts.push(`gravidade: ${GRAVIDADE_LABELS[row.gravidade] ?? row.gravidade}`)
    }
    if (row.notas?.trim()) {
      parts.push(`notas: ${row.notas.trim()}`)
    }
    lines.push(parts.join(' — '))
  }
  return lines.length ? lines.join('\n') : EM_DASH
}

function formatModulo2(answers: Record<string, unknown>): PiccaPresentationSection[] {
  const a = mergePiccaModulo2Answers(answers)

  return [
    section('1. Fontes de Informação', [
      field(
        'Fontes de informação',
        labelsFromIds(a.fontesInformacao, {
          mae: 'Mãe',
          pai: 'Pai',
          ambos: 'Ambos',
          outro_cuidador: 'Outro cuidador',
          crianca: 'Criança/Adolescente',
          escola: 'Escola',
          relatorios: 'Relatórios anteriores',
          observacao: 'Observação Clínica',
          outros: 'Outros',
        }),
      ),
      field('Outros (especificar)', text(a.fontesOutros)),
    ]),
    section('2. Composição do Agregado Familiar', [
      field('Membros do agregado', formatFamilyTable(a.composicaoFamiliar)),
    ]),
    section('3. Alterações Familiares Significativas', [
      field(
        'Alterações assinaladas',
        labelsFromIds(a.alteracoesFamiliares, {
          separacao: 'Separação parental',
          divorcio: 'Divórcio',
          novo_companheiro: 'Novo companheiro',
          nascimento_irmao: 'Nascimento de irmão',
          falecimento: 'Falecimento',
          mudanca: 'Mudança de residência',
          institucionalizacao: 'Institucionalização',
          outro: 'Outro',
        }),
      ),
      field('Outro (especificar)', text(a.alteracoesOutro)),
    ]),
    section('4. Vinculação', [
      field(
        'Figura principal de vinculação',
        labelsFromIds(a.vinculacaoPrincipal, {
          mae: 'Mãe',
          pai: 'Pai',
          ambos: 'Ambos',
          avos: 'Avós',
          outro: 'Outro',
        }),
      ),
      field('Outro (especificar)', text(a.vinculacaoOutro)),
      field(
        'Reação à separação',
        labelsFromIds(a.reacaoSeparacao, {
          tranquilo: 'Tranquilo',
          ansiedade: 'Alguma ansiedade',
          chora: 'Chora',
          recusa: 'Recusa separar-se',
          crise: 'Crise intensa',
        }),
      ),
    ]),
    section('5. Relação Familiar', [
      field('Relação com a mãe', text(a.relacaoMae)),
      field('Relação com o pai', text(a.relacaoPai)),
      field('Relação com irmãos', text(a.relacaoIrmaos)),
    ]),
    section('6. Estilo Educativo', [
      field(
        'Características parentais',
        formatFrequencyMatrix(a.estiloEducativo, {
          regras: 'Regras consistentes',
          limites: 'Limites claros',
          reforco: 'Reforço positivo',
          gritos: 'Gritos',
          castigos: 'Castigos',
          negociacao: 'Negociação',
          sobreprotecao: 'Sobreproteção',
        }),
      ),
    ]),
    section('7. Antecedentes Familiares', [
      field(
        'Condições assinaladas',
        formatAntecedentes(a.antecedentes, {
          phda: 'PHDA',
          pea: 'PEA',
          dislexia: 'Dislexia',
          linguagem: 'Perturbações da Linguagem',
          ansiedade: 'Ansiedade',
          depressao: 'Depressão',
          epilepsia: 'Epilepsia',
          outras: 'Outras',
        }),
      ),
    ]),
    section('8. Acontecimentos de Vida Significativos', [
      field('Descrição', text(a.acontecimentosVida)),
    ]),
    section('9. Integração Clínica', [
      field('Fatores predisponentes', text(a.integracaoPredisponentes)),
      field('Fatores protetores', text(a.integracaoProtetores)),
      field('Vulnerabilidades', text(a.integracaoVulnerabilidades)),
      field('Recursos familiares', text(a.integracaoRecursos)),
      field('Hipóteses clínicas iniciais', text(a.integracaoHipoteses)),
      field('Questões a explorar', text(a.integracaoQuestoes)),
    ]),
  ].filter((s): s is PiccaPresentationSection => s !== null)
}

function formatModulo3(answers: Record<string, unknown>): PiccaPresentationSection[] {
  const a = mergePiccaModulo3Answers(answers)

  return [
    section('1. Planeamento da Gravidez', [
      field(
        'Planeamento',
        labelsFromIds(a.gravidezPlaneada, {
          planeada: 'Gravidez planeada',
          nao_planeada: 'Não planeada',
          fertilidade: 'Fertilidade medicamente assistida',
          risco: 'Gravidez de risco',
          sem_intercorrencias_final: 'Gravidez sem intercorrências até ao final da gestação',
        }),
      ),
      field('Idade materna', text(a.idadeMaterna)),
      field('Idade paterna', text(a.idadePaterna)),
      field('Observações', text(a.planeamentoObs)),
    ]),
    section('2. Gravidez', [
      field(
        'Intercorrências',
        labelsFromIds(a.gravidezIntercorrencias, {
          sem_intercorrencias: 'Sem intercorrências',
          diabetes: 'Diabetes gestacional',
          hipertensao: 'Hipertensão',
          preeclampsia: 'Pré-eclâmpsia',
          infeccoes: 'Infeções',
          hemorragias: 'Hemorragias',
          hospitalizacoes: 'Hospitalizações',
          alcool_tabaco_drogas: 'Consumo de álcool/tabaco/drogas',
          alcool_tabaco: 'Consumo de álcool/tabaco',
          enjoos_vomitos: 'Enjoos e vómitos',
          stress: 'Stress significativo',
          ansiedade: 'Ansiedade',
          depressao: 'Depressão',
        }),
      ),
      field('Medicação durante a gravidez', text(a.gravidezMedicacao)),
      field(
        'Durante a gravidez a criança era',
        labelsFromIds(a.gravidezCrianca, {
          agitada: 'Agitada',
          muito_mexida: 'Muito mexida',
          muito_calma: 'Demasiado calma e sem se mexer muito',
          ativa_noite: 'Mais ativa à noite',
          ativa_dia: 'Mais ativa durante o dia',
        }),
      ),
      field('Observações', text(a.gravidezObs)),
    ]),
    section('3. Parto', [
      field('Semanas de gestação', text(a.semanasGestacao)),
      field(
        'Tipo de parto',
        labelsFromIds(a.tipoParto, {
          eutocico: 'Eutócico',
          cesariana: 'Cesariana',
          ventosa: 'Ventosa',
          forceps: 'Fórceps',
        }),
      ),
      field('Peso', text(a.peso)),
      field('Comprimento', text(a.comprimento)),
      field("APGAR 1'", text(a.apgar1)),
      field("APGAR 5'", text(a.apgar5)),
      field("APGAR 10'", text(a.apgar10)),
      field('Complicações', text(a.partoComplicacoes)),
    ]),
    section('4. Período Neonatal', [
      field(
        'Indicadores',
        labelsFromIds(a.neonatal, {
          alta_mae: 'Alta com a mãe',
          neonatologia: 'Internamento em Neonatologia',
          ictericia: 'Icterícia',
          convulsoes: 'Convulsões',
          respiratorias: 'Dificuldades respiratórias',
          alimentacao_materna: 'Alimentação materna',
          alimentacao: 'Alimentação',
        }),
      ),
      field('Observações', text(a.neonatalObs)),
    ]),
    section('5. Primeiros Meses de Vida', [
      field('Sono', text(a.sono)),
      field(
        'Padrão de sono',
        labelsFromIds(a.sonoRegular, {
          regular: 'Regular',
          interrupcoes: 'Com interrupções',
        }),
      ),
      field('Horas de sono noturnas', text(a.sonoHorasNoturnas)),
      field('Berço no quarto dos pais até (meses)', text(a.berçoQuartosPaisMeses)),
      field('Quarto próprio aos (meses/anos)', text(a.quartoProprioIdade)),
      field('Alimentação', text(a.alimentacao)),
      field(
        'Tipo de alimentação',
        labelsFromIds(a.alimentacaoTipo, {
          materna: 'Alimentação exclusivamente materna',
          formula: 'Alimentação com leite de fórmula',
          ambas: 'Ambas',
        }),
      ),
      field(
        'Temperamento',
        labelsFromIds(a.temperamento, {
          calmo: 'Calmo',
          irritavel: 'Irritável',
          ativo: 'Muito ativo',
          dificil: 'Difícil de consolar',
        }),
      ),
      field('Vinculação precoce', text(a.vinculacaoPrecoce)),
      field(
        'Vinculação com',
        labelsFromIds(a.vinculacaoTipo, {
          mae: 'Mãe exclusivamente',
          pai: 'Pai exclusivamente',
          ambos: 'Ambos',
          outro: 'Outro cuidador/familiar',
        }),
      ),
      field('Outro cuidador/familiar', text(a.vinculacaoOutroCuidador)),
      field('Alterações auditivas', simNao(a.alteracoesAuditivas)),
      field('Convulsões febris', simNao(a.convulsoesFebris)),
    ]),
    section('Indicadores Clínicos de Alerta', [
      field(
        'Indicadores presentes',
        formatAlertasSimple(a.alertas, {
          prematuridade: 'Prematuridade (<37 semanas)',
          baixo_peso: 'Baixo peso ao nascer',
          hipoxia: 'Hipóxia/sofrimento fetal',
          internamento: 'Internamento neonatal',
          substancias: 'Exposição pré-natal a substâncias',
          obstetricas: 'Complicações obstétricas',
        }),
      ),
    ]),
    section('Integração Clínica', [
      field('Fatores predisponentes identificados', text(a.integracaoPredisponentes)),
      field('Fatores protetores', text(a.integracaoProtetores)),
      field('Questões a explorar', text(a.integracaoQuestoes)),
      field('Hipóteses clínicas iniciais', text(a.integracaoHipoteses)),
    ]),
  ].filter((s): s is PiccaPresentationSection => s !== null)
}

function formatModulo4(answers: Record<string, unknown>): PiccaPresentationSection[] {
  const a = mergePiccaModulo4Answers(answers)

  return [
    section('1. Desenvolvimento Motor Grosso', [
      field('Sentou sem apoio', text(a.sentouSemApoio)),
      field('Gatinhou', text(a.gatinhou)),
      field('Primeiros passos', text(a.primeirosPassos)),
      field('Subia escadas', text(a.subiaEscadas)),
      field('Observações', text(a.motorGrossoObs)),
    ]),
    section('2. Desenvolvimento Motor Fino', [
      field('Preensão adequada', simNao(a.preensaoAdequada)),
      field('Manipulação de objetos', text(a.manipulacaoObjetos)),
      field('Grafomotricidade', text(a.grafomotricidade)),
    ]),
    section('3. Desenvolvimento da Linguagem', [
      field('Primeiras palavras', text(a.primeirasPalavras)),
      field('Primeiras frases', text(a.primeirasFrases)),
      field('Compreensão', text(a.compreensao)),
      field('Expressão', text(a.expressao)),
      field('Pragmática', text(a.pragmatica)),
      field('Atraso no desenvolvimento da linguagem', simNao(a.atrasoLinguagem)),
    ]),
    section('4. Comunicação Social', [
      field(
        'Indicadores',
        labelsFromIds(a.comunicacaoSocial, {
          contacto_ocular: 'Contacto ocular adequado',
          aponta: 'Aponta para partilhar interesses',
          responde_nome: 'Responde ao nome',
          inicia_interacao: 'Inicia interação',
          mantem_conversa: 'Mantém conversação',
          adulto_extensao: 'Usa o adulto como extensão dele próprio para atingir o que quer',
        }),
      ),
    ]),
    section('5. Brincadeira', [
      field(
        'Tipos de brincadeira',
        labelsFromIds(a.brincadeira, {
          exploratoria: 'Exploratória',
          funcional: 'Funcional',
          simbolica: 'Simbólica',
          regras: 'Regras',
        }),
      ),
      field('Brincadeiras preferidas', text(a.brincadeirasPreferidas)),
    ]),
    section('6. Desenvolvimento Emocional', [
      field('Reconhece emoções', text(a.reconheceEmocoes)),
      field('Expressa emoções', text(a.expressaEmocoes)),
      field('Regulação emocional', text(a.regulacaoEmocional)),
      field('Regula emoções sem adulto', simNao(a.regulacaoSemAdulto)),
    ]),
    section('7. Autonomia', [
      field('Vestir-se', text(a.vestir)),
      field('Alimentação', text(a.alimentacaoAutonomia)),
      field('Higiene', text(a.higiene)),
      field('Controlo de esfíncteres', text(a.controloEsfinteres)),
      field(
        'Tipo de controlo',
        labelsFromIds(a.controloEsfinteresTipo, {
          noturno: 'Noturno',
          diurno: 'Diurno',
        }),
      ),
    ]),
    section('8. Perfil Sensorial', [
      field(
        'Indicadores',
        labelsFromIds(a.perfilSensorial, {
          hipersens_auditiva: 'Hipersensibilidade auditiva',
          hipossens: 'Hipossensibilidade',
          seletividade: 'Seletividade alimentar',
          procura: 'Procura sensorial',
        }),
      ),
      field('Observações', text(a.perfilSensorialObs)),
    ]),
    section('Indicadores Clínicos de Alerta', [
      field(
        'Indicadores presentes',
        formatAlertasWithSeverity(a.alertas, {
          atraso_motor: 'Atraso motor',
          atraso_linguagem: 'Atraso da linguagem',
          jogo_simbolico: 'Ausência de jogo simbólico',
          contacto_ocular: 'Défice de contacto ocular',
          rigidez: 'Rigidez comportamental',
          autorregulacao: 'Dificuldades de autorregulação',
          coordenacao: 'Coordenação motora fraca',
          atraso_adaptativo: 'Atraso adaptativo',
        }),
      ),
    ]),
    section('Integração Clínica', [
      field('Áreas fortes', text(a.integracaoFortes)),
      field('Vulnerabilidades', text(a.integracaoVulnerabilidades)),
      field('Fatores predisponentes', text(a.integracaoPredisponentes)),
      field('Hipóteses clínicas', text(a.integracaoHipoteses)),
      field('Avaliações complementares sugeridas', text(a.integracaoAvaliacoes)),
    ]),
  ].filter((s): s is PiccaPresentationSection => s !== null)
}

function formatCaregiver(
  label: string,
  info: {
    nome: string
    idade: string
    escolaridade: string
    profissao: string
    contacto: string
  },
): string {
  const parts = [
    info.nome && `Nome: ${info.nome}`,
    info.idade && `Idade: ${info.idade}`,
    info.escolaridade && `Escolaridade: ${info.escolaridade}`,
    info.profissao && `Profissão: ${info.profissao}`,
    info.contacto && `Contacto: ${info.contacto}`,
  ].filter(Boolean)
  return parts.length ? `${label}: ${parts.join(' · ')}` : EM_DASH
}

function formatInstrumentTable(
  value: Record<string, { resultados?: string; integracao?: string }>,
  instruments: ReadonlyArray<{ id: string; label: string }>,
): string {
  const lines: string[] = []
  for (const inst of instruments) {
    const row = value[inst.id]
    if (!row?.resultados?.trim() && !row?.integracao?.trim()) continue
    const parts = [
      row.resultados?.trim() && `Resultados: ${row.resultados.trim()}`,
      row.integracao?.trim() && `Integração: ${row.integracao.trim()}`,
    ].filter(Boolean)
    lines.push(`${inst.label}: ${parts.join(' · ')}`)
  }
  return lines.length ? lines.join('\n') : EM_DASH
}

function formatClinicalObservationTable(
  value: Record<string, { observacao?: string; alerta?: boolean; integracao5Ps?: string }>,
  rows: ReadonlyArray<{ id: string; label: string }>,
): string {
  const lines: string[] = []
  for (const row of rows) {
    const entry = value[row.id]
    if (!entry) continue
    const parts = [
      entry.observacao?.trim() && `Obs.: ${entry.observacao.trim()}`,
      entry.alerta && 'Alerta',
      entry.integracao5Ps?.trim() && `5 P's: ${entry.integracao5Ps.trim()}`,
    ].filter(Boolean)
    if (parts.length) lines.push(`${row.label}: ${parts.join(' · ')}`)
  }
  return lines.length ? lines.join('\n') : EM_DASH
}

function formatAcademicMatrix(
  value: Record<string, string>,
  rows: ReadonlyArray<{ id: string; label: string }>,
): string {
  const lines = rows
    .map((row) => {
      const level = value[row.id]
      if (!level) return null
      return `${row.label}: ${ACADEMIC_LABELS[level] ?? level}`
    })
    .filter(Boolean) as string[]
  return lines.length ? lines.join('\n') : EM_DASH
}

function formatModulo1(answers: Record<string, unknown>): PiccaPresentationSection[] {
  const a = mergePiccaModulo1Answers(answers)

  return [
    section('1. Dados da Criança', [
      field('Nome completo', text(a.nomeCompleto)),
      field('Data de nascimento', text(a.dataNascimento)),
      field('Idade', text(a.idade)),
      field('Sexo', text(a.sexo)),
      field('Ano de escolaridade', text(a.anoEscolaridade)),
      field('Escola', text(a.escola)),
      field('Turma', text(a.turma)),
      field('Professor(a)/DT', text(a.professor)),
      field('Morada', text(a.morada)),
      field('Contacto', text(a.contacto)),
      field('NIF', text(a.nif)),
      field('N.º SNS', text(a.sns)),
      field('Seguro de Saúde n.º', text(a.seguroSaude)),
    ]),
    section('2. Pais/Cuidadores', [
      field('Mãe', formatCaregiver('Mãe', a.mae)),
      field('Pai', formatCaregiver('Pai', a.pai)),
      field('Outros cuidadores — quem?', text(a.outrosCuidadoresQuem)),
      field('Outro cuidador', formatCaregiver('Outro cuidador', a.outroCuidador)),
    ]),
    section('3. Motivo da Referenciação', [
      field(
        'Quem encaminhou',
        labelsFromIds(a.encaminhado, {
          pais: 'Pais',
          escola: 'Escola',
          pediatra: 'Pediatra',
          neuropediatra: 'Neuropediatra',
          psicologo: 'Psicólogo',
          medico_familia: 'Médico de Família',
          outro: 'Outro',
        }),
      ),
      field('Outro (especificar)', text(a.encaminhadoOutro)),
      field('Motivo principal', text(a.motivoPrincipal)),
    ]),
    section('3.1 Consulta de Psicologia', [
      field(
        'Alguma vez esteve em consulta de Psicologia?',
        a.consultaPsicologia === 'sim' ? 'Sim' : a.consultaPsicologia === 'nao' ? 'Não' : EM_DASH,
      ),
      field('Motivo da consulta', text(a.consultaPsicologiaMotivo)),
    ]),
    section('4. Objetivos da Referenciação/Avaliação', [
      field(
        'Objetivos',
        labelsFromIds(a.objetivos, {
          desenvolvimento: 'Desenvolvimento',
          aprendizagem: 'Aprendizagem',
          phda: 'PHDA',
          pea: 'PEA',
          linguagem: 'Linguagem',
          emocoes: 'Emoções',
          comportamento: 'Comportamento',
          outro: 'Outro',
          sem_motivo_diagnosticado: 'Sem motivo aparentemente diagnosticado',
        }),
      ),
      field('Outro objetivo', text(a.objetivosOutro)),
      field('Principais preocupações até ao momento', text(a.principaisPreocupacoes)),
      field(
        'Já fez consultas de outra especialidade?',
        a.consultaOutraEspecialidade === 'sim'
          ? 'Sim'
          : a.consultaOutraEspecialidade === 'nao'
            ? 'Não'
            : EM_DASH,
      ),
      field('Especialidade', text(a.consultaOutraEspecialidadeQual)),
      field('Motivo da consulta (outra especialidade)', text(a.consultaOutraEspecialidadeMotivo)),
      field('Resultado da consulta', text(a.consultaOutraEspecialidadeResultado)),
    ]),
    section('Síntese Clínica Inicial', [
      field('Principais preocupações', text(a.sintesePreocupacoes)),
      field('Fatores predisponentes', text(a.sintesePredisponentes)),
      field('Fatores protetores', text(a.sinteseProtetores)),
      field('Hipóteses clínicas iniciais', text(a.sinteseHipoteses)),
    ]),
  ].filter((s): s is PiccaPresentationSection => s !== null)
}

function formatModulo5(answers: Record<string, unknown>): PiccaPresentationSection[] {
  const a = mergePiccaModulo5Answers(answers)

  return [
    section('Atenção e Funções Executivas', [
      field(
        'Mantém a atenção nas tarefas',
        a.mantemAtencao ? FREQUENCY_LABELS[a.mantemAtencao] ?? a.mantemAtencao : EM_DASH,
      ),
      field(
        'Segue instruções',
        a.segueInstrucoes ? SEGUE_INSTRUCOES_LABELS[a.segueInstrucoes] ?? a.segueInstrucoes : EM_DASH,
      ),
      field('Planeamento/organização', text(a.planeamentoOrganizacao)),
      field('Flexibilidade cognitiva', text(a.flexibilidadeCognitiva)),
      field('Completa tarefas e conclui as mesmas', text(a.completaTarefas)),
    ]),
    section('Memória e Aprendizagem', [
      field('Memória imediata', text(a.memoriaImediata)),
      field('Memória de trabalho', text(a.memoriaTrabalho)),
      field('Leitura', text(a.leitura)),
      field('Escrita', text(a.escrita)),
      field('Matemática', text(a.matematica)),
    ]),
    section('Linguagem', [
      field('Compreensão verbal', text(a.compreensaoVerbal)),
      field('Expressão verbal', text(a.expressaoVerbal)),
      field('Pragmática', text(a.pragmatica)),
    ]),
    section('Funcionamento Emocional', [
      field('Reconhecimento emocional', text(a.reconhecimentoEmocional)),
      field('Regulação emocional', text(a.regulacaoEmocional)),
      field(
        'Ansiedade',
        a.ansiedade ? ANSIEDADE_LABELS[a.ansiedade] ?? a.ansiedade : EM_DASH,
      ),
      field('Autoestima', text(a.autoestima)),
      field('Medos', text(a.medos)),
      field('Evitamentos', text(a.evitamentos)),
      field('Recusas', text(a.recusas)),
    ]),
    section('Comportamento', [
      field('Impulsividade', text(a.impulsividade)),
      field('Agressividade', text(a.agressividade)),
      field('Oposição', text(a.oposicao)),
      field('Rigidez', text(a.rigidez)),
    ]),
    section('Competências Sociais', [
      field('Relação com pares', text(a.relacaoPares)),
      field('Relação com adultos', text(a.relacaoAdultos)),
      field('Empatia', text(a.empatia)),
      field('Bullying', text(a.bullying)),
      field('Prefere estar com adultos', simNao(a.prefereAdultos)),
      field('Tem amigos preferidos', simNao(a.amigosPreferidos)),
    ]),
    section('Autonomia', [
      field('Higiene pessoal', text(a.higienePessoal)),
      field('Gestão de rotinas', text(a.gestaoRotinas)),
      field('Trabalhos de casa', text(a.trabalhosCasa)),
      field('Precisa de ajuda para estas tarefas', simNao(a.precisaAjudaTarefas)),
    ]),
    section('Sono e Alimentação', [
      field('Qualidade do sono', text(a.qualidadeSono)),
      field('Hábitos alimentares', text(a.habitosAlimentares)),
      field('N.º horas de sono', text(a.horasSono)),
      field('Hora de deitar', text(a.horaDeitar)),
      field('Hora de acordar', text(a.horaAcordar)),
      field('Despertares noturnos', simNao(a.despertaresNoturnos)),
    ]),
    section('Integração com Instrumentos de Avaliação', [
      field('Instrumentos', formatInstrumentTable(a.instrumentos, PICCA_MOD5_INSTRUMENTS)),
    ]),
    section('Síntese Clínica do Funcionamento Atual', [
      field('Áreas fortes', text(a.sinteseFortes)),
      field('Principais dificuldades', text(a.sinteseDificuldades)),
      field('Impacto funcional', text(a.sinteseImpacto)),
      field('Fatores de manutenção', text(a.sinteseManutencao)),
      field('Objetivos prioritários', text(a.sinteseObjetivos)),
      field('Notas clínicas', text(a.notasClinicas)),
    ]),
  ].filter((s): s is PiccaPresentationSection => s !== null)
}

function formatModulo6(answers: Record<string, unknown>): PiccaPresentationSection[] {
  const a = mergePiccaModulo6Answers(answers)

  return [
    section('Creche', [
      field('Idade de ingresso', text(a.crecheIngresso)),
      field(
        'Adaptação',
        a.crecheAdaptacao ? ADAPTACAO_LABELS[a.crecheAdaptacao] ?? a.crecheAdaptacao : EM_DASH,
      ),
      field('Relação com educadores', text(a.crecheEducadores)),
      field('Relação com pares', text(a.crechePares)),
      field('Principais observações', text(a.crecheObs)),
      field('N.º horas por semana na creche', text(a.crecheHorasSemana)),
    ]),
    section('Pré-Escolar', [
      field('Idade de ingresso', text(a.preEscolarIngresso)),
      field(
        'Adaptação',
        a.preEscolarAdaptacao
          ? ADAPTACAO_LABELS[a.preEscolarAdaptacao] ?? a.preEscolarAdaptacao
          : EM_DASH,
      ),
      field('Relação com educadores', text(a.preEscolarEducadores)),
      field('Relação com pares', text(a.preEscolarPares)),
      field('Principais observações', text(a.preEscolarObs)),
      field('N.º horas por semana na pré-escola', text(a.preEscolarHorasSemana)),
    ]),
    section('1.º Ciclo', [
      field('Adaptação ao 1.º ciclo', text(a.ciclo1Adaptacao)),
      field('Dificuldades de leitura', text(a.ciclo1Leitura)),
      field('Dificuldades de escrita', text(a.ciclo1Escrita)),
      field('Dificuldades de matemática', text(a.ciclo1Matematica)),
      field('Comportamento em sala', text(a.ciclo1Comportamento)),
    ]),
    section('2.º/3.º Ciclo e Secundário', [
      field('Adaptação às mudanças de ciclo', text(a.ciclo23Adaptacao)),
      field('Organização do estudo', text(a.ciclo23Organizacao)),
      field('Motivação escolar', text(a.ciclo23Motivacao)),
      field('Relação com professores', text(a.ciclo23Professores)),
      field('Relação com colegas', text(a.ciclo23Colegas)),
    ]),
    section('Funcionamento Académico Atual', [
      field('Domínios', formatAcademicMatrix(a.academicoAtual, PICCA_MOD6_ACADEMIC_ROWS)),
    ]),
    section('Apoios Educativos', [
      field(
        'Apoios',
        labelsFromIds(a.apoiosEducativos, {
          medidas_universais: 'Medidas Universais',
          medidas_seletivas: 'Medidas Seletivas',
          medidas_adicionais: 'Medidas Adicionais',
          terapia_fala: 'Terapia da Fala',
          psicologia: 'Psicologia',
          educacao_especial: 'Educação Especial',
          outro: 'Outro',
        }),
      ),
      field('Outro apoio', text(a.apoiosOutro)),
    ]),
    section('Participação Escolar', [
      field('Assiduidade', text(a.assiduidade)),
      field('Pontualidade', text(a.pontualidade)),
      field('Participação em sala', text(a.participacaoSala)),
      field('Autonomia nas tarefas', text(a.autonomiaTarefas)),
    ]),
    section('Integração Clínica', [
      field('Fatores protetores escolares', text(a.integracaoProtetores)),
      field('Fatores de risco escolares', text(a.integracaoRiscos)),
      field('Impacto funcional', text(a.integracaoImpacto)),
      field('Necessidades educativas', text(a.integracaoNecessidades)),
      field('Recomendações iniciais', text(a.integracaoRecomendacoes)),
    ]),
  ].filter((s): s is PiccaPresentationSection => s !== null)
}

function formatModulo7(answers: Record<string, unknown>): PiccaPresentationSection[] {
  const a = mergePiccaModulo7Answers(answers)

  return [
    section('1. Impressão Geral', [
      field('Observações', formatClinicalObservationTable(a.impressaoGeral, PICCA_MOD7_IMPRESSAO_GERAL)),
    ]),
    section('2. Comunicação e Linguagem', [
      field('Observações', formatClinicalObservationTable(a.comunicacao, PICCA_MOD7_COMUNICACAO)),
    ]),
    section('3. Atenção e Atividade Motora', [
      field('Observações', formatClinicalObservationTable(a.atencaoMotora, PICCA_MOD7_ATENCAO)),
    ]),
    section('4. Afeto e Humor', [
      field('Observações', formatClinicalObservationTable(a.afetoHumor, PICCA_MOD7_AFETO)),
    ]),
    section('5. Interação Social', [
      field('Observações', formatClinicalObservationTable(a.interacaoSocial, PICCA_MOD7_INTERACAO)),
    ]),
    section('6. Brincadeira e Exploração', [
      field('Observações', formatClinicalObservationTable(a.brincadeira, PICCA_MOD7_BRINCADEIRA)),
    ]),
    section('Texto para Relatório', [field('Observação clínica', text(a.textoRelatorio))]),
    section('Síntese Clínica', [
      field('Pontos fortes', text(a.sinteseFortes)),
      field('Vulnerabilidades', text(a.sinteseVulnerabilidades)),
      field('Hipóteses diferenciais', text(a.sinteseHipoteses)),
      field('Provas complementares sugeridas', text(a.sinteseProvas)),
    ]),
  ].filter((s): s is PiccaPresentationSection => s !== null)
}

function formatObjectiveList(items: string[]): string {
  const filled = items.map((item) => item.trim()).filter(Boolean)
  return filled.length ? filled.map((item, i) => `${i + 1}. ${item}`).join('\n') : EM_DASH
}

function formatTherapyPlanTable(
  value: Record<string, Record<string, string>>,
  areas: ReadonlyArray<{ id: string; label: string }>,
  columns: ReadonlyArray<{ key: string; label: string }>,
): string {
  const lines: string[] = []
  for (const area of areas) {
    const row = value[area.id]
    if (!row) continue
    const parts = columns
      .map((col) => {
        const val = row[col.key]?.trim()
        return val ? `${col.label}: ${val}` : null
      })
      .filter(Boolean)
    if (parts.length) lines.push(`${area.label}: ${parts.join(' · ')}`)
  }
  return lines.length ? lines.join('\n') : EM_DASH
}

function formatDynamicTable(
  rows: Array<Record<string, string>>,
  columns: ReadonlyArray<{ key: string; label: string }>,
): string {
  const lines = rows
    .map((row, index) => {
      const parts = columns
        .map((col) => {
          const val = row[col.key]?.trim()
          return val ? `${col.label}: ${val}` : null
        })
        .filter(Boolean)
      return parts.length ? `${index + 1}. ${parts.join(' · ')}` : null
    })
    .filter(Boolean) as string[]
  return lines.length ? lines.join('\n') : EM_DASH
}

function formatInstrumentReportTable(
  value: Record<string, { data?: string; conclusoes?: string }>,
  instruments: ReadonlyArray<{ id: string; label: string }>,
): string {
  const lines: string[] = []
  for (const inst of instruments) {
    const row = value[inst.id]
    if (!row?.data?.trim() && !row?.conclusoes?.trim()) continue
    const parts = [
      row.data?.trim() && `Data: ${row.data.trim()}`,
      row.conclusoes?.trim() && `Conclusões: ${row.conclusoes.trim()}`,
    ].filter(Boolean)
    lines.push(`${inst.label}: ${parts.join(' · ')}`)
  }
  return lines.length ? lines.join('\n') : EM_DASH
}

function formatModulo8(answers: Record<string, unknown>): PiccaPresentationSection[] {
  const a = mergePiccaModulo8Answers(answers)

  return [
    section('1. Motivo Principal da Avaliação', [field('Motivo principal', text(a.motivoPrincipal))]),
    section('2. Síntese da Informação Recolhida', [
      field('Síntese', text(a.sinteseInformacao)),
    ]),
    section('3. Integração dos Instrumentos de Avaliação', [
      field('Instrumentos', formatInstrumentTable(a.instrumentos, PICCA_MOD8_INSTRUMENTS)),
    ]),
    section('4. Formulação Clínica (Modelo dos 5 P\'s)', [
      field('Problema Principal', text(a.cincoPsProblema)),
      field('Fatores Predisponentes', text(a.cincoPsPredisponentes)),
      field('Fatores Precipitantes', text(a.cincoPsPrecipitantes)),
      field('Fatores Perpetuantes', text(a.cincoPsPerpetuantes)),
      field('Fatores Protetores', text(a.cincoPsProtetores)),
    ]),
    section('5. Formulação Cognitivo-Comportamental', [
      field('Situação desencadeante', text(a.cbtSituacaoDesencadeante)),
      field('Pensamentos automáticos', text(a.cbtPensamentosAutomaticos)),
      field('Emoções', text(a.cbtEmocoes)),
      field('Respostas fisiológicas', text(a.cbtRespostasFisiologicas)),
      field('Comportamentos', text(a.cbtComportamentos)),
      field('Consequências', text(a.cbtConsequencias)),
      field('Manutenção do problema', text(a.cbtManutencao)),
    ]),
    section('6. Áreas Fortes', [field('Áreas fortes', text(a.areasFortes))]),
    section('7. Vulnerabilidades', [field('Vulnerabilidades', text(a.vulnerabilidades))]),
    section('8. Hipóteses Clínicas', [field('Hipóteses clínicas', text(a.hipotesesClinicas))]),
    section('9. Impacto Funcional', [field('Impacto funcional', text(a.impactoFuncional))]),
    section('10. Objetivos Prioritários da Intervenção', [
      field('Curto prazo', formatObjectiveList(a.objetivosCurtoPrazo)),
      field('Médio prazo', formatObjectiveList(a.objetivosMedioPrazo)),
      field('Longo prazo', formatObjectiveList(a.objetivosLongoPrazo)),
    ]),
    section('11. Recomendações Iniciais', [
      field('Recomendações', text(a.recomendacoesIniciais)),
    ]),
    section('12. Impressão Clínica Global', [
      field('Impressão clínica global', text(a.impressaoClinicaGlobal)),
    ]),
  ].filter((s): s is PiccaPresentationSection => s !== null)
}

function formatModulo9(answers: Record<string, unknown>): PiccaPresentationSection[] {
  const a = mergePiccaModulo9Answers(answers)
  const therapyColumns = [
    { key: 'objetivo', label: 'Objetivo' },
    { key: 'estrategias', label: 'Estratégias' },
    { key: 'responsavel', label: 'Responsável' },
    { key: 'prazo', label: 'Prazo' },
  ]

  return [
    section('1. Diagnóstico Clínico / Hipóteses Diagnósticas', [
      field('Diagnóstico / hipóteses', text(a.diagnosticoHipoteses)),
    ]),
    section('2. Prioridades de Intervenção', [
      field('Prioridades', text(a.prioridadesIntervencao)),
    ]),
    section('3. Objetivos SMART', [field('Objetivos SMART', text(a.objetivosSmart))]),
    section('4. Plano Terapêutico por Área', [
      field(
        'Plano',
        formatTherapyPlanTable(a.planoTerapeutico, PICCA_MOD9_THERAPY_AREAS, therapyColumns),
      ),
    ]),
    section('5. Estratégias para a Família', [field('Estratégias', text(a.estrategiasFamilia))]),
    section('6. Estratégias para a Escola', [field('Estratégias', text(a.estrategiasEscola))]),
    section('7. Articulação Multidisciplinar', [
      field('Articulação', text(a.articulacaoMultidisciplinar)),
    ]),
    section('8. Indicadores de Evolução', [
      field(
        'Indicadores',
        formatDynamicTable(a.indicadoresEvolucao, PICCA_MOD9_INDICADOR_COLUMNS),
      ),
    ]),
    section('9. Cronograma de Reavaliação', [
      field(
        'Prazos',
        labelsFromIds(a.reavaliacao, {
          '3_meses': '3 meses',
          '6_meses': '6 meses',
          '12_meses': '12 meses',
          outro: 'Outro',
        }),
      ),
      field('Outro prazo', text(a.reavaliacaoOutro)),
    ]),
    section('10. Critérios de Alta / Continuidade', [field('Critérios', text(a.criteriosAlta))]),
    section('11. Notas Clínicas', [field('Notas', text(a.notasClinicas))]),
  ].filter((s): s is PiccaPresentationSection => s !== null)
}

function formatModulo10(answers: Record<string, unknown>): PiccaPresentationSection[] {
  const a = mergePiccaModulo10Answers(answers)

  return [
    section('1. Identificação do Caso', [field('Identificação', text(a.identificacaoCaso))]),
    section('2. Motivo da Avaliação', [field('Motivo', text(a.motivoAvaliacao))]),
    section('3. Instrumentos Aplicados', [
      field(
        'Instrumentos',
        formatInstrumentReportTable(a.instrumentosAplicados, PICCA_MOD10_INSTRUMENTS),
      ),
    ]),
    section('4. Síntese dos Resultados', [field('Síntese', text(a.sinteseResultados))]),
    section('5. Formulação Clínica Integrada', [
      field('Formulação', text(a.formulacaoClinica)),
    ]),
    section('6. Hipóteses Diagnósticas (DSM-5-TR / CID-11)', [
      field('Hipóteses diagnósticas', text(a.hipotesesDiagnosticas)),
    ]),
    section('7. Diagnóstico Diferencial', [
      field('Diagnóstico diferencial', text(a.diagnosticoDiferencial)),
    ]),
    section('8. Recomendações', [field('Recomendações', text(a.recomendacoes))]),
    section('9. Plano de Follow-up', [
      field('Plano', formatDynamicTable(a.planoFollowup, PICCA_MOD10_FOLLOWUP_COLUMNS)),
    ]),
    section('10. Registo da Devolução aos Cuidadores/Escola', [
      field(
        'Devolução',
        labelsFromIds(a.devolucao, {
          pais: 'Devolução aos pais/cuidadores',
          escola: 'Devolução à escola',
          relatorio: 'Relatório entregue',
          plano: 'Plano explicado',
        }),
      ),
      field('Observações', text(a.devolucaoObservacoes)),
    ]),
    section('11. Assinatura do Psicólogo', [
      field('Assinatura', text(a.assinaturaPsicologo)),
    ]),
  ].filter((s): s is PiccaPresentationSection => s !== null)
}

const VOL6_NIVEL_LABELS: Record<string, string> = {
  n: 'N — não observado',
  o: 'O — observado mas insuficientemente caracterizado',
  f: 'F — evidência frequente, persistente e clinicamente relevante',
}

const VOL6_HIPOTESE_COLUMNS = [
  { key: 'hipotese', label: 'Hipótese' },
  { key: 'evidenciaAFavor', label: 'Evidência a favor' },
  { key: 'evidenciaContra', label: 'Evidência contra' },
  { key: 'dadosEmFalta', label: 'Dados em falta' },
  { key: 'estado', label: 'Estado' },
] as const

function formatVol6IndicatorTable(
  indicadores: Record<string, Vol6IndicatorAnswer>,
  groups: ReadonlyArray<Vol6IndicatorGroup>,
): string {
  const lines: string[] = []
  for (const group of groups) {
    for (const item of group.items) {
      const row = indicadores[item.id]
      if (!row?.nivel) continue
      const fontes = [
        row.casa && 'Casa',
        row.escola && 'Escola',
        row.clinica && 'Clínica',
        row.outros && 'Outros',
      ].filter(Boolean)
      const parts = [VOL6_NIVEL_LABELS[row.nivel] ?? row.nivel]
      if (fontes.length) parts.push(`Fontes: ${fontes.join(', ')}`)
      if (row.notas?.trim()) parts.push(`Notas: ${row.notas.trim()}`)
      lines.push(`${item.label}: ${parts.join(' · ')}`)
    }
  }
  return lines.length ? lines.join('\n') : EM_DASH
}

function formatVol6Disorder(number: number, answers: Record<string, unknown>): PiccaPresentationSection[] {
  const definition = PICCA_VOL6_BY_NUMBER[number]
  const a = mergePiccaVol6DisorderAnswers(number, answers)
  if (!definition) return []

  return [
    ...(definition.guidance
      ? [section('Orientação clínica', [field('Orientação', text(definition.guidance))])]
      : []),
    ...definition.groups.map((group, index) =>
      section(`${index + 1}. ${group.title}`, [
        field('Indicadores', formatVol6IndicatorTable(a.indicadores, [group])),
      ]),
    ),
    section('Integração clínica', [
      field('Diagnóstico diferencial e comorbilidades', text(a.diagnosticoDiferencial)),
      field('Instrumentos e fontes', text(a.instrumentosFontes)),
      field('Síntese clínica e hipótese provisória', text(a.sinteseHipotese)),
    ]),
  ].filter((s): s is PiccaPresentationSection => s !== null)
}

function formatVol6Sintese(answers: Record<string, unknown>): PiccaPresentationSection[] {
  const a = mergePiccaVol6SinteseAnswers(answers)

  return [
    ...PICCA_VOL6_SINTESE_GROUPS.map((group, index) =>
      section(`${index + 1}. ${group.title}`, [
        field('Indicadores', formatVol6IndicatorTable(a.indicadores, [group])),
      ]),
    ),
    section('Mapa de hipóteses', [
      field(
        'Hipóteses',
        formatDynamicTable(a.mapaHipoteses as PiccaVol6HipoteseRow[], VOL6_HIPOTESE_COLUMNS),
      ),
    ]),
    section('Formulação integrada', [
      ...PICCA_VOL6_SINTESE_TEXT_FIELDS.map((label) => field(label, text(a.textos[label]))),
    ]),
  ].filter((s): s is PiccaPresentationSection => s !== null)
}

const MODULE_FORMATTERS: Record<
  string,
  (answers: Record<string, unknown>) => PiccaPresentationSection[]
> = {
  'picca-vol1-mod1': formatModulo1,
  'picca-vol1-mod2': formatModulo2,
  'picca-vol1-mod3': formatModulo3,
  'picca-vol1-mod4': formatModulo4,
  'picca-vol1-mod5': formatModulo5,
  'picca-vol1-mod6': formatModulo6,
  'picca-vol1-mod7': formatModulo7,
  'picca-vol1-mod8': formatModulo8,
  'picca-vol1-mod9': formatModulo9,
  'picca-vol1-mod10': formatModulo10,
  ...Object.fromEntries(
    PICCA_VOL6_DISORDERS.map((disorder) => [
      disorder.moduleId,
      disorder.number === 14
        ? formatVol6Sintese
        : (answers: Record<string, unknown>) => formatVol6Disorder(disorder.number, answers),
    ]),
  ),
}

export function formatPiccaModuleAnswers(
  moduleId: string,
  answers: Record<string, unknown>,
): PiccaPresentationSection[] {
  const formatter = MODULE_FORMATTERS[moduleId]
  if (formatter) return formatter(answers)

  return [
    {
      title: 'Respostas',
      fields: Object.entries(answers).map(([key, value]) => ({
        label: key,
        value: typeof value === 'string' ? text(value) : JSON.stringify(value, null, 2),
      })),
    },
  ]
}
