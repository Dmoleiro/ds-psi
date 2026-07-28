import {
  PICCA_VOL6_DISORDERS,
  PICCA_VOL6_SINTESE_TEXT_FIELDS,
  type Vol6DisorderDefinition,
  type Vol6IndicatorAnswer,
} from './piccaVol6Content'
import { PICCA_VOL6_SINTESE_GROUPS } from './piccaVol6SinteseContent'

export function emptyVol6IndicatorAnswer(): Vol6IndicatorAnswer {
  return { nivel: '', casa: false, escola: false, clinica: false, outros: false, notas: '' }
}

function buildIndicatorMap(definition: { groups: Vol6DisorderDefinition['groups'] }) {
  const indicadores: Record<string, Vol6IndicatorAnswer> = {}
  for (const group of definition.groups) {
    for (const item of group.items) {
      indicadores[item.id] = emptyVol6IndicatorAnswer()
    }
  }
  return indicadores
}

export type PiccaVol6DisorderAnswers = {
  indicadores: Record<string, Vol6IndicatorAnswer>
  diagnosticoDiferencial: string
  instrumentosFontes: string
  sinteseHipotese: string
}

export type PiccaVol6HipoteseRow = {
  hipotese: string
  evidenciaAFavor: string
  evidenciaContra: string
  dadosEmFalta: string
  estado: string
}

export type PiccaVol6SinteseAnswers = {
  indicadores: Record<string, Vol6IndicatorAnswer>
  textos: Record<string, string>
  mapaHipoteses: PiccaVol6HipoteseRow[]
}

export function defaultPiccaVol6DisorderAnswers(number: number): PiccaVol6DisorderAnswers {
  const definition = PICCA_VOL6_DISORDERS.find((d) => d.number === number)
  if (!definition || number === 14) {
    return {
      indicadores: {},
      diagnosticoDiferencial: '',
      instrumentosFontes: '',
      sinteseHipotese: '',
    }
  }
  return {
    indicadores: buildIndicatorMap(definition),
    diagnosticoDiferencial: '',
    instrumentosFontes: '',
    sinteseHipotese: '',
  }
}

function emptyHipoteseRow(): PiccaVol6HipoteseRow {
  return {
    hipotese: '',
    evidenciaAFavor: '',
    evidenciaContra: '',
    dadosEmFalta: '',
    estado: '',
  }
}

export function defaultPiccaVol6SinteseAnswers(): PiccaVol6SinteseAnswers {
  const textos: Record<string, string> = {}
  for (const field of PICCA_VOL6_SINTESE_TEXT_FIELDS) {
    textos[field] = ''
  }
  return {
    indicadores: buildIndicatorMap({ groups: PICCA_VOL6_SINTESE_GROUPS }),
    textos,
    mapaHipoteses: [emptyHipoteseRow()],
  }
}

export function mergePiccaVol6DisorderAnswers(
  number: number,
  raw: Record<string, unknown>,
): PiccaVol6DisorderAnswers {
  const defaults = defaultPiccaVol6DisorderAnswers(number)
  const partial = raw as Partial<PiccaVol6DisorderAnswers>
  return {
    ...defaults,
    ...partial,
    indicadores: { ...defaults.indicadores, ...partial.indicadores },
  }
}

export function mergePiccaVol6SinteseAnswers(raw: Record<string, unknown>): PiccaVol6SinteseAnswers {
  const defaults = defaultPiccaVol6SinteseAnswers()
  const partial = raw as Partial<PiccaVol6SinteseAnswers>
  return {
    ...defaults,
    ...partial,
    indicadores: { ...defaults.indicadores, ...partial.indicadores },
    textos: { ...defaults.textos, ...partial.textos },
    mapaHipoteses: partial.mapaHipoteses?.length ? partial.mapaHipoteses : defaults.mapaHipoteses,
  }
}
