import { useEffect, useState } from 'react'
import { BackofficeLayout, RequireWorkshopManager } from '../../components/backoffice/BackofficeLayout'
import { ApiError, workshopApi, type WorkshopSummary } from '../../lib/api'
import { formatWorkshopDatePt } from '../../lib/workshopDates'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import styles from '../../components/backoffice/BackofficeLayout.module.css'

const emptyForm = {
  title: '',
  description: '',
  location: '',
  eventDate: '',
}

export function WorkshopsPage() {
  const { token } = useAuth()
  const [workshops, setWorkshops] = useState<WorkshopSummary[]>([])
  const [form, setForm] = useState(emptyForm)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function loadWorkshops() {
    if (!token) return
    const data = await workshopApi.list(token)
    setWorkshops(data.workshops)
  }

  useEffect(() => {
    if (!token) return
    loadWorkshops()
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : 'Não foi possível carregar os workshops')
      })
      .finally(() => setLoading(false))
  }, [token])

  function resetForm() {
    setForm(emptyForm)
    setImageFile(null)
    setEditingId(null)
    setError('')
    setSuccess('')
  }

  function startEdit(workshop: WorkshopSummary) {
    setEditingId(workshop.id)
    setForm({
      title: workshop.title,
      description: workshop.description,
      location: workshop.location,
      eventDate: workshop.eventDate,
    })
    setImageFile(null)
    setError('')
    setSuccess('')
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!token) return
    if (!editingId && !imageFile) {
      setError('Selecione uma imagem para o flyer')
      return
    }

    setSubmitting(true)
    setError('')
    setSuccess('')

    const formData = new FormData()
    formData.append('title', form.title.trim())
    formData.append('description', form.description.trim())
    formData.append('location', form.location.trim())
    formData.append('eventDate', form.eventDate)
    if (imageFile) {
      formData.append('image', imageFile)
    }

    try {
      if (editingId) {
        await workshopApi.update(token, editingId, formData)
        setSuccess('Workshop atualizado.')
      } else {
        await workshopApi.create(token, formData)
        setSuccess('Workshop criado.')
      }
      resetForm()
      await loadWorkshops()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível guardar o workshop')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(workshop: WorkshopSummary) {
    if (!token) return
    if (!window.confirm(`Eliminar o workshop «${workshop.title}»?`)) return

    setError('')
    try {
      await workshopApi.delete(token, workshop.id)
      if (editingId === workshop.id) {
        resetForm()
      }
      await loadWorkshops()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível eliminar o workshop')
    }
  }

  return (
    <RequireWorkshopManager>
      <BackofficeLayout>
        <h1 className={styles.pageTitle}>Workshops</h1>
        <p className={styles.muted}>
          Crie workshops com flyer, data e local. Aparecem no site público em{' '}
          <a href="/workshops" target="_blank" rel="noopener noreferrer">
            /workshops
          </a>
          .
        </p>

        <Card as="section" className={styles.sectionSpaced}>
          <h2>{editingId ? 'Editar workshop' : 'Novo workshop'}</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="workshopTitle">Nome do workshop</label>
              <input
                id="workshopTitle"
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                required
                minLength={2}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="workshopDate">Data</label>
              <input
                id="workshopDate"
                type="date"
                value={form.eventDate}
                onChange={(event) => setForm((current) => ({ ...current, eventDate: event.target.value }))}
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="workshopLocation">Local</label>
              <input
                id="workshopLocation"
                value={form.location}
                onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
                required
                minLength={2}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="workshopDescription">Descrição</label>
              <textarea
                id="workshopDescription"
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({ ...current, description: event.target.value }))
                }
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="workshopImage">
                Flyer {editingId ? '(opcional — deixe em branco para manter a atual)' : ''}
              </label>
              <input
                id="workshopImage"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                required={!editingId}
              />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.muted}>{success}</p>}
            <div className={styles.editPatientActions}>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'A guardar…' : editingId ? 'Guardar alterações' : 'Criar workshop'}
              </Button>
              {editingId && (
                <button type="button" className={styles.linkButton} onClick={resetForm} disabled={submitting}>
                  Cancelar edição
                </button>
              )}
            </div>
          </form>
        </Card>

        <Card as="section">
          <h2>Workshops registados</h2>
          {loading ? (
            <p className={styles.muted}>A carregar…</p>
          ) : workshops.length === 0 ? (
            <p className={styles.muted}>Ainda não existem workshops.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Nome</th>
                  <th>Local</th>
                  <th>Estado</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {workshops.map((workshop) => (
                  <tr key={workshop.id}>
                    <td>{formatWorkshopDatePt(workshop.eventDate)}</td>
                    <td>{workshop.title}</td>
                    <td>{workshop.location}</td>
                    <td>
                      <Badge variant={workshop.status === 'upcoming' ? 'accent' : 'muted'}>
                        {workshop.status === 'upcoming' ? 'Próxima' : 'Passada'}
                      </Badge>
                    </td>
                    <td>
                      <div className={styles.rowActions}>
                        <button
                          type="button"
                          className={styles.linkButton}
                          onClick={() => startEdit(workshop)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className={styles.linkButton}
                          onClick={() => handleDelete(workshop)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </BackofficeLayout>
    </RequireWorkshopManager>
  )
}
