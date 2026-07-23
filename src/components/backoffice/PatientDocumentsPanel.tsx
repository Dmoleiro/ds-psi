import { useEffect, useState } from 'react'
import { ApiError, therapistApi, type PatientDocumentSummary } from '../../lib/api'
import { isImageMimeType, PATIENT_DOCUMENT_ACCEPT } from '../../lib/patientDocuments'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import layout from '../backoffice/BackofficeLayout.module.css'
import styles from './PatientDocumentsPanel.module.css'

type PatientDocumentsPanelProps = {
  patientId: string
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatUploadedBy(uploadedBy: PatientDocumentSummary['uploadedBy']): string {
  return uploadedBy === 'patient' ? 'Paciente' : 'Terapeuta'
}

export function PatientDocumentsPanel({ patientId }: PatientDocumentsPanelProps) {
  const { token } = useAuth()
  const [documents, setDocuments] = useState<PatientDocumentSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewTitle, setPreviewTitle] = useState('')
  const [previewMimeType, setPreviewMimeType] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  async function loadDocuments() {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const result = await therapistApi.listPatientDocuments(token, patientId)
      setDocuments(result.documents)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível carregar os documentos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDocuments()
  }, [token, patientId])

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  async function handleUpload() {
    if (!token || !selectedFile) return
    setUploading(true)
    setError('')
    try {
      await therapistApi.uploadPatientDocument(token, patientId, selectedFile)
      setSelectedFile(null)
      await loadDocuments()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível carregar o documento')
    } finally {
      setUploading(false)
    }
  }

  async function handlePreview(document: PatientDocumentSummary) {
    if (!token) return
    setActionLoading(document.id)
    setError('')
    try {
      const blob = await therapistApi.getPatientDocumentContent(token, patientId, document.id, 'inline')
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      setPreviewTitle(document.originalName)
      setPreviewMimeType(document.mimeType)
      setPreviewUrl(URL.createObjectURL(blob))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível pré-visualizar o documento')
    } finally {
      setActionLoading(null)
    }
  }

  async function handleDownload(document: PatientDocumentSummary) {
    if (!token) return
    setActionLoading(document.id)
    setError('')
    try {
      const blob = await therapistApi.getPatientDocumentContent(
        token,
        patientId,
        document.id,
        'attachment',
      )
      const url = URL.createObjectURL(blob)
      const link = window.document.createElement('a')
      link.href = url
      link.download = document.originalName
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível descarregar o documento')
    } finally {
      setActionLoading(null)
    }
  }

  async function handleDelete(documentId: string) {
    if (!token) return
    setActionLoading(documentId)
    setError('')
    try {
      await therapistApi.deletePatientDocument(token, patientId, documentId)
      setConfirmDeleteId(null)
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
        setPreviewTitle('')
        setPreviewMimeType('')
      }
      await loadDocuments()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível eliminar o documento')
    } finally {
      setActionLoading(null)
    }
  }

  function closePreview() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
    setPreviewTitle('')
    setPreviewMimeType('')
  }

  return (
    <>
      <Card as="section" className={layout.sectionSpaced}>
        <h2>Documentos</h2>
        <p className={layout.muted}>
          Documentos associados a este paciente (PDF ou imagens). Podem ser anexados pelo paciente
          através do formulário &quot;Anexar documentos&quot; ou carregados aqui pela terapeuta.
        </p>

        <div className={styles.uploadRow}>
          <input
            type="file"
            accept={PATIENT_DOCUMENT_ACCEPT}
            onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
          />
          <Button type="button" onClick={handleUpload} disabled={!selectedFile || uploading}>
            {uploading ? 'A carregar…' : 'Carregar ficheiro'}
          </Button>
        </div>

        {error && <p className={layout.error}>{error}</p>}

        {loading ? (
          <p className={layout.muted}>A carregar documentos…</p>
        ) : documents.length === 0 ? (
          <p className={layout.muted}>Ainda não existem documentos associados a este paciente.</p>
        ) : (
          <table className={layout.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Origem</th>
                <th>Tamanho</th>
                <th>Data</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {documents.map((document) => (
                <tr key={document.id}>
                  <td>{document.originalName}</td>
                  <td>{formatUploadedBy(document.uploadedBy)}</td>
                  <td>{formatFileSize(document.sizeBytes)}</td>
                  <td>{new Date(document.createdAt).toLocaleString('pt-PT')}</td>
                  <td>
                    <div className={layout.rowActions}>
                      <button
                        type="button"
                        className={layout.linkButton}
                        disabled={actionLoading === document.id}
                        onClick={() => handlePreview(document)}
                      >
                        Pré-visualizar
                      </button>
                      <button
                        type="button"
                        className={layout.linkButton}
                        disabled={actionLoading === document.id}
                        onClick={() => handleDownload(document)}
                      >
                        Descarregar
                      </button>
                      {confirmDeleteId === document.id ? (
                        <>
                          <button
                            type="button"
                            className={layout.dangerLinkButton}
                            disabled={actionLoading === document.id}
                            onClick={() => handleDelete(document.id)}
                          >
                            Confirmar
                          </button>
                          <button
                            type="button"
                            className={layout.linkButton}
                            disabled={actionLoading === document.id}
                            onClick={() => setConfirmDeleteId(null)}
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className={layout.dangerLinkButton}
                          disabled={actionLoading === document.id}
                          onClick={() => setConfirmDeleteId(document.id)}
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {previewUrl && (
        <div className={styles.previewOverlay} role="dialog" aria-modal="true" aria-label="Pré-visualização">
          <div className={styles.previewPanel}>
            <div className={styles.previewHeader}>
              <h3>{previewTitle}</h3>
              <button type="button" className={layout.linkButton} onClick={closePreview}>
                Fechar
              </button>
            </div>
            {isImageMimeType(previewMimeType) ? (
              <img src={previewUrl} alt={previewTitle} className={styles.previewImage} />
            ) : (
              <iframe title={previewTitle} src={previewUrl} className={styles.previewFrame} />
            )}
          </div>
        </div>
      )}
    </>
  )
}
