import { z } from 'zod'

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
  password: z.string().min(8).optional(),
})

export const createPatientSchema = z.object({
  fullName: z.string().min(2),
  locationId: z.string().uuid(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  internalNotes: z.string().optional(),
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

export const createSessionSchema = z.object({
  formIds: z.array(z.enum(['intake', 'consent', 'history'])).min(1),
  expiresAt: z.string().datetime().optional(),
})

export const draftSchema = z.object({
  answers: z.record(z.unknown()),
})

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
  status: z.enum(['present_unpaid', 'present_paid', 'absent']).nullable(),
  notes: z.string().max(2000).optional().nullable(),
})

export const intakeFormSchema = z.object({
  fullName: z.string().min(2),
  birthDate: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  reasonForVisit: z.string().min(5),
  previousTherapy: z.enum(['yes', 'no']).optional(),
  previousTherapyDetails: z.string().optional(),
  medications: z.string().optional(),
  generalNotes: z.string().optional(),
})

export const consentFormSchema = z.object({
  readAndUnderstood: z.literal(true),
  consentToTreatment: z.literal(true),
  consentToDataProcessing: z.literal(true),
  signatureName: z.string().min(2),
  signedAt: z.string(),
})

export const historyFormSchema = z.object({
  developmentConcerns: z.string().optional(),
  schoolHistory: z.string().optional(),
  familyHistory: z.string().optional(),
  medicalHistory: z.string().optional(),
  currentDifficulties: z.string().min(5),
  strengths: z.string().optional(),
  goals: z.string().min(5),
  additionalInfo: z.string().optional(),
})

export type IntakeFormData = z.infer<typeof intakeFormSchema>
export type ConsentFormData = z.infer<typeof consentFormSchema>
export type HistoryFormData = z.infer<typeof historyFormSchema>

export function getFormSchema(formId: string) {
  switch (formId) {
    case 'intake':
      return intakeFormSchema
    case 'consent':
      return consentFormSchema
    case 'history':
      return historyFormSchema
    default:
      return null
  }
}
