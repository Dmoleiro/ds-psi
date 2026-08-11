import { defineQuestionnaire } from '../helpers.js'

const MCHAT_ITEMS = [
  'Gosta de brincar ao colo fazendo de «cavalinho», etc.?',
  'Interessa-se pelas outras crianças?',
  'Gosta de subir objectos, como por exemplo, cadeiras, mesas?',
  'Gosta de jogar às escondidas?',
  'Brinca ao faz-de-conta, por exemplo, falar ao telefone ou dar de comer a uma boneca, etc.?',
  'Aponta com o indicador para pedir alguma coisa?',
  'Aponta com o indicador para mostrar interesse em alguma coisa?',
  'Brinca apropriadamente com brinquedos (carros ou Legos) sem levá-los à boca, abanar ou deitá-los ao chão?',
  'Alguma vez lhe trouxe objectos (brinquedos) para lhe mostrar alguma coisa?',
  'A criança mantém contacto visual por mais de um ou dois segundos?',
  'É muito sensível aos ruídos (ex. tapa os ouvidos)?',
  'Sorri como resposta às suas expressões faciais ou ao seu sorriso?',
  'Imita o adulto (ex. faz uma careta e ela imita)?',
  'Responde/olha quando o(a) chamam pelo nome?',
  'Se apontar para um brinquedo do outro lado da sala, a criança acompanha com o olhar?',
  'Já anda?',
  'Olha para as coisas para as quais o adulto está a olhar?',
  'Faz movimentos estranhos com as mãos/dedos próximo da cara?',
  'Tenta chamar a sua atenção para o que está a fazer?',
  'Alguma vez se preocupou quanto à sua audição?',
  'Compreende o que as pessoas lhe dizem?',
  'Por vezes fica a olhar para o vazio ou deambula ao acaso pelos espaços?',
  'Procura a sua reacção facial quando se vê confrontada com situações desconhecidas?',
]

export const mChatQuestionnaire = defineQuestionnaire({
  id: 'm_chat',
  title: 'M-CHAT',
  description: 'Modified Checklist for Autism in Toddlers — triagem para crianças dos 16 aos 30 meses.',
  instructions:
    'Preencha este questionário sobre o comportamento usual da criança. Responda a todas as questões. Se o comportamento descrito for raro, responda como se a criança não o apresente.',
  respondent: 'Pais ou cuidadores',
  responseType: 'yes_no',
  items: MCHAT_ITEMS,
  scoring: { type: 'mchat' },
})
