import { FormField, TextArea, TextInput, Select } from './FormFields'
import styles from './FormFields.module.css'

export type IntakeFormValues = {
  fullName: string
  birthDate: string
  email: string
  phone: string
  address: string
  emergencyContact: string
  emergencyPhone: string
  reasonForVisit: string
  previousTherapy: string
  previousTherapyDetails: string
  medications: string
  generalNotes: string
}

export const emptyIntakeForm: IntakeFormValues = {
  fullName: '',
  birthDate: '',
  email: '',
  phone: '',
  address: '',
  emergencyContact: '',
  emergencyPhone: '',
  reasonForVisit: '',
  previousTherapy: '',
  previousTherapyDetails: '',
  medications: '',
  generalNotes: '',
}

type Props = {
  values: IntakeFormValues
  onChange: (values: IntakeFormValues) => void
  readOnly?: boolean
}

export function IntakeForm({ values, onChange, readOnly }: Props) {
  function update<K extends keyof IntakeFormValues>(key: K, value: IntakeFormValues[K]) {
    onChange({ ...values, [key]: value })
  }

  return (
    <div className={`${styles.form} ${readOnly ? styles.readOnly : ''}`}>
      <FormField label="Nome completo" htmlFor="fullName" required>
        <TextInput
          id="fullName"
          value={values.fullName}
          onChange={(e) => update('fullName', e.target.value)}
          readOnly={readOnly}
          required
        />
      </FormField>
      <FormField label="Data de nascimento" htmlFor="birthDate">
        <TextInput
          id="birthDate"
          type="date"
          value={values.birthDate}
          onChange={(e) => update('birthDate', e.target.value)}
          readOnly={readOnly}
        />
      </FormField>
      <FormField label="Email" htmlFor="email">
        <TextInput
          id="email"
          type="email"
          value={values.email}
          onChange={(e) => update('email', e.target.value)}
          readOnly={readOnly}
        />
      </FormField>
      <FormField label="Telefone" htmlFor="phone">
        <TextInput
          id="phone"
          value={values.phone}
          onChange={(e) => update('phone', e.target.value)}
          readOnly={readOnly}
        />
      </FormField>
      <FormField label="Morada" htmlFor="address">
        <TextInput
          id="address"
          value={values.address}
          onChange={(e) => update('address', e.target.value)}
          readOnly={readOnly}
        />
      </FormField>
      <FormField label="Contacto de emergência" htmlFor="emergencyContact">
        <TextInput
          id="emergencyContact"
          value={values.emergencyContact}
          onChange={(e) => update('emergencyContact', e.target.value)}
          readOnly={readOnly}
        />
      </FormField>
      <FormField label="Telefone de emergência" htmlFor="emergencyPhone">
        <TextInput
          id="emergencyPhone"
          value={values.emergencyPhone}
          onChange={(e) => update('emergencyPhone', e.target.value)}
          readOnly={readOnly}
        />
      </FormField>
      <FormField label="Motivo da consulta" htmlFor="reasonForVisit" required>
        <TextArea
          id="reasonForVisit"
          value={values.reasonForVisit}
          onChange={(e) => update('reasonForVisit', e.target.value)}
          readOnly={readOnly}
          required
        />
      </FormField>
      <FormField label="Terapia anterior" htmlFor="previousTherapy">
        <Select
          id="previousTherapy"
          value={values.previousTherapy}
          onChange={(e) => update('previousTherapy', e.target.value)}
          disabled={readOnly}
        >
          <option value="">Selecionar</option>
          <option value="yes">Sim</option>
          <option value="no">Não</option>
        </Select>
      </FormField>
      {values.previousTherapy === 'yes' && (
        <FormField label="Detalhes da terapia anterior" htmlFor="previousTherapyDetails">
          <TextArea
            id="previousTherapyDetails"
            value={values.previousTherapyDetails}
            onChange={(e) => update('previousTherapyDetails', e.target.value)}
            readOnly={readOnly}
          />
        </FormField>
      )}
      <FormField label="Medicação atual" htmlFor="medications">
        <TextArea
          id="medications"
          value={values.medications}
          onChange={(e) => update('medications', e.target.value)}
          readOnly={readOnly}
        />
      </FormField>
      <FormField label="Notas adicionais" htmlFor="generalNotes">
        <TextArea
          id="generalNotes"
          value={values.generalNotes}
          onChange={(e) => update('generalNotes', e.target.value)}
          readOnly={readOnly}
        />
      </FormField>
    </div>
  )
}
