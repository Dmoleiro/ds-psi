import { FormField, TextArea } from './FormFields'
import styles from './FormFields.module.css'

export type HistoryFormValues = {
  developmentConcerns: string
  schoolHistory: string
  familyHistory: string
  medicalHistory: string
  currentDifficulties: string
  strengths: string
  goals: string
  additionalInfo: string
}

export const emptyHistoryForm: HistoryFormValues = {
  developmentConcerns: '',
  schoolHistory: '',
  familyHistory: '',
  medicalHistory: '',
  currentDifficulties: '',
  strengths: '',
  goals: '',
  additionalInfo: '',
}

type Props = {
  values: HistoryFormValues
  onChange: (values: HistoryFormValues) => void
  readOnly?: boolean
}

export function HistoryForm({ values, onChange, readOnly }: Props) {
  function update<K extends keyof HistoryFormValues>(key: K, value: HistoryFormValues[K]) {
    onChange({ ...values, [key]: value })
  }

  return (
    <div className={`${styles.form} ${readOnly ? styles.readOnly : ''}`}>
      <FormField label="Preocupações de desenvolvimento" htmlFor="developmentConcerns">
        <TextArea
          id="developmentConcerns"
          value={values.developmentConcerns}
          onChange={(e) => update('developmentConcerns', e.target.value)}
          readOnly={readOnly}
        />
      </FormField>
      <FormField label="Historial escolar" htmlFor="schoolHistory">
        <TextArea
          id="schoolHistory"
          value={values.schoolHistory}
          onChange={(e) => update('schoolHistory', e.target.value)}
          readOnly={readOnly}
        />
      </FormField>
      <FormField label="Historial familiar relevante" htmlFor="familyHistory">
        <TextArea
          id="familyHistory"
          value={values.familyHistory}
          onChange={(e) => update('familyHistory', e.target.value)}
          readOnly={readOnly}
        />
      </FormField>
      <FormField label="Historial médico" htmlFor="medicalHistory">
        <TextArea
          id="medicalHistory"
          value={values.medicalHistory}
          onChange={(e) => update('medicalHistory', e.target.value)}
          readOnly={readOnly}
        />
      </FormField>
      <FormField label="Dificuldades atuais" htmlFor="currentDifficulties" required>
        <TextArea
          id="currentDifficulties"
          value={values.currentDifficulties}
          onChange={(e) => update('currentDifficulties', e.target.value)}
          readOnly={readOnly}
          required
        />
      </FormField>
      <FormField label="Pontos fortes" htmlFor="strengths">
        <TextArea
          id="strengths"
          value={values.strengths}
          onChange={(e) => update('strengths', e.target.value)}
          readOnly={readOnly}
        />
      </FormField>
      <FormField label="Objetivos do acompanhamento" htmlFor="goals" required>
        <TextArea
          id="goals"
          value={values.goals}
          onChange={(e) => update('goals', e.target.value)}
          readOnly={readOnly}
          required
        />
      </FormField>
      <FormField label="Informação adicional" htmlFor="additionalInfo">
        <TextArea
          id="additionalInfo"
          value={values.additionalInfo}
          onChange={(e) => update('additionalInfo', e.target.value)}
          readOnly={readOnly}
        />
      </FormField>
    </div>
  )
}
