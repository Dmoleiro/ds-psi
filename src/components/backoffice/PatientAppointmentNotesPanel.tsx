import { useCallback, useEffect, useRef, useState } from 'react'
import { ApiError, therapistApi } from '../../lib/api'
import {
  exportPatientAppointmentNotes,
  type PatientAppointmentNotesExport,
} from '../../lib/exportPatientAppointmentNotes'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import styles from './PatientAppointmentNotesPanel.module.css'

const SAVE_DEBOUNCE_MS = 1500

type Props = {
  token: string
  patientId: string
  readOnly?: boolean
  isActive?: boolean
  initialNotes: string | null
  exportMeta: Omit<PatientAppointmentNotesExport, 'appointmentNotes'>
}

export function PatientAppointmentNotesPanel({
  token,
  patientId,
  readOnly = false,
  isActive = true,
  initialNotes,
  exportMeta,
}: Props) {
  const [notes, setNotes] = useState(initialNotes ?? '')
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [error, setError] = useState('')
  const saveTimerRef = useRef<number | null>(null)
  const notesRef = useRef(notes)
  const savingRef = useRef(false)
  const pendingSaveRef = useRef(false)

  notesRef.current = notes

  useEffect(() => {
    setNotes(initialNotes ?? '')
  }, [patientId, initialNotes])

  const persist = useCallback(async () => {
    if (readOnly || savingRef.current) {
      pendingSaveRef.current = true
      return
    }

    const snapshot = notesRef.current
    savingRef.current = true
    setSaveState('saving')
    setError('')

    try {
      await therapistApi.updatePatientAppointmentNotes(token, patientId, {
        appointmentNotes: snapshot.trim() ? snapshot : null,
      })

      if (notesRef.current === snapshot) {
        setSaveState('saved')
        window.setTimeout(() => {
          setSaveState((current) => (current === 'saved' ? 'idle' : current))
        }, 2000)
      }
    } catch (err) {
      setSaveState('error')
      setError(err instanceof ApiError ? err.message : 'Não foi possível guardar as notas')
    } finally {
      savingRef.current = false
      if (pendingSaveRef.current) {
        pendingSaveRef.current = false
        void persist()
      }
    }
  }, [token, patientId, readOnly])

  const scheduleSave = useCallback(() => {
    if (readOnly) return
    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current)
    }
    saveTimerRef.current = window.setTimeout(() => {
      void persist()
    }, SAVE_DEBOUNCE_MS)
  }, [persist, readOnly])

  const flushPendingSave = useCallback(() => {
    if (!saveTimerRef.current) return
    window.clearTimeout(saveTimerRef.current)
    saveTimerRef.current = null
    if (readOnly) return
    void therapistApi.updatePatientAppointmentNotes(token, patientId, {
      appointmentNotes: notesRef.current.trim() ? notesRef.current : null,
    })
  }, [token, patientId, readOnly])

  useEffect(() => {
    if (isActive) return
    flushPendingSave()
  }, [isActive, flushPendingSave])

  useEffect(() => {
    return () => {
      flushPendingSave()
    }
  }, [flushPendingSave])

  function handleChange(value: string) {
    setNotes(value)
    scheduleSave()
  }

  function handleBlur() {
    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current)
      saveTimerRef.current = null
    }
    void persist()
  }

  function handleExport() {
    setError('')
    try {
      exportPatientAppointmentNotes({
        ...exportMeta,
        appointmentNotes: notes,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível exportar as notas')
    }
  }

  const saveLabel =
    saveState === 'saving'
      ? 'A guardar…'
      : saveState === 'saved'
        ? 'Guardado'
        : saveState === 'error'
          ? 'Erro ao guardar'
          : readOnly
            ? ''
            : 'As alterações são guardadas automaticamente'

  return (
    <Card as="section" className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2>Notas de consulta</h2>
          <p className={styles.muted}>
            Anotações clínicas durante as consultas deste utente. Separadas das notas internas do
            perfil.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleExport}
          disabled={!notes.trim()}
        >
          Exportar PDF
        </Button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <textarea
        className={styles.editor}
        value={notes}
        onChange={(event) => handleChange(event.target.value)}
        onBlur={handleBlur}
        readOnly={readOnly}
        placeholder={
          readOnly
            ? 'Sem notas de consulta registadas.'
            : 'Registe aqui observações, planos e notas das consultas…'
        }
        aria-label="Notas de consulta"
      />

      {saveLabel && <p className={styles.status}>{saveLabel}</p>}
    </Card>
  )
}
