import {
  PiccaFrequencyMatrix,
  PiccaInstrumentTable,
  PiccaObjective,
  PiccaRadioGroup,
  PiccaReadOnlyText,
  PiccaSection,
  PiccaTextField,
} from '../PiccaFields'
import styles from '../PiccaForm.module.css'
import {
  mergePiccaModulo5Answers,
  PICCA_MOD5_INSTRUMENTS,
  type PiccaModulo5Answers,
} from './piccaModulo5'

type Props = {
  value: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
  readOnly?: boolean
}

export function PiccaModulo5Form({ value, onChange, readOnly }: Props) {
  const answers = mergePiccaModulo5Answers(value)

  function set(patch: Partial<PiccaModulo5Answers>) {
    onChange({ ...answers, ...patch })
  }

  return (
    <div className={styles.form}>
      <PiccaObjective>
        Caracterizar o funcionamento atual da criança/adolescente nos diferentes contextos,
        integrando indicadores cognitivos, emocionais, comportamentais, sociais e adaptativos.
      </PiccaObjective>

      <PiccaSection title="Atenção e Funções Executivas">
        <PiccaFrequencyMatrix
          rows={[{ id: 'mantemAtencao', label: 'Mantém a atenção nas tarefas' }]}
          value={{ mantemAtencao: answers.mantemAtencao }}
          onChange={(freq) => set({ mantemAtencao: freq.mantemAtencao })}
          readOnly={readOnly}
        />
        <PiccaRadioGroup
          label="Segue instruções"
          options={[
            { id: 'sim', label: 'Sim' },
            { id: 'parcialmente', label: 'Parcialmente' },
            { id: 'nao', label: 'Não' },
          ]}
          value={answers.segueInstrucoes}
          onChange={(segueInstrucoes) =>
            set({ segueInstrucoes: segueInstrucoes as PiccaModulo5Answers['segueInstrucoes'] })
          }
          readOnly={readOnly}
        />
        <PiccaTextField
          label="Planeamento/organização"
          value={answers.planeamentoOrganizacao}
          onChange={(planeamentoOrganizacao) => set({ planeamentoOrganizacao })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Flexibilidade cognitiva"
          value={answers.flexibilidadeCognitiva}
          onChange={(flexibilidadeCognitiva) => set({ flexibilidadeCognitiva })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="Memória e Aprendizagem">
        <PiccaTextField
          label="Memória imediata"
          value={answers.memoriaImediata}
          onChange={(memoriaImediata) => set({ memoriaImediata })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Memória de trabalho"
          value={answers.memoriaTrabalho}
          onChange={(memoriaTrabalho) => set({ memoriaTrabalho })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Leitura"
          value={answers.leitura}
          onChange={(leitura) => set({ leitura })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Escrita"
          value={answers.escrita}
          onChange={(escrita) => set({ escrita })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Matemática"
          value={answers.matematica}
          onChange={(matematica) => set({ matematica })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="Linguagem">
        <PiccaTextField
          label="Compreensão verbal"
          value={answers.compreensaoVerbal}
          onChange={(compreensaoVerbal) => set({ compreensaoVerbal })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Expressão verbal"
          value={answers.expressaoVerbal}
          onChange={(expressaoVerbal) => set({ expressaoVerbal })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Pragmática"
          value={answers.pragmatica}
          onChange={(pragmatica) => set({ pragmatica })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="Funcionamento Emocional">
        <PiccaTextField
          label="Reconhecimento emocional"
          value={answers.reconhecimentoEmocional}
          onChange={(reconhecimentoEmocional) => set({ reconhecimentoEmocional })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Regulação emocional"
          value={answers.regulacaoEmocional}
          onChange={(regulacaoEmocional) => set({ regulacaoEmocional })}
          readOnly={readOnly}
          multiline
        />
        <PiccaRadioGroup
          label="Ansiedade"
          options={[
            { id: 'ausente', label: 'Ausente' },
            { id: 'ligeira', label: 'Ligeira' },
            { id: 'moderada', label: 'Moderada' },
            { id: 'grave', label: 'Grave' },
          ]}
          value={answers.ansiedade}
          onChange={(ansiedade) =>
            set({ ansiedade: ansiedade as PiccaModulo5Answers['ansiedade'] })
          }
          readOnly={readOnly}
        />
        <PiccaTextField
          label="Autoestima"
          value={answers.autoestima}
          onChange={(autoestima) => set({ autoestima })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="Comportamento">
        <PiccaTextField
          label="Impulsividade"
          value={answers.impulsividade}
          onChange={(impulsividade) => set({ impulsividade })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Agressividade"
          value={answers.agressividade}
          onChange={(agressividade) => set({ agressividade })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Oposição"
          value={answers.oposicao}
          onChange={(oposicao) => set({ oposicao })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Rigidez"
          value={answers.rigidez}
          onChange={(rigidez) => set({ rigidez })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="Competências Sociais">
        <PiccaTextField
          label="Relação com pares"
          value={answers.relacaoPares}
          onChange={(relacaoPares) => set({ relacaoPares })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Relação com adultos"
          value={answers.relacaoAdultos}
          onChange={(relacaoAdultos) => set({ relacaoAdultos })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Empatia"
          value={answers.empatia}
          onChange={(empatia) => set({ empatia })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Bullying (vítima/agressor/testemunha)"
          value={answers.bullying}
          onChange={(bullying) => set({ bullying })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="Autonomia">
        <PiccaTextField
          label="Higiene pessoal"
          value={answers.higienePessoal}
          onChange={(higienePessoal) => set({ higienePessoal })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Gestão de rotinas"
          value={answers.gestaoRotinas}
          onChange={(gestaoRotinas) => set({ gestaoRotinas })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Trabalhos de casa"
          value={answers.trabalhosCasa}
          onChange={(trabalhosCasa) => set({ trabalhosCasa })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="Sono e Alimentação">
        <PiccaTextField
          label="Qualidade do sono"
          value={answers.qualidadeSono}
          onChange={(qualidadeSono) => set({ qualidadeSono })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Hábitos alimentares"
          value={answers.habitosAlimentares}
          onChange={(habitosAlimentares) => set({ habitosAlimentares })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="Integração com Instrumentos de Avaliação">
        <PiccaInstrumentTable
          instruments={[...PICCA_MOD5_INSTRUMENTS]}
          value={answers.instrumentos}
          onChange={(instrumentos) => set({ instrumentos })}
          readOnly={readOnly}
        />
      </PiccaSection>

      <PiccaSection title="Síntese Clínica do Funcionamento Atual">
        <PiccaTextField
          label="Áreas fortes"
          value={answers.sinteseFortes}
          onChange={(sinteseFortes) => set({ sinteseFortes })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Principais dificuldades"
          value={answers.sinteseDificuldades}
          onChange={(sinteseDificuldades) => set({ sinteseDificuldades })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Impacto funcional"
          value={answers.sinteseImpacto}
          onChange={(sinteseImpacto) => set({ sinteseImpacto })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Fatores de manutenção"
          value={answers.sinteseManutencao}
          onChange={(sinteseManutencao) => set({ sinteseManutencao })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Objetivos prioritários"
          value={answers.sinteseObjetivos}
          onChange={(sinteseObjetivos) => set({ sinteseObjetivos })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="Notas Clínicas">
        <PiccaReadOnlyText>
          Relacionar o funcionamento atual com os fatores predisponentes, precipitantes, protetores e
          de manutenção. Integrar a informação proveniente da observação clínica, anamnese e provas
          psicológicas.
        </PiccaReadOnlyText>
        <PiccaTextField
          label="Notas"
          value={answers.notasClinicas}
          onChange={(notasClinicas) => set({ notasClinicas })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>
    </div>
  )
}
