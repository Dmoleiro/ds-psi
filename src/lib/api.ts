const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3001').replace(/\/$/, '')

import type { PatientEvaluationSelections } from './patientEvaluations'
import type {
  FinancialOverview,
  FinancialSettings,
  FinancialYearCharts,
} from './appointments'
import type { PiccaInteractiveFormKind } from './piccaInteractiveKinds'

export type {
  FinancialOverview,
  FinancialRow,
  FinancialSettings,
  FinancialSummary,
  FinancialYearCharts,
} from './appointments'

export const apiBaseUrl = API_URL

export function workshopImageUrl(imagePath: string): string {
  return `${API_URL}${imagePath}`
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

type RequestOptions = {
  method?: string
  body?: unknown
  token?: string | null
  patientToken?: string | null
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`
  }
  if (options.patientToken) {
    headers['X-Patient-Token'] = options.patientToken
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? (options.body !== undefined ? 'POST' : 'GET'),
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message =
      (typeof data.error === 'string' && data.error) ||
      (typeof data.message === 'string' && data.message) ||
      'Erro de comunicação'
    throw new ApiError(message, response.status, data.details)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return data as T
}

export async function apiFormRequest<T>(
  path: string,
  formData: FormData,
  options: { method?: string; token: string },
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${options.token}`,
    },
    body: formData,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message =
      (typeof data.error === 'string' && data.error) ||
      (typeof data.message === 'string' && data.message) ||
      'Erro de comunicação'
    throw new ApiError(message, response.status, data.details)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return data as T
}

export async function apiPatientFormRequest<T>(
  path: string,
  formData: FormData,
  options: { method?: string; patientToken: string },
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? 'POST',
    headers: {
      Accept: 'application/json',
      'X-Patient-Token': options.patientToken,
    },
    body: formData,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message =
      (typeof data.error === 'string' && data.error) ||
      (typeof data.message === 'string' && data.message) ||
      'Erro de comunicação'
    throw new ApiError(message, response.status, data.details)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return data as T
}

export type PatientDocumentSummary = {
  id: string
  originalName: string
  mimeType: string
  sizeBytes: number
  uploadedBy: 'patient' | 'therapist'
  createdAt: string
}

async function fetchDocumentBlob(
  path: string,
  headers: Record<string, string>,
): Promise<Blob> {
  const response = await fetch(`${API_URL}${path}`, { headers })
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    const message =
      (typeof data.error === 'string' && data.error) ||
      (typeof data.message === 'string' && data.message) ||
      'Erro de comunicação'
    throw new ApiError(message, response.status, data.details)
  }
  return response.blob()
}

export type CalendarInviteStatus = 'not_sent' | 'pending' | 'sent' | 'failed' | 'cancelled'

export type InviteRecipients = 'email' | 'email2' | 'both'

export type AppointmentInviteSettings = {
  allowed: boolean
  configured: boolean
  enabled: boolean
  inviteRecipients: InviteRecipients
  copyToTherapist: boolean
}

export type StaffUser = {
  id: string
  email: string
  name: string
  phone?: string | null
  role: 'admin' | 'therapist' | 'coordinator'
  financialOverviewEnabled?: boolean
  piccaEnabled?: boolean
  appointmentInvitesAllowed?: boolean
  active?: boolean
}

export type LoginResponse = {
  token: string
  user: StaffUser
}

export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<LoginResponse>('/api/auth/login', { method: 'POST', body: { email, password } }),
  me: (token: string) => apiRequest<{ user: StaffUser }>('/api/auth/me', { token }),
}

export type LocationSummary = {
  id: string
  name: string
  address?: string | null
}

export type PatientSummary = {
  id: string
  fullName: string
  email: string | null
  email2: string | null
  phone: string | null
  phone2: string | null
  birthDate: string | null
  sessionFee: number | null
  createdAt: string
  location?: LocationSummary
  therapist?: { id: string; name: string }
  intakeSessions?: Array<{
    id: string
    status: string
    createdAt: string
    completedAt: string | null
  }>
}

export type AttendanceStatus = 'present_unpaid' | 'present_paid' | 'receipt_issued' | 'absent'

export type PatientTimelineEventKind =
  | 'appointment_upcoming'
  | 'appointment_past'
  | 'attendance'
  | 'form_submitted'

export type PatientTimelineEvent = {
  id: string
  kind: PatientTimelineEventKind
  occurredAt: string
  title: string
  detail: string | null
  appointmentId: string | null
  attendanceStatus: AttendanceStatus | null
  sessionId: string | null
}

export type PatientTimeline = {
  nextAppointment: PatientTimelineEvent | null
  events: PatientTimelineEvent[]
}

export type AssessmentPipelineStageId = 'intake' | 'avaliacao' | 'picca' | 'relatorio' | 'concluido'
export type AssessmentPipelineStageStatus = 'pending' | 'in_progress' | 'complete' | 'skipped'

export type AssessmentPipelineStage = {
  id: AssessmentPipelineStageId
  label: string
  status: AssessmentPipelineStageStatus
  blockers: string[]
}

export type AssessmentPipeline = {
  currentStage: AssessmentPipelineStageId
  currentStageLabel: string
  notes: string | null
  reportDeliveredAt: string | null
  piccaEnabled: boolean
  stages: AssessmentPipelineStage[]
  currentStageBlockers: string[]
  nextStage: AssessmentPipelineStageId | null
  nextStageLabel: string | null
  canAdvance: boolean
}

export type DashboardAppointment = {
  id: string
  patientId: string
  patientName: string
  locationName: string
  date: string
  time: string
  durationMinutes: number
  notes: string | null
  isPast: boolean
  isToday: boolean
}

export type TherapistDashboard = {
  today: string
  todayLabel: string
  greeting: string
  stats: {
    patients: number
    todayAppointments: number
    weekAppointments: number
    openFormSessions: number
    unpaidThisMonth: number
  }
  todayAppointments: DashboardAppointment[]
  upcomingAppointments: DashboardAppointment[]
  pendingForms: Array<{
    sessionId: string
    patientId: string
    patientName: string
    status: string
    createdAt: string
  }>
  charts: {
    weekAppointments: Array<{
      date: string
      label: string
      count: number
      isToday: boolean
    }>
    monthAttendance: Array<{
      status: string
      label: string
      count: number
    }>
    monthAttendanceTotal: number
  }
}

export type AdminDashboard = {
  today: string
  todayLabel: string
  greeting: string
  stats: {
    activeTherapists: number
    totalTherapists: number
    activeCoordinators: number
    totalCoordinators: number
    activeLocations: number
    totalLocations: number
    activeGabinetes: number
    totalGabinetes: number
    totalPatients: number
    newPatientsThisMonth: number
    openIntakeSessions: number
    appointmentsToday: number
    appointmentsThisWeek: number
    appointmentsThisMonth: number
    attendanceThisMonth: number
    upcomingWorkshops: number
    piccaEnabledTherapists: number
  }
  charts: {
    weekAppointments: Array<{
      date: string
      label: string
      count: number
      isToday: boolean
    }>
    monthByLocation: Array<{
      locationId: string
      locationName: string
      count: number
    }>
    monthByTherapist: Array<{
      therapistId: string
      therapistName: string
      active: boolean
      count: number
    }>
    monthAttendance: Array<{
      status: string
      label: string
      count: number
    }>
    monthAttendanceTotal: number
  }
  monitoring: {
    therapistsWithoutWeekAppointments: Array<{ id: string; name: string }>
    todayByLocation: Array<{ locationId: string; locationName: string; count: number }>
  }
}

export type AppointmentSummary = {
  id: string
  patientId: string
  patientName: string
  locationId: string
  locationName: string
  gabineteId: string
  gabineteName: string
  date: string
  time: string
  scheduledAt: string
  durationMinutes: number
  sessionFee: number
  notes: string | null
  recurrenceGroupId: string | null
  calendarInviteStatus?: CalendarInviteStatus
  calendarInviteError?: string | null
  calendarInvitedAt?: string | null
}

export type LocationDaySchedule = {
  date: string
  location: LocationSummary
  gabinetes: Array<{ id: string; name: string; sortOrder: number }>
  appointments: Array<{
    id: string
    gabineteId: string
    gabineteName: string
    date: string
    time: string
    durationMinutes: number
    therapistId: string
    therapistName: string
    patientName: string
  }>
}

export type AttendanceRecord = {
  date: string
  status: AttendanceStatus
  notes: string | null
}

export const therapistApi = {
  getProfile: (token: string) =>
    apiRequest<{ profile: StaffUser }>('/api/therapist/profile', { token }),
  updateProfile: (
    token: string,
    body: { name: string; email: string; phone?: string; password?: string },
  ) =>
    apiRequest<{ profile: StaffUser; token: string; user: StaffUser }>('/api/therapist/profile', {
      method: 'PATCH',
      token,
      body,
    }),
  sendTestEmail: (token: string) =>
    apiRequest<{ ok: true; sentTo: string }>('/api/therapist/profile/test-email', {
      method: 'POST',
      token,
    }),
  getAppointmentInviteSettings: (token: string) =>
    apiRequest<AppointmentInviteSettings>('/api/therapist/appointment-invites/settings', { token }),
  updateAppointmentInviteSettings: (
    token: string,
    body: {
      enabled?: boolean
      inviteRecipients?: InviteRecipients
      copyToTherapist?: boolean
    },
  ) =>
    apiRequest<{
      settings: {
        enabled: boolean
        inviteRecipients: InviteRecipients
        copyToTherapist: boolean
      }
    }>('/api/therapist/appointment-invites/settings', {
      method: 'PATCH',
      token,
      body,
    }),
  retryAppointmentCalendarInvite: (token: string, appointmentId: string) =>
    apiRequest<{ ok: true; calendarInviteStatus?: CalendarInviteStatus; calendarInviteError?: string | null }>(
      `/api/therapist/appointments/${appointmentId}/calendar-invite/retry`,
      { method: 'POST', token },
    ),
  getDashboard: (token: string) =>
    apiRequest<TherapistDashboard>('/api/therapist/dashboard', { token }),
  getNotepad: (token: string) =>
    apiRequest<{ content: string; updatedAt: string }>('/api/therapist/notepad', { token }),
  updateNotepad: (token: string, content: string) =>
    apiRequest<{ content: string; updatedAt: string }>('/api/therapist/notepad', {
      method: 'PUT',
      token,
      body: { content },
    }),
  listPatients: (token: string) =>
    apiRequest<{ patients: PatientSummary[] }>('/api/therapist/patients', { token }),
  createPatient: (token: string, body: Record<string, unknown>) =>
    apiRequest<{ patient: PatientSummary }>('/api/therapist/patients', {
      method: 'POST',
      token,
      body,
    }),
  getPatient: (token: string, id: string) =>
    apiRequest<{ patient: PatientSummary & { intakeSessions: unknown[] } }>(
      `/api/therapist/patients/${id}`,
      { token },
    ),
  getPatientTimeline: (token: string, id: string) =>
    apiRequest<PatientTimeline>(`/api/therapist/patients/${id}/timeline`, { token }),
  updatePatientEvaluations: (
    token: string,
    id: string,
    body: PatientEvaluationSelections,
  ) =>
    apiRequest<PatientEvaluationSelections>(
      `/api/therapist/patients/${id}/evaluations`,
      {
        method: 'PUT',
        token,
        body,
      },
    ),
  updatePatientAppointmentNotes: (
    token: string,
    id: string,
    body: { appointmentNotes: string | null },
  ) =>
    apiRequest<{ appointmentNotes: string | null }>(
      `/api/therapist/patients/${id}/appointment-notes`,
      {
        method: 'PUT',
        token,
        body,
      },
    ),
  getAssessmentPipeline: (token: string, id: string) =>
    apiRequest<{ pipeline: AssessmentPipeline }>(`/api/therapist/patients/${id}/assessment-pipeline`, {
      token,
    }),
  updateAssessmentPipeline: (
    token: string,
    id: string,
    body: {
      currentStage?: AssessmentPipelineStageId
      notes?: string | null
      reportDeliveredAt?: string | null
      advance?: boolean
    },
  ) =>
    apiRequest<{ pipeline: AssessmentPipeline }>(`/api/therapist/patients/${id}/assessment-pipeline`, {
      method: 'PATCH',
      token,
      body,
    }),
  updatePatient: (
    token: string,
    id: string,
    body: {
      fullName: string
      locationId: string
      email?: string
      email2?: string
      phone?: string
      phone2?: string
      birthDate?: string
      internalNotes?: string
      sessionFee?: number | null
    },
  ) =>
    apiRequest<{
      patient: PatientSummary & { internalNotes: string | null }
    }>(`/api/therapist/patients/${id}`, {
      method: 'PATCH',
      token,
      body,
    }),
  deletePatient: (token: string, id: string) =>
    apiRequest<void>(`/api/therapist/patients/${id}`, { method: 'DELETE', token }),
  listForms: (token: string, category?: 'intake' | 'questionnaire') =>
    apiRequest<{
      forms: Array<{ id: string; title: string; description: string | null }>
    }>(`/api/therapist/forms${category ? `?category=${category}` : ''}`, { token }),
  createSession: (
    token: string,
    patientId: string,
    formIds: string[],
    sessionKind?: 'intake' | 'questionnaire',
  ) =>
    apiRequest<{ session: unknown; url: string }>(`/api/therapist/patients/${patientId}/sessions`, {
      method: 'POST',
      token,
      body: { formIds, sessionKind },
    }),
  getSessionSubmissions: (token: string, sessionId: string) =>
    apiRequest<{
      session: {
        id: string
        status: string
        patient: { id: string; fullName: string }
        location: { name: string }
        submissions: Array<{
          formId: string
          title: string
          submittedAt: string
          fields: Array<{ key: string; label: string; value: string }>
        }>
      }
    }>(`/api/therapist/sessions/${sessionId}/submissions`, { token }),
  revokeSession: (token: string, sessionId: string) =>
    apiRequest<{ session: unknown }>(`/api/therapist/sessions/${sessionId}/revoke`, {
      method: 'POST',
      token,
    }),
  deleteSession: (token: string, sessionId: string) =>
    apiRequest<void>(`/api/therapist/sessions/${sessionId}`, { method: 'DELETE', token }),
  listPiccaModules: (token: string) =>
    apiRequest<{
      modules: Array<{
        id: string
        volume: number
        moduleNumber: number
        title: string
        description: string | null
      }>
    }>('/api/therapist/picca/modules', { token }),
  createPiccaSession: (token: string, patientId: string, moduleIds: string[]) =>
    apiRequest<{ sessionId: string; url: string }>(
      `/api/therapist/patients/${patientId}/picca-sessions`,
      { method: 'POST', token, body: { moduleIds } },
    ),
  revokePiccaSession: (token: string, sessionId: string) =>
    apiRequest<{ session: unknown }>(`/api/therapist/picca-sessions/${sessionId}/revoke`, {
      method: 'POST',
      token,
    }),
  deletePiccaSession: (token: string, sessionId: string) =>
    apiRequest<void>(`/api/therapist/picca-sessions/${sessionId}`, { method: 'DELETE', token }),
  getPiccaSessionSubmissions: (token: string, sessionId: string) =>
    apiRequest<{
      session: {
        id: string
        status: string
        patient: { id: string; fullName: string }
        location: { name: string }
        modules: Array<{
          moduleId: string
          title: string
          volume?: number
          moduleNumber?: number
          therapistOnly?: boolean
          status?: string
          submittedAt: string | null
          answers: Record<string, unknown>
        }>
      }
    }>(`/api/therapist/picca-sessions/${sessionId}/submissions`, { token }),
  updatePiccaModuleAnswers: (
    token: string,
    sessionId: string,
    moduleId: string,
    answers: Record<string, unknown>,
  ) =>
    apiRequest<{ status: string }>(`/api/therapist/picca-sessions/${sessionId}/modules/${moduleId}`, {
      method: 'PUT',
      token,
      body: { answers },
    }),
  listPiccaInteractiveForms: (token: string) =>
    apiRequest<{
      forms: Array<{
        id: string
        kind: PiccaInteractiveFormKind
        title: string
        description: string | null
      }>
    }>('/api/therapist/picca-interactive/forms', { token }),
  createPiccaInteractiveSession: (token: string, patientId: string, formIds: string[]) =>
    apiRequest<{ sessionId: string; url: string }>(
      `/api/therapist/patients/${patientId}/picca-interactive-sessions`,
      { method: 'POST', token, body: { formIds } },
    ),
  revokePiccaInteractiveSession: (token: string, sessionId: string) =>
    apiRequest<{ session: unknown }>(`/api/therapist/picca-interactive-sessions/${sessionId}/revoke`, {
      method: 'POST',
      token,
    }),
  deletePiccaInteractiveSession: (token: string, sessionId: string) =>
    apiRequest<void>(`/api/therapist/picca-interactive-sessions/${sessionId}`, {
      method: 'DELETE',
      token,
    }),
  getPiccaInteractiveSessionEntries: (token: string, sessionId: string) =>
    apiRequest<{
      session: {
        id: string
        status: string
        patient: { id: string; fullName: string }
        forms: Array<{
          formId: string
          title: string
          kind: PiccaInteractiveFormKind
        }>
        entries: Array<{
          id: string
          formId: string
          formTitle: string
          kind: PiccaInteractiveFormKind
          periodKey: string
          answers: Record<string, unknown>
          submittedAt: string
          updatedAt: string
        }>
      }
    }>(`/api/therapist/picca-interactive-sessions/${sessionId}/entries`, { token }),
  updatePiccaInteractiveEntry: (
    token: string,
    sessionId: string,
    entryId: string,
    answers: Record<string, unknown>,
  ) =>
    apiRequest<{ id: string; answers: Record<string, unknown>; updatedAt: string }>(
      `/api/therapist/picca-interactive-sessions/${sessionId}/entries/${entryId}`,
      { method: 'PUT', token, body: { answers } },
    ),
  listPatientDocuments: (token: string, patientId: string) =>
    apiRequest<{ documents: PatientDocumentSummary[] }>(
      `/api/therapist/patients/${patientId}/documents`,
      { token },
    ),
  uploadPatientDocument: (token: string, patientId: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiFormRequest<{ document: PatientDocumentSummary }>(
      `/api/therapist/patients/${patientId}/documents`,
      formData,
      { token },
    )
  },
  getPatientDocumentContent: (
    token: string,
    patientId: string,
    documentId: string,
    disposition: 'inline' | 'attachment' = 'inline',
  ) =>
    fetchDocumentBlob(
      `/api/therapist/patients/${patientId}/documents/${documentId}/content?disposition=${disposition}`,
      { Authorization: `Bearer ${token}` },
    ),
  deletePatientDocument: (token: string, patientId: string, documentId: string) =>
    apiRequest<void>(`/api/therapist/patients/${patientId}/documents/${documentId}`, {
      method: 'DELETE',
      token,
    }),
  listAttendance: (token: string, patientId: string, year: number, month: number) =>
    apiRequest<{ records: AttendanceRecord[] }>(
      `/api/therapist/patients/${patientId}/attendance?year=${year}&month=${month}`,
      { token },
    ),
  listLocations: (token: string) =>
    apiRequest<{ locations: LocationSummary[] }>('/api/therapist/locations', { token }),
  listGabinetes: (token: string, locationId?: string) =>
    apiRequest<{
      gabinetes: Array<{
        id: string
        locationId: string
        locationName?: string
        name: string
        active: boolean
        sortOrder: number
      }>
    }>(
      `/api/therapist/gabinetes${locationId ? `?locationId=${locationId}` : ''}`,
      { token },
    ),
  listAttendanceMatrix: (token: string, year: number, month: number, locationId: string) =>
    apiRequest<{
      year: number
      month: number
      daysInMonth: number
      location: LocationSummary
      patients: Array<{ id: string; fullName: string }>
      records: Array<{
        patientId: string
        patientName: string
        date: string
        status: AttendanceStatus
        sessionFee: number
      }>
      scheduledAppointments: Array<{ patientId: string; date: string }>
    }>(`/api/therapist/attendance?year=${year}&month=${month}&locationId=${locationId}`, { token }),
  upsertAttendance: (
    token: string,
    patientId: string,
    body: { date: string; status: AttendanceStatus | null },
  ) =>
    apiRequest<{ record: AttendanceRecord | { date: string; status: null; notes: null } }>(
      `/api/therapist/patients/${patientId}/attendance`,
      { method: 'PUT', token, body },
    ),
  listAppointments: (token: string, year: number, month: number, locationId?: string) =>
    apiRequest<{ year: number; month: number; appointments: AppointmentSummary[] }>(
      `/api/therapist/appointments?year=${year}&month=${month}${locationId ? `&locationId=${locationId}` : ''}`,
      { token },
    ),
  getAppointmentDefaults: (token: string) =>
    apiRequest<{ defaultSessionFee: number }>('/api/therapist/appointments/defaults', { token }),
  getDayOccupancy: (token: string, date: string) =>
    apiRequest<{
      appointments: Array<{
        id: string
        gabineteId: string
        gabineteName: string
        date: string
        time: string
        durationMinutes: number
        therapistName: string
        patientName: string
      }>
    }>(`/api/therapist/appointments/occupancy?date=${date}`, { token }),
  getLocationDaySchedule: (token: string, date: string, locationId: string) =>
    apiRequest<LocationDaySchedule>(
      `/api/therapist/appointments/location-day?date=${date}&locationId=${locationId}`,
      { token },
    ),
  createAppointment: (
    token: string,
    body: {
      patientId: string
      locationId: string
      gabineteId: string
      date: string
      time: string
      durationMinutes: number
      sessionFee?: number
      notes?: string | null
      recurrence?: {
        cadence: 'weekly' | 'biweekly' | 'monthly'
        until: string
      }
    },
  ) =>
    apiRequest<{
      appointment: AppointmentSummary
      appointments: AppointmentSummary[]
      createdCount: number
    }>('/api/therapist/appointments', {
      method: 'POST',
      token,
      body,
    }),
  updateAppointment: (
    token: string,
    id: string,
    body: {
      patientId: string
      locationId: string
      gabineteId: string
      date: string
      time: string
      durationMinutes: number
      sessionFee?: number
      notes?: string | null
      scope?: 'single' | 'following' | 'series'
      sendCalendarUpdate?: boolean
    },
  ) =>
    apiRequest<{
      appointment: AppointmentSummary
      appointments: AppointmentSummary[]
      updatedCount: number
    }>(`/api/therapist/appointments/${id}`, {
      method: 'PATCH',
      token,
      body,
    }),
  deleteAppointment: (
    token: string,
    id: string,
    scope: 'single' | 'following' | 'series' = 'single',
  ) =>
    apiRequest<{ deletedCount: number }>(`/api/therapist/appointments/${id}?scope=${scope}`, {
      method: 'DELETE',
      token,
    }),
  getFinancialSettings: (token: string) =>
    apiRequest<{ settings: FinancialSettings }>('/api/therapist/financial/settings', { token }),
  updateFinancialSettings: (token: string, body: Partial<FinancialSettings>) =>
    apiRequest<{ settings: FinancialSettings }>('/api/therapist/financial/settings', {
      method: 'PUT',
      token,
      body,
    }),
  getFinancialOverview: (
    token: string,
    year: number,
    month: number,
    period: 'calendar' | 'fiscal' | 'custom' = 'calendar',
    customRange?: { from: string; to: string },
  ) => {
    const params = new URLSearchParams({
      year: String(year),
      month: String(month),
      period,
    })
    if (period === 'custom' && customRange) {
      params.set('from', customRange.from)
      params.set('to', customRange.to)
    }
    return apiRequest<FinancialOverview>(`/api/therapist/financial/overview?${params.toString()}`, { token })
  },
  getFinancialCharts: (token: string, year: number, period: 'calendar' | 'fiscal' = 'calendar') =>
    apiRequest<FinancialYearCharts>(
      `/api/therapist/financial/charts?year=${year}&period=${period}`,
      { token },
    ),
}

export const coordinatorApi = {
  listTherapists: (token: string) =>
    apiRequest<{ therapists: Array<{ id: string; name: string; email: string }> }>(
      '/api/coordinator/therapists',
      { token },
    ),
  listPatients: (token: string, therapistId: string) =>
    apiRequest<{ patients: PatientSummary[] }>(
      `/api/coordinator/patients?therapistId=${encodeURIComponent(therapistId)}`,
      { token },
    ),
  getPatient: (token: string, id: string) =>
    apiRequest<{ patient: PatientSummary & { internalNotes: string | null; intakeSessions: unknown[] } }>(
      `/api/coordinator/patients/${id}`,
      { token },
    ),
  getPatientTimeline: (token: string, id: string) =>
    apiRequest<PatientTimeline>(`/api/coordinator/patients/${id}/timeline`, { token }),
  getAssessmentPipeline: (token: string, id: string) =>
    apiRequest<{ pipeline: AssessmentPipeline }>(`/api/coordinator/patients/${id}/assessment-pipeline`, {
      token,
    }),
  getSessionSubmissions: (token: string, sessionId: string) =>
    apiRequest<{
      session: {
        id: string
        status: string
        patient: { id: string; fullName: string }
        location: { name: string }
        submissions: Array<{
          formId: string
          title: string
          submittedAt: string
          fields: Array<{ key: string; label: string; value: string }>
        }>
      }
    }>(`/api/coordinator/sessions/${sessionId}/submissions`, {
      token,
    }),
  listPatientDocuments: (token: string, patientId: string) =>
    apiRequest<{ documents: PatientDocumentSummary[] }>(
      `/api/coordinator/patients/${patientId}/documents`,
      { token },
    ),
  getPatientDocumentContent: (
    token: string,
    patientId: string,
    documentId: string,
    disposition: 'inline' | 'attachment' = 'inline',
  ) =>
    fetchDocumentBlob(
      `/api/coordinator/patients/${patientId}/documents/${documentId}/content?disposition=${disposition}`,
      { token },
    ),
  listLocations: (token: string, therapistId: string) =>
    apiRequest<{ locations: LocationSummary[] }>(
      `/api/coordinator/locations?therapistId=${therapistId}`,
      { token },
    ),
  listAttendanceMatrix: (
    token: string,
    therapistId: string,
    year: number,
    month: number,
    locationId: string,
  ) =>
    apiRequest<{
      year: number
      month: number
      daysInMonth: number
      location: LocationSummary
      patients: Array<{ id: string; fullName: string }>
      records: Array<{
        patientId: string
        patientName: string
        date: string
        status: AttendanceStatus
        sessionFee: number
      }>
      scheduledAppointments: Array<{ patientId: string; date: string }>
    }>(
      `/api/coordinator/attendance?therapistId=${therapistId}&year=${year}&month=${month}&locationId=${locationId}`,
      { token },
    ),
  toggleReceiptStatus: (
    token: string,
    body: { therapistId: string; patientId: string; date: string },
  ) =>
    apiRequest<{ record: { date: string; status: AttendanceStatus; notes: string | null } }>(
      '/api/coordinator/attendance/receipt',
      { method: 'PUT', token, body },
    ),
  listAppointments: (
    token: string,
    therapistId: string,
    year: number,
    month: number,
    locationId?: string,
  ) =>
    apiRequest<{ year: number; month: number; appointments: AppointmentSummary[] }>(
      `/api/coordinator/appointments?therapistId=${therapistId}&year=${year}&month=${month}${locationId ? `&locationId=${locationId}` : ''}`,
      { token },
    ),
}

export const adminApi = {
  getDashboard: (token: string) =>
    apiRequest<AdminDashboard>('/api/admin/dashboard', { token }),
  listTherapists: (token: string) =>
    apiRequest<{ therapists: Array<StaffUser & { active: boolean; createdAt: string }> }>(
      '/api/admin/therapists',
      { token },
    ),
  createTherapist: (token: string, body: { email: string; name: string; password: string }) =>
    apiRequest<{ therapist: StaffUser }>('/api/admin/therapists', {
      method: 'POST',
      token,
      body,
    }),
  updateTherapist: (
    token: string,
    id: string,
    body: {
      name?: string
      active?: boolean
      financialOverviewEnabled?: boolean
      piccaEnabled?: boolean
      appointmentInvitesAllowed?: boolean
      password?: string
    },
  ) =>
    apiRequest<{ therapist: StaffUser & { active: boolean; createdAt: string } }>(`/api/admin/therapists/${id}`, {
      method: 'PATCH',
      token,
      body,
    }),
  getTherapistLocations: (token: string, therapistId: string) =>
    apiRequest<{
      locations: Array<{
        id: string
        name: string
        active: boolean
        assigned: boolean
      }>
    }>(`/api/admin/therapists/${therapistId}/locations`, { token }),
  setTherapistLocations: (token: string, therapistId: string, locationIds: string[]) =>
    apiRequest<{
      locations: Array<{
        id: string
        name: string
        active: boolean
        assigned: boolean
      }>
    }>(`/api/admin/therapists/${therapistId}/locations`, {
      method: 'PUT',
      token,
      body: { locationIds },
    }),
  getTherapistFinancialSettings: (token: string, therapistId: string) =>
    apiRequest<{ settings: FinancialSettings }>(`/api/admin/therapists/${therapistId}/financial-settings`, {
      token,
    }),
  updateTherapistFinancialSettings: (
    token: string,
    therapistId: string,
    body: Partial<FinancialSettings>,
  ) =>
    apiRequest<{ settings: FinancialSettings }>(`/api/admin/therapists/${therapistId}/financial-settings`, {
      method: 'PUT',
      token,
      body,
    }),
  listCoordinators: (token: string) =>
    apiRequest<{ coordinators: Array<StaffUser & { active: boolean; createdAt: string }> }>(
      '/api/admin/coordinators',
      { token },
    ),
  createCoordinator: (token: string, body: { email: string; name: string; password: string }) =>
    apiRequest<{ coordinator: StaffUser }>('/api/admin/coordinators', {
      method: 'POST',
      token,
      body,
    }),
  deleteCoordinator: (token: string, id: string) =>
    apiRequest<void>(`/api/admin/coordinators/${id}`, { method: 'DELETE', token }),
  updateCoordinator: (
    token: string,
    id: string,
    body: { name?: string; active?: boolean; password?: string },
  ) =>
    apiRequest<{ coordinator: StaffUser }>(`/api/admin/coordinators/${id}`, {
      method: 'PATCH',
      token,
      body,
    }),
  getCoordinatorTherapists: (token: string, coordinatorId: string) =>
    apiRequest<{
      therapists: Array<{
        id: string
        name: string
        email: string
        active: boolean
        assigned: boolean
      }>
    }>(`/api/admin/coordinators/${coordinatorId}/therapists`, { token }),
  setCoordinatorTherapists: (token: string, coordinatorId: string, therapistIds: string[]) =>
    apiRequest<{
      therapists: Array<{
        id: string
        name: string
        email: string
        active: boolean
        assigned: boolean
      }>
    }>(`/api/admin/coordinators/${coordinatorId}/therapists`, {
      method: 'PUT',
      token,
      body: { therapistIds },
    }),
  listLocations: (token: string) =>
    apiRequest<{
      locations: Array<LocationSummary & { active: boolean; patientCount: number; createdAt: string }>
    }>('/api/admin/locations', { token }),
  createLocation: (token: string, body: { name: string; address?: string }) =>
    apiRequest<{ location: LocationSummary & { active: boolean } }>('/api/admin/locations', {
      method: 'POST',
      token,
      body,
    }),
  updateLocation: (
    token: string,
    id: string,
    body: { name?: string; address?: string | null; active?: boolean },
  ) =>
    apiRequest<{ location: LocationSummary & { active: boolean } }>(`/api/admin/locations/${id}`, {
      method: 'PATCH',
      token,
      body,
    }),
  listGabinetes: (token: string) =>
    apiRequest<{
      gabinetes: Array<{
        id: string
        locationId: string
        locationName?: string
        name: string
        active: boolean
        sortOrder: number
        appointmentCount: number
      }>
    }>('/api/admin/gabinetes', { token }),
  createGabinete: (token: string, body: { name: string; locationId: string; sortOrder?: number }) =>
    apiRequest<{
      gabinete: {
        id: string
        locationId: string
        locationName?: string
        name: string
        active: boolean
        sortOrder: number
      }
    }>('/api/admin/gabinetes', {
      method: 'POST',
      token,
      body,
    }),
  updateGabinete: (
    token: string,
    id: string,
    body: { name?: string; locationId?: string; active?: boolean; sortOrder?: number },
  ) =>
    apiRequest<{
      gabinete: {
        id: string
        locationId: string
        locationName?: string
        name: string
        active: boolean
        sortOrder: number
      }
    }>(`/api/admin/gabinetes/${id}`, {
      method: 'PATCH',
      token,
      body,
    }),
}

export type WorkshopSummary = {
  id: string
  title: string
  description: string
  location: string
  eventDate: string
  imagePath: string
  createdAt: string
  updatedAt: string
  status?: 'upcoming' | 'past'
}

export const workshopApi = {
  listPublic: (status: 'upcoming' | 'past') =>
    apiRequest<{ workshops: WorkshopSummary[] }>(`/api/workshops/public?status=${status}`),
  list: (token: string) => apiRequest<{ workshops: WorkshopSummary[] }>('/api/workshops', { token }),
  create: (token: string, formData: FormData) =>
    apiFormRequest<{ workshop: WorkshopSummary }>('/api/workshops', formData, { token }),
  update: (token: string, id: string, formData: FormData) =>
    apiFormRequest<{ workshop: WorkshopSummary }>(`/api/workshops/${id}`, formData, {
      method: 'PATCH',
      token,
    }),
  delete: (token: string, id: string) =>
    apiRequest<void>(`/api/workshops/${id}`, { method: 'DELETE', token }),
}

export type PatientSessionForm = {
  formId: string
  title: string
  description?: string | null
  status: 'not_started' | 'in_progress' | 'submitted'
}

export type PatientSession = {
  id: string
  status: string
  consentAt: string | null
  patientFirstName: string
  forms: PatientSessionForm[]
}

export const patientApi = {
  getSession: (token: string) =>
    apiRequest<{ session: PatientSession }>(`/api/patient/session/${token}`, { patientToken: token }),
  acceptConsent: (token: string) =>
    apiRequest<{ consentAt: string }>(`/api/patient/session/${token}/consent`, {
      method: 'POST',
      patientToken: token,
      body: { accepted: true },
    }),
  getForm: (token: string, formId: string) =>
    apiRequest<{ form: { formId: string; title: string; status: string; answers: unknown; readOnly: boolean } }>(
      `/api/patient/session/${token}/forms/${formId}`,
      { patientToken: token },
    ),
  saveDraft: (token: string, formId: string, answers: Record<string, unknown>) =>
    apiRequest<{ saved: boolean }>(`/api/patient/session/${token}/forms/${formId}/draft`, {
      method: 'PUT',
      patientToken: token,
      body: { answers },
    }),
  submitForm: (token: string, formId: string, answers: Record<string, unknown>) =>
    apiRequest<{ submitted: boolean; sessionStatus: string; allComplete: boolean }>(
      `/api/patient/session/${token}/forms/${formId}/submit`,
      { method: 'POST', patientToken: token, body: answers },
    ),
  listDocuments: (token: string) =>
    apiRequest<{ documents: PatientDocumentSummary[] }>(`/api/patient/session/${token}/documents`, {
      patientToken: token,
    }),
  uploadDocument: (token: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiPatientFormRequest<{ document: PatientDocumentSummary }>(
      `/api/patient/session/${token}/documents`,
      formData,
      { patientToken: token },
    )
  },
  getDocumentContent: (token: string, documentId: string) =>
    fetchDocumentBlob(`/api/patient/session/${token}/documents/${documentId}/content`, {
      'X-Patient-Token': token,
    }),
}

export type PiccaPatientModule = {
  moduleId: string
  title: string
  description?: string | null
  volume: number
  moduleNumber: number
  status: 'not_started' | 'in_progress' | 'submitted'
  accessible: boolean
  readOnly: boolean
}

export type PiccaPatientSession = {
  id: string
  status: string
  consentAt: string | null
  patientFirstName: string
  totalModules: number
  completedModules: number
  currentModuleIndex: number
  locked: boolean
  canFinalize: boolean
  modules: PiccaPatientModule[]
}

export const piccaPatientApi = {
  getSession: (token: string) =>
    apiRequest<{ session: PiccaPatientSession }>(`/api/picca/patient/session/${token}`, {
      patientToken: token,
    }),
  acceptConsent: (token: string) =>
    apiRequest<{ consentAt: string }>(`/api/picca/patient/session/${token}/consent`, {
      method: 'POST',
      patientToken: token,
      body: { accepted: true },
    }),
  getModule: (token: string, moduleId: string) =>
    apiRequest<{
      module: {
        moduleId: string
        title: string
        description?: string | null
        status: string
        readOnly: boolean
        answers: unknown
      }
    }>(`/api/picca/patient/session/${token}/modules/${moduleId}`, { patientToken: token }),
  saveDraft: (token: string, moduleId: string, answers: Record<string, unknown>) =>
    apiRequest<{ ok: boolean }>(`/api/picca/patient/session/${token}/modules/${moduleId}/draft`, {
      method: 'PUT',
      patientToken: token,
      body: { answers },
    }),
  submitModule: (token: string, moduleId: string, answers: Record<string, unknown>) =>
    apiRequest<{ ok: boolean; allSubmitted: boolean }>(
      `/api/picca/patient/session/${token}/modules/${moduleId}/submit`,
      { method: 'POST', patientToken: token, body: { answers } },
    ),
  completeSession: (token: string) =>
    apiRequest<{ status: string }>(`/api/picca/patient/session/${token}/complete`, {
      method: 'POST',
      patientToken: token,
      body: { accepted: true },
    }),
}

export type PiccaInteractivePatientForm = {
  formId: string
  title: string
  description?: string | null
  kind: PiccaInteractiveFormKind
}

export type PiccaInteractivePatientSession = {
  id: string
  status: string
  consentAt: string | null
  patientFirstName: string
  currentWeekStart: string
  today: string
  forms: PiccaInteractivePatientForm[]
}

export const piccaInteractivePatientApi = {
  getSession: (token: string) =>
    apiRequest<{ session: PiccaInteractivePatientSession }>(
      `/api/picca-interactive/patient/session/${token}`,
      { patientToken: token },
    ),
  acceptConsent: (token: string) =>
    apiRequest<{ consentAt: string }>(`/api/picca-interactive/patient/session/${token}/consent`, {
      method: 'POST',
      patientToken: token,
      body: { accepted: true },
    }),
  getForm: (token: string, formId: string, periodKey?: string) =>
    apiRequest<{
      form: {
        formId: string
        title: string
        kind: PiccaInteractiveFormKind
        periodKey: string
        weekStart: string
        readOnly: boolean
        answers: Record<string, unknown>
        submittedAt: string | null
      }
    }>(
      `/api/picca-interactive/patient/session/${token}/forms/${formId}${periodKey ? `?periodKey=${periodKey}` : ''}`,
      { patientToken: token },
    ),
  getWeekEntries: (token: string, formId: string, weekStart?: string) =>
    apiRequest<{
      weekStart: string
      entries: Array<{
        periodKey: string
        answers: Record<string, unknown>
        submittedAt: string
        updatedAt: string
      }>
    }>(
      `/api/picca-interactive/patient/session/${token}/forms/${formId}/week${weekStart ? `?weekStart=${weekStart}` : ''}`,
      { patientToken: token },
    ),
  saveEntry: (
    token: string,
    formId: string,
    periodKey: string,
    answers: Record<string, unknown>,
  ) =>
    apiRequest<{ id: string; periodKey: string; submittedAt: string; updatedAt: string }>(
      `/api/picca-interactive/patient/session/${token}/forms/${formId}/entries/${periodKey}`,
      { method: 'PUT', patientToken: token, body: { answers } },
    ),
}
