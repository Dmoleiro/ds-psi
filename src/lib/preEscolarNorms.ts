import normsData from './preEscolarNorms.json'

export const PRE_ESCOLAR_NORM_LEVELS = ['pre_escolar', 'primeiro_ano'] as const

export type PreEscolarNormLevel = (typeof PRE_ESCOLAR_NORM_LEVELS)[number]

export type PreEscolarNormColumn =
  | 'verbal'
  | 'conceitos_quantitativos'
  | 'memoria_auditiva'
  | 'constancia_de_forma'
  | 'posicoes_espaco'
  | 'orientacao_espacial'
  | 'coordenacao_visiomotora'
  | 'figura_fundo'
  | 'total'

type NormRow = Partial<Record<PreEscolarNormColumn, number>> & {
  percentile: number
  stanine: number
}

type NormLevel = {
  label: string
  means: Record<PreEscolarNormColumn, number>
  standardDeviations: Record<PreEscolarNormColumn, number>
  rows: NormRow[]
}

const LEVELS = normsData.levels as Record<PreEscolarNormLevel, NormLevel>

const NORM_COLUMNS: PreEscolarNormColumn[] = [
  'verbal',
  'conceitos_quantitativos',
  'memoria_auditiva',
  'constancia_de_forma',
  'posicoes_espaco',
  'orientacao_espacial',
  'coordenacao_visiomotora',
  'figura_fundo',
  'total',
]

export function getPreEscolarNormLevelLabel(level: PreEscolarNormLevel): string {
  return LEVELS[level]?.label ?? level
}

export function lookupPreEscolarNorms(
  level: PreEscolarNormLevel,
  column: PreEscolarNormColumn,
  rawScore: number,
): { percentile: string; stanine: string } {
  const table = LEVELS[level]
  if (!table?.rows.length) return { percentile: '1', stanine: '1' }

  const carry: Partial<Record<PreEscolarNormColumn, number>> = {}

  for (const row of table.rows) {
    for (const key of NORM_COLUMNS) {
      const value = row[key]
      if (value !== undefined) carry[key] = value
    }

    const threshold = carry[column]
    if (threshold === undefined) continue
    if (rawScore >= threshold) {
      return { percentile: String(row.percentile), stanine: String(row.stanine) }
    }
  }

  return { percentile: '1', stanine: '1' }
}
