import { emptyVol7IndicatorAnswer } from './piccaVol7Answers'
import type { Vol7IndicatorAnswer } from './piccaVol7Content'
import { PICCA_VOL7_SINTESE_GROUPS, PICCA_VOL7_SINTESE_TEXT_FIELDS } from './piccaVol7SinteseContent'

export type PiccaVol7HipoteseRow = {
  hipotese: string
  evidenciaAFavor: string
  evidenciaContra: string
  dadosEmFalta: string
  estado: string
}

export type PiccaVol7SinteseAnswers = {
  indicadores: Record<string, Vol7IndicatorAnswer>
  checklistsUtilizados: string
  mapaHipoteses: PiccaVol7HipoteseRow[]
  textos: Record<string, string>
}

function buildIndicatorMap() {
  const indicadores: Record<string, Vol7IndicatorAnswer> = {}
  for (const group of PICCA_VOL7_SINTESE_GROUPS) {
    for (const item of group.items) {
      indicadores[item.id] = emptyVol7IndicatorAnswer()
    }
  }
  return indicadores
}

function emptyHipoteseRow(): PiccaVol7HipoteseRow {
  return {
    hipotese: '',
    evidenciaAFavor: '',
    evidenciaContra: '',
    dadosEmFalta: '',
    estado: '',
  }
}

export function defaultPiccaVol7SinteseAnswers(): PiccaVol7SinteseAnswers {
  const textos: Record<string, string> = {}
  for (const field of PICCA_VOL7_SINTESE_TEXT_FIELDS) {
    textos[field] = ''
  }
  return {
    indicadores: buildIndicatorMap(),
    checklistsUtilizados: '',
    mapaHipoteses: [emptyHipoteseRow()],
    textos,
  }
}

export function mergePiccaVol7SinteseAnswers(raw: Record<string, unknown>): PiccaVol7SinteseAnswers {
  const defaults = defaultPiccaVol7SinteseAnswers()
  const partial = raw as Partial<PiccaVol7SinteseAnswers>
  return {
    ...defaults,
    ...partial,
    indicadores: { ...defaults.indicadores, ...partial.indicadores },
    textos: { ...defaults.textos, ...partial.textos },
    mapaHipoteses: partial.mapaHipoteses?.length ? partial.mapaHipoteses : defaults.mapaHipoteses,
  }
}
