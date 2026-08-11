import type { QuestionnaireItem } from '../types.js'
import { defineQuestionnaire } from '../helpers.js'

const CDI_GROUPS: Array<[string, string, string]> = [
  ['Estou triste de vez em quando', 'Estou triste muitas vezes', 'Estou triste o tempo todo'],
  ['Nunca nada me vai correr bem', 'Não tenho a certeza de que as coisas me venham a correr bem', 'As coisas vão correr-me bem'],
  ['Faço quase tudo bem', 'Faço muitas coisas mal', 'Faço tudo mal'],
  ['Divirto-me com muitas coisas', 'Divirto-me com algumas coisas', 'Nada é divertido para mim'],
  ['Sou sempre mau(má)', 'Sou mau(má) muitas vezes', 'Sou mau(má) de vez em quando'],
  ['De vez em quando penso nalguma coisa má que me possa acontecer', 'Tenho receio que me aconteçam coisas más', 'Tenho a certeza que me vão acontecer coisas más'],
  ['Eu detesto-me', 'Eu não gosto de mim', 'Gosto de mim'],
  ['Sou culpado(a) de tudo', 'Muitas coisas más acontecem por minha causa', 'As coisas más não costumam ser culpa minha'],
  ['Não penso em matar-me', 'Penso às vezes em matar-me, mas nunca o farei', 'Quero matar-me'],
  ['Tenho vontade de chorar todos os dias', 'Tenho vontade de chorar muitas vezes', 'De vez em quando tenho vontade de chorar'],
  ['Tudo me aborrece imenso', 'Aborreço-me muitas vezes', 'Aborreço-me de vez em quando'],
  ['Gosto de estar com pessoas', 'Não gosto muitas vezes de estar com pessoas', 'Nunca quero estar acompanhado(a) por pessoas'],
  ['Nunca consigo tomar decisões', 'Para mim é difícil tomar decisões', 'Tomo decisões com facilidade'],
  ['Gosto do meu aspecto', 'Há algumas coisas do meu aspecto que não gosto muito', 'Sou feio(a)'],
  ['Tenho sempre que me esforçar muito para fazer os trabalhos da escola', 'Muitas vezes tenho que me esforçar para fazer os trabalhos da escola', 'Não é difícil fazer o trabalho da escola'],
  ['Durmo mal todas as noites', 'Muitas noites durmo mal', 'Durmo sempre muito bem'],
  ['Sinto-me cansado(a) de vez em quando', 'Sinto-me cansado(a) muitas vezes', 'Sinto-me sempre cansado(a)'],
  ['A maioria dos dias não me apetece comer', 'Há muitos dias em que não me apetece comer', 'Como sempre bem'],
  ['Não me preocupo com a minha saúde', 'Preocupo-me muito com a minha saúde', 'Ando sempre preocupado(a) com a minha saúde'],
  ['Não me sinto só', 'Sinto-me só muitas vezes', 'Sinto-me sempre só'],
  ['Nunca me divirto na escola', 'Divirto-me na escola de vez em quando', 'Divirto-me muitas vezes na escola'],
  ['Tenho muitos amigos(as)', 'Tenho muitos amigos(as) mas gostava de ter mais', 'Não tenho amigos'],
  ['Os meus resultados escolares são bons', 'Os meus resultados escolares já foram melhores', 'Estou muito mal em disciplinas que dantes era muito bom'],
  ['Nunca vou conseguir ser tão bom (boa) como os(as) outros(as)', 'Se eu quiser poderei ser tão bom (boa) como os(as) outros(as)', 'Consigo ser tão bom (boa) como os(as) outros(as)'],
  ['Ninguém gosta mesmo de mim', 'Não tenho a certeza se há alguém que goste de mim', 'Tenho a certeza de que alguém gosta de mim'],
  ['Costumo fazer o que me mandam', 'Muitas vezes não faço o que me mandam', 'Nunca faço o que me mandam'],
  ['Dou-me bem com os(as) outros(as)', 'Ando muitas vezes em brigas', 'Ando sempre metido(a) em brigas'],
]

const CDI_ITEMS: QuestionnaireItem[] = CDI_GROUPS.map((options, index) => ({
  id: `q${index + 1}`,
  text: `Grupo ${index + 1}`,
  options,
}))

export const cdiQuestionnaire = defineQuestionnaire({
  id: 'cdi',
  title: 'CDI',
  description: "Children's Depression Inventory — inventário de depressão infantil.",
  instructions:
    'Para cada grupo de três frases, escolha a que melhor o/a descreve nas últimas duas semanas.',
  respondent: 'Criança ou adolescente',
  responseType: 'forced_choice',
  items: CDI_ITEMS,
  scoring: { type: 'cdi' },
})
