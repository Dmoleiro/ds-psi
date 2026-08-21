// Auto-generated from scripts/adir_extract.txt — do not edit by hand.
import { z } from 'zod'
import { defineQuestionnaire } from '../helpers.js'
import { QUESTIONNAIRE_NOTES_FIELD } from '../types.js'
import type { QuestionnaireItem } from '../types.js'

export const ADIR_TIMEPOINT_LABELS = {
  "actual": "Actual (últimos 3 meses)",
  "ever": "Alguma vez",
  "anomal_45": "Mais anómalo 4,0–5,0 anos"
} as const

export const ADIR_CONCERNS_CODES = [
  {
    "code": 0,
    "text": "Sem problemas, pais ou profissionais"
  },
  {
    "code": 1,
    "text": "Atraso/desvio no desenvolvimento da fala e/ou linguagem expressiva"
  },
  {
    "code": 2,
    "text": "Problemas médicos ou atraso para além da linguagem"
  },
  {
    "code": 3,
    "text": "Falta de interesse ou anomalia na resposta emocional e social"
  },
  {
    "code": 4,
    "text": "Dificuldade de comportamento não específica do autismo"
  },
  {
    "code": 5,
    "text": "Comportamento tipo autista"
  },
  {
    "code": 6,
    "text": "Falta de capacidade de viver independente ou feliz"
  },
  {
    "code": 7,
    "text": "Preocupações não directamente associadas ao comportamento"
  },
  {
    "code": 8,
    "text": "Profissionais preocupados, pais não"
  },
  {
    "code": 9,
    "text": "Não conhecido ou não perguntado"
  }
] as const

export const ADIR_RETRO_CODES = [
  {
    "code": 0,
    "text": "Problemas presentes nos primeiros 12 meses"
  },
  {
    "code": 1,
    "text": "Problemas notados aos 24 meses ou antes (não antes dos 12)"
  },
  {
    "code": 2,
    "text": "Problemas notados aos 36 meses ou antes (não antes dos 24)"
  },
  {
    "code": 3,
    "text": "Problemas notados aos 4 anos ou antes (não antes dos 36 meses)"
  },
  {
    "code": 4,
    "text": "Problemas notados aos 5 anos ou antes (não antes dos 4)"
  },
  {
    "code": 5,
    "text": "Problemas notados aos 6 anos ou antes (não antes dos 5)"
  },
  {
    "code": 6,
    "text": "Problemas notados mais tarde (especificar)"
  },
  {
    "code": 7,
    "text": "Criança sempre «diferente», sem anomalia percebida"
  },
  {
    "code": 8,
    "text": "Não foram notados problemas pelos pais"
  },
  {
    "code": 9,
    "text": "Não conhecido ou não perguntado"
  }
] as const

export const ADIR_LOSS_CODES = [
  {
    "code": 0,
    "text": "Sem perda"
  },
  {
    "code": 1,
    "text": "Perda provável de uma capacidade específica"
  },
  {
    "code": 2,
    "text": "Perda completa de uma capacidade específica"
  },
  {
    "code": 8,
    "text": "Linguagem insuficiente para mostrar alterações"
  },
  {
    "code": 9,
    "text": "Não conhecido ou não perguntado"
  }
] as const

export const ADIR_AGE_HINT = "Idade em meses. Códigos especiais: 991–999 conforme manual."

export const ADIR_INTRO_SCRIPT = "Gostaria de começar por obter um quadro geral da sua criança. Deixe-me rapidamente pôr-lhe algumas questões, e depois poderemos voltar a algum dos pontos em mais detalhe. Pode falar-me um pouco do(a) _______? Como é o seu dia? Quando está no seu melhor? Como descreveria o(a) _______ a alguém que tivesse de o identificar no meio de um grupo?"

export const ADIR_IDENTIFICATION = [
  {
    "id": "id_nome",
    "text": "Nome do probando",
    "inputType": "text"
  },
  {
    "id": "id_familia_id",
    "text": "Número ID da família",
    "inputType": "text"
  },
  {
    "id": "id_individual_id",
    "text": "Número ID individual do sujeito",
    "inputType": "text"
  },
  {
    "id": "id_sexo",
    "text": "Sexo",
    "inputType": "choice",
    "options": [
      "Masculino",
      "Feminino"
    ]
  },
  {
    "id": "id_data_entrevista",
    "text": "Data da entrevista",
    "inputType": "text"
  },
  {
    "id": "id_idade_anos",
    "text": "Idade do sujeito na entrevista (anos)",
    "inputType": "text"
  },
  {
    "id": "id_data_nascimento",
    "text": "Data de nascimento (mês/dia/ano)",
    "inputType": "text"
  },
  {
    "id": "id_investigador",
    "text": "Investigador / entrevistador",
    "inputType": "text"
  },
  {
    "id": "id_informador",
    "text": "Nome do informador",
    "inputType": "text"
  },
  {
    "id": "id_informador_relacao",
    "text": "Informador",
    "inputType": "choice",
    "options": [
      "Mãe",
      "Pai",
      "Outro acompanhante",
      "Combinação"
    ]
  },
  {
    "id": "id_telefone_informador",
    "text": "Telefone do informador",
    "inputType": "text"
  },
  {
    "id": "id_local_entrevista",
    "text": "Local e circunstâncias da entrevista",
    "inputType": "textarea"
  }
] as const

export const ADIR_BACKGROUND = [
  {
    "id": "bg_antecedentes",
    "text": "Antecedentes — estrutura familiar (nomes, idades, historial relevante)",
    "inputType": "textarea"
  },
  {
    "id": "bg_historia_medica",
    "text": "História médica / social",
    "inputType": "textarea"
  },
  {
    "id": "bg_escolaridade",
    "text": "Escolaridade (pré-escolar e escolar)",
    "inputType": "textarea"
  },
  {
    "id": "bg_medicacao",
    "text": "Medicação",
    "inputType": "textarea"
  },
  {
    "id": "bg_diagnostico_previo",
    "text": "Diagnósticos médicos prévios (registo livre)",
    "inputType": "textarea"
  }
] as const

export const ADIR_SECTIONS = [
  {
    "title": "Perguntas introdutórias e início dos sintomas",
    "items": [
      {
        "num": "1",
        "id": "item_1",
        "text": "PREOCUPAÇÕES",
        "type": "concerns",
        "notes": [],
        "probes": [
          "erca do comportamento ou desenvolvimento da sua criança?",
          "SE HOUVER MAIS DO QUE 4 PROBLEMAS MAJOR, COTE SOMENTE OS 4 DE MAIOR DIFICULDADE, SEGUNDO A PERCEP ÇÃO DO INFORMADOR.?",
          "SE HOUVER MENOS DO QUE 4 PROBLEMAS MAJOR, DEIXE AS CAIXAS EM BRANCO.?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "Sem problemas, pais OU profissionais"
          },
          {
            "code": 1,
            "text": "Atraso/desvio no desenvolvimento da fala e/ou linguagem expressiva (incluindo possível surdez, deficiência em responder"
          },
          {
            "code": 2,
            "text": "Problemas médicos (tal como convulsões) ou atraso nas aquisições de desenvolvimento para além da linguagem (pode incluir atraso no crescimento físico, desenvolvimento motor, controlo dos esfincteres ou ser lento)"
          },
          {
            "code": 3,
            "text": "Falta de interesse ou anomalia/estranheza na resposta emocional e social às pessoas (pode incluir dificuldades especificas em brincar com outras crianças ou estar no “seu mundo” ou incompetência social global) B:"
          },
          {
            "code": 4,
            "text": "Dificuldade do comportamento não específica do autismo (p.ex. problemas de sono, alimentares, nível de actividade global excessivo, vaguear, comportamento destrutivo ou agressivo)"
          },
          {
            "code": 5,
            "text": "Comportamento tipo autista (p.ex maneirismos manuais ou dos dedos, apego anormal, dificuldades extremas com mudanças, comportamentos muito repetitivo não funcionais, uso não apropriado dos objectos C:"
          },
          {
            "code": 6,
            "text": "Falta de capacidade de viver independente ou feliz (incluindo dificuldade em encontrar emprego, tomar conta de si)"
          },
          {
            "code": 7,
            "text": "Preocupações não directamente associadas com o comportamento ou desenvolvimento (ex. problemas familiares ou disputa sobre cuidados ou escolaridade ou preocupações sobre compensação financeira) D:"
          },
          {
            "code": 8,
            "text": "Profissionais preocupados, pais não"
          }
        ],
        "timepoints": [
          "actual"
        ]
      },
      {
        "num": "2",
        "id": "item_2",
        "text": "IDADE (EM MESES) EM QUE OS PAIS",
        "type": "age",
        "notes": [],
        "probes": [
          "Que idade tinha o(a) _____ quando notou, pela primeira vez, que alguma coisa não estava bem no seu desenvolvimento?",
          "Nota: Se os pais expressam a idade em semanas, codifique o mês mais próximo.?",
          "Que idade tinha o(a) _____ quando notou, pela primeira vez, que alguma coisa não estava bem no seu desenvolvimento?",
          "Nota: Se os pais expressam a idade em semanas, codifique o mês mais próximo.?"
        ],
        "codes": [
          {
            "code": 991,
            "text": "pais não preocupados, embora a criança tenha sido referenciada pelos profissionais"
          },
          {
            "code": 992,
            "text": "pais preocupados desde o nascimento(p.ex se o bebé foi prematuro ou doente ao nascer)"
          },
          {
            "code": 996,
            "text": "não se lembra, mas"
          },
          {
            "code": 997,
            "text": "não se lembra, mas foi"
          },
          {
            "code": 998,
            "text": "não aplicável"
          },
          {
            "code": 991,
            "text": "pais não preocupados, embora a criança tenha sido referenciada pelos profissionais"
          },
          {
            "code": 992,
            "text": "pais preocupados desde o nascimento(p.ex se o bebé foi prematuro ou doente ao nascer)"
          },
          {
            "code": 996,
            "text": "não se lembra, mas"
          },
          {
            "code": 997,
            "text": "não se lembra, mas foi"
          },
          {
            "code": 998,
            "text": "não aplicável"
          }
        ],
        "timepoints": []
      },
      {
        "num": "3",
        "id": "item_3",
        "text": "PRIMEIROS",
        "type": "concerns",
        "notes": [],
        "probes": [],
        "codes": [
          {
            "code": 0,
            "text": "Sem problemas, pais ou profissionais"
          },
          {
            "code": 1,
            "text": "Atraso/desvio no desenvolvimento da fala e ou linguagem expressiva (incluindo possível surdez, deficiência em responder"
          },
          {
            "code": 2,
            "text": "Problemas médicos (tal como convulsões) ou atraso nas aquisições de desenvolvimento para além da linguagem (pode incluir atraso de crescimento físico, desenvolvimento motor, controlo dos esfincteres ou ser lento)"
          },
          {
            "code": 3,
            "text": "Falta de interesse ou anomalia/estranheza na resposta emocional e social às pessoas (pode incluir dificuldades especificas em brincar com outras crianças ou estar “no seu mundo” ou incompetência social global) B:"
          },
          {
            "code": 4,
            "text": "Dificuldade do comportamento não especifica do autismo (p.ex. problemas de sono, alimentares, nível de actividade global excessivo, vaguear, comportamento destrutivo ou agressivo)"
          },
          {
            "code": 5,
            "text": "Comportamento tipo autista (p.ex. maneirismos manuais ou dos dedos, apego anormal, dificuldades extremas com a mudança, comportamentos muito repetitivos não funcionais, uso não apropriado dos objectos C:"
          },
          {
            "code": 6,
            "text": "Falta de capacidade de viver independente ou feliz (incluindo dificuldade em encontrar emprego, tomar conta de si)"
          },
          {
            "code": 7,
            "text": "Preocupações não directamente associadas com o comportamento ou desenvolvimento (p.ex. problemas familiares ou disputa sobre os cuidados ou escolaridade ou preocupações sobre compensação financeira) D:"
          },
          {
            "code": 8,
            "text": "Profissionais preocupados, pais não"
          },
          {
            "code": 9,
            "text": "Não conhecido ou não perguntado"
          }
        ],
        "timepoints": []
      },
      {
        "num": "4",
        "id": "item_4",
        "text": "IDADE (EM MESES) EM QUE OS PAIS",
        "type": "age",
        "notes": [],
        "probes": [
          "médico de família, pediatra) acerca deste problema?",
          "Nota: se os pais referirem a idade em semanas, codifique o mês mais próximo.?",
          "se o bebé foi prematuro ou muito doente ao nascimento.?",
          "21 DIAGNOSTICO (NÃO É NECESSÁRIO COTAR AQUI) Já alguma vez alguém disse que o(a) ________ tinha um problema médico ou lhe deu algum diagnóstico médico?",
          "(PEÇA DETALHES E REGISTE EM BAIXO) IDADE (EM MESES) EM QUE OS PAIS PEDIRAM CONSELHO PELA PRIMEIRA VEZ Quando é que pela primeira vez procurou alguém (p.ex médico de família, pediatra) acerca deste problema?",
          "Nota: se os pais referirem a idade em semanas, codifique o mês mais próximo.?",
          "se o bebé foi prematuro ou muito doente ao nascimento.?",
          "21 DIAGNOSTICO (NÃO É NECESSÁRIO COTAR AQUI) Já alguma vez alguém disse que o(a) ________ tinha um problema médico ou lhe deu algum diagnóstico médico?"
        ],
        "codes": [
          {
            "code": 991,
            "text": "Pais não preocupados, embora a criança tenha sido referida por profissionais"
          },
          {
            "code": 992,
            "text": "Pais preocupados desde o nascimento, p.ex. se o bebé foi prematuro ou muito doente ao nascimento."
          },
          {
            "code": 996,
            "text": "Não se lembra, mas"
          },
          {
            "code": 997,
            "text": "Não se lembra, mas"
          },
          {
            "code": 998,
            "text": "Não perguntado"
          },
          {
            "code": 991,
            "text": "Pais não preocupados, embora a criança tenha sido referida por profissionais"
          },
          {
            "code": 992,
            "text": "Pais preocupados desde o nascimento, p.ex. se o bebé foi prematuro ou muito doente ao nascimento."
          },
          {
            "code": 996,
            "text": "Não se lembra, mas"
          },
          {
            "code": 997,
            "text": "Não se lembra, mas"
          },
          {
            "code": 998,
            "text": "Não perguntado"
          }
        ],
        "timepoints": [
          "actual",
          "ever"
        ]
      },
      {
        "num": "5",
        "id": "item_5",
        "text": "INICIO EM",
        "type": "retrospective",
        "notes": [],
        "probes": [
          "UALQUER COISA NÃO USUAL OCORREU, DE ACORDO COM O MELHOR JULGAMENTO DO INFORMADOR, EM RETROSPECTIVA) Olhando para trás com atenção, quando é que pensa que o(a) ________ pela primeira vez mostrou algum problema ou dificuldade no desenvolvimento ou comportamento?",
          "Pensa que estava tudo completamente bem antes disso?"
        ],
        "codes": [
          {
            "code": 1,
            "text": "Problemas não presentes"
          },
          {
            "code": 2,
            "text": "Problemas não presentes"
          },
          {
            "code": 3,
            "text": "Problemas não presentes"
          },
          {
            "code": 4,
            "text": "Problemas não presentes"
          },
          {
            "code": 5,
            "text": "Problemas não presentes"
          },
          {
            "code": 6,
            "text": "Problemas não presentes"
          },
          {
            "code": 7,
            "text": "Criança sempre “diferente”, mas a diferença não foi percebida pelos pais como qualquer tipo de anomalia"
          },
          {
            "code": 8,
            "text": "Não foram notados problemas pelos pais"
          }
        ],
        "timepoints": [
          "anomal_45"
        ]
      }
    ]
  },
  {
    "title": "Etapas motoras",
    "items": [
      {
        "num": "6",
        "id": "item_6",
        "text": "SENTOU - SE SEM AJUDA NUMA",
        "type": "age",
        "notes": [],
        "probes": [
          "z sem suporte numa superfície plana?",
          "Nota: Recorde - se de registar a idade media e de arredondar para o mês acima mais próximo.?",
          "Tanto quanto possível, tente codificar a idade actual em vez de 996, etc (Codifique em meses, normal  8 meses) 995 – Ainda não conseguido 996 – Desconhecido, mas aparentemente normal 997 – Desconhecido, mas aparentemente atrasado 998 – Não aplicavel 999 – Não perguntado ou não conhecido SENTOU - SE SEM AJUDA NUMA SUPERFICIE PLANA Recorda - se que idade tinha o(a) ________ quando se sentou pela primeira vez sem suporte numa superfície plana?",
          "Nota: Recorde - se de registar a idade media e de arredondar para o mês acima mais próximo.?"
        ],
        "codes": [
          {
            "code": 995,
            "text": "Ainda não conseguido"
          },
          {
            "code": 996,
            "text": "Desconhecido, mas aparentemente normal"
          },
          {
            "code": 997,
            "text": "Desconhecido, mas aparentemente atrasado"
          },
          {
            "code": 998,
            "text": "Não aplicavel"
          },
          {
            "code": 999,
            "text": "Não perguntado ou não conhecido SENTOU - SE SEM AJUDA NUMA SUPERFICIE PLANA Recorda - se que idade tinha o(a) ________ quando se sentou pela primeira vez sem suporte numa superfície plana? Nota: Recorde - se de registar "
          },
          {
            "code": 995,
            "text": "Ainda não conseguido"
          },
          {
            "code": 996,
            "text": "Desconhecido, mas aparentemente normal"
          },
          {
            "code": 997,
            "text": "Desconhecido, mas aparentemente atrasado"
          },
          {
            "code": 998,
            "text": "Não aplicavel"
          },
          {
            "code": 999,
            "text": "Não perguntado ou não conhecido"
          }
        ],
        "timepoints": [
          "actual"
        ]
      },
      {
        "num": "7",
        "id": "item_7",
        "text": "MARCHA SEM AJUDA",
        "type": "age",
        "notes": [],
        "probes": [
          "Com que idade o(a) ________ começou a andar sem apoio?",
          "Nota: Recorde - se de registar a idade média e de arredondar para o mês acima mais próximo.?",
          "É, DOENÇA, FEBRE ELEVADA, RESPOSTA A MUDANÇA NO AMBIENTE, OU ANSIEDADE) Como se processou o treino do asseio?",
          "MARCHA SEM AJUDA E a andar?",
          "Com que idade o(a) ________ começou a andar sem apoio?",
          "Nota: Recorde - se de registar a idade média e de arredondar para o mês acima mais próximo.?",
          "É, DOENÇA, FEBRE ELEVADA, RESPOSTA A MUDANÇA NO AMBIENTE, OU ANSIEDADE) Como se processou o treino do asseio?"
        ],
        "codes": [
          {
            "code": 995,
            "text": "Ainda não conseguido"
          },
          {
            "code": 996,
            "text": "Desconhecido, mas aparentemente normal"
          },
          {
            "code": 997,
            "text": "Desconhecido, mas aparentemente atrasado"
          },
          {
            "code": 998,
            "text": "Não aplicável"
          },
          {
            "code": 995,
            "text": "Ainda não conseguido"
          },
          {
            "code": 996,
            "text": "Desconhecido, mas aparentemente normal"
          },
          {
            "code": 997,
            "text": "Desconhecido, mas aparentemente atrasado"
          },
          {
            "code": 998,
            "text": "Não aplicável"
          }
        ],
        "timepoints": [
          "actual"
        ]
      }
    ]
  },
  {
    "title": "Controlo de esfincteres",
    "items": [
      {
        "num": "8",
        "id": "item_8",
        "text": "AQUISIÇÃO DO",
        "type": "age",
        "notes": [],
        "probes": [
          "Que idade tinha quando adquiriu o controle da bexiga diurno?",
          "Quando é que se conseguiu manter seco por 12 meses sem acidentes?",
          "996 – Desconhecido, mas aparentemente atrasado 997 – Não aplicável 999 – Não conhecido ou não perguntado AQUISIÇÃO DO CONTROLO DA BEXIGA: DIA O(a) _________ está seco(a) durante o dia?",
          "Que idade tinha quando adquiriu o controle da bexiga diurno?",
          "Quando é que se conseguiu manter seco por 12 meses sem acidentes?"
        ],
        "codes": [
          {
            "code": 994,
            "text": "Nunca atingiu controle"
          },
          {
            "code": 996,
            "text": "Desconhecido, mas aparentemente atrasado"
          },
          {
            "code": 997,
            "text": "Não aplicável"
          },
          {
            "code": 994,
            "text": "Nunca atingiu controle"
          },
          {
            "code": 996,
            "text": "Desconhecido, mas aparentemente atrasado"
          },
          {
            "code": 997,
            "text": "Não aplicável"
          },
          {
            "code": 999,
            "text": "Não conhecido ou não perguntado"
          }
        ],
        "timepoints": []
      },
      {
        "num": "9",
        "id": "item_9",
        "text": "AQUISIÇÃO DO",
        "type": "age",
        "notes": [],
        "probes": [
          "Que idade tinha quando ficou seco pela primeira vez à noite?",
          "Quando é que permaneceu seco por 12 meses sem acidentes?",
          "996 – Desconhecido, mas aparentemente atrasado 997 – Não aplicavel 999 – Não conhecido ou não perguntado 24 AQUISIÇÃO DO CONTROLO DA BEXIGA - NOITE O(a) _________ está seco(a) à noite?",
          "Que idade tinha quando ficou seco pela primeira vez à noite?",
          "Quando é que permaneceu seco por 12 meses sem acidentes?"
        ],
        "codes": [
          {
            "code": 994,
            "text": "Nunca atingiu controle"
          },
          {
            "code": 996,
            "text": "Desconhecido, mas aparentemente atrasado"
          },
          {
            "code": 997,
            "text": "Não aplicavel"
          },
          {
            "code": 994,
            "text": "Nunca atingiu controle"
          },
          {
            "code": 996,
            "text": "Desconhecido, mas aparentemente atrasado"
          },
          {
            "code": 997,
            "text": "Não aplicavel"
          }
        ],
        "timepoints": []
      },
      {
        "num": "10",
        "id": "item_10",
        "text": "AQUISIÇÃO DO",
        "type": "age",
        "notes": [],
        "probes": [
          "Que idade tinha quando pela primeira vez controlou o intestino?",
          "Quando é que se conseguiu manter continente por mais de 12 meses sem acidentes?",
          "Como é a linguagem do(a) ______ agora?",
          "Ele(a) já aprendeu a falar?",
          "(ADAPTE AS SONDAGENS INICIAIS AO QUE JÁ SE SABE ACERCA DO NÍVEL DE LINGUAGEM DO SUJEITO E OBTENHA A DESCRIÇÃO PARA AJUDAR A ELABORAÇÃO DE QUESTÕES SEGUINTES) AQUISIÇÃO DO CONTROLO INTESTINAL O(a) alguma vez se suja com as suas fezes?",
          "Que idade tinha quando pela primeira vez controlou o intestino?",
          "Quando é que se conseguiu manter continente por mais de 12 meses sem acidentes?",
          "Como é a linguagem do(a) ______ agora?",
          "Ele(a) já aprendeu a falar?"
        ],
        "codes": [
          {
            "code": 994,
            "text": "Nunca atingiu controle"
          },
          {
            "code": 996,
            "text": "Desconhecido, mas aparentemente normal"
          },
          {
            "code": 997,
            "text": "Desconhecido, mas aparentemente atrasado"
          },
          {
            "code": 998,
            "text": "Não aplicavel"
          },
          {
            "code": 994,
            "text": "Nunca atingiu controle"
          },
          {
            "code": 996,
            "text": "Desconhecido, mas aparentemente normal"
          },
          {
            "code": 997,
            "text": "Desconhecido, mas aparentemente atrasado"
          },
          {
            "code": 998,
            "text": "Não aplicavel"
          }
        ],
        "timepoints": [
          "ever"
        ]
      }
    ]
  },
  {
    "title": "Comunicação",
    "items": [
      {
        "num": "11",
        "id": "item_11",
        "text": "UTILIZAÇÃO DO CORPO DE",
        "type": "coded",
        "notes": [],
        "probes": [
          "O DO BRAÇO OU DO CORPO DO SUJEITO.?",
          "DESTA MANEIRA, O CONTACTO NÃO É PARA INICIAR UMA APROXIMAÇÃO SOCIAL MAS ANTES PARA FACILITAR A CONCLUSÃO DA TAREFA) Como é que, normalmente, o(a) _____ deixa saber que quer algo?",
          "(se o sujeito fala, pergunte: como é que ele(a) o deixava saber, antes de falar, que ele(a) queria algo?)Alguma vez, ele(a) mostra/mostrou o que quer pegando na sua mão ou pulso ou outra parte do seu corpo?",
          "O que é que ele(a) faz exatamente?",
          "O que é que ele(a) faz quando o leva perante o objecto desejado?",
          "Alguma vez ele(a) usa a sua mão como se fosse uma ferramenta ou uma extensão do seu próprio braço (como por ex., apontar com a sua mão ou agarrar a sua mã o para rodar a maçaneta da porta)?",
          "Ele(a) olha para si enquanto faz isto?",
          "Ao mesmo tempo em que pega na sua mão, tenta comunicar com sons ou palavras?",
          "Quando é que ele(a) faz isto?",
          "Ele(a) tenta comunicar primeiro com sons ou gestos?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "não usa o corpo do outro para comunicar, excepto nas situações em que outras estratégias não resultaram (i.é, quando os pais estão a conversar com alguém e o sujeito não consegue chamar - lhes atenção)"
          },
          {
            "code": 1,
            "text": "colocação ocasional das mãos nos objectos ou o seu uso como ferramenta ou para apontar, mas há"
          },
          {
            "code": 2,
            "text": "colocação ocasional da mão do outro ou uso da mão do outro como uma ferramenta ou para demonstrar “pelo” sujeito, sem integração com outro modo de comunicação"
          },
          {
            "code": 3,
            "text": "uso frequente da mão do outro como ferramenta ou para se exprimir “pelo” sujeito"
          },
          {
            "code": 8,
            "text": "pouca ou nenhuma comunicação espontânea"
          }
        ],
        "timepoints": [
          "actual",
          "ever"
        ]
      },
      {
        "num": "12",
        "id": "item_12",
        "text": "IDADE DE",
        "type": "age",
        "notes": [],
        "probes": [
          "NÃO CONSIDERAR “MAMÃ” OU “PAPÁ”; INCLUIR QUAISQUER SONS ESPONTÂNEOS , FONOLOGICAMENTE CONSISTENTES, QUE SE APROXIMEM DA FORMA COMO AS PALAVRAS SÃO DITAS NA LINGUAGEM FAMILIAR E USADAS REPETIDAMENTE COM SIGNIFICADO) Q ue idade tinha ele(a) quando disse, pela primeira vez, palavras com significado, para além de “mamã” ou “papá”?",
          "Quais foram as primeiras palavras?",
          "Como é que ele(a) demonstrou perceber o significado das palavras?",
          "(PEÇA EXEMPLOS) O(a) _____ alguma vez usou estas palavras para se referir a mais alguma coisa ou como sons que pareciam não ter nenhum significado especí fico?",
          "NÃO CONSIDERAR “MAMÃ” OU “PAPÁ”; INCLUIR QUAISQUER SONS ESPONTÂNEOS , FONOLOGICAMENTE CONSISTENTES, QUE SE APROXIMEM DA FORMA COMO AS PALAVRAS SÃO DITAS NA LINGUAGEM FAMILIAR E USADAS REPETIDAMENTE COM SIGNIFICADO) Q ue idade tinha ele(a) quando disse, pela primeira vez, palavras com significado, para além de “mamã” ou “papá”?",
          "Quais foram as primeiras palavras?",
          "Como é que ele(a) demonstrou perceber o significado das palavras?",
          "(PEÇA EXEMPLOS) O(a) _____ alguma vez usou estas palavras para se referir a mais alguma coisa ou como sons que pareciam não ter nenhum significado especí fico?"
        ],
        "codes": [
          {
            "code": 994,
            "text": "etapa de desenvolvimento não atingida"
          },
          {
            "code": 996,
            "text": "não conhecido, mas aparentemente normal"
          },
          {
            "code": 997,
            "text": "não conhecido, mas aparentemente atrasado"
          },
          {
            "code": 999,
            "text": "não conhecido ou não perguntado IDADE DE AQUISIÇÃO DAS PRIMEIRAS PALAVRAS ISOLADAS (SE"
          },
          {
            "code": 994,
            "text": "etapa de desenvolvimento não atingida"
          },
          {
            "code": 996,
            "text": "não conhecido, mas aparentemente normal"
          },
          {
            "code": 997,
            "text": "não conhecido, mas aparentemente atrasado"
          },
          {
            "code": 999,
            "text": "não conhecido ou não perguntado"
          }
        ],
        "timepoints": [
          "ever"
        ]
      },
      {
        "num": "13",
        "id": "item_13",
        "text": "IDADE DE",
        "type": "age",
        "notes": [],
        "probes": [
          "NÃO COTAR COMBINAÇÕES DE SUBSTANTIVO/ATRIBUTO NEM DISCURSO ECOLÁLICO NEM FRASES QUE POSSAM TER SIDO APRENDIDAS COMO UMA SÓ PALAVRA COM UM ÚNICO SIGNIFICADO, POR EXEMPLO: “ATÉ LOGO” (QUE SIGNIFICA “ADEUS ”) – NOTE QUE ESTA DEFINIÇÃO DIFERE DO CONSIDERADO COMO VERBAL NO ITEM 19) Que idade tinha ele(a) quando primeiro disse algo com significado que envolvesse juntar palavras, isto é, usar frases com 2 ou 3 palavras?",
          "O que é que ele(a) disse?",
          "E as frases com verbo?",
          "NÃO COTAR COMBINAÇÕES DE SUBSTANTIVO/ATRIBUTO NEM DISCURSO ECOLÁLICO NEM FRASES QUE POSSAM TER SIDO APRENDIDAS COMO UMA SÓ PALAVRA COM UM ÚNICO SIGNIFICADO, POR EXEMPLO: “ATÉ LOGO” (QUE SIGNIFICA “ADEUS ”) – NOTE QUE ESTA DEFINIÇÃO DIFERE DO CONSIDERADO COMO VERBAL NO ITEM 19) Que idade tinha ele(a) quando primeiro disse algo com significado que envolvesse juntar palavras, isto é, usar frases com 2 ou 3 palavras?",
          "O que é que ele(a) disse?",
          "E as frases com verbo?"
        ],
        "codes": [
          {
            "code": 994,
            "text": "etapa de desenvolvimento não atingida"
          },
          {
            "code": 996,
            "text": "não conhecido, mas aparentemente normal"
          },
          {
            "code": 997,
            "text": "não conhecido, mas aparentemente atrasado"
          },
          {
            "code": 994,
            "text": "etapa de desenvolvimento não atingida"
          },
          {
            "code": 996,
            "text": "não conhecido, mas aparentemente normal"
          },
          {
            "code": 997,
            "text": "não conhecido, mas aparentemente atrasado"
          }
        ],
        "timepoints": [
          "ever"
        ]
      },
      {
        "num": "14",
        "id": "item_14",
        "text": "ARTICULAÇÃO/PRONUNCIA",
        "type": "coded",
        "notes": [],
        "probes": [
          "GUAGEM) Como é a pronuncia dele(a)?",
          "Há alguns sons que ele(a) não consegue dizer muito bem?",
          "As pessoas entendem - no facilmente?",
          "E as pessoas fora da família?",
          "Como era a sua articulação quando tinha 5 anos?",
          "Que erros fazia ele(a) nessa altura?",
          "(Anote exemplos) Um estranho conseguia entendê - lo?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "compreendido por todos, isto é, produção clara da maioria dos sons, mas pode fazer"
          },
          {
            "code": 2,
            "text": "dificuldades de articulação definidas, com"
          },
          {
            "code": 3,
            "text": "os estranhos consideram o discurso quase impossível de ser entendido ou os pais têm dificuldades significativas para o entenderem devido à articulação"
          },
          {
            "code": 8,
            "text": "não aplicável"
          },
          {
            "code": 9,
            "text": "não conhecido ou não questionado"
          }
        ],
        "timepoints": [
          "actual",
          "anomal_45"
        ]
      },
      {
        "num": "15",
        "id": "item_15",
        "text": "COMPLEXIDADE DE",
        "type": "coded",
        "notes": [],
        "probes": [
          "É ÚTIL PEDIR AOS PAIS /EDUCADORES PARA RELATAREM UMA CONVERSA COM O SUJEITO, POR EX., DURANTE O CAMINHO PARA A ENTREVISTA OU NUMA REFEIÇÃO RECENTE ) Agora, quando fala, que tipo de combinações de palavras ou frases ele(a) faz?",
          "Qual é a extensão média das frases?",
          "(1/2/6 palavras?) E quando ele(a) não está ecolálico?",
          "O(a) _______ consegue fazer diferentes tipos de frases, como perguntas, ordens ou negativas?",
          "Ele(a) consegue juntar 2 ideias numa frase através do ‘mas’ ou ‘se’?",
          "(ANOTE EXEMPLOS) E quando tinha 5 anos ?"
        ],
        "codes": [
          {
            "code": 1,
            "text": "extenso vocabulário e uma série de construções gramaticais mas ligeiramente limitado na flexibilidade e variedade e/ou com frequentes erros gramaticais ou omissões"
          },
          {
            "code": 2,
            "text": "n.º significativo de frases que seguem regras gramaticais simples, mas, com construções marcadamente limitadas em variedade e complexidade"
          },
          {
            "code": 3,
            "text": "predominam as frases simples no discurso não ecolálico"
          },
          {
            "code": 4,
            "text": "predominam as palavras isoladas no discurso não ecolálico"
          },
          {
            "code": 8,
            "text": "não aplicável"
          }
        ],
        "timepoints": [
          "actual",
          "anomal_45"
        ]
      },
      {
        "num": "16",
        "id": "item_16",
        "text": "VOCALIZAÇÃO SOCIAL/CONVERSA FAMILIAR",
        "type": "coded",
        "notes": [],
        "probes": [
          "O FOCUS DESTE ITEM É A ABORDAGEM SOCIAL E NÃO A RECIPROCIDADE SOCIAL, A QUAL É TRATADA NA QUESTÃO 20 ) PARA OS SUJEITOS QUE NÃO PRODUZEM FRASES Quando as crianças palram ou começam a falar, às vezes parecem fazer sons apenas para serem simpáticos/amigáveis e sociáveis e não porque queiram alguma coisa.?",
          "O(a) _______ faria isto?",
          "Ele(a) fala ou diz sons como se fizesse “comentários” ou para que vocês continuem a falar com ele(a)?",
          "Quando conversa com o(a) _______, ele(a) tenta responder ou integrar - se como se estivesse a conversar?",
          "Quando as crianças começam a falar, eles seguem os pais sempre a falar, mesmo quando apenas sabem algumas palavras.?",
          "Com o(a) _______ aconteceu isto?",
          "Quer dizer, alguma vez falou ou fez sons apenas para ser social?",
          "PARA OS SUJEITOS QUE PRODUZEM FRASES Por vezes, quando as pessoas falam, é para obterem algo ou para descobrirem alguma coisa mas, por vezes é apenas para ter com alguém uma ‘pequena conversa’.?",
          "O(a) _____ alguma vez conversou consigo, simplesmente para participar nalguma forma de conversação?",
          "E quando e le(a) tinha 4 ou 5 anos?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "vocaliza ou cavaqueia com clara qualidade de conversa social para ser simpático ou mostrar interesse, e não para dar a conhecer as necessidades"
          },
          {
            "code": 1,
            "text": "algumas vocalizações ou discurso com uso social em resposta ao educador ou para chamar a atenção, sem outra motivação óbvia, mas limitada na frequência ou na qualidade vocal ou na variedade de contextos"
          },
          {
            "code": 2,
            "text": "usa alguns sons ou discurso para alertar o educador para as necessidades ou desejos imediatos mas com pouco ou nenhum uso de vocalização puramente ‘social’"
          },
          {
            "code": 3,
            "text": "sem ou uso muito limitado de sons ou discurso"
          },
          {
            "code": 8,
            "text": "não aplicável"
          }
        ],
        "timepoints": [
          "actual",
          "ever",
          "anomal_45"
        ]
      },
      {
        "num": "17",
        "id": "item_17",
        "text": "ECOLÁLIA IMEDIATA 3",
        "type": "coded",
        "notes": [],
        "probes": [
          "O(a) ____ alguma vez repetiu a última ou duas últimas palavras que estava a dizer, ou já repetiu frases inteiras, com a mesma entoação com que foi dita por si?",
          "Pode dar - me um exemplo?",
          "Ele(a) já fez alguma vez isto?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "raramente ou nunca repete/repetiu palavras ou frases"
          },
          {
            "code": 1,
            "text": "repete/repetiu ocasionalmente palavras ou frases"
          },
          {
            "code": 2,
            "text": "repete/repetiu regularmente palavras ou frases mas também tem linguagem funcional (que pode ser estereotipada)"
          },
          {
            "code": 3,
            "text": "predomina/predominou ecolália imediata no discurso"
          },
          {
            "code": 8,
            "text": "o discurso existente não é suficiente para cotar"
          },
          {
            "code": 9,
            "text": "não conhecido ou não questionado"
          }
        ],
        "timepoints": [
          "actual",
          "ever"
        ]
      },
      {
        "num": "18",
        "id": "item_18",
        "text": "EXPRESSÕES",
        "type": "coded",
        "notes": [],
        "probes": [
          "(SE O SUJEITO FALAR, PERGUNTE) O(a) _____ alguma vez teve tendência para usar frases excêntricas ou repetir muitas vezes uma frase inteira, com a mesma entoação com que foi 1º dita?",
          "Isto é, frases que ouviu outras pessoas usar ou que ele próprio inventou?",
          "“é mau morder o pulso”; “isto parece um semáforo”; “diz que agora está bem”) Ele(a) tem tendência para falar consigo próprio desta forma quando está ocupado, ou aborrecido com qualquer que aconteceu durante o dia?",
          "E usa a frase de forma apropriada ou sem significado nenhum em particular ou como parte de uma conversa consigo próprio?",
          "Pode dar - me exemplos?",
          "E quando era mais novo?",
          "Alguma vez ele(a) tem ladainhas sobre o que está a fazer?",
          "Alguma vez fez isto com maior frequência?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "raramente ou nunca repete/repetiu frases estereotipadas"
          },
          {
            "code": 1,
            "text": "o discurso tende/tendeu a ser"
          },
          {
            "code": 2,
            "text": "usa/usou regularmente frases estereotipadas com ou sem linguagem funcional também"
          },
          {
            "code": 3,
            "text": "predomina/predominou frases estereotipadas no discurso"
          },
          {
            "code": 8,
            "text": "não aplicável"
          }
        ],
        "timepoints": [
          "actual",
          "ever"
        ]
      },
      {
        "num": "19",
        "id": "item_19",
        "text": "NÍVEL",
        "type": "coded",
        "notes": [],
        "probes": [
          "PARA OS SUJEITOS VERBAIS ANTERIORMENTE, MAS QUE DEIXARAM DE FALAR PELOS 4 OU 5 ANOS, COTAR ‘8’ EM “ MAIS ANÓMALO 4.?"
        ],
        "codes": [],
        "timepoints": [
          "actual",
          "anomal_45"
        ]
      },
      {
        "num": "20",
        "id": "item_20",
        "text": "CONVERSAÇÃO RECÍPROCA",
        "type": "coded",
        "notes": [],
        "probes": [
          "IDEZ DA CONVERSAÇÃO , I.É, ACOMPANHAR AS RESPOSTAS DAS OUTRAS PESSOAS – DE RESPONDER EM FUNÇÃO DO QUE LHE É DITO E NÃO NA SUA CAPACIDADE DE CONVERSAR) Consegue ter uma conversa com o(a) ______ ?",
          "Ou seja, se lhe disser alguma coisa, sem fazer uma pergunta directa, o que é que ele(a) normalmente fará?",
          "Ele(a) pergunta - lhe alguma coisa ou constrói sobre aquilo que lhe diz, de tal maneira que acrescenta algo de novo, de modo a que a conversa possa continuar?",
          "Por outras palavras, ele(a) conversa compreendendo e respondendo sobre tópicos que lhe sejam propostos?",
          "Pode ele(a) próprio(a) apresentar tópicos?",
          "E quando ele(a) tinha 4 ou 5 anos?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "a conversação flui incluindo tanto a oferta de informação como a construção sobre a resposta de outrém, de forma a conduzir a um diálogo"
          },
          {
            "code": 1,
            "text": "conversação recíproca ocasional, mas menos frequente que o normal ou limitada em flexibilidade ou tópicos"
          },
          {
            "code": 2,
            "text": "pouca ou nenhuma conversação recíproca; é difícil, para os outros, construir uma conversação mesmo que haja um comentário aparentemente positivo ou social do sujeito; o sujeito não consegue seguir o tópico de conversa de"
          },
          {
            "code": 3,
            "text": "pouco discurso espontâneo"
          },
          {
            "code": 9,
            "text": "não conhecido ou não questionado"
          }
        ],
        "timepoints": [
          "actual",
          "anomal_45"
        ]
      },
      {
        "num": "21",
        "id": "item_21",
        "text": "CONVERSA",
        "type": "coded",
        "notes": [],
        "probes": [
          ", IDEIAS OU ATITUDES DE ALGUÉM, SENDO REVELADO DE UMA FORMA INTERACTIVA COMO PARTE DE UMA CONVERSAÇÃO) Ele(a) alguma vez faz perguntas como parte de uma conversa?",
          "Como são essas perguntas?",
          "Ele(a) alguma vez fez perguntas sobre si ou sobre os seus sentimentos?",
          "O(a) ______ falará de um tema em que você está interessado?",
          "Ele(a) tenta participar nas vossas idei as ou interesses?",
          "Por exemplo, o(a) ____ alguma vez pergunta como foi o seu dia, ou como se sente, ou acerca do que esteve a fazer?",
          "Ele(a) parece mesmo interessado(a) em ouvir falar acerca dos temas do vosso interesse ou as perguntas fazem apenas parte da rotina ou interes se dele(a)?",
          "E como é com as pessoas fora da família?",
          "E quando ele(a) tinha 4/5 anos?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "qualquer que seja o nível de complexidade possível faz perguntas variadas, na conversação, que indicam um interesse espontâneo na vida do ouvinte"
          },
          {
            "code": 2,
            "text": "as questões que digam respeito ao ouvinte são muitas vezes limitadas às rotinas ou preocupações"
          },
          {
            "code": 3,
            "text": "não faz perguntas que digam respeito ao ouvinte"
          }
        ],
        "timepoints": [
          "actual",
          "ever",
          "anomal_45"
        ]
      },
      {
        "num": "22",
        "id": "item_22",
        "text": "PERGUNTAS OU",
        "type": "coded",
        "notes": [],
        "probes": [
          "PODEM CONSISTIR EM FRASES QUE SÃO INTRINSECAMENTE ESTRANHAS (POR EX., “QUE ALTURA TINHA O SR.?",
          "JOÃO QUANDO TINHA 2 A NOS?”) OU FRASES QUE SÃO INAPROPRIADAS DEVIDO À SUA NATUREZA PESSOAL OU AO CONTEXTO.?",
          "A REPETIÇÃO PODE CONTRIBUI R PARA A ESTRANHEZA MAS NÃO É SUFICIENTE POR SI PRÓPRIA) Há alturas em que o(a) _____ faz declarações ou perguntas socialmente inadequadas?",
          "Por ex., ele(a) faz regularmente perguntas pessoais ou comentários pessoais que criam embaraço/incómodo?",
          "(PEÇA EXEMPLOS) Isto foi alguma vez um problema no passado?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "sem ou muito raras questões/comentários inapropriados para a conversação"
          },
          {
            "code": 2,
            "text": "uso frequente de questões / comentários que são estranhos e/ou claramente inapropriados à situação"
          },
          {
            "code": 9,
            "text": "não conhecido ou não questionado Agora, quero perguntar - lhe acerca da qualidade da fala do _______ ."
          }
        ],
        "timepoints": [
          "actual",
          "ever"
        ]
      },
      {
        "num": "23",
        "id": "item_23",
        "text": "INVERSÃO DOS PRONOMES",
        "type": "coded",
        "notes": [],
        "probes": [
          "INCLUI A CONFUSÃO ENTRE O “EU/MIM”, POIS É GERALMENTE UMA UTILIZAÇÃO SUBCULTURALMENTE ACEITÁVEL) O(a) _____ alguma vez usou de forma errada o seu pronome pessoal ?",
          "por exemplo, o(a) ______ já trocou o “tu” com o “eu”?",
          "e dizer “ele” ou “ela” em vez de “eu”?",
          "Se assim é, quando ele(a) usa “tu” ou “ele(a)” em vez de “eu”, como é que ele(a) o diz?",
          "Por ex., o seu comentário tem a mesma entoação que uma pergunta?",
          "E quando ele(a) era mais novo?"
        ],
        "codes": [
          {
            "code": 1,
            "text": "refere - se / referiu - se a ele próprio pelo nome em vez do “eu” depois de, na sua linguagem, já ter adquirido os pronomes, mas não há uma confusão persistente entre o “tu/ele(a)” e “eu"
          },
          {
            "code": 2,
            "text": "confusão entre “tu - eu” ou “ele(a) – eu” depois de, na sua linguagem, já ter adquirido os pronomes mas, “tu” ou “ele(a)” não são usados com a entoação de uma pergunta"
          },
          {
            "code": 3,
            "text": "confusão entre “tu/eu” ou “ele(a) – eu” com a entoação de uma pergunta quando usa “tu” ou “ele(a)” para “eu"
          },
          {
            "code": 7,
            "text": "outros tipos de confusão pronominal (para além de eu/mim) como “ele/tu”"
          }
        ],
        "timepoints": [
          "actual",
          "ever"
        ]
      },
      {
        "num": "24",
        "id": "item_24",
        "text": "NEOLOGISMOS/LINGUAGEM IDIOSINCRÁTICA",
        "type": "coded",
        "notes": [],
        "probes": [
          "PARA UM PAPEL OU TELA QUE CAIA NO CHÃO; “MASHUDA” PARA TRIÂNGULOS) (IDIOSINCRÁTICO REFERE - SE A PALAVRAS VERDADEIRAS/REAIS E/ OU FRASES USADAS OU COMBINADAS PELO SUJEITO DE UMA FORMA QUE ELE NUNCA OUVIU.?",
          "DIFERENCIAR A UTILIZAÇÃO INVULGAR OU VERDADEIRAMENTE IDIOSINCRÁTICA DE REFERÊNCIAS INFANTIS HABITUAIS A OBJECTOS SEGUNDO AS SUAS FUNÇÕES OU COMO PARTE DE UM JOGO DE GRUPO OU BRINCADEIRA) Ele(a) alguma vez usou palavras que pareçam ter sido inventadas por ele(a) próprio?",
          "O(a) _____ já alguma vez expôs as coisas de modo estranho ou forma mais indirecta, ou teve formas idiossincráticas de dizer as coisas, como “chuva quente” para “vapor”, ou referir - se à sua avó pela sua idade?",
          "Será que ele(a) se referiria a uma senhora por “55”?",
          "Pode - me dar alguns exemplos?",
          "No passado alguma vez ele(a) usou este tipo de palavras ou frases estranhas?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "não usa neologismos ou linguagem idiosincrática"
          },
          {
            "code": 1,
            "text": "uso ocasional de neologismos e/ou palavras “idiossincrática” usadas consistentemente durante um certo período de tempo"
          },
          {
            "code": 2,
            "text": "uso regular de neologismos e/ou formas “idiossincráticas” de dizer as coisas, incluindo generalização de termos pouco usuais para referências além do exemplo que despoletou a utilização inicial da palavra ou frase idiosi"
          }
        ],
        "timepoints": [
          "actual",
          "ever"
        ]
      },
      {
        "num": "25",
        "id": "item_25",
        "text": "RITUAIS VERBAIS",
        "type": "coded",
        "notes": [],
        "probes": [
          "A ÊNFASE ESTÁ NAS SEQUÊNCIAS FIXAS DE FRASES DITAS COMO SE O SUJEITO ESTIVESSE SOBRE PRESSÃO PARA AS COMPLETAR NUMA DETERMINADA ORDEM.?",
          "O SUJEITO ESTÁ A IMPÔR UM CERTO TIPO DE ORDEM NAQUILO QUE DIZ E PODE, ALÉM DI SSO, PÔR RESTRICÇÕES SIMILARES NAS RESPOSTAS VERBAIS DOS OUTROS) Alguma vez ele(a) repete a mesma coisa muitas vezes, sempre da mesma maneira, ou insiste consigo para repetir muitas vezes a mesma coisa?",
          "Alguma vez ele(a) repete muitas vezes a mesma coisa, até que lhe responda de uma certa forma?",
          "O que acontece se o interromper ou se se recusar a fazer aquilo que lhe pede?",
          "Alguma vez isto foi um problema, no passado?"
        ],
        "codes": [
          {
            "code": 1,
            "text": "tendência para dizer coisas de uma maneira ritualizada ou mandar os outros fazê - lo, mas sem indicação de que isso seja compulsivo, parando rapidamente se tal lhe for pedido"
          },
          {
            "code": 2,
            "text": "o sujeito tem obrigatoriamente de dizer uma ou"
          }
        ],
        "timepoints": [
          "actual",
          "ever"
        ]
      },
      {
        "num": "26",
        "id": "item_26",
        "text": "ENTOAÇÃO/VOLUME/RITMO/VELOCIDADE",
        "type": "coded",
        "notes": [],
        "probes": [
          "O DISCURSO DO SUJEITO, COMO EVIDENCIADOS PELA SUA ENTOAÇÃO, RITMO E DÉBITO.?",
          "NÃO COTAR NESTE ITEM A UTILIZAÇÃO DE FRASES COLOQUIAIS OU INJURIOSAS) Há algo de invulgar na forma dele(a) falar?",
          "Ou seja, o volume da sua fala é normal, ou consistentemente demasiado alto ou baixo?",
          "E quanto ao débito e ritmo da sua fala?",
          "E quanto à sua entoação ou afinação?",
          "Ele(a) alguma vez repete frases inteiras ou monólogos num tom de voz exactamente igual àquele em os ouviu pela primeira vez?",
          "(PEÇA DETALHES) E como era no passado?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "normal, variação adequada da entoação, volume razoável e débito normal da fala, com ritmo regular coordenado com a respiração"
          },
          {
            "code": 1,
            "text": "fala que evidencia uma ou"
          },
          {
            "code": 2,
            "text": "fala claramente anormal, em algum ou todos dos seguintes termos: (I) entoação estranha ou afinação e stress desapropriados (II) fala monocórdica ou mecânica (III) volume consistentemente anormal, sem modulação (IV) débit"
          },
          {
            "code": 7,
            "text": "gagueja ou balbucia"
          },
          {
            "code": 9,
            "text": "não conhecido ou não questionado"
          }
        ],
        "timepoints": [
          "actual",
          "ever"
        ]
      },
      {
        "num": "27",
        "id": "item_27",
        "text": "EXPRESSÃO VOCAL",
        "type": "coded",
        "notes": [],
        "probes": [
          "OM DA SUA VOZ, COMO PARTE DE UM ACTO DE COMUNICAÇÃO ) Pode - se perceber a forma como ele(a) se sente através do tom da sua voz , sem atender às palavras que diz?",
          "Quão subtis são as diferenças?",
          "Pode - se perceber quando está intrigado, interessado ou irritado?",
          "Se ele(a) estivesse a falar ao telefone com alguém, poder - se - ia ter alguma ideia sobre quem seria essa pessoa?",
          "Será que outra pessoa qualquer que não o conhecesse poderia fazer o mesmo?",
          "( PEÇA DETALHES ) E quanto ao passado?",
          "alguma vez foi difícil fazê - lo?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "expressão tonal normal"
          },
          {
            "code": 1,
            "text": "alguma expressividade tonal, mas limitada em variedade"
          },
          {
            "code": 2,
            "text": "expressividade vocal limitada a alterações estranhas e invulgares no tom ou som"
          },
          {
            "code": 3,
            "text": "pouca ou nenhuma expressão tonal"
          }
        ],
        "timepoints": [
          "actual",
          "ever"
        ]
      },
      {
        "num": "28",
        "id": "item_28",
        "text": "DISCURSO",
        "type": "coded",
        "notes": [],
        "probes": [
          "AR) De que forma é que o(a) _____ usa as palavras que tem?",
          "Em que tipo de situação é que ele(a) “conversa” mais?",
          "Ele(a) chama - o pelo seu nome ou usa palavras para chamar a sua atenção?",
          "( ARRANGE EXEMPLOS DO USO COMUNICATIVO DE PALAVRAS ) Alguma vez o sujeito lhe fala de coisas que não estão presentes (i.é., sobre algo que aconteceu à algum tempo ou sobre algo que queira fazer)?",
          "E como era quando ele(a) tinha 5 anos de idade?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "fala, qualquer que seja o nível atingido, usado frequente e comunicativamente numa variedade de contextos, incluindo"
          },
          {
            "code": 1,
            "text": "algum uso comunicativo de palavras (i. é., palavras usada regularmente para comunicar, com ou sem um elemento anormal), mas de"
          },
          {
            "code": 2,
            "text": "algumas palavras espontâneas e/ou linguagem ecolálica mas com uso comunicativo limitado"
          },
          {
            "code": 3,
            "text": "pouca ou nenhuma linguagem comunicativa (i. é., incluindo ecolália exclusivamente não comunicativa), apesar do sujeito ter"
          }
        ],
        "timepoints": [
          "actual",
          "ever",
          "anomal_45"
        ]
      },
      {
        "num": "29",
        "id": "item_29",
        "text": "IMITAÇÃO",
        "type": "coded",
        "notes": [],
        "probes": [
          "EXCLUIR AS IMITAÇÕES DE PERSONAGENS DA TV E FILMES) O(a) ________imita - o(a) a si ou a outras pessoas da família?",
          "E quando não está a tentar que ele(a) o imite?",
          "Ele(a) imita algo que você tenha feito, através do uso de um objecto “substituto” (como o cortar de um campo relvado com um veículo de brinquedo?) A imitação dá - se apenas ao mesmo tempo que você está a fazer aquilo que ele(a) está a imitar, ou faz parte das suas brincadeiras noutras alturas?",
          "As coisas que ele(a) imita são muito variadas?",
          "A imitação envolve alguma característica pessoal, como a sua forma de caminhar, gesto ou a forma como você segura algo?",
          "NÃO COTAR, NESTE CASO, AS IMITAÇÕES PEDIDAS OU VOCAIS) E quando o sujeito tinha entre 4 ou 5 anos?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "imitou espontaneamente uma variedade de acções não - ensinadas, das quais pelo menos"
          },
          {
            "code": 2,
            "text": "imitação espontânea limitada de"
          },
          {
            "code": 3,
            "text": "muito rara ou nenhuma imitação espontânea"
          },
          {
            "code": 8,
            "text": "não aplicável"
          }
        ],
        "timepoints": [
          "actual",
          "anomal_45"
        ]
      },
      {
        "num": "30",
        "id": "item_30",
        "text": "APONTA PARA",
        "type": "coded",
        "notes": [],
        "probes": [
          "O APONTAR DEVE SER DIRIGIDO A ALGO A UMA CERTA DISTÂNCIA, DENTRO DE UM CONTEXTO VISUAL LARGO.?",
          "O APONTAR A LIVROS OU COMO RESPOSTA APRENDIDA A QUESTÕES É COTADO SEPARADAMENTE DO APONTAR ESPONTÂNEO.?",
          "PARA COTAÇÃO MÁXIMA, O APONTAR TEM QUE INVOLVER CONTACTO VISUAL COORDENADO COM OUTRA PESSOA, COMO DESCRITO ABAIXO) O sujeito alguma vez aponta espontaneamente a coisas à sua volta?",
          "Com o dedo ou mão estendida, como se estivesse a tentar alcançar?",
          "Em que circunstâncias?",
          "Alguma vez ele(a) aponta a coisas à distância, como através de uma janela de casa, de um carro ou auto - carro?",
          "O ________ pode fazer isto?",
          "E quando ele(a) tinha entre 4 a 5 anos?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "aponta espontaneamente para objectos à distância com o dedo para expressar interesse, usando um olhar coordenado com outra pessoa para comunicar"
          },
          {
            "code": 2,
            "text": "não faz tentativas espontâneas de apontar para expressar o interesse, mas por vezes aponta quando é incitado e/ou expressa interesse, de outras maneiras"
          },
          {
            "code": 8,
            "text": "não aplicável"
          }
        ],
        "timepoints": [
          "actual",
          "ever",
          "anomal_45"
        ]
      },
      {
        "num": "31",
        "id": "item_31",
        "text": "GESTOS CONVENCIONAIS/INSTRUMENTAIS",
        "type": "coded",
        "notes": [],
        "probes": [
          "PARA AJUDAR OS PAIS A LEMBRAREM - SE DOS GESTOS É MUITAS VEZES ÚTIL FOCAR AS MANEIRAS COMO OS SUJEITOS CHAMAM A SUA ATENÇÃO, OU USAM OS GESTOS QUANDO OUTRAS FORMAS DE COM UNICAÇÃO NÃO FORAM CLARAS OU NÃO SURTIRAM EFEITO ) O(a) _____acena para dizer adeus?",
          "Quando é que isso acontece?",
          "Alguma vez ele(a) usa outros gestos comuns, como o mandar um beijo, bater as palmas por algo que tenha sido bem feito, pôr o dedo nos lábios como pedindo “silêncio”, ou abanar o dedo estendido p ara dizer “mau”?",
          "Alguma vez ele(a) usa outros gestos para além do estender de braços ao alto, como pedindo para ser levantado, para que lhe faça saber o que ele(a) quer?",
          "Alguma vez ele(a) usa gestos quando tenta que o ajude ou para chamar a sua atenção (por ex: acenando a alguém, ou estendendo a mão com a palma para cima, para pedir que lhe dêem algo?) E quando ele(a) tinha 4 a 5 anos?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "uso apropriado e espontâneo de uma variedade de gestos instrumentais e convencionais"
          },
          {
            "code": 1,
            "text": "uso espontâneo de gestos instrumentais ou convencionais, mas limitado em variedade e/ou contexto"
          },
          {
            "code": 2,
            "text": "uso espontâneo inconsistente, e/ou uso apenas de gestos induzidos ou gestos convencionais simples e bem ensaiados, ou gestos instrumentais"
          },
          {
            "code": 3,
            "text": "nenhum uso de gestos convencionais ou instrumentais"
          },
          {
            "code": 8,
            "text": "não aplicável"
          }
        ],
        "timepoints": [
          "actual",
          "ever",
          "anomal_45"
        ]
      },
      {
        "num": "32",
        "id": "item_32",
        "text": "ACENA COM A CABEÇA (SIM)",
        "type": "coded",
        "notes": [],
        "probes": [
          "O ACENO COM A CABEÇA DEVERÁ TER OCORRIDO EM SITUAÇÕES DIFERENTES MAS PODE TER DIMINUÍDO EMFREQUÊNCIA À MEDIDA QUE O SUJEITO APRENDE U A FALAR) O(a) ______acena com a cabeça para dizer “sim”?",
          "E quando ele(a) tinha 4 a 5 anos?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "sim, consistentemente; acena espontaneamente"
          },
          {
            "code": 1,
            "text": "por vezes"
          },
          {
            "code": 8,
            "text": "não aplicável"
          }
        ],
        "timepoints": [
          "actual",
          "anomal_45"
        ]
      },
      {
        "num": "33",
        "id": "item_33",
        "text": "ABANA A CABEÇA (NÃO)",
        "type": "coded",
        "notes": [],
        "probes": [
          "O NEGAR COM A CABEÇA DEVERÁ TER OCORRIDO EM VÁRIAS SITUAÇÕES DIFERENTES, MAS PODE TER DIMINUÍDO EM FREQUÊNCIA À MEDIDA QUE O SUJEITO APRENDEU A FALAR ) O (a)_____abana com a cabeça para dizer “não”?",
          "E quando ele(a) tinha 4 a 5 anos?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "sim, consistentemente; abana a cabeça espontaneamente"
          },
          {
            "code": 1,
            "text": "às vezes"
          },
          {
            "code": 8,
            "text": "não aplicável"
          },
          {
            "code": 9,
            "text": "não conhecido ou não questionado"
          }
        ],
        "timepoints": [
          "actual",
          "anomal_45"
        ]
      },
      {
        "num": "34",
        "id": "item_34",
        "text": "ATENÇÃO À VOZ",
        "type": "coded",
        "notes": [],
        "probes": [
          "A RESPOSTA DE ALERTA DEVERÁ CONSISTIR NUM OLHAR AUTOMÁTICO DIRIGIDO PARA A FONTE SONORA, ACOMPANHADO DE UMA EXPRESSÃO FACIAL ADEQUADA, E DEVE OCORRER SEM A NECESSIDADE DE AJUDAS EXTRAS, COMO O CHAMAR O SUJEITO PELO NOME, OU IR PARA JUNTO DELE) Se chegar a uma sala e começar a falar para o(a) _____, sem o chamar pelo nome, o que é que ele(a) faz?",
          "Ele(a) olha para si e presta atenção?",
          "Como é que ele(a) responde?",
          "E com as outras pessoas?",
          "Você tem necessidade de dizer o nome dele(a) ou captar primeiro o seu olhar, ou simplesmente dizer algo no qual ele(a) poderá nem sequer estar interessado, como “Oh não, está a chover!”, ou então “Oh, tantos brinquedos!” O que é que ele(a) fazia quando tinha entre os 4 a 5 anos?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "normalmente olha e presta atenção quando falam para ele de uma maneira positiva, em contextos que não aqueles nos quais lhe é dito para fazer algo que não queira"
          },
          {
            "code": 1,
            "text": "não parece prestar atenção consistentemente (ou seja, pode olhar por breves momentos, mas com pouca atenção), mas responde por vezes ao que lhe foi dito, ou ocasionalmente e apenas quando lhe falam com voz firme e alta"
          },
          {
            "code": 2,
            "text": "normalmente não olha nem presta atenção quando lhe falam, e não responde ao que lhe dito; ou apenas responde ao nome quando a sua atenção é captada deliberadamente"
          },
          {
            "code": 3,
            "text": "raramente responde, apesar de ouvir bem"
          },
          {
            "code": 8,
            "text": "não aplicável"
          }
        ],
        "timepoints": [
          "actual",
          "anomal_45"
        ]
      },
      {
        "num": "35",
        "id": "item_35",
        "text": "PREOCUPAÇÕES COM A AUDIÇÃO",
        "type": "coded",
        "notes": [],
        "probes": [
          "ACERCA DE POSSÍVEL SURDEZ, DEVIDO À FALTA DE REACÇÃO A SONS, E NÃO PORQUE TENHAM SIDO FEITOS TESTES DE ROTINA ) Já alguma vez alguém pensou que o(a) ______poderia ser surdo ou ter um problema de audição?",
          "O que é que os levou a dizer isso?",
          "Isto ainda é uma preocupação?",
          "Ele(a) responde a barulhos como o de uma campainha da porta, ou olha para o céu quando passa um avião?",
          "E quanto a outros barulhos que venham de coisas que ele(a) não consegue ver?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "não há suspeita de surdez"
          },
          {
            "code": 1,
            "text": "os pais estão certos de que ele não é surdo, mas há suspeita de surdez por outros ou é testada sistematicamente nas avaliações"
          },
          {
            "code": 2,
            "text": "suspeita de surdez por parte dos pais (e, possivelmente, também por profissionais)"
          },
          {
            "code": 8,
            "text": "não aplicável (comprovadamente surdo)"
          }
        ],
        "timepoints": [
          "ever"
        ]
      },
      {
        "num": "36",
        "id": "item_36",
        "text": "SENSIBILIDADE",
        "type": "coded",
        "notes": [],
        "probes": [
          "NÃO INCLUIR RESPOSTAS IDIOSSINCRÁTICAS A SONS ALTAME NTE ESPECÍFICOS; ESTES SÃO ABORDADOS NO ITEM 78) Já alguma vez ele(a) demonstrou ter demasiada sensibilidade a ruídos?",
          "Já alguma vez ele(a), deliberada e regularmente pôs as mãos nos ouvidos como reacção a sons normais?",
          "Ele(a) faz isto de momento?",
          "Em relação a que tipo de sons?",
          "Já alguma vez teve de condicionar o que estava a fazer porque o(a)____ estava muito incomodado c om os ruídos?"
        ],
        "codes": [
          {
            "code": 1,
            "text": "apenas ligeira: algo sensível a sons altos, como o de motos, aspiradores, ou outros electrodomésticos"
          },
          {
            "code": 2,
            "text": "sim:comprovada sensibilidade a ruídos que não incomodam a maioria das pessoas; a sensibilidade é acompanhada por uma alteração clara do comportamento (tal como, evitar, mãos nos ouvidos ou choro)"
          },
          {
            "code": 3,
            "text": "sim, ao ponto de o incómodo/perturbação do sujeito a certos sons interferir com as rotinas da família"
          }
        ],
        "timepoints": [
          "actual",
          "ever"
        ]
      },
      {
        "num": "37",
        "id": "item_37",
        "text": "NÍVEL DE",
        "type": "coded",
        "notes": [],
        "probes": [],
        "codes": [
          {
            "code": 2,
            "text": "sons ou fala produzidos sob pedido (podem ou não também ser imitados espontaneamente)"
          },
          {
            "code": 3,
            "text": "imitação espontânea de vocalizações (sem nunca"
          },
          {
            "code": 8,
            "text": "sem alteração ou perda"
          },
          {
            "code": 0,
            "text": "sem perda"
          },
          {
            "code": 1,
            "text": "perda provável de uma capacidade específica"
          },
          {
            "code": 2,
            "text": "perda completa de uma capacidade específica"
          },
          {
            "code": 8,
            "text": "linguagem insuficiente para mostrar alterações em qualidade"
          },
          {
            "code": 9,
            "text": "não conhecido ou não perguntado"
          }
        ],
        "timepoints": [
          "ever"
        ]
      },
      {
        "num": "38",
        "id": "item_38",
        "text": "DISCURSO COMUNICATIVO,",
        "type": "loss",
        "notes": [],
        "probes": [],
        "codes": [
          {
            "code": 0,
            "text": "Sem perda"
          },
          {
            "code": 1,
            "text": "Perda provável de uma capacidade específica"
          },
          {
            "code": 2,
            "text": "Perda completa de uma capacidade específica"
          },
          {
            "code": 8,
            "text": "Linguagem insuficiente para mostrar alterações"
          },
          {
            "code": 9,
            "text": "Não conhecido ou não perguntado"
          }
        ],
        "timepoints": [
          "ever"
        ]
      },
      {
        "num": "39",
        "id": "item_39",
        "text": "PALAVRAS",
        "type": "loss",
        "notes": [],
        "probes": [],
        "codes": [
          {
            "code": 0,
            "text": "Sem perda"
          },
          {
            "code": 1,
            "text": "Perda provável de uma capacidade específica"
          },
          {
            "code": 2,
            "text": "Perda completa de uma capacidade específica"
          },
          {
            "code": 8,
            "text": "Linguagem insuficiente para mostrar alterações"
          },
          {
            "code": 9,
            "text": "Não conhecido ou não perguntado"
          }
        ],
        "timepoints": [
          "ever"
        ]
      },
      {
        "num": "40",
        "id": "item_40",
        "text": "SINTAXE SIMPLES",
        "type": "loss",
        "notes": [],
        "probes": [],
        "codes": [
          {
            "code": 0,
            "text": "Sem perda"
          },
          {
            "code": 1,
            "text": "Perda provável de uma capacidade específica"
          },
          {
            "code": 2,
            "text": "Perda completa de uma capacidade específica"
          },
          {
            "code": 8,
            "text": "Linguagem insuficiente para mostrar alterações"
          },
          {
            "code": 9,
            "text": "Não conhecido ou não perguntado"
          }
        ],
        "timepoints": [
          "ever"
        ]
      },
      {
        "num": "41",
        "id": "item_41",
        "text": "ARTICULAÇÃO",
        "type": "loss",
        "notes": [],
        "probes": [
          "ITAÇÃO SOLICITADA DE PALAVRAS, USO DE PALAVRAS PARA COMUNICAR OU VERBALIZAÇÕES ESPONTÂNEAS, DEPOIS DE TER TIDO PELO MENOS UMA DESTAS CAPACIDADES NUMA BASE DIÁRIA DURANTE PELO MENOS TRÊS MESES, COM PELO MENOS 5 PALAVRAS DIFERENTES, PARA ALÉM DE MAMÃ E PAPÁ, USADAS REGULARMENTE) Já alguma vez se preocupou com o facto de o(a)____ poder ter perdido capacidades de linguagem durante os primeiros anos de vida?",
          "Já alguma vez ele(a) deixou de falar durante uns meses, depois de ter aprendido a falar?",
          "SE NÃO, COTAR “8” SE SIM: O que aconteceu?",
          "Que idade tinha ele(a)?",
          "Quanta linguagem é que ele(a) tinha antes de a perder?",
          "O que é que o(a) ___ era capaz de dizer ou fazer antes desta alteração ocorrer?",
          "COTAR COMO PONTUAÇÕES SEPARADAS) Quando é que ele(a) voltou a falar?"
        ],
        "codes": [
          {
            "code": 2,
            "text": "sons ou fala produzidos sob pedido (podem ou não também ser imitados espontaneamente)"
          },
          {
            "code": 3,
            "text": "imitação espontânea de vocalizações (sem nunca"
          },
          {
            "code": 8,
            "text": "sem alteração ou perda"
          },
          {
            "code": 0,
            "text": "sem perda"
          },
          {
            "code": 1,
            "text": "perda provável de uma capacidade específica"
          },
          {
            "code": 2,
            "text": "perda completa de uma capacidade específica"
          },
          {
            "code": 8,
            "text": "linguagem insuficiente para mostrar alterações em qualidade"
          }
        ],
        "timepoints": [
          "ever"
        ]
      },
      {
        "num": "34A",
        "id": "item_34a",
        "text": "COMPREENSÃO DE LINGUAGEM SIMPLES",
        "type": "coded",
        "notes": [],
        "probes": [
          "E quando ele(a) não pode saber pela situação o que se vai passar a seguir?",
          "Por exemplo, consegue mandá - lo a outra sala para ir buscar os sapatos ou o cobertor?",
          "E a sua carteira ou um livro?",
          "Pode - lhe pedir para os pôr num sítio que não o normal?",
          "Ele(a) pode levar um recado simples?",
          "Ele(a) consegue seguir uma ordem que inclua “se” e “então”?",
          "Ele(a) entende - o se lhe disser “não” sem gesticular ou levantar a voz?",
          "E se for “sim” ou “está bem”?",
          "E quanto a nomes de comidas preferidas, brinquedos, ou pessoas da família?",
          "Pensa que ele(a) entende 10 palavras?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "pode normalmente desempenhar uma acção inusitada com um objecto de uso pouco comum, ou arrumar um objecto que não seja de uso próprio (por ex, botas ou um brinquedo), em lugares inesperados de compartimentos diferentes ("
          },
          {
            "code": 1,
            "text": "pode normalmente ir buscar a um outro compartimento um objecto que não seja de uso próprio, ou algo altamente contextualizado (“vai buscar as chaves que estão na mesa da cozinha”), mas não pode normalmente desempenhar um"
          },
          {
            "code": 4,
            "text": "pouca ou nenhuma compreensão de palavras, mesmo no contexto"
          }
        ],
        "timepoints": [
          "actual",
          "anomal_45"
        ]
      }
    ]
  },
  {
    "title": "Desenvolvimento social e jogo",
    "items": [
      {
        "num": "42",
        "id": "item_42",
        "text": "CONTACTO",
        "type": "coded",
        "notes": [],
        "probes": [
          "ROS PARA CAPTAREM O SEU OLHAR) PARA SUJEITOS COM MENOS DE 4 ANOS: O(a) ___olha directamente para a sua face quando está a fazer coisas consigo ou a falar consigo?",
          "Consegue captar o olhar da criança?",
          "Alguma vez ele(a) olha para si quando entra no quarto?",
          "E observa a sua face tal como outra criança faria?",
          "PARA SUJEITOS COM MAIS DE 4 ANOS: Quando o(a)_______ tinha 4 ou 5 anos, olhava directamente para si quando fazia coisas consigo ou quando falava para si?",
          "Conseguia captar - lhe o olhar?",
          "Costumava olhar para si quando entrava no quarto?",
          "Observava a sua face tal como outra criança?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "contacto visual recíproco normalmente utilizado para comunicar em várias situações e com diferentes pessoas"
          },
          {
            "code": 1,
            "text": "contacto visual claro, mas de curta duração ou inconsistente durante as interacções sociais"
          },
          {
            "code": 2,
            "text": "contacto visual incerto/ocasional, ou raramente utilizado durante as interacções sociais"
          },
          {
            "code": 3,
            "text": "contacto visual não usual ou estranho"
          },
          {
            "code": 9,
            "text": "Desconhecido ou não perguntado"
          }
        ],
        "timepoints": [
          "actual",
          "ever",
          "anomal_45"
        ]
      },
      {
        "num": "43",
        "id": "item_43",
        "text": "SORRISO SOCIAL",
        "type": "coded",
        "notes": [],
        "probes": [
          "IÇÃO DO SORRISO A ALGUÉM, O SORRIR NUMA ABORDAGEM E COMO RESPOSTA AO QUE ALGUÉM FAZ OU DIZ) Quando o(a) ______ se aproxima de alguém para obter alguma coisa ou para dizer algo costuma cumprimentar com um sorriso?",
          "Como é que ele(a) reage quando a vê pela primeira vez após um período de ausência?",
          "Ou quando encontra alguém conhecido?",
          "Se ele(a) não sorri primeiro, o que faz quando alguém lhe sorri?",
          "Ou quando alguém lhe diz algo simpático?",
          "E por volta dos 4 - 5 anos, como reagia?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "sorriso social previsível em resposta ao sorriso de outras pessoas, para além dos pais/educadores"
          },
          {
            "code": 2,
            "text": "alguma evidência de sorriso quando olha para as pessoas, mas normalmente não recíproco. Cotar aqui se só sorri para pais/educadores ou quando solicitada para o fazer ou se ocorre em situações ou de formas estranhas"
          },
          {
            "code": 3,
            "text": "sorri pouco ou nada para as pessoas, mas pode sorrir para outras coisas"
          }
        ],
        "timepoints": [
          "actual",
          "anomal_45"
        ]
      },
      {
        "num": "44",
        "id": "item_44",
        "text": "CUMPRIMENTA",
        "type": "coded",
        "notes": [],
        "probes": [
          "ITUAÇÕES DO DIA A DIA COM ALGUÉM QUE ELE(A) CONHEÇA BEM) Podemos falar sobre isto mais detalhadamente?",
          "Como é que ele(a) a (o) cumprimenta quando você chega a casa?",
          "(Por exemplo, indo para a porta ou correndo para ser abraçado(a), ou sorrindo e dizendo “mamã”, “papá” ou o seu nome enquanto olha para si?).?",
          "Pode afirmar que ele(a) fica contente quando a vê, ainda que através da sala ou dum jardim, ou tem de ir ter com ele(a), ou esperar até que ele(a) venha ter consigo?",
          "Quando chegam familiares ele(a) cumprimenta?",
          "E quando tinha 4 a 5 anos?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "mostra claramente prazer e gama completa de comportamentos socio - emocionais vocais e não vocais ao cumprimentar pessoas de quem gosta"
          },
          {
            "code": 1,
            "text": "cumprimenta espontaneamente de vez em quando, mas pouca frequência, consistência, flexibilidade ou qualidade"
          },
          {
            "code": 2,
            "text": "cumprimento espontâneo não usual ou resposta social limitada a não ser incitada ou responde somente"
          },
          {
            "code": 3,
            "text": "poucos ou nenhuns cumprimentos"
          },
          {
            "code": 9,
            "text": "desconhecido ou não perguntado"
          }
        ],
        "timepoints": [
          "actual",
          "anomal_45"
        ]
      },
      {
        "num": "45",
        "id": "item_45",
        "text": "MOSTRA E",
        "type": "coded",
        "notes": [],
        "probes": [
          "O FOCO É POSTO NA DIREÇÃO ESPONTÂNEA DA ATENÇÃO PARA PARTILHA DE INTERESSES) Alguma vez a criança lhe mostra coisas do interesse dela?",
          "Por exemplo, ela traria um brinquedo novo para você ver?",
          "Ou então chama a sua atenção para qualquer coisa com que esteja a brincar ou a fazer?",
          "E que tipo de coisas é que lhe mostra?",
          "Alguma vez isto acontece com coisas que não sejam do interesse da criança e não são coisas que impliquem a sua ajuda?",
          "E quando a criança tinha 4 a 5 anos?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "mostra as coisas regularmente trazendo - as"
          },
          {
            "code": 3,
            "text": "raro, nenhuma aproximação social deste tipo"
          }
        ],
        "timepoints": [
          "actual",
          "ever",
          "anomal_45"
        ]
      },
      {
        "num": "46",
        "id": "item_46",
        "text": "OFERECE PARA PARTILHAR",
        "type": "coded",
        "notes": [],
        "probes": [
          "M OUTRAS PESSOAS) A sua criança alguma vez partilha coisas consigo, como por exemplo, comida, brinquedos ou objectos preferidos?",
          "E com as outras crianças?",
          "Ele(a) oferece espontaneamente ou é necessário você sugerir?",
          "Quantas vezes é que isto acontece?",
          "E quando a criança tinha 4/5 anos?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "partilha frequente e expontânea de objectos diferentes (i.é, comida, brinquedos, etc)"
          },
          {
            "code": 1,
            "text": "algumas partilhas expontâneas, mas em número limitado em relação ao contexto e à frequência (tem que ser"
          },
          {
            "code": 2,
            "text": "partilha de vez em quando se é pedido, mas não espontaneamente, ou então partilha espontaneamente só a comida"
          },
          {
            "code": 3,
            "text": "não partilha"
          },
          {
            "code": 9,
            "text": "desconhecido ou não perguntado"
          }
        ],
        "timepoints": [
          "actual",
          "ever",
          "anomal_45"
        ]
      },
      {
        "num": "47",
        "id": "item_47",
        "text": "PROCURA",
        "type": "coded",
        "notes": [],
        "probes": [
          "COISAS QUE LHE DÃO GOSTO, SEM HAVER OUTRO QUALQUER MOTIVO QUE NÃO O DA PARTILHA) Que coisas é que o tornam feliz e contente?",
          "Como é que ele(a) demonstra os seus sentimentos?",
          "Ele(a) alguma vez quer que você partilhe o seu gosto em qualquer coisa?",
          "Ele(a) tenta partilhar estes sentimentos consigo?",
          "Por exemplo se ele(a) construiu alguma coisa, ou se ele vê algo de que gosta particularmente, demonstra - lho sorrindo, falando ou imitindo sons?",
          "E quando a criança tinha 4/5 anos?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "tentativas frequentes para cativar a atenção de várias pessoas para objectos que ele(a) gosta, ou para coisas que tenha feito bem (tem de ser"
          },
          {
            "code": 1,
            "text": "algumas tentativas para partilhar o seu prazer, mas limitadas em número , variedade ou espontaneidade, ou com falta de qualidade no prazer de partilhar"
          },
          {
            "code": 2,
            "text": "raras ou nenhumas tentativas de partilhar o prazer"
          }
        ],
        "timepoints": [
          "actual",
          "ever",
          "anomal_45"
        ]
      },
      {
        "num": "48",
        "id": "item_48",
        "text": "PARTILHA O",
        "type": "coded",
        "notes": [],
        "probes": [
          "É, SE A CRIANÇA PARTILHA OS SENTIMENTOS FELIZES E ADERE À ALEGRIA E À BRINCADEIRA) A criança partilha as alegrias dos outros ?",
          "Consegue reagir de maneira “brincalhona” a ocasiões especiais?",
          "Por exemplo, ele(a) consegue partilhar a alegria de alguém que faz anos?",
          "Se estiverem a ver na TV uma equipa desportiva favorita, que ganha e todos lá em casa ficam entusiasmados, como é que ele(a) reage?",
          "Alguma vez bate as palmas ou ri - se quando vocês o fazem?",
          "E quando a criança tinha 4/5 anos?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "mostra prazer, tem espírito brincalhão com capacidade de partilhar nas alegrias dos outros"
          },
          {
            "code": 1,
            "text": "adere ao entusiasmo, pode imitar expressões simples de afecto (p.ex. rir), mas partilha limitada com os sentimentos dos outros"
          },
          {
            "code": 2,
            "text": "comportamento sem espírito brincalhão ou sem partilha de alegria ou entusiasmo com os outros"
          },
          {
            "code": 3,
            "text": "rara ou nenhuma consciência dos prazeres e entusiasmos dos outros"
          },
          {
            "code": 9,
            "text": "desconhecido ou não perguntado"
          }
        ],
        "timepoints": [
          "actual",
          "ever",
          "anomal_45"
        ]
      },
      {
        "num": "49",
        "id": "item_49",
        "text": "OFERECE CONFORTO",
        "type": "coded",
        "notes": [],
        "probes": [
          "GO (EX.: COBERTOR) E MODIFICAÇÃO DE EXPRESSÃO FACIAL DIRIGIDA A UMA PESSOA QUE ESTÁ TRISTE, DOENTE OU MAGOADA NUMA TENTATIVA DE A FAZER SENTIR MELHOR) O(a)_______ tenta alguma vez confortá - lo quando está triste, magoado ou doente?",
          "O que faz quando a vê chorar ou quando você se magoa?",
          "As expressões faciais da criança modificam - se?",
          "E em relação aos irmãos?",
          "Dá conforto a alguém em mais do que uma situação?",
          "É necessário as pessoas demonstrarem exageradamente que estão aborrecidas para que ele(a) lhes dê conforto?",
          "E quando tinha 4/5 anos?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "oferece conforto flexível e expontâneamente num leque de circunstâncias variadas, p.ex. gestos, contacto, verbalização ou ofertas de objectos (p.ex. cobertor). tem de incluir modificação da expressão facial"
          },
          {
            "code": 1,
            "text": "resposta parcial (i. é, fica por perto e mostra - se preocupado) ou aproximação física indirecta (i. é, vem e senta - se ao colo, mas sem tentativa clara de dar conforto), ou só conforta perante expressões exageradas (i."
          },
          {
            "code": 2,
            "text": "raramente conforta ou expressa - se de uma maneira estranha"
          },
          {
            "code": 3,
            "text": "nunca conforta"
          }
        ],
        "timepoints": [
          "actual",
          "ever",
          "anomal_45"
        ]
      },
      {
        "num": "50",
        "id": "item_50",
        "text": "PROCURA CONFORTO",
        "type": "coded",
        "notes": [],
        "probes": [
          "QUE O SUJEITO FAZ SÓZINHO ANTES DE ALGUÉM SE APERCEBER QUE ESTÁ MAGOADA) Alguma vez o seu filho(a) o procurou quando se magoou?",
          "ou tem de ser o adulto a ir ter com ele?",
          "Alguma vez ele(a) se magoou e ninguém soube porque ele(a) não chorou ou não os procurou?",
          "Ele(a) fica confortado quando vocês lhe dão colo, ou um beijo ou qualquer outro tipo de mimo?",
          "E quando a criança tinha 4/5 anos?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "utiliza contacto afectuoso com os pais/educadores procurando conforto"
          },
          {
            "code": 1,
            "text": "procura reduzida ou de uma maneira estranha o conforto e segurança dos pais/educadores"
          },
          {
            "code": 2,
            "text": "utiliza muito pouco ou inapropriada procura de conforto. Pode responder ao conforto dos pais/educadores sem ter sido ele(a) a procurá - lo"
          },
          {
            "code": 3,
            "text": "não utiliza o contacto físico ou proximidade dos pais/educadores para conforto"
          }
        ],
        "timepoints": [
          "actual",
          "ever",
          "anomal_45"
        ]
      },
      {
        "num": "51",
        "id": "item_51",
        "text": "QUALIDADE DO",
        "type": "coded",
        "notes": [],
        "probes": [
          "PEDINDO AJUDA), FAZ CONSISTENTEMENTE QUALQUER TIPO DE VOCALIZAÇÃO INTEGRADA COM OUTR OS COMPORTAMENTOS COMO CONTACTO VISUAL, COM A SUA ATENÇÃO DIRIGIDA PARA O OBJECTO E A OUTRA PESSOA; COTAR INTERAÇÕES MOTIVADAS TÍPICAS, NÃO AS MELHORES) Quando o(a) ______ quer alguma coisa ou ajuda como é que cativa a sua atenção?",
          "Ele(a) aponta, dá - lhe objectos, ou vem buscá - la quando precisa de ajuda?",
          "Ele(a) olha para o objecto que pretende ou olha para si?",
          "Ele(a) alguma vez gesticula ou utiliza moviment os com barulhos ou palavras para cativar a sua atenção?",
          "Se não percebe logo o que ele(a) quer, como é que ele(a) reage?",
          "Ele(a) olha primeiro para si e depois é que gesticula, fala ou faz barulhos?",
          "E quando tinha 4/5 anos?",
          "(PEÇA EXEMPLOS) Ele(a) mostra interesse noutras pessoas ou noutras actividades?",
          "Como é qu e ele(a) mostra esse interesse e cativa a atenção das outras pessoas?",
          "Com que frequência é que ele(a) o faz?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "estabelece consistentemente contacto visual acompanhado de vocalizações em situações típicas, quando motivado a comunicar"
          },
          {
            "code": 1,
            "text": "pode estabelecer contacto visual ou vocalizações, mas pobre ou raramente integradas"
          },
          {
            "code": 2,
            "text": "raramente demonstra intenção social focalizada e bem coordenada, envolvendo contacto visual e/ou verbalizações ou de uma maneira estranha"
          },
          {
            "code": 3,
            "text": "sem coordenação de contacto visual e vocalizações"
          }
        ],
        "timepoints": [
          "actual",
          "ever",
          "anomal_45"
        ]
      },
      {
        "num": "52",
        "id": "item_52",
        "text": "GAMA DE",
        "type": "coded",
        "notes": [],
        "probes": [
          "UM LEQUE NORMAL DE EMOÇÕES, MESMO NAS CRIANÇAS MAIS NOVAS, ESPERA - SE QUE INCLUA EXPRESSÕES FACIAIS MAIS SUBTIS UTILIZADAS PARA COMUNICAR: SURPRESA, CULPA, NOJO, INTERESSE, ALEGRIA, VERGONHA, A SSIM COMO PRAZER, IRA, MEDO E DOR) O seu filho(a) aparenta ter uma variedade normal de expressões faciais?",
          "Por exemplo, ele(a) franze as sobrancelhas, choraminga ou fica envergonhado, tanto como chora ou ri?",
          "Consegue expressar culpa, surpresa ou felicidade?",
          "Consegue ver na sua cara se tem medo ou nojo?",
          "Tem a mesma variedade de expressões faciais que as outras crianças?",
          "E quando a criança tinha 4/5 anos?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "variedade de expressões faciais completa"
          },
          {
            "code": 1,
            "text": "expressões faciais limitadas podendo ser formais ou exageradas"
          },
          {
            "code": 2,
            "text": "variedade bastante limitada ou tendência a fazer uma só expressão (i. é, contente) em todas as circunstâncias"
          },
          {
            "code": 3,
            "text": "expressão facial que mostra pouca ou nenhuma emoção"
          },
          {
            "code": 9,
            "text": "desconhecido ou não perguntado"
          }
        ],
        "timepoints": [
          "actual",
          "anomal_45"
        ]
      },
      {
        "num": "53",
        "id": "item_53",
        "text": "EXPRESSÃO",
        "type": "coded",
        "notes": [],
        "probes": [
          "ÇÃO, TAL COMO RIR QUANDO ALGUÉM ESTÁ ABORRECIDO OU MAGOADO, OU RIR OU CHORAR SEM NENHUMA RAZÃO APARENTE) Acha que as expressões faciais do seu filho(a) são adequadas às situações?",
          "Alguma vez riu ou sorriu em situações em que os outros não achavam piada alguma, ou sem que você perceba a que é que ele(a) achou graça?",
          "Este comportamento ocorreu no passado?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "a expressão facial é quase sempre adequada à situação, disposição e ao contexto"
          },
          {
            "code": 1,
            "text": "ligeira ou ocasional inadequação ou estranhesa das expressões faciais perante as situações"
          },
          {
            "code": 2,
            "text": "expressões obviamente inadequadas perante diversas situações (ESPECIFIQUE)"
          }
        ],
        "timepoints": [
          "ever"
        ]
      },
      {
        "num": "54",
        "id": "item_54",
        "text": "ESTENDE OS",
        "type": "coded",
        "notes": [],
        "probes": [],
        "codes": [
          {
            "code": 0,
            "text": "gestos normais para pedir colo"
          },
          {
            "code": 1,
            "text": "utilização ocasional de gestos antecipatórios para pedir colo"
          },
          {
            "code": 2,
            "text": "responde"
          },
          {
            "code": 3,
            "text": "nenhum ou muito poucos gestos antecipatórios socialmente apropriados"
          },
          {
            "code": 8,
            "text": "não aplicável"
          }
        ],
        "timepoints": [
          "actual",
          "anomal_45"
        ]
      },
      {
        "num": "55",
        "id": "item_55",
        "text": "AFECTO",
        "type": "coded",
        "notes": [],
        "probes": [
          "STRADO ATRAVÉS DO CONTACTO, DA PROCURA DE PROXIMIDADE, DE OFERTAS, DE PRENDAS OU DE VERBALIZAÇÕES ACOMPANHADAS DE EXPRESSÕES FACIAIS APROPRIADAS) O(a)________é afectuoso(a)?",
          "Em que situações é que isso acontece?",
          "Como é que ele(a) o demonstra?",
          "(PEÇA EXEMPLOS) Dirige - se a si e dá - lhe um abraço, ou demonstra afecto de outra forma?",
          "E quando tinha 4,5 anos?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "variação normal de comportamento afectivo espontâneo para várias pessoas"
          },
          {
            "code": 1,
            "text": "algum afecto espontâneo, mas com reciprocidade duvidosa e limitado em contexto e a determinadas pessoas (só os pais) e menos demonstrativo do que o normal"
          },
          {
            "code": 2,
            "text": "pouco ou nenhum afecto espontâneo, mas"
          },
          {
            "code": 3,
            "text": "distante, “frio”; sem afecto para com pais/educadores, mesmo como resposta"
          },
          {
            "code": 7,
            "text": "indiscriminadamente afectuoso com pessoas conhecidas ou desconhecidas"
          },
          {
            "code": 9,
            "text": "desconhecido ou não perguntado"
          }
        ],
        "timepoints": [
          "actual",
          "anomal_45"
        ]
      },
      {
        "num": "56",
        "id": "item_56",
        "text": "DESINIBIÇÃO SOCIAL",
        "type": "coded",
        "notes": [],
        "probes": [
          "O(a)______varia o seu comportamento consoante o local e a pessoa com que está?",
          "O seu filho(a) alguma vez se mostrou atrevido, mal educado ou inadequadamente amigo de um desconhecido?",
          "Ele(a) faz perguntas impertinentes ou pessoais a quem acabou de conhecer?",
          "Ele(a) parece consciente das regras sociais?",
          "Ele(a) é mais ingénuo socialment e do que as outras crianças (i.?",
          "é, incapaz de compreender o que se deve dizer ou fazer em situações sociais particulares)?",
          "Alguma vez se aproxima ou toca em estranhos de forma inapropriada?",
          "Como é que ele(a) se comporta quando você vai visitar uma amigo?",
          "( PEÇA EXEMPLOS) Alguma vez isto foi problema (depois dos 4 anos) de uma maneira não própria para a idade?",
          "Nota: Todas as cotações devem ser feitas segundo a opinião do entrevistador baseado nas informações colhidas e não nas inferências do entrevistado?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "inibição social normal"
          },
          {
            "code": 1,
            "text": "atrevimento ocasional;"
          },
          {
            "code": 2,
            "text": "sem percepção das regras, contexto ou requisitos sociais. Sem inibição social e"
          },
          {
            "code": 3,
            "text": "desinibição social marcada. Parece não se aperceber das regras ou requisitos sociais de forma que o seu comportamento é frequentemente inapropriado e embaraçoso"
          },
          {
            "code": 8,
            "text": "não aplicável"
          }
        ],
        "timepoints": [
          "actual",
          "ever",
          "anomal_45"
        ]
      },
      {
        "num": "57",
        "id": "item_57",
        "text": "RESPOSTAS",
        "type": "coded",
        "notes": [],
        "probes": [
          "M OS PAIS, TENTAM INTERAGIR COM ELE EM SITUAÇÕES DO DIA A DIA, MAS NÃO ROTINEIRAS) E agora podemos falar sobre como é que o(a)______ responde ao que os outros fazem ou dizem?",
          "Ele(a) consistentemente responde às aproximações do adulto em situações familiares?",
          "Como é que reage se um amigo seu, que o seu filho(a) não conhece bem, se aproximar e lhe falar?",
          "E se for alguém de quem a criança gosta muito?",
          "Como é que ele(a) reage quando pessoas desconhecidas lhe falam ou tentam atrair a sua atenção (p.ex.?",
          "na igreja ou numa loja?",
          "Olha directamente para os desconhecidos?",
          "Sorri ou mostra prazer?",
          "Mostra outras reacções como interesse e tenta corresponder?",
          "SE A CRIANÇA FOR TÍMIDA, PROCURE EXEMPLOS DE P ESSOAS QUE SÃO MAIS FAMILIARES) E quando ele(a) tinha 4 a 5 anos?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "respostas apropriadas a adultos familiares e a desconhecidos"
          },
          {
            "code": 1,
            "text": "algumas claras respostas e interacções, mas sem consistência"
          },
          {
            "code": 2,
            "text": "responde a pais/educadores e a outros em ambientes familiares, mas as respostas são estereotipadas e/ou inapropriadas ou muito limitadas"
          },
          {
            "code": 3,
            "text": "pouco ou nenhum interesse nas pessoas ou em responder - lhes, excepto pais/educadores ou pessoas de quem gostam muito"
          },
          {
            "code": 8,
            "text": "não aplicável"
          },
          {
            "code": 9,
            "text": "desconhecido ou não perguntado"
          }
        ],
        "timepoints": [
          "actual",
          "anomal_45"
        ]
      },
      {
        "num": "58",
        "id": "item_58",
        "text": "ANSIEDADE/FUGA SOCIAL",
        "type": "coded",
        "notes": [],
        "probes": [
          "EAGE EVITANDO AS SITUAÇÕES (TAL COMO OLHAR PARA BAIXO) O(a) ________mostra - se extremamente ansioso quando encontra pessoas que não conheça bem?",
          "Por exemplo, ele(a) tem tendência de olhar para baixo ou evita os olhos deles?",
          "SE SIM: como é que mostra a ansiedade?",
          "Varia de acordo com quem está a acompanhar a criança?",
          "Responde apropriadamente às pessoas, mesmo evitando o olhar?",
          "E quando tinha 4 a 5 anos?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "Utilizaçãoo social apropriado do contacto visual mútuo, embora seja selectivo e com algum nível de ansiedade, dentro dos limites normais para a situação em causa e para a idade"
          },
          {
            "code": 1,
            "text": "Evita o olhar mútuo selectivamente, ou revela outros indicadores de ansiedade social, embora com"
          },
          {
            "code": 2,
            "text": "Evita totalmente contacto visual com pessoas desconhecidas e/ou em situações sociais não familiares. Tem de haver outros indicadores de ansiedade social (tal como ar sombrio, torcer as mãos, etc.). Ocorre em conjunto com"
          },
          {
            "code": 7,
            "text": "Falta ou qualidade anómala no contacto visual sem evidência clara de ansiedade e/ou sem contacto social apropriado ou alheio da situação social"
          },
          {
            "code": 8,
            "text": "Não aplicável"
          }
        ],
        "timepoints": [
          "actual",
          "anomal_45"
        ]
      },
      {
        "num": "59",
        "id": "item_59",
        "text": "BASE SEGURA",
        "type": "coded",
        "notes": [],
        "probes": [
          "SÃO IMPORTANTES DOIS ASPECTOS DO COMPORTAMENTO DA CRIANÇA: 1) A CRIANÇA TEM CONSCIÊNCIA DA PRESENÇA DO EDUCADOR E PRESTA ATENÇÃO À SUA LOCALIZAÇÃO, O QUE SE VERIFICA PELA FOR MA COMO VAI OLHANDO PARA TRÁS E PROCURA PROXIMIDADE; 2) A CAPACIDADE DA CRIANÇA PARA ENTÃO INTERAGIR OU EXPLORAR UMA NOVA SITUAÇÃO) PARA CRIANÇAS COM MENOS DE 4.0 ANOS: Quando o(a) ______________ está a brincar noutro quarto volta de vez em quando para ver se a mãe(pai/educador) continua onde está e se está tudo bem?",
          "E se estiverem no parque?",
          "Ele(a) volta ao pé de si de tempos a tempos para ter a certeza que sabe onde está?",
          "Alguma vez se preocupou com o vagueamento da sua criança ?",
          "Como é que ele(a) reage se um desconhecido se lhe dirigir?",
          "PARA CRIANÇAS COM MAIS DE 4.0 ANOS: Quando o seu/sua filho(a) tinha 4 - 5 anos, e estava a brincar noutro quarto, voltava de vez em quando para ver se a mãe(pai/educador) continuavam onde estavam e se estava tudo bem?",
          "E se estivessem no parque?",
          "Ele(a) voltava ao pé de si de tempos a tempos para ter a certeza que sabia onde estava?",
          "Alguma vez se preocupou com o vagueamento da sua criança?",
          "O seu filho(a) alguma vez “olhou para trás” à sua procura, quando tinha menos de 4.0 anos?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "utiliza os pais/educadores como “bases seguras”, indicando isto porque procura proximidade quando abordado por desconhecidos. “Olha para trás” em situações novas mas, depois de estar um pouco"
          },
          {
            "code": 2,
            "text": "procura os pais/educadores primáriamente para evitar contacto social com os outros ou por medo. Não utiliza a proximidade dos pais/educadores para explorar ou interagir"
          },
          {
            "code": 3,
            "text": "não procura os pais/educadores em novas situação"
          },
          {
            "code": 7,
            "text": "excessivamente “colado”"
          }
        ],
        "timepoints": [
          "actual",
          "ever",
          "anomal_45"
        ]
      },
      {
        "num": "60",
        "id": "item_60",
        "text": "ANSIEDADE DE",
        "type": "coded",
        "notes": [],
        "probes": [
          "SE A CRIANÇA TEVE UM PERÍODO DECLARADO DE ANSIEDADE DE SEPARAÇÃO DURANTE ALGUNS MESES QUANDO ERA MAIS NOVA, UTILIZE O CÓDIGO MAIS BAIXO APLICÁVEL DURANTE ESTE PERÍODO, MESMO PARA “MAIS ANÓMALO 4.?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "demonstra definitivamente angústia apropriada na altura da separação"
          },
          {
            "code": 1,
            "text": "comportamento demonstrativo de se aperceber da separação, mas sem intensidade ou qualidade normal"
          },
          {
            "code": 2,
            "text": "pouco ou nenhuma reacção aparente à separação"
          },
          {
            "code": 7,
            "text": "sem evidência de diferenciação entre pais/educadores ou outros adultos"
          },
          {
            "code": 8,
            "text": "não aplicável"
          }
        ],
        "timepoints": [
          "actual",
          "ever",
          "anomal_45"
        ]
      }
    ]
  },
  {
    "title": "Actividades e brinquedos favoritos",
    "items": [
      {
        "num": "61",
        "id": "item_61",
        "text": "INICIAÇÃO DE",
        "type": "coded",
        "notes": [],
        "probes": [
          "NVOLVIDO EM VÁRIAS ACTIVIDADES NÃO REPETITIVAS E NÃO ESTRANHAS QUANDO NÃO SUPERVISIONADA OU ORIENTADA) O seu filho(a) consegue organizar as suas actividades e brincadeiras sem ajuda?",
          "é, encontra coisas para fazer sem precisar de ser orientado?",
          "Que tipo de coisas é que ele(a) faz se o(a) deixarem à sua própria imaginação?",
          "E quando tinha 4, 5 anos?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "consegue espontaneamente ocupar - se de várias actividades adequadas sem incitamento, pode incluir “faz de conta”, dependendo da idade"
          },
          {
            "code": 1,
            "text": "inicia espontaneamente um número limitado de actividades adequadas"
          },
          {
            "code": 2,
            "text": "envolve - se em actividades passivas, mas apropriadas, tal como ver tv ou ouvir rádio"
          },
          {
            "code": 3,
            "text": "não faz nada ou envolve - se apenas em actividades repetitivas ou em actividades motoras estereotipadas"
          },
          {
            "code": 8,
            "text": "não aplicável"
          }
        ],
        "timepoints": [
          "actual",
          "anomal_45"
        ]
      },
      {
        "num": "62",
        "id": "item_62",
        "text": "CURIOSIDADE",
        "type": "coded",
        "notes": [],
        "probes": [
          "TERESSE TEM DE SER MAIS DO QUE A EXPLORAÇÃO SENSORIAL SIMPLES, TEM DE INCLUIR O QUERER MAIS INFORMAÇÃO SOBRE COMO FUNCIONA UM BRINQUEDO OU O QUE É QUE O BRINQUEDO FAZ, ETC.) O seu filho(a) interessa - se pelo seu meio ambiente?",
          "O que é que acontece quando lhe mostra um novo brinquedo ou livro?",
          "Ele(a) mostra logo interesse pelos objectos novos ou demora algum tempo, ou nunca se interessa?",
          "O que é necessário fazer para que comece a interessar - se pelo objecto?",
          "O seu filho(a) interessa - se em saber como funcionam as coisas?",
          "Que tipo de coisas é que o atraem?",
          "E quando tinha 4, 5 anos?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "normalmente sente - se atraído por objectos e brinquedos novos, parece estar interessado e intrigado pelo que o rodeia"
          },
          {
            "code": 1,
            "text": "mostra algum interesse e curiosidade nos objectos novos, mas com frequência e contexto limitado"
          },
          {
            "code": 2,
            "text": "pouco interesse e curiosidade pelas coisas novas, tem que ser fortemente encorajado ou acompanhado por demonstrações, embora possa ter preocupações anormais com certas características do brinquedo"
          },
          {
            "code": 3,
            "text": "pouco ou nenhum interesse expontâneo na exploração do seu meio ambiente"
          },
          {
            "code": 8,
            "text": "não aplicável"
          },
          {
            "code": 9,
            "text": "desconhecido ou não perguntado"
          }
        ],
        "timepoints": [
          "actual",
          "anomal_45"
        ]
      },
      {
        "num": "63",
        "id": "item_63",
        "text": "JOGO IMAGINATIVO",
        "type": "coded",
        "notes": [],
        "probes": [
          "O FOCO AQUI É POSTO NA CAPACIDADE CRIATIVA DA CRIANÇA E NO USO VARIADO DAS ACÇÕES OU DOS OBJECTOS EM BRINCADEIRA PARA REPRESENTA R AS SUAS IDEIAS) Como criança, o seu filho(a) brinca ao “faz de conta”?",
          "Brinca com chávenas de chá, bonecas, carros ou figuras de acção?",
          "(PEDIR EXEMPLOS) Ele(a) bebe o chá das chávenas, empurra o carro ou beija o peluche?",
          "Alguma vez pôs a boneca a beber o chá ou pôs as figuras de acção a andar de carro?",
          "Alguma vez utilizou a boneca ou as figuras de acção como iniciadores, ou seja, a boneca a servir o chá ou a figura de acção a ir a pé até ao carro e entrar nele?",
          "Ele(a) fala com os seus animais ou bonecos?",
          "Alguma vez ele(a) pôs os bonecos/animais a falarem, fazendo barulhos por eles?",
          "Este tipo de brincadeiras varia de dia para dia?",
          "Alguma vez inventou uma história ou sequência (i.?",
          "é, corridas de carros, o carro estar estacionado na garagem ou uma ida a casa da avó)?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "tem variedade de jogo imaginativo, incluindo o uso de bonecas/animais/brinquedos como agentes iniciadores"
          },
          {
            "code": 1,
            "text": "alguma capacidade de jogo imaginativo, incluindo acções dirigidas a bonecas ou a carros, etc., mas limitada em frequência e variedade"
          },
          {
            "code": 2,
            "text": "ocasionalmente existe jogo imaginativo espontâneo e/ou muito repetitivo e/ou só brincadeiras que tenham sido ensinadas por outros"
          },
          {
            "code": 3,
            "text": "sem jogo imaginativo"
          },
          {
            "code": 8,
            "text": "não aplicável"
          }
        ],
        "timepoints": [
          "actual",
          "ever",
          "anomal_45"
        ]
      },
      {
        "num": "64",
        "id": "item_64",
        "text": "JOGO IMAGINATIVO COM COLEGAS",
        "type": "coded",
        "notes": [],
        "probes": [
          "O NÍVEL DE IMAGINAÇÃO PODE SER SIMPLES, MAS TEM QUE SER SOCIALMENTE INTERACTIVO, ESPONTÂNEO E COM VARIEDADE.?",
          "SE O SUJEITO SÓ BRINCA COM OS IRMÃOS TENHA MUITO CUIDADO EM DIFERENCIAR ROTINAS BEM ESTABELECIDAS DE BRINCADEIRAS FLEXÍVEIS E ESPONTÂNEAS.?",
          "TENTE DIFERENCIAR BRINCADEIRAS QUE SÃO MUITO ESTRUTURADAS, PRODUZIDAS PELOS IRMÃOS PARA E STA CRIANÇA, DAQUELAS EM QUE ELA MOSTRA INCIATIVA PRÓPRIA) O seu filho(a) alguma vez brincou ao faz de conta com outras crianças?",
          "Eles conseguiram entender os jogos imaginários uns dos outros?",
          "O seu filho(a) alguma vez lidera ou tem a iniciativa de começar a brincadeira?",
          "Ou acompanha os outros apenas ?",
          "E quando tinha 4, 5 anos?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "tem jogo imaginativo e cooperativo com outras crianças, em que ela tanto lidera como acompanha os outros em actividades de faz de conta"
          },
          {
            "code": 1,
            "text": "participa um pouco em jogos imaginativos com outras crianças, mas sem haver reciprocidade verdadeira e/ou as brincadeiras de faz de conta são muito limitadas na variedade"
          },
          {
            "code": 2,
            "text": "algumas brincadeiras com outras crianças, mas não há imaginação"
          },
          {
            "code": 3,
            "text": "não brinca com as outras crianças ou não tem jogos imaginativos sozinho"
          },
          {
            "code": 8,
            "text": "não aplicável"
          },
          {
            "code": 9,
            "text": "desconhecido ou não perguntado"
          }
        ],
        "timepoints": [
          "actual",
          "ever",
          "anomal_45"
        ]
      },
      {
        "num": "65",
        "id": "item_65",
        "text": "JOGO SOCIAL IMITATIVO",
        "type": "coded",
        "notes": [],
        "probes": [],
        "codes": [
          {
            "code": 0,
            "text": "jogo social normal, incluindo evidência clara que a criança inicia e responde a jogos sociais simples e consegue participar tanto como lider como acompanhante"
          },
          {
            "code": 1,
            "text": "alguns jogos recíprocos, mas limitados em quantidade, duração, ou contexto (i. é, só brinca ao “cucu tata”, ou ao “ominople” com os pais/educadores)"
          },
          {
            "code": 2,
            "text": "poucas brincadeiras recíprocas (i. é, só brinca ao “cucu tata”, ou ao “ominople” duma maneira limitada não recíproca)"
          },
          {
            "code": 3,
            "text": "sem qualquer evidência de jogos sociais recíprocos"
          },
          {
            "code": 9,
            "text": "desconhecido ou não perguntado"
          }
        ],
        "timepoints": [
          "actual",
          "anomal_45"
        ]
      },
      {
        "num": "66",
        "id": "item_66",
        "text": "INTERESSE EM CRIANÇAS",
        "type": "coded",
        "notes": [],
        "probes": [
          "NO INTERESSE DO SUJEITO EM OBSERVAR E INTERAGIR COM OUTRAS CRIANÇA DA MESMA IDADE) O que é que o seu filho(a) pensa sobre as crianças desconhecidas que são mais ou menos da idade dele(a)?",
          "O que é que ele(a) faz quando vão crianças a vossa casa ou em outra situação familiar?",
          "E quando tinha 4, 5 anos?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "observa frequentemente outras crianças. Por vezes faz um esforço para se aproximar delas ou chamar - lhes a atenção"
          },
          {
            "code": 1,
            "text": "normalmente observa as outras crianças ou mostra interesse nelas"
          },
          {
            "code": 2,
            "text": "ocasionalmente observa as outras crianças, mas sem tentar aproximar - se ou dirigir a atenção dos pais/educadores para elas ou para imitá - las"
          },
          {
            "code": 3,
            "text": "mostra pouco, ou nenhum, interesse por outras crianças"
          },
          {
            "code": 9,
            "text": "desconhecido ou não perguntado"
          }
        ],
        "timepoints": [
          "actual",
          "anomal_45"
        ]
      },
      {
        "num": "67",
        "id": "item_67",
        "text": "RESPOSTA À",
        "type": "coded",
        "notes": [],
        "probes": [
          "O OBJECTIVO AQUI É DETERMINAR COMO REAGE A CRIANÇA À ABORDAGEM DE OUTRAS CRIANÇAS E SE ESTA REACÇÃO CORRESPONDE A UM ESFORÇO PARA INTERAÇÃO) E se outra criança vem ter com ele(a), qual é a sua reacção?",
          "Porta - se de maneira diferente com os irmãos e outras crianças que conhece?",
          "A idade das crianças tem importância?",
          "Ele(a) evita activamente as outras crianças ?",
          "E quando tinha 4, 5 anos?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "responde à abordagem de outras crianças, embora a princípio possa estar um pouco hesitante se as outras crianças forem muito rudes ou agressivas. Faz um esforço notável, de vez em quando, para manter as interacções com a"
          },
          {
            "code": 1,
            "text": "responde"
          },
          {
            "code": 2,
            "text": "raramente ou nunca responde às aproximações de outras crianças, mesmo as conhecidas (embora possa mostrar interesse em crianças que não se aproximam e em bebés)"
          },
          {
            "code": 3,
            "text": "evita sistemática e persistentemente a aproximação de outras crianças"
          }
        ],
        "timepoints": [
          "actual",
          "anomal_45"
        ]
      },
      {
        "num": "68",
        "id": "item_68",
        "text": "JOGO DE GRUPO COM COLEGAS",
        "type": "coded",
        "notes": [],
        "probes": [
          "A COOPERAÇÃO DEVE INCLUIR A ATENÇÃO DA CRIANÇA PARA COM OS SEUS PARES E CONSEGUIR MODIFICAR O SEU COMPORTAMENTO DE UMA MANEIRA QUE DEMONSTRE CLARAMENTE UM A BRINCADEIRA ESPONTÂNEA, FLEXÍVEL E INTERACTIVA.?",
          "CORRER ATRÁS DA BOLA OU JOGOS DE BOLA DEVEM SER INCLUIDOS SÓ SE FOREM ESPONTÂNEOS, FLEXÍVEIS E INTERACTIVOS.LEMBRE - SE DO QUE FOI DITO ANTERIORMENTE SOBRE A INTERPRETAÇÃO DAS BRINCADEIRAS INTERACTIVAS COM OS IRMÃOS) Como é que o(a) ___ brinca com as outras crianças da idade dele(a), quando estão mais do que dois juntos?",
          "Como é que ele(a) joga?",
          "Brinca de forma diferente com crianças que não fazem parte do seu dia a dia?",
          "O (a) ___ consegue cooperar em jogos de grupo, como por exemplo jogos musicais, escondidas e jogos de bola?",
          "( DÊ EXEMPLOS APROPRIADOS PARA O NÍVEL MENTAL DESTA CRIANÇA) Ele(a) conseguiria iniciar algum desses jogos ?",
          "Ou então pedir para entrar no jogo?",
          "Ele(a) consegue participar em partes diferentes do jogo (i.?",
          "é, ser apanhado e fugir, esconder - se e procurar a outra pessoa)?",
          "E quando tinha 4, 5 anos?"
        ],
        "codes": [
          {
            "code": 2,
            "text": "gosta de brincadeiras paralelas (tal como saltar e virar no trampolim, ou cair junto com outras crianças na roda do “indo eu a caminho de viseu”), mas pouca ou nenhuma brincadeira cooperativa"
          },
          {
            "code": 3,
            "text": "não participa em jogos de grupo"
          }
        ],
        "timepoints": [
          "actual",
          "anomal_45"
        ]
      },
      {
        "num": "69",
        "id": "item_69",
        "text": "AMIZADES",
        "type": "coded",
        "notes": [],
        "probes": [
          "VA E RECÍPROCA ENTRE DUAS PESSOAS DE IDADES APROXIMADAS QUE PROCURAM A COMPANHIA UM DO OUTRO E PARTILHAM ACTIVIDADES E INTERESSES) O(a) ___ tem amigos especiais ou um melhor amigo?",
          "De que forma é que ele(a) mostra que eles são amigos?",
          "Sabe o nome de alguns dos amigos do seu/sua filho(a)?",
          "Ele(a) vê algum dos amigos fora da escola, na sua zona residencial ou em outros contextos sociais (ex.: clubes)?",
          "Ele(a) costuma ir ao cinema com os amigos?",
          "Eles partilham interesses?",
          "A relação deles é normal?",
          "(SE NÃO) De que forma é anormal ?",
          "Antigamente, ele(a) tinha mais ou menos amigos do que agora?"
        ],
        "codes": [
          {
            "code": 3,
            "text": "Não mantém qualquer relação com os pares que envolvam partilha e selectividade"
          }
        ],
        "timepoints": [
          "actual",
          "ever",
          "anomal_45"
        ]
      }
    ]
  },
  {
    "title": "Interesses e comportamentos repetitivos",
    "items": [
      {
        "num": "70",
        "id": "item_70",
        "text": "INTERESSES CIRCUNSCRITOS",
        "type": "coded",
        "notes": [],
        "probes": [
          "INTERESSES CIRCU NSCRITOS SÃO INVULGARES NAS SUAS QUALIDADES, MAS NÃO NO SEU CONTEÚDO .) Ele(a) possui algum interesses/ocupação especial, invulgar quanto á sua intensidade?",
          "Desde quando é que ele(a) apresenta este interesse?",
          "De que forma é invulgar?",
          "Tem havido alterações ou desenvolvimentos ao longo do tempo?",
          "Ele(a) partilha o seu interesse com os outros?",
          "Este interesse parece - lhe compulsivo?",
          "O que é que acontec e se o interromper?",
          "Este interesse interfere com o seu desempenho noutras áreas?",
          "Existiram alguns interesses especiais no passado?",
          "PARA OS ITEMS 70 - 79, 81 E 84 Cotação 2 envolve algum distúrbio ou reorganização da vida da família que pode ser tolerado pela maioria das famílias OU envolve alguma interferência com o envolvimento do sujeito noutras actividades.?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "sem interesse circunscrito"
          },
          {
            "code": 1,
            "text": "Interesse especial em grau invulgar, mas não definitivamente intrusivo ou obstrutivo para outras actividades do sujeito ou familiares"
          },
          {
            "code": 2,
            "text": "interesse definitivamente circunscrito, que não causa interferência no funcionamento social, mas que interfere nas actividades do sujeito ou família"
          },
          {
            "code": 3,
            "text": "Interesses circunscritos definidos que causam incapacidade social"
          },
          {
            "code": 8,
            "text": "não aplicável"
          }
        ],
        "timepoints": [
          "actual",
          "ever"
        ]
      },
      {
        "num": "71",
        "id": "item_71",
        "text": "PREOCUPAÇÕES INVULGARES",
        "type": "coded",
        "notes": [],
        "probes": [
          "Já perguntei acerca de hobbies especiais, mas existem também interesses peculiares ou invulgares - refiro - me àqueles que o(a) preocupam mesmo quando o foco do interesse não está fisicamente presente e que parecem estranhos aos outros?",
          "Por exemplo, ele(a) i nteressa - se invulgarmente por coisas como objectos metálicos, semáforos, sinais de trânsito, casas de banho?",
          "Ele(a) fala muito acerca disso?",
          "Este interesse influencia a forma como ele(a) se comporta?",
          "Há quanto tempo dura?",
          "Interfere com as suas outras actividades ou com a vida familiar?",
          "Existem coisas que façam de forma diferente, como família, devido a estes int eresses?",
          "Em que medida este é um problema de toda a família?",
          "Houve alguma coisa parecida com este interesse no passado?"
        ],
        "codes": [
          {
            "code": 1,
            "text": "preocupações invulgares significativas em actividades da família OU que não causam incapacidade social no sujeito"
          },
          {
            "code": 2,
            "text": "Preocupação definida e repetitiva que interfere na vida da família, mas que não o faz de uma maneira significativa OU uma preocupação definida e repetitiva que não causa interferência substancial com o funcionamento soci"
          },
          {
            "code": 3,
            "text": "Preocupação definida que causa interferência substancial OU incapacidade social e limitam severamente o sujeito noutras actividades"
          }
        ],
        "timepoints": [
          "actual",
          "ever"
        ]
      },
      {
        "num": "72",
        "id": "item_72",
        "text": "USO REPETITIVO DE OBJECTOS OU INTERESSE POR PARTES DE OBJECTOS",
        "type": "coded",
        "notes": [],
        "probes": [
          "OU ESTERIOTIPADA E NÃO FUNCIONAIS E QUE ENVOLVEM UMA FOCALIZAÇÃO EM PARTES DE OBJECTOS OU NA UTILIZAÇÃO DE UM OBJECTO DE UMA FORMA CLARAMENTE DISTINTA DAQUELA QUE LHE É INERENTE) Como é que ele(a) brinca com os brinquedos ou coisas de casa?",
          "Ele costuma brincar com o brinquedo como um todo ou parece - lhe mais interessado em determinadas partes do objecto (ex: rodar as rodas de um carro ou abrir e fechar a porta),em vez de o usar como seria esperado?",
          "Existem objectos ou brinquedos de que ele gosta particularmente?",
          "Ele(a) habitualmente junta ou colecciona determinado tipo de objectos?",
          "O que é que ele(a) faz com eles?",
          "Ele(a) costuma alinhar os objectos ou fazer a mesma coisa com eles durante muito tempo , como atirar coisas a uma determinada distância ou fazer cair coisas?",
          "Estas actividades mudam ao longo de tempo ou permanecem as mesmas?",
          "Ele(a) alguma vez utilizou assim os objectos no passado?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "Pouco ou nenhum uso repetitivo dos objectos"
          },
          {
            "code": 1,
            "text": "algum uso repetitivo dos objectos (atirar ou rodopiar coisas) ou interesse em partes ou tipos específicos de objectos (tais como rodar rodas ou discos ou juntar bocados de papel), mas em conjunto com outras actividades d"
          },
          {
            "code": 2,
            "text": "Jogo limitado a um uso esteriotipado dos objectos ou atenção restrita a partes ou tipos de objectos, mas que não comprometem ou interferem com outras actividades do sujeito."
          },
          {
            "code": 3,
            "text": "jogo ligado ao uso altamente esteriotipado dos objectos numa extensão que impede ou interfere seriamente com as outras actividades"
          },
          {
            "code": 7,
            "text": "interesse em brinquedos “infantis”, como caixas de música ou guizos, mas o jogo exibe"
          },
          {
            "code": 8,
            "text": "não brinca com objectos"
          }
        ],
        "timepoints": [
          "actual",
          "ever"
        ]
      },
      {
        "num": "73",
        "id": "item_73",
        "text": "DIFICULDADES COM",
        "type": "coded",
        "notes": [],
        "probes": [
          "O ÊNFASE DESTE ITEM É O GRAU EXAGERADO DE INCÓMODO E/OU INSISTÊNCIA EM MANTER A CONDIÇÃO ORIGINAL SE OCORRE UMA MUDANÇA MENOR DA ROTINA DO SUJEITO ).?",
          "O(a)_______ altera - se com mudanças menores na sua rotina?",
          "Ou com a forma como os seus objectos pessoais estão arrumados ?",
          "de mangas compridas para mangas curtas?) E alterações nos horários?",
          "Faz - lhe diferença se tomar banho 15 minutos antes ou depois do que é usual ou vestir - se a ntes ou depois do pequeno almoço, se isto quebra a sua rotina?",
          "O que é que acontece?",
          "Pequenas alterações nas rotinas de alimentação, como onde estão o sal e a pimenta na mesa, ou onde é colocada a comida no seu prato, causam dificuldades?",
          "Isto foi um problema no passado?"
        ],
        "codes": [
          {
            "code": 1,
            "text": "reacção invulgarmente negativa a mudanças menores nas rotinas do sujeito, mas sem angústia séria ou com pouca ou nenhuma interferência na vida da família"
          },
          {
            "code": 2,
            "text": "reacções invulgares definidas a pequenas mudanças nas rotinas do sujeito, provocadoras de resistência ou angústia e/ou levando a esforços da família para evitar pequenas mudanças nas rotinas do sujeito ou para prepará - "
          },
          {
            "code": 3,
            "text": "Resistência invulgarmente marcada a alterações menores das rotinas do sujeito, com interferência substancial ou incapacidade de realização das actividades da família"
          }
        ],
        "timepoints": [
          "actual",
          "ever"
        ]
      },
      {
        "num": "74",
        "id": "item_74",
        "text": "RESISTÊNCIA A",
        "type": "coded",
        "notes": [],
        "probes": [
          "SE ÀS DIFICULDADES MARCADAS DO SUJEITO COM PEQUENAS MUDANÇAS EM ASPECTOS DO AMBIENTE QUE NÃO TÊM EFEITO DIRECTO SOBRE ELE, POR EXEMPLO, A POSIÇÃO DOS OBJECTOS DE DECORAÇÃO, A ORIENTAÇÃO DO TELEFONE, ROUPAS USADAS POR OUTRAS PESSOAS.?",
          "A ÊNF ASE É COLOCADA NA REACÇÃO INVULGARMENTE NEGATIVA DO SUJEITO A ESTAS MUDANÇAS INSIGNIFICANTES QUE NÃO TÊM IMPACTO DIRECTO SOBRE ELE) Como é que o _____________ reage a alterações em casa, ou mudanças de pequenos detalhes do seu ambiente?",
          "Por exemplo, como é que ele(a) reage a mudanças na rotina diária de outra pessoa, ou quando mudam a mobília de local ou se o senhor(a) usar óculos ou um chapéu ?",
          "Ele(a) fica angustiado(a)?",
          "E como era quando ele(a) era mais novo?",
          "Isto foi um problema no passsado?"
        ],
        "codes": [
          {
            "code": 1,
            "text": "reacção invulgarmente negativa a mudanças menores no ambiente, mas sem angústia séria ou com pouca ou nenhuma interferência na vida da família"
          },
          {
            "code": 2,
            "text": "reacções invulgares definidas a mudanças no ambiente provocadoras de resistência ou angústia e/ou levando a esforços da família para evitar pequenas mudanças nas rotinas do sujeito ou para prepará - lo para essas mudança"
          },
          {
            "code": 3,
            "text": "Resistência invulgarmente marcada a alterações menores do ambiente, com interferência substancial ou incapacidade de realização das actividades da família"
          }
        ],
        "timepoints": [
          "actual",
          "ever"
        ]
      },
      {
        "num": "75",
        "id": "item_75",
        "text": "COMPULSÕES/RITUAIS",
        "type": "coded",
        "notes": [],
        "probes": [
          "é, tem rituais que ele(a) tem de fazer, ou que o obriga a si a fazer, sempre da mesma forma?",
          "Como tocar coisas em particular ou colocar as coisas em locais especiais antes de ir fazer qualquer outra coisa?",
          "Como é que ele(a) reage se é impedido de completar uma sequência completa da sua actividade ou se é interrompido durante o decorrer da sua acção?",
          "Isto foi um problema no passado?"
        ],
        "codes": [
          {
            "code": 1,
            "text": "algumas actividades com sequências fixas invulgares, mas sem qualidade compulsiva"
          }
        ],
        "timepoints": [
          "actual",
          "ever"
        ]
      },
      {
        "num": "76",
        "id": "item_76",
        "text": "LIGAÇÃO",
        "type": "coded",
        "notes": [],
        "probes": [
          "O FOCO CENTRA - SE NA LIGAÇÃO A OBJECTOS INVULGARES, I.?",
          "A INTENSIDADE DA LIGAÇÃO É DETERMINADA PELO GRAU DE DIFICULDADE DO SUJEITO EM SEPARAR - SE DO OBJECTO E PELA FORMA COMO A SUA POSSE INTERFERE NO QUOTIDIANO DO SUJEITO E DA SUA FAMÍLIA.?",
          "UM COMPORTAMENTO DE LIGAÇÃO INVULGAR DEVE MANIFESTAR - SE DURANTE PELO MENOS 3 MESES, PODENDO OU NÃO ENVOLVER O MESMO OBJECTO) O(a) ______ tem algum objecto com o qual mantém uma ligação particular e que ele(a) gosta de transportar com ele(a)?",
          "É um peluche, uma mantinha ou alguma coisa mais invulgar como um bocado de um tubo, uma pedra ou um pedaço de tecido?",
          "(PEÇA EXEMPLOS) O que é que ele(a) faz com ele?",
          "Se lhe pedir para o largar como é que ele(a) reage?",
          "Leva - o para a cama?",
          "O qu e é que acontece se lho tirar ou se ele(a) o perder?",
          "E como era quando ele(a) era mais pequeno?",
          "Ele(a) era particularmente ligado a alguma coisa em particular?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "Nenhuma ligação ou uma ligação a um objecto macio usado como conforto"
          },
          {
            "code": 1,
            "text": "alguma ligação a objectos um pouco invulgares como pedaços de papel, escovas macias ou vários objectos semelhantes que vai alternando, mas que larga se for mandado tolerando a separação. Não interfere com outras activida"
          },
          {
            "code": 2,
            "text": "ligação a um objecto invulgar associado a angústia significativa face à separação e que os pais têm sempre disponível, devido à anticipação da angústia, interferência ocasional com outras actividades"
          },
          {
            "code": 3,
            "text": "ligação tão intensa que interfere com várias actividades diárias"
          },
          {
            "code": 7,
            "text": "série de ligações curtas ("
          }
        ],
        "timepoints": [
          "actual",
          "ever"
        ]
      },
      {
        "num": "77",
        "id": "item_77",
        "text": "INTERESSES",
        "type": "coded",
        "notes": [],
        "probes": [
          "O FOCO ESTÁ NA EXTENSÃO EM QUE ESTE INTERESSE ANORMAL INTERFERE OU SUBSTITUI “USO NORMAL” DO OBJECTO) Ele(a) apresenta algum interesse especial pelo visual, toque, som, gosto ou cheiro de coisas ou pessoas?",
          "Por exemplo, habitualmente ele(a) cheira os brinquedos, objectos ou pessoas inapropriadamente?",
          "Ou habitualmente preocupa - se em sentir a textura das coisas?",
          "Ou tende a observar as coisas por muito tempo?",
          "Ou toca coisas com os lábios ou língua para vêr como é a sensação?",
          "Há quanto tempo tem este interesse?",
          "(REGISTE EXEMPLOS, ESPECIFIQUE SE AUDITIVOS; TACTEIS; OLFATIVOS OU VISUAIS) Houve algum período particular que ele(a) se interessou mais por este tipo de sensações?"
        ],
        "codes": [
          {
            "code": 1,
            "text": "um ou dois interesses invulgares regularmente"
          },
          {
            "code": 2,
            "text": "interesse sensorial invulgar que ocupa grande parte do tempo que impede ou limita o uso alternativo dos materiais na sua função natural"
          }
        ],
        "timepoints": [
          "actual",
          "ever"
        ]
      },
      {
        "num": "78",
        "id": "item_78",
        "text": "RESPOSTAS",
        "type": "coded",
        "notes": [],
        "probes": [
          "REACÇÕES NEGATIVAS A MUDANÇAS AMBIENTAIS SÃO IGUALMENTE EXCLUÍDAS (VER ITEM 73 E 74) O(a) _______ fica particularmente aborrecido ou irritado face a um barulho particular como o de pessoas a tossir ou bebés a chorar?",
          "(DIFERENCIAR DE UMA REACÇÃO DE MEDO) O que é que ele(a) faz?",
          "Como é que demonstra que está perturbado(a)?",
          "Pensa que ele(a) terá medo ou será zangado(a) ou irritado(a)?",
          "É apenas a um determinado tipo de som?",
          "O(a) ______ alguma vez reage de uma forma invulgar, mas previsível, a outras sensações ( como o gosto, cheiro, visual ou textura de coisas)?",
          "Por exemplo, ele(a) reage à visão de brincos ou de um homem com barbas?",
          "Há quanto tempo é que isso dura?",
          "Alguma vez constituiu problema no passado?"
        ],
        "codes": [
          {
            "code": 1,
            "text": "resposta idiossincrática negativa predictível, anómala a um ou"
          },
          {
            "code": 2,
            "text": "alguma interferência nas actividades quotidianas, com"
          },
          {
            "code": 3,
            "text": "resposta negativa idiosincrática, previsivel e anómala a um ou"
          }
        ],
        "timepoints": [
          "actual",
          "ever"
        ]
      },
      {
        "num": "79",
        "id": "item_79",
        "text": "MEDOS INVULGARES",
        "type": "coded",
        "notes": [],
        "probes": [
          "A INTENSIDADE COM QUE O MEDO INTERFERE COM AS ACTIVIDADES DIÁRIAS OU NA VIDA FAMILIAR SERÁ UMA MEDIDA DA SEVERIDADE) O(a) _________ tem muito medo de algo em particular?",
          "(REGISTE DETALHES) Fica muito assustado?",
          "O que é que tem que fazer para o(a) ajudar a lidar com isso?",
          "Tem alguma ideia de como surgiu esse medo?",
          "Há quanto tempo existe?",
          "Alguma vez tem que alterar os seus planos devido a esse medo?",
          "Alguma vez o descreveu co mo excepcionalmente destemido?",
          "No passado ele(a) tinha alguns medos?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "Nenhum medo ou apenas os medos típicos do seu grupo etário (ex.medo do escuro)"
          },
          {
            "code": 1,
            "text": "medos fortes previsíveis como resposta a um ou"
          },
          {
            "code": 2,
            "text": "pelo menos um medo invulgar com"
          },
          {
            "code": 3,
            "text": "medo invulgar prevísivel em reacção a um ou"
          },
          {
            "code": 7,
            "text": "invulgarmente destemido"
          },
          {
            "code": 9,
            "text": "não conhecido ou não questionado"
          }
        ],
        "timepoints": [
          "actual",
          "ever"
        ]
      },
      {
        "num": "80",
        "id": "item_80",
        "text": "HIPERVENTILAÇÃO",
        "type": "coded",
        "notes": [],
        "probes": [
          "AQUELAS QUE DESPOLETAM PÂNICO) O(a) _______ apresenta uma respiração rápida, profunda e repetida?",
          "Acontece ele(a) respirar com dificuldade várias vezes em poucos segundos?"
        ],
        "codes": [
          {
            "code": 1,
            "text": "ocasionalmente"
          },
          {
            "code": 2,
            "text": "hiperventilação frequente"
          }
        ],
        "timepoints": [
          "actual",
          "ever"
        ]
      },
      {
        "num": "81",
        "id": "item_81",
        "text": "MANEIRISMOS DE MÃOS E DEDOS",
        "type": "coded",
        "notes": [],
        "probes": [
          "SE OS MANEIRISMOS APENAS OCORREREM AO MESMO TEMPO QUE OUTROS MOV IMENTOS DO CORPO, COTE APENAS NA QUESTÃO 82) O(a) ________ apresenta maneirismos ou formas estranhas de mexer as mãos e os dedos?",
          "Como por exemplo entrelaçar ou estalar os dedos em frente dos olhos?",
          "Estes maneirismos interferem com a execução de outras coisas?",
          "O que é que acontece se o tentar parar?",
          "Existe alguma circunstância particular em que tem mais maneirismos do que noutras?",
          "(REGISTE DETALHES) No passado ele(a)demonstrou algum tipo de maneirismos ou movimentos estranhos?"
        ],
        "codes": [
          {
            "code": 2,
            "text": "maneirismos frequentes e definidos de mãos ou entrelaçar e estalar dos dedos, mas sem interferência noutras actividades ou ansiedade se interrompida"
          },
          {
            "code": 3,
            "text": "maneirismos marcados de tipo específico associado a incapacidade social ou angústia quando interrompido ou é raramente interrompida devido às preocupações acerca da reacção do sujeito."
          },
          {
            "code": 8,
            "text": "não aplicável (p.ex. diminuido físico)"
          },
          {
            "code": 9,
            "text": "não conhecido ou não questionado"
          }
        ],
        "timepoints": [
          "actual",
          "ever"
        ]
      },
      {
        "num": "82",
        "id": "item_82",
        "text": "MOVIMENTOS DE MÃOS NA LINHA MÉDIA",
        "type": "coded",
        "notes": [],
        "probes": [
          "ENVOLVEM MOVIMENTOS DE AMBAS AS MÃOS DE FORMA SIMILAR.) O(a) _____ apresenta uma forma particular de movimentar as suas mãos na frente do corpo, por exemplo, contorcer as mãos ou rodá - las de um lado para o outro como se as estivesse a lavar?"
        ],
        "codes": [
          {
            "code": 2,
            "text": "movimentos de entrelaçar definidos e anómalos das mãos, principalmente na linha média."
          }
        ],
        "timepoints": [
          "actual",
          "ever"
        ]
      },
      {
        "num": "83",
        "id": "item_83",
        "text": "PERDA DO USO",
        "type": "coded",
        "notes": [],
        "probes": [
          "EXEMPLOS ADEQUADOS AO DESENVOLVIMENTO DO USO FUNCIONAL DAS MÃOS INCLUEM ACTIVIDADES SIMPLES COMO ATIRAR DELIBERADAMENTE OBJECTOS, AGARRAR A COLHER PARA COMER, EMPILHAR OU ALINHAR OBJECTOS OU BRINQUEDOS.) O(a)_______ agarra correctamente?",
          "Ele(a) pode usar as mãos para executar correctamente as actividades que gosta de fazer?",
          "Pode dar - me alguns exemplos?",
          "SE NÃO - Houve um período de tempo (pelo menos de 3 meses) no qual o(a)______ era capaz de fazer coisas com as mãos?",
          "Há quanto tempo foi?",
          "O que é que ele era capaz de fazer?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "sem perda"
          },
          {
            "code": 1,
            "text": "perda possível de alguns movimentos funcionais"
          },
          {
            "code": 2,
            "text": "perda definitiva de movimentos funcionais"
          },
          {
            "code": 3,
            "text": "nunca teve movimentos funcionais das mãos"
          },
          {
            "code": 9,
            "text": "não conhecido ou não questionado"
          }
        ],
        "timepoints": [
          "actual",
          "ever"
        ]
      },
      {
        "num": "84",
        "id": "item_84",
        "text": "OUTROS",
        "type": "coded",
        "notes": [],
        "probes": [
          "OVIMENTOS CORPORAIS VOLUNTÁRIOS, COMPLEXOS E ESTERIOTIPADOS DE TODO O CORPO, COMO POSTURA, MOVIMENTO ONDULATÓRIO DOS BRAÇOS ENQUANTO BALANCEIA OU ANDAR EM BICOS DE PÉS, E A EXTENSÃO EM QUE ISTO INTERFERE COM A VIDA QUOTIDIANA DO SUJEITO ) O(a) ________ apresenta movimentos complexos corporais, como rodopiar ou com pulos/saltos repetidos ou com movimentos ondulatório dos braços enquanto se balanceia?",
          "Isso interfere de todo com a execução de outras tarefas?",
          "O que acontece se tenta impedi - lo?"
        ],
        "codes": [
          {
            "code": 1,
            "text": "ocasionalmente"
          },
          {
            "code": 2,
            "text": "maneirismos motores definidos, estereotipados, mas que param sem angústia para o sujeito se fôr interrompido"
          },
          {
            "code": 3,
            "text": "maneirismos motores associado a incapacidade social"
          }
        ],
        "timepoints": [
          "actual",
          "ever"
        ]
      },
      {
        "num": "85",
        "id": "item_85",
        "text": "BALANCEIO",
        "type": "coded",
        "notes": [],
        "probes": [
          "(a) ___________ balanceou alguma vez?",
          "O que acontece se tenta pará - lo?",
          "(PEÇA EXEMPLOS; INCLUINDO A QUANTIDADE DE TEMPO GASTA E A FORMA QUE O BALANCEIO TOMA) Isto foi alguma vez um problema no passado?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "nenhum balanceio"
          },
          {
            "code": 2,
            "text": "períodos regulares de balanceio em"
          },
          {
            "code": 3,
            "text": "balanceio frequente em múltiplas situações"
          },
          {
            "code": 9,
            "text": "não conhecido ou não questionado COMPORTAMENTOS GERAIS"
          }
        ],
        "timepoints": [
          "actual",
          "ever"
        ]
      }
    ]
  },
  {
    "title": "Comportamentos gerais",
    "items": [
      {
        "num": "86",
        "id": "item_86",
        "text": "MARCHA",
        "type": "coded",
        "notes": [],
        "probes": [
          "ESTÃO CLARAMENTE ASSOCIADOS A DEFICIÊNCIAS FÍSICAS) Há alguma coisa invulgar na marcha do(a) ______?",
          "Isto é, salta sistematicamente, anda de bicos de pés, ou exagera na utilização dos calcanhares (PEÇA DESCRIÇÃO aOS PAIS) Acha que as outras pessoas notam isso?",
          "Houve alguma vez alguma coisa fora do normal na sua marcha?",
          "Como é que andava aos 4/5 anos?"
        ],
        "codes": [
          {
            "code": 1,
            "text": "algo invulgar"
          },
          {
            "code": 2,
            "text": "marcha definitivamente estranha, isto é, andar nos bicos dos pés ou saltitando anormalmente"
          },
          {
            "code": 3,
            "text": "marcha suficientemente anormal para ser notada por outros, além dos professores e pais"
          }
        ],
        "timepoints": [
          "actual",
          "ever",
          "anomal_45"
        ]
      },
      {
        "num": "87",
        "id": "item_87",
        "text": "ESCOLIOSE/",
        "type": "coded",
        "notes": [],
        "probes": [
          "Quando é isto começou a acontecer?"
        ],
        "codes": [
          {
            "code": 1,
            "text": "escoliose possível ou fragilidade nas costas, mas que não necessita de investigação ou de tratamento, tal como a fisioterapia"
          },
          {
            "code": 2,
            "text": "escoliose definitiva, investigada e que requer tratamento, tal como fisioterapia"
          },
          {
            "code": 8,
            "text": "não aplicável"
          },
          {
            "code": 9,
            "text": "desconhecido ou não perguntado"
          }
        ],
        "timepoints": [
          "actual"
        ]
      },
      {
        "num": "88",
        "id": "item_88",
        "text": "COORDENAÇÃO DA",
        "type": "coded",
        "notes": [],
        "probes": [
          "OU CORPO INTEIRO) O seu filho(a) e ágil ou é desajeitado(a) na maneira de utilizar os braços, as pernas e o corpo?",
          "E quando ele/ela tinha 4/5 anos?",
          "Houve alguma modificação ao longo dos anos?"
        ],
        "codes": [
          {
            "code": 1,
            "text": "limitação nas capacidades motoras globais, mas não considerado anormalmente desajeitado"
          },
          {
            "code": 2,
            "text": "definitivamente desajeitado"
          },
          {
            "code": 9,
            "text": "desconhecido ou não perguntado"
          }
        ],
        "timepoints": [
          "actual",
          "anomal_45"
        ]
      },
      {
        "num": "89",
        "id": "item_89",
        "text": "COORDENAÇÃO DA",
        "type": "coded",
        "notes": [],
        "probes": [
          "nsegue coordenar bem dedos e mãos para fazer coisas ou para encaixar brinquedos?",
          "E quando ele/ela tinha 4/5 anos?"
        ],
        "codes": [
          {
            "code": 1,
            "text": "imitação nas capacidades de motricidade fina, mas não totalmente desajeitado na utilização das mãos"
          },
          {
            "code": 2,
            "text": "definitivamente desajeitado na utilização das mãos"
          }
        ],
        "timepoints": [
          "actual",
          "anomal_45"
        ]
      },
      {
        "num": "90",
        "id": "item_90",
        "text": "AUTO - MUTILAÇÃO",
        "type": "coded",
        "notes": [],
        "probes": [
          "QUE RESULTA EM DANO DOS TECIDOS E QUE OCORRE DURANTE UM PERÍODO DE PELO MENOS 3 MESES) A criança magoa - se deliberadamente, tal como morder o braço, bater com a cabeça ou qualquer coisa parecida?",
          "Isto foi alguma vez um problema no passado?"
        ],
        "codes": [
          {
            "code": 1,
            "text": "apenas ligeiramente, i. é, ocasionalmente morde o braço quando aborrecido, puxa o cabelo ou dá bofetadas na cara. sem danos corporais"
          },
          {
            "code": 2,
            "text": "definitivamente presente, i. é, escoriações ou calosidades, bater com a cabeça repetidamente, puxar o cabelo, mordidelas associadas com lesões"
          },
          {
            "code": 3,
            "text": "definitivamente auto - agressão com danos sérios, i. é, fractura craniana, lesões oculares, etc."
          },
          {
            "code": 9,
            "text": "desconhecido ou não perguntado"
          }
        ],
        "timepoints": [
          "actual",
          "ever"
        ]
      },
      {
        "num": "91",
        "id": "item_91",
        "text": "HIPERACTIVIDADE EM CASA OU",
        "type": "coded",
        "notes": [],
        "probes": [
          "O(a)________ tem dificuldade em estar quieto(a)?",
          "Ele(a) tem tendência para andar sempre a correr?",
          "Está sempre em movimento?",
          "SE SIM: Ele/ela está sempre a levantar - se da cadeira às refeições?",
          "Ele/ela permanece sentado(a) se lhe for dada essa ordem?",
          "E quando o leva a sair, como de autocarro ou à igreja?",
          "O que é que acontece em casa quando ele/ela está a fazer o que gosta e quando não há nenhuma expectativa de ele/ela ter que ficar num só local?",
          "O que é que acontece em situações fora de casa, por exemplo, na escola, em casa de amigos ou em locais públicos?",
          "Alguém faz algum reparo ou se queixou sobre o nível da actividade do seu filho?",
          "Alguma vez isto foi problema no passado?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "raramente é problema, consegue manter - se sentado se necessário"
          },
          {
            "code": 1,
            "text": "levanta - se e mexe - se muito quando se espera que esteja quieto; responde ao pedido para se sentar, mas rapidamente se levanta."
          },
          {
            "code": 2,
            "text": "quase nunca se senta, está sempre em movimento; o excesso de actividade ocorre mesmo quando pode fazer o que quer; a família é capaz de lidar com isso, e o sujeito é capaz de"
          },
          {
            "code": 3,
            "text": "o excesso de actividade é tão severo e significativo que a família é muito afectada e/ou o sujeito severamente incapacitado"
          },
          {
            "code": 0,
            "text": "raramente, não é um problema sério"
          },
          {
            "code": 1,
            "text": "agressividade ligeira (ameaça sem contacto físico ou comportamento que não represente problemas ou agressão ligeira e momentânea)"
          },
          {
            "code": 2,
            "text": "verdadeira agressão física envolvendo mordidelas ou pancadas, mas sem utilização de outros instrumentos para além das mãos"
          },
          {
            "code": 3,
            "text": "violência com a utilização de instrumentos"
          },
          {
            "code": 0,
            "text": "Raramente, não é um problema sério"
          },
          {
            "code": 1,
            "text": "Agressividade ligeira (ameaça sem contacto físico ou comportamento que não represente problemas ou agressão ligeira e momentânea)"
          },
          {
            "code": 2,
            "text": "Verdadeira agressão física envolvendo mordidelas ou pancadas, mas sem utilização de outros instrumentos para além das mãos"
          },
          {
            "code": 3,
            "text": "Violência com a utilização de instrumentos"
          }
        ],
        "timepoints": [
          "actual",
          "ever"
        ]
      },
      {
        "num": "92",
        "id": "item_92",
        "text": "DESMAIOS/ATAQUES/AUSÊNCIAS",
        "type": "coded",
        "notes": [],
        "probes": [
          "OM OU SEM QUEDA OU MOVIMENTOS REPETITIVOS DOS MEMBROS) O seu filho(a) alguma vez desmaiou ou teve ataques, crises ou convulsões?",
          "Alguma vez tomou medicamentos para controlar ataques?"
        ],
        "codes": [
          {
            "code": 1,
            "text": "história de crises que poderão ser epilépticas, mas cujo diagnóstico não foi estabelecido"
          },
          {
            "code": 2,
            "text": "diagnóstico definitivo da epilepsia"
          },
          {
            "code": 7,
            "text": "convulsões febris, sem medicação fora do período febril"
          },
          {
            "code": 9,
            "text": "desconhecido ou não perguntado"
          }
        ],
        "timepoints": [
          "actual",
          "ever"
        ]
      }
    ]
  },
  {
    "title": "Idade da anomalia",
    "items": [
      {
        "num": "93",
        "id": "item_93",
        "text": "IDADE EM QUE A",
        "type": "age",
        "notes": [],
        "probes": [
          "SE A INFORMAÇÃO ATÉ ESTE PONTO INDICA QUE ATÉ AOS 3 ANOS NÃO HOUVE ANOMA LIA, FOQUE A IDADE DOS 3 ANOS COM O OBJECTIVO DE DETERMINAR SE O SEU DESENVOLVIMENTO ERA NORMAL NESSA IDADE E DEPOIS VOLTAR A EXPLORAR AS IDADES MAIS PRECOCES.?",
          "A COTAÇÃO É FEITA PELA OPINIÃO DO ENTREVISTADOR A PARTIR DE TODAS AS INFORMAÇÕES DISPONÍVEIS) Quando começámos a conversar sobre o seu filho(a), perguntei - lhe quando é que acha que ele(a) começou a apresentar as primeiras dificuldades no desenvolvimento ou comportamento.?",
          "Pode contar - me como era o seu filho na época em que completou os 3 anos?",
          "Como é que ele brincava?",
          "Que brinquedos é que usava?",
          "Como se relacionava com as outras crianças?",
          "Voltando atrás novamente, como era quando tinha 1 e 2 anos?"
        ],
        "codes": [],
        "timepoints": []
      },
      {
        "num": "94",
        "id": "item_94",
        "text": "JUÍZO DO",
        "type": "age",
        "notes": [],
        "probes": [],
        "codes": [],
        "timepoints": []
      }
    ]
  },
  {
    "title": "Perda de capacidades",
    "items": [
      {
        "num": "95",
        "id": "item_95",
        "text": "PERDA DE CAPACIDADES",
        "type": "coded",
        "notes": [],
        "probes": [
          "Houve algum período em que o(a) _________ pareceu ter piorado marcadamente ou atrasado mais n o seu desenvolvimento?",
          "Quando é que isto aconteceu?",
          "Que capacidades perdeu?",
          "Isto afectou o seu asseio?",
          "Ou compreensão da linguagem?",
          "Ou utilização de discurso?",
          "Ou capacidade de tomar conta de si próprio?",
          "E capacidade de manipular objectos?",
          "E capacidades na escola?",
          "ANOTAR A IDADE DO SUJEITO QUANDO PERDA DE CAPACIDADES OCORREU) SE SIM: Houve alguma sugestão de que a perda de capadidades estaria associada a doença fìsica?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "não existiu perda de capacidades consistente (embora o"
          },
          {
            "code": 1,
            "text": "provavel perda de capacidades, mas num grau que não cumpre os critérios"
          },
          {
            "code": 8,
            "text": "não aplicável à idade"
          },
          {
            "code": 9,
            "text": "não conhecido ou não perguntado"
          }
        ],
        "timepoints": [
          "actual"
        ]
      },
      {
        "num": "96",
        "id": "item_96",
        "text": "PERDA DE CAPACIDADES (ASSOCIADA A",
        "type": "coded",
        "notes": [],
        "probes": [],
        "codes": [
          {
            "code": 0,
            "text": "perda de capacidades mas sintomas físicos insignificantes"
          },
          {
            "code": 1,
            "text": "perda de capacidades associada a sintomas que não são clara evidência de origem miningica ou encefalítica, p.ex. febre alta e otite"
          },
          {
            "code": 8,
            "text": "não existiu perda de capacidades ou não aplicável à idade"
          }
        ],
        "timepoints": [
          "actual"
        ]
      }
    ]
  },
  {
    "title": "Áreas de perda",
    "items": [
      {
        "num": "97",
        "id": "item_97",
        "text": "COMUNICAÇÃO",
        "type": "coded",
        "notes": [],
        "probes": [],
        "codes": [],
        "timepoints": [
          "actual"
        ]
      },
      {
        "num": "98",
        "id": "item_98",
        "text": "INTERESSE E",
        "type": "coded",
        "notes": [],
        "probes": [],
        "codes": [],
        "timepoints": [
          "actual"
        ]
      },
      {
        "num": "99",
        "id": "item_99",
        "text": "JOGO E IMAGINAÇÃO 5",
        "type": "coded",
        "notes": [],
        "probes": [],
        "codes": [],
        "timepoints": [
          "actual"
        ]
      },
      {
        "num": "100",
        "id": "item_100",
        "text": "CAPACIDADE DE ADAPTAÇÃO",
        "type": "coded",
        "notes": [],
        "probes": [],
        "codes": [],
        "timepoints": [
          "actual"
        ]
      },
      {
        "num": "101",
        "id": "item_101",
        "text": "CAPACIDADES PRÉ-ACADÉMICAS, ACADÉMICAS OU VOCACIONAIS",
        "type": "coded",
        "notes": [],
        "probes": [],
        "codes": [],
        "timepoints": [
          "actual"
        ]
      },
      {
        "num": "102",
        "id": "item_102",
        "text": "CAPACIDADES MOTORAS",
        "type": "coded",
        "notes": [],
        "probes": [],
        "codes": [],
        "timepoints": [
          "actual"
        ]
      },
      {
        "num": "103",
        "id": "item_103",
        "text": "IDADE EM QUE A PERDA PRINCIPAL DE CAPACIDADE FOI INICIALMENTE APARENTE",
        "type": "age",
        "notes": [],
        "probes": [
          "Houve algum período em que o(a) _________ pareceu ter piorado marcadamente ou atrasado mais n o seu desenvolvimento?",
          "Quando é que isto aconteceu?",
          "Que capacidades perdeu?",
          "Isto afectou o seu asseio?",
          "Ou compreensão da linguagem?",
          "Ou utilização de discurso?",
          "Ou capacidade de tomar conta de si próprio?",
          "E capacidade de manipular objectos?",
          "E capacidades na escola?",
          "ANOTAR A IDADE DO SUJEITO QUANDO PERDA DE CAPACIDADES OCORREU) SE SIM: Houve alguma sugestão de que a perda de capadidades estaria associada a doença fìsica?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "não existiu perda de capacidades consistente (embora o"
          },
          {
            "code": 1,
            "text": "provavel perda de capacidades, mas num grau que não cumpre os critérios"
          },
          {
            "code": 8,
            "text": "não aplicável à idade"
          },
          {
            "code": 0,
            "text": "perda de capacidades mas sintomas físicos insignificantes"
          },
          {
            "code": 1,
            "text": "perda de capacidades associada a sintomas que não são clara evidência de origem miningica ou encefalítica, p.ex. febre alta e otite"
          },
          {
            "code": 8,
            "text": "não existiu perda de capacidades ou não aplicável à idade"
          }
        ],
        "timepoints": []
      },
      {
        "num": "104",
        "id": "item_104",
        "text": "DETERIORAÇÃO PROGRESSIVA",
        "type": "coded",
        "notes": [],
        "probes": [
          "M PERÍODO DE PELO MENOS 2 ANOS) SE HOUVER PERDA DE CAPACIDADES: O desenvolvimento do(a) ________ recomeçou a evoluir?",
          "Quanto tempo durou o período em que perdeu capacidades?",
          "Ele/ela agora conseguiu recuperar até ao nível em que estava antes de piorar?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "neste momento desenvolvimento adequado para o seu nível de deficiência"
          },
          {
            "code": 1,
            "text": "desenvolvimento estacionário – sem melhorias ou perdas de capacidades"
          },
          {
            "code": 2,
            "text": "deterioração claramente em progressão de acordo com pelo menos um dos domínios especificados sob perda de capacidades, mas um ou"
          }
        ],
        "timepoints": [
          "actual"
        ]
      },
      {
        "num": "105",
        "id": "item_105",
        "text": "DURAÇÃO DO PERÍODO DE DETERIORAÇÃO",
        "type": "coded",
        "notes": [],
        "probes": [
          "E O QUE FOR PRIMEIRO) É capaz de fazer uma estimativa sobre a duração deste período de deterioração?",
          "PARA TODOS OS ITENS DESTA PÁGINA COTE ACTUAL E ALGUMA VEZ O(a) ____tem capacidades especiais?",
          "Parecem ser coisas em que ele é excepcionalmente bom presentemente ou aconteceram no passado?",
          "Estas capacidades estão relacionadas com algum interesse especial ou com alguma preocupação invulgar?",
          "O seu filho(a) é particularmente bom(a) com formas, puzzles ou quebra - cabeças?",
          "Isto foi alguma vez uma habilidade particular?",
          "E sobre a memória dele(a)?",
          "Foi alguma vez excepcional?",
          "Apresenta algumas capacidades musicais em especial?",
          "Geralmente, ele é invulgarmente bom a desenhar?"
        ],
        "codes": [
          {
            "code": 995,
            "text": "DETERIORAÇÃO CONTÍNUA"
          },
          {
            "code": 998,
            "text": "SEM DETERIORAÇÃO"
          },
          {
            "code": 0,
            "text": "sem qualquer habilidade/conhecimento excepcional em relação em relação ao seu nível de capacidade, seja elevado ou baixo"
          },
          {
            "code": 1,
            "text": "capacidade/conhecimento isolado, comentado por outros, mas não muito acima do seu nível funcional global"
          },
          {
            "code": 2,
            "text": "capacidade/conhecimento isolado, que está definitivamente fora do contexto do seu nível de capacidades, mas não acima da média das crianças da sua idade"
          },
          {
            "code": 3,
            "text": "capacidade/conhecimento isolado, que está acima das suas capacidades e acima da média das crianças da sua idade, mas não é utilizada de forma funcional ou com significado (ex.: uma criança em idade pré - escolar que lê s"
          },
          {
            "code": 4,
            "text": "capacidade/conhecimento isolado que está acima do seu nível funcional e acima da média das crianças da sua idade e é utilizado com significado (i. é, talento genuíno ou habilidades utilizadas de forma adaptativa, como to"
          },
          {
            "code": 8,
            "text": "não aplicável (ex.: ler sem ser uma criança verbal)"
          },
          {
            "code": 9,
            "text": "desconhecido ou não perguntado"
          }
        ],
        "timepoints": [
          "actual",
          "ever"
        ]
      }
    ]
  },
  {
    "title": "Capacidades especiais",
    "items": [
      {
        "num": "106",
        "id": "item_106",
        "text": "HABILIDADE VISUO-ESPACIAL",
        "type": "coded",
        "notes": [],
        "probes": [],
        "codes": [],
        "timepoints": [
          "actual"
        ]
      },
      {
        "num": "107",
        "id": "item_107",
        "text": "CAPACIDADE DE MEMÓRIA",
        "type": "coded",
        "notes": [],
        "probes": [],
        "codes": [],
        "timepoints": [
          "actual"
        ]
      },
      {
        "num": "108",
        "id": "item_108",
        "text": "HABILIDADE MUSICAL",
        "type": "coded",
        "notes": [],
        "probes": [],
        "codes": [],
        "timepoints": [
          "actual"
        ]
      },
      {
        "num": "109",
        "id": "item_109",
        "text": "HABILIDADE PARA DESENHO",
        "type": "coded",
        "notes": [],
        "probes": [],
        "codes": [],
        "timepoints": [
          "actual"
        ]
      },
      {
        "num": "110",
        "id": "item_110",
        "text": "CAPACIDADE DE LEITURA",
        "type": "coded",
        "notes": [],
        "probes": [],
        "codes": [],
        "timepoints": [
          "actual"
        ]
      },
      {
        "num": "111",
        "id": "item_111",
        "text": "CAPACIDADE DE CÁLCULO",
        "type": "coded",
        "notes": [],
        "probes": [
          "PARA TODOS OS ITENS DESTA PÁGINA COTE ACTUAL E ALGUMA VEZ O(a) ____tem capacidades especiais?",
          "Parecem ser coisas em que ele é excepcionalmente bom presentemente ou aconteceram no passado?",
          "Estas capacidades estão relacionadas com algum interesse especial ou com alguma preocupação invulgar?",
          "O seu filho(a) é particularmente bom(a) com formas, puzzles ou quebra - cabeças?",
          "Isto foi alguma vez uma habilidade particular?",
          "E sobre a memória dele(a)?",
          "Foi alguma vez excepcional?",
          "Apresenta algumas capacidades musicais em especial?",
          "Geralmente, ele é invulgarmente bom a desenhar?",
          "E quanto ao cálculo mental?"
        ],
        "codes": [
          {
            "code": 0,
            "text": "sem qualquer habilidade/conhecimento excepcional em relação em relação ao seu nível de capacidade, seja elevado ou baixo"
          },
          {
            "code": 1,
            "text": "capacidade/conhecimento isolado, comentado por outros, mas não muito acima do seu nível funcional global"
          },
          {
            "code": 2,
            "text": "capacidade/conhecimento isolado, que está definitivamente fora do contexto do seu nível de capacidades, mas não acima da média das crianças da sua idade"
          },
          {
            "code": 3,
            "text": "capacidade/conhecimento isolado, que está acima das suas capacidades e acima da média das crianças da sua idade, mas não é utilizada de forma funcional ou com significado (ex.: uma criança em idade pré - escolar que lê s"
          },
          {
            "code": 4,
            "text": "capacidade/conhecimento isolado que está acima do seu nível funcional e acima da média das crianças da sua idade e é utilizado com significado (i. é, talento genuíno ou habilidades utilizadas de forma adaptativa, como to"
          },
          {
            "code": 8,
            "text": "não aplicável (ex.: ler sem ser uma criança verbal)"
          },
          {
            "code": 9,
            "text": "desconhecido ou não perguntado"
          }
        ],
        "timepoints": [
          "actual",
          "ever"
        ]
      }
    ]
  }
] as const

const PRESENTATION_ITEMS: QuestionnaireItem[] = [
  {
    "id": "id_nome",
    "text": "Nome do probando",
    "inputType": "text"
  },
  {
    "id": "id_familia_id",
    "text": "Número ID da família",
    "inputType": "text"
  },
  {
    "id": "id_individual_id",
    "text": "Número ID individual do sujeito",
    "inputType": "text"
  },
  {
    "id": "id_data_entrevista",
    "text": "Data da entrevista",
    "inputType": "text"
  },
  {
    "id": "id_idade_anos",
    "text": "Idade do sujeito na entrevista (anos)",
    "inputType": "text"
  },
  {
    "id": "id_data_nascimento",
    "text": "Data de nascimento (mês/dia/ano)",
    "inputType": "text"
  },
  {
    "id": "id_investigador",
    "text": "Investigador / entrevistador",
    "inputType": "text"
  },
  {
    "id": "id_informador",
    "text": "Nome do informador",
    "inputType": "text"
  },
  {
    "id": "id_telefone_informador",
    "text": "Telefone do informador",
    "inputType": "text"
  },
  {
    "id": "id_local_entrevista",
    "text": "Local e circunstâncias da entrevista",
    "inputType": "textarea"
  },
  {
    "id": "bg_antecedentes",
    "text": "Antecedentes — estrutura familiar (nomes, idades, historial relevante)",
    "inputType": "textarea"
  },
  {
    "id": "bg_historia_medica",
    "text": "História médica / social",
    "inputType": "textarea"
  },
  {
    "id": "bg_escolaridade",
    "text": "Escolaridade (pré-escolar e escolar)",
    "inputType": "textarea"
  },
  {
    "id": "bg_medicacao",
    "text": "Medicação",
    "inputType": "textarea"
  },
  {
    "id": "bg_diagnostico_previo",
    "text": "Diagnósticos médicos prévios (registo livre)",
    "inputType": "textarea"
  },
  {
    "id": "item_1",
    "text": "1. PREOCUPAÇÕES"
  },
  {
    "id": "item_2",
    "text": "2. IDADE (EM MESES) EM QUE OS PAIS"
  },
  {
    "id": "item_3",
    "text": "3. PRIMEIROS"
  },
  {
    "id": "item_4",
    "text": "4. IDADE (EM MESES) EM QUE OS PAIS"
  },
  {
    "id": "item_5",
    "text": "5. INICIO EM"
  },
  {
    "id": "item_6",
    "text": "6. SENTOU - SE SEM AJUDA NUMA"
  },
  {
    "id": "item_7",
    "text": "7. MARCHA SEM AJUDA"
  },
  {
    "id": "item_8",
    "text": "8. AQUISIÇÃO DO"
  },
  {
    "id": "item_9",
    "text": "9. AQUISIÇÃO DO"
  },
  {
    "id": "item_10",
    "text": "10. AQUISIÇÃO DO"
  },
  {
    "id": "item_11",
    "text": "11. UTILIZAÇÃO DO CORPO DE"
  },
  {
    "id": "item_12",
    "text": "12. IDADE DE"
  },
  {
    "id": "item_13",
    "text": "13. IDADE DE"
  },
  {
    "id": "item_14",
    "text": "14. ARTICULAÇÃO/PRONUNCIA"
  },
  {
    "id": "item_15",
    "text": "15. COMPLEXIDADE DE"
  },
  {
    "id": "item_16",
    "text": "16. VOCALIZAÇÃO SOCIAL/CONVERSA FAMILIAR"
  },
  {
    "id": "item_17",
    "text": "17. ECOLÁLIA IMEDIATA 3"
  },
  {
    "id": "item_18",
    "text": "18. EXPRESSÕES"
  },
  {
    "id": "item_19",
    "text": "19. NÍVEL"
  },
  {
    "id": "item_20",
    "text": "20. CONVERSAÇÃO RECÍPROCA"
  },
  {
    "id": "item_21",
    "text": "21. CONVERSA"
  },
  {
    "id": "item_22",
    "text": "22. PERGUNTAS OU"
  },
  {
    "id": "item_23",
    "text": "23. INVERSÃO DOS PRONOMES"
  },
  {
    "id": "item_24",
    "text": "24. NEOLOGISMOS/LINGUAGEM IDIOSINCRÁTICA"
  },
  {
    "id": "item_25",
    "text": "25. RITUAIS VERBAIS"
  },
  {
    "id": "item_26",
    "text": "26. ENTOAÇÃO/VOLUME/RITMO/VELOCIDADE"
  },
  {
    "id": "item_27",
    "text": "27. EXPRESSÃO VOCAL"
  },
  {
    "id": "item_28",
    "text": "28. DISCURSO"
  },
  {
    "id": "item_29",
    "text": "29. IMITAÇÃO"
  },
  {
    "id": "item_30",
    "text": "30. APONTA PARA"
  },
  {
    "id": "item_31",
    "text": "31. GESTOS CONVENCIONAIS/INSTRUMENTAIS"
  },
  {
    "id": "item_32",
    "text": "32. ACENA COM A CABEÇA (SIM)"
  },
  {
    "id": "item_33",
    "text": "33. ABANA A CABEÇA (NÃO)"
  },
  {
    "id": "item_34",
    "text": "34. ATENÇÃO À VOZ"
  },
  {
    "id": "item_35",
    "text": "35. PREOCUPAÇÕES COM A AUDIÇÃO"
  },
  {
    "id": "item_36",
    "text": "36. SENSIBILIDADE"
  },
  {
    "id": "item_37",
    "text": "37. NÍVEL DE"
  },
  {
    "id": "item_38",
    "text": "38. DISCURSO COMUNICATIVO,"
  },
  {
    "id": "item_39",
    "text": "39. PALAVRAS"
  },
  {
    "id": "item_40",
    "text": "40. SINTAXE SIMPLES"
  },
  {
    "id": "item_41",
    "text": "41. ARTICULAÇÃO"
  },
  {
    "id": "item_34a",
    "text": "34A. COMPREENSÃO DE LINGUAGEM SIMPLES"
  },
  {
    "id": "item_42",
    "text": "42. CONTACTO"
  },
  {
    "id": "item_43",
    "text": "43. SORRISO SOCIAL"
  },
  {
    "id": "item_44",
    "text": "44. CUMPRIMENTA"
  },
  {
    "id": "item_45",
    "text": "45. MOSTRA E"
  },
  {
    "id": "item_46",
    "text": "46. OFERECE PARA PARTILHAR"
  },
  {
    "id": "item_47",
    "text": "47. PROCURA"
  },
  {
    "id": "item_48",
    "text": "48. PARTILHA O"
  },
  {
    "id": "item_49",
    "text": "49. OFERECE CONFORTO"
  },
  {
    "id": "item_50",
    "text": "50. PROCURA CONFORTO"
  },
  {
    "id": "item_51",
    "text": "51. QUALIDADE DO"
  },
  {
    "id": "item_52",
    "text": "52. GAMA DE"
  },
  {
    "id": "item_53",
    "text": "53. EXPRESSÃO"
  },
  {
    "id": "item_54",
    "text": "54. ESTENDE OS"
  },
  {
    "id": "item_55",
    "text": "55. AFECTO"
  },
  {
    "id": "item_56",
    "text": "56. DESINIBIÇÃO SOCIAL"
  },
  {
    "id": "item_57",
    "text": "57. RESPOSTAS"
  },
  {
    "id": "item_58",
    "text": "58. ANSIEDADE/FUGA SOCIAL"
  },
  {
    "id": "item_59",
    "text": "59. BASE SEGURA"
  },
  {
    "id": "item_60",
    "text": "60. ANSIEDADE DE"
  },
  {
    "id": "item_61",
    "text": "61. INICIAÇÃO DE"
  },
  {
    "id": "item_62",
    "text": "62. CURIOSIDADE"
  },
  {
    "id": "item_63",
    "text": "63. JOGO IMAGINATIVO"
  },
  {
    "id": "item_64",
    "text": "64. JOGO IMAGINATIVO COM COLEGAS"
  },
  {
    "id": "item_65",
    "text": "65. JOGO SOCIAL IMITATIVO"
  },
  {
    "id": "item_66",
    "text": "66. INTERESSE EM CRIANÇAS"
  },
  {
    "id": "item_67",
    "text": "67. RESPOSTA À"
  },
  {
    "id": "item_68",
    "text": "68. JOGO DE GRUPO COM COLEGAS"
  },
  {
    "id": "item_69",
    "text": "69. AMIZADES"
  },
  {
    "id": "item_70",
    "text": "70. INTERESSES CIRCUNSCRITOS"
  },
  {
    "id": "item_71",
    "text": "71. PREOCUPAÇÕES INVULGARES"
  },
  {
    "id": "item_72",
    "text": "72. USO REPETITIVO DE OBJECTOS OU INTERESSE POR PARTES DE OBJECTOS"
  },
  {
    "id": "item_73",
    "text": "73. DIFICULDADES COM"
  },
  {
    "id": "item_74",
    "text": "74. RESISTÊNCIA A"
  },
  {
    "id": "item_75",
    "text": "75. COMPULSÕES/RITUAIS"
  },
  {
    "id": "item_76",
    "text": "76. LIGAÇÃO"
  },
  {
    "id": "item_77",
    "text": "77. INTERESSES"
  },
  {
    "id": "item_78",
    "text": "78. RESPOSTAS"
  },
  {
    "id": "item_79",
    "text": "79. MEDOS INVULGARES"
  },
  {
    "id": "item_80",
    "text": "80. HIPERVENTILAÇÃO"
  },
  {
    "id": "item_81",
    "text": "81. MANEIRISMOS DE MÃOS E DEDOS"
  },
  {
    "id": "item_82",
    "text": "82. MOVIMENTOS DE MÃOS NA LINHA MÉDIA"
  },
  {
    "id": "item_83",
    "text": "83. PERDA DO USO"
  },
  {
    "id": "item_84",
    "text": "84. OUTROS"
  },
  {
    "id": "item_85",
    "text": "85. BALANCEIO"
  },
  {
    "id": "item_86",
    "text": "86. MARCHA"
  },
  {
    "id": "item_87",
    "text": "87. ESCOLIOSE/"
  },
  {
    "id": "item_88",
    "text": "88. COORDENAÇÃO DA"
  },
  {
    "id": "item_89",
    "text": "89. COORDENAÇÃO DA"
  },
  {
    "id": "item_90",
    "text": "90. AUTO - MUTILAÇÃO"
  },
  {
    "id": "item_91",
    "text": "91. HIPERACTIVIDADE EM CASA OU"
  },
  {
    "id": "item_92",
    "text": "92. DESMAIOS/ATAQUES/AUSÊNCIAS"
  },
  {
    "id": "item_93",
    "text": "93. IDADE EM QUE A"
  },
  {
    "id": "item_94",
    "text": "94. JUÍZO DO"
  },
  {
    "id": "item_95",
    "text": "95. PERDA DE CAPACIDADES"
  },
  {
    "id": "item_96",
    "text": "96. PERDA DE CAPACIDADES (ASSOCIADA A"
  },
  {
    "id": "item_97",
    "text": "97. COMUNICAÇÃO"
  },
  {
    "id": "item_98",
    "text": "98. INTERESSE E"
  },
  {
    "id": "item_99",
    "text": "99. JOGO E IMAGINAÇÃO 5"
  },
  {
    "id": "item_100",
    "text": "100. CAPACIDADE DE ADAPTAÇÃO"
  },
  {
    "id": "item_101",
    "text": "101. CAPACIDADES PRÉ-ACADÉMICAS, ACADÉMICAS OU VOCACIONAIS"
  },
  {
    "id": "item_102",
    "text": "102. CAPACIDADES MOTORAS"
  },
  {
    "id": "item_103",
    "text": "103. IDADE EM QUE A PERDA PRINCIPAL DE CAPACIDADE FOI INICIALMENTE APARENTE"
  },
  {
    "id": "item_104",
    "text": "104. DETERIORAÇÃO PROGRESSIVA"
  },
  {
    "id": "item_105",
    "text": "105. DURAÇÃO DO PERÍODO DE DETERIORAÇÃO"
  },
  {
    "id": "item_106",
    "text": "106. HABILIDADE VISUO-ESPACIAL"
  },
  {
    "id": "item_107",
    "text": "107. CAPACIDADE DE MEMÓRIA"
  },
  {
    "id": "item_108",
    "text": "108. HABILIDADE MUSICAL"
  },
  {
    "id": "item_109",
    "text": "109. HABILIDADE PARA DESENHO"
  },
  {
    "id": "item_110",
    "text": "110. CAPACIDADE DE LEITURA"
  },
  {
    "id": "item_111",
    "text": "111. CAPACIDADE DE CÁLCULO"
  }
]

const codeSchema = z
  .union([
    z.literal(0),
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
    z.literal(6),
    z.literal(7),
    z.literal(8),
    z.literal(9),
  ])
  .optional()

const lossSchema = z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(8), z.literal(9)]).optional()

export function adirFieldId(itemId: string, suffix: string): string {
  return `${itemId}_${suffix}`
}

export function buildAdirSchema() {
  const shape: Record<string, z.ZodTypeAny> = {}
  for (const field of ADIR_IDENTIFICATION) {
    if (field.inputType === 'choice') {
      shape[field.id] = z.number().int().min(0).max(field.options.length - 1).optional()
    } else {
      shape[field.id] = z.string().optional()
    }
  }
  for (const field of ADIR_BACKGROUND) {
    shape[field.id] = z.string().optional()
  }
  shape["item_1_a"] = codeSchema
  shape["item_1_b"] = codeSchema
  shape["item_1_c"] = codeSchema
  shape["item_1_d"] = codeSchema
  shape["item_1_detalhe"] = z.string().optional()
  shape["item_2"] = codeSchema
  shape["item_2_detalhe"] = z.string().optional()
  shape["item_3_a"] = codeSchema
  shape["item_3_b"] = codeSchema
  shape["item_3_c"] = codeSchema
  shape["item_3_d"] = codeSchema
  shape["item_3_detalhe"] = z.string().optional()
  shape["item_4"] = codeSchema
  shape["item_4_detalhe"] = z.string().optional()
  shape["item_5"] = codeSchema
  shape["item_5_detalhe"] = z.string().optional()
  shape["item_6"] = codeSchema
  shape["item_6_detalhe"] = z.string().optional()
  shape["item_7"] = codeSchema
  shape["item_7_detalhe"] = z.string().optional()
  shape["item_8"] = codeSchema
  shape["item_8_detalhe"] = z.string().optional()
  shape["item_9"] = codeSchema
  shape["item_9_detalhe"] = z.string().optional()
  shape["item_10"] = codeSchema
  shape["item_10_detalhe"] = z.string().optional()
  shape["item_11_ever"] = codeSchema
  shape["item_11_actual"] = codeSchema
  shape["item_11_detalhe"] = z.string().optional()
  shape["item_12"] = codeSchema
  shape["item_12_detalhe"] = z.string().optional()
  shape["item_13"] = codeSchema
  shape["item_13_detalhe"] = z.string().optional()
  shape["item_14_anomal_45"] = codeSchema
  shape["item_14_actual"] = codeSchema
  shape["item_14_detalhe"] = z.string().optional()
  shape["item_15_anomal_45"] = codeSchema
  shape["item_15_actual"] = codeSchema
  shape["item_15_detalhe"] = z.string().optional()
  shape["item_16_anomal_45"] = codeSchema
  shape["item_16_ever"] = codeSchema
  shape["item_16_actual"] = codeSchema
  shape["item_16_detalhe"] = z.string().optional()
  shape["item_17_ever"] = codeSchema
  shape["item_17_actual"] = codeSchema
  shape["item_17_detalhe"] = z.string().optional()
  shape["item_18_ever"] = codeSchema
  shape["item_18_actual"] = codeSchema
  shape["item_18_detalhe"] = z.string().optional()
  shape["item_19_anomal_45"] = codeSchema
  shape["item_19_actual"] = codeSchema
  shape["item_19_detalhe"] = z.string().optional()
  shape["item_20_anomal_45"] = codeSchema
  shape["item_20_actual"] = codeSchema
  shape["item_20_detalhe"] = z.string().optional()
  shape["item_21_anomal_45"] = codeSchema
  shape["item_21_ever"] = codeSchema
  shape["item_21_actual"] = codeSchema
  shape["item_21_detalhe"] = z.string().optional()
  shape["item_22_ever"] = codeSchema
  shape["item_22_actual"] = codeSchema
  shape["item_22_detalhe"] = z.string().optional()
  shape["item_23_ever"] = codeSchema
  shape["item_23_actual"] = codeSchema
  shape["item_23_detalhe"] = z.string().optional()
  shape["item_24_ever"] = codeSchema
  shape["item_24_actual"] = codeSchema
  shape["item_24_detalhe"] = z.string().optional()
  shape["item_25_ever"] = codeSchema
  shape["item_25_actual"] = codeSchema
  shape["item_25_detalhe"] = z.string().optional()
  shape["item_26_ever"] = codeSchema
  shape["item_26_actual"] = codeSchema
  shape["item_26_detalhe"] = z.string().optional()
  shape["item_27_ever"] = codeSchema
  shape["item_27_actual"] = codeSchema
  shape["item_27_detalhe"] = z.string().optional()
  shape["item_28_anomal_45"] = codeSchema
  shape["item_28_ever"] = codeSchema
  shape["item_28_actual"] = codeSchema
  shape["item_28_detalhe"] = z.string().optional()
  shape["item_29_anomal_45"] = codeSchema
  shape["item_29_actual"] = codeSchema
  shape["item_29_detalhe"] = z.string().optional()
  shape["item_30_anomal_45"] = codeSchema
  shape["item_30_ever"] = codeSchema
  shape["item_30_actual"] = codeSchema
  shape["item_30_detalhe"] = z.string().optional()
  shape["item_31_anomal_45"] = codeSchema
  shape["item_31_ever"] = codeSchema
  shape["item_31_actual"] = codeSchema
  shape["item_31_detalhe"] = z.string().optional()
  shape["item_32_anomal_45"] = codeSchema
  shape["item_32_actual"] = codeSchema
  shape["item_32_detalhe"] = z.string().optional()
  shape["item_33_anomal_45"] = codeSchema
  shape["item_33_actual"] = codeSchema
  shape["item_33_detalhe"] = z.string().optional()
  shape["item_34_anomal_45"] = codeSchema
  shape["item_34_actual"] = codeSchema
  shape["item_34_detalhe"] = z.string().optional()
  shape["item_35_ever"] = codeSchema
  shape["item_35_detalhe"] = z.string().optional()
  shape["item_36_ever"] = codeSchema
  shape["item_36_actual"] = codeSchema
  shape["item_36_detalhe"] = z.string().optional()
  shape["item_37_ever"] = codeSchema
  shape["item_37_detalhe"] = z.string().optional()
  shape["item_38_ever"] = lossSchema
  shape["item_38_detalhe"] = z.string().optional()
  shape["item_39_ever"] = lossSchema
  shape["item_39_detalhe"] = z.string().optional()
  shape["item_40_ever"] = lossSchema
  shape["item_40_detalhe"] = z.string().optional()
  shape["item_41_ever"] = lossSchema
  shape["item_41_detalhe"] = z.string().optional()
  shape["item_34a_anomal_45"] = codeSchema
  shape["item_34a_actual"] = codeSchema
  shape["item_34a_detalhe"] = z.string().optional()
  shape["item_42_anomal_45"] = codeSchema
  shape["item_42_ever"] = codeSchema
  shape["item_42_actual"] = codeSchema
  shape["item_42_detalhe"] = z.string().optional()
  shape["item_43_anomal_45"] = codeSchema
  shape["item_43_actual"] = codeSchema
  shape["item_43_detalhe"] = z.string().optional()
  shape["item_44_anomal_45"] = codeSchema
  shape["item_44_actual"] = codeSchema
  shape["item_44_detalhe"] = z.string().optional()
  shape["item_45_anomal_45"] = codeSchema
  shape["item_45_ever"] = codeSchema
  shape["item_45_actual"] = codeSchema
  shape["item_45_detalhe"] = z.string().optional()
  shape["item_46_anomal_45"] = codeSchema
  shape["item_46_ever"] = codeSchema
  shape["item_46_actual"] = codeSchema
  shape["item_46_detalhe"] = z.string().optional()
  shape["item_47_anomal_45"] = codeSchema
  shape["item_47_ever"] = codeSchema
  shape["item_47_actual"] = codeSchema
  shape["item_47_detalhe"] = z.string().optional()
  shape["item_48_anomal_45"] = codeSchema
  shape["item_48_ever"] = codeSchema
  shape["item_48_actual"] = codeSchema
  shape["item_48_detalhe"] = z.string().optional()
  shape["item_49_anomal_45"] = codeSchema
  shape["item_49_ever"] = codeSchema
  shape["item_49_actual"] = codeSchema
  shape["item_49_detalhe"] = z.string().optional()
  shape["item_50_anomal_45"] = codeSchema
  shape["item_50_ever"] = codeSchema
  shape["item_50_actual"] = codeSchema
  shape["item_50_detalhe"] = z.string().optional()
  shape["item_51_anomal_45"] = codeSchema
  shape["item_51_ever"] = codeSchema
  shape["item_51_actual"] = codeSchema
  shape["item_51_detalhe"] = z.string().optional()
  shape["item_52_anomal_45"] = codeSchema
  shape["item_52_actual"] = codeSchema
  shape["item_52_detalhe"] = z.string().optional()
  shape["item_53_ever"] = codeSchema
  shape["item_53_detalhe"] = z.string().optional()
  shape["item_54_anomal_45"] = codeSchema
  shape["item_54_actual"] = codeSchema
  shape["item_54_detalhe"] = z.string().optional()
  shape["item_55_anomal_45"] = codeSchema
  shape["item_55_actual"] = codeSchema
  shape["item_55_detalhe"] = z.string().optional()
  shape["item_56_anomal_45"] = codeSchema
  shape["item_56_ever"] = codeSchema
  shape["item_56_actual"] = codeSchema
  shape["item_56_detalhe"] = z.string().optional()
  shape["item_57_anomal_45"] = codeSchema
  shape["item_57_actual"] = codeSchema
  shape["item_57_detalhe"] = z.string().optional()
  shape["item_58_anomal_45"] = codeSchema
  shape["item_58_actual"] = codeSchema
  shape["item_58_detalhe"] = z.string().optional()
  shape["item_59_anomal_45"] = codeSchema
  shape["item_59_ever"] = codeSchema
  shape["item_59_actual"] = codeSchema
  shape["item_59_detalhe"] = z.string().optional()
  shape["item_60_anomal_45"] = codeSchema
  shape["item_60_ever"] = codeSchema
  shape["item_60_actual"] = codeSchema
  shape["item_60_detalhe"] = z.string().optional()
  shape["item_61_anomal_45"] = codeSchema
  shape["item_61_actual"] = codeSchema
  shape["item_61_detalhe"] = z.string().optional()
  shape["item_62_anomal_45"] = codeSchema
  shape["item_62_actual"] = codeSchema
  shape["item_62_detalhe"] = z.string().optional()
  shape["item_63_anomal_45"] = codeSchema
  shape["item_63_ever"] = codeSchema
  shape["item_63_actual"] = codeSchema
  shape["item_63_detalhe"] = z.string().optional()
  shape["item_64_anomal_45"] = codeSchema
  shape["item_64_ever"] = codeSchema
  shape["item_64_actual"] = codeSchema
  shape["item_64_detalhe"] = z.string().optional()
  shape["item_65_anomal_45"] = codeSchema
  shape["item_65_actual"] = codeSchema
  shape["item_65_detalhe"] = z.string().optional()
  shape["item_66_anomal_45"] = codeSchema
  shape["item_66_actual"] = codeSchema
  shape["item_66_detalhe"] = z.string().optional()
  shape["item_67_anomal_45"] = codeSchema
  shape["item_67_actual"] = codeSchema
  shape["item_67_detalhe"] = z.string().optional()
  shape["item_68_anomal_45"] = codeSchema
  shape["item_68_actual"] = codeSchema
  shape["item_68_detalhe"] = z.string().optional()
  shape["item_69_anomal_45"] = codeSchema
  shape["item_69_ever"] = codeSchema
  shape["item_69_actual"] = codeSchema
  shape["item_69_detalhe"] = z.string().optional()
  shape["item_70_ever"] = codeSchema
  shape["item_70_actual"] = codeSchema
  shape["item_70_detalhe"] = z.string().optional()
  shape["item_71_ever"] = codeSchema
  shape["item_71_actual"] = codeSchema
  shape["item_71_detalhe"] = z.string().optional()
  shape["item_72_ever"] = codeSchema
  shape["item_72_actual"] = codeSchema
  shape["item_72_detalhe"] = z.string().optional()
  shape["item_73_ever"] = codeSchema
  shape["item_73_actual"] = codeSchema
  shape["item_73_detalhe"] = z.string().optional()
  shape["item_74_ever"] = codeSchema
  shape["item_74_actual"] = codeSchema
  shape["item_74_detalhe"] = z.string().optional()
  shape["item_75_ever"] = codeSchema
  shape["item_75_actual"] = codeSchema
  shape["item_75_detalhe"] = z.string().optional()
  shape["item_76_ever"] = codeSchema
  shape["item_76_actual"] = codeSchema
  shape["item_76_detalhe"] = z.string().optional()
  shape["item_77_ever"] = codeSchema
  shape["item_77_actual"] = codeSchema
  shape["item_77_detalhe"] = z.string().optional()
  shape["item_78_ever"] = codeSchema
  shape["item_78_actual"] = codeSchema
  shape["item_78_detalhe"] = z.string().optional()
  shape["item_79_ever"] = codeSchema
  shape["item_79_actual"] = codeSchema
  shape["item_79_detalhe"] = z.string().optional()
  shape["item_80_ever"] = codeSchema
  shape["item_80_actual"] = codeSchema
  shape["item_80_detalhe"] = z.string().optional()
  shape["item_81_ever"] = codeSchema
  shape["item_81_actual"] = codeSchema
  shape["item_81_detalhe"] = z.string().optional()
  shape["item_82_ever"] = codeSchema
  shape["item_82_actual"] = codeSchema
  shape["item_82_detalhe"] = z.string().optional()
  shape["item_83_ever"] = codeSchema
  shape["item_83_actual"] = codeSchema
  shape["item_83_detalhe"] = z.string().optional()
  shape["item_84_ever"] = codeSchema
  shape["item_84_actual"] = codeSchema
  shape["item_84_detalhe"] = z.string().optional()
  shape["item_85_ever"] = codeSchema
  shape["item_85_actual"] = codeSchema
  shape["item_85_detalhe"] = z.string().optional()
  shape["item_86_anomal_45"] = codeSchema
  shape["item_86_ever"] = codeSchema
  shape["item_86_actual"] = codeSchema
  shape["item_86_detalhe"] = z.string().optional()
  shape["item_87_actual"] = codeSchema
  shape["item_87_detalhe"] = z.string().optional()
  shape["item_88_anomal_45"] = codeSchema
  shape["item_88_actual"] = codeSchema
  shape["item_88_detalhe"] = z.string().optional()
  shape["item_89_anomal_45"] = codeSchema
  shape["item_89_actual"] = codeSchema
  shape["item_89_detalhe"] = z.string().optional()
  shape["item_90_ever"] = codeSchema
  shape["item_90_actual"] = codeSchema
  shape["item_90_detalhe"] = z.string().optional()
  shape["item_91_ever"] = codeSchema
  shape["item_91_actual"] = codeSchema
  shape["item_91_detalhe"] = z.string().optional()
  shape["item_92_ever"] = codeSchema
  shape["item_92_actual"] = codeSchema
  shape["item_92_detalhe"] = z.string().optional()
  shape["item_93"] = codeSchema
  shape["item_93_detalhe"] = z.string().optional()
  shape["item_94"] = codeSchema
  shape["item_94_detalhe"] = z.string().optional()
  shape["item_95_actual"] = codeSchema
  shape["item_95_detalhe"] = z.string().optional()
  shape["item_96_actual"] = codeSchema
  shape["item_96_detalhe"] = z.string().optional()
  shape["item_97_actual"] = codeSchema
  shape["item_97_detalhe"] = z.string().optional()
  shape["item_98_actual"] = codeSchema
  shape["item_98_detalhe"] = z.string().optional()
  shape["item_99_actual"] = codeSchema
  shape["item_99_detalhe"] = z.string().optional()
  shape["item_100_actual"] = codeSchema
  shape["item_100_detalhe"] = z.string().optional()
  shape["item_101_actual"] = codeSchema
  shape["item_101_detalhe"] = z.string().optional()
  shape["item_102_actual"] = codeSchema
  shape["item_102_detalhe"] = z.string().optional()
  shape["item_103"] = codeSchema
  shape["item_103_detalhe"] = z.string().optional()
  shape["item_104_actual"] = codeSchema
  shape["item_104_detalhe"] = z.string().optional()
  shape["item_105_ever"] = codeSchema
  shape["item_105_actual"] = codeSchema
  shape["item_105_detalhe"] = z.string().optional()
  shape["item_106_actual"] = codeSchema
  shape["item_106_detalhe"] = z.string().optional()
  shape["item_107_actual"] = codeSchema
  shape["item_107_detalhe"] = z.string().optional()
  shape["item_108_actual"] = codeSchema
  shape["item_108_detalhe"] = z.string().optional()
  shape["item_109_actual"] = codeSchema
  shape["item_109_detalhe"] = z.string().optional()
  shape["item_110_actual"] = codeSchema
  shape["item_110_detalhe"] = z.string().optional()
  shape["item_111_ever"] = codeSchema
  shape["item_111_actual"] = codeSchema
  shape["item_111_detalhe"] = z.string().optional()
  shape[QUESTIONNAIRE_NOTES_FIELD] = z.string().optional()
  return z.object(shape).strict()
}

export const adirQuestionnaire = defineQuestionnaire({
  id: 'adir',
  title: 'ADI-R — Entrevista para autismo',
  description:
    'Autism Diagnostic Interview — Revised (ADI-R). Entrevista estruturada para diagnóstico de autismo (3.ª edição, versão portuguesa).',
  instructions:
    'Conduza a entrevista com o informador seguindo os textos e sondagens de cada item. Registe descrições de comportamento (campo «Detalhes») antes de codificar. Use Actual / Alguma vez / Mais anómalo 4–5 anos conforme indicado no manual.',
  respondent: 'Informador (pais ou cuidador) com clínico',
  responseType: 'likert4',
  items: PRESENTATION_ITEMS,
  meta: {
    introScript: ADIR_INTRO_SCRIPT,
    identification: ADIR_IDENTIFICATION,
    background: ADIR_BACKGROUND,
    sections: ADIR_SECTIONS,
    timepointLabels: ADIR_TIMEPOINT_LABELS,
    concernsCodes: ADIR_CONCERNS_CODES,
    retroCodes: ADIR_RETRO_CODES,
    lossCodes: ADIR_LOSS_CODES,
    ageHint: ADIR_AGE_HINT,
  },
})
