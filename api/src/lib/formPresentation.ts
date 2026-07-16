type FormFieldLabels = Record<string, string>

const FORM_FIELD_LABELS: Record<string, FormFieldLabels> = {
  intake: {
    fullName: 'Nome completo',
    birthDate: 'Data de nascimento',
    email: 'Email',
    phone: 'Telefone',
    address: 'Morada',
    emergencyContact: 'Contacto de emergência',
    emergencyPhone: 'Telefone de emergência',
    reasonForVisit: 'Motivo da consulta',
    previousTherapy: 'Terapia anterior',
    previousTherapyDetails: 'Detalhes da terapia anterior',
    medications: 'Medicação atual',
    generalNotes: 'Notas adicionais',
  },
  consent: {
    readAndUnderstood: 'Li e compreendi a informação prestada',
    consentToTreatment: 'Consentimento para acompanhamento psicológico',
    consentToDataProcessing: 'Autorização de tratamento de dados pessoais',
    signatureName: 'Assinatura (nome completo)',
    signedAt: 'Data',
  },
  history: {
    developmentConcerns: 'Preocupações de desenvolvimento',
    schoolHistory: 'Historial escolar',
    familyHistory: 'Historial familiar relevante',
    medicalHistory: 'Historial médico',
    currentDifficulties: 'Dificuldades atuais',
    strengths: 'Pontos fortes',
    goals: 'Objetivos do acompanhamento',
    additionalInfo: 'Informação adicional',
  },
  'ficha-inscricao': {
    recordedAt: 'Data e hora',
    childName: 'Nome da criança/jovem',
    address: 'Morada',
    postalCodeLocality: 'Código postal e localidade',
    nif: 'NIF',
    birthDate: 'Data de nascimento',
    childPhone: 'Telefone/telemóvel da criança/jovem',
    childEmail: 'Email da criança/jovem',
    healthConditions: 'Condições de saúde a assinalar',
    insuranceNumber: 'Número do seguro',
    insurer: 'Seguradora',
    schoolName: 'Escola',
    schoolYear: 'Ano de escolaridade',
    retentionsCount: 'Número de retenções',
    reasonForRequest: 'Dificuldades conhecidas / motivo do pedido',
    guardianName: 'Nome do encarregado de educação / responsável',
    relationshipType: 'Tipo de parentesco',
    profession: 'Profissão',
    guardianPhone: 'Telefone / telemóvel do responsável',
    guardianEmail: 'Email de contacto do responsável',
    declarationAccepted: 'Declaração de veracidade e consentimento',
    additionalInfo: 'Informações adicionais',
    signatureName: 'Assinatura',
    signedAt: 'Data da assinatura',
  },
}

const FIELD_ORDER: Record<string, string[]> = {
  intake: [
    'fullName',
    'birthDate',
    'email',
    'phone',
    'address',
    'emergencyContact',
    'emergencyPhone',
    'reasonForVisit',
    'previousTherapy',
    'previousTherapyDetails',
    'medications',
    'generalNotes',
  ],
  consent: [
    'readAndUnderstood',
    'consentToTreatment',
    'consentToDataProcessing',
    'signatureName',
    'signedAt',
  ],
  history: [
    'developmentConcerns',
    'schoolHistory',
    'familyHistory',
    'medicalHistory',
    'currentDifficulties',
    'strengths',
    'goals',
    'additionalInfo',
  ],
  'ficha-inscricao': [
    'recordedAt',
    'childName',
    'address',
    'postalCodeLocality',
    'nif',
    'birthDate',
    'childPhone',
    'childEmail',
    'healthConditions',
    'insuranceNumber',
    'insurer',
    'schoolName',
    'schoolYear',
    'retentionsCount',
    'reasonForRequest',
    'guardianName',
    'relationshipType',
    'profession',
    'guardianPhone',
    'guardianEmail',
    'declarationAccepted',
    'additionalInfo',
    'signatureName',
    'signedAt',
  ],
}

export type FormattedField = {
  key: string
  label: string
  value: string
}

function formatValue(key: string, value: unknown): string | null {
  if (value === null || value === undefined) return null
  if (typeof value === 'boolean') return value ? 'Sim' : 'Não'
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return null
    if (key === 'previousTherapy') {
      if (trimmed === 'yes') return 'Sim'
      if (trimmed === 'no') return 'Não'
    }
    if (key === 'birthDate' || key === 'signedAt') {
      const date = new Date(`${trimmed}T12:00:00`)
      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleDateString('pt-PT')
      }
    }
    if (key === 'recordedAt') {
      const date = new Date(trimmed)
      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleString('pt-PT')
      }
    }
    return trimmed
  }
  return String(value)
}

export function formatFormAnswers(
  formId: string,
  answers: Record<string, unknown>,
): FormattedField[] {
  const labels = FORM_FIELD_LABELS[formId] ?? {}
  const order = FIELD_ORDER[formId] ?? Object.keys(answers)
  const seen = new Set<string>()

  const fields: FormattedField[] = []
  for (const key of order) {
    const value = formatValue(key, answers[key])
    if (value === null) continue
    fields.push({
      key,
      label: labels[key] ?? key,
      value,
    })
    seen.add(key)
  }

  for (const [key, raw] of Object.entries(answers)) {
    if (seen.has(key)) continue
    const value = formatValue(key, raw)
    if (value === null) continue
    fields.push({
      key,
      label: labels[key] ?? key,
      value,
    })
  }

  return fields
}

export function formatFormAnswersText(formId: string, answers: Record<string, unknown>): string {
  return formatFormAnswers(formId, answers)
    .map((field) => `${field.label}: ${field.value}`)
    .join('\n')
}
