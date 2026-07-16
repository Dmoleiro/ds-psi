const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3001').replace(/\/$/, '')

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

export type StaffUser = {
  id: string
  email: string
  name: string
  phone?: string | null
  role: 'admin' | 'therapist' | 'coordinator'
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
  phone: string | null
  birthDate: string | null
  createdAt: string
  location?: LocationSummary
  intakeSessions?: Array<{
    id: string
    status: string
    createdAt: string
    completedAt: string | null
  }>
}

export type AttendanceStatus = 'present_unpaid' | 'present_paid' | 'receipt_issued' | 'absent'

export type AppointmentSummary = {
  id: string
  patientId: string
  patientName: string
  locationId: string
  locationName: string
  date: string
  time: string
  scheduledAt: string
  durationMinutes: number
  notes: string | null
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
  deletePatient: (token: string, id: string) =>
    apiRequest<void>(`/api/therapist/patients/${id}`, { method: 'DELETE', token }),
  listForms: (token: string) =>
    apiRequest<{
      forms: Array<{ id: string; title: string; description: string | null }>
    }>('/api/therapist/forms', { token }),
  createSession: (token: string, patientId: string, formIds: string[]) =>
    apiRequest<{ session: unknown; url: string }>(`/api/therapist/patients/${patientId}/sessions`, {
      method: 'POST',
      token,
      body: { formIds },
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
  listAttendance: (token: string, patientId: string, year: number, month: number) =>
    apiRequest<{ records: AttendanceRecord[] }>(
      `/api/therapist/patients/${patientId}/attendance?year=${year}&month=${month}`,
      { token },
    ),
  listLocations: (token: string) =>
    apiRequest<{ locations: LocationSummary[] }>('/api/therapist/locations', { token }),
  listAttendanceMatrix: (token: string, year: number, month: number, locationId: string) =>
    apiRequest<{
      year: number
      month: number
      daysInMonth: number
      location: LocationSummary
      patients: Array<{ id: string; fullName: string }>
      records: Array<{ patientId: string; date: string; status: AttendanceStatus }>
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
  createAppointment: (
    token: string,
    body: {
      patientId: string
      locationId: string
      date: string
      time: string
      durationMinutes: number
      notes?: string | null
    },
  ) =>
    apiRequest<{ appointment: AppointmentSummary }>('/api/therapist/appointments', {
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
      date: string
      time: string
      durationMinutes: number
      notes?: string | null
    },
  ) =>
    apiRequest<{ appointment: AppointmentSummary }>(`/api/therapist/appointments/${id}`, {
      method: 'PATCH',
      token,
      body,
    }),
  deleteAppointment: (token: string, id: string) =>
    apiRequest<void>(`/api/therapist/appointments/${id}`, { method: 'DELETE', token }),
}

export const coordinatorApi = {
  listTherapists: (token: string) =>
    apiRequest<{ therapists: Array<{ id: string; name: string; email: string }> }>(
      '/api/coordinator/therapists',
      { token },
    ),
  listLocations: (token: string) =>
    apiRequest<{ locations: LocationSummary[] }>('/api/coordinator/locations', { token }),
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
      records: Array<{ patientId: string; date: string; status: AttendanceStatus }>
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
    body: { name?: string; active?: boolean; password?: string },
  ) =>
    apiRequest<{ therapist: StaffUser }>(`/api/admin/therapists/${id}`, {
      method: 'PATCH',
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
}
