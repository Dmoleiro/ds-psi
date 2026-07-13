import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ApiError, patientApi, type PatientSession } from '../../lib/api'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Container } from '../../components/layout/Container'
import styles from './PatientPortal.module.css'

export function PatientPortalPage() {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const [session, setSession] = useState<PatientSession | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [consentChecked, setConsentChecked] = useState(false)
  const [accepting, setAccepting] = useState(false)

  useEffect(() => {
    if (!token) return
    patientApi
      .getSession(token)
      .then((data) => setSession(data.session))
      .catch((err) => {
        if (err instanceof ApiError && err.status === 410) {
          navigate(`/formularios/p/${token}/concluido`, { replace: true })
          return
        }
        setError(err instanceof ApiError ? err.message : 'Link inválido')
      })
      .finally(() => setLoading(false))
  }, [token, navigate])

  async function handleAcceptConsent() {
    if (!token || !consentChecked) return
    setAccepting(true)
    try {
      await patientApi.acceptConsent(token)
      const refreshed = await patientApi.getSession(token)
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
          <h1>Formulários indisponíveis</h1>
          <p>{error}</p>
          <Link to="/">Voltar ao início</Link>
        </Card>
      </Container>
    )
  }

  if (!session) return null

  const needsConsent = !session.consentAt

  return (
    <Container className={styles.page}>
      <header className={styles.header}>
        <h1>Olá, {session.patientFirstName}</h1>
        <p className={styles.intro}>
          Complete os formulários abaixo. O seu progresso é guardado automaticamente — pode fechar esta
          página e continuar mais tarde com o mesmo link.
        </p>
      </header>

      {needsConsent ? (
        <Card as="section" className={styles.consentCard}>
          <h2>Proteção de dados</h2>
          <p>
            Antes de preencher os formulários, confirme que autoriza o tratamento dos seus dados
            pessoais para efeitos clínicos, de acordo com a política de proteção de dados da clínica.
          </p>
          <label className={styles.consentLabel}>
            <input
              type="checkbox"
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
            />
            Li e aceito o tratamento dos meus dados para efeitos clínicos
          </label>
          <Button type="button" onClick={handleAcceptConsent} disabled={!consentChecked || accepting}>
            {accepting ? 'A guardar…' : 'Continuar'}
          </Button>
        </Card>
      ) : (
        <div className={styles.grid}>
          {session.forms.map((form) => (
            <Card key={form.formId} as="article" className={styles.formCard}>
              <div className={styles.cardHeader}>
                <h2>{form.title}</h2>
                <Badge variant={form.status === 'submitted' ? 'accent' : 'muted'}>
                  {form.status === 'submitted'
                    ? 'Submetido'
                    : form.status === 'in_progress'
                      ? 'Em progresso'
                      : 'Por iniciar'}
                </Badge>
              </div>
              {form.description && <p>{form.description}</p>}
              <Button
                href={`/formularios/p/${token}/${form.formId}`}
                variant={form.status === 'submitted' ? 'outline' : 'primary'}
              >
                {form.status === 'submitted' ? 'Ver respostas' : 'Preencher'}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </Container>
  )
}
