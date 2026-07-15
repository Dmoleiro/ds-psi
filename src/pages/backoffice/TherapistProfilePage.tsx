import { useEffect, useState } from 'react'
import { BackofficeLayout, RequireTherapist } from '../../components/backoffice/BackofficeLayout'
import { ApiError, therapistApi } from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import styles from '../../components/backoffice/BackofficeLayout.module.css'

export function TherapistProfilePage() {
  const { token, updateUser } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [emailTestMessage, setEmailTestMessage] = useState('')
  const [emailTestError, setEmailTestError] = useState('')
  const [testingEmail, setTestingEmail] = useState(false)

  useEffect(() => {
    if (!token) return
    setLoading(true)
    setError('')
    therapistApi
      .getProfile(token)
      .then((data) => {
        setName(data.profile.name)
        setEmail(data.profile.email)
        setPhone(data.profile.phone ?? '')
      })
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : 'Não foi possível carregar o perfil')
      })
      .finally(() => setLoading(false))
  }, [token])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!token) return

    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const result = await therapistApi.updateProfile(token, {
        name,
        email,
        phone,
        password: password || undefined,
      })
      updateUser(result.user, result.token)
      setPassword('')
      setSuccess('Perfil atualizado com sucesso.')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível guardar o perfil')
    } finally {
      setSaving(false)
    }
  }

  async function handleTestEmail() {
    if (!token) return
    setTestingEmail(true)
    setEmailTestMessage('')
    setEmailTestError('')
    try {
      const result = await therapistApi.sendTestEmail(token)
      setEmailTestMessage(`Email de teste enviado para ${result.sentTo}.`)
    } catch (err) {
      setEmailTestError(err instanceof ApiError ? err.message : 'Não foi possível enviar o email de teste')
    } finally {
      setTestingEmail(false)
    }
  }

  return (
    <RequireTherapist>
      <BackofficeLayout>
        <h1 className={styles.pageTitle}>O meu perfil</h1>
        <p className={styles.muted} style={{ marginTop: '-0.75rem', marginBottom: 'var(--space-lg)' }}>
          Atualize os seus dados de contacto. A palavra-passe só é alterada se preencher o campo abaixo.
        </p>

        {loading ? (
          <p className={styles.muted}>A carregar…</p>
        ) : (
          <Card as="section" className={styles.sectionSpaced}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.field}>
                <label htmlFor="name">Nome</label>
                <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className={styles.field}>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="phone">Telefone</label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="password">Nova palavra-passe</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Deixar em branco para manter a atual"
                />
              </div>
              {error && <p className={styles.error}>{error}</p>}
              {success && <p className={styles.successBox}>{success}</p>}
              <Button type="submit" disabled={saving}>
                {saving ? 'A guardar…' : 'Guardar alterações'}
              </Button>
            </form>
          </Card>
        )}

        {!loading && (
          <Card as="section" className={styles.sectionSpaced}>
            <h2>Notificações por email</h2>
            <p className={styles.muted}>
              Recebe um email quando um paciente submete um formulário. Use o botão abaixo para confirmar
              que o envio está a funcionar — o teste é enviado para o email guardado no seu perfil.
            </p>
            {emailTestError && <p className={styles.error}>{emailTestError}</p>}
            {emailTestMessage && <p className={styles.successBox}>{emailTestMessage}</p>}
            <Button type="button" variant="outline" onClick={handleTestEmail} disabled={testingEmail}>
              {testingEmail ? 'A enviar…' : 'Testar envio de email da plataforma'}
            </Button>
          </Card>
        )}
      </BackofficeLayout>
    </RequireTherapist>
  )
}
