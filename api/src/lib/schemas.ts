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

export const updateTherapistSchema = z.object({
  name: z.string().min(2).optional(),
  active: z.boolean().optional(),
  password: z.string().min(8).optional(),
})

export const createPatientSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  internalNotes: z.string().optional(),
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
