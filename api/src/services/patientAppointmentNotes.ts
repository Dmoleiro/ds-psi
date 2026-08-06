import { prisma } from '../lib/prisma.js'

export async function updateTherapistPatientAppointmentNotes(
  therapistId: string,
  patientId: string,
  appointmentNotes: string | null,
) {
  const patient = await prisma.patient.findFirst({
    where: { id: patientId, therapistId },
    select: { id: true },
  })
  if (!patient) {
    throw new Error('PATIENT_NOT_FOUND')
  }

  if (appointmentNotes == null || appointmentNotes.trim() === '') {
    const updated = await prisma.patient.update({
      where: { id: patientId },
      data: { appointmentNotes: null },
      select: { appointmentNotes: true },
    })
    return { appointmentNotes: updated.appointmentNotes }
  }

  const updated = await prisma.patient.update({
    where: { id: patientId },
    data: { appointmentNotes },
    select: { appointmentNotes: true },
  })

  return { appointmentNotes: updated.appointmentNotes }
}
