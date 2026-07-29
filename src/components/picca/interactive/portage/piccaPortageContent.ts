// Auto-generated from Guia_Portage_Formato_PICCA.pdf (524 items)

export type PortageItem = { id: string; number: number; label: string }
export type PortageAgeBand = { id: string; ageLabel: string; items: PortageItem[] }
export type PortageDomain = { id: string; title: string; ageBands: PortageAgeBand[] }

export const PICCA_PORTAGE_GUIDANCE = [
  'Marque o resultado com base no Manual do Inventário Operacionalizado Portage.',
  'S — Sim (alcançou) · N — Não (ainda não alcançou) · AV — Às vezes',
  'Selecionar como prioritários os objetivos ainda não alcançados.',
  'Reforçar os objetivos assinalados como «Às vezes» até à sua consolidação.',
  'Rever periodicamente o perfil e substituir os objetivos alcançados por novos objetivos funcionais.',
] as const

export const PICCA_PORTAGE_USAGE_NOTES = [
  'Manter o reforço das competências já adquiridas e favorecer a sua generalização.',
  'Selecionar objetivos funcionais de diferentes áreas, ajustados às necessidades atuais da criança.',
  'Não restringir a intervenção aos itens do inventário; integrar dificuldades emergentes e interesses da criança.',
  'Respeitar a individualidade, o ritmo de desenvolvimento e os contextos de participação de cada criança.',
] as const

export const PICCA_PORTAGE_DOMAINS: PortageDomain[] = [
  {
    "id": "socializacao",
    "title": "Socialização",
    "ageBands": [
      {
        "id": "socializacao_0_a_1_ano",
        "ageLabel": "0 a 1 ano",
        "items": [
          {
            "id": "item_1",
            "number": 1,
            "label": "Observa uma pessoa movimentando-se em seu campo visual."
          },
          {
            "id": "item_2",
            "number": 2,
            "label": "Sorri em resposta à atenção do adulto."
          },
          {
            "id": "item_3",
            "number": 3,
            "label": "Vocaliza em resposta à atenção."
          },
          {
            "id": "item_4",
            "number": 4,
            "label": "Olha para sua própria mão, sorrindo ou vocalizando."
          },
          {
            "id": "item_5",
            "number": 5,
            "label": "Responde a seu círculo familiar, sorrindo, vocalizando ou parando de chorar."
          },
          {
            "id": "item_6",
            "number": 6,
            "label": "Sorri em resposta à expressão facial dos outros."
          },
          {
            "id": "item_7",
            "number": 7,
            "label": "Sorri e vocaliza ao ver sua imagem no espelho"
          },
          {
            "id": "item_8",
            "number": 8,
            "label": "Acaricia ou toca no rosto de adultos (puxa cabelo, nariz, óculos, etc.)."
          },
          {
            "id": "item_9",
            "number": 9,
            "label": "Estende a mão em direção a um objeto oferecido."
          },
          {
            "id": "item_10",
            "number": 10,
            "label": "Estende os braços em direção a pessoas familiares."
          },
          {
            "id": "item_11",
            "number": 11,
            "label": "Estende a mão e toca sua imagem refletida no espelho."
          },
          {
            "id": "item_12",
            "number": 12,
            "label": "Segura e examina por 1 minuto um objeto que lhe foi dado."
          },
          {
            "id": "item_13",
            "number": 13,
            "label": "Sacode ou aperta um objeto colocado em sua mão, produzindo sons involuntários."
          },
          {
            "id": "item_14",
            "number": 14,
            "label": "Brinca sozinho por 10 minutos."
          },
          {
            "id": "item_15",
            "number": 15,
            "label": "Procura contato visual quando alguém lhe dá atenção por 2 a 3 minutos."
          },
          {
            "id": "item_16",
            "number": 16,
            "label": "Brinca sozinho sem reclamar por 15 a 20 minutos, próximo de um adulto."
          },
          {
            "id": "item_17",
            "number": 17,
            "label": "Vocaliza para obter atenção."
          },
          {
            "id": "item_18",
            "number": 18,
            "label": "Imita adulto em brincadeiras de esconde-esconde."
          },
          {
            "id": "item_19",
            "number": 19,
            "label": "Bate palmas, imitando um adulto."
          },
          {
            "id": "item_20",
            "number": 20,
            "label": "Acena a mão, imitando um adulto."
          },
          {
            "id": "item_21",
            "number": 21,
            "label": "Ergue os braços para expressar “grande”, imitando um adulto."
          },
          {
            "id": "item_22",
            "number": 22,
            "label": "Oferece algo, mas nem sempre entrega."
          },
          {
            "id": "item_23",
            "number": 23,
            "label": "Abraça, acaricia e beija familiares."
          },
          {
            "id": "item_24",
            "number": 24,
            "label": "Responde ao próprio nome, olhando ou estendendo o braço para ser pego. S/N/ AV Observações"
          },
          {
            "id": "item_25",
            "number": 25,
            "label": "Aperta ou sacode um brinquedo para produzir sons, em imitação."
          },
          {
            "id": "item_26",
            "number": 26,
            "label": "Manipula brinquedo ou objeto."
          },
          {
            "id": "item_27",
            "number": 27,
            "label": "Estende um brinquedo ou objeto a um adulto e o entrega."
          },
          {
            "id": "item_28",
            "number": 28,
            "label": "Imita movimentos de outras crianças ao brincar."
          }
        ]
      },
      {
        "id": "socializacao_1_a_2_anos",
        "ageLabel": "1 a 2 anos",
        "items": [
          {
            "id": "item_29",
            "number": 29,
            "label": "Imita um adulto em uma tarefa simples."
          },
          {
            "id": "item_30",
            "number": 30,
            "label": "Brinca ao lado de outra criança, cada uma realizando tarefas diferentes."
          },
          {
            "id": "item_31",
            "number": 31,
            "label": "Toma parte em uma brincadeira com outra criança por 2 a 5 minutos."
          },
          {
            "id": "item_32",
            "number": 32,
            "label": "Aceita a ausência dos pais, embora possa reclamar."
          },
          {
            "id": "item_33",
            "number": 33,
            "label": "Explora ativamente seu meio ambiente."
          },
          {
            "id": "item_34",
            "number": 34,
            "label": "Realiza atividade manipulativa com outra pessoa."
          },
          {
            "id": "item_35",
            "number": 35,
            "label": "Abraça e carrega uma boneca ou brinquedo macio."
          },
          {
            "id": "item_36",
            "number": 36,
            "label": "Repete ações que produzem risos e atenção."
          },
          {
            "id": "item_37",
            "number": 37,
            "label": "Dá um livro para que um adulto o leia ou para que ambos o compartilhem."
          },
          {
            "id": "item_38",
            "number": 38,
            "label": "Puxa uma pessoa a mostrar-lhe algo. 39 Retira a mão ou diz \"não\" quando está próximo de um objeto não permitido e alguém o lembra disto."
          },
          {
            "id": "item_40",
            "number": 40,
            "label": "Quando colocado em sua cadeira ou trocador espera ser atendido."
          },
          {
            "id": "item_41",
            "number": 41,
            "label": "Brinca com 2 ou 3 crianças da sua idade."
          },
          {
            "id": "item_42",
            "number": 42,
            "label": "Compartilha um objeto ou alimento com outra criança."
          },
          {
            "id": "item_43",
            "number": 43,
            "label": "Cumprimenta colegas ou adultos quando lembrado."
          }
        ]
      },
      {
        "id": "socializacao_2_a_3_anos",
        "ageLabel": "2 a 3 anos",
        "items": [
          {
            "id": "item_44",
            "number": 44,
            "label": "Obedece às ordens dos pais pelo menos ½ das vezes."
          },
          {
            "id": "item_45",
            "number": 45,
            "label": "Busca / leva um objeto ou pessoa, quando solicitado."
          },
          {
            "id": "item_46",
            "number": 46,
            "label": "Presta atenção à estória ou música por 5 a 10 min."
          },
          {
            "id": "item_47",
            "number": 47,
            "label": "Diz \"Por favor\" ou \"Obrigado\" quando lembrado. S/N/ AV Observações"
          },
          {
            "id": "item_48",
            "number": 48,
            "label": "Tenta ajudar os pais a executarem tarefas realizando parte da mesma."
          },
          {
            "id": "item_49",
            "number": 49,
            "label": "Brinca de usar roupas de adultos."
          },
          {
            "id": "item_50",
            "number": 50,
            "label": "Faz uma escolha quando indagado."
          },
          {
            "id": "item_51",
            "number": 51,
            "label": "Demonstra entender sentimentos, expressando-os."
          }
        ]
      },
      {
        "id": "socializacao_3_a_4_anos",
        "ageLabel": "3 a 4 anos",
        "items": [
          {
            "id": "item_52",
            "number": 52,
            "label": "Canta e dança ao ouvir músicas."
          },
          {
            "id": "item_53",
            "number": 53,
            "label": "Segue regras de um jogo imitando ações de outras crianças."
          },
          {
            "id": "item_54",
            "number": 54,
            "label": "Cumprimenta pessoas familiares sem ser lembrado."
          },
          {
            "id": "item_55",
            "number": 55,
            "label": "Seguem regras em jogos de grupos dirigidos por adultos. 56 Pede permissão para brincar com um brinquedo que está sendo usado por outra criança."
          },
          {
            "id": "item_57",
            "number": 57,
            "label": "Diz \"Por favor\" e \"Obrigado\" sem ser lembrado ½ das vezes."
          },
          {
            "id": "item_58",
            "number": 58,
            "label": "Atende ao telefone, chamando um adulto e falando com pessoas familiares."
          },
          {
            "id": "item_59",
            "number": 59,
            "label": "Espera a sua vez."
          },
          {
            "id": "item_60",
            "number": 60,
            "label": "Segue regras em jogos dirigidos por uma criança mais velha."
          },
          {
            "id": "item_61",
            "number": 61,
            "label": "Obedece às ordens de um adulto 75% das vezes. (3 vezes a cada 4 tentativas)"
          },
          {
            "id": "item_62",
            "number": 62,
            "label": "Permanece em seu próprio quintal ou jardim. 63 Brinca perto de outras crianças conversando com elas enquanto trabalha em um projeto próprio (30 min.)."
          }
        ]
      },
      {
        "id": "socializacao_4_a_5_anos",
        "ageLabel": "4 a 5 anos",
        "items": [
          {
            "id": "item_64",
            "number": 64,
            "label": "Pede ajuda quando está tendo dificuldades."
          },
          {
            "id": "item_65",
            "number": 65,
            "label": "Contribui para a conversa de adultos."
          },
          {
            "id": "item_66",
            "number": 66,
            "label": "Repete rimas, canções ou dança para os outros."
          },
          {
            "id": "item_67",
            "number": 67,
            "label": "Faz uma tarefa sozinha por 20 a 30 minutos."
          },
          {
            "id": "item_68",
            "number": 68,
            "label": "Pede desculpas sem ser lembrado 75% das vezes."
          },
          {
            "id": "item_69",
            "number": 69,
            "label": "Espera sua vez em brincadeiras que envolvam de 8 a 9 crianças."
          },
          {
            "id": "item_70",
            "number": 70,
            "label": "Brinca com 2 a 3 crianças por 20 min. em uma atividade que envolva cooperação. S/N/ AV Observações"
          },
          {
            "id": "item_71",
            "number": 71,
            "label": "Quando em público, apresenta um comportamento socialmente aceitável."
          },
          {
            "id": "item_72",
            "number": 72,
            "label": "Pede permissão para usar objetos dos outros em 75% das vezes."
          }
        ]
      },
      {
        "id": "socializacao_5_a_6_anos",
        "ageLabel": "5 a 6 anos",
        "items": [
          {
            "id": "item_73",
            "number": 73,
            "label": "Manifesta seus sentimentos."
          },
          {
            "id": "item_74",
            "number": 74,
            "label": "Brinca com 4 a 5 crianças em atividade de cooperação por 20 minutos, sem supervisão."
          },
          {
            "id": "item_75",
            "number": 75,
            "label": "Explica aos outros as regras do jogo ou atividade."
          },
          {
            "id": "item_76",
            "number": 76,
            "label": "Imita papéis de adulto."
          },
          {
            "id": "item_77",
            "number": 77,
            "label": "Colabora para a conversa durante as refeições."
          },
          {
            "id": "item_78",
            "number": 78,
            "label": "Segue regras de jogo que envolva raciocínio verbal."
          },
          {
            "id": "item_79",
            "number": 79,
            "label": "Conforta colegas quando estes estão tristes."
          },
          {
            "id": "item_80",
            "number": 80,
            "label": "Escolhe seus próprios amigos."
          },
          {
            "id": "item_81",
            "number": 81,
            "label": "Planeja e constrói, usando ferramentas simples."
          },
          {
            "id": "item_82",
            "number": 82,
            "label": "Estabelece metas para si próprio e executa atividade para atingi-las."
          },
          {
            "id": "item_83",
            "number": 83,
            "label": "Dramatiza trechos de histórias, desempenhando um papel ou utilizando fantoches."
          }
        ]
      }
    ]
  },
  {
    "id": "linguagem",
    "title": "Linguagem",
    "ageBands": [
      {
        "id": "linguagem_0_a_1_ano",
        "ageLabel": "0 a 1 ano",
        "items": [
          {
            "id": "item_1",
            "number": 1,
            "label": "Repete sons emitidos por outras pessoas."
          },
          {
            "id": "item_2",
            "number": 2,
            "label": "Repete a mesma sílaba 2 a 3 vezes."
          },
          {
            "id": "item_3",
            "number": 3,
            "label": "Responde a gestos com gestos."
          },
          {
            "id": "item_4",
            "number": 4,
            "label": "Obedece a uma ordem simples, quando acompanhada de gestos indicativos."
          },
          {
            "id": "item_5",
            "number": 5,
            "label": "Interrompe a atividade quando lhe dizem \"Não\" 75% das vezes."
          },
          {
            "id": "item_6",
            "number": 6,
            "label": "Responde a perguntas simples com respostas não verbais."
          },
          {
            "id": "item_7",
            "number": 7,
            "label": "Combina 2 sílabas diferentes quando tenta verbalizar."
          },
          {
            "id": "item_8",
            "number": 8,
            "label": "Imita padrões de entonação da voz de outras pessoas."
          },
          {
            "id": "item_9",
            "number": 9,
            "label": "Usa uma palavra funcionalmente para indicar objetos ou pessoas."
          },
          {
            "id": "item_10",
            "number": 10,
            "label": "Vocaliza em resposta à fala de outras pessoas."
          }
        ]
      },
      {
        "id": "linguagem_1_a_2_anos",
        "ageLabel": "1 a 2 anos",
        "items": [
          {
            "id": "item_11",
            "number": 11,
            "label": "Diz 5 palavras diferentes."
          },
          {
            "id": "item_12",
            "number": 12,
            "label": "Pede \"mais\"."
          },
          {
            "id": "item_13",
            "number": 13,
            "label": "Diz \"acabou\"."
          },
          {
            "id": "item_14",
            "number": 14,
            "label": "Obedece a 3 ordens diferentes que não são acompanhadas de gestos indicativos."
          },
          {
            "id": "item_15",
            "number": 15,
            "label": "Consegue \"dar\" ou \"mostrar\" quando solicitado."
          },
          {
            "id": "item_16",
            "number": 16,
            "label": "Aponta para 12 objetos quando nomeados."
          },
          {
            "id": "item_17",
            "number": 17,
            "label": "Aponta para 3 a 5 figuras em um livro."
          },
          {
            "id": "item_18",
            "number": 18,
            "label": "Aponta para 3 partes de seu próprio corpo."
          },
          {
            "id": "item_19",
            "number": 19,
            "label": "Diz seu nome ou apelido quando solicitado."
          },
          {
            "id": "item_20",
            "number": 20,
            "label": "Responde à pergunta \"O que é isto?\""
          },
          {
            "id": "item_21",
            "number": 21,
            "label": "Combina palavras e gestos para expressar desejos."
          },
          {
            "id": "item_22",
            "number": 22,
            "label": "Nomeia 5 membros da família, incluindo animais."
          },
          {
            "id": "item_23",
            "number": 23,
            "label": "Nomeia 4 brinquedos."
          },
          {
            "id": "item_24",
            "number": 24,
            "label": "Produz sons de animais, ou os nomeia pelo som."
          },
          {
            "id": "item_25",
            "number": 25,
            "label": "Pede alimentos conhecidos pelo nome, quando mostrados."
          },
          {
            "id": "item_26",
            "number": 26,
            "label": "Faz perguntas variando a entonação da voz. S/N/ AV Observações"
          },
          {
            "id": "item_27",
            "number": 27,
            "label": "Nomeia 3 partes do corpo em uma boneca ou outra pessoa."
          },
          {
            "id": "item_28",
            "number": 28,
            "label": "Responde a perguntas de sim / não."
          }
        ]
      },
      {
        "id": "linguagem_2_a_3_anos",
        "ageLabel": "2 a 3 anos",
        "items": [
          {
            "id": "item_29",
            "number": 29,
            "label": "Combina substantivos ou adjetivos e substantivos em frases de 2 palavras."
          },
          {
            "id": "item_30",
            "number": 30,
            "label": "Combina substantivo e verbo em frases de 2 palavras"
          },
          {
            "id": "item_31",
            "number": 31,
            "label": "Usa uma palavra para indicar que quer ir ao banheiro"
          },
          {
            "id": "item_32",
            "number": 32,
            "label": "Combina verbo ou substantivo com \"lá\" e \"aqui\" em frases de 2 palavras."
          },
          {
            "id": "item_33",
            "number": 33,
            "label": "Combina 2 palavras para expressar posse."
          },
          {
            "id": "item_34",
            "number": 34,
            "label": "Emprega \"não\" na fala."
          },
          {
            "id": "item_35",
            "number": 35,
            "label": "Responde à pergunta \"O que .... está fazendo?\" para atividade habituais."
          },
          {
            "id": "item_36",
            "number": 36,
            "label": "Responde a perguntas tipo \"Onde está objeto?\""
          },
          {
            "id": "item_37",
            "number": 37,
            "label": "Nomeia sons ambientais familiares."
          },
          {
            "id": "item_38",
            "number": 38,
            "label": "Dá mais de um objeto quando se usa a forma plural na solicitação."
          },
          {
            "id": "item_39",
            "number": 39,
            "label": "Ao falar, refere-se a si próprio pelo nome. 40 Aponta para figuras de objetos comuns descritos pelo uso (até 10) (\"O que se usa pra comer? = colher\")"
          },
          {
            "id": "item_41",
            "number": 41,
            "label": "Mostra a idade pelos dedos."
          },
          {
            "id": "item_42",
            "number": 42,
            "label": "Diz seu sexo quando solicitado."
          },
          {
            "id": "item_43",
            "number": 43,
            "label": "Obedece à seqüência de duas ordens relacionadas."
          },
          {
            "id": "item_44",
            "number": 44,
            "label": "Usa a forma do verbo no gerúndio."
          },
          {
            "id": "item_45",
            "number": 45,
            "label": "Emprega formas regulares no plural."
          },
          {
            "id": "item_46",
            "number": 46,
            "label": "Emprega algumas formas irregulares de verbos no passado de forma sistemática."
          },
          {
            "id": "item_47",
            "number": 47,
            "label": "Faz perguntas do tipo \"O que é isso?\""
          },
          {
            "id": "item_48",
            "number": 48,
            "label": "Controla o volume da voz 90% das vezes."
          },
          {
            "id": "item_49",
            "number": 49,
            "label": "Usa \"este / esta\" e \"aquele / aquela\" na fala."
          },
          {
            "id": "item_50",
            "number": 50,
            "label": "Emprega \"é\" e \"está\" em frases simples."
          },
          {
            "id": "item_51",
            "number": 51,
            "label": "Diz \"eu\", \"mim\", \"meu\" ao invés do próprio nome."
          },
          {
            "id": "item_52",
            "number": 52,
            "label": "Aponta objetos e diz que eles não são outras coisas."
          },
          {
            "id": "item_53",
            "number": 53,
            "label": "Responde à pergunta \"Quem?\" dando um nome."
          },
          {
            "id": "item_54",
            "number": 54,
            "label": "Emprega as formas possessivas dos substantivos. S/N/ AV Observações"
          },
          {
            "id": "item_55",
            "number": 55,
            "label": "Usa artigos ao falar."
          },
          {
            "id": "item_56",
            "number": 56,
            "label": "Usa substantivos que indicam grupo ou categoria."
          },
          {
            "id": "item_57",
            "number": 57,
            "label": "Usa os verbos \"ser\", \"estar\" e \"ter\" no presente com poucos erros."
          },
          {
            "id": "item_58",
            "number": 58,
            "label": "Diz se os objetos estão abertos ou fechados."
          }
        ]
      },
      {
        "id": "linguagem_3_a_4_anos",
        "ageLabel": "3 a 4 anos",
        "items": [
          {
            "id": "item_59",
            "number": 59,
            "label": "Expressa diminutivos e aumentativos quando fala."
          },
          {
            "id": "item_60",
            "number": 60,
            "label": "Presta atenção por 5 minutos a uma estória lida."
          },
          {
            "id": "item_61",
            "number": 61,
            "label": "Obedece à sequência de 2 ordens não relacionadas."
          },
          {
            "id": "item_62",
            "number": 62,
            "label": "Diz seu nome completo quando solicitado."
          },
          {
            "id": "item_63",
            "number": 63,
            "label": "Responde perguntas simples envolvendo \"Como\"."
          },
          {
            "id": "item_64",
            "number": 64,
            "label": "Emprega verbos regulares, no passado."
          },
          {
            "id": "item_65",
            "number": 65,
            "label": "Relata experiências imediatas."
          },
          {
            "id": "item_66",
            "number": 66,
            "label": "Diz como são usados objetos comuns."
          },
          {
            "id": "item_67",
            "number": 67,
            "label": "Expressa ações futuras empregando os verbos \"ir\", \"ter\" e \"querer\"."
          },
          {
            "id": "item_68",
            "number": 68,
            "label": "Utiliza adequadamente masculino e feminino na fala."
          },
          {
            "id": "item_69",
            "number": 69,
            "label": "Usa formas imperativas de verbos ao pedir favores."
          },
          {
            "id": "item_70",
            "number": 70,
            "label": "Conta 2 fatos na ordem de ocorrência."
          }
        ]
      },
      {
        "id": "linguagem_4_a_5_anos",
        "ageLabel": "4 a 5 anos",
        "items": [
          {
            "id": "item_71",
            "number": 71,
            "label": "Obedece a uma sequência envolvendo 3 ordens. 72 Demonstra compreensão de verbos reflexivos, usando-os ocasionalmente (ex. ele se machucou)."
          },
          {
            "id": "item_73",
            "number": 73,
            "label": "Consegue identificar objetos / figuras que formem par, sob solicitação."
          },
          {
            "id": "item_74",
            "number": 74,
            "label": "Emprega o futuro ao falar."
          },
          {
            "id": "item_75",
            "number": 75,
            "label": "Usa orações compostas por coordenação."
          },
          {
            "id": "item_76",
            "number": 76,
            "label": "Consegue identificar a parte de cima e de baixo de objetos, quando solicitado."
          },
          {
            "id": "item_77",
            "number": 77,
            "label": "Emprega ocasionalmente o condicional ao falar (poderia, pudesse, iria, seria, faria). S/N/ AV Observações"
          },
          {
            "id": "item_78",
            "number": 78,
            "label": "Consegue identificar absurdos em figuras."
          },
          {
            "id": "item_79",
            "number": 79,
            "label": "Emprega as seguintes palavras: irmã(o), avó, avô."
          },
          {
            "id": "item_80",
            "number": 80,
            "label": "Completa frases com antônimos."
          },
          {
            "id": "item_81",
            "number": 81,
            "label": "Relata uma estória conhecida sem ajuda de figuras."
          },
          {
            "id": "item_82",
            "number": 82,
            "label": "Em uma figura, nomeia o objeto que não pertence a uma determinada categoria."
          },
          {
            "id": "item_83",
            "number": 83,
            "label": "Diz se duas palavras rimam ou não."
          },
          {
            "id": "item_84",
            "number": 84,
            "label": "Usa frases complexas, compostas por subordinação."
          },
          {
            "id": "item_85",
            "number": 85,
            "label": "Diz se um som é forte ou fraco."
          }
        ]
      },
      {
        "id": "linguagem_5_a_6_anos",
        "ageLabel": "5 a 6 anos",
        "items": [
          {
            "id": "item_86",
            "number": 86,
            "label": "Consegue indicar alguns, muitos e vários elementos."
          },
          {
            "id": "item_87",
            "number": 87,
            "label": "Diz seu endereço."
          },
          {
            "id": "item_88",
            "number": 88,
            "label": "Diz o número de seu telefone."
          },
          {
            "id": "item_89",
            "number": 89,
            "label": "Aponta para o conjunto que tem mais, menos ou poucos elementos."
          },
          {
            "id": "item_90",
            "number": 90,
            "label": "Conta piadas simples."
          },
          {
            "id": "item_91",
            "number": 91,
            "label": "Relata experiências diárias. 92 Descreve um local ou movimento: através ou entre, longe de, de / desde..., para, por cima de, até."
          },
          {
            "id": "item_93",
            "number": 93,
            "label": "Responde à pergunta \"Porque\" com uma explicação."
          },
          {
            "id": "item_94",
            "number": 94,
            "label": "Ordena e conta uma estória de 2 a 5 episódios na sequência correta."
          },
          {
            "id": "item_95",
            "number": 95,
            "label": "Define palavras."
          },
          {
            "id": "item_96",
            "number": 96,
            "label": "Responde adequadamente a pergunta \"Qual o contrário de ...\"."
          },
          {
            "id": "item_97",
            "number": 97,
            "label": "Responde a pergunta \"O que acontece se...\"."
          },
          {
            "id": "item_98",
            "number": 98,
            "label": "Usa \"ontem\" e “amanhã’, corretamente”."
          },
          {
            "id": "item_99",
            "number": 99,
            "label": "Pergunta o significado de perguntas novas ou conhecidas."
          }
        ]
      }
    ]
  },
  {
    "id": "cognicao",
    "title": "Cognição",
    "ageBands": [
      {
        "id": "cognicao_0_a_1_ano",
        "ageLabel": "0 a 1 ano",
        "items": [
          {
            "id": "item_1",
            "number": 1,
            "label": "Remove um pano do rosto que obscureça sua visão."
          },
          {
            "id": "item_2",
            "number": 2,
            "label": "Procura com o olhar um objeto que foi tirado de seu campo visual."
          },
          {
            "id": "item_3",
            "number": 3,
            "label": "Remove um objeto de um recipiente colocando a mão dentro do mesmo."
          },
          {
            "id": "item_4",
            "number": 4,
            "label": "Coloca um objeto em um recipiente imitando um adulto."
          },
          {
            "id": "item_5",
            "number": 5,
            "label": "Coloca um objeto em um recipiente quando recebe instruções."
          },
          {
            "id": "item_6",
            "number": 6,
            "label": "Balança um brinquedo que produz som, pendurado em um barbante."
          },
          {
            "id": "item_7",
            "number": 7,
            "label": "Coloca três objetos em um recipiente e o esvazia."
          },
          {
            "id": "item_8",
            "number": 8,
            "label": "Transfere um objeto de uma mão à outra para apanhar outro objeto."
          },
          {
            "id": "item_9",
            "number": 9,
            "label": "Deixa cair e apanha um brinquedo."
          },
          {
            "id": "item_10",
            "number": 10,
            "label": "Descobre um objeto escondido sob um recipiente."
          },
          {
            "id": "item_11",
            "number": 11,
            "label": "Empurra 3 blocos como se fosse um comboio."
          },
          {
            "id": "item_12",
            "number": 12,
            "label": "Remove um círculo de uma prancha, por imitação."
          },
          {
            "id": "item_13",
            "number": 13,
            "label": "Coloca um pino redondo em uma prancha de pinos, quando solicitado."
          },
          {
            "id": "item_14",
            "number": 14,
            "label": "Executa gestos simples quando requisitado."
          }
        ]
      },
      {
        "id": "cognicao_1_a_2_anos",
        "ageLabel": "1 a 2 anos",
        "items": [
          {
            "id": "item_15",
            "number": 15,
            "label": "Retira 6 objetos de um recipiente, um por vez."
          },
          {
            "id": "item_16",
            "number": 16,
            "label": "Aponta para uma parte do corpo."
          },
          {
            "id": "item_17",
            "number": 17,
            "label": "Empilha 3 blocos, dada a ordem."
          },
          {
            "id": "item_18",
            "number": 18,
            "label": "Emparelha objetos semelhantes."
          },
          {
            "id": "item_19",
            "number": 19,
            "label": "Faz rabiscos no papel."
          },
          {
            "id": "item_20",
            "number": 20,
            "label": "Aponta para si quando perguntam \"Cadê o Fulano?\""
          },
          {
            "id": "item_21",
            "number": 21,
            "label": "Coloca 5 pinos redondos, dada a ordem."
          },
          {
            "id": "item_22",
            "number": 22,
            "label": "Emparelha objetos com a figura do mesmo nome."
          },
          {
            "id": "item_23",
            "number": 23,
            "label": "Aponta para a figura nomeada."
          },
          {
            "id": "item_24",
            "number": 24,
            "label": "Vira as páginas de um livro (2/3 por vez) para encontrar a figura nomeada."
          }
        ]
      },
      {
        "id": "cognicao_2_a_3_anos",
        "ageLabel": "2 a 3 anos",
        "items": [
          {
            "id": "item_25",
            "number": 25,
            "label": "Encontra determinado livro quando solicitado."
          },
          {
            "id": "item_26",
            "number": 26,
            "label": "Completa um quebra-cabeça de encaixe de 3 peças."
          },
          {
            "id": "item_27",
            "number": 27,
            "label": "Nomeia 4 objetos comuns em figuras."
          },
          {
            "id": "item_28",
            "number": 28,
            "label": "Desenha uma linha vertical imitando um adulto."
          },
          {
            "id": "item_29",
            "number": 29,
            "label": "Desenha uma linha horizontal imitando um adulto."
          },
          {
            "id": "item_30",
            "number": 30,
            "label": "Copia um círculo."
          },
          {
            "id": "item_31",
            "number": 31,
            "label": "Emparelha objetos com a mesma textura."
          },
          {
            "id": "item_32",
            "number": 32,
            "label": "Aponta o \"pequeno\" e o \"grande\" quando solicitado."
          },
          {
            "id": "item_33",
            "number": 33,
            "label": "Desenha (+) imitando um adulto."
          },
          {
            "id": "item_34",
            "number": 34,
            "label": "Emparelha 3 cores."
          },
          {
            "id": "item_35",
            "number": 35,
            "label": "Coloca objetos dentro, em cima e em baixo de um recipiente, dada a ordem."
          },
          {
            "id": "item_36",
            "number": 36,
            "label": "Nomeia objetos quando ouve o barulho que fazem."
          },
          {
            "id": "item_37",
            "number": 37,
            "label": "Monta um brinquedo de encaixe de 4 peças."
          },
          {
            "id": "item_38",
            "number": 38,
            "label": "Nomeia ações em figuras (\"O que ... está fazendo?\")."
          },
          {
            "id": "item_39",
            "number": 39,
            "label": "Emparelha forma geométrica com a figura da mesma."
          },
          {
            "id": "item_40",
            "number": 40,
            "label": "Empilha 5 ou mais argolas em uma vara na ordem."
          }
        ]
      },
      {
        "id": "cognicao_3_a_4_anos",
        "ageLabel": "3 a 4 anos",
        "items": [
          {
            "id": "item_41",
            "number": 41,
            "label": "Nomeia objetos como sendo grandes ou pequenos."
          },
          {
            "id": "item_42",
            "number": 42,
            "label": "Aponta para 10 partes do corpo quando requisitado."
          },
          {
            "id": "item_43",
            "number": 43,
            "label": "Aponta para menino e menina, dada a ordem."
          },
          {
            "id": "item_44",
            "number": 44,
            "label": "Diz se um objeto é pesado ou leve."
          },
          {
            "id": "item_45",
            "number": 45,
            "label": "Une 2 partes de uma figura para formar o todo."
          },
          {
            "id": "item_46",
            "number": 46,
            "label": "Descreve 2 eventos ou personagens de uma estória familiar ou programa de televisão."
          },
          {
            "id": "item_47",
            "number": 47,
            "label": "Repete brincadeiras (rimas ou canções) que envolvam movimentos coordenados."
          },
          {
            "id": "item_48",
            "number": 48,
            "label": "Emparelha 3 ou mais objetos."
          },
          {
            "id": "item_49",
            "number": 49,
            "label": "Aponta para objetos compridos ou curtos."
          },
          {
            "id": "item_50",
            "number": 50,
            "label": "Associa objetos correspondentes. Ex: meia/sapato."
          },
          {
            "id": "item_51",
            "number": 51,
            "label": "Conta até 3 imitando um adulto. S/N/ AV Observações"
          },
          {
            "id": "item_52",
            "number": 52,
            "label": "Agrupa objetos em categorias."
          },
          {
            "id": "item_53",
            "number": 53,
            "label": "Traça um (V) em imitação."
          },
          {
            "id": "item_54",
            "number": 54,
            "label": "Traça uma linha diagonal dado o exemplo."
          },
          {
            "id": "item_55",
            "number": 55,
            "label": "Conta até 10 objetos, imitando um adulto."
          },
          {
            "id": "item_56",
            "number": 56,
            "label": "Constrói uma ponte com 3 blocos por imitação."
          },
          {
            "id": "item_57",
            "number": 57,
            "label": "Emparelha uma sequência ou padrão (tamanho, cor) de blocos ou contas."
          },
          {
            "id": "item_58",
            "number": 58,
            "label": "Copia uma série de (V) interligados."
          },
          {
            "id": "item_59",
            "number": 59,
            "label": "Acrescenta perna ou braço em um desenho incompleto da figura humana."
          },
          {
            "id": "item_60",
            "number": 60,
            "label": "Completa um quebra-cabeças de 6 peças."
          },
          {
            "id": "item_61",
            "number": 61,
            "label": "Indica se os objetos são iguais ou diferentes."
          },
          {
            "id": "item_62",
            "number": 62,
            "label": "Desenha um quadrado imitando um adulto."
          },
          {
            "id": "item_63",
            "number": 63,
            "label": "Nomeia 3 cores sendo requisitado."
          },
          {
            "id": "item_64",
            "number": 64,
            "label": "Nomeia 3 formas geométricas (quadrado, triângulo e círculo)."
          }
        ]
      },
      {
        "id": "cognicao_4_a_5_anos",
        "ageLabel": "4 a 5 anos",
        "items": [
          {
            "id": "item_65",
            "number": 65,
            "label": "Apanha de 1 a 5 objetos quando solicitado."
          },
          {
            "id": "item_66",
            "number": 66,
            "label": "Nomeia 5 texturas diferentes."
          },
          {
            "id": "item_67",
            "number": 67,
            "label": "Copia um triângulo ao ser requisitado."
          },
          {
            "id": "item_68",
            "number": 68,
            "label": "Recorda-se de 4 objetos que haviam sido vistos em uma figura."
          },
          {
            "id": "item_69",
            "number": 69,
            "label": "Diz o momento do dia associado a cada atividade."
          },
          {
            "id": "item_70",
            "number": 70,
            "label": "Repete rimas familiares."
          },
          {
            "id": "item_71",
            "number": 71,
            "label": "Diz se um objeto é mais pesado ou mais leve (objetos com diferença de 0,5 quilo)."
          },
          {
            "id": "item_72",
            "number": 72,
            "label": "Diz o que está faltando quando um objeto é retirado de um grupo de 3 objetos."
          },
          {
            "id": "item_73",
            "number": 73,
            "label": "Nomeia 8 cores."
          },
          {
            "id": "item_74",
            "number": 74,
            "label": "Identifica o valor de 3 moedas."
          },
          {
            "id": "item_75",
            "number": 75,
            "label": "Emparelha símbolos (letras e números)."
          },
          {
            "id": "item_76",
            "number": 76,
            "label": "Diz a cor de objetos nomeados."
          },
          {
            "id": "item_77",
            "number": 77,
            "label": "Relata 5 principais fatos de uma história contada 3x."
          },
          {
            "id": "item_78",
            "number": 78,
            "label": "Desenha figura humana (cabeça, tronco e 4 membros)"
          },
          {
            "id": "item_79",
            "number": 79,
            "label": "Canta 5 estrofes de uma canção. S/N/ AV Observações"
          },
          {
            "id": "item_80",
            "number": 80,
            "label": "Constrói uma pirâmide de 10 blocos por imitação."
          },
          {
            "id": "item_81",
            "number": 81,
            "label": "Nomeia objetos como sendo compridos ou curtos."
          },
          {
            "id": "item_82",
            "number": 82,
            "label": "Coloca objetos \"atrás\", \"ao lado\" ou \"junto\" a outros."
          },
          {
            "id": "item_83",
            "number": 83,
            "label": "Faz conjuntos iguais de 10 objetos, segundo modelo."
          },
          {
            "id": "item_84",
            "number": 84,
            "label": "Nomeia ou aponta para a parte ausente da figura."
          },
          {
            "id": "item_85",
            "number": 85,
            "label": "Conta de 1 a 20."
          },
          {
            "id": "item_86",
            "number": 86,
            "label": "Identifica o objeto que está colocado no meio, em primeiro e em último lugar."
          }
        ]
      },
      {
        "id": "cognicao_5_a_6_anos",
        "ageLabel": "5 a 6 anos",
        "items": [
          {
            "id": "item_87",
            "number": 87,
            "label": "Conta até 20 objetos e responde adequadamente à pergunta: \"Quantos ... você contou?\""
          },
          {
            "id": "item_88",
            "number": 88,
            "label": "Nomeia 10 numerais."
          },
          {
            "id": "item_89",
            "number": 89,
            "label": "Identifica qual a sua esquerda e qual a sua direita."
          },
          {
            "id": "item_90",
            "number": 90,
            "label": "Diz as vogais em ordem."
          },
          {
            "id": "item_91",
            "number": 91,
            "label": "Escreve seu nome com letras de forma."
          },
          {
            "id": "item_92",
            "number": 92,
            "label": "Nomeia 5 letras do alfabeto."
          },
          {
            "id": "item_93",
            "number": 93,
            "label": "Ordena objetos em sequência de comprimento e largura."
          },
          {
            "id": "item_94",
            "number": 94,
            "label": "Nomeia as letras maiúsculas do alfabeto."
          },
          {
            "id": "item_95",
            "number": 95,
            "label": "Coloca numerais de 1 a 10 na sequência correta."
          },
          {
            "id": "item_96",
            "number": 96,
            "label": "Identifica a posição de objetos em 1º, 2º e 3º lugar."
          },
          {
            "id": "item_97",
            "number": 97,
            "label": "Nomeia as letras minúsculas do alfabeto."
          },
          {
            "id": "item_98",
            "number": 98,
            "label": "Emparelha letras maiúsculas com minúsculas."
          },
          {
            "id": "item_99",
            "number": 99,
            "label": "Aponta para numerais de 1 a 25."
          },
          {
            "id": "item_100",
            "number": 100,
            "label": "Copia um losango."
          },
          {
            "id": "item_101",
            "number": 101,
            "label": "Completa um labirinto simples."
          },
          {
            "id": "item_102",
            "number": 102,
            "label": "Diz os dias da semana na ordem."
          },
          {
            "id": "item_103",
            "number": 103,
            "label": "Soma e subtrai combinações de até 3 elementos."
          },
          {
            "id": "item_104",
            "number": 104,
            "label": "Diz o mês e o dia de seu aniversário."
          },
          {
            "id": "item_105",
            "number": 105,
            "label": "Lê 10 palavras impressas."
          },
          {
            "id": "item_106",
            "number": 106,
            "label": "Prediz o que vai ocorrer."
          },
          {
            "id": "item_107",
            "number": 107,
            "label": "Aponta para objetos inteiros e partidos ao meio. S/N/ AV Observações 108 Conta de memória de 1 a 100 (pedir que pare no 40, e continue no 80, caso não erre até o 40)."
          }
        ]
      }
    ]
  },
  {
    "id": "auto_cuidados",
    "title": "Auto cuidados",
    "ageBands": [
      {
        "id": "auto_cuidados_0_a_1_ano",
        "ageLabel": "0 a 1 ano",
        "items": [
          {
            "id": "item_1",
            "number": 1,
            "label": "Suga e deglute líquidos."
          },
          {
            "id": "item_2",
            "number": 2,
            "label": "Toma mingau / sopinha."
          },
          {
            "id": "item_3",
            "number": 3,
            "label": "Estende as mãos em direção a mamadeira, tentando pegá-la."
          },
          {
            "id": "item_4",
            "number": 4,
            "label": "Come alimentos liquidificados dados pelos pais."
          },
          {
            "id": "item_5",
            "number": 5,
            "label": "Segura a mamadeira sem ajuda enquanto bebe."
          },
          {
            "id": "item_6",
            "number": 6,
            "label": "Leva a mamadeira até a boca ou a recusa, empurrando-a."
          },
          {
            "id": "item_7",
            "number": 7,
            "label": "Come alimentos amassados dados pelos pais."
          },
          {
            "id": "item_8",
            "number": 8,
            "label": "Bebe em uma caneca, segurada pelos pais."
          },
          {
            "id": "item_9",
            "number": 9,
            "label": "Come alimentos semissólidos dados pelos pais."
          },
          {
            "id": "item_10",
            "number": 10,
            "label": "Alimenta-se sozinho usando os dedos."
          },
          {
            "id": "item_11",
            "number": 11,
            "label": "Segura a caneca com ambas as mãos e bebe."
          },
          {
            "id": "item_12",
            "number": 12,
            "label": "Leva a colher cheia de comida até a boca com ajuda."
          },
          {
            "id": "item_13",
            "number": 13,
            "label": "Estica braços e pernas ao ser vestido."
          }
        ]
      },
      {
        "id": "auto_cuidados_1_a_2_anos",
        "ageLabel": "1 a 2 anos",
        "items": [
          {
            "id": "item_14",
            "number": 14,
            "label": "Come com colher de modo independente."
          },
          {
            "id": "item_15",
            "number": 15,
            "label": "Segura a caneca com uma só mão e bebe."
          },
          {
            "id": "item_16",
            "number": 16,
            "label": "Coloca a mão na água e dá tapinhas no rosto com as mãos molhadas, imitando alguém."
          },
          {
            "id": "item_17",
            "number": 17,
            "label": "Senta-se em um piniquinho ou sanitário infantil por 5 min."
          },
          {
            "id": "item_18",
            "number": 18,
            "label": "Coloca um chapéu na cabeça e o remove."
          },
          {
            "id": "item_19",
            "number": 19,
            "label": "Tira as meias."
          },
          {
            "id": "item_20",
            "number": 20,
            "label": "Empurra os braços pelas mangas e os pés pelas pernas da calça."
          },
          {
            "id": "item_21",
            "number": 21,
            "label": "Tira os sapatos quando os cordões estiverem desamarrados"
          },
          {
            "id": "item_22",
            "number": 22,
            "label": "Tira o casaco quando desabotoado."
          },
          {
            "id": "item_23",
            "number": 23,
            "label": "Tira a calça quando desabotoada."
          },
          {
            "id": "item_24",
            "number": 24,
            "label": "Puxa um fecho grande para cima e para baixo."
          },
          {
            "id": "item_25",
            "number": 25,
            "label": "Utiliza palavras ou gestos indicando necessidade de ir ao banheiro."
          }
        ]
      },
      {
        "id": "auto_cuidados_2_a_3_anos",
        "ageLabel": "2 a 3 anos",
        "items": [
          {
            "id": "item_27",
            "number": 27,
            "label": "Quando recebe uma toalha enxuga as mãos e o rosto com ajuda."
          },
          {
            "id": "item_28",
            "number": 28,
            "label": "Suga líquido do copo ou caneca usando canudinho."
          },
          {
            "id": "item_29",
            "number": 29,
            "label": "Dá garfadas."
          },
          {
            "id": "item_30",
            "number": 30,
            "label": "Mastiga e engole apenas substâncias comestíveis."
          },
          {
            "id": "item_31",
            "number": 31,
            "label": "Enxuga as mãos sem ajuda ao lhe darem uma toalha."
          },
          {
            "id": "item_32",
            "number": 32,
            "label": "Avisa que quer ir ao banheiro, mesmo sendo tarde demais."
          },
          {
            "id": "item_33",
            "number": 33,
            "label": "Controla sua baba."
          },
          {
            "id": "item_34",
            "number": 34,
            "label": "Urina ou defeca quando colocado no piniquinho pelo menos 3 vezes por semana."
          },
          {
            "id": "item_35",
            "number": 35,
            "label": "Calça os sapatos."
          },
          {
            "id": "item_36",
            "number": 36,
            "label": "Escova os dentes imitando um adulto."
          },
          {
            "id": "item_37",
            "number": 37,
            "label": "Retira roupas simples que foram desabotoadas."
          },
          {
            "id": "item_38",
            "number": 38,
            "label": "Usa o banheiro para defecar (falha apenas 1x por semana)."
          },
          {
            "id": "item_39",
            "number": 39,
            "label": "Obtém água de uma torneira sem ajuda."
          },
          {
            "id": "item_40",
            "number": 40,
            "label": "Lava as mãos e o rosto com um sabonete."
          },
          {
            "id": "item_41",
            "number": 41,
            "label": "Avisa que quer ir ao banheiro durante o dia a tempo."
          },
          {
            "id": "item_42",
            "number": 42,
            "label": "Pendura o casaco em um gancho da sua altura."
          },
          {
            "id": "item_43",
            "number": 43,
            "label": "Permanece seco ao dormir durante o dia."
          },
          {
            "id": "item_44",
            "number": 44,
            "label": "Evita riscos, por ex: pontas em móveis e escadas sem corrimão."
          },
          {
            "id": "item_45",
            "number": 45,
            "label": "Usa guardanapo quando recomendado."
          },
          {
            "id": "item_46",
            "number": 46,
            "label": "Espeta o garfo na comida, levando-a a boca."
          },
          {
            "id": "item_47",
            "number": 47,
            "label": "Despeja líquido de uma peq. jarra para o copo sem ajuda."
          },
          {
            "id": "item_48",
            "number": 48,
            "label": "Desprende roupas presas com o feixe de pressão."
          },
          {
            "id": "item_49",
            "number": 49,
            "label": "Lava seus braços e pernas ao lhe darem banho."
          },
          {
            "id": "item_50",
            "number": 50,
            "label": "Coloca meias."
          },
          {
            "id": "item_51",
            "number": 51,
            "label": "Veste casaco, malha ou camisa."
          },
          {
            "id": "item_52",
            "number": 52,
            "label": "Identifica a parte dianteira da roupa."
          }
        ]
      },
      {
        "id": "auto_cuidados_3_a_4_anos",
        "ageLabel": "3 a 4 anos",
        "items": [
          {
            "id": "item_53",
            "number": 53,
            "label": "Alimenta-se sozinho por toda a refeição. 54 Veste-se só, precisando de ajuda apenas quanto há malhas ou camisetas com golas fechadas ou botões e fechos."
          },
          {
            "id": "item_55",
            "number": 55,
            "label": "Enxuga o nariz quando lembrado."
          },
          {
            "id": "item_56",
            "number": 56,
            "label": "Acorda seco 2 manhãs por semana."
          },
          {
            "id": "item_57",
            "number": 57,
            "label": "Se menino, urina no sanitário, em pé."
          },
          {
            "id": "item_58",
            "number": 58,
            "label": "Veste-se e despe-se sozinho, exceto quanto à botões e fechos em 75% das vezes."
          },
          {
            "id": "item_59",
            "number": 59,
            "label": "Fecha a roupa com fechos de pressão ou de gancho."
          },
          {
            "id": "item_60",
            "number": 60,
            "label": "Assoa o nariz quando lembrado."
          },
          {
            "id": "item_61",
            "number": 61,
            "label": "Evita perigos corriqueiros, por ex: caco de vidro."
          },
          {
            "id": "item_62",
            "number": 62,
            "label": "Pendura roupa no cabide e põe no armário quando pedem."
          },
          {
            "id": "item_63",
            "number": 63,
            "label": "Escova os dentes quando recebe instrução."
          },
          {
            "id": "item_64",
            "number": 64,
            "label": "Coloca luvas."
          },
          {
            "id": "item_65",
            "number": 65,
            "label": "Desabotoa botões grandes."
          },
          {
            "id": "item_66",
            "number": 66,
            "label": "Abotoa botões grandes."
          },
          {
            "id": "item_67",
            "number": 67,
            "label": "Calça botas."
          }
        ]
      },
      {
        "id": "auto_cuidados_4_a_5_anos",
        "ageLabel": "4 a 5 anos",
        "items": [
          {
            "id": "item_68",
            "number": 68,
            "label": "Limpa o que derramou por conta própria."
          },
          {
            "id": "item_69",
            "number": 69,
            "label": "Evita veneno e todas as substâncias prejudiciais."
          },
          {
            "id": "item_70",
            "number": 70,
            "label": "Desabotoa sua roupa."
          },
          {
            "id": "item_71",
            "number": 71,
            "label": "Abotoa sua roupa."
          },
          {
            "id": "item_72",
            "number": 72,
            "label": "Retira prato e talheres da mesa."
          },
          {
            "id": "item_73",
            "number": 73,
            "label": "Encaixa fecho em sua terminação."
          },
          {
            "id": "item_74",
            "number": 74,
            "label": "Lava as mãos e o rosto."
          },
          {
            "id": "item_75",
            "number": 75,
            "label": "Usa talher apropriado para alimentar-se."
          },
          {
            "id": "item_76",
            "number": 76,
            "label": "Acorda de noite para ir ao banheiro, ou acorda seco."
          },
          {
            "id": "item_77",
            "number": 77,
            "label": "Limpa e assua o nariz em 75% das vezes sem ser lembrado"
          },
          {
            "id": "item_78",
            "number": 78,
            "label": "Toma banho só, precisando de ajuda apenas para lavar as costas, pescoço e orelhas."
          },
          {
            "id": "item_79",
            "number": 79,
            "label": "Usa faca para espalhar manteiga no pão. S/N/ AV Observações"
          },
          {
            "id": "item_80",
            "number": 80,
            "label": "Aperta e afrouxa cintos ou fivelas."
          },
          {
            "id": "item_81",
            "number": 81,
            "label": "Veste-se sozinho, mas não dá laços."
          },
          {
            "id": "item_82",
            "number": 82,
            "label": "Serve-se à mesa enquanto seguram a travessa de comida."
          },
          {
            "id": "item_83",
            "number": 83,
            "label": "Ajuda a pôr a mesa corretamente quando recebe instruções."
          },
          {
            "id": "item_84",
            "number": 84,
            "label": "Escova os dentes. 85 Vai ao banheiro a tempo, retira a roupa, usa papel higiênico, dá descarga e veste-se sem ajuda."
          },
          {
            "id": "item_86",
            "number": 86,
            "label": "Penteia ou escova cabelos."
          },
          {
            "id": "item_87",
            "number": 87,
            "label": "Pendura roupas em cabides."
          },
          {
            "id": "item_88",
            "number": 88,
            "label": "Anda pela vizinhança sem constante supervisão."
          },
          {
            "id": "item_89",
            "number": 89,
            "label": "Enfia cordões em sapatos."
          },
          {
            "id": "item_90",
            "number": 90,
            "label": "Amarra ou dá laços nos cordões dos sapatos."
          }
        ]
      },
      {
        "id": "auto_cuidados_5_a_6_anos",
        "ageLabel": "5 a 6 anos",
        "items": [
          {
            "id": "item_91",
            "number": 91,
            "label": "É responsável por uma tarefa semanal e a executa ao ser lembrado."
          },
          {
            "id": "item_92",
            "number": 92,
            "label": "Seleciona roupas apropriadas ao clima e ocasião."
          },
          {
            "id": "item_93",
            "number": 93,
            "label": "Pára no passeio, olha para ambos os lados, e atravessa a rua sem precisar ser lembrado."
          },
          {
            "id": "item_94",
            "number": 94,
            "label": "Serve-se à mesa e passa aos demais a panela de comida."
          },
          {
            "id": "item_95",
            "number": 95,
            "label": "Prepara sua própria caneca de café com leite."
          },
          {
            "id": "item_96",
            "number": 96,
            "label": "É responsável por uma tarefa diária em casa."
          },
          {
            "id": "item_97",
            "number": 97,
            "label": "Ajusta a temperatura da água para o banho."
          },
          {
            "id": "item_98",
            "number": 98,
            "label": "Prepara seu próprio lanche."
          },
          {
            "id": "item_99",
            "number": 99,
            "label": "Anda sozinho até a distância de 2 quadras de casa."
          },
          {
            "id": "item_100",
            "number": 100,
            "label": "Corta alimentos tenros com faca."
          },
          {
            "id": "item_101",
            "number": 101,
            "label": "Encontra o banheiro em local público, corretamente."
          },
          {
            "id": "item_102",
            "number": 102,
            "label": "Abre a embalagem de leite."
          },
          {
            "id": "item_103",
            "number": 103,
            "label": "Apanha uma bandeja com comida, levando-a e pondo sobre a mesa."
          },
          {
            "id": "item_104",
            "number": 104,
            "label": "Amarra os cordões em casacos com capuz."
          },
          {
            "id": "item_105",
            "number": 105,
            "label": "Aperta o cinto de segurança do automóvel."
          }
        ]
      }
    ]
  },
  {
    "id": "desenvolvimento_motor",
    "title": "Desenvolvimento Motor",
    "ageBands": [
      {
        "id": "desenvolvimento_motor_0_a_1_ano",
        "ageLabel": "0 a 1 ano",
        "items": [
          {
            "id": "item_1",
            "number": 1,
            "label": "Alcança um objeto colocado à sua frente (15 a 20 cm.)."
          },
          {
            "id": "item_2",
            "number": 2,
            "label": "Apanha um objeto colocado à sua frente (8 cm.)."
          },
          {
            "id": "item_3",
            "number": 3,
            "label": "Estende os braços em direção a um objeto à sua frente e o apanha."
          },
          {
            "id": "item_4",
            "number": 4,
            "label": "Alcança um objeto preferido."
          },
          {
            "id": "item_5",
            "number": 5,
            "label": "Coloca objetos na boca. 06 Eleva a cabeça e o tronco apoiando-se nos braços, ao estar deitado de barriga para baixo."
          },
          {
            "id": "item_7",
            "number": 7,
            "label": "Levanta a cabeça e o tronco apoiando-se em um só braço."
          },
          {
            "id": "item_8",
            "number": 8,
            "label": "Toca e explora objetos com a boca."
          },
          {
            "id": "item_9",
            "number": 9,
            "label": "Em DV (decúbito ventral, de bruços), vira de lado e mantém esta posição ½ das vezes."
          },
          {
            "id": "item_10",
            "number": 10,
            "label": "Em DV, vira de costas."
          },
          {
            "id": "item_11",
            "number": 11,
            "label": "Em DV, move-se para frente o equivalente à sua altura."
          },
          {
            "id": "item_12",
            "number": 12,
            "label": "Em DD (decúbito dorsal), rola para o lado."
          },
          {
            "id": "item_13",
            "number": 13,
            "label": "Em DD, vira de barriga para baixo."
          },
          {
            "id": "item_14",
            "number": 14,
            "label": "Faz esforço para sentar-se, segurando nos dedos do adulto."
          },
          {
            "id": "item_15",
            "number": 15,
            "label": "Vira a cabeça com facilidade quando o corpo está apoiado."
          },
          {
            "id": "item_16",
            "number": 16,
            "label": "Mantém-se sentado por 2 minutos."
          },
          {
            "id": "item_17",
            "number": 17,
            "label": "Solta um objeto para apanhar outro."
          },
          {
            "id": "item_18",
            "number": 18,
            "label": "Apanha e deixa cair um objeto propositalmente."
          },
          {
            "id": "item_19",
            "number": 19,
            "label": "Fica em pé com o máximo de apoio."
          },
          {
            "id": "item_20",
            "number": 20,
            "label": "Estando em pé com apoio, pula para cima e para baixo."
          },
          {
            "id": "item_21",
            "number": 21,
            "label": "Engatinha para apanhar um objeto (distante a sua altura)."
          },
          {
            "id": "item_22",
            "number": 22,
            "label": "Senta-se apoiando-se sozinho."
          },
          {
            "id": "item_23",
            "number": 23,
            "label": "Estando sentado, vira de gatinhas."
          },
          {
            "id": "item_24",
            "number": 24,
            "label": "Estando em DV consegue sentar-se."
          },
          {
            "id": "item_25",
            "number": 25,
            "label": "Senta-se sem o apoio das mãos."
          },
          {
            "id": "item_26",
            "number": 26,
            "label": "Atira objetos ao acaso."
          },
          {
            "id": "item_27",
            "number": 27,
            "label": "Balança para frente e para trás quando de gatinhas."
          },
          {
            "id": "item_28",
            "number": 28,
            "label": "Transfere objetos de uma mão para outra quando sentado."
          },
          {
            "id": "item_29",
            "number": 29,
            "label": "Retém em uma das mãos 2 cubos de 2,5 cm."
          },
          {
            "id": "item_30",
            "number": 30,
            "label": "Fica de joelhos. S/N/ AV Observações"
          },
          {
            "id": "item_31",
            "number": 31,
            "label": "Fica em pé, apoiando-se em algo."
          },
          {
            "id": "item_32",
            "number": 32,
            "label": "Usa preensão de pinça para pegar objetos."
          },
          {
            "id": "item_33",
            "number": 33,
            "label": "Engatinha."
          },
          {
            "id": "item_34",
            "number": 34,
            "label": "Estando de gatinhas, estende uma das mãos para o alto."
          },
          {
            "id": "item_35",
            "number": 35,
            "label": "Fica em pé com o mínimo de apoio."
          },
          {
            "id": "item_36",
            "number": 36,
            "label": "Lambe a comida ao redor da boca."
          },
          {
            "id": "item_37",
            "number": 37,
            "label": "Mantém-se em pé sozinho por um minuto."
          },
          {
            "id": "item_38",
            "number": 38,
            "label": "Derruba um objeto que está dentro de um recipiente."
          },
          {
            "id": "item_39",
            "number": 39,
            "label": "Vira várias páginas de um livro ao mesmo tempo."
          },
          {
            "id": "item_40",
            "number": 40,
            "label": "Escava com uma colher ou pá."
          },
          {
            "id": "item_41",
            "number": 41,
            "label": "Coloca pequenos objetos dentro do recipiente."
          },
          {
            "id": "item_42",
            "number": 42,
            "label": "Estando de pé, abaixa-se e senta."
          },
          {
            "id": "item_43",
            "number": 43,
            "label": "Bate palmas."
          },
          {
            "id": "item_44",
            "number": 44,
            "label": "Anda com um mínimo de apoio."
          },
          {
            "id": "item_45",
            "number": 45,
            "label": "Dá alguns passos sem apoio."
          }
        ]
      },
      {
        "id": "desenvolvimento_motor_1_a_2_anos",
        "ageLabel": "1 a 2 anos",
        "items": [
          {
            "id": "item_46",
            "number": 46,
            "label": "Sobe escadas engatinhando."
          },
          {
            "id": "item_47",
            "number": 47,
            "label": "Coloca-se em pé, estando sentado."
          },
          {
            "id": "item_48",
            "number": 48,
            "label": "Rola uma bola imitando um adulto."
          },
          {
            "id": "item_49",
            "number": 49,
            "label": "Sobe em uma cadeira de adulto, vira-se e senta."
          },
          {
            "id": "item_50",
            "number": 50,
            "label": "Coloca 4 aros em uma pequena estaca."
          },
          {
            "id": "item_51",
            "number": 51,
            "label": "Retira pinos de 2,5 cm de uma prancha ou tabuleiro."
          },
          {
            "id": "item_52",
            "number": 52,
            "label": "Encaixa pinos de 2,5 cm em uma prancha de encaixe."
          },
          {
            "id": "item_53",
            "number": 53,
            "label": "Constrói uma torre de 3 blocos."
          },
          {
            "id": "item_54",
            "number": 54,
            "label": "Faz traços no papel com lápis ou lápis de cera."
          },
          {
            "id": "item_55",
            "number": 55,
            "label": "Anda sozinho."
          },
          {
            "id": "item_56",
            "number": 56,
            "label": "Desce escadas sentado, colocando primeiro os pés."
          },
          {
            "id": "item_57",
            "number": 57,
            "label": "Senta-se em uma cadeirinha."
          },
          {
            "id": "item_58",
            "number": 58,
            "label": "Agacha-se e volta a ficar em pé. S/N/ AV Observações"
          },
          {
            "id": "item_59",
            "number": 59,
            "label": "Empurra e puxa brinquedos ao andar."
          },
          {
            "id": "item_60",
            "number": 60,
            "label": "Usa cadeira ou cavalo de balanço."
          },
          {
            "id": "item_61",
            "number": 61,
            "label": "Sobe escadas com ajuda."
          },
          {
            "id": "item_62",
            "number": 62,
            "label": "Dobra o corpo sem cair para apanhar objetos no chão."
          },
          {
            "id": "item_63",
            "number": 63,
            "label": "Imita um movimento circular."
          }
        ]
      },
      {
        "id": "desenvolvimento_motor_2_a_3_anos",
        "ageLabel": "2 a 3 anos",
        "items": [
          {
            "id": "item_64",
            "number": 64,
            "label": "Enfia 4 contas grandes em um cordão em 2 minutos."
          },
          {
            "id": "item_65",
            "number": 65,
            "label": "Vira trincos ou maçanetas em portas."
          },
          {
            "id": "item_66",
            "number": 66,
            "label": "Salta no mesmo local com ambos os pés."
          },
          {
            "id": "item_67",
            "number": 67,
            "label": "Anda de costas."
          },
          {
            "id": "item_68",
            "number": 68,
            "label": "Desce escadas sem ajuda."
          },
          {
            "id": "item_69",
            "number": 69,
            "label": "Atira uma bola a um adulto à 1 ½ de distância."
          },
          {
            "id": "item_70",
            "number": 70,
            "label": "Constrói uma torre de 5 a 6 blocos."
          },
          {
            "id": "item_71",
            "number": 71,
            "label": "Vira páginas de um livro, uma por vez."
          },
          {
            "id": "item_72",
            "number": 72,
            "label": "Desembrulha um pequeno objeto."
          },
          {
            "id": "item_73",
            "number": 73,
            "label": "Dobra um papel ao meio, imitando um adulto."
          },
          {
            "id": "item_74",
            "number": 74,
            "label": "Desmancha e reconstrói brinquedos de encaixe por pressão."
          },
          {
            "id": "item_75",
            "number": 75,
            "label": "Desenrosca brinquedos que se encaixam por roscas."
          },
          {
            "id": "item_76",
            "number": 76,
            "label": "Chuta uma bola grande que está imóvel."
          },
          {
            "id": "item_77",
            "number": 77,
            "label": "Faz bolas de argila, barro ou massinha."
          },
          {
            "id": "item_78",
            "number": 78,
            "label": "Segura o lápis entre o polegar e o indicador, apoiando-o sobre o dedo médio."
          },
          {
            "id": "item_79",
            "number": 79,
            "label": "Dá cambalhota para frente com ajuda."
          },
          {
            "id": "item_80",
            "number": 80,
            "label": "Dá marteladas para encaixar 5 pinos em seus orifícios."
          }
        ]
      },
      {
        "id": "desenvolvimento_motor_3_a_4_anos",
        "ageLabel": "3 a 4 anos",
        "items": [
          {
            "id": "item_81",
            "number": 81,
            "label": "Faz um quebra cabeça de 3 peças."
          },
          {
            "id": "item_82",
            "number": 82,
            "label": "Corta algo em pedaços com tesoura. S/N/ AV Observações"
          },
          {
            "id": "item_83",
            "number": 83,
            "label": "Pula de uma altura de 20 cm."
          },
          {
            "id": "item_84",
            "number": 84,
            "label": "Chuta uma bola grande quando enviada para si."
          },
          {
            "id": "item_85",
            "number": 85,
            "label": "Anda na ponta dos pés."
          },
          {
            "id": "item_86",
            "number": 86,
            "label": "Corre 10 passos coordenando e alternando o movimento dos braços e pés."
          },
          {
            "id": "item_87",
            "number": 87,
            "label": "Pedala com triciclo a distância de 1 metro e ½."
          },
          {
            "id": "item_88",
            "number": 88,
            "label": "Balança em um balanço quando este está em movimento."
          },
          {
            "id": "item_89",
            "number": 89,
            "label": "Sobe em um escorregador de 1,20m a 1,80m e escorrega."
          },
          {
            "id": "item_90",
            "number": 90,
            "label": "Dá cambalhotas para frente."
          },
          {
            "id": "item_91",
            "number": 91,
            "label": "Sobe escadas alternando os pés."
          },
          {
            "id": "item_92",
            "number": 92,
            "label": "Marcha (anda de forma ritmada)."
          },
          {
            "id": "item_93",
            "number": 93,
            "label": "Apara a bola com ambas as mãos."
          },
          {
            "id": "item_94",
            "number": 94,
            "label": "Desenha figuras seguindo contornos ou pontilhados."
          },
          {
            "id": "item_95",
            "number": 95,
            "label": "Recorta ao longo de uma linha reta 20 cm, afastando-se pouco da linha."
          }
        ]
      },
      {
        "id": "desenvolvimento_motor_4_a_5_anos",
        "ageLabel": "4 a 5 anos",
        "items": [
          {
            "id": "item_96",
            "number": 96,
            "label": "Fica em um só pé sem apoio por 4 a 8 segundos."
          },
          {
            "id": "item_97",
            "number": 97,
            "label": "Muda de direção ao correr."
          },
          {
            "id": "item_98",
            "number": 98,
            "label": "Anda sobre uma viga ou tábua, mantendo o equilíbrio."
          },
          {
            "id": "item_99",
            "number": 99,
            "label": "Pula para frente 10 vezes sem cair."
          },
          {
            "id": "item_100",
            "number": 100,
            "label": "Salta sobre uma corda suspensa a 5 cm do solo."
          },
          {
            "id": "item_101",
            "number": 101,
            "label": "Pula de costas 6 vezes."
          },
          {
            "id": "item_102",
            "number": 102,
            "label": "Rebate e apanha uma bola grande."
          },
          {
            "id": "item_103",
            "number": 103,
            "label": "Une 2 a 3 pedaços de massa de modelar."
          },
          {
            "id": "item_104",
            "number": 104,
            "label": "Recorta em torno de linhas curvas."
          },
          {
            "id": "item_105",
            "number": 105,
            "label": "Encaixa objetos de rosca."
          },
          {
            "id": "item_106",
            "number": 106,
            "label": "Desce escadas alternando os pés."
          },
          {
            "id": "item_107",
            "number": 107,
            "label": "Pedala um triciclo fazendo curvas."
          },
          {
            "id": "item_108",
            "number": 108,
            "label": "Salta em um só pé 5 vezes consecutivas."
          },
          {
            "id": "item_109",
            "number": 109,
            "label": "Recorta um círculo em 5 cm."
          },
          {
            "id": "item_110",
            "number": 110,
            "label": "Desenha figuras simples facilmente identificáveis (por ex: casa). S/N/ AV Observações"
          },
          {
            "id": "item_111",
            "number": 111,
            "label": "Recorta e cola formas simples."
          }
        ]
      },
      {
        "id": "desenvolvimento_motor_5_a_6_anos",
        "ageLabel": "5 a 6 anos",
        "items": [
          {
            "id": "item_112",
            "number": 112,
            "label": "Escreve letras de imprensa maiúsculas, isoladas e grandes em qualquer lugar do papel."
          },
          {
            "id": "item_113",
            "number": 113,
            "label": "Anda sobre uma tábua para trás, para frente e para os lados, mantendo o equilíbrio."
          },
          {
            "id": "item_114",
            "number": 114,
            "label": "Caminha saltitando."
          },
          {
            "id": "item_115",
            "number": 115,
            "label": "Balança em um balanço iniciando e mantendo o movimento."
          },
          {
            "id": "item_116",
            "number": 116,
            "label": "Estica os dedos tocando o polegar em cada um deles."
          },
          {
            "id": "item_117",
            "number": 117,
            "label": "Copia letras maiúsculas."
          },
          {
            "id": "item_118",
            "number": 118,
            "label": "Sobe em escadas de mão ou de escorregador de 3 m."
          },
          {
            "id": "item_119",
            "number": 119,
            "label": "Bate em um prego com martelo."
          },
          {
            "id": "item_120",
            "number": 120,
            "label": "Rebate a bola à medida que anda com direção."
          },
          {
            "id": "item_121",
            "number": 121,
            "label": "Consegue colorir sem sair da margem em 95% das vezes."
          },
          {
            "id": "item_122",
            "number": 122,
            "label": "Recorta figuras sem sair mais que 6 mm da margem."
          },
          {
            "id": "item_123",
            "number": 123,
            "label": "Usa apontador de lápis."
          },
          {
            "id": "item_124",
            "number": 124,
            "label": "Copia desenhos complexos (escola, navio)."
          },
          {
            "id": "item_125",
            "number": 125,
            "label": "Rasga figuras simples de um papel."
          },
          {
            "id": "item_126",
            "number": 126,
            "label": "Dobra um papel quadrado 2x em diagonal por imitação."
          },
          {
            "id": "item_127",
            "number": 127,
            "label": "Apanha uma bola leve com uma só mão."
          },
          {
            "id": "item_128",
            "number": 128,
            "label": "Pula corda sozinho."
          },
          {
            "id": "item_129",
            "number": 129,
            "label": "Golpeia uma bola com um bastão ou pedaço de pau."
          },
          {
            "id": "item_130",
            "number": 130,
            "label": "Apanha um objeto no chão enquanto corre."
          },
          {
            "id": "item_131",
            "number": 131,
            "label": "Patina uma distância de 3 m, ou usa skate."
          },
          {
            "id": "item_132",
            "number": 132,
            "label": "Anda de bicicleta."
          },
          {
            "id": "item_133",
            "number": 133,
            "label": "Escorrega descendo um monte de areia ou terra."
          },
          {
            "id": "item_134",
            "number": 134,
            "label": "Anda ou brinca em piscina tendo água até a cintura."
          },
          {
            "id": "item_135",
            "number": 135,
            "label": "Conduz um patinete dando impulso com um só pé."
          },
          {
            "id": "item_136",
            "number": 136,
            "label": "Salta e gira em um só pé."
          },
          {
            "id": "item_137",
            "number": 137,
            "label": "Escreve seu nome com letras de forma em caderno pautado."
          },
          {
            "id": "item_138",
            "number": 138,
            "label": "Salta de uma altura de 30 cm. e cai na ponta dos pés. S/N/ AV Observações"
          },
          {
            "id": "item_139",
            "number": 139,
            "label": "Pára em um só pé sem apoio com olhos fechados por 10 segundos."
          },
          {
            "id": "item_140",
            "number": 140,
            "label": "Dependura-se por 10 segundos em uma barra horizontal. uma organização gráfica coerente com a identidade visual PICCA."
          }
        ]
      }
    ]
  }
]

export const PICCA_PORTAGE_ITEM_COUNT = 524
