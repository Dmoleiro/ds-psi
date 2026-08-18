import { PiccaEditableDataTable, PiccaReadOnlyText, PiccaSection, PiccaTextField } from '../../PiccaFields'
import styles from '../../PiccaForm.module.css'
import {
  mergePiccaVol7SinteseAnswers,
  type PiccaVol7HipoteseRow,
  type PiccaVol7SinteseAnswers,
} from './piccaVol7SinteseAnswers'
import { PICCA_VOL7_SINTESE_GROUPS, PICCA_VOL7_SINTESE_TEXT_FIELDS } from './piccaVol7SinteseContent'
import { PiccaVol7ChecklistTable } from './PiccaVol7ChecklistTable'

type Props = {
  value: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
  readOnly?: boolean
}

const HIPOTESE_COLUMNS = [
  { key: 'hipotese', label: 'Hipótese' },
  { key: 'evidenciaAFavor', label: 'Evidência a favor' },
  { key: 'evidenciaContra', label: 'Evidência contra' },
  { key: 'dadosEmFalta', label: 'Dados em falta' },
  { key: 'estado', label: 'Estado' },
] as const

export function PiccaVol7SinteseForm({ value, onChange, readOnly }: Props) {
  const answers = mergePiccaVol7SinteseAnswers(value)

  function set(patch: Partial<PiccaVol7SinteseAnswers>) {
    onChange({ ...answers, ...patch })
  }

  return (
    <div className={styles.form}>
      <PiccaReadOnlyText>
        Integração transversal dos checklists clínicos DC:0–5 (Volume VII), formulação de hipóteses
        e definição dos próximos passos clínicos. Complementar aos módulos individuais por perturbação.
      </PiccaReadOnlyText>

      {PICCA_VOL7_SINTESE_GROUPS.map((group) => (
        <PiccaSection key={group.id} title={group.title}>
          <PiccaVol7ChecklistTable
            items={group.items}
            threeColumn={false}
            value={answers.indicadores}
            onChange={(indicadores) => set({ indicadores })}
            readOnly={readOnly}
          />
        </PiccaSection>
      ))}

      <PiccaSection title="Checklists específicos utilizados">
        <PiccaTextField
          label="Indicar quais checklists por perturbação foram aplicados e principais conclusões"
          value={answers.checklistsUtilizados}
          onChange={(checklistsUtilizados) => set({ checklistsUtilizados })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="Mapa de hipóteses">
        <PiccaEditableDataTable
          columns={[...HIPOTESE_COLUMNS]}
          rows={answers.mapaHipoteses}
          onChange={(mapaHipoteses) => set({ mapaHipoteses: mapaHipoteses as PiccaVol7HipoteseRow[] })}
          readOnly={readOnly}
        />
      </PiccaSection>

      <PiccaSection title="Formulação integrada">
        {PICCA_VOL7_SINTESE_TEXT_FIELDS.map((field) => (
          <PiccaTextField
            key={field}
            label={field}
            value={answers.textos[field] ?? ''}
            onChange={(text) => set({ textos: { ...answers.textos, [field]: text } })}
            readOnly={readOnly}
            multiline
          />
        ))}
      </PiccaSection>
    </div>
  )
}
