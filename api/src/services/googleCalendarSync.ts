import { GoogleSyncStatus } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import {
  buildGoogleEventPayload,
  deleteGoogleEvent,
  insertGoogleEvent,
  markAppointmentSyncFailed,
  markAppointmentSyncPending,
  markAppointmentSyncSuccess,
  sanitizeGoogleSyncError,
  updateGoogleEvent,
  type InviteRecipients,
} from './googleCalendar.js'

const appointmentSyncSelect = {
  id: true,
  therapistId: true,
  scheduledAt: true,
  durationMinutes: true,
  notes: true,
  googleCalendarId: true,
  googleEventId: true,
  patient: {
    select: {
      fullName: true,
      email: true,
      email2: true,
    },
  },
  location: {
    select: {
      name: true,
      address: true,
    },
  },
  gabinete: {
    select: {
      name: true,
    },
  },
} as const

type SyncableAppointment = {
  id: string
  therapistId: string
  scheduledAt: Date
  durationMinutes: number
  notes: string | null
  googleCalendarId: string | null
  googleEventId: string | null
  patient: {
    fullName: string
    email: string | null
    email2: string | null
  }
  location: {
    name: string
    address: string | null
  }
  gabinete: {
    name: string
  }
}

async function getSyncContext(therapistId: string) {
  const therapist = await prisma.user.findFirst({
    where: { id: therapistId, role: 'therapist' },
    select: {
      googleCalendarSyncAllowed: true,
      googleCalendarConnection: true,
    },
  })

  const connection = therapist?.googleCalendarConnection
  if (!therapist?.googleCalendarSyncAllowed || !connection || !connection.syncEnabled) {
    return null
  }

  return {
    calendarId: connection.calendarId,
    sendInvites: connection.sendInvites,
    inviteRecipients: connection.inviteRecipients as InviteRecipients,
  }
}

async function syncSingleAppointment(
  appointment: SyncableAppointment,
  action: 'create' | 'update',
) {
  const context = await getSyncContext(appointment.therapistId)
  if (!context) {
    await prisma.appointment.update({
      where: { id: appointment.id },
      data: { googleSyncStatus: GoogleSyncStatus.not_linked, googleSyncError: null },
    })
    return
  }

  await markAppointmentSyncPending(appointment.id)

  const payload = buildGoogleEventPayload({
    ...appointment,
    inviteRecipients: context.inviteRecipients,
  })

  try {
    if (action === 'update' && appointment.googleEventId && appointment.googleCalendarId) {
      const event = await updateGoogleEvent(
        appointment.therapistId,
        appointment.googleCalendarId,
        appointment.googleEventId,
        payload,
        context.sendInvites,
      )
      await markAppointmentSyncSuccess(appointment.id, appointment.googleCalendarId, event.id)
      return
    }

    const event = await insertGoogleEvent(
      appointment.therapistId,
      context.calendarId,
      payload,
      context.sendInvites,
    )
    await markAppointmentSyncSuccess(appointment.id, context.calendarId, event.id)
  } catch (error) {
    await markAppointmentSyncFailed(appointment.id, error)
    throw error
  }
}

export function queueAppointmentSync(appointmentIds: string[], action: 'create' | 'update') {
  if (appointmentIds.length === 0) return

  void (async () => {
    const appointments = await prisma.appointment.findMany({
      where: { id: { in: appointmentIds } },
      select: appointmentSyncSelect,
    })

    for (const appointment of appointments) {
      try {
        await syncSingleAppointment(appointment, action)
      } catch {
        // Error already persisted on the appointment row.
      }
    }
  })()
}

export async function deleteGoogleEventsForAppointments(
  therapistId: string,
  appointments: Array<{
    id: string
    googleCalendarId: string | null
    googleEventId: string | null
  }>,
) {
  const context = await getSyncContext(therapistId)
  if (!context) return

  for (const appointment of appointments) {
    if (!appointment.googleEventId || !appointment.googleCalendarId) continue
    try {
      await deleteGoogleEvent(
        therapistId,
        appointment.googleCalendarId,
        appointment.googleEventId,
        context.sendInvites,
      )
    } catch (error) {
      // Best effort — local delete should still proceed.
      console.error(
        `Failed to delete Google event for appointment ${appointment.id}:`,
        sanitizeGoogleSyncError(error),
      )
    }
  }
}

export async function retryAppointmentGoogleSync(therapistId: string, appointmentId: string) {
  const appointment = await prisma.appointment.findFirst({
    where: { id: appointmentId, therapistId },
    select: appointmentSyncSelect,
  })
  if (!appointment) {
    throw new Error('APPOINTMENT_NOT_FOUND')
  }

  const action =
    appointment.googleEventId && appointment.googleCalendarId ? 'update' : 'create'
  await syncSingleAppointment(appointment, action)

  const updated = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    select: {
      googleSyncStatus: true,
      googleSyncError: true,
      googleSyncedAt: true,
    },
  })

  if (updated?.googleSyncStatus === GoogleSyncStatus.failed) {
    throw new Error(updated.googleSyncError ?? 'GOOGLE_SYNC_FAILED')
  }

  return updated
}
