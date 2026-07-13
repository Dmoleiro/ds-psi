import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ConsentForm,
  emptyConsentForm,
  type ConsentFormValues,
} from '../../components/forms/ConsentForm'
import {
  HistoryForm,
  emptyHistoryForm,
  type HistoryFormValues,
} from '../../components/forms/HistoryForm'
import {
  IntakeForm,
  emptyIntakeForm,
  type IntakeFormValues,
} from '../../components/forms/IntakeForm'
import { Container } from '../../components/layout/Container'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ApiError, patientApi } from '../../lib/api'
import { useDraftAutosave } from '../../hooks/useDraftAutosave'
import styles from './PatientPortal.module.css'

type FormState = IntakeFormValues | ConsentFormValues | HistoryFormValues

function mergeIntake(data: Record<string, unknown> | null): IntakeFormValues {
  return { ...emptyIntakeForm, ...(data as Partial<IntakeFormValues>) }
}

function mergeConsent(data: Record<string, unknown> | null): ConsentFormValues {
  return { ...emptyConsentForm(), ...(data as Partial<ConsentFormValues>) }
}

function mergeHistory(data: Record<string, unknown> | null): HistoryFormValues {
  return { ...emptyHistoryForm, ...(data as Partial<HistoryFormValues>) }
}

export function PatientFormPage() {
  const { token, formId } = useParams<{ token: string; formId: string }>()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [readOnly, setReadOnly] = useState(false)
  const [values, setValues] = useState<FormState | null>(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token || !formId) return
    patientApi
      .getForm(token, formId)
      .then(({ form }) => {
        setTitle(form.title)
        setReadOnly(form.readOnly)
        const answers = (form.answers as Record<string, unknown> | null) ?? null
        if (formId === 'intake') setValues(mergeIntake(answers))
        else if (formId === 'consent') setValues(mergeConsent(answers))
        else if (formId === 'history') setValues(mergeHistory(answers))
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

  useDraftAutosave(
    token ?? '',
    formId ?? '',
    (values as Record<string, unknown>) ?? {},
    Boolean(values && !readOnly && token && formId),
  )

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!token || !formId || !values || readOnly) return
    setSubmitting(true)
    setError('')
    try {
      const result = await patientApi.submitForm(token, formId, values as Record<string, unknown>)
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

  if (!values) {
    return (
      <Container className={styles.page}>
        <Card>
          <p>{error || 'Formulário não encontrado.'}</p>
          <Link to={`/formularios/p/${token}`}>← Voltar</Link>
        </Card>
      </Container>
    )
  }

  return (
    <Container className={styles.page}>
      <p className={styles.back}>
        <Link to={`/formularios/p/${token}`}>← Voltar aos formulários</Link>
      </p>
      <h1>{title}</h1>
      {!readOnly && (
        <p className={styles.intro}>O progresso é guardado automaticamente a cada poucos segundos.</p>
      )}
      <form onSubmit={handleSubmit}>
        <Card>
          {formId === 'intake' && (
            <IntakeForm
              values={values as IntakeFormValues}
              onChange={setValues}
              readOnly={readOnly}
            />
          )}
          {formId === 'consent' && (
            <ConsentForm
              values={values as ConsentFormValues}
              onChange={setValues}
              readOnly={readOnly}
            />
          )}
          {formId === 'history' && (
            <HistoryForm
              values={values as HistoryFormValues}
              onChange={setValues}
              readOnly={readOnly}
            />
          )}
          {error && <p className={styles.error}>{error}</p>}
          {!readOnly && (
            <Button type="submit" disabled={submitting} style={{ marginTop: 'var(--space-lg)' }}>
              {submitting ? 'A submeter…' : 'Submeter formulário'}
            </Button>
          )}
        </Card>
      </form>
    </Container>
  )
}
