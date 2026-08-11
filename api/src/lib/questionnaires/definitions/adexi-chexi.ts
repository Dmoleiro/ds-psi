import { defineQuestionnaire } from '../helpers.js'

const LIKERT5_INSTRUCTIONS =
  'Indique em que medida cada afirmação o/a descreve, assinalando um número de 1 (discordo completamente) a 5 (concordo completamente).'

const ADEXI_ITEMS_SELF = [
  'Tenho dificuldade em lembrar-me de instruções longas.',
  'Às vezes tenho dificuldade em lembrar-me do que estou a fazer a meio de uma atividade.',
  'Tenho tendência para fazer as coisas sem pensar primeiro nas consequências.',
  'Mesmo quando alguém me diz que não é permitido fazer algo de que gosto, às vezes tenho dificuldade em parar.',
  'Quando me pedem para fazer várias coisas, às vezes só me lembro da primeira ou da última.',
  'Às vezes tenho dificuldade em conter o riso em situações em que não é adequado rir.',
  'Tenho dificuldade em encontrar uma forma diferente para resolver um problema quando fico bloqueado(a).',
  'Quando alguém me pede para ir buscar alguma coisa, às vezes esqueço-me do que me pediram para ir buscar.',
  'Tenho dificuldade em planear uma atividade (por exemplo, lembrar-me do que é necessário para uma viagem, trabalho ou escola/universidade).',
  'Às vezes tenho dificuldade em parar de fazer uma atividade de que gosto (por exemplo, ver televisão ou estar ao computador à noite, mesmo sabendo que são horas de ir para a cama).',
  'Às vezes tenho dificuldade em compreender instruções verbais, a não ser que me mostrem como se faz.',
  'Tenho dificuldade em tarefas ou atividades que requerem vários passos.',
  'Tenho dificuldade em pensar antecipadamente ou aprender com a experiência.',
  'Às vezes as pessoas que me conhecem parecem pensar que sou mais animado(a)/rebelde do que outras pessoas da minha idade.',
]

const ADEXI_ITEMS_OTHER = [
  'Tem dificuldade em lembrar-se de instruções longas.',
  'Às vezes tem dificuldade em lembrar-se do que está a fazer a meio de uma atividade.',
  'Tem tendência para fazer as coisas sem pensar primeiro nas consequências.',
  'Mesmo quando alguém lhe diz que não é permitido fazer algo de que ele(a) gosta, às vezes tem dificuldade em parar.',
  'Quando se lhe pede para fazer várias coisas, às vezes só se lembra da primeira ou da última.',
  'Às vezes tem dificuldade em conter o riso em situações em que não é adequado rir.',
  'Tem dificuldade em encontrar uma forma diferente para resolver um problema quando fica bloqueado(a).',
  'Quando lhe pedem para ir buscar alguma coisa, às vezes esquece-se do que lhe pediram para ir buscar.',
  'Tem dificuldade em planear uma atividade (por exemplo, lembrar-se do que é necessário para uma viagem, trabalho ou escola/universidade).',
  'Às vezes tem dificuldade em parar de fazer uma atividade de que gosta (por exemplo, ver televisão ou estar ao computador à noite, mesmo sabendo que são horas de ir para a cama).',
  'Às vezes tem dificuldade em compreender instruções verbais, a não ser que lhe mostrem como se faz.',
  'Tem dificuldade em tarefas ou atividades que requerem vários passos.',
  'Tem dificuldade em pensar antecipadamente ou aprender com a experiência.',
  'Parece ser mais animado(a)/rebelde do que outras pessoas da idade dele(a).',
]

const CHEXI_ITEMS = [
  'Tem dificuldade em lembrar-se de instruções longas.',
  'Raramente consegue motivar-se a fazer algo que não queira.',
  'Tem dificuldade em lembrar-se do que está a fazer a meio de uma atividade.',
  'Tem dificuldade em dar continuidade a tarefas menos interessantes, a menos que lhe seja prometida alguma recompensa.',
  'Tem tendência para fazer as coisas sem pensar primeiro nas consequências.',
  'Quando se lhe pede para fazer várias coisas, só se lembra da primeira ou da última.',
  'Tem dificuldade em encontrar uma forma diferente para resolver um problema quando fica bloqueado(a).',
  'Quando uma coisa tem de ser feita, distrai-se frequentemente com algo mais interessante.',
  'Esquece-se facilmente do que lhe pediram para ir buscar.',
  'Fica demasiado excitado(a) quando está para acontecer algo especial (por exemplo, ir a uma visita de estudo ou a uma festa).',
  'Tem muita dificuldade em fazer coisas que acha aborrecidas.',
  'Tem dificuldade em planear uma atividade (por exemplo, lembrar-se do que é necessário para uma visita de estudo ou para a escola).',
  'Tem dificuldade em interromper uma atividade, mesmo quando lhe dizem para o fazer.',
  'Tem dificuldade em realizar atividades que incluam vários passos (por exemplo, vestir-se completamente sem instruções; ou fazer os trabalhos de casa autonomamente).',
  'Para conseguir concentrar-se, a tarefa tem que ser atrativa.',
  'Tem dificuldade em conter o riso em situações em que não é adequado rir-se.',
  'Tem dificuldade em contar uma história sobre algo que aconteceu, de forma a que os outros a entendam facilmente.',
  'Tem dificuldade em parar de imediato uma atividade, quando lhe dizem para o fazer (por exemplo, continua a saltar, a brincar ou a jogar no computador).',
  'Tem dificuldade em compreender instruções verbais, a não ser que lhe mostrem como se faz.',
  'Tem dificuldade em tarefas ou atividades que requerem vários passos.',
  'Tem dificuldade em pensar antecipadamente ou aprender com a experiência.',
  'Quando está em grupo, age de um modo mais rebelde que as outras crianças (por exemplo, numa festa de aniversário).',
  'Tem dificuldade em realizar tarefas que exijam esforço mental, tal como contar de trás para a frente.',
  'Tem dificuldade em manter as coisas em mente enquanto faz outra atividade.',
]

export const adexiChexiQuestionnaires = [
  defineQuestionnaire({
    id: 'adexi_self',
    title: 'ADEXI — Auto-relato',
    description: 'Inventário de Funcionamento Executivo do Adulto (versão de auto-relato).',
    instructions: LIKERT5_INSTRUCTIONS,
    respondent: 'Adulto',
    responseType: 'likert5',
    items: ADEXI_ITEMS_SELF,
    scoring: {
      type: 'sum_subscales',
      subscales: [{ id: 'total', label: 'Total ADEXI', itemIds: ADEXI_ITEMS_SELF.map((_, i) => `q${i + 1}`) }],
    },
  }),
  defineQuestionnaire({
    id: 'adexi_other',
    title: 'ADEXI — Informador',
    description: 'Inventário de Funcionamento Executivo do Adulto (versão do informador).',
    instructions: LIKERT5_INSTRUCTIONS.replace('o/a descreve', 'descreve a pessoa avaliada'),
    respondent: 'Informador',
    responseType: 'likert5',
    items: ADEXI_ITEMS_OTHER,
    scoring: {
      type: 'sum_subscales',
      subscales: [{ id: 'total', label: 'Total ADEXI', itemIds: ADEXI_ITEMS_OTHER.map((_, i) => `q${i + 1}`) }],
    },
  }),
  defineQuestionnaire({
    id: 'chexi',
    title: 'CHEXI',
    description: 'Inventário de Funcionamento Executivo de Crianças (para pais e professores).',
    instructions: LIKERT5_INSTRUCTIONS.replace('o/a descreve', 'descreve a criança'),
    respondent: 'Pais ou professores',
    responseType: 'likert5',
    items: CHEXI_ITEMS,
    scoring: {
      type: 'sum_subscales',
      subscales: [{ id: 'total', label: 'Total CHEXI', itemIds: CHEXI_ITEMS.map((_, i) => `q${i + 1}`) }],
    },
  }),
]
