import { PiccaEditableDataTable, PiccaReadOnlyText, PiccaSection, PiccaTextField } from '../../PiccaFields'
import styles from '../../PiccaForm.module.css'
import {
  mergePiccaVol6SinteseAnswers,
  type PiccaVol6HipoteseRow,
  type PiccaVol6SinteseAnswers,
} from './piccaVol6Answers'
import { PICCA_VOL6_SINTESE_TEXT_FIELDS } from './piccaVol6Content'
import { PICCA_VOL6_SINTESE_GROUPS } from './piccaVol6SinteseContent'
import { PiccaVol6ChecklistTable } from './PiccaVol6ChecklistTable'

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

export function PiccaVol6SinteseForm({ value, onChange, readOnly }: Props) {
  const answers = mergePiccaVol6SinteseAnswers(value)

  function set(patch: Partial<PiccaVol6SinteseAnswers>) {
    onChange({ ...answers, ...patch })
  }

  return (
    <div className={styles.form}>
      <PiccaReadOnlyText>
        Integração transversal dos checklists de neurodesenvolvimento, formulação de hipóteses e
        definição dos próximos passos clínicos.
      </PiccaReadOnlyText>

      {PICCA_VOL6_SINTESE_GROUPS.map((group) => (
        <PiccaSection key={group.id} title={group.title}>
          <PiccaVol6ChecklistTable
            items={group.items}
            value={answers.indicadores}
            onChange={(indicadores) => set({ indicadores })}
            readOnly={readOnly}
          />
        </PiccaSection>
      ))}

      <PiccaSection title="Mapa de hipóteses">
        <PiccaEditableDataTable
          columns={[...HIPOTESE_COLUMNS]}
          rows={answers.mapaHipoteses}
          onChange={(mapaHipoteses) => set({ mapaHipoteses: mapaHipoteses as PiccaVol6HipoteseRow[] })}
          readOnly={readOnly}
        />
      </PiccaSection>

      <PiccaSection title="Formulação integrada">
        {PICCA_VOL6_SINTESE_TEXT_FIELDS.map((field) => (
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
