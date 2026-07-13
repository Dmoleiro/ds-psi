import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BackofficeLayout } from '../../components/backoffice/BackofficeLayout'
import { ApiError } from '../../lib/api'
import { therapistApi } from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Button'
import styles from '../../components/backoffice/BackofficeLayout.module.css'

export function PatientCreatePage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [internalNotes, setInternalNotes] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!token) return
    setSubmitting(true)
    setError('')
    try {
      const { patient } = await therapistApi.createPatient(token, {
        fullName,
        email,
        phone,
        birthDate,
        internalNotes,
      })
      navigate(`/backoffice/patients/${patient.id}`)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível criar o paciente')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <BackofficeLayout>
      <h1 className={styles.pageTitle}>Novo paciente</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="fullName">Nome completo</label>
          <input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className={styles.field}>
          <label htmlFor="phone">Telefone</label>
          <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className={styles.field}>
          <label htmlFor="birthDate">Data de nascimento</label>
          <input id="birthDate" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
        </div>
        <div className={styles.field}>
          <label htmlFor="notes">Notas internas</label>
          <textarea id="notes" value={internalNotes} onChange={(e) => setInternalNotes(e.target.value)} />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <Button type="submit" disabled={submitting}>
          {submitting ? 'A guardar…' : 'Criar paciente'}
        </Button>
      </form>
    </BackofficeLayout>
  )
}
