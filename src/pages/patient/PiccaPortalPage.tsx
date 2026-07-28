import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ApiError, piccaPatientApi, type PiccaPatientSession } from '../../lib/api'
import { PiccaVolumePortalSections } from '../../components/picca/PiccaVolumeSections'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Container } from '../../components/layout/Container'
import { formatFormStatus, formStatusBadgeVariant } from '../../lib/intakeStatus'
import { piccaModuleLabel } from '../../lib/piccaModuleIds'
import styles from './PatientPortal.module.css'

export function PiccaPortalPage() {
  const { token } = useParams<{ token: string }>()
  const [session, setSession] = useState<PiccaPatientSession | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [consentChecked, setConsentChecked] = useState(false)
  const [accepting, setAccepting] = useState(false)
  const [finalizeConfirm, setFinalizeConfirm] = useState(false)
  const [finalizing, setFinalizing] = useState(false)

  async function loadSession() {
    if (!token) return
    const data = await piccaPatientApi.getSession(token)
    setSession(data.session)
  }

  useEffect(() => {
    if (!token) return
    loadSession()
      .catch((err) => {
        if (err instanceof ApiError && err.status === 410) {
          setError('Este link foi revogado ou já não está disponível.')
          return
        }
        setError(err instanceof ApiError ? err.message : 'Link inválido')
      })
      .finally(() => setLoading(false))
  }, [token])

  async function handleAcceptConsent() {
    if (!token || !consentChecked) return
    setAccepting(true)
    try {
      await piccaPatientApi.acceptConsent(token)
      await loadSession()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível registar o consentimento')
    } finally {
      setAccepting(false)
    }
  }

  async function handleFinalize() {
    if (!token) return
    setFinalizing(true)
    setError('')
    try {
      await piccaPatientApi.completeSession(token)
      setFinalizeConfirm(false)
      await loadSession()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível concluir o envio')
    } finally {
      setFinalizing(false)
    }
  }

  if (loading) {
    return (
      <Container className={styles.page}>
        <p>A carregar…</p>
      </Container>
    )
  }

  if (error && !session) {
    return (
      <Container className={styles.page}>
        <Card>
          <h1>PICCA indisponível</h1>
          <p>{error}</p>
          <Link to="/">Voltar ao início</Link>
        </Card>
      </Container>
    )
  }

  if (!session) return null

  const needsConsent = !session.consentAt
  const progressPct =
    session.totalModules > 0
      ? Math.round((session.completedModules / session.totalModules) * 100)
      : 0

  return (
    <Container className={styles.page}>
      <header className={styles.header}>
        <h1>Olá, {session.patientFirstName}</h1>
        <p className={styles.intro}>
          {session.locked
            ? 'O envio foi concluído — pode consultar as respostas abaixo, mas já não é possível alterá-las.'
            : 'Complete os módulos por ordem. Pode rever e editar módulos já submetidos até confirmar o envio final. O progresso é guardado automaticamente.'}
        </p>
        <div className={styles.progressWrap} aria-label="Progresso">
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
          </div>
          <p className={styles.progressLabel}>
            {session.completedModules} de {session.totalModules} módulos concluídos
          </p>
        </div>
      </header>

      {error && <p className={styles.error}>{error}</p>}

      {needsConsent ? (
        <Card>
          <h2>Consentimento</h2>
          <p>
            Ao continuar, autoriza o tratamento dos dados fornecidos para fins clínicos, nos termos da
            política de privacidade da clínica.
          </p>
          <label className={styles.consentLabel}>
            <input
              type="checkbox"
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
            />
            Li e aceito o tratamento dos meus dados
          </label>
          <Button type="button" onClick={handleAcceptConsent} disabled={!consentChecked || accepting}>
            {accepting ? 'A registar…' : 'Continuar'}
          </Button>
        </Card>
      ) : (
        <>
          <PiccaVolumePortalSections
            modules={session.modules}
            renderModule={(mod) => (
              <Card className={styles.formCard}>
                <div className={styles.formCardHeader}>
                  <h3>{piccaModuleLabel(mod.moduleId, mod.title)}</h3>
                  <Badge variant={formStatusBadgeVariant(mod.status)}>
                    {formatFormStatus(mod.status)}
                  </Badge>
                </div>
                {mod.description && <p className={styles.formDescription}>{mod.description}</p>}
                {mod.accessible ? (
                  <Link to={`/formularios/picca/${token}/${mod.moduleId}`}>
                    <Button type="button" variant={mod.readOnly ? 'outline' : 'primary'}>
                      {mod.readOnly
                        ? 'Ver respostas'
                        : mod.status === 'submitted'
                          ? 'Rever e editar'
                          : mod.status === 'not_started'
                            ? 'Começar'
                            : 'Continuar'}
                    </Button>
                  </Link>
                ) : (
                  <p className={styles.lockedHint}>Complete o módulo anterior para desbloquear.</p>
                )}
              </Card>
            )}
          />

          {session.canFinalize && (
            <div style={{ marginTop: 'var(--space-lg)' }}>
            <Card className={styles.formCard}>
              <h2>Envio final</h2>
              <p className={styles.formDescription}>
                Todos os módulos foram submetidos. Quando estiver satisfeito com as respostas,
                confirme o envio final — depois disso não será possível voltar a editar.
              </p>
              {finalizeConfirm ? (
                <div>
                  <p className={styles.muted}>
                    Tem a certeza? Após confirmar, as respostas ficam bloqueadas para edição.
                  </p>
                  <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                    <Button type="button" onClick={() => void handleFinalize()} disabled={finalizing}>
                      {finalizing ? 'A concluir…' : 'Sim, concluir envio'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={finalizing}
                      onClick={() => setFinalizeConfirm(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <Button type="button" onClick={() => setFinalizeConfirm(true)}>
                  Concluir envio final
                </Button>
              )}
            </Card>
            </div>
          )}
        </>
      )}
    </Container>
  )
}
