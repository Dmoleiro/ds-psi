import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import '../../components/forms/registerForms'
import {
  patientFormRenderers,
} from '../../components/forms/formRegistry'
import { Container } from '../../components/layout/Container'
import { Card } from '../../components/ui/Card'
import { ApiError, therapistApi } from '../../lib/api'
import { getEmptyFormPreviewValues } from '../../lib/formPreview'
import { isDocumentUploadForm } from '../../lib/formIds'
import type { QuestionnaireDefinition } from '../../lib/questionnaires'
import { useAuth } from '../../hooks/useAuth'
import styles from './FormPreviewPage.module.css'

export function FormPreviewPage() {
  const { formId } = useParams<{ formId: string }>()
  const { token } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState<string | null>(null)
  const [definition, setDefinition] = useState<QuestionnaireDefinition | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token || !formId) return
    therapistApi
      .getFormPreview(token, formId)
      .then(({ form }) => {
        setTitle(form.title)
        setDescription(form.description)
        setDefinition(form.definition ?? null)
      })
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : 'Não foi possível carregar a pré-visualização')
      })
      .finally(() => setLoading(false))
  }, [token, formId])

  if (loading) {
    return (
      <Container className={styles.page}>
        <p>A carregar…</p>
      </Container>
    )
  }

  if (error || !formId) {
    return (
      <Container className={styles.page}>
        <Card>
          <p className={styles.error}>{error || 'Formulário inválido'}</p>
        </Card>
      </Container>
    )
  }

  const values = getEmptyFormPreviewValues(formId)
  const FormRenderer = formId ? patientFormRenderers[formId] : undefined
  const isDocumentForm = formId ? isDocumentUploadForm(formId) : false

  return (
    <Container className={styles.page}>
      <p className={styles.banner}>
        Pré-visualização — apenas consulta. Os campos aparecem vazios, tal como o paciente os verá
        inicialmente. Nada é guardado.
      </p>
      <h1 className={styles.title}>{title}</h1>
      {description ? <p className={styles.description}>{description}</p> : null}
      <Card>
        {isDocumentForm ? (
          <p className={styles.muted}>
            Na versão enviada ao paciente, esta página permite anexar documentos em PDF ou imagem
            através do link único. A pré-visualização do carregamento requer uma sessão activa.
          </p>
        ) : FormRenderer ? (
          FormRenderer({
            values,
            onChange: () => {},
            readOnly: true,
            definition,
          })
        ) : (
          <p className={styles.muted}>Este formulário ainda não está disponível para pré-visualização.</p>
        )}
      </Card>
    </Container>
  )
}
