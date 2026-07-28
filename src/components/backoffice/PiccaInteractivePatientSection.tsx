import { useEffect, useState } from 'react'
import { ApiError, therapistApi } from '../../lib/api'
import type { PiccaInteractiveFormKind } from '../../lib/piccaInteractiveKinds'
import type { PiccaInteractiveEntriesView } from './PiccaInteractiveEntriesPanel'
import { PiccaInteractiveEntriesPanel } from './PiccaInteractiveEntriesPanel'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import styles from './BackofficeLayout.module.css'
import { formatSessionStatus, sessionStatusBadgeVariant } from '../../lib/intakeStatus'

export type PiccaInteractiveSessionRow = {
  id: string
  status: string
  createdAt: string
  revokedAt: string | null
  url?: string | null
  forms: Array<{
    formId: string
    title: string
    kind: PiccaInteractiveFormKind
  }>
}

type Props = {
  token: string
  patientId: string
  sessions: PiccaInteractiveSessionRow[]
  onRefresh: () => Promise<void>
}

export function PiccaInteractivePatientSection({
  token,
  patientId,
  sessions,
  onRefresh,
}: Props) {
  const [availableForms, setAvailableForms] = useState<
    Array<{ id: string; title: string; description: string | null; kind: string }>
  >([])
  const [selectedForms, setSelectedForms] = useState<string[]>([])
  const [generatedUrl, setGeneratedUrl] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [entries, setEntries] = useState<PiccaInteractiveEntriesView | null>(null)
  const [sessionAction, setSessionAction] = useState<{
    type: 'revoke' | 'delete'
    sessionId: string
  } | null>(null)
  const [sessionActionLoading, setSessionActionLoading] = useState<string | null>(null)
  const [sessionActionError, setSessionActionError] = useState('')
  const [copyFeedback, setCopyFeedback] = useState('')

  useEffect(() => {
    therapistApi.listPiccaInteractiveForms(token).then((data) => setAvailableForms(data.forms))
  }, [token])

  function toggleForm(formId: string) {
    setSelectedForms((current) =>
      current.includes(formId) ? current.filter((id) => id !== formId) : [...current, formId],
    )
  }

  async function handleGenerateLink() {
    setSubmitting(true)
    setError('')
    setGeneratedUrl('')
    try {
      const result = await therapistApi.createPiccaInteractiveSession(token, patientId, selectedForms)
      setGeneratedUrl(result.url)
      await onRefresh()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível gerar o link')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleViewEntries(sessionId: string) {
    try {
      const result = await therapistApi.getPiccaInteractiveSessionEntries(token, sessionId)
      setEntries(result.session)
      window.requestAnimationFrame(() => {
        document.getElementById('picca-interactive-entries')?.scrollIntoView({ behavior: 'smooth' })
      })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível carregar os registos')
    }
  }

  async function handleRevokeSession(sessionId: string) {
    setSessionActionLoading(sessionId)
    setSessionActionError('')
    try {
      await therapistApi.revokePiccaInteractiveSession(token, sessionId)
      setSessionAction(null)
      if (generatedUrl) setGeneratedUrl('')
      await onRefresh()
    } catch (err) {
      setSessionActionError(
        err instanceof ApiError ? err.message : 'Não foi possível revogar o link',
      )
    } finally {
      setSessionActionLoading(null)
    }
  }

  async function handleDeleteSession(sessionId: string) {
    setSessionActionLoading(sessionId)
    setSessionActionError('')
    try {
      await therapistApi.deletePiccaInteractiveSession(token, sessionId)
      setSessionAction(null)
      if (entries?.id === sessionId) {
        setEntries(null)
      }
      if (generatedUrl) setGeneratedUrl('')
      await onRefresh()
    } catch (err) {
      setSessionActionError(
        err instanceof ApiError ? err.message : 'Não foi possível eliminar a sessão',
      )
    } finally {
      setSessionActionLoading(null)
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

  function sessionIsOpen(session: PiccaInteractiveSessionRow) {
    return session.status === 'active' || session.status === 'in_progress'
  }

  return (
    <>
      <Card as="section" className={styles.sectionSpaced}>
        <h2>Registos interativos — gerar link</h2>
        <p className={styles.muted}>
          Formulários semanais/diários com link de longa duração. Não misture com módulos de
          avaliação PICCA no mesmo link.
        </p>
        {availableForms.length === 0 ? (
          <p className={styles.muted}>Não existem formulários interativos disponíveis.</p>
        ) : (
          <div style={{ margin: 'var(--space-md) 0', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {availableForms.map((form) => (
              <label key={form.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <input
                  type="checkbox"
                  checked={selectedForms.includes(form.id)}
                  onChange={() => toggleForm(form.id)}
                />
                <span>
                  <strong>{form.title}</strong>
                  {form.description && (
                    <span className={styles.muted}> — {form.description}</span>
                  )}
                </span>
              </label>
            ))}
          </div>
        )}
        {error && <p className={styles.error}>{error}</p>}
        <Button
          type="button"
          onClick={handleGenerateLink}
          disabled={submitting || selectedForms.length === 0}
        >
          {submitting ? 'A gerar…' : 'Gerar link de registos interativos'}
        </Button>
        {generatedUrl && (
          <div className={styles.successBox} style={{ marginTop: 'var(--space-md)' }}>
            <strong>Link gerado</strong>
            <p>{generatedUrl}</p>
          </div>
        )}
      </Card>

      <Card as="section">
        <h2>Sessões de registos interativos</h2>
        {copyFeedback && <p className={styles.muted}>{copyFeedback}</p>}
        {sessionActionError && <p className={styles.error}>{sessionActionError}</p>}
        {sessions.length === 0 ? (
          <p className={styles.muted}>Ainda não existem links de registos interativos.</p>
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
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td>{new Date(session.createdAt).toLocaleString('pt-PT')}</td>
                  <td>
                    <Badge variant={sessionStatusBadgeVariant(session.status)}>
                      {formatSessionStatus(session.status)}
                    </Badge>
                  </td>
                  <td>
                    <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                      {session.forms.map((form) => (
                        <li key={form.formId}>{form.title}</li>
                      ))}
                    </ul>
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
                      <button
                        type="button"
                        className={styles.linkButton}
                        onClick={() => handleViewEntries(session.id)}
                      >
                        Ver registos
                      </button>
                      {sessionAction?.sessionId === session.id ? (
                        <div className={styles.sessionConfirm}>
                          <p className={styles.muted}>
                            {sessionAction.type === 'revoke'
                              ? 'O link deixará de funcionar. Os registos mantêm-se no histórico.'
                              : 'Eliminar esta sessão e todos os registos? Esta ação não pode ser desfeita.'}
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
                        <>
                          {sessionIsOpen(session) && (
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
                          <button
                            type="button"
                            className={styles.dangerLinkButton}
                            disabled={sessionActionLoading === session.id}
                            onClick={() => {
                              setSessionActionError('')
                              setSessionAction({ type: 'delete', sessionId: session.id })
                            }}
                          >
                            Eliminar sessão
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {entries && (
        <PiccaInteractiveEntriesPanel
          session={entries}
          onClose={() => setEntries(null)}
          onSaveEntry={async (entryId, answers) => {
            await therapistApi.updatePiccaInteractiveEntry(token, entries.id, entryId, answers)
            const refreshed = await therapistApi.getPiccaInteractiveSessionEntries(token, entries.id)
            setEntries(refreshed.session)
          }}
        />
      )}
    </>
  )
}
