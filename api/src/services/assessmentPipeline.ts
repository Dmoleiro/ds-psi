import { AssessmentPipelineStage } from '@prisma/client'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import {
  buildAssessmentPipelineView,
  getVisiblePipelineStages,
  type PipelineStageId,
} from '../lib/assessmentPipeline.js'
import { sanitizeBancSelections, sanitizeWiscSelections } from '../lib/patientEvaluations.js'
import { assertCoordinatorPatientAccess } from './coordinatorPatients.js'

const pipelinePatientInclude = {
  intakeSessions: {
    include: {
      forms: {
        select: { formId: true, status: true },
      },
    },
    orderBy: { createdAt: 'desc' as const },
  },
  piccaSessions: {
    include: {
      modules: {
        select: { status: true },
      },
    },
    orderBy: { createdAt: 'desc' as const },
  },
  piccaInteractiveSessions: {
    include: {
      forms: {
        select: { formId: true },
      },
    },
    orderBy: { createdAt: 'desc' as const },
  },
  therapist: {
    select: { piccaEnabled: true },
  },
  _count: {
    select: { documents: true },
  },
} as const

export const updateAssessmentPipelineSchema = z.object({
  currentStage: z.nativeEnum(AssessmentPipelineStage).optional(),
  notes: z.string().max(5000).nullable().optional(),
  reportDeliveredAt: z.string().datetime().nullable().optional(),
  advance: z.boolean().optional(),
})

async function loadPipelinePatient(where: { id: string; therapistId?: string }) {
  return prisma.patient.findFirst({
    where,
    include: pipelinePatientInclude,
  })
}

function formatPipelinePatient(patient: NonNullable<Awaited<ReturnType<typeof loadPipelinePatient>>>) {
  const wiscSelections = sanitizeWiscSelections(patient.wiscSelections)
  const bancSelections = sanitizeBancSelections(patient.bancSelections)
  const piccaEnabled = patient.therapist.piccaEnabled

  return buildAssessmentPipelineView({
    currentStage: patient.assessmentPipelineStage as PipelineStageId,
    notes: patient.assessmentPipelineNotes,
    reportDeliveredAt: patient.assessmentReportDeliveredAt,
    piccaEnabled,
    wiscSelections,
    bancSelections,
    intakeSessions: patient.intakeSessions,
    piccaSessions: patient.piccaSessions,
    piccaInteractiveSessions: patient.piccaInteractiveSessions,
    documentCount: patient._count.documents,
  })
}

export async function getTherapistAssessmentPipeline(therapistId: string, patientId: string) {
  const patient = await loadPipelinePatient({ id: patientId, therapistId })
  if (!patient) {
    throw new Error('PATIENT_NOT_FOUND')
  }
  return formatPipelinePatient(patient)
}

export async function getCoordinatorAssessmentPipeline(coordinatorId: string, patientId: string) {
  const patient = await loadPipelinePatient({ id: patientId })
  if (!patient) {
    throw new Error('PATIENT_NOT_FOUND')
  }

  try {
    await assertCoordinatorPatientAccess(coordinatorId, patientId)
  } catch {
    throw new Error('PATIENT_NOT_FOUND')
  }

  return formatPipelinePatient(patient)
}

export async function updateTherapistAssessmentPipeline(
  therapistId: string,
  patientId: string,
  input: z.infer<typeof updateAssessmentPipelineSchema>,
) {
  const patient = await loadPipelinePatient({ id: patientId, therapistId })
  if (!patient) {
    throw new Error('PATIENT_NOT_FOUND')
  }

  const piccaEnabled = patient.therapist.piccaEnabled
  const visibleStages = getVisiblePipelineStages(piccaEnabled)
  const currentView = formatPipelinePatient(patient)

  let nextStage = patient.assessmentPipelineStage as PipelineStageId

  if (input.advance) {
    if (!currentView.nextStage) {
      throw new Error('PIPELINE_ALREADY_COMPLETE')
    }
    if (!currentView.canAdvance) {
      throw new Error('PIPELINE_BLOCKERS_PRESENT')
    }
    nextStage = currentView.nextStage
  } else if (input.currentStage) {
    if (!visibleStages.includes(input.currentStage as PipelineStageId)) {
      throw new Error('INVALID_PIPELINE_STAGE')
    }
    nextStage = input.currentStage as PipelineStageId
  }

  const data: {
    assessmentPipelineStage?: AssessmentPipelineStage
    assessmentPipelineNotes?: string | null
    assessmentReportDeliveredAt?: Date | null
  } = {}

  if (input.advance || input.currentStage) {
    data.assessmentPipelineStage = nextStage
  }

  if (input.notes !== undefined) {
    data.assessmentPipelineNotes = input.notes
  }

  if (input.reportDeliveredAt !== undefined) {
    data.assessmentReportDeliveredAt = input.reportDeliveredAt
      ? new Date(input.reportDeliveredAt)
      : null
  }

  if (Object.keys(data).length === 0) {
    return currentView
  }

  const updated = await prisma.patient.update({
    where: { id: patientId },
    data,
    include: pipelinePatientInclude,
  })

  return formatPipelinePatient(updated)
}
