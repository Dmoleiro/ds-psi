import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BackofficeLayout } from '../../components/backoffice/BackofficeLayout'
import { ApiError, therapistApi, type LocationSummary } from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Button'
import styles from '../../components/backoffice/BackofficeLayout.module.css'

export function PatientCreatePage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [locations, setLocations] = useState<LocationSummary[]>([])
  const [locationId, setLocationId] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [email2, setEmail2] = useState('')
  const [phone, setPhone] = useState('')
  const [phone2, setPhone2] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [internalNotes, setInternalNotes] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!token) return
    therapistApi.listLocations(token).then((data) => {
      setLocations(data.locations)
      if (data.locations.length === 1) {
        setLocationId(data.locations[0].id)
      }
    })
  }, [token])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!token || !locationId) return
    setSubmitting(true)
    setError('')
    try {
      const { patient } = await therapistApi.createPatient(token, {
        fullName,
        locationId,
        email,
        email2,
        phone,
        phone2,
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
          <label htmlFor="locationId">Local de consulta</label>
          <select
            id="locationId"
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
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
          <label htmlFor="fullName">Nome completo</label>
          <input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className={styles.field}>
          <label htmlFor="email2">Email 2</label>
          <input id="email2" type="email" value={email2} onChange={(e) => setEmail2(e.target.value)} />
        </div>
        <div className={styles.field}>
          <label htmlFor="phone">Telefone</label>
          <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className={styles.field}>
          <label htmlFor="phone2">Telefone 2</label>
          <input id="phone2" value={phone2} onChange={(e) => setPhone2(e.target.value)} />
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
        <Button type="submit" disabled={submitting || !locationId}>
          {submitting ? 'A guardar…' : 'Criar paciente'}
        </Button>
      </form>
    </BackofficeLayout>
  )
}
