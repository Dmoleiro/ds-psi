import { useCallback, useEffect, useRef, useState } from 'react'
import { ApiError, therapistApi } from '../../lib/api'
import styles from './TherapistNotepadDrawer.module.css'

const OPEN_KEY = 'therapist-notepad-open'
const DISMISSED_KEY = 'therapist-notepad-dismissed'
const AUTO_OPENED_KEY = 'therapist-notepad-auto-opened'
const SAVE_DEBOUNCE_MS = 600

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

type Props = {
  token: string
}

function readOpenState(): boolean {
  return sessionStorage.getItem(OPEN_KEY) === '1'
}

function readInitialOpenState(): boolean {
  if (sessionStorage.getItem(AUTO_OPENED_KEY) === '1') {
    return readOpenState()
  }
  return false
}

export function TherapistNotepadDrawer({ token }: Props) {
  const [open, setOpenState] = useState(readInitialOpenState)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [error, setError] = useState('')
  const contentRef = useRef(content)
  const saveTimerRef = useRef<number | null>(null)
  const lastSavedRef = useRef('')
  const loadedForTokenRef = useRef<string | null>(null)

  contentRef.current = content

  const setOpen = useCallback((nextOpen: boolean) => {
    setOpenState(nextOpen)
    sessionStorage.setItem(OPEN_KEY, nextOpen ? '1' : '0')
  }, [])

  const persist = useCallback(
    async (nextContent: string) => {
      setSaveState('saving')
      setError('')
      try {
        await therapistApi.updateNotepad(token, nextContent)
        lastSavedRef.current = nextContent
        setSaveState('saved')
        window.setTimeout(() => {
          setSaveState((current) => (current === 'saved' ? 'idle' : current))
        }, 2000)
      } catch (err) {
        setSaveState('error')
        setError(err instanceof ApiError ? err.message : 'Não foi possível guardar as notas')
      }
    },
    [token],
  )

  const scheduleSave = useCallback(
    (nextContent: string) => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current)
      }
      saveTimerRef.current = window.setTimeout(() => {
        if (nextContent !== lastSavedRef.current) {
          void persist(nextContent)
        }
      }, SAVE_DEBOUNCE_MS)
    },
    [persist],
  )

  useEffect(() => {
    if (loadedForTokenRef.current === token) return

    let cancelled = false

    async function load() {
      const isFirstLoadForSession = sessionStorage.getItem(AUTO_OPENED_KEY) !== '1'
      if (isFirstLoadForSession) {
        setLoading(true)
      }
      setError('')
      try {
        const data = await therapistApi.getNotepad(token)
        if (cancelled) return

        setContent(data.content)
        lastSavedRef.current = data.content
        loadedForTokenRef.current = token

        if (isFirstLoadForSession) {
          const hasContent = data.content.trim().length > 0
          const dismissed = sessionStorage.getItem(DISMISSED_KEY) === '1'
          const shouldOpen = hasContent && !dismissed
          setOpen(shouldOpen)
          sessionStorage.setItem(AUTO_OPENED_KEY, '1')
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Não foi possível carregar as notas')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()

    return () => {
      cancelled = true
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current)
      }
    }
  }, [token, setOpen])

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current)
      }
      const pending = contentRef.current
      if (pending !== lastSavedRef.current) {
        void therapistApi.updateNotepad(token, pending).catch(() => undefined)
      }
    }
  }, [token])

  function handleChange(value: string) {
    setContent(value)
    scheduleSave(value)
  }

  function openDrawer() {
    sessionStorage.removeItem(DISMISSED_KEY)
    setOpen(true)
  }

  function closeDrawer() {
    sessionStorage.setItem(DISMISSED_KEY, '1')
    setOpen(false)
    if (content !== lastSavedRef.current) {
      void persist(content)
    }
  }

  function saveStatusLabel(): string | null {
    if (saveState === 'saving') return 'A guardar…'
    if (saveState === 'saved') return 'Guardado'
    if (saveState === 'error') return 'Erro ao guardar'
    return null
  }

  const statusLabel = saveStatusLabel()

  return (
    <aside className={`${styles.drawer} ${open ? styles.drawerOpen : styles.drawerClosed}`} aria-label="Bloco de notas">
      <button
        type="button"
        className={styles.toggle}
        onClick={open ? closeDrawer : openDrawer}
        aria-expanded={open}
        aria-controls="therapist-notepad-panel"
        title={open ? 'Fechar notas' : 'Abrir notas'}
      >
        <span className={styles.toggleIcon} aria-hidden>
          {open ? '›' : '‹'}
        </span>
        <span className={styles.toggleLabel}>Notas</span>
      </button>

      <div id="therapist-notepad-panel" className={styles.panel}>
        <header className={styles.header}>
          <div>
            <h2 className={styles.title}>Bloco de notas</h2>
            <p className={styles.subtitle}>Notas pessoais — só visíveis para si</p>
          </div>
          <button type="button" className={styles.closeButton} onClick={closeDrawer} aria-label="Fechar notas">
            ×
          </button>
        </header>

        {loading ? (
          <p className={styles.status}>A carregar…</p>
        ) : (
          <>
            <textarea
              className={styles.textarea}
              value={content}
              onChange={(event) => handleChange(event.target.value)}
              placeholder="Escreva aqui lembretes, tarefas ou notas do dia…"
              aria-label="Notas pessoais"
            />
            <footer className={styles.footer}>
              {error && <p className={styles.error}>{error}</p>}
              {statusLabel && <p className={styles.status}>{statusLabel}</p>}
            </footer>
          </>
        )}
      </div>
    </aside>
  )
}
