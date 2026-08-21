import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { FormSubmissionsPanel } from '../../components/backoffice/FormSubmissionsPanel'
import { PiccaPatientSection, type PiccaSessionRow } from '../../components/backoffice/PiccaPatientSection'
import {
  PiccaInteractivePatientSection,
  type PiccaInteractiveSessionRow,
} from '../../components/backoffice/PiccaInteractivePatientSection'
import { PatientDocumentsPanel } from '../../components/backoffice/PatientDocumentsPanel'
import { BackofficeLayout } from '../../components/backoffice/BackofficeLayout'
import { ApiError, coordinatorApi, therapistApi, type LocationSummary } from '../../lib/api'
import { formPreviewHref } from '../../lib/formPreview'
import { appointmentsCreateHref } from '../../lib/dashboard'
import type { SessionSubmissionsView } from '../../lib/exportFormSubmissionsPdf'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import styles from '../../components/backoffice/BackofficeLayout.module.css'
import {
  formatFormStatus,
  formatSessionStatus,
  formStatusBadgeVariant,
  sessionStatusBadgeVariant,
} from '../../lib/intakeStatus'
import tabStyles from './PatientDetailPage.module.css'
import type { WiscResults } from '../../lib/wiscResults'
import { emptyWiscResults } from '../../lib/wiscResults'
import type { BancResults } from '../../lib/bancResults'
import { emptyBancResults } from '../../lib/bancResults'
import { PatientTimelinePanel } from '../../components/backoffice/PatientTimeline'
import { PatientEvaluationsPanel } from '../../components/backoffice/PatientEvaluationsPanel'
import { AssessmentPipelinePanel } from '../../components/backoffice/AssessmentPipelinePanel'
import { PatientAppointmentNotesPanel } from '../../components/backoffice/PatientAppointmentNotesPanel'

type PatientTab =
  | 'avaliacao'
  | 'historico'
  | 'dados'
  | 'metodos'
  | 'notas'
  | 'intake'
  | 'questionarios'
  | 'picca'
  | 'documentos'

function parsePatientTab(value: string | null): PatientTab | null {
  if (
    value === 'avaliacao' ||
    value === 'historico' ||
    value === 'dados' ||
    value === 'metodos' ||
    value === 'notas' ||
    value === 'intake' ||
    value === 'questionarios' ||
    value === 'picca' ||
    value === 'documentos'
  ) {
    return value
  }
  return null
}

type SessionRow = {
  id: string
  status: string
  sessionKind?: string
  createdAt: string
  completedAt: string | null
  url?: string | null
  forms: Array<{ formId: string; status: string; definition?: { title: string } }>
}

type FormOption = {
  id: string
  title: string
  description: string | null
}

type PatientDetail = {
  id: string
  fullName: string
  email: string | null
  email2: string | null
  phone: string | null
  phone2: string | null
  birthDate: string | null
  sessionFee: number | null
  active?: boolean
  internalNotes: string | null
  appointmentNotes: string | null
  location?: { id: string; name: string }
  therapist?: { id: string; name: string }
  wiscSelections: string[]
  wiscResults?: WiscResults
  bancSelections: string[]
  bancResults?: BancResults
  additionalMethodSelections?: string[]
  questionnaireSelections?: string[]
  intakeSessions: SessionRow[]
  piccaSessions?: PiccaSessionRow[]
  piccaInteractiveSessions?: PiccaInteractiveSessionRow[]
}

export function PatientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { token, user } = useAuth()
  const readOnly = user?.role === 'coordinator'
  const [activeTab, setActiveTab] = useState<PatientTab>('avaliacao')
  const [patient, setPatient] = useState<PatientDetail | null>(null)
  const [locations, setLocations] = useState<LocationSummary[]>([])
  const [availableForms, setAvailableForms] = useState<FormOption[]>([])
  const [availableQuestionnaires, setAvailableQuestionnaires] = useState<FormOption[]>([])
  const [selectedForms, setSelectedForms] = useState<string[]>([])
  const [selectedQuestionnaires, setSelectedQuestionnaires] = useState<string[]>([])
  const [generatedUrl, setGeneratedUrl] = useState('')
  const [generatedQuestionnaireUrl, setGeneratedQuestionnaireUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submissions, setSubmissions] = useState<SessionSubmissionsView | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [sessionAction, setSessionAction] = useState<{
    type: 'revoke' | 'delete'
    sessionId: string
  } | null>(null)
  const [sessionActionLoading, setSessionActionLoading] = useState<string | null>(null)
  const [sessionActionError, setSessionActionError] = useState('')
  const [copyFeedback, setCopyFeedback] = useState('')
  const [editingPatient, setEditingPatient] = useState(false)
  const [nameDraft, setNameDraft] = useState('')
  const [locationIdDraft, setLocationIdDraft] = useState('')
  const [emailDraft, setEmailDraft] = useState('')
  const [email2Draft, setEmail2Draft] = useState('')
  const [phoneDraft, setPhoneDraft] = useState('')
  const [phone2Draft, setPhone2Draft] = useState('')
  const [birthDateDraft, setBirthDateDraft] = useState('')
  const [sessionFeeDraft, setSessionFeeDraft] = useState('')
  const [internalNotesDraft, setInternalNotesDraft] = useState('')
  const [patientEditError, setPatientEditError] = useState('')
  const [savingPatient, setSavingPatient] = useState(false)
  const [togglingActive, setTogglingActive] = useState(false)
  const [activeToggleError, setActiveToggleError] = useState('')

  const patientIsActive = patient?.active !== false

  useEffect(() => {
    if (!token || !id) return
    const request = readOnly
      ? coordinatorApi.getPatient(token, id)
      : therapistApi.getPatient(token, id)
    request
      .then((data) => setPatient(data.patient as unknown as PatientDetail))
      .finally(() => setLoading(false))
  }, [token, id, readOnly])

  useEffect(() => {
    const tab = parsePatientTab(searchParams.get('tab'))
    if (!tab) return
    if (tab === 'picca' && (readOnly || !user?.piccaEnabled)) return
    if (tab === 'questionarios' && !readOnly && !user?.questionnairesEnabled) return
    if (tab === 'metodos' && !readOnly && !user?.assessmentResultsEnabled) return
    setActiveTab(tab)
  }, [searchParams, readOnly, user?.piccaEnabled, user?.questionnairesEnabled, user?.assessmentResultsEnabled])

  useEffect(() => {
    if (!readOnly && !user?.questionnairesEnabled && activeTab === 'questionarios') {
      setActiveTab('avaliacao')
    }
  }, [readOnly, user?.questionnairesEnabled, activeTab])

  useEffect(() => {
    if (!readOnly && !user?.assessmentResultsEnabled && activeTab === 'metodos') {
      setActiveTab('avaliacao')
    }
  }, [readOnly, user?.assessmentResultsEnabled, activeTab])

  useEffect(() => {
    if (!token || readOnly) return
    therapistApi.listForms(token, 'intake').then((data) => setAvailableForms(data.forms))
    therapistApi.listLocations(token).then((data) => setLocations(data.locations))
  }, [token, readOnly])

  useEffect(() => {
    if (!token || readOnly || !user?.questionnairesEnabled) return
    therapistApi.listForms(token, 'questionnaire').then((data) => setAvailableQuestionnaires(data.forms))
  }, [token, readOnly, user?.questionnairesEnabled])

  function toggleForm(formId: string) {
    setSelectedForms((current) =>
      current.includes(formId) ? current.filter((f) => f !== formId) : [...current, formId],
    )
  }

  function toggleQuestionnaire(formId: string) {
    setSelectedQuestionnaires((current) =>
      current.includes(formId) ? current.filter((f) => f !== formId) : [...current, formId],
    )
  }

  async function handleGenerateLink(sessionKind: 'intake' | 'questionnaire' = 'intake') {
    if (!token || !id) return
    const formIds = sessionKind === 'questionnaire' ? selectedQuestionnaires : selectedForms
    setSubmitting(true)
    setError('')
    if (sessionKind === 'questionnaire') {
      setGeneratedQuestionnaireUrl('')
    } else {
      setGeneratedUrl('')
    }
    try {
      const result = await therapistApi.createSession(token, id, formIds, sessionKind)
      if (sessionKind === 'questionnaire') {
        setGeneratedQuestionnaireUrl(result.url)
      } else {
        setGeneratedUrl(result.url)
      }
      await refreshPatient()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível gerar o link')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleViewSubmissions(sessionId: string) {
    if (!token) return
    try {
      const result = readOnly
        ? await coordinatorApi.getSessionSubmissions(token, sessionId)
        : await therapistApi.getSessionSubmissions(token, sessionId)
      setSubmissions(result.session)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível carregar as respostas')
    }
  }

  const intakeSessions =
    patient?.intakeSessions.filter((session) => session.sessionKind !== 'questionnaire') ?? []
  const questionnaireSessions =
    patient?.intakeSessions.filter((session) => session.sessionKind === 'questionnaire') ?? []
  const sessionCount = patient?.intakeSessions.length ?? 0

  function sessionHasSubmissions(session: SessionRow) {
    return session.forms.some((form) => form.status === 'submitted')
  }

  async function handleDeletePatient() {
    if (!token || !id) return
    setDeleting(true)
    setDeleteError('')
    try {
      await therapistApi.deletePatient(token, id)
      navigate('/backoffice/patients', { replace: true })
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : 'Não foi possível eliminar o paciente')
    } finally {
      setDeleting(false)
    }
  }

  function sessionCanRevoke(session: SessionRow) {
    return sessionIsOpen(session)
  }

  function sessionCanDelete(_session: SessionRow) {
    return true
  }

  function sessionDeleteConfirmMessage(session: SessionRow, kind: 'formulários' | 'questionários') {
    const base = `Eliminar este conjunto de ${kind}? Esta ação não pode ser desfeita.`
    if (sessionHasSubmissions(session)) {
      return `${base} Todas as respostas submetidas serão apagadas permanentemente.`
    }
    return base
  }

  async function refreshPatient() {
    if (!token || !id) return
    const refreshed = readOnly
      ? await coordinatorApi.getPatient(token, id)
      : await therapistApi.getPatient(token, id)
    setPatient(refreshed.patient as unknown as PatientDetail)
  }

  async function handleRevokeSession(sessionId: string) {
    if (!token) return
    setSessionActionLoading(sessionId)
    setSessionActionError('')
    try {
      await therapistApi.revokeSession(token, sessionId)
      setSessionAction(null)
      if (generatedUrl) {
        setGeneratedUrl('')
      }
      if (generatedQuestionnaireUrl) {
        setGeneratedQuestionnaireUrl('')
      }
      await refreshPatient()
    } catch (err) {
      setSessionActionError(
        err instanceof ApiError ? err.message : 'Não foi possível revogar o link',
      )
    } finally {
      setSessionActionLoading(null)
    }
  }

  async function handleDeleteSession(sessionId: string) {
    if (!token) return
    setSessionActionLoading(sessionId)
    setSessionActionError('')
    try {
      await therapistApi.deleteSession(token, sessionId)
      setSessionAction(null)
      if (submissions?.id === sessionId) {
        setSubmissions(null)
      }
      if (generatedUrl) {
        setGeneratedUrl('')
      }
      if (generatedQuestionnaireUrl) {
        setGeneratedQuestionnaireUrl('')
      }
      await refreshPatient()
    } catch (err) {
      setSessionActionError(
        err instanceof ApiError ? err.message : 'Não foi possível eliminar o conjunto de formulários',
      )
    } finally {
      setSessionActionLoading(null)
    }
  }

  async function copyText(text: string, successMessage: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopyFeedback(successMessage)
      window.setTimeout(() => setCopyFeedback(''), 2000)
    } catch {
      setCopyFeedback('Não foi possível copiar.')
    }
  }

  async function copySessionUrl(url: string) {
    await copyText(url, 'Link copiado.')
  }

  function sessionIsOpen(session: SessionRow) {
    return session.status === 'active' || session.status === 'in_progress'
  }

  function renderSessionActions(session: SessionRow, deleteConfirmMessage: string) {
    return (
      <div className={styles.sessionActions}>
        {!readOnly && session.url && sessionIsOpen(session) && (
          <>
            <a href={session.url} target="_blank" rel="noreferrer" className={styles.linkButton}>
              Abrir link
            </a>
            <button type="button" className={styles.linkButton} onClick={() => copySessionUrl(session.url!)}>
              Copiar link
            </button>
          </>
        )}
        {sessionHasSubmissions(session) && (
          <button type="button" className={styles.linkButton} onClick={() => handleViewSubmissions(session.id)}>
            Ver respostas
          </button>
        )}
        {!readOnly && sessionAction?.sessionId === session.id ? (
          <div className={styles.sessionConfirm}>
            <p className={styles.muted}>
              {sessionAction.type === 'revoke'
                ? 'O link deixará de funcionar. O registo mantém-se no histórico.'
                : deleteConfirmMessage}
            </p>
            <div className={styles.rowActions}>
              <button
                type="button"
                className={styles.dangerLinkButton}
                disabled={sessionActionLoading === session.id}
                onClick={() =>
                  sessionAction.type === 'revoke'
                    ? handleRevokeSession(session.id)
                    : handleDeleteSession(session.id)
                }
              >
                {sessionActionLoading === session.id
                  ? 'A processar…'
                  : sessionAction.type === 'revoke'
                    ? 'Sim, revogar'
                    : 'Sim, eliminar'}
              </button>
              <button
                type="button"
                className={styles.linkButton}
                disabled={sessionActionLoading === session.id}
                onClick={() => {
                  setSessionAction(null)
                  setSessionActionError('')
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          !readOnly && (
            <>
              {sessionCanRevoke(session) && (
                <button
                  type="button"
                  className={styles.dangerLinkButton}
                  disabled={sessionActionLoading === session.id}
                  onClick={() => {
                    setSessionActionError('')
                    setSessionAction({ type: 'revoke', sessionId: session.id })
                  }}
                >
                  Revogar link
                </button>
              )}
              {sessionCanDelete(session) && (
                <button
                  type="button"
                  className={styles.dangerLinkButton}
                  disabled={sessionActionLoading === session.id}
                  onClick={() => {
                    setSessionActionError('')
                    setSessionAction({ type: 'delete', sessionId: session.id })
                  }}
                >
                  Eliminar
                </button>
              )}
            </>
          )
        )}
      </div>
    )
  }

  function toDateInputValue(value: string | null): string {
    if (!value) return ''
    return value.slice(0, 10)
  }

  function formatBirthDate(value: string | null): string | null {
    if (!value) return null
    const date = new Date(`${value.slice(0, 10)}T12:00:00`)
    if (Number.isNaN(date.getTime())) return null
    return date.toLocaleDateString('pt-PT')
  }

  function startEditingPatient() {
    if (!patient) return
    setNameDraft(patient.fullName)
    setLocationIdDraft(patient.location?.id ?? '')
    setEmailDraft(patient.email ?? '')
    setEmail2Draft(patient.email2 ?? '')
    setPhoneDraft(patient.phone ?? '')
    setPhone2Draft(patient.phone2 ?? '')
    setBirthDateDraft(toDateInputValue(patient.birthDate))
    setSessionFeeDraft(patient.sessionFee != null ? String(patient.sessionFee) : '')
    setInternalNotesDraft(patient.internalNotes ?? '')
    setPatientEditError('')
    setEditingPatient(true)
  }

  function cancelEditingPatient() {
    setEditingPatient(false)
    setNameDraft('')
    setLocationIdDraft('')
    setEmailDraft('')
    setEmail2Draft('')
    setPhoneDraft('')
    setPhone2Draft('')
    setBirthDateDraft('')
    setSessionFeeDraft('')
    setInternalNotesDraft('')
    setPatientEditError('')
  }

  async function handleSavePatient(event: React.FormEvent) {
    event.preventDefault()
    if (!token || !id || !nameDraft.trim() || !locationIdDraft) return
    setSavingPatient(true)
    setPatientEditError('')
    try {
      const result = await therapistApi.updatePatient(token, id, {
        fullName: nameDraft.trim(),
        locationId: locationIdDraft,
        email: emailDraft,
        email2: email2Draft,
        phone: phoneDraft,
        phone2: phone2Draft,
        birthDate: birthDateDraft,
        internalNotes: internalNotesDraft,
        sessionFee: sessionFeeDraft.trim() ? Number(sessionFeeDraft) : null,
      })
      setPatient((current) =>
        current
          ? {
              ...current,
              fullName: result.patient.fullName,
              email: result.patient.email,
              email2: result.patient.email2,
              phone: result.patient.phone,
              phone2: result.patient.phone2,
              birthDate: result.patient.birthDate,
              sessionFee: result.patient.sessionFee,
              internalNotes: result.patient.internalNotes,
              location: result.patient.location,
            }
          : current,
      )
      setEditingPatient(false)
    } catch (err) {
      setPatientEditError(
        err instanceof ApiError ? err.message : 'Não foi possível atualizar os dados do paciente',
      )
    } finally {
      setSavingPatient(false)
    }
  }

  async function togglePatientActive() {
    if (!token || !id || !patient || readOnly) return
    setTogglingActive(true)
    setActiveToggleError('')
    try {
      const nextActive = !patientIsActive
      const result = await therapistApi.setPatientActive(token, id, nextActive)
      setPatient((current) =>
        current
          ? {
              ...current,
              active: result.patient.active,
            }
          : current,
      )
    } catch (err) {
      setActiveToggleError(
        err instanceof ApiError ? err.message : 'Não foi possível alterar o estado do paciente',
      )
    } finally {
      setTogglingActive(false)
    }
  }

  function formatDetailValue(value: string | null | undefined): string {
    return value?.trim() ? value : '—'
  }

  function formatSessionFee(value: number | null): string {
    if (value == null) return 'Predefinido nas finanças'
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value)
  }

  if (loading) {
    return (
      <BackofficeLayout>
        <p className={styles.muted}>A carregar…</p>
      </BackofficeLayout>
    )
  }

  if (!patient) {
    return (
      <BackofficeLayout>
        <p className={styles.error}>Paciente não encontrado.</p>
        <Link to="/backoffice/patients">← Voltar</Link>
      </BackofficeLayout>
    )
  }

  return (
    <BackofficeLayout>
      <p className={styles.muted}>
        <Link to="/backoffice/patients">← Pacientes</Link>
      </p>
      {editingPatient && !readOnly ? (
        <form className={styles.editPatientForm} onSubmit={handleSavePatient}>
          <div className={styles.field}>
            <label htmlFor="patientFullName">Nome completo</label>
            <input
              id="patientFullName"
              value={nameDraft}
              onChange={(event) => setNameDraft(event.target.value)}
              minLength={2}
              required
              autoFocus
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="patientLocationId">Local de consulta</label>
            <select
              id="patientLocationId"
              value={locationIdDraft}
              onChange={(event) => setLocationIdDraft(event.target.value)}
              required
            >
              <option value="">Selecione um local</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="patientEmail">Email</label>
            <input
              id="patientEmail"
              type="email"
              value={emailDraft}
              onChange={(event) => setEmailDraft(event.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="patientEmail2">Email 2</label>
            <input
              id="patientEmail2"
              type="email"
              value={email2Draft}
              onChange={(event) => setEmail2Draft(event.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="patientPhone">Telefone</label>
            <input
              id="patientPhone"
              type="tel"
              value={phoneDraft}
              onChange={(event) => setPhoneDraft(event.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="patientPhone2">Telefone 2</label>
            <input
              id="patientPhone2"
              type="tel"
              value={phone2Draft}
              onChange={(event) => setPhone2Draft(event.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="patientBirthDate">Data de nascimento</label>
            <input
              id="patientBirthDate"
              type="date"
              value={birthDateDraft}
              onChange={(event) => setBirthDateDraft(event.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="patientSessionFee">Valor da consulta (€)</label>
            <input
              id="patientSessionFee"
              type="number"
              min="0"
              step="0.01"
              value={sessionFeeDraft}
              onChange={(event) => setSessionFeeDraft(event.target.value)}
              placeholder="Predefinido nas finanças"
            />
            <p className={styles.muted}>
              Opcional. Substitui o valor predefinido do terapeuta e atualiza todas as consultas deste paciente.
            </p>
          </div>
          <div className={styles.field}>
            <label htmlFor="patientInternalNotes">Notas internas</label>
            <textarea
              id="patientInternalNotes"
              value={internalNotesDraft}
              onChange={(event) => setInternalNotesDraft(event.target.value)}
            />
          </div>
          <div className={styles.editPatientActions}>
            <Button
              type="submit"
              disabled={savingPatient || nameDraft.trim().length < 2 || !locationIdDraft}
            >
              {savingPatient ? 'A guardar…' : 'Guardar'}
            </Button>
            <button
              type="button"
              className={styles.linkButton}
              onClick={cancelEditingPatient}
              disabled={savingPatient}
            >
              Cancelar
            </button>
          </div>
          {patientEditError && <p className={styles.error}>{patientEditError}</p>}
        </form>
      ) : (
        <div className={styles.titleRow}>
          <h1 className={styles.pageTitle}>
            {patient.fullName}
            {!patientIsActive ? (
              <>
                {' '}
                <Badge variant="muted">Inactivo</Badge>
              </>
            ) : null}
          </h1>
          {!readOnly && (
            <button type="button" className={styles.linkButton} onClick={startEditingPatient}>
              Editar dados
            </button>
          )}
        </div>
      )}
      {readOnly && (
        <p className={styles.muted} style={{ marginTop: '-0.5rem' }}>
          Apenas consulta — não pode alterar dados do paciente.
        </p>
      )}
      <div className={tabStyles.patientMeta}>
        <p className={styles.muted}>
          {[
            patient.therapist?.name ? `Terapeuta: ${patient.therapist.name}` : null,
            formatBirthDate(patient.birthDate),
            patient.sessionFee != null
              ? `Consulta: ${new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(patient.sessionFee)}`
              : null,
            patient.location?.name,
          ]
            .filter(Boolean)
            .join(' · ') || null}
        </p>
        {(patient.email || patient.email2 || patient.phone || patient.phone2) && (
          <div className={tabStyles.contactRow}>
            {[
              patient.email ? { label: 'Email', value: patient.email } : null,
              patient.email2 ? { label: 'Email 2', value: patient.email2 } : null,
              patient.phone ? { label: 'Telefone', value: patient.phone } : null,
              patient.phone2 ? { label: 'Telefone 2', value: patient.phone2 } : null,
            ]
              .filter((item): item is { label: string; value: string } => item != null)
              .map((item, index) => (
                <span key={item.value} className={tabStyles.contactItem}>
                  {index > 0 && <span className={tabStyles.contactSep}>·</span>}
                  <button
                    type="button"
                    className={styles.linkButton}
                    onClick={() => copyText(item.value, `${item.label} copiado.`)}
                    title={`Copiar ${item.label.toLowerCase()}`}
                  >
                    {item.value}
                  </button>
                </span>
              ))}
          </div>
        )}
        <p className={styles.muted}>
          <Link to="/backoffice/attendance">Ver presenças</Link>
          {!readOnly && patientIsActive && (
            <>
              {' · '}
              <Link to={appointmentsCreateHref({ patientId: patient.id, locationId: patient.location?.id })}>
                Marcar consulta
              </Link>
            </>
          )}
          {copyFeedback && (
            <>
              {' · '}
              <span>{copyFeedback}</span>
            </>
          )}
        </p>
      </div>

      <div className={tabStyles.tabs} role="tablist" aria-label="Secções do utente">
        {(
          [
            ['avaliacao', 'Estado da avaliação'],
            ['dados', 'Dados'],
            ...(readOnly || user?.assessmentResultsEnabled
              ? [['metodos', 'Métodos de avaliação'] as const]
              : []),
            ['notas', 'Notas'],
            ['intake', 'Formulários'],
            ...(readOnly || user?.questionnairesEnabled ? [['questionarios', 'Questionários'] as const] : []),
            ...(!readOnly && user?.piccaEnabled ? [['picca', 'PICCA'] as const] : []),
            ['documentos', 'Documentos'],
            ['historico', 'Histórico recente'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={activeTab === id}
            className={activeTab === id ? `${tabStyles.tab} ${tabStyles.tabActive}` : tabStyles.tab}
            onClick={() => setActiveTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={tabStyles.tabPanel}>
      {activeTab === 'avaliacao' && token && id && (
        <AssessmentPipelinePanel
          token={token}
          patientId={id}
          readOnly={readOnly}
          onOpenIntakeTab={() => setActiveTab('intake')}
          onOpenPiccaTab={() => setActiveTab('picca')}
          onOpenDocumentsTab={() => setActiveTab('documentos')}
        />
      )}

      {activeTab === 'historico' && token && id && (
        <PatientTimelinePanel
          token={token}
          patientId={id}
          readOnly={readOnly}
          onOpenIntakeTab={() => setActiveTab('intake')}
        />
      )}

      {activeTab === 'dados' && !editingPatient && (
        <>
          <Card as="section" className={tabStyles.detailCard}>
            <h2>Dados do utente</h2>
            <dl className={tabStyles.detailList}>
              <div className={tabStyles.detailItem}>
                <dt>Nome completo</dt>
                <dd>{patient.fullName}</dd>
              </div>
              <div className={tabStyles.detailItem}>
                <dt>Local de consulta</dt>
                <dd>{formatDetailValue(patient.location?.name)}</dd>
              </div>
              <div className={tabStyles.detailItem}>
                <dt>Email</dt>
                <dd>{formatDetailValue(patient.email)}</dd>
              </div>
              <div className={tabStyles.detailItem}>
                <dt>Email 2</dt>
                <dd>{formatDetailValue(patient.email2)}</dd>
              </div>
              <div className={tabStyles.detailItem}>
                <dt>Telefone</dt>
                <dd>{formatDetailValue(patient.phone)}</dd>
              </div>
              <div className={tabStyles.detailItem}>
                <dt>Telefone 2</dt>
                <dd>{formatDetailValue(patient.phone2)}</dd>
              </div>
              <div className={tabStyles.detailItem}>
                <dt>Data de nascimento</dt>
                <dd>{formatBirthDate(patient.birthDate) ?? '—'}</dd>
              </div>
              <div className={tabStyles.detailItem}>
                <dt>Estado</dt>
                <dd>{patientIsActive ? 'Activo' : 'Inactivo'}</dd>
              </div>
              <div className={tabStyles.detailItem}>
                <dt>Valor da consulta</dt>
                <dd>{formatSessionFee(patient.sessionFee)}</dd>
              </div>
              {readOnly && patient.therapist && (
                <div className={tabStyles.detailItem}>
                  <dt>Terapeuta</dt>
                  <dd>{patient.therapist.name}</dd>
                </div>
              )}
            </dl>
            {!readOnly && (
              <div className={tabStyles.detailFooter}>
                <button type="button" className={styles.linkButton} onClick={startEditingPatient}>
                  Editar dados
                </button>
                {' · '}
                <button
                  type="button"
                  className={patientIsActive ? styles.dangerLinkButton : styles.linkButton}
                  onClick={togglePatientActive}
                  disabled={togglingActive}
                >
                  {togglingActive
                    ? 'A processar…'
                    : patientIsActive
                      ? 'Desactivar paciente'
                      : 'Activar paciente'}
                </button>
                {' · '}
                <Link to="/backoffice/attendance">Ver presenças</Link>
                {activeToggleError ? <p className={styles.error}>{activeToggleError}</p> : null}
              </div>
            )}
          </Card>

          {patient.internalNotes && (
            <Card as="section">
              <h2>Notas internas</h2>
              <p className={tabStyles.internalNotes}>{patient.internalNotes}</p>
            </Card>
          )}

          {!readOnly && (
          <section className={`${styles.dangerZone} ${styles.sectionSpacedTop}`}>
            <h2>Zona de perigo</h2>
            <p className={styles.muted}>
              Eliminar este paciente remove permanentemente o perfil, todos os formulários gerados, respostas
              submetidas, rascunhos e registos de presença. Esta ação não pode ser desfeita.
            </p>
            {!confirmDelete ? (
              <Button type="button" variant="outline" onClick={() => setConfirmDelete(true)}>
                Eliminar paciente…
              </Button>
            ) : (
              <>
                <p className={styles.error}>
                  Tem a certeza que pretende eliminar <strong>{patient.fullName}</strong>?
                  {sessionCount > 0 && (
                    <>
                      {' '}
                      Serão apagados {sessionCount} conjunto{sessionCount === 1 ? '' : 's'} de formulários e todos os
                      dados associados.
                    </>
                  )}
                </p>
                {deleteError && <p className={styles.error}>{deleteError}</p>}
                <div className={styles.dangerActions}>
                  <Button type="button" onClick={handleDeletePatient} disabled={deleting}>
                    {deleting ? 'A eliminar…' : 'Sim, eliminar tudo'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setConfirmDelete(false)
                      setDeleteError('')
                    }}
                    disabled={deleting}
                  >
                    Cancelar
                  </Button>
                </div>
              </>
            )}
          </section>
          )}
        </>
      )}

      {activeTab === 'metodos' && token && id && (readOnly || user?.assessmentResultsEnabled) && (
        <PatientEvaluationsPanel
          token={token}
          patientId={id}
          readOnly={readOnly}
          initialSelections={{
            wiscSelections: patient.wiscSelections ?? [],
            wiscResults: patient.wiscResults ?? emptyWiscResults(),
            bancSelections: patient.bancSelections ?? [],
            bancResults: patient.bancResults ?? emptyBancResults(),
            additionalMethodSelections: patient.additionalMethodSelections ?? [],
          }}
        />
      )}

      {activeTab === 'intake' && (
      <>
      {!readOnly && (
      <Card as="section" className={styles.sectionSpaced}>
        <h2>Gerar link de formulários</h2>
        <p className={styles.muted}>Selecione os formulários a incluir no link único do paciente.</p>
        {availableForms.length === 0 ? (
          <p className={styles.muted}>Ainda não existem formulários disponíveis para atribuir.</p>
        ) : (
          <div className={styles.checkboxGroup} style={{ margin: 'var(--space-md) 0' }}>
            {availableForms.map((form) => (
              <div key={form.id} className={styles.formSelectRow}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedForms.includes(form.id)}
                    onChange={() => toggleForm(form.id)}
                  />
                  {form.title}
                </label>
                <a
                  className={styles.previewLink}
                  href={formPreviewHref(form.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Pré-visualizar
                </a>
              </div>
            ))}
          </div>
        )}
        {error && <p className={styles.error}>{error}</p>}
        <Button
          type="button"
          onClick={() => handleGenerateLink('intake')}
          disabled={submitting || selectedForms.length === 0 || availableForms.length === 0}
        >
          {submitting ? 'A gerar…' : 'Gerar link'}
        </Button>
        {generatedUrl && (
          <div className={styles.successBox} style={{ marginTop: 'var(--space-md)' }}>
            <strong>Link gerado</strong>
            <p>{generatedUrl}</p>
            <p className={styles.muted} style={{ marginTop: 'var(--space-sm)' }}>
              Pode voltar a consultar ou copiar este link na lista de formulários enquanto estiver em curso.
            </p>
          </div>
        )}
      </Card>
      )}

      <Card as="section">
        <h2>Formulários</h2>
        <p className={styles.muted}>
          {readOnly
            ? 'Histórico de formulários de intake do paciente (apenas consulta).'
            : 'Pode revogar links em curso ou eliminar conjuntos criados por engano, incluindo os que já têm respostas submetidas.'}
        </p>
        {copyFeedback && <p className={styles.muted}>{copyFeedback}</p>}
        {sessionActionError && <p className={styles.error}>{sessionActionError}</p>}
        {intakeSessions.length === 0 ? (
          <p className={styles.muted}>Ainda não existem formulários gerados.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Data</th>
                <th>Estado</th>
                <th>Formulários</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {intakeSessions.map((session) => (
                <tr key={session.id}>
                  <td>{new Date(session.createdAt).toLocaleString('pt-PT')}</td>
                  <td>
                    <Badge variant={sessionStatusBadgeVariant(session.status)}>
                      {formatSessionStatus(session.status)}
                    </Badge>
                  </td>
                  <td>
                    <div className={styles.formStatusList}>
                      {session.forms.map((form) => (
                        <div key={form.formId} className={styles.formStatusItem}>
                          <span>{form.definition?.title ?? form.formId}</span>
                          <Badge variant={formStatusBadgeVariant(form.status)}>
                            {formatFormStatus(form.status)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>
                    {renderSessionActions(session, sessionDeleteConfirmMessage(session, 'formulários'))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {submissions && activeTab === 'intake' && (
        <FormSubmissionsPanel session={submissions} onClose={() => setSubmissions(null)} />
      )}
      </>
      )}

      {activeTab === 'questionarios' && (
      <>
      {!readOnly && (
      <Card as="section" className={styles.sectionSpaced}>
        <h2>Gerar link de questionários</h2>
        <p className={styles.muted}>Selecione os questionários a incluir no link único do paciente ou informador.</p>
        {availableQuestionnaires.length === 0 ? (
          <p className={styles.muted}>Ainda não existem questionários disponíveis.</p>
        ) : (
          <div className={styles.checkboxGroup} style={{ margin: 'var(--space-md) 0' }}>
            {availableQuestionnaires.map((form) => (
              <div key={form.id} className={styles.formSelectRow}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedQuestionnaires.includes(form.id)}
                    onChange={() => toggleQuestionnaire(form.id)}
                  />
                  {form.title}
                </label>
                <a
                  className={styles.previewLink}
                  href={formPreviewHref(form.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Pré-visualizar
                </a>
              </div>
            ))}
          </div>
        )}
        {error && <p className={styles.error}>{error}</p>}
        <Button
          type="button"
          onClick={() => handleGenerateLink('questionnaire')}
          disabled={submitting || selectedQuestionnaires.length === 0 || availableQuestionnaires.length === 0}
        >
          {submitting ? 'A gerar…' : 'Gerar link'}
        </Button>
        {generatedQuestionnaireUrl && (
          <div className={styles.successBox} style={{ marginTop: 'var(--space-md)' }}>
            <strong>Link gerado</strong>
            <p>{generatedQuestionnaireUrl}</p>
          </div>
        )}
      </Card>
      )}

      <Card as="section">
        <h2>Questionários</h2>
        <p className={styles.muted}>
          {readOnly
            ? 'Histórico de questionários do paciente (apenas consulta).'
            : 'Pode revogar links em curso ou eliminar conjuntos criados por engano, incluindo os que já têm respostas submetidas.'}
        </p>
        {copyFeedback && <p className={styles.muted}>{copyFeedback}</p>}
        {sessionActionError && <p className={styles.error}>{sessionActionError}</p>}
        {questionnaireSessions.length === 0 ? (
          <p className={styles.muted}>Ainda não existem questionários gerados.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Data</th>
                <th>Estado</th>
                <th>Questionários</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {questionnaireSessions.map((session) => (
                <tr key={session.id}>
                  <td>{new Date(session.createdAt).toLocaleString('pt-PT')}</td>
                  <td>
                    <Badge variant={sessionStatusBadgeVariant(session.status)}>
                      {formatSessionStatus(session.status)}
                    </Badge>
                  </td>
                  <td>
                    <div className={styles.formStatusList}>
                      {session.forms.map((form) => (
                        <div key={form.formId} className={styles.formStatusItem}>
                          <span>{form.definition?.title ?? form.formId}</span>
                          <Badge variant={formStatusBadgeVariant(form.status)}>
                            {formatFormStatus(form.status)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>
                    {renderSessionActions(session, sessionDeleteConfirmMessage(session, 'questionários'))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {submissions && activeTab === 'questionarios' && (
        <FormSubmissionsPanel session={submissions} onClose={() => setSubmissions(null)} />
      )}
      </>
      )}

      {token && id && (
        <div hidden={activeTab !== 'notas'}>
          <PatientAppointmentNotesPanel
            token={token}
            patientId={id}
            readOnly={readOnly}
            isActive={activeTab === 'notas'}
            initialNotes={patient.appointmentNotes}
            exportMeta={{
              fullName: patient.fullName,
              birthDate: patient.birthDate,
              locationName: patient.location?.name ?? null,
              therapistName: patient.therapist?.name ?? null,
              email: patient.email,
              phone: patient.phone,
            }}
          />
        </div>
      )}

      {activeTab === 'picca' && user?.piccaEnabled && token && id && (
        <>
          <PiccaPatientSection
            token={token}
            patientId={id}
            sessions={patient.piccaSessions ?? []}
            onRefresh={refreshPatient}
          />
          <PiccaInteractivePatientSection
            token={token}
            patientId={id}
            sessions={patient.piccaInteractiveSessions ?? []}
            onRefresh={refreshPatient}
          />
        </>
      )}

      {activeTab === 'documentos' && (
        <PatientDocumentsPanel patientId={patient.id} readOnly={readOnly} />
      )}
      </div>
    </BackofficeLayout>
  )
}
