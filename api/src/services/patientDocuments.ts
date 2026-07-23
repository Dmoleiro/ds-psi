import { DocumentUploader, type PatientDocument } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import {
  deletePatientDocumentFile,
  getAbsoluteDocumentPath,
  savePatientDocumentBuffer,
} from '../lib/patientDocumentUpload.js'

export function formatPatientDocument(document: PatientDocument) {
  return {
    id: document.id,
    originalName: document.originalName,
    mimeType: document.mimeType,
    sizeBytes: document.sizeBytes,
    uploadedBy: document.uploadedBy,
    createdAt: document.createdAt,
  }
}

async function assertTherapistPatient(therapistId: string, patientId: string) {
  const patient = await prisma.patient.findFirst({
    where: { id: patientId, therapistId },
    select: { id: true, therapistId: true },
  })
  if (!patient) {
    throw new Error('PATIENT_NOT_FOUND')
  }
  return patient
}

export async function listTherapistPatientDocuments(therapistId: string, patientId: string) {
  await assertTherapistPatient(therapistId, patientId)
  const documents = await prisma.patientDocument.findMany({
    where: { patientId, therapistId },
    orderBy: { createdAt: 'desc' },
  })
  return documents.map(formatPatientDocument)
}

export async function listPatientSessionDocuments(patientId: string, sessionId: string) {
  const documents = await prisma.patientDocument.findMany({
    where: { patientId, intakeSessionId: sessionId },
    orderBy: { createdAt: 'desc' },
  })
  return documents.map(formatPatientDocument)
}

export async function getTherapistPatientDocument(
  therapistId: string,
  patientId: string,
  documentId: string,
) {
  await assertTherapistPatient(therapistId, patientId)
  const document = await prisma.patientDocument.findFirst({
    where: { id: documentId, patientId, therapistId },
  })
  if (!document) {
    throw new Error('DOCUMENT_NOT_FOUND')
  }
  return document
}

export async function getPatientSessionDocument(
  patientId: string,
  sessionId: string,
  documentId: string,
) {
  const document = await prisma.patientDocument.findFirst({
    where: { id: documentId, patientId, intakeSessionId: sessionId },
  })
  if (!document) {
    throw new Error('DOCUMENT_NOT_FOUND')
  }
  return document
}

export function getDocumentAbsolutePath(document: PatientDocument): string {
  return getAbsoluteDocumentPath(document.storagePath)
}

export async function uploadTherapistPatientDocument(
  therapistId: string,
  patientId: string,
  file: { buffer: Buffer; mimetype: string; originalName: string },
) {
  await assertTherapistPatient(therapistId, patientId)
  const { storagePath, mimeType } = await savePatientDocumentBuffer(patientId, file.buffer, file.mimetype)
  const document = await prisma.patientDocument.create({
    data: {
      patientId,
      therapistId,
      originalName: file.originalName,
      mimeType,
      sizeBytes: file.buffer.length,
      storagePath,
      uploadedBy: DocumentUploader.therapist,
    },
  })
  return formatPatientDocument(document)
}

export async function uploadPatientSessionDocument(
  patientId: string,
  therapistId: string,
  sessionId: string,
  file: { buffer: Buffer; mimetype: string; originalName: string },
) {
  const { storagePath, mimeType } = await savePatientDocumentBuffer(patientId, file.buffer, file.mimetype)
  const document = await prisma.patientDocument.create({
    data: {
      patientId,
      therapistId,
      intakeSessionId: sessionId,
      originalName: file.originalName,
      mimeType,
      sizeBytes: file.buffer.length,
      storagePath,
      uploadedBy: DocumentUploader.patient,
    },
  })

  await prisma.sessionForm.updateMany({
    where: { sessionId, formId: 'anexar-documentos' },
    data: { status: 'in_progress' },
  })

  return formatPatientDocument(document)
}

export async function deleteTherapistPatientDocument(
  therapistId: string,
  patientId: string,
  documentId: string,
) {
  const document = await getTherapistPatientDocument(therapistId, patientId, documentId)
  await prisma.patientDocument.delete({ where: { id: document.id } })
  await deletePatientDocumentFile(document.storagePath)
}
