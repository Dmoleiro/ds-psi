import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import '../../components/forms/registerForms'
import { GenericFormAnswers } from '../../components/forms/GenericFormAnswers'
import { hasPatientFormRenderer, patientFormRenderers } from '../../components/forms/formRegistry'
import { Container } from '../../components/layout/Container'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ApiError, patientApi } from '../../lib/api'
import { useDraftAutosave } from '../../hooks/useDraftAutosave'
import styles from './PatientPortal.module.css'

export function PatientFormPage() {
  const { token, formId } = useParams<{ token: string; formId: string }>()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [readOnly, setReadOnly] = useState(false)
  const [values, setValues] = useState<Record<string, unknown>>({})
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  const hasRenderer = formId ? hasPatientFormRenderer(formId) : false

  useEffect(() => {
    if (!token || !formId) return
    patientApi
      .getForm(token, formId)
      .then(({ form }) => {
        setTitle(form.title)
        setReadOnly(form.readOnly)
        setValues((form.answers as Record<string, unknown> | null) ?? {})
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 410) {
          navigate(`/formularios/p/${token}/concluido`, { replace: true })
          return
        }
        setError(err instanceof ApiError ? err.message : 'Não foi possível carregar o formulário')
      })
      .finally(() => setLoading(false))
  }, [token, formId, navigate])

  useDraftAutosave(token ?? '', formId ?? '', values, Boolean(hasRenderer && !readOnly && token && formId))

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!token || !formId || readOnly || !hasRenderer) return
    setSubmitting(true)
    setError('')
    try {
      const result = await patientApi.submitForm(token, formId, values)
      if (result.allComplete) {
        navigate(`/formularios/p/${token}/concluido`, { replace: true })
      } else {
        navigate(`/formularios/p/${token}`)
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível submeter o formulário')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Container className={styles.page}>
        <p>A carregar…</p>
      </Container>
    )
  }

  if (error && !title) {
    return (
      <Container className={styles.page}>
        <Card>
          <p>{error}</p>
          <Link to={`/formularios/p/${token}`}>← Voltar</Link>
        </Card>
      </Container>
    )
  }

  const FormRenderer = formId ? patientFormRenderers[formId] : undefined

  return (
    <Container className={styles.page}>
      <p className={styles.back}>
        <Link to={`/formularios/p/${token}`}>← Voltar aos formulários</Link>
      </p>
      <h1>{title}</h1>
      {!readOnly && hasRenderer && (
        <p className={styles.intro}>O progresso é guardado automaticamente a cada poucos segundos.</p>
      )}
      <Card>
        {FormRenderer ? (
          <form onSubmit={handleSubmit}>
            {FormRenderer({ values, onChange: setValues, readOnly })}
            {error && <p className={styles.error}>{error}</p>}
            {!readOnly && (
              <Button type="submit" disabled={submitting} style={{ marginTop: 'var(--space-lg)' }}>
                {submitting ? 'A submeter…' : 'Submeter formulário'}
              </Button>
            )}
          </form>
        ) : readOnly ? (
          <GenericFormAnswers answers={values} />
        ) : (
          <>
            <p>Este formulário ainda não está disponível para preenchimento.</p>
            <p className={styles.muted}>Peça um novo link à sua terapeuta quando o formulário estiver ativo.</p>
            <Link to={`/formularios/p/${token}`}>← Voltar</Link>
          </>
        )}
      </Card>
    </Container>
  )
}
