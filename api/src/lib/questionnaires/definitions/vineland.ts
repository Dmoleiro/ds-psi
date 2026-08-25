// Auto-generated from scripts/vineland_data.json — do not edit by hand.
import { z } from 'zod'
import { defineQuestionnaire } from '../helpers.js'
import { QUESTIONNAIRE_NOTES_FIELD } from '../types.js'
import type { QuestionnaireItem } from '../types.js'

export const VINELAND_RESPONSE_LABELS = [
  "2 — Sim, normalmente",
  "1 — Algumas vezes, ou parcialmente",
  "0 — Não, nunca",
  "N — Não teve oportunidade",
  "D — Desconhecido"
] as const

export const VINELAND_IDENTIFICATION = [
  { "id": "subj_nome", "text": "Nome", "inputType": "text", "section": "sujeito", "wide": false },
  { "id": "subj_sexo", "text": "Sexo", "inputType": "text", "section": "sujeito", "wide": false },
  { "id": "subj_morada", "text": "Morada", "inputType": "text", "section": "sujeito", "wide": false },
  { "id": "subj_telefone", "text": "Telefone", "inputType": "text", "section": "sujeito", "wide": false },
  { "id": "subj_ano_escolar", "text": "Ano Escolar", "inputType": "text", "section": "sujeito", "wide": false },
  { "id": "subj_estab", "text": "Establ. Ensino", "inputType": "text", "section": "sujeito", "wide": false },
  { "id": "subj_diagnostico", "text": "Diagnóstico", "inputType": "text", "section": "sujeito", "wide": false },
  { "id": "subj_raca", "text": "Raça", "inputType": "text", "section": "sujeito", "wide": false },
  { "id": "subj_nivel_social", "text": "Nível social", "inputType": "text", "section": "sujeito", "wide": false },
  { "id": "subj_outras", "text": "Outras informações", "inputType": "text", "section": "sujeito", "wide": true },
  { "id": "int_nome", "text": "Nome", "inputType": "text", "section": "entrevistado", "wide": false },
  { "id": "int_sexo", "text": "Sexo", "inputType": "text", "section": "entrevistado", "wide": false },
  { "id": "int_relacao", "text": "Relação com o sujeito", "inputType": "text", "section": "entrevistado", "wide": false },
  { "id": "ent_nome", "text": "Nome", "inputType": "text", "section": "entrevistador", "wide": false },
  { "id": "ent_sexo", "text": "Sexo", "inputType": "text", "section": "entrevistador", "wide": false },
  { "id": "ent_posicao", "text": "Posição", "inputType": "text", "section": "entrevistador", "wide": false },
  { "id": "data_entrevista", "text": "Data entrevista", "inputType": "text", "section": "idade", "wide": false },
  { "id": "data_nascimento", "text": "Data nascimento", "inputType": "text", "section": "idade", "wide": false },
  { "id": "idade_cronologica", "text": "Idade cronológica", "inputType": "text", "section": "idade", "wide": false },
  { "id": "idade_inicio_itens", "text": "Idade usada para iniciar itens", "inputType": "text", "section": "idade", "wide": false },
  { "id": "motivo_entrevista", "text": "Motivo da entrevista", "inputType": "text", "section": "idade", "wide": false },
  { "id": "test_inteligencia", "text": "Inteligência", "inputType": "text", "section": "outros_testes", "wide": false },
  { "id": "test_realizacao", "text": "Realização", "inputType": "text", "section": "outros_testes", "wide": false },
  { "id": "test_comport_adapt", "text": "Comportamento adaptativo", "inputType": "text", "section": "outros_testes", "wide": false },
  { "id": "test_outros", "text": "Outros", "inputType": "text", "section": "outros_testes", "wide": true }
] as const

export const VINELAND_INTERVIEW_NOTES = [
  { "id": "notes_funcional", "text": "Estimativa do nível funcional do indivíduo por parte do entrevistado", "rows": 4 },
  { "id": "notes_lingua", "text": "Língua usada na entrevista", "rows": 2 },
  { "id": "notes_caracteristicas", "text": "Características especiais do indivíduo", "rows": 4 },
  { "id": "notes_relacao", "text": "Estimativa do relacionamento estabelecido com o entrevistado", "rows": 3 },
  { "id": "notes_rigor", "text": "Estimativa do rigor do entrevistado", "rows": 3 },
  { "id": "notes_global", "text": "Observação global", "rows": 5 }
] as const

export const VINELAND_AREAS = [
  {
    "id": "comunicacao",
    "title": "Área da Comunicação",
    "prefix": "com",
    "subdomains": [
      { "id": "receptiva", "label": "Receptiva", "max": 26 },
      { "id": "expressiva", "label": "Expressiva", "max": 62 },
      { "id": "escrita", "label": "Escrita", "max": 46 }
    ],
    "items": [
      { "num": 1, "id": "com_01", "text": "Volta os olhos e a cabeça em direção ao som.", "subdomain": "receptiva", "age": "<1", "rules": [] },
      { "num": 2, "id": "com_02", "text": "Ouve, pelo menos momentaneamente, quando o educador fala.", "subdomain": "receptiva", "age": "<1", "rules": [] },
      { "num": 3, "id": "com_03", "text": "Sorri como resposta à presença do educador.", "subdomain": "receptiva", "age": "<1", "rules": [] },
      { "num": 4, "id": "com_04", "text": "Sorri como resposta à presença de uma pessoa familiar, para além do educador.", "subdomain": "receptiva", "age": "<1", "rules": [] },
      { "num": 5, "id": "com_05", "text": "Estende os braços quando o educador diz: \"Vem cá.\" Ou \"Upa.\"", "subdomain": "receptiva", "age": "<1", "rules": [] },
      { "num": 6, "id": "com_06", "text": "Demonstra compreender a palavra \"não\".", "subdomain": "receptiva", "age": "<1", "rules": [] },
      { "num": 7, "id": "com_07", "text": "Imita sons do adulto, imediatamente depois de os ouvir.", "subdomain": "expressiva", "age": "1", "rules": [] },
      { "num": 8, "id": "com_08", "text": "Demonstra compreender o significado de pelo menos 10 palavras.", "subdomain": "receptiva", "age": "1", "rules": [] },
      { "num": 9, "id": "com_09", "text": "Gesticula apropriadamente para indicar \"Sim.\", \"Não.\", \"Eu quero.\"", "subdomain": "expressiva", "age": "1", "rules": [] },
      { "num": 10, "id": "com_10", "text": "Ouve atentamente as instruções.", "subdomain": "receptiva", "age": "1", "rules": [] },
      { "num": 11, "id": "com_11", "text": "Demonstra compreender o significado de \"Sim.\" e \"Está bem.\"", "subdomain": "receptiva", "age": "1", "rules": [] },
      { "num": 12, "id": "com_12", "text": "Segue instruções que requerem uma acção e um objecto.", "subdomain": "receptiva", "age": "2", "rules": [] },
      { "num": 13, "id": "com_13", "text": "Aponta correctamente para, pelo menos, uma parte principal do corpo.", "subdomain": "receptiva", "age": "2", "rules": [] },
      { "num": 14, "id": "com_14", "text": "Utiliza o 1º nome, ou diminutivo dos irmãos, amigos ou colegas, ou diz os seus nomes quando se lhos perguntam.", "subdomain": "expressiva", "age": "2", "rules": [] },
      { "num": 15, "id": "com_15", "text": "Utiliza frases com verbo e nome, ou com dois nomes.", "subdomain": "expressiva", "age": "2", "rules": [] },
      { "num": 16, "id": "com_16", "text": "Nomeia, pelo menos, 20 objectos, sem se lhe perguntar.", "subdomain": "expressiva", "age": "2", "rules": ["no_score_1"] },
      { "num": 17, "id": "com_17", "text": "Ouve uma história, pelo menos durante 5 minutos.", "subdomain": "receptiva", "age": "2", "rules": [] },
      { "num": 18, "id": "com_18", "text": "Indica preferência, quando se lhe proporciona escolha.", "subdomain": "expressiva", "age": "2", "rules": [] },
      { "num": 19, "id": "com_19", "text": "Diz, pelo menos, 50 palavras reconhecíveis.", "subdomain": "expressiva", "age": "2", "rules": ["no_score_1"] },
      { "num": 20, "id": "com_20", "text": "Relata experiências espontaneamente e em termos simples.", "subdomain": "expressiva", "age": "2", "rules": [] },
      { "num": 21, "id": "com_21", "text": "Transmite um recado simples.", "subdomain": "expressiva", "age": "2", "rules": [] },
      { "num": 22, "id": "com_22", "text": "Utiliza frases com 4, ou mais, palavras.", "subdomain": "expressiva", "age": "2", "rules": [] },
      { "num": 23, "id": "com_23", "text": "Aponta, a pedido, com precisão para todas as partes do corpo.", "subdomain": "receptiva", "age": "2", "rules": ["no_score_1"] },
      { "num": 24, "id": "com_24", "text": "Diz, pelo menos, 100 palavras reconhecíveis.", "subdomain": "expressiva", "age": "2", "rules": ["no_score_1"] },
      { "num": 25, "id": "com_25", "text": "Fala com frases completas.", "subdomain": "expressiva", "age": "3,4", "rules": [] },
      { "num": 26, "id": "com_26", "text": "Utiliza \"um(a)\" e \"o/a\" nas frases.", "subdomain": "expressiva", "age": "3,4", "rules": [] },
      { "num": 27, "id": "com_27", "text": "Segue instruções na forma \"Se ... então\".", "subdomain": "receptiva", "age": "3,4", "rules": [] },
      { "num": 28, "id": "com_28", "text": "Diz o 1º e o último nome, quando se lhe pergunta.", "subdomain": "expressiva", "age": "3,4", "rules": [] },
      { "num": 29, "id": "com_29", "text": "Faz perguntas com: \"O que é, Onde, Quem, Porque, Quando\".", "subdomain": "expressiva", "age": "3,4", "rules": ["no_score_1"] },
      { "num": 30, "id": "com_30", "text": "Diz qual o maior de dois objectos não presentes.", "subdomain": "expressiva", "age": "3,4", "rules": [] },
      { "num": 31, "id": "com_31", "text": "Relata experiências com detalhe, quando se lhe pergunta.", "subdomain": "expressiva", "age": "3,4", "rules": [] },
      { "num": 32, "id": "com_32", "text": "Utiliza frases com \"atrás\" ou \"entre\", como preposição.", "subdomain": "expressiva", "age": "3,4", "rules": [] },
      { "num": 33, "id": "com_33", "text": "Utiliza frases com \"à volta\", como preposição, numa frase.", "subdomain": "expressiva", "age": "3,4", "rules": [] },
      { "num": 34, "id": "com_34", "text": "Utiliza frases com \"mas\" ou \"ou\".", "subdomain": "expressiva", "age": undefined, "rules": [] },
      { "num": 35, "id": "com_35", "text": "Articula claramente, sem substituir sons.", "subdomain": "expressiva", "age": undefined, "rules": [] },
      { "num": 36, "id": "com_36", "text": "Conta histórias populares, contos, lengalengas ou novelas de TV.", "subdomain": "expressiva", "age": undefined, "rules": [] },
      { "num": 37, "id": "com_37", "text": "Diz todas as letras do alfabeto de memória.", "subdomain": "escrita", "age": "5", "rules": [] },
      { "num": 38, "id": "com_38", "text": "Lê, pelo menos 3 sinais comuns.", "subdomain": "escrita", "age": undefined, "rules": [] },
      { "num": 39, "id": "com_39", "text": "Diz a data dos anos (dia e mês), quando questionada.", "subdomain": "expressiva", "age": undefined, "rules": [] },
      { "num": 40, "id": "com_40", "text": "Utiliza plurais irregulares.", "subdomain": "expressiva", "age": undefined, "rules": [] },
      { "num": 41, "id": "com_41", "text": "Imprime ou escreve o nome (primeiro e último).", "subdomain": "escrita", "age": "6", "rules": [] },
      { "num": 42, "id": "com_42", "text": "Diz o número de telefone, quando questionada.", "subdomain": "expressiva", "age": undefined, "rules": ["allow_n"] },
      { "num": 43, "id": "com_43", "text": "Diz a morada completa, quando questionada.", "subdomain": "expressiva", "age": undefined, "rules": [] },
      { "num": 44, "id": "com_44", "text": "Lê, pelo menos 10 palavras, silenciosamente ou em voz alta.", "subdomain": "escrita", "age": undefined, "rules": [] },
      { "num": 45, "id": "com_45", "text": "Imprime ou escreve, pelo menos 10 palavras de memória.", "subdomain": "escrita", "age": undefined, "rules": [] },
      { "num": 46, "id": "com_46", "text": "Exprime ideias em mais do que uma versão sem ajuda.", "subdomain": "expressiva", "age": undefined, "rules": [] },
      { "num": 47, "id": "com_47", "text": "Lê em voz alta uma história simples.", "subdomain": "escrita", "age": undefined, "rules": [] },
      { "num": 48, "id": "com_48", "text": "Imprime ou escreve frases simples com 3 ou 4 palavras.", "subdomain": "escrita", "age": "7,8", "rules": [] },
      { "num": 49, "id": "com_49", "text": "Está atenta na escola mais de 15 minutos.", "subdomain": "receptiva", "age": undefined, "rules": [] },
      { "num": 50, "id": "com_50", "text": "Lê por iniciativa própria.", "subdomain": "escrita", "age": undefined, "rules": [] },
      { "num": 51, "id": "com_51", "text": "Lê livros, pelo menos, do 2º ano de escolaridade.", "subdomain": "escrita", "age": undefined, "rules": [] },
      { "num": 52, "id": "com_52", "text": "Ordena alfabeticamente palavras ou itens, pela 1ª letra.", "subdomain": "escrita", "age": undefined, "rules": [] },
      { "num": 53, "id": "com_53", "text": "Imprime ou escreve pequenas notas ou mensagens.", "subdomain": "escrita", "age": undefined, "rules": [] },
      { "num": 54, "id": "com_54", "text": "Dá ordens complexas aos outros.", "subdomain": "expressiva", "age": "9", "rules": [] },
      { "num": 55, "id": "com_55", "text": "Escreve as primeiras cartas.", "subdomain": "escrita", "age": undefined, "rules": ["no_score_1"] },
      { "num": 56, "id": "com_56", "text": "Lê livros, pelo menos, do 4º ano de escolaridade.", "subdomain": "escrita", "age": undefined, "rules": [] },
      { "num": 57, "id": "com_57", "text": "Escreve com letra manuscrita a maior parte das vezes.", "subdomain": "escrita", "age": undefined, "rules": ["no_score_1"] },
      { "num": 58, "id": "com_58", "text": "Usa o dicionário.", "subdomain": "escrita", "age": "10 a 18+", "rules": [] },
      { "num": 59, "id": "com_59", "text": "Consulta o sumário de um livro.", "subdomain": "escrita", "age": undefined, "rules": [] },
      { "num": 60, "id": "com_60", "text": "Escreve relatórios ou composições.", "subdomain": "escrita", "age": undefined, "rules": ["no_score_1"] },
      { "num": 61, "id": "com_61", "text": "Escreve o endereço completo em envelopes.", "subdomain": "escrita", "age": undefined, "rules": [] },
      { "num": 62, "id": "com_62", "text": "Consulta o índice de um livro.", "subdomain": "escrita", "age": undefined, "rules": [] },
      { "num": 63, "id": "com_63", "text": "Lê jornais.", "subdomain": "escrita", "age": undefined, "rules": ["allow_n"] },
      { "num": 64, "id": "com_64", "text": "Tem objectivos reais a longo prazo e explica detalhadamente como os atingir.", "subdomain": "expressiva", "age": undefined, "rules": [] },
      { "num": 65, "id": "com_65", "text": "Escreve cartas elaboradas.", "subdomain": "escrita", "age": undefined, "rules": [] },
      { "num": 66, "id": "com_66", "text": "Lê jornais ou revistas todas as semanas.", "subdomain": "escrita", "age": undefined, "rules": ["allow_n"] },
      { "num": 67, "id": "com_67", "text": "Escreve cartas comerciais.", "subdomain": "escrita", "age": undefined, "rules": ["no_score_1"] },
    ],
    "observationsId": "obs_comunicacao"
  },
  {
    "id": "autonomia",
    "title": "Área da Autonomia",
    "prefix": "aut",
    "subdomains": [
      { "id": "pessoal", "label": "Pessoal", "max": 78 },
      { "id": "domestica", "label": "Doméstica", "max": 42 },
      { "id": "comunidade", "label": "Comunidade", "max": 64 }
    ],
    "items": [
      { "num": 1, "id": "aut_01", "text": "Antecipa o comer quando vê o biberão, o peito ou comida.", "subdomain": "pessoal", "age": "<1", "rules": [] },
      { "num": 2, "id": "aut_02", "text": "Abre a boca quando se lhe apresenta a colher com comida.", "subdomain": "pessoal", "age": "<1", "rules": [] },
      { "num": 3, "id": "aut_03", "text": "Retira a comida da colher com a boca.", "subdomain": "pessoal", "age": "<1", "rules": [] },
      { "num": 4, "id": "aut_04", "text": "Chupa ou masca bolachas.", "subdomain": "pessoal", "age": "<1", "rules": [] },
      { "num": 5, "id": "aut_05", "text": "Come comida sólida.", "subdomain": "pessoal", "age": "1", "rules": [] },
      { "num": 6, "id": "aut_06", "text": "Bebe por chávena ou copo sem ajuda.", "subdomain": "pessoal", "age": "1", "rules": [] },
      { "num": 7, "id": "aut_07", "text": "Come sozinha com a colher.", "subdomain": "pessoal", "age": "1", "rules": [] },
      { "num": 8, "id": "aut_08", "text": "Demonstra compreender que as coisas quentes são perigosas.", "subdomain": "pessoal", "age": "1", "rules": [] },
      { "num": 9, "id": "aut_09", "text": "Indica que tem a fralda suja apontando, vocalizando ou puxando a fralda.", "subdomain": "pessoal", "age": "1", "rules": [] },
      { "num": 10, "id": "aut_10", "text": "Chupa pela palha.", "subdomain": "pessoal", "age": "1", "rules": [] },
      { "num": 11, "id": "aut_11", "text": "Permite que o educador lhe limpe o nariz.", "subdomain": "pessoal", "age": "2", "rules": [] },
      { "num": 12, "id": "aut_12", "text": "Come sozinha com o garfo.", "subdomain": "pessoal", "age": "2", "rules": [] },
      { "num": 13, "id": "aut_13", "text": "Tira um casaco aberto à frente ou uma camisola sem ajuda.", "subdomain": "pessoal", "age": "2", "rules": [] },
      { "num": 14, "id": "aut_14", "text": "Come sozinha com a colher, sem se sujar.", "subdomain": "pessoal", "age": "2", "rules": [] },
      { "num": 15, "id": "aut_15", "text": "Demonstra interesse em mudar a roupa quando está molhada ou muito suja.", "subdomain": "pessoal", "age": "2", "rules": [] },
      { "num": 16, "id": "aut_16", "text": "Urina na casa de banho ou no bacio.", "subdomain": "pessoal", "age": "2", "rules": [] },
      { "num": 17, "id": "aut_17", "text": "Lava-se com ajuda.", "subdomain": "pessoal", "age": "2", "rules": [] },
      { "num": 18, "id": "aut_18", "text": "Faz cocó na casa de banho ou no bacio.", "subdomain": "pessoal", "age": "2", "rules": [] },
      { "num": 19, "id": "aut_19", "text": "Pede para ir à casa de banho.", "subdomain": "pessoal", "age": "2", "rules": [] },
      { "num": 20, "id": "aut_20", "text": "Veste roupas fáceis com elásticos, sem ajuda.", "subdomain": "pessoal", "age": "2", "rules": [] },
      { "num": 21, "id": "aut_21", "text": "Demonstra compreender a função do dinheiro.", "subdomain": "comunidade", "age": "2", "rules": [] },
      { "num": 22, "id": "aut_22", "text": "Dá o que tem na mão quando se lhe pede.", "subdomain": "pessoal", "age": "2", "rules": [] },
      { "num": 23, "id": "aut_23", "text": "Controla os esfincteres, durante a noite.", "subdomain": "pessoal", "age": "3", "rules": [] },
      { "num": 24, "id": "aut_24", "text": "Tira água da torneira sem ajuda.", "subdomain": "pessoal", "age": "3", "rules": [] },
      { "num": 25, "id": "aut_25", "text": "Lava os dentes sem ajuda.", "subdomain": "pessoal", "age": "3", "rules": ["no_score_1"] },
      { "num": 26, "id": "aut_26", "text": "Demonstra compreender a função do relógio clássico e do digital.", "subdomain": "comunidade", "age": "3", "rules": [] },
      { "num": 27, "id": "aut_27", "text": "Colabora nas tarefas domésticas quando se lhe pede.", "subdomain": "domestica", "age": "3", "rules": [] },
      { "num": 28, "id": "aut_28", "text": "Lava e limpa a cara sem ajuda.", "subdomain": "pessoal", "age": "3", "rules": [] },
      { "num": 29, "id": "aut_29", "text": "Calça os sapatos correctamente sem ajuda.", "subdomain": "pessoal", "age": "3", "rules": [] },
      { "num": 30, "id": "aut_30", "text": "Atende o telefone de forma apropriada.", "subdomain": "pessoal", "age": "3", "rules": ["allow_n"] },
      { "num": 31, "id": "aut_31", "text": "Veste-se completamente sozinha, excepto atar laços.", "subdomain": "pessoal", "age": "4", "rules": [] },
      { "num": 32, "id": "aut_32", "text": "Diz para quem é a chamada telefónica ou que essa pessoa não pode atender.", "subdomain": "pessoal", "age": "4", "rules": ["allow_n"] },
      { "num": 33, "id": "aut_33", "text": "Põe a mesa com ajuda.", "subdomain": "domestica", "age": "4", "rules": [] },
      { "num": 34, "id": "aut_34", "text": "Cuida de toda a sua higiene sem ajuda e sem ser preciso lembrá-la.", "subdomain": "pessoal", "age": undefined, "rules": ["no_score_1"] },
      { "num": 35, "id": "aut_35", "text": "Olha para os dois lados antes de atravessar a rua.", "subdomain": "comunidade", "age": undefined, "rules": [] },
      { "num": 36, "id": "aut_36", "text": "Arruma as roupas limpas, sem ajuda, quando se lhe pede.", "subdomain": "domestica", "age": undefined, "rules": [] },
      { "num": 37, "id": "aut_37", "text": "Assoa o nariz sem ajuda.", "subdomain": "pessoal", "age": undefined, "rules": ["no_score_1"] },
      { "num": 38, "id": "aut_38", "text": "Levanta da mesa peças quebráveis.", "subdomain": "domestica", "age": undefined, "rules": [] },
      { "num": 39, "id": "aut_39", "text": "Seca-se sozinha com uma toalha.", "subdomain": "pessoal", "age": undefined, "rules": [] },
      { "num": 40, "id": "aut_40", "text": "Aperta todos os fechos.", "subdomain": "pessoal", "age": undefined, "rules": ["no_score_1"] },
      { "num": 41, "id": "aut_41", "text": "Ajuda na preparação de comida (mexer e cozinhar).", "subdomain": "domestica", "age": "5", "rules": [] },
      { "num": 42, "id": "aut_42", "text": "Demonstra compreender que não é seguro apanhar boleias, aceitar comida ou dinheiro de estranhos.", "subdomain": "comunidade", "age": undefined, "rules": [] },
      { "num": 43, "id": "aut_43", "text": "Dá laços, sem ajuda.", "subdomain": "pessoal", "age": undefined, "rules": [] },
      { "num": 44, "id": "aut_44", "text": "Toma banho, ou duche, sem ajuda.", "subdomain": "pessoal", "age": undefined, "rules": ["no_score_1"] },
      { "num": 45, "id": "aut_45", "text": "Olha para os dois lados e atravessa a rua sozinha.", "subdomain": "pessoal", "age": undefined, "rules": [] },
      { "num": 46, "id": "aut_46", "text": "Põe a mão à frente da boca e do nariz quando tosse ou espirra.", "subdomain": "pessoal", "age": undefined, "rules": [] },
      { "num": 47, "id": "aut_47", "text": "Utiliza adequadamente a colher, a faca e o garfo.", "subdomain": "pessoal", "age": "6", "rules": ["no_score_1"] },
      { "num": 48, "id": "aut_48", "text": "Toma a iniciativa de telefonar para outros.", "subdomain": "comunidade", "age": undefined, "rules": ["allow_n"] },
      { "num": 49, "id": "aut_49", "text": "Obedece aos semáforos para peões e outros.", "subdomain": "comunidade", "age": undefined, "rules": ["allow_n"] },
      { "num": 50, "id": "aut_50", "text": "Veste-se completamente sozinha, incluindo laços e fechos.", "subdomain": "pessoal", "age": undefined, "rules": ["no_score_1"] },
      { "num": 51, "id": "aut_51", "text": "Faz a sua cama quando se lhe pede.", "subdomain": "domestica", "age": undefined, "rules": [] },
      { "num": 52, "id": "aut_52", "text": "Diz o dia da semana quando se lhe pergunta.", "subdomain": "comunidade", "age": undefined, "rules": [] },
      { "num": 53, "id": "aut_53", "text": "Aperta o cinto do carro sem ajuda.", "subdomain": "comunidade", "age": undefined, "rules": ["allow_n"] },
      { "num": 54, "id": "aut_54", "text": "Conhece o valor do dinheiro.", "subdomain": "comunidade", "age": "7", "rules": [] },
      { "num": 55, "id": "aut_55", "text": "Utiliza funcionalmente instrumentos domésticos.", "subdomain": "domestica", "age": undefined, "rules": [] },
      { "num": 56, "id": "aut_56", "text": "Identifica a esquerda e a direita nos outros.", "subdomain": "pessoal", "age": undefined, "rules": [] },
      { "num": 57, "id": "aut_57", "text": "Levanta a mesa sem ajuda quando se lhe pede.", "subdomain": "domestica", "age": undefined, "rules": [] },
      { "num": 58, "id": "aut_58", "text": "Varre, lava ou aspira o chão cuidadosamente sem ajuda quando se lhe pede.", "subdomain": "domestica", "age": "8", "rules": [] },
      { "num": 59, "id": "aut_59", "text": "Utiliza adequadamente o telefone de emergência.", "subdomain": "comunidade", "age": undefined, "rules": ["allow_n"] },
      { "num": 60, "id": "aut_60", "text": "Pede a sua refeição no restaurante.", "subdomain": "comunidade", "age": undefined, "rules": ["allow_n"] },
      { "num": 61, "id": "aut_61", "text": "Diz a data completa quando se lhe pergunta.", "subdomain": "comunidade", "age": undefined, "rules": [] },
      { "num": 62, "id": "aut_62", "text": "Troca de roupa em antecipação às mudanças do tempo sem ser necessário lembrá-la.", "subdomain": "pessoal", "age": undefined, "rules": [] },
      { "num": 63, "id": "aut_63", "text": "Evita pessoas com doenças contagiosas, sem ser necessário lembrá-la.", "subdomain": "pessoal", "age": undefined, "rules": [] },
      { "num": 64, "id": "aut_64", "text": "Sabe ver as horas com intervalos de 5 minutos.", "subdomain": "pessoal", "age": "9/10", "rules": [] },
      { "num": 65, "id": "aut_65", "text": "Cuida sozinha do seu cabelo sem ser necessário lembrá-la.", "subdomain": "pessoal", "age": "10", "rules": ["no_score_1"] },
      { "num": 66, "id": "aut_66", "text": "Utiliza o fogão ou o microondas para cozinhar.", "subdomain": "domestica", "age": "11/12", "rules": [] },
      { "num": 67, "id": "aut_67", "text": "Utiliza os produtos de limpeza da casa adequadamente.", "subdomain": "domestica", "age": "11/12", "rules": [] },
      { "num": 68, "id": "aut_68", "text": "Faz trocos correctamente.", "subdomain": "comunidade", "age": "11/12", "rules": [] },
      { "num": 69, "id": "aut_69", "text": "Utiliza, sem ajuda, o telefone para todo o tipo de chamadas.", "subdomain": "comunidade", "age": "12", "rules": ["allow_n"] },
      { "num": 70, "id": "aut_70", "text": "Cuida das unhas sem ajuda e sem ser lembrada.", "subdomain": "pessoal", "age": undefined, "rules": ["no_score_1"] },
      { "num": 71, "id": "aut_71", "text": "Prepara sem ajuda comida que requer mistura de ingredientes e cozedura.", "subdomain": "domestica", "age": undefined, "rules": [] },
      { "num": 72, "id": "aut_72", "text": "Usa um telefone público.", "subdomain": "comunidade", "age": "13, 14, 15", "rules": ["allow_n"] },
      { "num": 73, "id": "aut_73", "text": "Arruma o seu quarto sem ser necessário lembrar.", "subdomain": "domestica", "age": "13, 14, 15", "rules": [] },
      { "num": 74, "id": "aut_74", "text": "Poupa para comprar pelo menos um objecto desejado.", "subdomain": "comunidade", "age": "13, 14, 15", "rules": [] },
      { "num": 75, "id": "aut_75", "text": "Cuida da sua saúde.", "subdomain": "pessoal", "age": "16", "rules": [] },
      { "num": 76, "id": "aut_76", "text": "Controla o dinheiro.", "subdomain": "comunidade", "age": "16", "rules": [] },
      { "num": 77, "id": "aut_77", "text": "Faz a sua cama e muda-lhe a roupa regularmente.", "subdomain": "domestica", "age": "16", "rules": ["no_score_1"] },
      { "num": 78, "id": "aut_78", "text": "Limpa o seu quarto regularmente sem se lhe pedir.", "subdomain": "domestica", "age": "17, 18", "rules": [] },
      { "num": 79, "id": "aut_79", "text": "Executa tarefas de rotina na casa (manutenção e reparação) sem se lhe pedir.", "subdomain": "domestica", "age": "17, 18", "rules": [] },
      { "num": 80, "id": "aut_80", "text": "Prega botões, fechos e molas quando se lhe pede.", "subdomain": "domestica", "age": "17, 18", "rules": [] },
      { "num": 81, "id": "aut_81", "text": "Faz o orçamento de despesas semanais.", "subdomain": "comunidade", "age": "17, 18", "rules": [] },
      { "num": 82, "id": "aut_82", "text": "Administra o próprio dinheiro sem ajuda.", "subdomain": "comunidade", "age": "17, 18", "rules": [] },
      { "num": 83, "id": "aut_83", "text": "Planifica e prepara as refeições principais do dia sem ajuda.", "subdomain": "domestica", "age": undefined, "rules": [] },
      { "num": 84, "id": "aut_84", "text": "Chega a horas ao trabalho.", "subdomain": "comunidade", "age": undefined, "rules": [] },
      { "num": 85, "id": "aut_85", "text": "Cuida das suas roupas de forma independente.", "subdomain": "pessoal", "age": undefined, "rules": ["no_score_1"] },
      { "num": 86, "id": "aut_86", "text": "Avisa que vai chegar atrasado ao trabalho.", "subdomain": "comunidade", "age": undefined, "rules": [] },
      { "num": 87, "id": "aut_87", "text": "Avisa quando não vai trabalhar por estar doente.", "subdomain": "comunidade", "age": undefined, "rules": [] },
      { "num": 88, "id": "aut_88", "text": "Faz o orçamento de despesas mensais.", "subdomain": "comunidade", "age": undefined, "rules": [] },
      { "num": 89, "id": "aut_89", "text": "Cose as bainhas ou faz outras alterações sem ajuda e sem ser lembrado.", "subdomain": "domestica", "age": undefined, "rules": [] },
      { "num": 90, "id": "aut_90", "text": "Respeita o tempo de intervalo para café ou almoço.", "subdomain": "comunidade", "age": undefined, "rules": [] },
      { "num": 91, "id": "aut_91", "text": "Assume sempre a responsabilidade do seu trabalho.", "subdomain": "comunidade", "age": undefined, "rules": ["no_score_1"] },
      { "num": 92, "id": "aut_92", "text": "Tem conta bancária e usa-a responsavelmente.", "subdomain": "comunidade", "age": undefined, "rules": [] },
    ],
    "observationsId": "obs_autonomia"
  },
  {
    "id": "socializacao",
    "title": "Área da Socialização",
    "prefix": "soc",
    "subdomains": [
      { "id": "interpessoal", "label": "R. Interpessoais", "max": 40 },
      { "id": "jogos_lazer", "label": "Jogos e Lazer", "max": 24 },
      { "id": "regras_sociais", "label": "Regras Sociais", "max": 10 }
    ],
    "items": [
      { "num": 1, "id": "soc_01", "text": "Olha para a cara do educador.", "subdomain": "interpessoal", "age": "<1", "rules": [] },
      { "num": 2, "id": "soc_02", "text": "Responde à voz do educador ou de outra pessoa.", "subdomain": "interpessoal", "age": undefined, "rules": [] },
      { "num": 3, "id": "soc_03", "text": "Distingue o educador dos outros.", "subdomain": "interpessoal", "age": undefined, "rules": [] },
      { "num": 4, "id": "soc_04", "text": "Mostra interesse por pessoas ou objectos novos.", "subdomain": "interpessoal", "age": undefined, "rules": [] },
      { "num": 5, "id": "soc_05", "text": "Exprime 2 ou mais emoções reconhecíveis (prazer, tristeza, medo, aflição, etc.)", "subdomain": "interpessoal", "age": undefined, "rules": [] },
      { "num": 6, "id": "soc_06", "text": "Mostra antecipação de ser levantada pelo educador.", "subdomain": "interpessoal", "age": undefined, "rules": [] },
      { "num": 7, "id": "soc_07", "text": "Mostra afeição às pessoas familiares.", "subdomain": "interpessoal", "age": undefined, "rules": [] },
      { "num": 8, "id": "soc_08", "text": "Mostra interesse por crianças ou colegas, sem ser os irmãos.", "subdomain": "interpessoal", "age": undefined, "rules": [] },
      { "num": 9, "id": "soc_09", "text": "Chama a atenção de uma pessoa familiar.", "subdomain": "interpessoal", "age": undefined, "rules": [] },
      { "num": 10, "id": "soc_10", "text": "Brinca sozinha ou acompanhada com um brinquedo ou um objecto.", "subdomain": "jogos_lazer", "age": undefined, "rules": [] },
      { "num": 11, "id": "soc_11", "text": "Brinca com os outros em jogos de interacção simples.", "subdomain": "interpessoal", "age": undefined, "rules": [] },
      { "num": 12, "id": "soc_12", "text": "Usa objectos comuns da casa para brincar.", "subdomain": "jogos_lazer", "age": undefined, "rules": [] },
      { "num": 13, "id": "soc_13", "text": "Mostra interesse pelas actividades dos outros.", "subdomain": "interpessoal", "age": undefined, "rules": [] },
      { "num": 14, "id": "soc_14", "text": "Imita movimentos simples dos adultos (bater palmas, dizer adeus c/ a mão)", "subdomain": "interpessoal", "age": undefined, "rules": [] },
      { "num": 15, "id": "soc_15", "text": "Sorri ou ri apropriadamente, em resposta a interacções positivas.", "subdomain": "interpessoal", "age": "1,2", "rules": [] },
      { "num": 16, "id": "soc_16", "text": "Dirige-se pelo nome a pelo menos duas pessoas familiares.", "subdomain": "interpessoal", "age": undefined, "rules": [] },
      { "num": 17, "id": "soc_17", "text": "Mostra desejo de agradar ao educador.", "subdomain": "interpessoal", "age": undefined, "rules": [] },
      { "num": 18, "id": "soc_18", "text": "Participa em pelo menos um jogo ou actividade com os outros.", "subdomain": "interpessoal", "age": undefined, "rules": [] },
      { "num": 19, "id": "soc_19", "text": "Imita uma tarefa relativamente complexa, horas depois de a ter visto.", "subdomain": "jogos_lazer", "age": undefined, "rules": [] },
      { "num": 20, "id": "soc_20", "text": "Imita frases do adulto, ouvidas anteriormente.", "subdomain": "interpessoal", "age": undefined, "rules": [] },
      { "num": 21, "id": "soc_21", "text": "Ocupa-se em actividades de faz de conta, sozinha ou com os outros.", "subdomain": "jogos_lazer", "age": undefined, "rules": [] },
      { "num": 22, "id": "soc_22", "text": "Mostra preferência por alguns amigos de entre outros", "subdomain": "interpessoal", "age": "3", "rules": [] },
      { "num": 23, "id": "soc_23", "text": "Diz \"Por favor.\" Quando pede alguma coisa.", "subdomain": "interpessoal", "age": undefined, "rules": [] },
      { "num": 24, "id": "soc_24", "text": "Verbaliza o seu estado de alegria, tristeza, medo e zanga.", "subdomain": "jogos_lazer", "age": undefined, "rules": [] },
      { "num": 25, "id": "soc_25", "text": "Identifica pessoas por outras características, que não o nome.", "subdomain": "interpessoal", "age": undefined, "rules": [] },
      { "num": 26, "id": "soc_26", "text": "Partilha brinquedos ou objectos sem ser preciso dizê-lo.", "subdomain": "interpessoal", "age": "4", "rules": [] },
      { "num": 27, "id": "soc_27", "text": "Diz os programas de TV favoritos e em que canal e dia passam.", "subdomain": "jogos_lazer", "age": undefined, "rules": ["allow_n"] },
      { "num": 28, "id": "soc_28", "text": "Segue regras em jogos simples, sem ser preciso lembrá-la.", "subdomain": "jogos_lazer", "age": undefined, "rules": [] },
      { "num": 29, "id": "soc_29", "text": "Tem um amigo preferido de cada sexo.", "subdomain": "interpessoal", "age": undefined, "rules": [] },
      { "num": 30, "id": "soc_30", "text": "Segue regras da escola.", "subdomain": "jogos_lazer", "age": undefined, "rules": [] },
      { "num": 31, "id": "soc_31", "text": "Responde verbal e positivamente aos sucessos dos outros.", "subdomain": "interpessoal", "age": "5", "rules": [] },
      { "num": 32, "id": "soc_32", "text": "Pede desculpa por erros não intencionais.", "subdomain": "interpessoal", "age": undefined, "rules": [] },
      { "num": 33, "id": "soc_33", "text": "Tem um grupo de amigos.", "subdomain": "interpessoal", "age": undefined, "rules": [] },
      { "num": 34, "id": "soc_34", "text": "Segue regras da comunidade.", "subdomain": "jogos_lazer", "age": undefined, "rules": [] },
      { "num": 35, "id": "soc_35", "text": "Brinca com jogos que requerem capacidades de decisão.", "subdomain": "jogos_lazer", "age": "6", "rules": [] },
      { "num": 36, "id": "soc_36", "text": "Não fala com a boca cheia.", "subdomain": "regras_sociais", "age": undefined, "rules": [] },
      { "num": 37, "id": "soc_37", "text": "Tem um melhor amigo do mesmo sexo.", "subdomain": "interpessoal", "age": undefined, "rules": [] },
      { "num": 38, "id": "soc_38", "text": "Responde apropriadamente quando se lhe apresenta alguém.", "subdomain": "interpessoal", "age": "7, 8", "rules": [] },
      { "num": 39, "id": "soc_39", "text": "Faz ou compra pequenas lembranças para o educador, ou membros da família nas férias grandes por sua própria iniciativa.", "subdomain": "interpessoal", "age": undefined, "rules": [] },
      { "num": 40, "id": "soc_40", "text": "Guarda segredos, ou confidências, durante mais de um dia.", "subdomain": "interpessoal", "age": undefined, "rules": [] },
      { "num": 41, "id": "soc_41", "text": "Devolve aos colegas brinquedos, objectos, dinheiro ou livros emprestados.", "subdomain": "interpessoal", "age": undefined, "rules": [] },
      { "num": 42, "id": "soc_42", "text": "Termina conversas apropriadamente.", "subdomain": "interpessoal", "age": undefined, "rules": [] },
      { "num": 43, "id": "soc_43", "text": "Segue limites de tempo definidos pelo educador.", "subdomain": "interpessoal", "age": "9", "rules": [] },
      { "num": 44, "id": "soc_44", "text": "Evita fazer perguntas ou afirmações que podem magoar ou embaraçar os outros.", "subdomain": "interpessoal", "age": undefined, "rules": [] },
      { "num": 45, "id": "soc_45", "text": "Controla a raiva e a dor quando magoada.", "subdomain": "interpessoal", "age": undefined, "rules": [] },
      { "num": 46, "id": "soc_46", "text": "Guarda segredos, ou confidências o tempo que for preciso.", "subdomain": "interpessoal", "age": undefined, "rules": [] },
      { "num": 47, "id": "soc_47", "text": "Usa maneiras apropriadas à mesa, sem se lhe dizer.", "subdomain": "interpessoal", "age": undefined, "rules": ["no_score_1"] },
      { "num": 48, "id": "soc_48", "text": "Vê TV, ou ouve rádio para se informar sobre uma área de interesse.", "subdomain": "jogos_lazer", "age": undefined, "rules": ["allow_n"] },
      { "num": 49, "id": "soc_49", "text": "Vai para a escola nocturna ou espectáculos com os amigos, quando acompanhados por um adulto.", "subdomain": "jogos_lazer", "age": undefined, "rules": ["allow_n"] },
      { "num": 50, "id": "soc_50", "text": "Pesa a consequência dos actos antes de tomar as decisões.", "subdomain": "regras_sociais", "age": "12, 13, 14", "rules": [] },
      { "num": 51, "id": "soc_51", "text": "Pede desculpa pelos erros (actos ou juízos).", "subdomain": "regras_sociais", "age": undefined, "rules": [] },
      { "num": 52, "id": "soc_52", "text": "Lembra o dia de aniversário da família mais próxima e dos amigos especiais.", "subdomain": "regras_sociais", "age": undefined, "rules": [] },
      { "num": 53, "id": "soc_53", "text": "Inicia conversas ou pontos de interesse particular com os outros.", "subdomain": "interpessoal", "age": undefined, "rules": [] },
      { "num": 54, "id": "soc_54", "text": "Tem um passatempo.", "subdomain": "jogos_lazer", "age": undefined, "rules": [] },
      { "num": 55, "id": "soc_55", "text": "Entrega dinheiro emprestado.", "subdomain": "regras_sociais", "age": undefined, "rules": [] },
      { "num": 56, "id": "soc_56", "text": "Responde a sugestões, ou pistas indirectas durante uma conversa.", "subdomain": "interpessoal", "age": "15 a 18+", "rules": [] },
      { "num": 57, "id": "soc_57", "text": "Participa em desportos fora da escola.", "subdomain": "jogos_lazer", "age": undefined, "rules": ["allow_n"] },
      { "num": 58, "id": "soc_58", "text": "Vê TV, ou ouve rádio para informação diária.", "subdomain": "jogos_lazer", "age": undefined, "rules": ["allow_n"] },
      { "num": 59, "id": "soc_59", "text": "Marca e aceita encontros.", "subdomain": "interpessoal", "age": undefined, "rules": [] },
      { "num": 60, "id": "soc_60", "text": "Vê TV, ou ouve rádio para notícias de um modo geral.", "subdomain": "jogos_lazer", "age": undefined, "rules": ["allow_n"] },
      { "num": 61, "id": "soc_61", "text": "Vai para a escola nocturna ou espectáculos com os amigos, sem supervisão.", "subdomain": "jogos_lazer", "age": undefined, "rules": ["allow_n"] },
      { "num": 62, "id": "soc_62", "text": "Sai à noite com os amigos sem supervisão do adulto.", "subdomain": "jogos_lazer", "age": undefined, "rules": [] },
      { "num": 63, "id": "soc_63", "text": "Pertence a clubes de adolescentes, grupos de interesse ou a organizações sociais.", "subdomain": "jogos_lazer", "age": undefined, "rules": [] },
      { "num": 64, "id": "soc_64", "text": "Sai com uma pessoa do sexo oposto a uma festa ou a um acontecimento público, onde está muita gente presente.", "subdomain": "interpessoal", "age": undefined, "rules": [] },
      { "num": 65, "id": "soc_65", "text": "Vai a encontros com dois ou três pares.", "subdomain": "interpessoal", "age": undefined, "rules": [] },
      { "num": 66, "id": "soc_66", "text": "Sai com uma pessoa do sexo oposto.", "subdomain": "interpessoal", "age": undefined, "rules": [] },
    ],
    "observationsId": "obs_socializacao"
  },
  {
    "id": "motricidade",
    "title": "Área da Motricidade",
    "prefix": "mot",
    "subdomains": [
      { "id": "global", "label": "Global", "max": 40 },
      { "id": "fina", "label": "Fina", "max": 32 }
    ],
    "items": [
      { "num": 1, "id": "mot_01", "text": "Segura a cabeça quando está ao colo, pelo menos durante 15 segundos.", "subdomain": "global", "age": "<1", "rules": [] },
      { "num": 2, "id": "mot_02", "text": "Senta-se com apoio, durante pelo menos 1 minuto.", "subdomain": "global", "age": "<1", "rules": [] },
      { "num": 3, "id": "mot_03", "text": "Apanha com a mão pequenos objectos, de qualquer maneira.", "subdomain": "fina", "age": "<1", "rules": [] },
      { "num": 4, "id": "mot_04", "text": "Transfere objectos de uma mão para a outra.", "subdomain": "fina", "age": "<1", "rules": [] },
      { "num": 5, "id": "mot_05", "text": "Faz pinça.", "subdomain": "fina", "age": "<1", "rules": [] },
      { "num": 6, "id": "mot_06", "text": "Senta-se sozinha e mantém essa posição sem apoio, durante pelo menos 1 minuto.", "subdomain": "global", "age": "<1", "rules": [] },
      { "num": 7, "id": "mot_07", "text": "Gatinha sem tocar com a barriga no chão.", "subdomain": "global", "age": "<1", "rules": [] },
      { "num": 8, "id": "mot_08", "text": "Abre portas que só requerem empurrar ou puxar.", "subdomain": "global", "age": "<1", "rules": [] },
      { "num": 9, "id": "mot_09", "text": "Rola a bola, enquanto sentada.", "subdomain": "fina", "age": "1", "rules": [] },
      { "num": 10, "id": "mot_10", "text": "Caminha para explorar o meio.", "subdomain": "global", "age": "1", "rules": [] },
      { "num": 11, "id": "mot_11", "text": "Sobe e desce para uma cama ou para uma cadeira de adulto.", "subdomain": "global", "age": "1", "rules": [] },
      { "num": 12, "id": "mot_12", "text": "Sobe para cima de brinquedos baixos (cavalinho, etc.).", "subdomain": "global", "age": "1", "rules": [] },
      { "num": 13, "id": "mot_13", "text": "Rabisca num papel.", "subdomain": "fina", "age": "1", "rules": [] },
      { "num": 14, "id": "mot_14", "text": "Sobe as escadas pondo os dois pés em cada degrau.", "subdomain": "global", "age": "2", "rules": [] },
      { "num": 15, "id": "mot_15", "text": "Desce as escadas pondo os dois pés em cada degrau.", "subdomain": "global", "age": "2", "rules": [] },
      { "num": 16, "id": "mot_16", "text": "Corre com mudança de velocidade e direcção.", "subdomain": "global", "age": "2", "rules": [] },
      { "num": 17, "id": "mot_17", "text": "Abre portas puxando ou rodando puxadores.", "subdomain": "fina", "age": "2", "rules": [] },
      { "num": 18, "id": "mot_18", "text": "Salta por cima de pequenos objectos.", "subdomain": "global", "age": "2", "rules": [] },
      { "num": 19, "id": "mot_19", "text": "Enrosca e desenrosca tampas de frascos.", "subdomain": "fina", "age": "2", "rules": [] },
      { "num": 20, "id": "mot_20", "text": "Pedala no triciclo, por mais de 2 metros.", "subdomain": "global", "age": "2", "rules": ["allow_n"] },
      { "num": 21, "id": "mot_21", "text": "Salta num só pé sem cair, agarrada a uma pessoa ou objecto.", "subdomain": "global", "age": "2", "rules": [] },
      { "num": 22, "id": "mot_22", "text": "Constrói uma estrutura tridimensional, com pelo menos cinco blocos.", "subdomain": "fina", "age": "2", "rules": [] },
      { "num": 23, "id": "mot_23", "text": "Abre e fecha tesouras com uma mão.", "subdomain": "fina", "age": "2", "rules": [] },
      { "num": 24, "id": "mot_24", "text": "Desce as escadas com pés alternados e sem ajuda.", "subdomain": "global", "age": "3,4 +", "rules": [] },
      { "num": 25, "id": "mot_25", "text": "Sobe para cima de brinquedos altos.", "subdomain": "global", "age": "3,4 +", "rules": [] },
      { "num": 26, "id": "mot_26", "text": "Corta com tesoura.", "subdomain": "fina", "age": "3,4 +", "rules": [] },
      { "num": 27, "id": "mot_27", "text": "Salta num só pé sem perder o equilíbrio, pelo menos três vezes.", "subdomain": "global", "age": "3,4 +", "rules": ["no_score_1"] },
      { "num": 28, "id": "mot_28", "text": "Completa um puzzle de, pelo menos, seis peças.", "subdomain": "fina", "age": "3,4 +", "rules": ["no_score_1"] },
      { "num": 29, "id": "mot_29", "text": "Desenha, com lápis ou caneta, mais do que uma forma reconhecível.", "subdomain": "fina", "age": "3,4 +", "rules": [] },
      { "num": 30, "id": "mot_30", "text": "Corta com a tesoura ao longo de uma linha desenhada.", "subdomain": "fina", "age": "3,4 +", "rules": [] },
      { "num": 31, "id": "mot_31", "text": "Usa a borracha sem rasgar o papel.", "subdomain": "fina", "age": "3,4 +", "rules": [] },
      { "num": 32, "id": "mot_32", "text": "Salta facilmente num só pé.", "subdomain": "global", "age": "3,4 +", "rules": ["no_score_1"] },
      { "num": 33, "id": "mot_33", "text": "Abre fechaduras com a chave.", "subdomain": "fina", "age": "3,4 +", "rules": [] },
      { "num": 34, "id": "mot_34", "text": "Corta figuras complexas com a tesoura.", "subdomain": "fina", "age": "3,4 +", "rules": [] },
      { "num": 35, "id": "mot_35", "text": "Apanha uma bola atirada a uma distância de três metros, mesmo que seja necessário movimentar-se para apanhá-la.", "subdomain": "global", "age": "3,4 +", "rules": [] },
      { "num": 36, "id": "mot_36", "text": "Anda de bicicleta sem cair e sem rodas de apoio.", "subdomain": "global", "age": "3,4 +", "rules": ["allow_n"] },
    ],
    "observationsId": "obs_motricidade"
  }
] as const

export const VINELAND_MALADAPTIVE_PART1 = [
  { "num": 1, "id": "mbd_01", "text": "Chupa no polegar ou noutro dedo." },
  { "num": 2, "id": "mbd_02", "text": "É excessivamente dependente." },
  { "num": 3, "id": "mbd_03", "text": "Isola-se." },
  { "num": 4, "id": "mbd_04", "text": "Molha a cama." },
  { "num": 5, "id": "mbd_05", "text": "Tem distúrbios alimentares." },
  { "num": 6, "id": "mbd_06", "text": "Tem distúrbios de sono." },
  { "num": 7, "id": "mbd_07", "text": "Rói as unhas." },
  { "num": 8, "id": "mbd_08", "text": "Recusa a escola ou o trabalho." },
  { "num": 9, "id": "mbd_09", "text": "Exibe ansiedade extrema." },
  { "num": 10, "id": "mbd_10", "text": "Exibe tiques." },
  { "num": 11, "id": "mbd_11", "text": "Chora ou ri facilmente." },
  { "num": 12, "id": "mbd_12", "text": "Tem contacto visual pobre." },
  { "num": 13, "id": "mbd_13", "text": "Exibe tristeza excessiva." },
  { "num": 14, "id": "mbd_14", "text": "Range os dentes de dia ou de noite." },
  { "num": 15, "id": "mbd_15", "text": "É muito impulsivo." },
  { "num": 16, "id": "mbd_16", "text": "Tem atenção e concentração pobre." },
  { "num": 17, "id": "mbd_17", "text": "É hiperactivo." },
  { "num": 18, "id": "mbd_18", "text": "Tem birras." },
  { "num": 19, "id": "mbd_19", "text": "É negativista ou desafiante." },
  { "num": 20, "id": "mbd_20", "text": "Aborrece os outros ou é insolente." },
  { "num": 21, "id": "mbd_21", "text": "Mostra falta de consideração." },
  { "num": 22, "id": "mbd_22", "text": "Mente, engana ou rouba." },
  { "num": 23, "id": "mbd_23", "text": "É muito agressivo fisicamente." },
  { "num": 24, "id": "mbd_24", "text": "Blasfema em situações inapropriadas." },
  { "num": 25, "id": "mbd_25", "text": "Foge." },
  { "num": 26, "id": "mbd_26", "text": "É teimoso e rabugento." },
  { "num": 27, "id": "mbd_27", "text": "Falta à escola ou ao trabalho." }
] as const

export const VINELAND_MALADAPTIVE_PART2 = [
  { "num": 28, "id": "mbd_28", "text": "28. Envolve-se em comportamentos sexuais inapropriados." },
  { "num": 29, "id": "mbd_29", "text": "29. Tem preocupações excessivas ou peculiares com objectos ou actividades." },
  { "num": 30, "id": "mbd_30", "text": "30. Expressa pensamentos que revelam pouca sensibilidade." },
  { "num": 31, "id": "mbd_31", "text": "31. Exibe maneirismos ou hábitos extremamente peculiares." },
  { "num": 32, "id": "mbd_32", "text": "32. Exibe comportamentos auto-agressivos." },
  { "num": 33, "id": "mbd_33", "text": "33. Destrói intencionalmente os seus bens ou os dos outros." },
  { "num": 34, "id": "mbd_34", "text": "34. Utiliza linguagem bizarra." },
  { "num": 35, "id": "mbd_35", "text": "35. Não tem consciência do que acontece ao seu redor." },
  { "num": 36, "id": "mbd_36", "text": "36. Balanceia-se quando sentado ou em pé." }
] as const

export const VINELAND_COTATION_CONFIG = {"comunicacao": {"pageRows": [{"id": "pag3", "label": "Soma de 2, 1, 0 da pág. 3", "from": 34, "to": 67}, {"id": "pag2", "label": "Soma de 2, 1, 0 da pág. 2", "from": 1, "to": 33}], "nLabel": "N.º de N das pág. 2 e 3", "dLabel": "N.º de D das pág. 2 e 3", "totalLabel": "Cotação total da área"}, "autonomia": {"pageRows": [{"id": "pag6", "label": "Soma de 2, 1, 0 da pág. 6", "from": 64, "to": 92}, {"id": "pag5", "label": "Soma de 2, 1, 0 da pág. 5", "from": 34, "to": 63}, {"id": "pag4", "label": "Soma de 2, 1, 0 da pág. 4", "from": 1, "to": 33}], "nLabel": "N.º de N das pág. 4, 5 e 6", "dLabel": "N.º de D das pág. 4, 5 e 6", "totalLabel": "Cotação total da área"}, "socializacao": {"pageRows": [{"id": "pag8", "label": "Soma de 2, 1, 0 da pág. 8", "from": 38, "to": 66}, {"id": "pag7", "label": "Soma de 2, 1, 0 da pág. 7", "from": 1, "to": 37}], "nLabel": "N.º de N das pág. 7 e 8", "dLabel": "N.º de D das pág. 7 e 8", "totalLabel": "Cotação total da área"}, "motricidade": {"pageRows": [{"id": "pag9", "label": "Soma de 2, 1, 0 da pág. 9", "from": 1, "to": 36}], "nLabel": "N.º de N da pág. 9", "dLabel": "N.º de D da pág. 9", "totalLabel": "Cotação total da área"}} as const

export const VINELAND_MALADAPTIVE_COTATION = {"part1Label": "A. PARTE 1 Cotação Total (Soma de 2, 1, 0 da Parte 1)", "part2Label": "B. Soma de 2, 1, 0 da Parte 2", "totalLabel": "PARTES 1 e 2 Cotação Total (Somar A e B)"} as const

const PRESENTATION_ITEMS: QuestionnaireItem[] = VINELAND_AREAS.flatMap((area) =>
  area.items.map((item) => ({ id: item.id, text: item.text })),
)

export const vinelandItemId = (prefix: string, num: number) => `${prefix}_${String(num).padStart(2, '0')}`

export const vinelandSeverityId = (num: number) => `mbd_${String(num).padStart(2, '0')}_sev`

const vinelandScoreValue = z.union([
  z.literal(2),
  z.literal(1),
  z.literal(0),
  z.literal('N'),
  z.literal('D'),
])

const maladaptiveScoreValue = z.union([z.literal(2), z.literal(1), z.literal(0)])

export function buildVinelandSchema() {
  const shape: Record<string, z.ZodTypeAny> = {}
  for (const field of VINELAND_IDENTIFICATION) {
    shape[field.id] = z.string().optional()
  }
  for (const area of VINELAND_AREAS) {
    for (const item of area.items) {
      shape[item.id] = vinelandScoreValue.optional()
    }
    if (area.observationsId) {
      shape[area.observationsId] = z.string().optional()
    }
  }
  for (const item of VINELAND_MALADAPTIVE_PART1) {
    shape[item.id] = maladaptiveScoreValue.optional()
  }
  for (const item of VINELAND_MALADAPTIVE_PART2) {
    shape[item.id] = maladaptiveScoreValue.optional()
    shape[vinelandSeverityId(item.num)] = z.union([z.literal('S'), z.literal('M')]).optional()
  }
  shape.mbd_observations = z.string().optional()
  for (const note of VINELAND_INTERVIEW_NOTES) {
    shape[note.id] = z.string().optional()
  }
  shape[QUESTIONNAIRE_NOTES_FIELD] = z.string().optional()
  return z.object(shape).strict()
}

export const vinelandQuestionnaire = defineQuestionnaire({
  id: 'vineland',
  title: 'VINELAND — Escala de Comportamento Adaptativo',
  description:
    'Vineland-II, Forma Sintética de Entrevista (versão portuguesa). Comunicação, Autonomia, Socialização, Motricidade e Comportamento Desajustado.',
  instructions:
    'Entrevista estruturada com informador. Cotar cada item com 2 (sim, normalmente), 1 (algumas vezes), 0 (não, nunca), N (sem oportunidade) ou D (desconhecido). Estabelecer base (sete 2 consecutivos) e máximo (sete 0 consecutivos). Na Área do Comportamento Desajustado (opcional, ≥5 anos) usar apenas 2, 1 ou 0.',
  respondent: 'Pais, educadores ou outros informadores',
  responseType: 'vineland_item',
  responseLabels: [...VINELAND_RESPONSE_LABELS],
  items: PRESENTATION_ITEMS,
  scoring: { type: 'vineland' },
  meta: {
    identification: VINELAND_IDENTIFICATION,
    areas: VINELAND_AREAS,
    maladaptivePart1: VINELAND_MALADAPTIVE_PART1,
    maladaptivePart2: VINELAND_MALADAPTIVE_PART2,
    interviewNotes: VINELAND_INTERVIEW_NOTES,
    responseLabels: VINELAND_RESPONSE_LABELS,
    subdomainLabels: {"receptiva": "Receptiva", "expressiva": "Expressiva", "escrita": "Escrita", "pessoal": "Pessoal", "domestica": "Doméstica", "comunidade": "Comunidade", "interpessoal": "R. Interpessoais", "jogos_lazer": "Jogos e Lazer", "regras_sociais": "Regras Sociais", "global": "Global", "fina": "Fina"},
    cotationConfig: VINELAND_COTATION_CONFIG,
    maladaptiveCotation: VINELAND_MALADAPTIVE_COTATION,
  },
})
