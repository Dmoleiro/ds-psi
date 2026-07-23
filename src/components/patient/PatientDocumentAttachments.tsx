import { useEffect, useState } from 'react'
import { ApiError, patientApi, type PatientDocumentSummary } from '../../lib/api'
import { Button } from '../ui/Button'
import styles from './PatientDocumentAttachments.module.css'

type PatientDocumentAttachmentsProps = {
  token: string
  readOnly?: boolean
  title?: string
  description?: string
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function PatientDocumentAttachments({
  token,
  readOnly = false,
  title = 'Documentos anexos',
  description = 'Se tiver documentos para anexar (por exemplo, relatórios escolares ou exames), pode carregá-los aqui em formato PDF.',
}: PatientDocumentAttachmentsProps) {
  const [documents, setDocuments] = useState<PatientDocumentSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  async function loadDocuments() {
    setLoading(true)
    setError('')
    try {
      const result = await patientApi.listDocuments(token)
      setDocuments(result.documents)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível carregar os documentos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDocuments()
  }, [token])

  async function handleUpload() {
    if (!selectedFile) return
    setUploading(true)
    setError('')
    try {
      await patientApi.uploadDocument(token, selectedFile)
      setSelectedFile(null)
      await loadDocuments()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível carregar o documento')
    } finally {
      setUploading(false)
    }
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>

      {loading ? (
        <p className={styles.muted}>A carregar documentos…</p>
      ) : documents.length > 0 ? (
        <ul className={styles.list}>
          {documents.map((document) => (
            <li key={document.id}>
              <span className={styles.fileName}>{document.originalName}</span>
              <span className={styles.muted}>{formatFileSize(document.sizeBytes)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.muted}>Ainda não foram anexados documentos.</p>
      )}

      {!readOnly && (
        <div className={styles.upload}>
          <input
            type="file"
            accept="application/pdf,.pdf"
            onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
          />
          <Button type="button" onClick={handleUpload} disabled={!selectedFile || uploading}>
            {uploading ? 'A carregar…' : 'Anexar PDF'}
          </Button>
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}
    </section>
  )
}
