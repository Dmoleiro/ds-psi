import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ApiError, piccaInteractivePatientApi, type PiccaInteractivePatientSession } from '../../lib/api'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Container } from '../../components/layout/Container'
import styles from './PatientPortal.module.css'

export function PiccaInteractivePortalPage() {
  const { token } = useParams<{ token: string }>()
  const [session, setSession] = useState<PiccaInteractivePatientSession | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [consentChecked, setConsentChecked] = useState(false)
  const [accepting, setAccepting] = useState(false)

  useEffect(() => {
    if (!token) return
    piccaInteractivePatientApi
      .getSession(token)
      .then((data) => setSession(data.session))
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
      await piccaInteractivePatientApi.acceptConsent(token)
      const refreshed = await piccaInteractivePatientApi.getSession(token)
      setSession(refreshed.session)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível registar o consentimento')
    } finally {
      setAccepting(false)
    }
  }

  if (loading) {
    return (
      <Container className={styles.page}>
        <p>A carregar…</p>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className={styles.page}>
        <Card>
          <h1>Registos interativos indisponíveis</h1>
          <p>{error}</p>
          <Link to="/">Voltar ao início</Link>
        </Card>
      </Container>
    )
  }

  if (!session || !token) return null

  const needsConsent = !session.consentAt

  return (
    <Container className={styles.page}>
      <header className={styles.header}>
        <h1>Olá, {session.patientFirstName}</h1>
        <p className={styles.intro}>
          Registos interativos PICCA — pode preencher os formulários da semana corrente e voltar
          mais tarde com o mesmo link.
        </p>
      </header>

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
              onChange={(event) => setConsentChecked(event.target.checked)}
            />
            Li e aceito o tratamento dos meus dados
          </label>
          <Button type="button" onClick={handleAcceptConsent} disabled={!consentChecked || accepting}>
            {accepting ? 'A registar…' : 'Continuar'}
          </Button>
        </Card>
      ) : (
        <div className={styles.formList}>
          {session.forms.map((form) => (
            <Card key={form.formId} className={styles.formCard}>
              <div className={styles.formCardHeader}>
                <h3>{form.title}</h3>
              </div>
              {form.description && <p className={styles.formDescription}>{form.description}</p>}
              <Link to={`/formularios/picca-interativo/${token}/${form.formId}`}>
                <Button type="button">
                  {form.kind === 'daily_sono' ? 'Registo diário' : 'Registo semanal'}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </Container>
  )
}
