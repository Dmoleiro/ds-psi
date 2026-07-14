import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BackofficeLayout } from '../../components/backoffice/BackofficeLayout'
import { piccaFormsPage } from '../../content/site.pt'
import { ApiError, therapistApi } from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import styles from '../../components/backoffice/BackofficeLayout.module.css'

type SessionRow = {
  id: string
  status: string
  createdAt: string
  completedAt: string | null
  forms: Array<{ formId: string; status: string; definition?: { title: string } }>
}

type PatientDetail = {
  id: string
  fullName: string
  email: string | null
  phone: string | null
  birthDate: string | null
  internalNotes: string | null
  location?: { id: string; name: string }
  intakeSessions: SessionRow[]
}

export function PatientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [patient, setPatient] = useState<PatientDetail | null>(null)
  const [selectedForms, setSelectedForms] = useState<string[]>(['intake', 'consent', 'history'])
  const [generatedUrl, setGeneratedUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submissions, setSubmissions] = useState<unknown[] | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    if (!token || !id) return
    therapistApi
      .getPatient(token, id)
      .then((data) => setPatient(data.patient as unknown as PatientDetail))
      .finally(() => setLoading(false))
  }, [token, id])

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
    const result = await therapistApi.getSessionSubmissions(token, sessionId)
    const session = result.session as { submissions: unknown[] }
    setSubmissions(session.submissions)
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

  const sessionCount = patient?.intakeSessions.length ?? 0

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
      <h1 className={styles.pageTitle}>{patient.fullName}</h1>
      <p className={styles.muted}>
        {[patient.email, patient.phone, patient.location?.name].filter(Boolean).join(' · ') || 'Sem contacto'}
        {' · '}
        <Link to="/backoffice/attendance">Ver presenças</Link>
      </p>
      {patient.internalNotes && (
        <Card as="section" className={styles.sectionSpaced}>
          <h2>Notas internas</h2>
          <p>{patient.internalNotes}</p>
        </Card>
      )}

      <Card as="section" className={styles.sectionSpaced}>
        <h2>Gerar link de formulários</h2>
        <p className={styles.muted}>Selecione os formulários a incluir no link único do paciente.</p>
        <div className={styles.checkboxGroup} style={{ margin: 'var(--space-md) 0' }}>
          {piccaFormsPage.forms.map((form) => (
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
        {error && <p className={styles.error}>{error}</p>}
        <Button type="button" onClick={handleGenerateLink} disabled={submitting || selectedForms.length === 0}>
          {submitting ? 'A gerar…' : 'Gerar link'}
        </Button>
        {generatedUrl && (
          <div className={styles.successBox} style={{ marginTop: 'var(--space-md)' }}>
            <strong>Link gerado (mostrado apenas uma vez):</strong>
            <p>{generatedUrl}</p>
          </div>
        )}
      </Card>

      <Card as="section">
        <h2>Sessões</h2>
        {patient.intakeSessions.length === 0 ? (
          <p className={styles.muted}>Ainda não existem links gerados.</p>
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
                    <Badge variant={session.status === 'completed' ? 'accent' : 'muted'}>
                      {session.status}
                    </Badge>
                  </td>
                  <td>
                    {session.forms
                      .map((f) => `${f.definition?.title ?? f.formId}: ${f.status}`)
                      .join(' · ')}
                  </td>
                  <td>
                    {session.status === 'completed' && (
                      <button
                        type="button"
                        className={styles.linkButton}
                        onClick={() => handleViewSubmissions(session.id)}
                      >
                        Ver respostas
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {submissions && (
        <Card as="section" className={styles.sectionSpacedTop}>
          <h2>Respostas submetidas</h2>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>
            {JSON.stringify(submissions, null, 2)}
          </pre>
        </Card>
      )}

      <section className={`${styles.dangerZone} ${styles.sectionSpacedTop}`}>
        <h2>Zona de perigo</h2>
        <p className={styles.muted}>
          Eliminar este paciente remove permanentemente o perfil, todas as sessões de formulários, respostas
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
                  Serão apagadas {sessionCount} sessão{sessionCount === 1 ? '' : 'ões'} de formulários e todos os
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
