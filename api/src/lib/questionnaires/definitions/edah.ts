import { defineQuestionnaire } from '../helpers.js'

const EDAH_ITEMS = [
  'Revela-se excessivamente inquieto do ponto de vista motor.',
  'Tem dificuldades de aprendizagem escolar.',
  'Aborrece («chateia») frequentemente outras crianças.',
  'Distrai-se facilmente, revela pouca atenção.',
  'Exige satisfação imediata dos seus desejos / pedidos.',
  'Tem dificuldades em actividades de cooperação / de grupo.',
  'Está «nas nuvens», alheio ao que se passa em redor.',
  'Não termina as tarefas que começa.',
  'É mal aceite pelo grupo.',
  'Nega os seus erros ou põe as culpas nos outros.',
  'Frequentemente grita em situações inadequadas.',
  'Contesta por tudo e por nada.',
  'Está constantemente em movimento, irrequieto (ex.: desloca-se pela sala).',
  'Discute e envolve-se em brigas por coisas insignificantes.',
  'Tem «explosões» inesperadas de mau génio.',
  'Tem dificuldade em seguir as regras, em fazer «jogo limpo».',
  'É impulsivo.',
  'Relaciona-se mal com a maioria dos seus colegas.',
  'É inconstante nos seus esforços e facilmente se sente frustrado.',
  'Aceita de má vontade as indicações do Professor.',
]

export const edahQuestionnaire = defineQuestionnaire({
  id: 'edah',
  title: 'EDAH — Folha de Respostas',
  description: 'Escala de Avaliação de Hiperactividade (versão professores).',
  instructions:
    'Marque o grau em que o aluno apresenta cada comportamento nos últimos seis meses: 0 = Nada, 1 = Pouco, 2 = Moderadamente, 3 = Muito.',
  respondent: 'Professores',
  responseType: 'frequency0_3',
  responseLabels: ['Nada', 'Pouco', 'Moderadamente', 'Muito'],
  items: EDAH_ITEMS,
  scoring: {
    type: 'sum_subscales',
    subscales: [{ id: 'total', label: 'Total EDAH', itemIds: EDAH_ITEMS.map((_, i) => `q${i + 1}`) }],
  },
})
