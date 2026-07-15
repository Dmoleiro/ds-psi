import { useState } from 'react'
import { ApiError } from '../../lib/api'
import { Button } from '../ui/Button'
import layout from './BackofficeLayout.module.css'

type Props = {
  onSubmit: (password: string) => Promise<void>
}

export function AdminPasswordReset({ onSubmit }: Props) {
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function close() {
    setOpen(false)
    setPassword('')
    setError('')
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await onSubmit(password)
      close()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível alterar a palavra-passe')
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) {
    return (
      <button type="button" className={layout.linkButton} onClick={() => setOpen(true)}>
        Alterar palavra-passe
      </button>
    )
  }

  return (
    <form className={layout.inlineForm} onSubmit={handleSubmit}>
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        minLength={8}
        placeholder="Nova palavra-passe"
        required
        autoFocus
      />
      <Button type="submit" disabled={submitting || password.length < 8}>
        {submitting ? 'A guardar…' : 'Guardar'}
      </Button>
      <button type="button" className={layout.linkButton} onClick={close} disabled={submitting}>
        Cancelar
      </button>
      {error && <p className={layout.error}>{error}</p>}
    </form>
  )
}
