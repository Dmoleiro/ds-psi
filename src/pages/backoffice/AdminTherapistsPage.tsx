import { useEffect, useState } from 'react'
import { BackofficeLayout, RequireAdmin } from '../../components/backoffice/BackofficeLayout'
import { AdminPasswordReset } from '../../components/backoffice/AdminPasswordReset'
import { adminApi } from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import styles from '../../components/backoffice/BackofficeLayout.module.css'

type TherapistRow = {
  id: string
  email: string
  name: string
  active: boolean
  createdAt: string
}

export function AdminTherapistsPage() {
  const { token } = useAuth()
  const [therapists, setTherapists] = useState<TherapistRow[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function load() {
    if (!token) return
    const data = await adminApi.listTherapists(token)
    setTherapists(data.therapists)
  }

  useEffect(() => {
    load()
  }, [token])

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault()
    if (!token) return
    setError('')
    try {
      await adminApi.createTherapist(token, { name, email, password })
      setName('')
      setEmail('')
      setPassword('')
      await load()
    } catch {
      setError('Não foi possível criar o terapeuta')
    }
  }

  async function toggleActive(therapist: TherapistRow) {
    if (!token) return
    await adminApi.updateTherapist(token, therapist.id, { active: !therapist.active })
    await load()
  }

  return (
    <RequireAdmin>
      <BackofficeLayout>
        <h1 className={styles.pageTitle}>Terapeutas</h1>

        <Card as="section" className={styles.sectionSpaced}>
          <h2>Novo terapeuta</h2>
          <form className={styles.form} onSubmit={handleCreate}>
            <div className={styles.field}>
              <label htmlFor="name">Nome</label>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label htmlFor="password">Palavra-passe temporária</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <Button type="submit">Criar terapeuta</Button>
          </form>
        </Card>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Estado</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {therapists.map((therapist) => (
              <tr key={therapist.id}>
                <td>{therapist.name}</td>
                <td>{therapist.email}</td>
                <td>{therapist.active ? 'Ativo' : 'Inativo'}</td>
                <td>
                  <div className={styles.rowActions}>
                    <button
                      type="button"
                      className={styles.linkButton}
                      onClick={() => toggleActive(therapist)}
                    >
                      {therapist.active ? 'Desativar' : 'Ativar'}
                    </button>
                    <AdminPasswordReset
                      onSubmit={async (password) => {
                        if (!token) return
                        await adminApi.updateTherapist(token, therapist.id, { password })
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </BackofficeLayout>
    </RequireAdmin>
  )
}
