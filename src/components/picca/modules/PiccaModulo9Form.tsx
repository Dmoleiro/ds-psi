import {
  PiccaCheckboxGroup,
  PiccaEditableDataTable,
  PiccaFixedRowTable,
  PiccaObjective,
  PiccaSection,
  PiccaTextField,
} from '../PiccaFields'
import styles from '../PiccaForm.module.css'
import {
  mergePiccaModulo9Answers,
  PICCA_MOD9_INDICADOR_COLUMNS,
  PICCA_MOD9_THERAPY_AREAS,
  type PiccaModulo9Answers,
} from './piccaModulo9'

const REAVALIACAO = [
  { id: '3_meses', label: '3 meses' },
  { id: '6_meses', label: '6 meses' },
  { id: '12_meses', label: '12 meses' },
  { id: 'outro', label: 'Outro' },
]

const THERAPY_COLUMNS = [
  { key: 'objetivo', label: 'Objetivo' },
  { key: 'estrategias', label: 'Estratégias' },
  { key: 'responsavel', label: 'Responsável' },
  { key: 'prazo', label: 'Prazo' },
]

type Props = {
  value: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
  readOnly?: boolean
}

export function PiccaModulo9Form({ value, onChange, readOnly }: Props) {
  const answers = mergePiccaModulo9Answers(value)

  function set(patch: Partial<PiccaModulo9Answers>) {
    onChange({ ...answers, ...patch })
  }

  return (
    <div className={styles.form}>
      <PiccaObjective>
        Definir um plano de intervenção individualizado, baseado na formulação de caso, estabelecendo
        objetivos terapêuticos, estratégias, indicadores de progresso e critérios de reavaliação.
      </PiccaObjective>

      <PiccaSection title="1. Diagnóstico Clínico / Hipóteses Diagnósticas">
        <PiccaTextField
          label="Diagnóstico / hipóteses"
          value={answers.diagnosticoHipoteses}
          onChange={(diagnosticoHipoteses) => set({ diagnosticoHipoteses })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="2. Prioridades de Intervenção">
        <PiccaTextField
          label="Prioridades"
          value={answers.prioridadesIntervencao}
          onChange={(prioridadesIntervencao) => set({ prioridadesIntervencao })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="3. Objetivos SMART">
        <PiccaTextField
          label="Objetivos SMART"
          value={answers.objetivosSmart}
          onChange={(objetivosSmart) => set({ objetivosSmart })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="4. Plano Terapêutico por Área">
        <PiccaFixedRowTable
          rows={[...PICCA_MOD9_THERAPY_AREAS]}
          columns={THERAPY_COLUMNS}
          value={answers.planoTerapeutico}
          onChange={(planoTerapeutico) =>
            set({
              planoTerapeutico: planoTerapeutico as PiccaModulo9Answers['planoTerapeutico'],
            })
          }
          readOnly={readOnly}
        />
      </PiccaSection>

      <PiccaSection title="5. Estratégias para a Família">
        <PiccaTextField
          label="Estratégias"
          value={answers.estrategiasFamilia}
          onChange={(estrategiasFamilia) => set({ estrategiasFamilia })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="6. Estratégias para a Escola">
        <PiccaTextField
          label="Estratégias"
          value={answers.estrategiasEscola}
          onChange={(estrategiasEscola) => set({ estrategiasEscola })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="7. Articulação Multidisciplinar">
        <PiccaTextField
          label="Articulação"
          value={answers.articulacaoMultidisciplinar}
          onChange={(articulacaoMultidisciplinar) => set({ articulacaoMultidisciplinar })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="8. Indicadores de Evolução">
        <PiccaEditableDataTable
          columns={[...PICCA_MOD9_INDICADOR_COLUMNS]}
          rows={answers.indicadoresEvolucao}
          onChange={(indicadoresEvolucao) => set({ indicadoresEvolucao })}
          readOnly={readOnly}
        />
      </PiccaSection>

      <PiccaSection title="9. Cronograma de Reavaliação">
        <PiccaCheckboxGroup
          options={REAVALIACAO}
          value={answers.reavaliacao}
          onChange={(reavaliacao) => set({ reavaliacao })}
          readOnly={readOnly}
        />
        {answers.reavaliacao.includes('outro') && (
          <PiccaTextField
            label="Outro prazo"
            value={answers.reavaliacaoOutro}
            onChange={(reavaliacaoOutro) => set({ reavaliacaoOutro })}
            readOnly={readOnly}
          />
        )}
      </PiccaSection>

      <PiccaSection title="10. Critérios de Alta / Continuidade">
        <PiccaTextField
          label="Critérios"
          value={answers.criteriosAlta}
          onChange={(criteriosAlta) => set({ criteriosAlta })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="11. Notas Clínicas">
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
