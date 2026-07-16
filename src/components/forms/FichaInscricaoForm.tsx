import { FormField, TextArea, TextInput } from './FormFields'
import type { PatientFormRendererProps } from './formRegistry'
import styles from './FormFields.module.css'

export type FichaInscricaoValues = {
  recordedAt: string
  childName: string
  address: string
  postalCodeLocality: string
  nif: string
  birthDate: string
  childPhone: string
  childEmail: string
  healthConditions: string
  insuranceNumber: string
  insurer: string
  schoolName: string
  schoolYear: string
  retentionsCount: string
  reasonForRequest: string
  guardianName: string
  relationshipType: string
  profession: string
  guardianPhone: string
  guardianEmail: string
  declarationAccepted: boolean
  additionalInfo: string
  signatureName: string
  signedAt: string
}

function currentDateTimeLocal(): string {
  const now = new Date()
  const offset = now.getTimezoneOffset()
  const local = new Date(now.getTime() - offset * 60_000)
  return local.toISOString().slice(0, 16)
}

function currentDateLocal(): string {
  return new Date().toISOString().slice(0, 10)
}

export function emptyFichaInscricaoForm(): FichaInscricaoValues {
  return {
    recordedAt: currentDateTimeLocal(),
    childName: '',
    address: '',
    postalCodeLocality: '',
    nif: '',
    birthDate: '',
    childPhone: '',
    childEmail: '',
    healthConditions: '',
    insuranceNumber: '',
    insurer: '',
    schoolName: '',
    schoolYear: '',
    retentionsCount: '',
    reasonForRequest: '',
    guardianName: '',
    relationshipType: '',
    profession: '',
    guardianPhone: '',
    guardianEmail: '',
    declarationAccepted: false,
    additionalInfo: '',
    signatureName: '',
    signedAt: currentDateLocal(),
  }
}

function mergeValues(values: Record<string, unknown>): FichaInscricaoValues {
  const defaults = emptyFichaInscricaoForm()
  const merged = { ...defaults, ...values } as FichaInscricaoValues
  if (!values.recordedAt) merged.recordedAt = defaults.recordedAt
  if (!values.signedAt) merged.signedAt = defaults.signedAt
  return merged
}

export function FichaInscricaoForm({ values, onChange, readOnly }: PatientFormRendererProps) {
  const form = mergeValues(values)

  function update<K extends keyof FichaInscricaoValues>(key: K, value: FichaInscricaoValues[K]) {
    onChange({ ...form, [key]: value })
  }

  return (
    <div className={`${styles.form} ${readOnly ? styles.readOnly : ''}`}>
      <h3 className={styles.sectionTitle}>Dados da criança/jovem</h3>

      <FormField label="Data e hora" htmlFor="recordedAt" required>
        <TextInput
          id="recordedAt"
          type="datetime-local"
          value={form.recordedAt}
          onChange={(event) => update('recordedAt', event.target.value)}
          readOnly={readOnly}
          required
        />
      </FormField>

      <FormField label="Nome da criança/jovem" htmlFor="childName" required>
        <TextInput
          id="childName"
          value={form.childName}
          onChange={(event) => update('childName', event.target.value)}
          readOnly={readOnly}
          required
        />
      </FormField>

      <FormField label="Morada" htmlFor="address">
        <TextInput
          id="address"
          value={form.address}
          onChange={(event) => update('address', event.target.value)}
          readOnly={readOnly}
        />
      </FormField>

      <FormField label="Código postal e localidade" htmlFor="postalCodeLocality">
        <TextInput
          id="postalCodeLocality"
          value={form.postalCodeLocality}
          onChange={(event) => update('postalCodeLocality', event.target.value)}
          readOnly={readOnly}
        />
      </FormField>

      <FormField label="NIF" htmlFor="nif">
        <TextInput
          id="nif"
          value={form.nif}
          onChange={(event) => update('nif', event.target.value)}
          readOnly={readOnly}
        />
      </FormField>

      <FormField label="Data de nascimento" htmlFor="birthDate">
        <TextInput
          id="birthDate"
          type="date"
          value={form.birthDate}
          onChange={(event) => update('birthDate', event.target.value)}
          readOnly={readOnly}
        />
      </FormField>

      <FormField label="Telefone/telemóvel" htmlFor="childPhone">
        <TextInput
          id="childPhone"
          type="tel"
          value={form.childPhone}
          onChange={(event) => update('childPhone', event.target.value)}
          readOnly={readOnly}
          placeholder="Se diferente do encarregado de educação / responsável"
        />
      </FormField>

      <FormField label="Email" htmlFor="childEmail">
        <TextInput
          id="childEmail"
          type="email"
          value={form.childEmail}
          onChange={(event) => update('childEmail', event.target.value)}
          readOnly={readOnly}
          placeholder="Se diferente do email do encarregado de educação / responsável"
        />
      </FormField>

      <FormField label="Condições de saúde a assinalar" htmlFor="healthConditions">
        <TextArea
          id="healthConditions"
          value={form.healthConditions}
          onChange={(event) => update('healthConditions', event.target.value)}
          readOnly={readOnly}
          placeholder="Alergias, medicação recorrente ou outras"
        />
      </FormField>

      <FormField label="Número do seguro" htmlFor="insuranceNumber">
        <TextInput
          id="insuranceNumber"
          value={form.insuranceNumber}
          onChange={(event) => update('insuranceNumber', event.target.value)}
          readOnly={readOnly}
        />
      </FormField>

      <FormField label="Seguradora" htmlFor="insurer">
        <TextInput
          id="insurer"
          value={form.insurer}
          onChange={(event) => update('insurer', event.target.value)}
          readOnly={readOnly}
        />
      </FormField>

      <h3 className={styles.sectionTitle}>Escola</h3>

      <FormField label="Escola em que está inserido/a" htmlFor="schoolName">
        <TextInput
          id="schoolName"
          value={form.schoolName}
          onChange={(event) => update('schoolName', event.target.value)}
          readOnly={readOnly}
        />
      </FormField>

      <FormField label="Ano de escolaridade" htmlFor="schoolYear">
        <TextInput
          id="schoolYear"
          value={form.schoolYear}
          onChange={(event) => update('schoolYear', event.target.value)}
          readOnly={readOnly}
        />
      </FormField>

      <FormField label="Número de retenções" htmlFor="retentionsCount">
        <TextInput
          id="retentionsCount"
          value={form.retentionsCount}
          onChange={(event) => update('retentionsCount', event.target.value)}
          readOnly={readOnly}
        />
      </FormField>

      <h3 className={styles.sectionTitle}>Motivo do pedido</h3>

      <FormField label="Dificuldades conhecidas / motivo do pedido" htmlFor="reasonForRequest" required>
        <TextArea
          id="reasonForRequest"
          value={form.reasonForRequest}
          onChange={(event) => update('reasonForRequest', event.target.value)}
          readOnly={readOnly}
          required
        />
      </FormField>

      <h3 className={styles.sectionTitle}>Encarregado de educação / responsável</h3>

      <FormField label="Nome" htmlFor="guardianName" required>
        <TextInput
          id="guardianName"
          value={form.guardianName}
          onChange={(event) => update('guardianName', event.target.value)}
          readOnly={readOnly}
          required
        />
      </FormField>

      <FormField label="Tipo de parentesco" htmlFor="relationshipType" required>
        <TextInput
          id="relationshipType"
          value={form.relationshipType}
          onChange={(event) => update('relationshipType', event.target.value)}
          readOnly={readOnly}
          placeholder="Ex.: mãe, pai, avó, tutor legal"
          required
        />
      </FormField>

      <FormField label="Profissão" htmlFor="profession">
        <TextInput
          id="profession"
          value={form.profession}
          onChange={(event) => update('profession', event.target.value)}
          readOnly={readOnly}
        />
      </FormField>

      <FormField label="Telefone / telemóvel" htmlFor="guardianPhone">
        <TextInput
          id="guardianPhone"
          type="tel"
          value={form.guardianPhone}
          onChange={(event) => update('guardianPhone', event.target.value)}
          readOnly={readOnly}
        />
      </FormField>

      <FormField label="Email de contacto" htmlFor="guardianEmail">
        <TextInput
          id="guardianEmail"
          type="email"
          value={form.guardianEmail}
          onChange={(event) => update('guardianEmail', event.target.value)}
          readOnly={readOnly}
        />
      </FormField>

      <h3 className={styles.sectionTitle}>Declaração e assinatura</h3>

      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={form.declarationAccepted}
          onChange={(event) => update('declarationAccepted', event.target.checked)}
          disabled={readOnly}
          required
        />
        Declaro que as informações descritas acima são verdadeiras e foram consentidas por mim
      </label>

      <FormField label="Informações adicionais" htmlFor="additionalInfo">
        <TextArea
          id="additionalInfo"
          value={form.additionalInfo}
          onChange={(event) => update('additionalInfo', event.target.value)}
          readOnly={readOnly}
          placeholder="Adicione informações que considere relevantes"
        />
      </FormField>

      <FormField label="Assinatura (nome completo)" htmlFor="signatureName" required>
        <TextInput
          id="signatureName"
          value={form.signatureName}
          onChange={(event) => update('signatureName', event.target.value)}
          readOnly={readOnly}
          required
        />
      </FormField>

      <FormField label="Data" htmlFor="signedAt" required>
        <TextInput
          id="signedAt"
          type="date"
          value={form.signedAt}
          onChange={(event) => update('signedAt', event.target.value)}
          readOnly={readOnly}
          required
        />
      </FormField>
    </div>
  )
}
