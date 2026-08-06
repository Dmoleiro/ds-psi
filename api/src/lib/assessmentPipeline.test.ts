import { describe, expect, it } from 'vitest'
import {
  buildAssessmentPipelineView,
  getIntakePipelineState,
  getNextPipelineStage,
  getVisiblePipelineStages,
} from './assessmentPipeline.js'

describe('getIntakePipelineState', () => {
  it('marks intake complete when required forms are submitted', () => {
    const result = getIntakePipelineState([
      {
        status: 'in_progress',
        forms: [
          { formId: 'ficha-inscricao', status: 'submitted' },
          { formId: 'queixa-inicial', status: 'submitted' },
        ],
      },
    ])

    expect(result.status).toBe('complete')
    expect(result.blockers).toEqual([])
  })

  it('lists missing intake forms as blockers', () => {
    const result = getIntakePipelineState([
      {
        status: 'active',
        forms: [{ formId: 'ficha-inscricao', status: 'submitted' }],
      },
    ])

    expect(result.status).toBe('in_progress')
    expect(result.blockers).toContain('Por submeter: Queixa inicial')
  })
})

describe('getVisiblePipelineStages', () => {
  it('omits PICCA when therapist does not have access', () => {
    expect(getVisiblePipelineStages(false)).toEqual(['intake', 'avaliacao', 'relatorio', 'concluido'])
  })

  it('includes PICCA when enabled', () => {
    expect(getVisiblePipelineStages(true)).toContain('picca')
  })
})

describe('getNextPipelineStage', () => {
  it('skips PICCA when not enabled', () => {
    expect(getNextPipelineStage('avaliacao', false)).toBe('relatorio')
  })
})

describe('buildAssessmentPipelineView', () => {
  it('allows advancing from intake when forms are complete', () => {
    const view = buildAssessmentPipelineView({
      currentStage: 'intake',
      notes: null,
      reportDeliveredAt: null,
      piccaEnabled: false,
      wiscSelections: [],
      bancSelections: [],
      intakeSessions: [
        {
          status: 'completed',
          forms: [
            { formId: 'ficha-inscricao', status: 'submitted' },
            { formId: 'queixa-inicial', status: 'submitted' },
          ],
        },
      ],
      piccaSessions: [],
      piccaInteractiveSessions: [],
      documentCount: 0,
    })

    expect(view.canAdvance).toBe(true)
    expect(view.nextStage).toBe('avaliacao')
  })

  it('blocks advancing from avaliacao without test selections', () => {
    const view = buildAssessmentPipelineView({
      currentStage: 'avaliacao',
      notes: null,
      reportDeliveredAt: null,
      piccaEnabled: false,
      wiscSelections: [],
      bancSelections: [],
      intakeSessions: [
        {
          status: 'completed',
          forms: [
            { formId: 'ficha-inscricao', status: 'submitted' },
            { formId: 'queixa-inicial', status: 'submitted' },
          ],
        },
      ],
      piccaSessions: [],
      piccaInteractiveSessions: [],
      documentCount: 0,
    })

    expect(view.canAdvance).toBe(false)
    expect(view.currentStageBlockers).toContain('Indicar testes planeados (WISC / BANC)')
  })
})
