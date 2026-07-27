import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getPiccaModuleDefaults, hasPiccaModuleRenderer, piccaModuleRegistry } from '../../components/picca/moduleRegistry'
import { Container } from '../../components/layout/Container'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ApiError, piccaPatientApi } from '../../lib/api'
import { usePiccaDraftAutosave } from '../../hooks/usePiccaDraftAutosave'
import styles from './PatientPortal.module.css'

export function PiccaModulePage() {
  const { token, moduleId } = useParams<{ token: string; moduleId: string }>()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [readOnly, setReadOnly] = useState(false)
  const [values, setValues] = useState<Record<string, unknown>>({})
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  const hasRenderer = moduleId ? hasPiccaModuleRenderer(moduleId) : false

  useEffect(() => {
    if (!token || !moduleId) return
    piccaPatientApi
      .getModule(token, moduleId)
      .then(({ module }) => {
        setTitle(module.title)
        setReadOnly(module.readOnly)
        const defaults = getPiccaModuleDefaults(moduleId)
        setValues({ ...defaults, ...(module.answers as Record<string, unknown>) })
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 410) {
          navigate(`/formularios/picca/${token}`, { replace: true })
          return
        }
        setError(err instanceof ApiError ? err.message : 'Não foi possível carregar o módulo')
      })
      .finally(() => setLoading(false))
  }, [token, moduleId, navigate])

  usePiccaDraftAutosave(
    token ?? '',
    moduleId ?? '',
    values,
    Boolean(hasRenderer && !readOnly && token && moduleId),
  )

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!token || !moduleId || readOnly || !hasRenderer) return
    setSubmitting(true)
    setError('')
    try {
      await piccaPatientApi.submitModule(token, moduleId, values)
      navigate(`/formularios/picca/${token}`)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível submeter o módulo')
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
          <Link to={`/formularios/picca/${token}`}>← Voltar</Link>
        </Card>
      </Container>
    )
  }

  const ModuleForm = moduleId ? piccaModuleRegistry[moduleId]?.Form : undefined

  return (
    <Container className={styles.page}>
      <p className={styles.back}>
        <Link to={`/formularios/picca/${token}`}>← Voltar ao PICCA</Link>
      </p>
      <h1>{title}</h1>
      {!readOnly && hasRenderer && (
        <p className={styles.intro}>O progresso é guardado automaticamente a cada poucos segundos.</p>
      )}
      {readOnly && (
        <p className={styles.intro}>Este módulo já foi submetido — pode consultar as respostas abaixo.</p>
      )}
      {error && <p className={styles.error}>{error}</p>}
      {ModuleForm ? (
        <form onSubmit={handleSubmit}>
          <ModuleForm value={values} onChange={setValues} readOnly={readOnly} />
          {!readOnly && (
            <div style={{ marginTop: 'var(--space-lg)' }}>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'A submeter…' : 'Submeter módulo'}
              </Button>
            </div>
          )}
        </form>
      ) : (
        <Card>
          <p>Este módulo ainda não está disponível.</p>
        </Card>
      )}
    </Container>
  )
}
