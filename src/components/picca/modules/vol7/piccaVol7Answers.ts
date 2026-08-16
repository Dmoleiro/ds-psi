import {
  PICCA_VOL7_DISORDERS,
  type Vol7DisorderDefinition,
  type Vol7IndicatorAnswer,
} from './piccaVol7Content'

export function emptyVol7IndicatorAnswer(): Vol7IndicatorAnswer {
  return { resposta: '', observacoes: '' }
}

function buildIndicatorMap(definition: Pick<Vol7DisorderDefinition, 'groups'>) {
  const indicadores: Record<string, Vol7IndicatorAnswer> = {}
  for (const group of definition.groups) {
    for (const item of group.items) {
      indicadores[item.id] = emptyVol7IndicatorAnswer()
    }
  }
  return indicadores
}

export type PiccaVol7DisorderAnswers = {
  indicadores: Record<string, Vol7IndicatorAnswer>
  footerSections: Record<string, string>
}

export function defaultPiccaVol7DisorderAnswers(number: number): PiccaVol7DisorderAnswers {
  const definition = PICCA_VOL7_DISORDERS.find((d) => d.number === number)
  if (!definition) {
    return { indicadores: {}, footerSections: {} }
  }

  const footerSections: Record<string, string> = {}
  for (const section of definition.footerSections) {
    footerSections[section.id] = ''
  }

  return {
    indicadores: buildIndicatorMap(definition),
    footerSections,
  }
}

export function mergePiccaVol7DisorderAnswers(
  number: number,
  raw: Record<string, unknown>,
): PiccaVol7DisorderAnswers {
  const defaults = defaultPiccaVol7DisorderAnswers(number)
  const partial = raw as Partial<PiccaVol7DisorderAnswers>
  return {
    ...defaults,
    ...partial,
    indicadores: { ...defaults.indicadores, ...partial.indicadores },
    footerSections: { ...defaults.footerSections, ...partial.footerSections },
  }
}
