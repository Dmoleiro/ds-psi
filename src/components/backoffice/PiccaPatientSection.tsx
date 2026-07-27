import { useEffect, useState } from 'react'
import { ApiError, therapistApi } from '../../lib/api'
import type { PiccaSessionSubmissionsView } from '../../lib/exportPiccaSubmissionsPdf'
import { PiccaSubmissionsPanel } from './PiccaSubmissionsPanel'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { PiccaVolumeCheckboxGroups, PiccaVolumeStatusList } from '../picca/PiccaVolumeSections'
import styles from './BackofficeLayout.module.css'
import {
  formatFormStatus,
  formatSessionStatus,
  formStatusBadgeVariant,
  sessionStatusBadgeVariant,
} from '../../lib/intakeStatus'

export type PiccaSessionRow = {
  id: string
  status: string
  createdAt: string
  revokedAt: string | null
  url?: string | null
  modules: Array<{
    moduleId: string
    title: string
    status: string
    volume?: number
    moduleNumber?: number
  }>
}

type Props = {
  token: string
  patientId: string
  sessions: PiccaSessionRow[]
  onRefresh: () => Promise<void>
}

export function PiccaPatientSection({ token, patientId, sessions, onRefresh }: Props) {
  const [availableModules, setAvailableModules] = useState<
    Array<{
      id: string
      volume: number
      moduleNumber: number
      title: string
      description: string | null
    }>
  >([])
  const [selectedModules, setSelectedModules] = useState<string[]>([])
  const [generatedUrl, setGeneratedUrl] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submissions, setSubmissions] = useState<PiccaSessionSubmissionsView | null>(null)
  const [sessionAction, setSessionAction] = useState<{ sessionId: string } | null>(null)
  const [sessionActionLoading, setSessionActionLoading] = useState<string | null>(null)
  const [sessionActionError, setSessionActionError] = useState('')
  const [copyFeedback, setCopyFeedback] = useState('')

  useEffect(() => {
    therapistApi.listPiccaModules(token).then((data) => setAvailableModules(data.modules))
  }, [token])

  function toggleModule(moduleId: string) {
    setSelectedModules((current) =>
      current.includes(moduleId) ? current.filter((id) => id !== moduleId) : [...current, moduleId],
    )
  }

  async function handleGenerateLink() {
    setSubmitting(true)
    setError('')
    setGeneratedUrl('')
    try {
      const result = await therapistApi.createPiccaSession(token, patientId, selectedModules)
      setGeneratedUrl(result.url)
      await onRefresh()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível gerar o link')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleViewSubmissions(sessionId: string) {
    try {
      const result = await therapistApi.getPiccaSessionSubmissions(token, sessionId)
      setSubmissions(result.session)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível carregar as respostas')
    }
  }

  async function handleRevokeSession(sessionId: string) {
    setSessionActionLoading(sessionId)
    setSessionActionError('')
    try {
      await therapistApi.revokePiccaSession(token, sessionId)
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

  async function copySessionUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url)
      setCopyFeedback('Link copiado.')
      window.setTimeout(() => setCopyFeedback(''), 2000)
    } catch {
      setCopyFeedback('Não foi possível copiar o link.')
    }
  }

  function sessionIsOpen(session: PiccaSessionRow) {
    return session.status === 'active' || session.status === 'in_progress'
  }

  function sessionHasSubmissions(session: PiccaSessionRow) {
    return session.modules.some((m) => m.status === 'submitted')
  }

  return (
    <>
      <Card as="section" className={styles.sectionSpaced}>
        <h2>Gerar link PICCA</h2>
        <p className={styles.muted}>
          Selecione os módulos a incluir. O encarregado de educação completa por ordem; pode pausar e
          voltar com o mesmo link até revogar.
        </p>
        {availableModules.length === 0 ? (
          <p className={styles.muted}>Não existem módulos PICCA disponíveis.</p>
        ) : (
          <div style={{ margin: 'var(--space-md) 0' }}>
            <PiccaVolumeCheckboxGroups
              modules={availableModules}
              selectedIds={selectedModules}
              onToggle={toggleModule}
            />
          </div>
        )}
        {error && <p className={styles.error}>{error}</p>}
        <Button
          type="button"
          onClick={handleGenerateLink}
          disabled={submitting || selectedModules.length === 0}
        >
          {submitting ? 'A gerar…' : 'Gerar link PICCA'}
        </Button>
        {generatedUrl && (
          <div className={styles.successBox} style={{ marginTop: 'var(--space-md)' }}>
            <strong>Link gerado</strong>
            <p>{generatedUrl}</p>
          </div>
        )}
      </Card>

      <Card as="section">
        <h2>Sessões PICCA</h2>
        {copyFeedback && <p className={styles.muted}>{copyFeedback}</p>}
        {sessionActionError && <p className={styles.error}>{sessionActionError}</p>}
        {sessions.length === 0 ? (
          <p className={styles.muted}>Ainda não existem sessões PICCA.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Data</th>
                <th>Estado</th>
                <th>Módulos</th>
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
                    <PiccaVolumeStatusList
                      modules={session.modules.map((mod) => ({
                        ...mod,
                        id: mod.moduleId,
                      }))}
                      renderStatus={(mod) => (
                        <Badge variant={formStatusBadgeVariant(mod.status)}>
                          {formatFormStatus(mod.status)}
                        </Badge>
                      )}
                    />
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
                          Ver / editar respostas
                        </button>
                      )}
                      {sessionAction?.sessionId === session.id ? (
                        <div className={styles.sessionConfirm}>
                          <p className={styles.muted}>
                            O link deixará de funcionar. O registo mantém-se no histórico.
                          </p>
                          <div className={styles.rowActions}>
                            <button
                              type="button"
                              className={styles.dangerLinkButton}
                              disabled={sessionActionLoading === session.id}
                              onClick={() => handleRevokeSession(session.id)}
                            >
                              {sessionActionLoading === session.id ? 'A processar…' : 'Sim, revogar'}
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
                        sessionIsOpen(session) && (
                          <button
                            type="button"
                            className={styles.dangerLinkButton}
                            disabled={sessionActionLoading === session.id}
                            onClick={() => {
                              setSessionActionError('')
                              setSessionAction({ sessionId: session.id })
                            }}
                          >
                            Revogar link
                          </button>
                        )
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
        <PiccaSubmissionsPanel
          session={submissions}
          onClose={() => setSubmissions(null)}
          onSaveModule={async (moduleId, answers) => {
            await therapistApi.updatePiccaModuleAnswers(token, submissions.id, moduleId, answers)
            const refreshed = await therapistApi.getPiccaSessionSubmissions(token, submissions.id)
            setSubmissions(refreshed.session)
          }}
        />
      )}
    </>
  )
}
