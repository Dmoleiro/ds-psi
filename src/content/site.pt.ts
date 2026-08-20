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
} as const

export interface Accreditation {
  id: string
  label: string
  href: string
  image?: string
  imageAlt?: string
  caption?: string
  layout?: 'logo' | 'banner' | 'text'
  text?: string
}

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
]

export const moreNavigation: NavItem[] = [
  { id: 'formularios-picca', label: 'Formulários PICCA', path: '/formularios-picca' },
  { id: 'workshops', label: 'Workshops', path: '/workshops' },
  { id: 'backoffice', label: 'Backoffice', path: '/backoffice/login' },
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

export type PiccaModuleStatus = 'available' | 'coming_soon'

export interface PiccaCatalogModule {
  number: number
  title: string
  description?: string
  status: PiccaModuleStatus
}

export interface PiccaCatalogVolume {
  volume: number
  title: string
  modules: PiccaCatalogModule[]
}

/** Public catalogue of PICCA volumes/modules — keep in sync with api/prisma seed & piccaModuleIds. */
export const piccaCatalog = [
  {
    volume: 1,
    title: 'Volume I',
    modules: [
      {
        number: 1,
        title: 'Identificação e Referenciação',
        description:
          'Dados da criança, cuidadores, motivo da referenciação e síntese clínica inicial.',
        status: 'available',
      },
      {
        number: 2,
        title: 'História Familiar e Contexto Familiar',
        description:
          'Contexto familiar, fatores predisponentes e protetores, e acontecimentos relevantes para a conceptualização clínica.',
        status: 'available',
      },
      {
        number: 3,
        title: 'Gestação, Parto e Período Neonatal',
        description:
          'Fatores pré-natais, peri-natais e neonatais relevantes para o neurodesenvolvimento.',
        status: 'available',
      },
      {
        number: 4,
        title: 'História do Desenvolvimento',
        description: 'Marcos do desenvolvimento, competências, sinais de alerta e áreas de vulnerabilidade.',
        status: 'available',
      },
      {
        number: 5,
        title: 'Funcionamento Atual',
        description:
          'Funcionamento atual nos domínios cognitivo, emocional, comportamental, social e adaptativo.',
        status: 'available',
      },
      {
        number: 6,
        title: 'Percurso Escolar e Funcionamento Académico',
        description: 'Percurso escolar, funcionamento académico, apoios educativos e integração clínica.',
        status: 'available',
      },
      {
        number: 7,
        title: 'Observação Clínica e Exame do Estado Mental',
        description:
          'Observação sistemática durante a avaliação, com indicadores de alerta e integração nos 5 P\'s.',
        status: 'available',
      },
      {
        number: 8,
        title: 'Síntese Clínica Inicial e Formulação de Caso',
        description:
          'Integração da anamnese e avaliação com formulação nos 5 P\'s e objetivos prioritários.',
        status: 'available',
      },
      {
        number: 9,
        title: 'Plano Integrado de Intervenção e Monitorização Clínica',
        description:
          'Plano de intervenção individualizado com objetivos SMART, estratégias e indicadores de evolução.',
        status: 'available',
      },
      {
        number: 10,
        title: 'Relatório Clínico Integrado e Devolução de Resultados',
        description:
          'Síntese final da avaliação, conclusões diagnósticas, recomendações e registo da devolução.',
        status: 'available',
      },
    ],
  },
  {
    volume: 2,
    title: 'Volume II',
    modules: [
      {
        number: 1,
        title: 'Fundamentos do Desenvolvimento Infantil',
        description:
          'Manual clínico de referência sobre marcos do desenvolvimento (0–6 anos): conceitos, domínios, idade corrigida e critérios de aquisição.',
        status: 'available',
      },
    ],
  },
  {
    volume: 6,
    title: 'Volume VI',
    modules: [
      {
        number: 1,
        title: 'Perturbação do Desenvolvimento Intelectual',
        description: 'Checklist clínico estruturado com indicadores N/O/F e registo por contexto.',
        status: 'available',
      },
      {
        number: 2,
        title: 'Atraso Global do Desenvolvimento',
        description: 'Checklist para atrasos significativos em várias áreas do desenvolvimento.',
        status: 'available',
      },
      {
        number: 3,
        title: 'Perturbação da Linguagem',
        description: 'Indicadores clínicos para perturbações da linguagem.',
        status: 'available',
      },
      {
        number: 4,
        title: 'Perturbação dos Sons da Fala',
        description: 'Indicadores clínicos para perturbações dos sons da fala.',
        status: 'available',
      },
      {
        number: 5,
        title: 'Perturbação da Fluência com Início na Infância',
        description: 'Indicadores clínicos para perturbações da fluência.',
        status: 'available',
      },
      {
        number: 6,
        title: 'Perturbação da Comunicação Social (Pragmática)',
        description: 'Indicadores clínicos para perturbações pragmáticas da comunicação.',
        status: 'available',
      },
      {
        number: 7,
        title: 'Perturbação do Espetro do Autismo',
        description: 'Checklist estruturado para avaliação do espetro do autismo.',
        status: 'available',
      },
      {
        number: 8,
        title: 'Perturbação de Hiperatividade e Défice de Atenção',
        description: 'Indicadores clínicos para PHDA e perfis de atenção/hiperatividade.',
        status: 'available',
      },
      {
        number: 9,
        title: 'Perturbação Específica da Aprendizagem',
        description: 'Indicadores clínicos para perturbações específicas da aprendizagem.',
        status: 'available',
      },
      {
        number: 10,
        title: 'Perturbação do Desenvolvimento da Coordenação',
        description: 'Indicadores clínicos para perturbação do desenvolvimento da coordenação.',
        status: 'available',
      },
      {
        number: 11,
        title: 'Perturbação dos Movimentos Estereotipados',
        description: 'Indicadores clínicos para movimentos estereotipados.',
        status: 'available',
      },
      {
        number: 12,
        title: 'Perturbações de Tiques',
        description: 'Indicadores clínicos para perturbações de tiques.',
        status: 'available',
      },
      {
        number: 13,
        title: 'Outras Perturbações do Neurodesenvolvimento',
        description: 'Checklist para outras perturbações do neurodesenvolvimento.',
        status: 'available',
      },
      {
        number: 14,
        title: 'Síntese Integrada e Formulação de Hipóteses',
        description:
          'Matriz transversal, mapa de hipóteses, formulação conclusiva e recomendações.',
        status: 'available',
      },
    ],
  },
  {
    volume: 7,
    title: 'Volume VII',
    modules: [
      {
        number: 1,
        title: 'Perturbação do Espetro do Autismo',
        description: 'Checklist clínica DC:0–5 com indicadores Sim/Não/Não observado.',
        status: 'available',
      },
      {
        number: 2,
        title: 'Perturbação do Espetro do Autismo Atípica Precoce',
        description: 'Checklist clínica DC:0–5 com indicadores Sim/Não/Não observado.',
        status: 'available',
      },
      {
        number: 3,
        title: 'Perturbação de Hiperatividade e Défice de Atenção – PHDA',
        description: 'Checklist clínica DC:0–5 com indicadores Sim/Não/Não observado.',
        status: 'available',
      },
      {
        number: 4,
        title: 'Perturbação de Hiperatividade da Primeira Infância',
        description: 'Checklist clínica DC:0–5 com indicadores Sim/Não/Não observado.',
        status: 'available',
      },
      {
        number: 5,
        title: 'Atraso Global do Desenvolvimento',
        description: 'Checklist clínica DC:0–5 com indicadores Sim/Não/Não observado.',
        status: 'available',
      },
      {
        number: 6,
        title: 'Perturbação do Desenvolvimento da Linguagem',
        description: 'Checklist clínica DC:0–5 com indicadores Sim/Não/Não observado.',
        status: 'available',
      },
      {
        number: 7,
        title: 'Perturbação de Hiper-reatividade Sensorial',
        description: 'Checklist clínica DC:0–5 com indicadores Sim/Não/Não observado.',
        status: 'available',
      },
      {
        number: 8,
        title: 'Perturbação de Hipo-reatividade Sensorial',
        description: 'Checklist clínica DC:0–5 com indicadores Sim/Não/Não observado.',
        status: 'available',
      },
      {
        number: 9,
        title: 'Outra Perturbação do Processamento Sensorial',
        description: 'Checklist clínica DC:0–5 com indicadores Sim/Não/Não observado.',
        status: 'available',
      },
      {
        number: 10,
        title: 'Perturbação de Ansiedade de Separação',
        description: 'Checklist clínica DC:0–5 — perturbações de ansiedade.',
        status: 'available',
      },
      {
        number: 11,
        title: 'Perturbação de Ansiedade Social',
        description: 'Checklist clínica DC:0–5 — perturbações de ansiedade.',
        status: 'available',
      },
      {
        number: 12,
        title: 'Perturbação de Ansiedade Generalizada',
        description: 'Checklist clínica DC:0–5 — perturbações de ansiedade.',
        status: 'available',
      },
      {
        number: 13,
        title: 'Mutismo Seletivo',
        description: 'Checklist clínica DC:0–5 — perturbações de ansiedade.',
        status: 'available',
      },
      {
        number: 14,
        title: 'Perturbação de Inibição perante a Novidade',
        description: 'Checklist clínica DC:0–5 — perturbações de ansiedade.',
        status: 'available',
      },
      {
        number: 15,
        title: 'Outra Perturbação de Ansiedade da Primeira Infância',
        description: 'Checklist clínica DC:0–5 — perturbações de ansiedade.',
        status: 'available',
      },
      {
        number: 16,
        title: 'Perturbação do Início do Sono',
        description: 'Checklist clínica DC:0–5 — sono, alimentação e choro.',
        status: 'available',
      },
      {
        number: 17,
        title: 'Perturbação dos Despertares Noturnos',
        description: 'Checklist clínica DC:0–5 — sono, alimentação e choro.',
        status: 'available',
      },
      {
        number: 18,
        title: 'Perturbação Parcial do Despertar',
        description: 'Checklist clínica DC:0–5 — sono, alimentação e choro.',
        status: 'available',
      },
      {
        number: 19,
        title: 'Perturbação de Pesadelos da Primeira Infância',
        description: 'Checklist clínica DC:0–5 — sono, alimentação e choro.',
        status: 'available',
      },
      {
        number: 20,
        title: 'Perturbação de Subalimentação',
        description: 'Checklist clínica DC:0–5 — sono, alimentação e choro.',
        status: 'available',
      },
      {
        number: 21,
        title: 'Perturbação de Sobrealimentação',
        description: 'Checklist clínica DC:0–5 — sono, alimentação e choro.',
        status: 'available',
      },
      {
        number: 22,
        title: 'Perturbação Alimentar Atípica',
        description: 'Checklist clínica DC:0–5 — sono, alimentação e choro.',
        status: 'available',
      },
      {
        number: 23,
        title: 'Pica',
        description: 'Checklist clínica DC:0–5 — sono, alimentação e choro.',
        status: 'available',
      },
      {
        number: 24,
        title: 'Ruminação',
        description: 'Checklist clínica DC:0–5 — sono, alimentação e choro.',
        status: 'available',
      },
      {
        number: 25,
        title: 'Perturbação do Choro Excessivo',
        description: 'Checklist clínica DC:0–5 — sono, alimentação e choro.',
        status: 'available',
      },
      {
        number: 26,
        title: 'Perturbação Depressiva da Primeira Infância',
        description: 'Checklist clínica DC:0–5 — perturbações do humor.',
        status: 'available',
      },
      {
        number: 27,
        title: 'Perturbação Mista da Expressão Emocional',
        description: 'Checklist clínica DC:0–5 — perturbações do humor.',
        status: 'available',
      },
      {
        number: 28,
        title: 'Outra Perturbação do Humor da Primeira Infância',
        description: 'Checklist clínica DC:0–5 — perturbações do humor.',
        status: 'available',
      },
      {
        number: 29,
        title: 'Irritabilidade Persistente',
        description: 'Checklist clínica DC:0–5 — perturbações do humor.',
        status: 'available',
      },
      {
        number: 30,
        title: 'Perturbação Obsessivo-compulsiva',
        description: 'Checklist clínica DC:0–5 — POC e perturbações relacionadas.',
        status: 'available',
      },
      {
        number: 31,
        title: 'Comportamentos Repetitivos Centrados no Corpo',
        description: 'Checklist clínica DC:0–5 — POC e perturbações relacionadas.',
        status: 'available',
      },
      {
        number: 32,
        title: 'Outra Perturbação Obsessivo-compulsiva e Relacionada',
        description: 'Checklist clínica DC:0–5 — POC e perturbações relacionadas.',
        status: 'available',
      },
      {
        number: 33,
        title: 'Checklist Clínica de Observação Sistemática',
        description: 'Observação sistemática de domínios clínicos (Manual Clínico PICCA).',
        status: 'available',
      },
      {
        number: 34,
        title: 'Síntese Integrada DC:0–5',
        description:
          'Integração transversal dos checklists clínicos, mapa de hipóteses e formulação conclusiva.',
        status: 'available',
      },
      {
        number: 35,
        title: 'Manual Clínico de Diagnóstico em Idade Pré-Escolar',
        description:
          'Referência clínica completa (18 capítulos): desenvolvimento, red flags, formulação e instrumentos.',
        status: 'available',
      },
    ],
  },
] satisfies PiccaCatalogVolume[]

export const piccaFormsPage = {
  title: 'Formulários PICCA',
  acronym: 'Protocolo Integrado de Conceptualização Clínica e Avaliação',
  intro:
    'O PICCA é uma plataforma desenvolvida internamente na Daniela Santos Psicologia para apoiar a avaliação clínica de crianças e adolescentes, recolhendo informação estruturada de forma segura e organizada por módulos.',
  patientAccess:
    'O acesso aos formulários é reservado a famílias com link autorizado, enviado pela terapeuta responsável. Cada utente recebe um link único para preencher os módulos indicados.',
  catalogTitle: 'Volumes e módulos',
  catalogIntro:
    'O protocolo está organizado em volumes temáticos. Novos módulos serão publicados aqui à medida que forem disponibilizados na clínica.',
  moduleStatus: {
    available: 'Disponível',
    coming_soon: 'Em desenvolvimento',
  } satisfies Record<PiccaModuleStatus, string>,
} as const

export const workshopsPage = {
  title: 'Workshops',
  intro:
    'Workshops e atividades ocasionais promovidos pela clínica. Consulte as próximas datas e inscreva-se por email.',
  pastTitle: 'Eventos passados',
  pastIntro: 'Registo dos workshops já realizados.',
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
} as const

export const accreditations: Accreditation[] = [
  {
    id: 'opp',
    label: 'Ordem dos Psicólogos Portugueses',
    href: 'https://www.ordemdospsicologos.pt/pt',
    image: publicAsset('images/accreditations/opp-member.png'),
    imageAlt:
      'Daniela Santos, Psicóloga, Cédula Profissional 022377 — Ordem dos Psicólogos Portugueses',
    layout: 'banner',
  },
  {
    id: 'complaints-book',
    label: 'Livro de Reclamações',
    href: 'https://www.livroreclamacoes.pt/inicio',
    image: publicAsset('images/livro-reclamacoes.png'),
    layout: 'logo',
  },
  {
    id: 'ers',
    label: 'Entidade Reguladora da Saúde',
    href: 'https://www.ers.pt/pt/',
    layout: 'text',
    text: 'Daniela Santos Psicologia — Registada na ERS com o número de estabelecimento E166638.',
  },
]
