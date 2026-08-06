const FICHA_INSCRICAO_FIELD_LABELS: Record<string, string> = {
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
}

const QUEIXA_INICIAL_FIELD_LABELS: Record<string, string> = {
  concernOrigin: 'Como surgiu a preocupação/o diagnóstico',
  mainSymptoms: 'Principais sintomas/sinais',
  concernStartAge: 'Idade de início das preocupações',
  interventionsAtHome: 'Intervenções em casa',
  interventionsAtSchool: 'Intervenções na escola',
  familyDynamicsEffect: 'Efeito na dinâmica familiar',
  referredBy: 'Encaminhado por',
  requestObjective: 'Objetivo do pedido',
}

const FORM_FIELD_LABELS: Record<string, Record<string, string>> = {
  'ficha-inscricao': FICHA_INSCRICAO_FIELD_LABELS,
  'queixa-inicial': QUEIXA_INICIAL_FIELD_LABELS,
}

type ZodFlattenDetails = {
  fieldErrors?: Record<string, string[] | undefined>
  formErrors?: string[]
}

export function formatPatientFormValidationError(
  formId: string,
  details: unknown,
): string | null {
  if (!details || typeof details !== 'object') return null

  const flattened = details as ZodFlattenDetails
  const labels = FORM_FIELD_LABELS[formId] ?? {}
  const lines: string[] = []

  if (flattened.formErrors?.length) {
    lines.push(...flattened.formErrors.filter(Boolean))
  }

  if (flattened.fieldErrors) {
    for (const [field, messages] of Object.entries(flattened.fieldErrors)) {
      if (!messages?.length) continue
      const label = labels[field] ?? field
      lines.push(`${label}: ${messages.join(', ')}`)
    }
  }

  if (lines.length === 0) return null
  if (lines.length === 1) return lines[0]
  return `Verifique os seguintes campos:\n${lines.map((line) => `• ${line}`).join('\n')}`
}

export function resolvePatientFormErrorMessage(
  formId: string,
  message: string,
  details?: unknown,
): string {
  if (message && message !== 'Dados inválidos') {
    return message
  }

  return (
    formatPatientFormValidationError(formId, details) ??
    'Verifique os campos do formulário e tente novamente.'
  )
}
