import type { FastifyInstance } from 'fastify'
import { createReadStream } from 'node:fs'
import { UserRole } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { formatFormAnswers } from '../lib/formPresentation.js'
import { listTherapistAttendance, toggleCoordinatorReceiptStatus } from '../services/attendance.js'
import { listTherapistAppointments } from '../services/appointments.js'
import {
  getCoordinatorPatient,
  listCoordinatorPatients,
} from '../services/coordinatorPatients.js'
import {
  assertCoordinatorHasTherapist,
  listAssignedCoordinatorTherapists,
} from '../services/coordinatorTherapists.js'
import {
  getCoordinatorPatientDocument,
  getDocumentAbsolutePath,
  listCoordinatorPatientDocuments,
} from '../services/patientDocuments.js'
import {
  coordinatorAppointmentsQuerySchema,
  coordinatorAttendanceQuerySchema,
  coordinatorLocationsQuerySchema,
  coordinatorPatientsQuerySchema,
  coordinatorReceiptToggleSchema,
} from '../lib/schemas.js'
import { listTherapistLocations } from '../services/therapistLocations.js'

function therapistAccessError(reply: { status: (code: number) => { send: (body: unknown) => unknown } }, err: unknown) {
  if (err instanceof Error && err.message === 'THERAPIST_ACCESS_DENIED') {
    return reply.status(403).send({ error: 'Sem acesso a este terapeuta' })
  }
  return null
}

function patientAccessError(reply: { status: (code: number) => { send: (body: unknown) => unknown } }, err: unknown) {
  if (err instanceof Error && err.message === 'PATIENT_NOT_FOUND') {
    return reply.status(404).send({ error: 'Paciente não encontrado' })
  }
  if (err instanceof Error && err.message === 'THERAPIST_ACCESS_DENIED') {
    return reply.status(403).send({ error: 'Sem acesso a este paciente' })
  }
  return null
}

export async function coordinatorRoutes(app: FastifyInstance) {
  const coordinatorOnly = [requireAuth, requireRole(UserRole.coordinator)]

  app.get('/api/coordinator/therapists', { preHandler: coordinatorOnly }, async (request) => {
    const therapists = await listAssignedCoordinatorTherapists(request.user.sub)
    return { therapists }
  })

  app.get('/api/coordinator/patients', { preHandler: coordinatorOnly }, async (request, reply) => {
    const parsed = coordinatorPatientsQuerySchema.safeParse(request.query)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Parâmetros inválidos', details: parsed.error.flatten() })
    }

    try {
      const patients = await listCoordinatorPatients(request.user.sub, parsed.data.therapistId)
      return { patients }
    } catch (err) {
      const response = therapistAccessError(reply, err)
      if (response) return response
      throw err
    }
  })

  app.get('/api/coordinator/patients/:id', { preHandler: coordinatorOnly }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const patient = await getCoordinatorPatient(request.user.sub, id)
    if (!patient) {
      return reply.status(404).send({ error: 'Paciente não encontrado' })
    }
    return { patient }
  })

  app.get(
    '/api/coordinator/patients/:patientId/documents',
    { preHandler: coordinatorOnly },
    async (request, reply) => {
      const { patientId } = request.params as { patientId: string }
      try {
        const documents = await listCoordinatorPatientDocuments(request.user.sub, patientId)
        return { documents }
      } catch (error) {
        const response = patientAccessError(reply, error)
        if (response) return response
        throw error
      }
    },
  )

  app.get(
    '/api/coordinator/patients/:patientId/documents/:documentId/content',
    { preHandler: coordinatorOnly },
    async (request, reply) => {
      const { patientId, documentId } = request.params as {
        patientId: string
        documentId: string
      }
      const disposition =
        (request.query as { disposition?: string }).disposition === 'attachment'
          ? 'attachment'
          : 'inline'

      try {
        const document = await getCoordinatorPatientDocument(
          request.user.sub,
          patientId,
          documentId,
        )
        const absolutePath = getDocumentAbsolutePath(document)
        return reply
          .header('Content-Type', document.mimeType)
          .header(
            'Content-Disposition',
            `${disposition}; filename="${encodeURIComponent(document.originalName)}"`,
          )
          .send(createReadStream(absolutePath))
      } catch (error) {
        const response = patientAccessError(reply, error)
        if (response) return response
        if (error instanceof Error && error.message === 'DOCUMENT_NOT_FOUND') {
          return reply.status(404).send({ error: 'Documento não encontrado' })
        }
        throw error
      }
    },
  )

  app.get(
    '/api/coordinator/sessions/:id/submissions',
    { preHandler: coordinatorOnly },
    async (request, reply) => {
      const { id } = request.params as { id: string }
      const session = await prisma.intakeSession.findUnique({
        where: { id },
        include: {
          patient: {
            select: {
              id: true,
              fullName: true,
              therapistId: true,
              location: { select: { name: true } },
            },
          },
          forms: {
            include: {
              definition: true,
              submission: true,
            },
            orderBy: { sortOrder: 'asc' },
          },
        },
      })
      if (!session) {
        return reply.status(404).send({ error: 'Sessão não encontrada' })
      }

      try {
        await assertCoordinatorHasTherapist(request.user.sub, session.patient.therapistId)
      } catch (error) {
        const response = therapistAccessError(reply, error)
        if (response) return response
        throw error
      }

      return {
        session: {
          id: session.id,
          status: session.status,
          patient: {
            id: session.patient.id,
            fullName: session.patient.fullName,
          },
          location: session.patient.location,
          submissions: session.forms
            .filter((form) => form.submission)
            .map((form) => ({
              formId: form.formId,
              title: form.definition.title,
              submittedAt: form.submission!.submittedAt,
              fields: formatFormAnswers(form.formId, form.submission!.answersJson as Record<string, unknown>),
            })),
        },
      }
    },
  )

  app.get('/api/coordinator/locations', { preHandler: coordinatorOnly }, async (request, reply) => {
    const parsed = coordinatorLocationsQuerySchema.safeParse(request.query)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Parâmetros inválidos', details: parsed.error.flatten() })
    }

    try {
      await assertCoordinatorHasTherapist(request.user.sub, parsed.data.therapistId)
    } catch (err) {
      const response = therapistAccessError(reply, err)
      if (response) return response
      throw err
    }

    const locations = await listTherapistLocations(parsed.data.therapistId)
    return { locations }
  })

  app.get('/api/coordinator/attendance', { preHandler: coordinatorOnly }, async (request, reply) => {
    const parsed = coordinatorAttendanceQuerySchema.safeParse(request.query)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Parâmetros inválidos', details: parsed.error.flatten() })
    }

    try {
      await assertCoordinatorHasTherapist(request.user.sub, parsed.data.therapistId)
      const data = await listTherapistAttendance(
        parsed.data.therapistId,
        parsed.data.year,
        parsed.data.month,
        parsed.data.locationId,
      )
      return data
    } catch (err) {
      const response = therapistAccessError(reply, err)
      if (response) return response
      if (err instanceof Error && err.message === 'LOCATION_NOT_FOUND') {
        return reply.status(404).send({ error: 'Local não encontrado' })
      }
      if (err instanceof Error && err.message === 'LOCATION_ACCESS_DENIED') {
        return reply.status(403).send({ error: 'Sem acesso a este local' })
      }
      if (err instanceof Error && err.message === 'INVALID_MONTH') {
        return reply.status(400).send({ error: 'Mês inválido' })
      }
      throw err
    }
  })

  app.get('/api/coordinator/appointments', { preHandler: coordinatorOnly }, async (request, reply) => {
    const parsed = coordinatorAppointmentsQuerySchema.safeParse(request.query)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Parâmetros inválidos', details: parsed.error.flatten() })
    }

    try {
      await assertCoordinatorHasTherapist(request.user.sub, parsed.data.therapistId)
      const appointments = await listTherapistAppointments(
        parsed.data.therapistId,
        parsed.data.year,
        parsed.data.month,
        parsed.data.locationId,
      )
      return {
        year: parsed.data.year,
        month: parsed.data.month,
        appointments,
      }
    } catch (err) {
      const response = therapistAccessError(reply, err)
      if (response) return response
      if (err instanceof Error && err.message === 'LOCATION_NOT_FOUND') {
        return reply.status(404).send({ error: 'Local não encontrado' })
      }
      if (err instanceof Error && err.message === 'LOCATION_ACCESS_DENIED') {
        return reply.status(403).send({ error: 'Sem acesso a este local' })
      }
      if (err instanceof Error && err.message === 'INVALID_MONTH') {
        return reply.status(400).send({ error: 'Mês inválido' })
      }
      throw err
    }
  })

  app.put('/api/coordinator/attendance/receipt', { preHandler: coordinatorOnly }, async (request, reply) => {
    const parsed = coordinatorReceiptToggleSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Dados inválidos', details: parsed.error.flatten() })
    }

    try {
      await assertCoordinatorHasTherapist(request.user.sub, parsed.data.therapistId)
      const record = await toggleCoordinatorReceiptStatus(
        parsed.data.therapistId,
        parsed.data.patientId,
        parsed.data.date,
      )
      return { record }
    } catch (err) {
      const response = therapistAccessError(reply, err)
      if (response) return response
      if (err instanceof Error && err.message === 'PATIENT_NOT_FOUND') {
        return reply.status(404).send({ error: 'Paciente não encontrado' })
      }
      if (err instanceof Error && err.message === 'INVALID_DATE') {
        return reply.status(400).send({ error: 'Data inválida' })
      }
      if (err instanceof Error && err.message === 'RECORD_NOT_FOUND') {
        return reply.status(404).send({ error: 'Registo de presença não encontrado' })
      }
      if (err instanceof Error && err.message === 'NOT_RECEIPT_EDITABLE') {
        return reply.status(400).send({
          error: 'Só pode alterar células marcadas como presente pago ou recibo passado',
        })
      }
      throw err
    }
  })
}
