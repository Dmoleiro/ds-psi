// Auto-generated from scripts/inventario_asperger_extract.txt — do not edit by hand.
import { z } from 'zod'
import { defineQuestionnaire } from '../helpers.js'
import { QUESTIONNAIRE_NOTES_FIELD } from '../types.js'
import type { QuestionnaireItem } from '../types.js'

export const INVENTARIO_ASPERGER_LIKERT_LABELS = [
  '0 — Não é problema / não apresenta',
  '1 — Ligeiro / pouco acentuada',
  '2 — Moderado',
  '3 — Grave / muito acentuada',
] as const

export const INVENTARIO_ASPERGER_LIKERT_SECTIONS = [
  {
    "title": "I. Subescala Interação Social",
    "items": [
      {
        "num": 1,
        "text": "Tem dificuldade no relacionamento com os outros, não justificada por desatenção ou falta de experiência."
      },
      {
        "num": 2,
        "text": "Tem poucos ou nenhuns amigos, mas manifesta desejo de os ter."
      },
      {
        "num": 3,
        "text": "Prefere estar na companhia dos mais velhos ou mais novos, em vez de estar com as pessoas da sua idade."
      },
      {
        "num": 4,
        "text": "Demonstra pouco ou nenhum interesse pelos colegas."
      },
      {
        "num": 5,
        "text": "Tem pouca ou nenhuma capacidade para fazer e/ou manter amizades."
      },
      {
        "num": 6,
        "text": "Tem dificuldade em cooperar num grupo (por ex., grupo de trabalho ou equipa)."
      },
      {
        "num": 7,
        "text": "Parece não compreender as regras ou códigos de conduta social (por ex. faz comentários/perguntas inconvenientes sem perceber que a pessoa pode ficar ofendida/embaraçada)."
      },
      {
        "num": 8,
        "text": "Tem dificuldade em brincar/jogar com os colegas (por ex., não tem consciência ou não cumpre as regras dos jogos em grupo)."
      },
      {
        "num": 9,
        "text": "Isola-se quando tem possibilidade de interagir com os colegas (por ex., no recreio brinca sozinho(a) ou procura um lugar calmo)."
      },
      {
        "num": 10,
        "text": "Mostra pouco interesse no que as outras pessoas dizem ou acham interessante."
      },
      {
        "num": 11,
        "text": "É indiferente à pressão dos colegas (por ex. não segue as modas de roupa ou brincadeiras)."
      },
      {
        "num": 12,
        "text": "Tem dificuldade em avaliar situações sociais (por ex. não adequa o seu comportamento ao sítio onde está, como falar alto durante uma missa)."
      },
      {
        "num": 13,
        "text": "Tem falta de empatia (dificuldade em compreender os sentimentos dos outros ou “pôr-se na pele do outro”)."
      },
      {
        "num": 14,
        "text": "Demonstra pouca subtileza na expressão das emoções (por ex., demonstra grande tristeza ou afeto desproporcionado relativamente à situação ou pessoa)."
      },
      {
        "num": 15,
        "text": "Tem dificuldade em lidar com emoções negativas como a frustração, tristeza ou raiva (por ex., é agressivo(a) quando perde um jogo ou é contrariado(a))."
      },
      {
        "num": 16,
        "text": "Não prevê as consequências das suas ações numa situação social (por ex., não prevê o resultado de passar à frente de alguém numa fila)."
      },
      {
        "num": 17,
        "text": "É frequentemente alvo de “gozo” por parte dos colegas."
      },
      {
        "num": 18,
        "text": "Tem um comportamento social indiferenciado (por ex., fala com estranhos acerca da sua vida pessoal, trata as pessoas sem atender à idade ou estatuto social)."
      },
      {
        "num": 19,
        "text": "Parece insensível ou não se apercebe das necessidades dos outros."
      },
      {
        "num": 20,
        "text": "É ingénuo, crédulo."
      },
      {
        "num": 21,
        "text": "Tenta impor aos outros interesses ou rotinas."
      }
    ]
  },
  {
    "title": "II. Subescala Comunicação",
    "items": [
      {
        "num": 22,
        "text": "Fala como um adulto, de um modo formal ou com uma linguagem demasiado sofisticada (usa palavras \"caras\")."
      },
      {
        "num": 23,
        "text": "Diz palavras ou frases repetitivamente."
      },
      {
        "num": 24,
        "text": "Apresenta um vocabulário inesperadamente rico para a sua idade."
      },
      {
        "num": 25,
        "text": "Não respeita o espaço físico interpessoal (por ex., aproxima-se demasiado das outras pessoas)."
      },
      {
        "num": 26,
        "text": "Tem dificuldade em iniciar e manter uma conversa."
      },
      {
        "num": 27,
        "text": "Tem tendência para ter um discurso egocêntrico (i.e., falar para as pessoas, tipo monólogo, geralmente acerca dos seus interesses, ao contrário de estabelecer um diálogo)."
      },
      {
        "num": 28,
        "text": "Tem dificuldade em compreender piadas ou anedotas."
      },
      {
        "num": 29,
        "text": "Tem dificuldade em relatar acontecimentos (por ex., situações passadas ou filmes) de forma sequencial e coerente (por ex. exclui partes importantes)."
      },
      {
        "num": 30,
        "text": "Interpreta literalmente o que lhe dizem (i.e. tem dificuldade em perceber a linguagem metafórica ou segundos sentidos, como por exemplo, provérbios)."
      },
      {
        "num": 31,
        "text": "A sua voz tem características peculiares (por ex., voz \"esganiçada\" ou tom monótono)."
      },
      {
        "num": 32,
        "text": "Exibe pouca variedade de expressões faciais."
      },
      {
        "num": 33,
        "text": "Tem dificuldade em interpretar os sinais não-verbais durante uma conversa (por ex. a expressão facial ou o tom de voz do interlocutor)."
      },
      {
        "num": 34,
        "text": "Tem dificuldade em perceber quando está a ser gozado(a) ou ridicularizado(a)."
      },
      {
        "num": 35,
        "text": "Usa poucos gestos."
      },
      {
        "num": 36,
        "text": "Fala alto demais."
      },
      {
        "num": 37,
        "text": "Quando não compreende, não pede para lhe explicarem, mas fala/responde com um tema que lhe é conhecido ou familiar."
      },
      {
        "num": 38,
        "text": "Exibe expressões faciais desadequadas."
      },
      {
        "num": 39,
        "text": "Não muda a voz (tom, volume, ritmo) para indicar emoções e/ou realçar palavras-chave."
      },
      {
        "num": 40,
        "text": "Tem dificuldade em compreender a gíria (calão)."
      },
      {
        "num": 41,
        "text": "Fala de si próprio(a) na 3ª pessoa do singular (i.e., diz o \"João\" em vez de eu)."
      },
      {
        "num": 42,
        "text": "Repete despropositadamente as palavras ditas por outra pessoa (como se fosse um papagaio)."
      },
      {
        "num": 43,
        "text": "Evita ou desvia o olhar."
      }
    ]
  },
  {
    "title": "III. Subescala Padrões de Comportamento",
    "items": [
      {
        "num": 44,
        "text": "Tem um interesse intenso ou obsessivo num tema ou atividade restrito(a)."
      },
      {
        "num": 45,
        "text": "Tem grande necessidade de que o(a) tranquilizem quando ocorrem mudanças ou algo corre mal."
      },
      {
        "num": 46,
        "text": "Apresenta comportamentos estranhos, bizarros ou excêntricos."
      },
      {
        "num": 47,
        "text": "Estabelece hábitos ou rituais que tem necessidade de cumprir (por ex., bater duas vezes no prato antes de comer, vestir-se sempre pela mesma ordem)."
      },
      {
        "num": 48,
        "text": "Tem comportamentos desadequados relacionados com os seus interesses obsessivos ou favoritos (por ex., desenhar máquinas, em vez de trabalhar na aula)."
      },
      {
        "num": 49,
        "text": "Reage de forma negativa (por ex., fica ansioso) às mudanças na sua rotina."
      },
      {
        "num": 50,
        "text": "Sente-se confundido(a) ou desorientado(a) no meio de muitas pessoas."
      },
      {
        "num": 51,
        "text": "Tem movimentos repetitivos (por ex. abanar as mãos como “bater asas”, estalar os dedos)."
      },
      {
        "num": 52,
        "text": "Tem uma preocupação excessiva com temas específicos ou objetos que é anormal em intensidade ou na atenção despendida (por ex., fala repetidamente sobre a notícia de uma catástrofe)."
      },
      {
        "num": 53,
        "text": "Fica nervoso ou em pânico quando ocorrem situações imprevistas."
      },
      {
        "num": 54,
        "text": "Tem comportamentos ritualizados e/ou repetitivos (por ex., correr à volta de uma mesa sem sentido, fazer bolinhas de papel, brincar sempre com os mesmos objetos)."
      }
    ]
  },
  {
    "title": "IV. Subescala Motora",
    "items": [
      {
        "num": 55,
        "text": "Tem dificuldade em tarefas que exigem competências motoras finas (por ex., abotoar, atar atacadores)."
      },
      {
        "num": 56,
        "text": "Apresenta uma letra difícil de perceber (má caligrafia)."
      },
      {
        "num": 57,
        "text": "Parece desajeitado(a) e/ou descoordenado(a) nos seus movimentos."
      },
      {
        "num": 58,
        "text": "Tem dificuldade em atividades que exigem agilidade física (por ex., ginástica, futebol)."
      },
      {
        "num": 59,
        "text": "Tem dificuldade em escrever ou escreve devagar."
      },
      {
        "num": 60,
        "text": "Apresenta movimentos invulgares ou descoordenados quando anda ou corre."
      }
    ]
  },
  {
    "title": "V. Subescala Sensibilidade Sensorial",
    "items": [
      {
        "num": 61,
        "text": "Reage negativamente (por ex., chora, afasta-se, tapa os ouvidos) ao som alto (ou ruidoso), súbito ou estridente."
      },
      {
        "num": 62,
        "text": "Fica rígido(a) ou repele quando é agarrado(a) (por ex., dá um aperto de mão fugaz)."
      },
      {
        "num": 63,
        "text": "Agarra-se excessivamente aos outros, (por ex. dá um aperto de mão demasiado longo e apertado), ou pelo contrário o aperto de mão é demasiado fugaz ou apenas com a ponta dos dedos."
      },
      {
        "num": 64,
        "text": "Reconhece cheiros que são dificilmente identificados por aqueles que estão à sua volta."
      },
      {
        "num": 65,
        "text": "Fica excessivamente incomodado(a) com certos sons (por ex., aspirador, berbequim, foguetes)."
      },
      {
        "num": 66,
        "text": "Cheira os objetos."
      },
      {
        "num": 67,
        "text": "Prefere usar roupas feitas apenas de certos materiais (por ex., algodão)."
      },
      {
        "num": 68,
        "text": "Não consegue trabalhar com barulho de fundo."
      },
      {
        "num": 69,
        "text": "Evita mexer em certos objetos, superfícies, texturas (por ex., plasticina, barro, areia)."
      },
      {
        "num": 70,
        "text": "Tem uma alimentação limitada, consistindo nas mesmas comidas cozinhadas e apresentadas da mesma maneira."
      },
      {
        "num": 71,
        "text": "Tem uma reação invulgar e excessiva à luz."
      },
      {
        "num": 72,
        "text": "Fica facilmente “enojado(a)” (por ex., se alguém bebe pelo seu copo)."
      },
      {
        "num": 73,
        "text": "Não suporta roupa molhada."
      },
      {
        "num": 74,
        "text": "Parece ter uma sensibilidade reduzida à dor ou temperatura."
      },
      {
        "num": 75,
        "text": "Tem um comportamento alimentar peculiar (por ex., não mistura os alimentos ou só come a comida triturada)."
      }
    ]
  }
] as const

export const INVENTARIO_ASPERGER_COMPLEMENTARY = [
  {
    "title": "Desenvolvimento da Linguagem",
    "items": [
      {
        "id": "comp_idade_fala",
        "text": "Com que idade começou a falar? (meses)",
        "inputType": "text"
      },
      {
        "id": "comp_lang_01",
        "text": "Dizia palavras por volta dos 2 anos."
      },
      {
        "id": "comp_lang_02",
        "text": "Dizia frases para comunicar por volta dos 3 anos."
      },
      {
        "id": "comp_lang_03",
        "text": "Compreende o vocabulário de acordo com o que é esperado para a sua idade."
      },
      {
        "id": "comp_lang_04",
        "text": "Tem um vocabulário apropriado para a sua idade."
      },
      {
        "id": "comp_lang_05",
        "text": "Parece ouvir bem."
      }
    ]
  },
  {
    "title": "Desenvolvimento Motor",
    "items": [
      {
        "id": "comp_idade_andar",
        "text": "Com que idade começou a andar? (meses)",
        "inputType": "text"
      }
    ]
  },
  {
    "title": "Competências de Cuidados Pessoais",
    "items": [
      {
        "id": "comp_cuidados_01",
        "text": "Consegue vestir-se de acordo com o esperado para a sua idade."
      },
      {
        "id": "comp_cuidados_02",
        "text": "Consegue alimentar-se de acordo com o que é esperado para a sua idade."
      },
      {
        "id": "comp_cuidados_03",
        "text": "Tem cuidados de higiene apropriados para a sua idade (i.e., lavar os dentes, pentear-se, tomar banho, lavar o cabelo)."
      }
    ]
  },
  {
    "title": "Comportamento Adaptativo",
    "items": [
      {
        "id": "comp_adapt_01",
        "text": "Ocupa os seus tempos livres com as atividades habituais das pessoas da sua idade e do mesmo sexo."
      },
      {
        "id": "comp_adapt_02",
        "text": "Usa os recursos da comunidade de forma tão independente como as pessoas da sua idade e do mesmo sexo (por ex., correios, fazer compras)."
      },
      {
        "id": "comp_adapt_03",
        "text": "Sabe o seu número de telefone e morada."
      },
      {
        "id": "comp_adapt_04",
        "text": "Assume a responsabilidade das suas tarefas."
      }
    ]
  },
  {
    "title": "Competências Cognitivas",
    "items": [
      {
        "id": "comp_cogn_01",
        "text": "As suas capacidades de aprendizagem situam-se na média ou acima da média das pessoas da sua idade."
      },
      {
        "id": "comp_cogn_02",
        "text": "Demonstra conhecimentos ou competências superiores numa área específica (relacionados com os seus interesses)."
      },
      {
        "id": "comp_cogn_03",
        "text": "Tem uma memória a longo-prazo excecional, relativamente a acontecimentos ou factos (por ex. recorda-se da matrícula do antigo carro dos vizinhos ou de situações que aconteceram há anos)."
      },
      {
        "id": "comp_cogn_04",
        "text": "Mostra um interesse intenso, obsessivo em determinadas áreas intelectuais (por ex., dinossauros, máquinas, geografia)."
      },
      {
        "id": "comp_cogn_05",
        "text": "Aprende melhor quando a informação é apresentada visualmente (imagens)."
      },
      {
        "id": "comp_cogn_06",
        "text": "Aprende melhor quando a informação é apresentada oralmente."
      },
      {
        "id": "comp_cogn_07",
        "text": "As suas capacidades intelectuais situam-se na média ou acima da média das pessoas da sua idade."
      },
      {
        "id": "comp_cogn_08",
        "text": "É desorganizado."
      },
      {
        "id": "comp_cogn_09",
        "text": "Tem boa memória visual (i.e., memoriza facilmente caminhos, imagens)."
      },
      {
        "id": "comp_cogn_10",
        "text": "Lê ou vê programas de televisão para obter informação acerca de certos temas e não como forma de entretenimento."
      },
      {
        "id": "comp_cogn_11",
        "text": "É surpreendentemente bom em algumas áreas."
      },
      {
        "id": "comp_cogn_12",
        "text": "Dá a impressão de que compreende mais do que aquilo que realmente compreende."
      },
      {
        "id": "comp_cogn_13",
        "text": "Tem boa memória auditiva (i.e., memoriza facilmente o que ouve)."
      },
      {
        "id": "comp_cogn_14",
        "text": "Tem dificuldade em pensar em várias alternativas para resolver um problema."
      },
      {
        "id": "comp_cogn_15",
        "text": "Distraí-se facilmente (por ex., com pequenos ruídos, objetos, etc.)."
      },
      {
        "id": "comp_cogn_16",
        "text": "Está frequentemente concentrado «no seu mundo», sem dar atenção ao que está à sua volta."
      }
    ]
  },
  {
    "title": "Curiosidade pelo ambiente",
    "items": [
      {
        "id": "comp_cur_01",
        "text": "Mostra-se curioso em relação a vários aspetos do ambiente (i.e., faz perguntas do tipo «porquê», «quando», «como», «onde» para saber porque é que as coisas são assim)."
      },
      {
        "id": "comp_cur_02",
        "text": "Lê/vê para obter informação."
      },
      {
        "id": "comp_cur_03",
        "text": "Lê/vê para ter prazer."
      },
      {
        "id": "comp_cur_04",
        "text": "Tenta saber como as coisas funcionam (por ex., máquinas)."
      }
    ]
  }
] as const

export const INVENTARIO_ASPERGER_IDENTIFICATION = [
  {
    "id": "id_nome",
    "text": "Nome",
    "inputType": "text"
  },
  {
    "id": "id_sexo",
    "text": "Sexo",
    "inputType": "choice",
    "options": [
      "Feminino",
      "Masculino"
    ]
  },
  {
    "id": "id_data_avaliacao",
    "text": "Data da avaliação",
    "inputType": "text"
  },
  {
    "id": "id_escola",
    "text": "Escola",
    "inputType": "text"
  },
  {
    "id": "id_data_nascimento",
    "text": "Data de nascimento",
    "inputType": "text"
  },
  {
    "id": "id_examinador",
    "text": "Examinador",
    "inputType": "text"
  },
  {
    "id": "id_idade_cronologica",
    "text": "Idade cronológica",
    "inputType": "text"
  },
  {
    "id": "id_preenchido_por",
    "text": "Preenchido por",
    "inputType": "text"
  }
] as const

export const INVENTARIO_ASPERGER_SUBSCALES = {"interacao_social": [1, 21], "comunicacao": [22, 43], "padroes_comportamento": [44, 54], "motora": [55, 60], "sensibilidade_sensorial": [61, 75]} as const

const PRESENTATION_ITEMS: QuestionnaireItem[] = [
  {
    "id": "id_nome",
    "text": "Nome",
    "inputType": "text"
  },
  {
    "id": "id_sexo",
    "text": "Sexo",
    "options": [
      "Feminino",
      "Masculino"
    ]
  },
  {
    "id": "id_data_avaliacao",
    "text": "Data da avaliação",
    "inputType": "text"
  },
  {
    "id": "id_escola",
    "text": "Escola",
    "inputType": "text"
  },
  {
    "id": "id_data_nascimento",
    "text": "Data de nascimento",
    "inputType": "text"
  },
  {
    "id": "id_examinador",
    "text": "Examinador",
    "inputType": "text"
  },
  {
    "id": "id_idade_cronologica",
    "text": "Idade cronológica",
    "inputType": "text"
  },
  {
    "id": "id_preenchido_por",
    "text": "Preenchido por",
    "inputType": "text"
  },
  {
    "id": "item_01",
    "text": "1. Tem dificuldade no relacionamento com os outros, não justificada por desatenção ou falta de experiência."
  },
  {
    "id": "item_02",
    "text": "2. Tem poucos ou nenhuns amigos, mas manifesta desejo de os ter."
  },
  {
    "id": "item_03",
    "text": "3. Prefere estar na companhia dos mais velhos ou mais novos, em vez de estar com as pessoas da sua idade."
  },
  {
    "id": "item_04",
    "text": "4. Demonstra pouco ou nenhum interesse pelos colegas."
  },
  {
    "id": "item_05",
    "text": "5. Tem pouca ou nenhuma capacidade para fazer e/ou manter amizades."
  },
  {
    "id": "item_06",
    "text": "6. Tem dificuldade em cooperar num grupo (por ex., grupo de trabalho ou equipa)."
  },
  {
    "id": "item_07",
    "text": "7. Parece não compreender as regras ou códigos de conduta social (por ex. faz comentários/perguntas inconvenientes sem perceber que a pessoa pode ficar ofendida/embaraçada)."
  },
  {
    "id": "item_08",
    "text": "8. Tem dificuldade em brincar/jogar com os colegas (por ex., não tem consciência ou não cumpre as regras dos jogos em grupo)."
  },
  {
    "id": "item_09",
    "text": "9. Isola-se quando tem possibilidade de interagir com os colegas (por ex., no recreio brinca sozinho(a) ou procura um lugar calmo)."
  },
  {
    "id": "item_10",
    "text": "10. Mostra pouco interesse no que as outras pessoas dizem ou acham interessante."
  },
  {
    "id": "item_11",
    "text": "11. É indiferente à pressão dos colegas (por ex. não segue as modas de roupa ou brincadeiras)."
  },
  {
    "id": "item_12",
    "text": "12. Tem dificuldade em avaliar situações sociais (por ex. não adequa o seu comportamento ao sítio onde está, como falar alto durante uma missa)."
  },
  {
    "id": "item_13",
    "text": "13. Tem falta de empatia (dificuldade em compreender os sentimentos dos outros ou “pôr-se na pele do outro”)."
  },
  {
    "id": "item_14",
    "text": "14. Demonstra pouca subtileza na expressão das emoções (por ex., demonstra grande tristeza ou afeto desproporcionado relativamente à situação ou pessoa)."
  },
  {
    "id": "item_15",
    "text": "15. Tem dificuldade em lidar com emoções negativas como a frustração, tristeza ou raiva (por ex., é agressivo(a) quando perde um jogo ou é contrariado(a))."
  },
  {
    "id": "item_16",
    "text": "16. Não prevê as consequências das suas ações numa situação social (por ex., não prevê o resultado de passar à frente de alguém numa fila)."
  },
  {
    "id": "item_17",
    "text": "17. É frequentemente alvo de “gozo” por parte dos colegas."
  },
  {
    "id": "item_18",
    "text": "18. Tem um comportamento social indiferenciado (por ex., fala com estranhos acerca da sua vida pessoal, trata as pessoas sem atender à idade ou estatuto social)."
  },
  {
    "id": "item_19",
    "text": "19. Parece insensível ou não se apercebe das necessidades dos outros."
  },
  {
    "id": "item_20",
    "text": "20. É ingénuo, crédulo."
  },
  {
    "id": "item_21",
    "text": "21. Tenta impor aos outros interesses ou rotinas."
  },
  {
    "id": "item_22",
    "text": "22. Fala como um adulto, de um modo formal ou com uma linguagem demasiado sofisticada (usa palavras \"caras\")."
  },
  {
    "id": "item_23",
    "text": "23. Diz palavras ou frases repetitivamente."
  },
  {
    "id": "item_24",
    "text": "24. Apresenta um vocabulário inesperadamente rico para a sua idade."
  },
  {
    "id": "item_25",
    "text": "25. Não respeita o espaço físico interpessoal (por ex., aproxima-se demasiado das outras pessoas)."
  },
  {
    "id": "item_26",
    "text": "26. Tem dificuldade em iniciar e manter uma conversa."
  },
  {
    "id": "item_27",
    "text": "27. Tem tendência para ter um discurso egocêntrico (i.e., falar para as pessoas, tipo monólogo, geralmente acerca dos seus interesses, ao contrário de estabelecer um diálogo)."
  },
  {
    "id": "item_28",
    "text": "28. Tem dificuldade em compreender piadas ou anedotas."
  },
  {
    "id": "item_29",
    "text": "29. Tem dificuldade em relatar acontecimentos (por ex., situações passadas ou filmes) de forma sequencial e coerente (por ex. exclui partes importantes)."
  },
  {
    "id": "item_30",
    "text": "30. Interpreta literalmente o que lhe dizem (i.e. tem dificuldade em perceber a linguagem metafórica ou segundos sentidos, como por exemplo, provérbios)."
  },
  {
    "id": "item_31",
    "text": "31. A sua voz tem características peculiares (por ex., voz \"esganiçada\" ou tom monótono)."
  },
  {
    "id": "item_32",
    "text": "32. Exibe pouca variedade de expressões faciais."
  },
  {
    "id": "item_33",
    "text": "33. Tem dificuldade em interpretar os sinais não-verbais durante uma conversa (por ex. a expressão facial ou o tom de voz do interlocutor)."
  },
  {
    "id": "item_34",
    "text": "34. Tem dificuldade em perceber quando está a ser gozado(a) ou ridicularizado(a)."
  },
  {
    "id": "item_35",
    "text": "35. Usa poucos gestos."
  },
  {
    "id": "item_36",
    "text": "36. Fala alto demais."
  },
  {
    "id": "item_37",
    "text": "37. Quando não compreende, não pede para lhe explicarem, mas fala/responde com um tema que lhe é conhecido ou familiar."
  },
  {
    "id": "item_38",
    "text": "38. Exibe expressões faciais desadequadas."
  },
  {
    "id": "item_39",
    "text": "39. Não muda a voz (tom, volume, ritmo) para indicar emoções e/ou realçar palavras-chave."
  },
  {
    "id": "item_40",
    "text": "40. Tem dificuldade em compreender a gíria (calão)."
  },
  {
    "id": "item_41",
    "text": "41. Fala de si próprio(a) na 3ª pessoa do singular (i.e., diz o \"João\" em vez de eu)."
  },
  {
    "id": "item_42",
    "text": "42. Repete despropositadamente as palavras ditas por outra pessoa (como se fosse um papagaio)."
  },
  {
    "id": "item_43",
    "text": "43. Evita ou desvia o olhar."
  },
  {
    "id": "item_44",
    "text": "44. Tem um interesse intenso ou obsessivo num tema ou atividade restrito(a)."
  },
  {
    "id": "item_45",
    "text": "45. Tem grande necessidade de que o(a) tranquilizem quando ocorrem mudanças ou algo corre mal."
  },
  {
    "id": "item_46",
    "text": "46. Apresenta comportamentos estranhos, bizarros ou excêntricos."
  },
  {
    "id": "item_47",
    "text": "47. Estabelece hábitos ou rituais que tem necessidade de cumprir (por ex., bater duas vezes no prato antes de comer, vestir-se sempre pela mesma ordem)."
  },
  {
    "id": "item_48",
    "text": "48. Tem comportamentos desadequados relacionados com os seus interesses obsessivos ou favoritos (por ex., desenhar máquinas, em vez de trabalhar na aula)."
  },
  {
    "id": "item_49",
    "text": "49. Reage de forma negativa (por ex., fica ansioso) às mudanças na sua rotina."
  },
  {
    "id": "item_50",
    "text": "50. Sente-se confundido(a) ou desorientado(a) no meio de muitas pessoas."
  },
  {
    "id": "item_51",
    "text": "51. Tem movimentos repetitivos (por ex. abanar as mãos como “bater asas”, estalar os dedos)."
  },
  {
    "id": "item_52",
    "text": "52. Tem uma preocupação excessiva com temas específicos ou objetos que é anormal em intensidade ou na atenção despendida (por ex., fala repetidamente sobre a notícia de uma catástrofe)."
  },
  {
    "id": "item_53",
    "text": "53. Fica nervoso ou em pânico quando ocorrem situações imprevistas."
  },
  {
    "id": "item_54",
    "text": "54. Tem comportamentos ritualizados e/ou repetitivos (por ex., correr à volta de uma mesa sem sentido, fazer bolinhas de papel, brincar sempre com os mesmos objetos)."
  },
  {
    "id": "item_55",
    "text": "55. Tem dificuldade em tarefas que exigem competências motoras finas (por ex., abotoar, atar atacadores)."
  },
  {
    "id": "item_56",
    "text": "56. Apresenta uma letra difícil de perceber (má caligrafia)."
  },
  {
    "id": "item_57",
    "text": "57. Parece desajeitado(a) e/ou descoordenado(a) nos seus movimentos."
  },
  {
    "id": "item_58",
    "text": "58. Tem dificuldade em atividades que exigem agilidade física (por ex., ginástica, futebol)."
  },
  {
    "id": "item_59",
    "text": "59. Tem dificuldade em escrever ou escreve devagar."
  },
  {
    "id": "item_60",
    "text": "60. Apresenta movimentos invulgares ou descoordenados quando anda ou corre."
  },
  {
    "id": "item_61",
    "text": "61. Reage negativamente (por ex., chora, afasta-se, tapa os ouvidos) ao som alto (ou ruidoso), súbito ou estridente."
  },
  {
    "id": "item_62",
    "text": "62. Fica rígido(a) ou repele quando é agarrado(a) (por ex., dá um aperto de mão fugaz)."
  },
  {
    "id": "item_63",
    "text": "63. Agarra-se excessivamente aos outros, (por ex. dá um aperto de mão demasiado longo e apertado), ou pelo contrário o aperto de mão é demasiado fugaz ou apenas com a ponta dos dedos."
  },
  {
    "id": "item_64",
    "text": "64. Reconhece cheiros que são dificilmente identificados por aqueles que estão à sua volta."
  },
  {
    "id": "item_65",
    "text": "65. Fica excessivamente incomodado(a) com certos sons (por ex., aspirador, berbequim, foguetes)."
  },
  {
    "id": "item_66",
    "text": "66. Cheira os objetos."
  },
  {
    "id": "item_67",
    "text": "67. Prefere usar roupas feitas apenas de certos materiais (por ex., algodão)."
  },
  {
    "id": "item_68",
    "text": "68. Não consegue trabalhar com barulho de fundo."
  },
  {
    "id": "item_69",
    "text": "69. Evita mexer em certos objetos, superfícies, texturas (por ex., plasticina, barro, areia)."
  },
  {
    "id": "item_70",
    "text": "70. Tem uma alimentação limitada, consistindo nas mesmas comidas cozinhadas e apresentadas da mesma maneira."
  },
  {
    "id": "item_71",
    "text": "71. Tem uma reação invulgar e excessiva à luz."
  },
  {
    "id": "item_72",
    "text": "72. Fica facilmente “enojado(a)” (por ex., se alguém bebe pelo seu copo)."
  },
  {
    "id": "item_73",
    "text": "73. Não suporta roupa molhada."
  },
  {
    "id": "item_74",
    "text": "74. Parece ter uma sensibilidade reduzida à dor ou temperatura."
  },
  {
    "id": "item_75",
    "text": "75. Tem um comportamento alimentar peculiar (por ex., não mistura os alimentos ou só come a comida triturada)."
  },
  {
    "id": "comp_idade_fala",
    "text": "Com que idade começou a falar? (meses)",
    "inputType": "text"
  },
  {
    "id": "comp_lang_01",
    "text": "Dizia palavras por volta dos 2 anos."
  },
  {
    "id": "comp_lang_02",
    "text": "Dizia frases para comunicar por volta dos 3 anos."
  },
  {
    "id": "comp_lang_03",
    "text": "Compreende o vocabulário de acordo com o que é esperado para a sua idade."
  },
  {
    "id": "comp_lang_04",
    "text": "Tem um vocabulário apropriado para a sua idade."
  },
  {
    "id": "comp_lang_05",
    "text": "Parece ouvir bem."
  },
  {
    "id": "comp_idade_andar",
    "text": "Com que idade começou a andar? (meses)",
    "inputType": "text"
  },
  {
    "id": "comp_cuidados_01",
    "text": "Consegue vestir-se de acordo com o esperado para a sua idade."
  },
  {
    "id": "comp_cuidados_02",
    "text": "Consegue alimentar-se de acordo com o que é esperado para a sua idade."
  },
  {
    "id": "comp_cuidados_03",
    "text": "Tem cuidados de higiene apropriados para a sua idade (i.e., lavar os dentes, pentear-se, tomar banho, lavar o cabelo)."
  },
  {
    "id": "comp_adapt_01",
    "text": "Ocupa os seus tempos livres com as atividades habituais das pessoas da sua idade e do mesmo sexo."
  },
  {
    "id": "comp_adapt_02",
    "text": "Usa os recursos da comunidade de forma tão independente como as pessoas da sua idade e do mesmo sexo (por ex., correios, fazer compras)."
  },
  {
    "id": "comp_adapt_03",
    "text": "Sabe o seu número de telefone e morada."
  },
  {
    "id": "comp_adapt_04",
    "text": "Assume a responsabilidade das suas tarefas."
  },
  {
    "id": "comp_cogn_01",
    "text": "As suas capacidades de aprendizagem situam-se na média ou acima da média das pessoas da sua idade."
  },
  {
    "id": "comp_cogn_02",
    "text": "Demonstra conhecimentos ou competências superiores numa área específica (relacionados com os seus interesses)."
  },
  {
    "id": "comp_cogn_03",
    "text": "Tem uma memória a longo-prazo excecional, relativamente a acontecimentos ou factos (por ex. recorda-se da matrícula do antigo carro dos vizinhos ou de situações que aconteceram há anos)."
  },
  {
    "id": "comp_cogn_04",
    "text": "Mostra um interesse intenso, obsessivo em determinadas áreas intelectuais (por ex., dinossauros, máquinas, geografia)."
  },
  {
    "id": "comp_cogn_05",
    "text": "Aprende melhor quando a informação é apresentada visualmente (imagens)."
  },
  {
    "id": "comp_cogn_06",
    "text": "Aprende melhor quando a informação é apresentada oralmente."
  },
  {
    "id": "comp_cogn_07",
    "text": "As suas capacidades intelectuais situam-se na média ou acima da média das pessoas da sua idade."
  },
  {
    "id": "comp_cogn_08",
    "text": "É desorganizado."
  },
  {
    "id": "comp_cogn_09",
    "text": "Tem boa memória visual (i.e., memoriza facilmente caminhos, imagens)."
  },
  {
    "id": "comp_cogn_10",
    "text": "Lê ou vê programas de televisão para obter informação acerca de certos temas e não como forma de entretenimento."
  },
  {
    "id": "comp_cogn_11",
    "text": "É surpreendentemente bom em algumas áreas."
  },
  {
    "id": "comp_cogn_12",
    "text": "Dá a impressão de que compreende mais do que aquilo que realmente compreende."
  },
  {
    "id": "comp_cogn_13",
    "text": "Tem boa memória auditiva (i.e., memoriza facilmente o que ouve)."
  },
  {
    "id": "comp_cogn_14",
    "text": "Tem dificuldade em pensar em várias alternativas para resolver um problema."
  },
  {
    "id": "comp_cogn_15",
    "text": "Distraí-se facilmente (por ex., com pequenos ruídos, objetos, etc.)."
  },
  {
    "id": "comp_cogn_16",
    "text": "Está frequentemente concentrado «no seu mundo», sem dar atenção ao que está à sua volta."
  },
  {
    "id": "comp_cur_01",
    "text": "Mostra-se curioso em relação a vários aspetos do ambiente (i.e., faz perguntas do tipo «porquê», «quando», «como», «onde» para saber porque é que as coisas são assim)."
  },
  {
    "id": "comp_cur_02",
    "text": "Lê/vê para obter informação."
  },
  {
    "id": "comp_cur_03",
    "text": "Lê/vê para ter prazer."
  },
  {
    "id": "comp_cur_04",
    "text": "Tenta saber como as coisas funcionam (por ex., máquinas)."
  }
]

export function inventarioAspergerItemId(num: number): string {
  return `item_${String(num).padStart(2, '0')}`
}

export function buildInventarioAspergerSchema() {
  const shape: Record<string, z.ZodTypeAny> = {}
  for (const field of INVENTARIO_ASPERGER_IDENTIFICATION) {
    if (field.inputType === 'choice') {
      shape[field.id] = z.union([z.literal(0), z.literal(1)]).optional()
    } else {
      shape[field.id] = z.string().optional()
    }
  }
  for (const section of INVENTARIO_ASPERGER_LIKERT_SECTIONS) {
    for (const item of section.items) {
      shape[inventarioAspergerItemId(item.num)] = z
        .union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)])
        .optional()
    }
  }
  for (const section of INVENTARIO_ASPERGER_COMPLEMENTARY) {
    for (const item of section.items) {
      if ('inputType' in item && item.inputType === 'text') {
        shape[item.id] = z.string().optional()
      } else {
        shape[item.id] = z.union([z.literal(0), z.literal(1)]).optional()
      }
    }
  }
  shape[QUESTIONNAIRE_NOTES_FIELD] = z.string().optional()
  return z.object(shape).strict()
}

export const inventarioAspergerQuestionnaire = defineQuestionnaire({
  id: 'inventario_asperger',
  title: 'Inventário de Síndrome de Asperger',
  description:
    'Inventário clínico de comportamentos e características associadas à síndrome de Asperger (75 itens, escala 0–3).',
  instructions:
    'Avalie cada item de 0 a 3 conforme as instruções do inventário. Para características de temperamento (itens sombreados no original), use a mesma escala 0–3. Responda também às questões complementares.',
  respondent: 'Pais, professores ou outros informadores',
  responseType: 'likert4',
  responseLabels: [...INVENTARIO_ASPERGER_LIKERT_LABELS],
  items: PRESENTATION_ITEMS,
  scoring: { type: 'inventario_asperger' },
  meta: {
    identification: INVENTARIO_ASPERGER_IDENTIFICATION,
    likertSections: INVENTARIO_ASPERGER_LIKERT_SECTIONS,
    complementary: INVENTARIO_ASPERGER_COMPLEMENTARY,
    likertLabels: INVENTARIO_ASPERGER_LIKERT_LABELS,
  },
})
