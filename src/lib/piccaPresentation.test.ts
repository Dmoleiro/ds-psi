import { describe, expect, it } from 'vitest'
import { formatPiccaModuleAnswers } from './piccaPresentation'

describe('formatPiccaModuleAnswers', () => {
  it('formats antecedentes as readable Portuguese labels', () => {
    const sections = formatPiccaModuleAnswers('picca-vol1-mod2', {
      antecedentes: {
        ansiedade: { mae: true, pai: false, famMaterna: false, famPaterna: false },
        outras: { mae: true, pai: true, famMaterna: true, famPaterna: true },
      },
    })

    const antecedentes = sections.find((s) => s.title === '7. Antecedentes Familiares')
    expect(antecedentes?.fields[0]?.value).toContain('Ansiedade: Mãe')
    expect(antecedentes?.fields[0]?.value).toContain('Outras: Mãe, Pai, Família materna, Família paterna')
    expect(antecedentes?.fields[0]?.value).not.toContain('"mae"')
  })
})
