import { FormField, TextInput } from './FormFields'
import styles from './FormFields.module.css'

export type ConsentFormValues = {
  readAndUnderstood: boolean
  consentToTreatment: boolean
  consentToDataProcessing: boolean
  signatureName: string
  signedAt: string
}

export const emptyConsentForm = (): ConsentFormValues => ({
  readAndUnderstood: false,
  consentToTreatment: false,
  consentToDataProcessing: false,
  signatureName: '',
  signedAt: new Date().toISOString().slice(0, 10),
})

type Props = {
  values: ConsentFormValues
  onChange: (values: ConsentFormValues) => void
  readOnly?: boolean
}

export function ConsentForm({ values, onChange, readOnly }: Props) {
  function update<K extends keyof ConsentFormValues>(key: K, value: ConsentFormValues[K]) {
    onChange({ ...values, [key]: value })
  }

  return (
    <div className={`${styles.form} ${readOnly ? styles.readOnly : ''}`}>
      <p>
        Declaro que li e compreendi a informação sobre o acompanhamento psicológico e o tratamento dos
        meus dados pessoais, incluindo a política de proteção de dados da clínica.
      </p>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={values.readAndUnderstood}
          onChange={(e) => update('readAndUnderstood', e.target.checked)}
          disabled={readOnly}
          required
        />
        Li e compreendi a informação prestada
      </label>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={values.consentToTreatment}
          onChange={(e) => update('consentToTreatment', e.target.checked)}
          disabled={readOnly}
          required
        />
        Dou o meu consentimento informado para acompanhamento psicológico
      </label>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={values.consentToDataProcessing}
          onChange={(e) => update('consentToDataProcessing', e.target.checked)}
          disabled={readOnly}
          required
        />
        Autorizo o tratamento dos meus dados pessoais para efeitos clínicos
      </label>
      <FormField label="Assinatura (nome completo)" htmlFor="signatureName" required>
        <TextInput
          id="signatureName"
          value={values.signatureName}
          onChange={(e) => update('signatureName', e.target.value)}
          readOnly={readOnly}
          required
        />
      </FormField>
      <FormField label="Data" htmlFor="signedAt" required>
        <TextInput
          id="signedAt"
          type="date"
          value={values.signedAt}
          onChange={(e) => update('signedAt', e.target.value)}
          readOnly={readOnly}
          required
        />
      </FormField>
    </div>
  )
}
