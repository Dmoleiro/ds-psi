import { emptyWiscResults } from '../lib/wiscResults.js'
import { emptyBancResults } from '../lib/bancResults.js'
import type { TherapistFeatureFlags } from '../middleware/therapistPermissions.js'

type TherapistPatientPayload = {
  wiscSelections?: string[]
  wiscResults?: unknown
  bancSelections?: string[]
  bancResults?: unknown
  additionalMethodSelections?: string[]
  questionnaireSelections?: string[]
  intakeSessions?: Array<{ sessionKind?: string }>
}

export function applyTherapistPatientFeatureAccess<T extends TherapistPatientPayload>(
  patient: T,
  flags: TherapistFeatureFlags,
): T {
  const next = { ...patient }

  if (!flags.assessmentResultsEnabled) {
    next.wiscSelections = []
    next.wiscResults = emptyWiscResults()
    next.bancSelections = []
    next.bancResults = emptyBancResults()
    next.additionalMethodSelections = []
    next.questionnaireSelections = []
  }

  if (!flags.questionnairesEnabled && next.intakeSessions) {
    next.intakeSessions = next.intakeSessions.filter((session) => session.sessionKind !== 'questionnaire')
  }

  return next
}
