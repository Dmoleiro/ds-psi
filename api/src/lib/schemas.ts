import { z } from 'zod'
import { getQuestionnaireFormSchema } from './questionnaires/schema.js'

function envString(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

export const config = {
  port: Number(process.env.PORT ?? 3001),
  jwtSecret: envString('JWT_SECRET', 'dev-only-change-in-production'),
  frontendUrl: envString('FRONTEND_URL', 'http://localhost:5173'),
  databaseUrl: process.env.DATABASE_URL,
}

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const createTherapistSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8),
})

export const createCoordinatorSchema = createTherapistSchema

export const updateTherapistSchema = z.object({
  name: z.string().min(2).optional(),
  active: z.boolean().optional(),
  financialOverviewEnabled: z.boolean().optional(),
  piccaEnabled: z.boolean().optional(),
  appointmentInvitesAllowed: z.boolean().optional(),
  password: z.string().min(8).optional(),
})

export const updateCoordinatorSchema = updateTherapistSchema

export const updateTherapistProfileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional().or(z.literal('')),
  password: z.string().min(8).optional(),
})

export const therapistNotepadSchema = z.object({
  content: z.string().max(50_000),
})

export const createPatientSchema = z.object({
  fullName: z.string().min(2),
  locationId: z.string().uuid(),
  email: z.string().email().optional().or(z.literal('')),
  email2: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  phone2: z.string().optional().or(z.literal('')),
  birthDate: z.string().optional(),
  internalNotes: z.string().optional(),
  sessionFee: z
    .union([z.coerce.number().positive().max(10000), z.literal(''), z.null()])
    .optional()
    .transform((value) => {
      if (value === '' || value === null || value === undefined) return undefined
      return value
    }),
})

export const updatePatientSchema = z.object({
  fullName: z.string().min(2),
  locationId: z.string().uuid(),
  email: z.string().email().optional().or(z.literal('')),
  email2: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  phone2: z.string().optional().or(z.literal('')),
  birthDate: z.string().optional().or(z.literal('')),
  internalNotes: z.string().optional(),
  sessionFee: z
    .union([z.coerce.number().positive().max(10000), z.literal(''), z.null()])
    .optional()
    .transform((value) => {
      if (value === '') return null
      if (value === undefined) return undefined
      return value
    }),
})

export const patientEvaluationsSchema = z.object({
  wiscSelections: z.array(z.string()).default([]),
  bancSelections: z.array(z.string()).default([]),
  additionalMethodSelections: z.array(z.string()).default([]),
  questionnaireSelections: z.array(z.string()).default([]),
})

export const patientAppointmentNotesSchema = z.object({
  appointmentNotes: z.string().max(100000).nullable(),
})

export const appointmentInviteSettingsSchema = z.object({
  enabled: z.boolean().optional(),
  inviteRecipients: z.enum(['email', 'email2', 'both']).optional(),
  copyToTherapist: z.boolean().optional(),
})

export const updateTherapistAppointmentInvitesSchema = z.object({
  appointmentInvitesAllowed: z.boolean(),
})

export const createLocationSchema = z.object({
  name: z.string().min(2),
  address: z.string().optional(),
})

export const updateLocationSchema = z.object({
  name: z.string().min(2).optional(),
  address: z.string().optional().nullable(),
  active: z.boolean().optional(),
})

export const createGabineteSchema = z.object({
  name: z.string().min(2),
  locationId: z.string().uuid(),
  sortOrder: z.coerce.number().int().min(0).optional(),
})

export const updateGabineteSchema = z.object({
  name: z.string().min(2).optional(),
  locationId: z.string().uuid().optional(),
  active: z.boolean().optional(),
  sortOrder: z.coerce.number().int().min(0).optional(),
})

export const setTherapistLocationsSchema = z.object({
  locationIds: z.array(z.string().uuid()),
})

export const setCoordinatorTherapistsSchema = z.object({
  therapistIds: z.array(z.string().uuid()),
})

export const coordinatorPatientsQuerySchema = z.object({
  therapistId: z.string().uuid(),
})

export const gabineteListQuerySchema = z.object({
  locationId: z.string().uuid().optional(),
})

export const coordinatorLocationsQuerySchema = z.object({
  therapistId: z.string().uuid(),
})

export const createSessionSchema = z.object({
  formIds: z.array(z.string().min(1)).min(1),
  expiresAt: z.string().datetime().optional(),
  sessionKind: z.enum(['intake', 'questionnaire']).optional(),
})

export const createPiccaSessionSchema = z.object({
  moduleIds: z.array(z.string().min(1)).min(1),
})

export const createPiccaInteractiveSessionSchema = z.object({
  formIds: z.array(z.string().min(1)).min(1),
})

export const draftSchema = z.object({
  answers: z.record(z.unknown()),
})

export const piccaDraftSchema = draftSchema

export const consentSchema = z.object({
  accepted: z.literal(true),
})

export const attendanceMonthQuerySchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
  month: z.coerce.number().int().min(1).max(12),
})

export const attendanceMatrixQuerySchema = attendanceMonthQuerySchema.extend({
  locationId: z.string().uuid(),
})

export const coordinatorAttendanceQuerySchema = attendanceMatrixQuerySchema.extend({
  therapistId: z.string().uuid(),
})

export const attendanceUpsertSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(['present_unpaid', 'present_paid', 'receipt_issued', 'absent']).nullable(),
  notes: z.string().max(2000).optional().nullable(),
})

export const appointmentMonthQuerySchema = attendanceMonthQuerySchema.extend({
  locationId: z.string().uuid().optional(),
})

export const coordinatorReceiptToggleSchema = z.object({
  therapistId: z.string().uuid(),
  patientId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

export const coordinatorAppointmentsQuerySchema = appointmentMonthQuerySchema.extend({
  therapistId: z.string().uuid(),
})

export const appointmentDayQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

export const locationDayScheduleQuerySchema = appointmentDayQuerySchema.extend({
  locationId: z.string().uuid(),
})

export const appointmentBodySchema = z.object({
  patientId: z.string().uuid(),
  locationId: z.string().uuid(),
  gabineteId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  durationMinutes: z.coerce.number().int().min(15).max(240),
  sessionFee: z.coerce.number().positive().max(10000).optional(),
  notes: z.string().max(2000).optional().nullable(),
})

export const financialSettingsSchema = z.object({
  socialSecurityRate: z.coerce.number().min(0).max(1).optional(),
  irsRate: z.coerce.number().min(0).max(1).optional(),
  savingsRate: z.coerce.number().min(0).max(1).optional(),
  defaultSessionFee: z.coerce.number().positive().max(10000).optional(),
})

export const financialMonthQuerySchema = z
  .object({
    year: z.coerce.number().int().min(2000).max(2100).optional(),
    month: z.coerce.number().int().min(1).max(12).optional(),
    period: z.enum(['calendar', 'fiscal', 'custom']).default('calendar'),
    from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.period === 'custom') {
      if (!data.from || !data.to) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Datas obrigatórias', path: ['from'] })
        return
      }
      if (data.to < data.from) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Data final inválida', path: ['to'] })
      }
      return
    }

    if (!data.year || !data.month) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Mês obrigatório', path: ['year'] })
    }
  })

export const financialYearQuerySchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
  period: z.enum(['calendar', 'fiscal']).default('calendar'),
})

export const appointmentRecurrenceSchema = z.object({
  cadence: z.enum(['weekly', 'biweekly', 'monthly']),
  until: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

export const appointmentSeriesScopeSchema = z.enum(['single', 'following', 'series'])

export const createAppointmentBodySchema = appointmentBodySchema
  .extend({
    recurrence: appointmentRecurrenceSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.recurrence && data.recurrence.until < data.date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A data final deve ser igual ou posterior à primeira consulta',
        path: ['recurrence', 'until'],
      })
    }
  })

export const updateAppointmentBodySchema = appointmentBodySchema.extend({
  scope: appointmentSeriesScopeSchema.optional(),
  sendCalendarUpdate: z.boolean().optional(),
})

export const deleteAppointmentQuerySchema = z.object({
  scope: appointmentSeriesScopeSchema.default('single'),
})

export const fichaInscricaoFormSchema = z
  .object({
    recordedAt: z.string().min(1, 'Indique a data e hora'),
    childName: z.string().trim().min(2, 'Indique o nome com pelo menos 2 caracteres'),
    address: z.string().optional(),
    postalCodeLocality: z.string().optional(),
    nif: z.string().optional(),
    birthDate: z.string().optional(),
    childPhone: z.string().optional(),
    childEmail: z.union([z.literal(''), z.string().email('Email inválido')]).optional(),
    healthConditions: z.string().optional(),
    insuranceNumber: z.string().optional(),
    insurer: z.string().optional(),
    schoolName: z.string().optional(),
    schoolYear: z.string().optional(),
    retentionsCount: z.string().optional(),
    reasonForRequest: z.string().trim().min(5, 'Descreva o motivo do pedido com pelo menos 5 caracteres'),
    guardianName: z.string().trim().min(2, 'Indique o nome do responsável'),
    relationshipType: z.string().trim().min(2, 'Indique o tipo de parentesco'),
    profession: z.string().optional(),
    guardianPhone: z.string().optional(),
    guardianEmail: z.union([z.literal(''), z.string().email('Email inválido')]).optional(),
    declarationAccepted: z.literal(true, {
      errorMap: () => ({ message: 'Tem de aceitar a declaração de veracidade' }),
    }),
    additionalInfo: z.string().optional(),
    signatureName: z.string().trim().min(2, 'Indique o nome na assinatura'),
    signedAt: z.string().min(1, 'Indique a data da assinatura'),
  })
  .refine((data) => Boolean(data.guardianPhone?.trim() || data.guardianEmail?.trim()), {
    message: 'Indique pelo menos um contacto do responsável',
    path: ['guardianPhone'],
  })

export type FichaInscricaoFormData = z.infer<typeof fichaInscricaoFormSchema>

const requiredFormText = (min: number) =>
  z
    .string()
    .trim()
    .min(min, `Preencha com pelo menos ${min} caracteres`)

const optionalFormText = z.string().nullish()

export const queixaInicialFormSchema = z.object({
  concernOrigin: requiredFormText(5),
  mainSymptoms: optionalFormText,
  concernStartAge: optionalFormText,
  interventionsAtHome: optionalFormText,
  interventionsAtSchool: optionalFormText,
  familyDynamicsEffect: optionalFormText,
  referredBy: optionalFormText,
  requestObjective: requiredFormText(5),
})

export type QueixaInicialFormData = z.infer<typeof queixaInicialFormSchema>

export function getFormSchema(formId: string) {
  switch (formId) {
    case 'ficha-inscricao':
      return fichaInscricaoFormSchema
    case 'queixa-inicial':
      return queixaInicialFormSchema
    default:
      return getQuestionnaireFormSchema(formId)
  }
}
