import { prisma } from '../lib/prisma.js'
import { formatFormAnswers } from '../lib/formPresentation.js'
import { sendFormSubmittedEmail } from '../lib/mail.js'
import { config } from '../lib/schemas.js'

export async function notifyTherapistOfFormSubmission(
  sessionId: string,
  formId: string,
  answers: Record<string, unknown>,
): Promise<void> {
  const session = await prisma.intakeSession.findUnique({
    where: { id: sessionId },
    include: {
      therapist: { select: { email: true, name: true } },
      patient: {
        select: {
          id: true,
          fullName: true,
          location: { select: { name: true } },
        },
      },
      forms: {
        where: { formId },
        include: { definition: true },
        take: 1,
      },
    },
  })

  if (!session?.forms[0]?.definition) return

  const fields = formatFormAnswers(formId, answers)
  const backofficeUrl = `${config.frontendUrl.replace(/\/$/, '')}/backoffice/patients/${session.patient.id}`

  await sendFormSubmittedEmail({
    therapistEmail: session.therapist.email,
    therapistName: session.therapist.name,
    patientName: session.patient.fullName,
    locationName: session.patient.location.name,
    formTitle: session.forms[0].definition.title,
    fields,
    backofficeUrl,
  })
}
