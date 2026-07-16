import { FormField, TextArea, TextInput } from './FormFields'
import type { PatientFormRendererProps } from './formRegistry'
import styles from './FormFields.module.css'

export type QueixaInicialValues = {
  concernOrigin: string
  mainSymptoms: string
  concernStartAge: string
  interventionsAtHome: string
  interventionsAtSchool: string
  familyDynamicsEffect: string
  referredBy: string
  requestObjective: string
}

export const emptyQueixaInicialForm = (): QueixaInicialValues => ({
  concernOrigin: '',
  mainSymptoms: '',
  concernStartAge: '',
  interventionsAtHome: '',
  interventionsAtSchool: '',
  familyDynamicsEffect: '',
  referredBy: '',
  requestObjective: '',
})

function mergeValues(values: Record<string, unknown>): QueixaInicialValues {
  return { ...emptyQueixaInicialForm(), ...values } as QueixaInicialValues
}

export function QueixaInicialForm({ values, onChange, readOnly }: PatientFormRendererProps) {
  const form = mergeValues(values)

  function update<K extends keyof QueixaInicialValues>(key: K, value: QueixaInicialValues[K]) {
    onChange({ ...form, [key]: value })
  }

  return (
    <div className={`${styles.form} ${readOnly ? styles.readOnly : ''}`}>
      <FormField
        label="Como surgiu a preocupação/o diagnóstico para o pedido de consulta?"
        htmlFor="concernOrigin"
        required
      >
        <TextArea
          id="concernOrigin"
          value={form.concernOrigin}
          onChange={(event) => update('concernOrigin', event.target.value)}
          readOnly={readOnly}
          required
        />
      </FormField>

      <FormField
        label="Quais foram os principais sintomas/sinais observados?"
        htmlFor="mainSymptoms"
      >
        <TextArea
          id="mainSymptoms"
          value={form.mainSymptoms}
          onChange={(event) => update('mainSymptoms', event.target.value)}
          readOnly={readOnly}
        />
      </FormField>

      <FormField
        label="Que idade tinha quando as preocupações tiveram início?"
        htmlFor="concernStartAge"
      >
        <TextInput
          id="concernStartAge"
          value={form.concernStartAge}
          onChange={(event) => update('concernStartAge', event.target.value)}
          readOnly={readOnly}
          placeholder="Ex.: 6 anos"
        />
      </FormField>

      <h3 className={styles.sectionTitle}>O que é que já foi feito para melhorar estas questões?</h3>

      <FormField label="Em casa (rotinas; dinâmica familiar, etc.)" htmlFor="interventionsAtHome">
        <TextArea
          id="interventionsAtHome"
          value={form.interventionsAtHome}
          onChange={(event) => update('interventionsAtHome', event.target.value)}
          readOnly={readOnly}
        />
      </FormField>

      <FormField label="Na escola (apoios, etc.)" htmlFor="interventionsAtSchool">
        <TextArea
          id="interventionsAtSchool"
          value={form.interventionsAtSchool}
          onChange={(event) => update('interventionsAtSchool', event.target.value)}
          readOnly={readOnly}
        />
      </FormField>

      <FormField
        label="Qual o efeito deste diagnóstico/das preocupações na dinâmica familiar? (houve alterações ou não?)"
        htmlFor="familyDynamicsEffect"
      >
        <TextArea
          id="familyDynamicsEffect"
          value={form.familyDynamicsEffect}
          onChange={(event) => update('familyDynamicsEffect', event.target.value)}
          readOnly={readOnly}
        />
      </FormField>

      <FormField label="Foi encaminhado por quem? (recomendação)" htmlFor="referredBy">
        <TextInput
          id="referredBy"
          value={form.referredBy}
          onChange={(event) => update('referredBy', event.target.value)}
          readOnly={readOnly}
        />
      </FormField>

      <FormField
        label="Com que objetivo é realizado este pedido?"
        htmlFor="requestObjective"
        required
      >
        <TextArea
          id="requestObjective"
          value={form.requestObjective}
          onChange={(event) => update('requestObjective', event.target.value)}
          readOnly={readOnly}
          placeholder="Ex.: início de consultas de acompanhamento, avaliação neuropsicológica para despiste de dificuldades, por precaução, etc."
          required
        />
      </FormField>
    </div>
  )
}
