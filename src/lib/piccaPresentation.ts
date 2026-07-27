import { mergePiccaModulo2Answers } from '../components/picca/modules/piccaModulo2'
import { mergePiccaModulo3Answers } from '../components/picca/modules/piccaModulo3'
import { mergePiccaModulo4Answers } from '../components/picca/modules/piccaModulo4'

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
          alcool_tabaco: 'Consumo de álcool/tabaco',
          stress: 'Stress significativo',
          ansiedade: 'Ansiedade',
          depressao: 'Depressão',
        }),
      ),
      field('Medicação durante a gravidez', text(a.gravidezMedicacao)),
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
          alimentacao: 'Alimentação',
        }),
      ),
      field('Observações', text(a.neonatalObs)),
    ]),
    section('5. Primeiros Meses de Vida', [
      field('Sono', text(a.sono)),
      field('Alimentação', text(a.alimentacao)),
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
      field('Preensão adequada', text(a.preensaoAdequada)),
      field('Manipulação de objetos', text(a.manipulacaoObjetos)),
      field('Grafomotricidade', text(a.grafomotricidade)),
    ]),
    section('3. Desenvolvimento da Linguagem', [
      field('Primeiras palavras', text(a.primeirasPalavras)),
      field('Primeiras frases', text(a.primeirasFrases)),
      field('Compreensão', text(a.compreensao)),
      field('Expressão', text(a.expressao)),
      field('Pragmática', text(a.pragmatica)),
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
    ]),
    section('7. Autonomia', [
      field('Vestir-se', text(a.vestir)),
      field('Alimentação', text(a.alimentacaoAutonomia)),
      field('Higiene', text(a.higiene)),
      field('Controlo de esfíncteres', text(a.controloEsfinteres)),
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

const MODULE_FORMATTERS: Record<
  string,
  (answers: Record<string, unknown>) => PiccaPresentationSection[]
> = {
  'picca-vol1-mod2': formatModulo2,
  'picca-vol1-mod3': formatModulo3,
  'picca-vol1-mod4': formatModulo4,
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
