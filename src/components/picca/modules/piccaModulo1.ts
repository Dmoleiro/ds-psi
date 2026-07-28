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
  mae: PiccaCaregiverInfo
  pai: PiccaCaregiverInfo
  outrosCuidadores: string
  encaminhado: string[]
  encaminhadoOutro: string
  motivoPrincipal: string
  objetivos: string[]
  objetivosOutro: string
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
  mae: emptyCaregiver(),
  pai: emptyCaregiver(),
  outrosCuidadores: '',
  encaminhado: [],
  encaminhadoOutro: '',
  motivoPrincipal: '',
  objetivos: [],
  objetivosOutro: '',
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
  }
}
