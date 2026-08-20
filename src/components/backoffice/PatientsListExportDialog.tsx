import { useEffect, useState } from 'react'
import { Button } from '../ui/Button'
import {
  defaultPatientListExportColumnIds,
  PATIENT_LIST_EXPORT_COLUMNS,
  type PatientListExportColumnId,
} from '../../lib/exportPatientsListPdf'
import styles from './PatientsListExportDialog.module.css'

type Props = {
  open: boolean
  onClose: () => void
  onExport: (columnIds: PatientListExportColumnId[]) => void
}

export function PatientsListExportDialog({ open, onClose, onExport }: Props) {
  const [selectedColumnIds, setSelectedColumnIds] = useState<PatientListExportColumnId[]>(
    defaultPatientListExportColumnIds,
  )
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setSelectedColumnIds(defaultPatientListExportColumnIds())
    setError('')
  }, [open])

  if (!open) return null

  function toggleColumn(columnId: PatientListExportColumnId) {
    setSelectedColumnIds((current) => {
      if (current.includes(columnId)) {
        return current.filter((id) => id !== columnId)
      }
      const next = [...current, columnId]
      const order = new Map(PATIENT_LIST_EXPORT_COLUMNS.map((column, index) => [column.id, index]))
      return next.sort((a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0))
    })
    setError('')
  }

  function handleExport() {
    if (selectedColumnIds.length === 0) {
      setError('Seleccione pelo menos uma coluna.')
      return
    }
    onExport(selectedColumnIds)
    onClose()
  }

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="patients-export-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.dialogHeader}>
          <h2 id="patients-export-dialog-title">Exportar lista em PDF</h2>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Fechar">
            ×
          </button>
        </div>

        <p className={styles.intro}>Escolha as colunas a incluir no documento.</p>

        <div className={styles.quickActions}>
          <button
            type="button"
            className={styles.textButton}
            onClick={() => {
              setSelectedColumnIds(PATIENT_LIST_EXPORT_COLUMNS.map((column) => column.id))
              setError('')
            }}
          >
            Seleccionar todas
          </button>
          <button
            type="button"
            className={styles.textButton}
            onClick={() => {
              setSelectedColumnIds(defaultPatientListExportColumnIds())
              setError('')
            }}
          >
            Restaurar predefinição
          </button>
        </div>

        <div className={styles.columnList}>
          {PATIENT_LIST_EXPORT_COLUMNS.map((column) => (
            <label key={column.id} className={styles.columnOption}>
              <input
                type="checkbox"
                checked={selectedColumnIds.includes(column.id)}
                onChange={() => toggleColumn(column.id)}
              />
              <span>{column.label}</span>
            </label>
          ))}
        </div>

        {error ? <p className={styles.error}>{error}</p> : null}

        <div className={styles.actions}>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleExport}>
            Gerar PDF
          </Button>
        </div>
      </div>
    </div>
  )
}
