import { defineQuestionnaire } from '../helpers.js'

const INATTENTION = [
  'Falha em prestar atenção a detalhes ou comete erros por descuido.',
  'Tem dificuldade em manter a atenção em tarefas ou actividades.',
  'Parece não ouvir quando lhe falam directamente.',
  'Não segue instruções e não termina tarefas.',
  'Tem dificuldade em organizar tarefas e actividades.',
  'Evita ou reluta em tarefas que exigem esforço mental prolongado.',
  'Perde coisas necessárias para tarefas.',
  'Distrai-se facilmente com estímulos externos.',
  'É esquecido(a) nas actividades diárias.',
]

const HYPERACTIVITY = [
  'Mexer-se excessivamente com as mãos ou pés ou remexer-se na cadeira.',
  'Levantar-se da cadeira em situações em que se espera que permaneça sentado(a).',
  'Correr ou trepar em situações inadequadas.',
  'Ter dificuldade em brincar ou envolver-se calmamente em actividades de lazer.',
  'Estar «ligado(a)» ou actuar como se tivesse um motor.',
  'Falar em excesso.',
  'Responder precipitadamente antes de a pergunta estar completa.',
  'Ter dificuldade em esperar a sua vez.',
  'Interromper ou intrometer-se nos outros.',
]

function divaItems(prefix: string, texts: string[]) {
  return texts.flatMap((text, index) => [
    { id: `${prefix}_atual_${index + 1}`, text: `[Actual] ${text}` },
    { id: `${prefix}_infancia_${index + 1}`, text: `[Infância] ${text}` },
  ])
}

const DIVA_ITEMS = [
  ...divaItems('desatencao', INATTENTION),
  ...divaItems('hiper', HYPERACTIVITY),
  {
    id: 'inicio_antes_12',
    text: 'Vários sintomas estavam presentes antes dos 12 anos de idade?',
  },
  {
    id: 'prejuizo_duas_areas',
    text: 'Os sintomas causam prejuízo em pelo menos duas áreas (casa, escola, relações)?',
  },
]

export const divaQuestionnaire = defineQuestionnaire({
  id: 'diva',
  title: 'DIVA-5 (5–17 anos)',
  description: 'Entrevista de diagnóstico para TDAH em jovens — versão simplificada digital.',
  instructions:
    'Para cada critério DSM-5, indique se o sintoma está presente na actualidade e na infância (Sim/Não).',
  respondent: 'Jovem e pais (com clínico)',
  responseType: 'yes_no',
  items: DIVA_ITEMS,
  scoring: {
    type: 'custom',
    compute: (answers) => {
      let inattentionCurrent = 0
      let inattentionChildhood = 0
      let hyperCurrent = 0
      let hyperChildhood = 0
      for (let i = 1; i <= 9; i++) {
        if (answers[`desatencao_atual_${i}`] === 1) inattentionCurrent += 1
        if (answers[`desatencao_infancia_${i}`] === 1) inattentionChildhood += 1
        if (answers[`hiper_atual_${i}`] === 1) hyperCurrent += 1
        if (answers[`hiper_infancia_${i}`] === 1) hyperChildhood += 1
      }
      return {
        inattention_current: inattentionCurrent,
        inattention_childhood: inattentionChildhood,
        hyperactivity_current: hyperCurrent,
        hyperactivity_childhood: hyperChildhood,
      }
    },
  },
})
