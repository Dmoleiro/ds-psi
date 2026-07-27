import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BackofficeLayout } from '../../components/backoffice/BackofficeLayout'
import { getPiccaModuleDefaults, hasPiccaModuleRenderer, piccaModuleRegistry } from '../../components/picca/moduleRegistry'
import { PiccaVolumeNavList } from '../../components/picca/PiccaVolumeSections'
import { piccaFullModuleLabel } from '../../lib/piccaModuleIds'
import { ApiError, therapistApi } from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'
import { Card } from '../../components/ui/Card'
import styles from '../../components/backoffice/BackofficeLayout.module.css'
import panelStyles from './PiccaLibraryPage.module.css'

type PiccaModuleSummary = {
  id: string
  volume: number
  moduleNumber: number
  title: string
  description: string | null
}

export function PiccaLibraryPage() {
  const { token, user } = useAuth()
  const [modules, setModules] = useState<PiccaModuleSummary[]>([])
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token || !user?.piccaEnabled) return
    therapistApi
      .listPiccaModules(token)
      .then((data) => setModules(data.modules))
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : 'Não foi possível carregar os módulos')
      })
      .finally(() => setLoading(false))
  }, [token, user?.piccaEnabled])

  if (!user?.piccaEnabled) {
    return (
      <BackofficeLayout>
        <p className={styles.error}>Acesso PICCA não autorizado.</p>
        <Link to="/backoffice">← Voltar</Link>
      </BackofficeLayout>
    )
  }

  const previewModule = modules.find((m) => m.id === previewId)
  const PreviewForm = previewId ? piccaModuleRegistry[previewId]?.Form : undefined
  const previewDefaults = previewId ? getPiccaModuleDefaults(previewId) : {}

  return (
    <BackofficeLayout>
      <h1 className={styles.pageTitle}>PICCA — biblioteca de módulos</h1>
      <p className={styles.muted}>
        Pré-visualização da estrutura de cada módulo, organizada por volume. As respostas dos utentes só
        estão disponíveis na ficha do paciente, após submissão.
      </p>

      {loading && <p className={styles.muted}>A carregar…</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && modules.length > 0 && (
        <div className={panelStyles.layout}>
          <Card as="section" className={panelStyles.list}>
            <h2>Volumes e módulos</h2>
            <PiccaVolumeNavList
              modules={modules}
              activeId={previewId}
              onSelect={setPreviewId}
            />
          </Card>

          <Card as="section" className={panelStyles.preview}>
            {previewModule && PreviewForm && hasPiccaModuleRenderer(previewModule.id) ? (
              <>
                <h2>
                  {piccaFullModuleLabel(
                    previewModule.id,
                    previewModule.title,
                    previewModule.volume,
                  )}
                </h2>
                <p className={styles.muted}>Pré-visualização (sem respostas)</p>
                <PreviewForm value={previewDefaults} onChange={() => {}} readOnly />
              </>
            ) : (
              <p className={styles.muted}>Selecione um módulo para pré-visualizar a estrutura.</p>
            )}
          </Card>
        </div>
      )}
    </BackofficeLayout>
  )
}
