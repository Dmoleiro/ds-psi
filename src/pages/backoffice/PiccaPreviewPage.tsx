import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  getPiccaModuleDefaults,
  hasPiccaModuleRenderer,
  piccaModuleRegistry,
} from '../../components/picca/moduleRegistry'
import {
  getPiccaInteractiveFormDefaults,
  hasPiccaInteractiveFormRenderer,
  piccaInteractiveFormRegistry,
} from '../../components/picca/interactive/interactiveFormRegistry'
import { Container } from '../../components/layout/Container'
import { Card } from '../../components/ui/Card'
import { ApiError, therapistApi } from '../../lib/api'
import { piccaFullModuleLabel } from '../../lib/piccaModuleIds'
import { piccaInteractiveFormLabel } from '../../lib/piccaInteractiveFormIds'
import { piccaInteractiveKindLabel } from '../../lib/piccaInteractiveKinds'
import { useAuth } from '../../hooks/useAuth'
import styles from './FormPreviewPage.module.css'

type PreviewKind = 'module' | 'interactive'

export function PiccaModulePreviewPage() {
  const { moduleId } = useParams<{ moduleId: string }>()
  return <PiccaPreviewPage kind="module" id={moduleId} />
}

export function PiccaInteractivePreviewPage() {
  const { formId } = useParams<{ formId: string }>()
  return <PiccaPreviewPage kind="interactive" id={formId} />
}

function PiccaPreviewPage({ kind, id }: { kind: PreviewKind; id: string | undefined }) {
  const { token, user } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState<string | null>(null)
  const [interactiveKind, setInteractiveKind] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token || !id || !user?.piccaEnabled) return

    const request =
      kind === 'module'
        ? therapistApi.listPiccaModules(token).then(({ modules }) => {
            const mod = modules.find((entry) => entry.id === id)
            if (!mod) throw new ApiError('Módulo PICCA não encontrado', 404)
            setTitle(piccaFullModuleLabel(mod.id, mod.title, mod.volume))
            setDescription(mod.description)
          })
        : therapistApi.listPiccaInteractiveForms(token).then(({ forms }) => {
            const form = forms.find((entry) => entry.id === id)
            if (!form) throw new ApiError('Formulário interactivo não encontrado', 404)
            setTitle(piccaInteractiveFormLabel(form.id, form.title))
            setDescription(form.description)
            setInteractiveKind(piccaInteractiveKindLabel(form.kind))
          })

    request
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : 'Não foi possível carregar a pré-visualização')
      })
      .finally(() => setLoading(false))
  }, [token, id, kind, user?.piccaEnabled])

  if (!user?.piccaEnabled) {
    return (
      <Container className={styles.page}>
        <Card>
          <p className={styles.error}>Acesso PICCA não autorizado.</p>
        </Card>
      </Container>
    )
  }

  if (loading) {
    return (
      <Container className={styles.page}>
        <p>A carregar…</p>
      </Container>
    )
  }

  if (error || !id) {
    return (
      <Container className={styles.page}>
        <Card>
          <p className={styles.error}>{error || 'Documento inválido'}</p>
        </Card>
      </Container>
    )
  }

  const ModuleForm = kind === 'module' ? piccaModuleRegistry[id]?.Form : undefined
  const InteractiveForm =
    kind === 'interactive' ? piccaInteractiveFormRegistry[id]?.Form : undefined
  const moduleDefaults = kind === 'module' ? getPiccaModuleDefaults(id) : {}
  const interactiveDefaults =
    kind === 'interactive' ? getPiccaInteractiveFormDefaults(id) : {}

  const canPreviewModule = kind === 'module' && hasPiccaModuleRenderer(id) && ModuleForm
  const canPreviewInteractive =
    kind === 'interactive' && hasPiccaInteractiveFormRenderer(id) && InteractiveForm

  return (
    <Container className={styles.page}>
      <p className={styles.banner}>
        Pré-visualização PICCA — apenas consulta. Os campos aparecem vazios, tal como o paciente os
        verá inicialmente. Nada é guardado.
      </p>
      <h1 className={styles.title}>{title}</h1>
      {description ? <p className={styles.description}>{description}</p> : null}
      {interactiveKind ? (
        <p className={styles.description}>Tipo de registo: {interactiveKind}</p>
      ) : null}
      <Card>
        {canPreviewModule && ModuleForm ? (
          <ModuleForm value={moduleDefaults} onChange={() => {}} readOnly />
        ) : canPreviewInteractive && InteractiveForm ? (
          <InteractiveForm value={interactiveDefaults} onChange={() => {}} readOnly />
        ) : (
          <p className={styles.muted}>
            Este documento ainda não está disponível para pré-visualização.
          </p>
        )}
      </Card>
    </Container>
  )
}
