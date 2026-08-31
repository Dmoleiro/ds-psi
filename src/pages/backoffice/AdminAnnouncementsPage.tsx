import { useEffect, useState } from 'react'
import { BackofficeLayout, RequireAdmin } from '../../components/backoffice/BackofficeLayout'
import {
  announcementApi,
  announcementImageUrl,
  ApiError,
  type AnnouncementAdminSummary,
} from '../../lib/api'
import { formatWorkshopDatePt } from '../../lib/workshopDates'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import styles from '../../components/backoffice/BackofficeLayout.module.css'

const emptyForm = {
  title: '',
  visibleUntil: '',
}

export function AdminAnnouncementsPage() {
  const { token } = useAuth()
  const [announcements, setAnnouncements] = useState<AnnouncementAdminSummary[]>([])
  const [form, setForm] = useState(emptyForm)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function loadAnnouncements() {
    if (!token) return
    const data = await announcementApi.list(token)
    setAnnouncements(data.announcements)
  }

  useEffect(() => {
    if (!token) return
    loadAnnouncements()
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : 'Não foi possível carregar os anúncios')
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

  function startEdit(announcement: AnnouncementAdminSummary) {
    setEditingId(announcement.id)
    setForm({
      title: announcement.title ?? '',
      visibleUntil: announcement.visibleUntil,
    })
    setImageFile(null)
    setError('')
    setSuccess('')
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!token) return
    if (!editingId && !imageFile) {
      setError('Selecione uma imagem para o anúncio')
      return
    }

    setSubmitting(true)
    setError('')
    setSuccess('')

    const formData = new FormData()
    formData.append('title', form.title.trim())
    formData.append('visibleUntil', form.visibleUntil)
    if (imageFile) {
      formData.append('image', imageFile)
    }

    try {
      if (editingId) {
        await announcementApi.update(token, editingId, formData)
        setSuccess('Anúncio atualizado.')
      } else {
        await announcementApi.create(token, formData)
        setSuccess('Anúncio criado.')
      }
      resetForm()
      await loadAnnouncements()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível guardar o anúncio')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(announcement: AnnouncementAdminSummary) {
    if (!token) return
    const label = announcement.title?.trim() || 'este anúncio'
    if (!window.confirm(`Eliminar ${label}?`)) return

    setError('')
    try {
      await announcementApi.delete(token, announcement.id)
      if (editingId === announcement.id) {
        resetForm()
      }
      await loadAnnouncements()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível eliminar o anúncio')
    }
  }

  return (
    <RequireAdmin>
      <BackofficeLayout>
        <h1 className={styles.pageTitle}>Anúncios</h1>
        <p className={styles.muted}>
          Carregue imagens para mostrar num popup na página inicial do site. Os anúncios aparecem por
          ordem de criação até à data limite definida.
        </p>

        <Card as="section" className={styles.sectionSpaced}>
          <h2>{editingId ? 'Editar anúncio' : 'Novo anúncio'}</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="announcementTitle">Título (opcional, para acessibilidade)</label>
              <input
                id="announcementTitle"
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                maxLength={120}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="announcementVisibleUntil">Visível até</label>
              <input
                id="announcementVisibleUntil"
                type="date"
                value={form.visibleUntil}
                onChange={(event) =>
                  setForm((current) => ({ ...current, visibleUntil: event.target.value }))
                }
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="announcementImage">
                Imagem {editingId ? '(opcional — deixe em branco para manter a atual)' : ''}
              </label>
              <input
                id="announcementImage"
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
                {submitting ? 'A guardar…' : editingId ? 'Guardar alterações' : 'Criar anúncio'}
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
          <h2>Anúncios registados</h2>
          {loading ? (
            <p className={styles.muted}>A carregar…</p>
          ) : announcements.length === 0 ? (
            <p className={styles.muted}>Ainda não existem anúncios.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Imagem</th>
                  <th>Título</th>
                  <th>Visível até</th>
                  <th>Criado</th>
                  <th>Estado</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {announcements.map((announcement) => (
                  <tr key={announcement.id}>
                    <td>
                      <img
                        src={announcementImageUrl(announcement.imagePath)}
                        alt=""
                        className={styles.thumbnail}
                      />
                    </td>
                    <td>{announcement.title?.trim() || '—'}</td>
                    <td>{formatWorkshopDatePt(announcement.visibleUntil)}</td>
                    <td>{formatWorkshopDatePt(announcement.createdAt.slice(0, 10))}</td>
                    <td>
                      <Badge variant={announcement.active ? 'accent' : 'muted'}>
                        {announcement.active ? 'Ativo' : 'Expirado'}
                      </Badge>
                    </td>
                    <td>
                      <div className={styles.rowActions}>
                        <button
                          type="button"
                          className={styles.linkButton}
                          onClick={() => startEdit(announcement)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className={styles.linkButton}
                          onClick={() => handleDelete(announcement)}
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
    </RequireAdmin>
  )
}
