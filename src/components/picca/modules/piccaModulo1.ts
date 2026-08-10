export type PiccaCaregiverInfo = {
  nome: string
  idade: string
  escolaridade: string
  profissao: string
  contacto: string
}

export type PiccaModulo1Answers = {
  nomeCompleto: string
  dataNascimento: string
  idade: string
  sexo: string
  anoEscolaridade: string
  escola: string
  turma: string
  professor: string
  morada: string
  contacto: string
  nif: string
  sns: string
  seguroSaude: string
  mae: PiccaCaregiverInfo
  pai: PiccaCaregiverInfo
  outrosCuidadoresQuem: string
  outroCuidador: PiccaCaregiverInfo
  encaminhado: string[]
  encaminhadoOutro: string
  motivoPrincipal: string
  consultaPsicologia: '' | 'sim' | 'nao'
  consultaPsicologiaMotivo: string
  objetivos: string[]
  objetivosOutro: string
  principaisPreocupacoes: string
  consultaOutraEspecialidade: '' | 'sim' | 'nao'
  consultaOutraEspecialidadeQual: string
  consultaOutraEspecialidadeMotivo: string
  consultaOutraEspecialidadeResultado: string
  sintesePreocupacoes: string
  sintesePredisponentes: string
  sinteseProtetores: string
  sinteseHipoteses: string
}

const emptyCaregiver = (): PiccaCaregiverInfo => ({
  nome: '',
  idade: '',
  escolaridade: '',
  profissao: '',
  contacto: '',
})

export const defaultPiccaModulo1Answers = (): PiccaModulo1Answers => ({
  nomeCompleto: '',
  dataNascimento: '',
  idade: '',
  sexo: '',
  anoEscolaridade: '',
  escola: '',
  turma: '',
  professor: '',
  morada: '',
  contacto: '',
  nif: '',
  sns: '',
  seguroSaude: '',
  mae: emptyCaregiver(),
  pai: emptyCaregiver(),
  outrosCuidadoresQuem: '',
  outroCuidador: emptyCaregiver(),
  encaminhado: [],
  encaminhadoOutro: '',
  motivoPrincipal: '',
  consultaPsicologia: '',
  consultaPsicologiaMotivo: '',
  objetivos: [],
  objetivosOutro: '',
  principaisPreocupacoes: '',
  consultaOutraEspecialidade: '',
  consultaOutraEspecialidadeQual: '',
  consultaOutraEspecialidadeMotivo: '',
  consultaOutraEspecialidadeResultado: '',
  sintesePreocupacoes: '',
  sintesePredisponentes: '',
  sinteseProtetores: '',
  sinteseHipoteses: '',
})

export function mergePiccaModulo1Answers(raw: Record<string, unknown>): PiccaModulo1Answers {
  const defaults = defaultPiccaModulo1Answers()
  const partial = raw as Partial<PiccaModulo1Answers>
  return {
    ...defaults,
    ...partial,
    mae: { ...defaults.mae, ...(partial.mae ?? {}) },
    pai: { ...defaults.pai, ...(partial.pai ?? {}) },
    outroCuidador: { ...defaults.outroCuidador, ...(partial.outroCuidador ?? {}) },
    outrosCuidadoresQuem:
      partial.outrosCuidadoresQuem ??
      (typeof raw.outrosCuidadores === 'string' ? raw.outrosCuidadores : defaults.outrosCuidadoresQuem),
  }
}
