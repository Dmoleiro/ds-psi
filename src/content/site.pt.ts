import { publicAsset } from '../lib/publicAsset'

export interface NavItem {
  id: string
  label: string
  path?: string
}

export interface Service {
  id: string
  title: string
  description: string
  icon: string
}

export interface Qualification {
  label: string
}

export interface TimelineEntry {
  year: string
  title: string
  items: string[]
}

export interface FormStub {
  id: string
  title: string
  description: string
}

export const site = {
  name: 'Daniela Santos Psicologia',
  tagline: 'Psicóloga Educacional',
  subtitle:
    'Acompanhamento psicológico para crianças, jovens e adultos — com foco no desenvolvimento, na educação e no bem-estar emocional.',
  email: 'danielasantos.consultas@gmail.com',
  address: {
    street: 'Rua dos Forcados Amadores de Azambuja, Loja 4',
    postalCode: '2050-385',
    city: 'Azambuja',
    full: 'Rua dos Forcados Amadores de Azambuja, Loja 4, 2050-385 Azambuja',
  },
  mapUrl: 'https://maps.app.goo.gl/QoZ453RGLNoBCLUm7',
  mapEmbedUrl:
    'https://maps.google.com/maps?q=39.0706193,-8.8751663&hl=pt&z=17&output=embed',
} as const

export const social = {
  instagram: {
    label: 'Instagram',
    href: 'https://www.instagram.com/danielasantos.psicologia',
  },
  facebook: {
    label: 'Facebook',
    href: 'https://www.facebook.com/daniela.santos.963434',
  },
  complaintsBook: {
    label: 'Livro de Reclamações',
    href: 'https://www.livroreclamacoes.pt/inicio',
    icon: publicAsset('images/livro-reclamacoes.png'),
  },
} as const

export const images = {
  heroExterior: {
    src: publicAsset('images/hero-exterior.png'),
    alt: 'Exterior da clínica — montra com o logótipo e o nome Psicóloga Daniela Santos',
  },
  therapistPortrait: {
    src: publicAsset('images/therapist-daniela-santos.png'),
    alt: 'Daniela Santos — Psicóloga Educacional',
    align: { scale: 1, x: -8, y: 0 },
  },
  logo: publicAsset('logo.png'),
  logoIcon: publicAsset('logo-icon.png'),
  logoText: publicAsset('logo-text.png'),
  gallery: [
    {
      id: 'entrada',
      src: publicAsset('images/clinic-entrada.png'),
      alt: 'Entrada da clínica — porta de vidro com informações de contacto e marcação',
      caption: 'Entrada',
    },
    {
      id: 'sala-espera',
      src: publicAsset('images/clinic-sala-espera.png'),
      alt: 'Sala de espera da clínica — espaço acolhedor com zona para crianças e livros infantis',
      caption: 'Sala de espera',
    },
    {
      id: 'sala-consulta',
      src: publicAsset('images/clinic-sala-consulta.png'),
      alt: 'Sala de consulta — ambiente calmo com poltrona verde e decoração cuidada',
      caption: 'Sala de consulta',
    },
    {
      id: 'sala-consulta-infantil',
      src: publicAsset('images/clinic-sala-consulta-infantil.png'),
      alt: 'Sala de consulta para crianças — espaço com brinquedos, livros e mobiliário infantil',
      caption: 'Sala de consulta infantil',
    },
    {
      id: 'consultorio',
      src: publicAsset('images/clinic-consultorio.png'),
      alt: 'Consultório — secretária, zona de trabalho e canto de brincar para crianças e jovens',
      caption: 'Consultório',
    },
    {
      id: 'divisoria',
      src: publicAsset('images/clinic-interior-divisoria.png'),
      alt: 'Interior da clínica — divisória em madeira com planta decorativa',
      caption: 'Espaço interior',
    },
  ],
} as const

export const navigation: NavItem[] = [
  { id: 'inicio', label: 'Início' },
  { id: 'clinica', label: 'A Clínica' },
  { id: 'servicos', label: 'Serviços' },
  { id: 'diretora-clinica', label: 'Diretora Clínica' },
  { id: 'equipa', label: 'Equipa' },
  { id: 'contacto', label: 'Contacto' },
  { id: 'formularios-picca', label: 'Formulários PICCA', path: '/formularios-picca' },
]

export const clinic = {
  title: 'A Clínica',
  intro:
    'Um espaço acolhedor em Azambuja, dedicado à psicologia educacional e ao apoio emocional de crianças, jovens e adultos.',
  paragraphs: [
    'Na Daniela Santos Psicologia, acreditamos que cada pessoa tem o seu ritmo e as suas necessidades únicas. O nosso trabalho centra-se em criar um ambiente seguro, calmo e respeitoso — especialmente importante para crianças e famílias que procuram compreensão e apoio.',
    'Trabalhamos em estreita colaboração com pais, educadores e escolas, promovendo estratégias práticas para o dia a dia e para o sucesso escolar e pessoal.',
    'Além dos serviços clínicos, disponibilizamos salas para outros profissionais de psicologia que pretendam exercer a sua atividade num espaço partilhado e profissional.',
  ],
  values: [
    {
      title: 'Acolhimento',
      description: 'Um espaço pensado para que crianças e famílias se sintam à vontade desde o primeiro contacto.',
    },
    {
      title: 'Especialização',
      description: 'Formação e experiência em psicologia educacional e perturbações do neurodesenvolvimento.',
    },
    {
      title: 'Parceria',
      description: 'Trabalho conjunto com famílias, escolas e outros profissionais de saúde.',
    },
  ],
} as const

export const services: Service[] = [
  {
    id: 'apoio',
    title: 'Apoio Psicológico',
    description:
      'Acompanhamento individual para crianças, jovens e adultos, com foco no bem-estar emocional, gestão de emoções e desenvolvimento de competências para o dia a dia.',
    icon: '💬',
  },
  {
    id: 'intervencao',
    title: 'Intervenção',
    description:
      'Intervenção psicológica em contextos clínico, escolar e familiar — modificação de comportamentos, ajustamento social e académico, e apoio a pais e educadores.',
    icon: '🤝',
  },
  {
    id: 'avaliacao',
    title: 'Avaliação do Neurodesenvolvimento',
    description:
      'Avaliação global do desenvolvimento, avaliação psicológica e psicopedagógica, com elaboração de relatórios de avaliação e intervenção.',
    icon: '🧠',
  },
  {
    id: 'orientacao',
    title: 'Orientação Vocacional',
    description:
      'Apoio na exploração de interesses, competências e projectos de futuro — para jovens e adultos em momentos de escolha e transição.',
    icon: '🎯',
  },
  {
    id: 'salas',
    title: 'Aluguer de Salas',
    description:
      'Espaços disponíveis para profissionais de psicologia que pretendam consultar num ambiente calmo e bem localizado em Azambuja.',
    icon: '🏠',
  },
]

export const therapist = {
  name: 'Daniela Santos',
  role: 'Diretora Clínica',
  subtitle: 'Psicóloga Educacional',
  credentials: 'Mestre em Psicologia Educacional — ISPA-IU',
  oppNumber: '022377',
  introduction: {
    title: 'Apresentação',
    paragraphs: [
      'O meu nome é Daniela Santos e sou Mestre em Psicologia Educacional pelo ISPA – IU.',
      'A minha área de formação é a educação, que surgiu pelo gosto em trabalhar com crianças e adolescentes, sobretudo em contexto escolar. É gratificante poder acompanhar os jovens e fornecer-lhes ferramentas para uso diário na resolução de conflitos, na gestão das relações interpessoais e na relação com os outros e os contextos.',
      'A minha verdadeira motivação é trabalhar com jovens, com ou sem perturbações do neurodesenvolvimento, ajudando-os a ultrapassar as suas dificuldades e apoiando-os face às mesmas.',
    ],
  },
  qualifications: [
    { label: 'Perturbações do neurodesenvolvimento' },
    { label: 'Avaliação do neurodesenvolvimento' },
    { label: 'Orientação vocacional' },
    { label: 'Programas de competências emocionais' },
  ] satisfies Qualification[],
  timeline: [
    {
      year: '2013',
      title: 'Formações',
      items: [
        'Terapia cognitiva-comportamental — CRIAP',
        'Especialização avançada em psicopatologia da criança e do adolescente — CRIAP',
        'Avaliação psicológica da criança — ISPA-IU',
      ],
    },
    {
      year: '2020 — Presente',
      title: 'Psicóloga Educacional — CPD, Póvoa de S. Iria',
      items: [
        'Avaliação das diferentes áreas do neurodesenvolvimento da criança',
        'Realização de relatórios de avaliação e intervenção',
        'Intervenção com a criança, pais, educadores e escola',
        'Intervenção em contexto clínico',
      ],
    },
    {
      year: '2020 — Presente',
      title: 'Psicóloga Educacional — CRI (CERCI Flor da Vida)',
      items: [
        "Intervenção em contexto escolar nos AE's de Azambuja, Damião de Goes e Visconde de Chanceleiros",
      ],
    },
    {
      year: '2016 — 2020',
      title: 'Psicóloga Educacional — Logicamentes',
      items: [
        'Realização do estágio profissional e início de carreira',
        'Intervenção nas Perturbações do Neurodesenvolvimento',
        'Elaboração de programas de intervenção (Programa PIPA)',
        'Trabalho em equipa multidisciplinar',
      ],
    },
    {
      year: '2018 — Presente',
      title: 'Psicóloga — Fisiomedical',
      items: [
        'Avaliação global do desenvolvimento, psicológica e psicopedagógica',
        'Intervenção com criança, pais, educadores e escola',
        'Intervenção em contexto clínico',
      ],
    },
    {
      year: '2018',
      title: 'Leitura e Escrita no Autismo',
      items: [
        'Elaboração e apresentação do programa de estimulação da leitura e escrita em crianças com perturbação do espetro do autismo, no congresso da OPP',
      ],
    },
    {
      year: '2018',
      title: 'Membro Efetivo da OPP',
      items: ['Membro Efetivo da Ordem dos Psicólogos', 'Cédula profissional n.º 022377'],
    },
    {
      year: '2018',
      title: 'Ano Profissional Júnior',
      items: [
        'Candidatura ao Prémio Ano Profissional Júnior 2017/2018 para os 10 melhores estágios, em Braga',
      ],
    },
    {
      year: '2017 / 2018',
      title: 'Projeto EMOTIVA',
      items: [
        'Programas de prevenção social e comportamental no 2.º ciclo, na escola básica das Laranjeiras',
      ],
    },
    {
      year: '2016 / 2017',
      title: 'Estágio Profissional para a OPP',
      items: [
        'Início do estágio profissional no Centro de Desenvolvimento Infantil Logicamentes, Lisboa',
      ],
    },
    {
      year: '2016',
      title: 'Intervenção do Psicólogo nas NEE',
      items: [
        'Artigo apresentado no Congresso OPP 2016 sobre intervenção nas necessidades educativas especiais',
      ],
    },
    {
      year: '2014',
      title: 'Dissertação de Mestrado',
      items: [
        '«A atitude dos alunos do 1.º ciclo do Ensino Básico face à inclusão dos pares com necessidades educativas especiais nas turmas de ensino regular»',
      ],
    },
  ] satisfies TimelineEntry[],
}

export const piccaFormDefinitions = [] satisfies FormStub[]

export const piccaFormsPage = {
  title: 'Formulários PICCA',
  intro:
    'Área reservada para pacientes com acesso autorizado. Cada paciente receberá um link único da sua terapeuta para preencher os formulários de forma segura.',
  comingSoon: 'Brevemente',
} as const

export const legal = {
  dataProtection: {
    label: 'Consentimento informado e proteção de dados',
    href: publicAsset('docs/consentimento-e-protecao-dados-2026.pdf'),
  },
  pricing: {
    label: 'Preçários das consultas',
    href: publicAsset('docs/precarios-consultas-2026.pdf'),
  },
  cookies: {
    label: 'Política de Cookies',
  },
  oppDisclaimer: 'Membro da Ordem dos Psicólogos Portugueses — Cédula n.º 022377',
} as const
