import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FormSubmissionsPanel } from '../../components/backoffice/FormSubmissionsPanel'
import { BackofficeLayout } from '../../components/backoffice/BackofficeLayout'
import { ApiError, therapistApi, type LocationSummary } from '../../lib/api'
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

type SessionRow = {
  id: string
  status: string
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
  internalNotes: string | null
  location?: { id: string; name: string }
  intakeSessions: SessionRow[]
}

export function PatientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [patient, setPatient] = useState<PatientDetail | null>(null)
  const [locations, setLocations] = useState<LocationSummary[]>([])
  const [availableForms, setAvailableForms] = useState<FormOption[]>([])
  const [selectedForms, setSelectedForms] = useState<string[]>([])
  const [generatedUrl, setGeneratedUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submissions, setSubmissions] = useState<SessionSubmissionsView | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')
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

  useEffect(() => {
    if (!token || !id) return
    therapistApi
      .getPatient(token, id)
      .then((data) => setPatient(data.patient as unknown as PatientDetail))
      .finally(() => setLoading(false))
  }, [token, id])

  useEffect(() => {
    if (!token) return
    therapistApi.listForms(token).then((data) => setAvailableForms(data.forms))
    therapistApi.listLocations(token).then((data) => setLocations(data.locations))
  }, [token])

  function toggleForm(formId: string) {
    setSelectedForms((current) =>
      current.includes(formId) ? current.filter((f) => f !== formId) : [...current, formId],
    )
  }

  async function handleGenerateLink() {
    if (!token || !id) return
    setSubmitting(true)
    setError('')
    setGeneratedUrl('')
    try {
      const result = await therapistApi.createSession(token, id, selectedForms)
      setGeneratedUrl(result.url)
      const refreshed = await therapistApi.getPatient(token, id)
      setPatient(refreshed.patient as unknown as PatientDetail)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível gerar o link')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleViewSubmissions(sessionId: string) {
    if (!token) return
    try {
      const result = await therapistApi.getSessionSubmissions(token, sessionId)
      setSubmissions(result.session)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível carregar as respostas')
    }
  }

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

  async function copySessionUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url)
      setCopyFeedback('Link copiado.')
      window.setTimeout(() => setCopyFeedback(''), 2000)
    } catch {
      setCopyFeedback('Não foi possível copiar o link.')
    }
  }

  function sessionIsOpen(session: SessionRow) {
    return session.status === 'active' || session.status === 'in_progress'
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
      {editingPatient ? (
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
              Opcional. Substitui o valor predefinido do terapeuta ao criar consultas.
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
          <h1 className={styles.pageTitle}>{patient.fullName}</h1>
          <button type="button" className={styles.linkButton} onClick={startEditingPatient}>
            Editar dados
          </button>
        </div>
      )}
      <p className={styles.muted}>
        {[
          patient.email,
          patient.email2,
          patient.phone,
          patient.phone2,
          formatBirthDate(patient.birthDate),
          patient.sessionFee != null
            ? `Consulta: ${new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(patient.sessionFee)}`
            : null,
          patient.location?.name,
        ]
          .filter(Boolean)
          .join(' · ') || 'Sem contacto'}
        {' · '}
        <Link to="/backoffice/attendance">Ver presenças</Link>
      </p>
      {!editingPatient && patient.internalNotes && (
        <Card as="section" className={styles.sectionSpaced}>
          <h2>Notas internas</h2>
          <p>{patient.internalNotes}</p>
        </Card>
      )}

      <Card as="section" className={styles.sectionSpaced}>
        <h2>Gerar link de formulários</h2>
        <p className={styles.muted}>Selecione os formulários a incluir no link único do paciente.</p>
        {availableForms.length === 0 ? (
          <p className={styles.muted}>Ainda não existem formulários disponíveis para atribuir.</p>
        ) : (
          <div className={styles.checkboxGroup} style={{ margin: 'var(--space-md) 0' }}>
            {availableForms.map((form) => (
              <label key={form.id}>
                <input
                  type="checkbox"
                  checked={selectedForms.includes(form.id)}
                  onChange={() => toggleForm(form.id)}
                />
                {form.title}
              </label>
            ))}
          </div>
        )}
        {error && <p className={styles.error}>{error}</p>}
        <Button
          type="button"
          onClick={handleGenerateLink}
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

      <Card as="section">
        <h2>Formulários</h2>
        {copyFeedback && <p className={styles.muted}>{copyFeedback}</p>}
        {patient.intakeSessions.length === 0 ? (
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
              {patient.intakeSessions.map((session) => (
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
                    <div className={styles.sessionActions}>
                      {session.url && sessionIsOpen(session) && (
                        <>
                          <a
                            href={session.url}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.linkButton}
                          >
                            Abrir link
                          </a>
                          <button
                            type="button"
                            className={styles.linkButton}
                            onClick={() => copySessionUrl(session.url!)}
                          >
                            Copiar link
                          </button>
                        </>
                      )}
                      {sessionHasSubmissions(session) && (
                        <button
                          type="button"
                          className={styles.linkButton}
                          onClick={() => handleViewSubmissions(session.id)}
                        >
                          Ver respostas
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {submissions && (
        <FormSubmissionsPanel session={submissions} onClose={() => setSubmissions(null)} />
      )}

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
    </BackofficeLayout>
  )
}
