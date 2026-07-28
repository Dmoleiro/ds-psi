import {
  PiccaAcademicLevelMatrix,
  PiccaCheckboxGroup,
  PiccaObjective,
  PiccaRadioGroup,
  PiccaReadOnlyText,
  PiccaSection,
  PiccaTextField,
} from '../PiccaFields'
import styles from '../PiccaForm.module.css'
import {
  mergePiccaModulo6Answers,
  PICCA_MOD6_ACADEMIC_ROWS,
  type PiccaModulo6Answers,
} from './piccaModulo6'

const APOIOS = [
  { id: 'medidas_universais', label: 'Medidas Universais' },
  { id: 'medidas_seletivas', label: 'Medidas Seletivas' },
  { id: 'medidas_adicionais', label: 'Medidas Adicionais' },
  { id: 'terapia_fala', label: 'Terapia da Fala' },
  { id: 'psicologia', label: 'Psicologia' },
  { id: 'educacao_especial', label: 'Educação Especial' },
  { id: 'outro', label: 'Outro' },
]

type Props = {
  value: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
  readOnly?: boolean
}

export function PiccaModulo6Form({ value, onChange, readOnly }: Props) {
  const answers = mergePiccaModulo6Answers(value)

  function set(patch: Partial<PiccaModulo6Answers>) {
    onChange({ ...answers, ...patch })
  }

  return (
    <div className={styles.form}>
      <PiccaObjective>
        Caracterizar o percurso escolar da criança/adolescente, identificando fatores de proteção,
        dificuldades académicas, adaptações, impacto funcional e necessidades educativas.
      </PiccaObjective>

      <PiccaSection title="Creche e Pré-Escolar">
        <PiccaTextField
          label="Idade de ingresso"
          value={answers.crecheIngresso}
          onChange={(crecheIngresso) => set({ crecheIngresso })}
          readOnly={readOnly}
        />
        <PiccaRadioGroup
          label="Adaptação"
          options={[
            { id: 'facil', label: 'Fácil' },
            { id: 'moderada', label: 'Moderada' },
            { id: 'dificil', label: 'Difícil' },
          ]}
          value={answers.crecheAdaptacao}
          onChange={(crecheAdaptacao) =>
            set({ crecheAdaptacao: crecheAdaptacao as PiccaModulo6Answers['crecheAdaptacao'] })
          }
          readOnly={readOnly}
        />
        <PiccaTextField
          label="Relação com educadores"
          value={answers.crecheEducadores}
          onChange={(crecheEducadores) => set({ crecheEducadores })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Relação com pares"
          value={answers.crechePares}
          onChange={(crechePares) => set({ crechePares })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Principais observações"
          value={answers.crecheObs}
          onChange={(crecheObs) => set({ crecheObs })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="1.º Ciclo">
        <PiccaTextField
          label="Adaptação ao 1.º ciclo"
          value={answers.ciclo1Adaptacao}
          onChange={(ciclo1Adaptacao) => set({ ciclo1Adaptacao })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Dificuldades de leitura"
          value={answers.ciclo1Leitura}
          onChange={(ciclo1Leitura) => set({ ciclo1Leitura })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Dificuldades de escrita"
          value={answers.ciclo1Escrita}
          onChange={(ciclo1Escrita) => set({ ciclo1Escrita })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Dificuldades de matemática"
          value={answers.ciclo1Matematica}
          onChange={(ciclo1Matematica) => set({ ciclo1Matematica })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Comportamento em sala"
          value={answers.ciclo1Comportamento}
          onChange={(ciclo1Comportamento) => set({ ciclo1Comportamento })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="2.º/3.º Ciclo e Secundário">
        <PiccaTextField
          label="Adaptação às mudanças de ciclo"
          value={answers.ciclo23Adaptacao}
          onChange={(ciclo23Adaptacao) => set({ ciclo23Adaptacao })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Organização do estudo"
          value={answers.ciclo23Organizacao}
          onChange={(ciclo23Organizacao) => set({ ciclo23Organizacao })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Motivação escolar"
          value={answers.ciclo23Motivacao}
          onChange={(ciclo23Motivacao) => set({ ciclo23Motivacao })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Relação com professores"
          value={answers.ciclo23Professores}
          onChange={(ciclo23Professores) => set({ ciclo23Professores })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Relação com colegas"
          value={answers.ciclo23Colegas}
          onChange={(ciclo23Colegas) => set({ ciclo23Colegas })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="Funcionamento Académico Atual">
        <PiccaAcademicLevelMatrix
          rows={[...PICCA_MOD6_ACADEMIC_ROWS]}
          value={answers.academicoAtual}
          onChange={(academicoAtual) => set({ academicoAtual })}
          readOnly={readOnly}
        />
      </PiccaSection>

      <PiccaSection title="Apoios Educativos">
        <PiccaCheckboxGroup
          options={APOIOS}
          value={answers.apoiosEducativos}
          onChange={(apoiosEducativos) => set({ apoiosEducativos })}
          readOnly={readOnly}
        />
        {answers.apoiosEducativos.includes('outro') && (
          <PiccaTextField
            label="Outro apoio"
            value={answers.apoiosOutro}
            onChange={(apoiosOutro) => set({ apoiosOutro })}
            readOnly={readOnly}
          />
        )}
      </PiccaSection>

      <PiccaSection title="Participação Escolar">
        <PiccaTextField
          label="Assiduidade"
          value={answers.assiduidade}
          onChange={(assiduidade) => set({ assiduidade })}
          readOnly={readOnly}
        />
        <PiccaTextField
          label="Pontualidade"
          value={answers.pontualidade}
          onChange={(pontualidade) => set({ pontualidade })}
          readOnly={readOnly}
        />
        <PiccaTextField
          label="Participação em sala"
          value={answers.participacaoSala}
          onChange={(participacaoSala) => set({ participacaoSala })}
          readOnly={readOnly}
        />
        <PiccaTextField
          label="Autonomia nas tarefas"
          value={answers.autonomiaTarefas}
          onChange={(autonomiaTarefas) => set({ autonomiaTarefas })}
          readOnly={readOnly}
        />
      </PiccaSection>

      <PiccaSection title="Integração Clínica">
        <PiccaTextField
          label="Fatores protetores escolares"
          value={answers.integracaoProtetores}
          onChange={(integracaoProtetores) => set({ integracaoProtetores })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Fatores de risco escolares"
          value={answers.integracaoRiscos}
          onChange={(integracaoRiscos) => set({ integracaoRiscos })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Impacto funcional"
          value={answers.integracaoImpacto}
          onChange={(integracaoImpacto) => set({ integracaoImpacto })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Necessidades educativas"
          value={answers.integracaoNecessidades}
          onChange={(integracaoNecessidades) => set({ integracaoNecessidades })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Recomendações iniciais"
          value={answers.integracaoRecomendacoes}
          onChange={(integracaoRecomendacoes) => set({ integracaoRecomendacoes })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="Notas para o Psicólogo">
        <PiccaReadOnlyText>
          Integrar a informação escolar com os resultados da avaliação psicológica, observação
          clínica e anamnese. Identificar fatores precipitantes e de manutenção associados ao
          contexto escolar e preparar recomendações pedagógicas.
        </PiccaReadOnlyText>
      </PiccaSection>
    </div>
  )
}
