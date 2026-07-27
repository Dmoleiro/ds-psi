import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BackofficeLayout } from '../../components/backoffice/BackofficeLayout'
import { getPiccaModuleDefaults, hasPiccaModuleRenderer, piccaModuleRegistry } from '../../components/picca/moduleRegistry'
import {
  getPiccaInteractiveFormDefaults,
  hasPiccaInteractiveFormRenderer,
  piccaInteractiveFormRegistry,
} from '../../components/picca/interactive/interactiveFormRegistry'
import { PiccaVolumeNavList } from '../../components/picca/PiccaVolumeSections'
import { piccaFullModuleLabel } from '../../lib/piccaModuleIds'
import { piccaInteractiveFormLabel } from '../../lib/piccaInteractiveFormIds'
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

type PiccaInteractiveFormSummary = {
  id: string
  kind: 'daily_sono' | 'weekly_estrategias'
  title: string
  description: string | null
}

function interactiveFormKindLabel(kind: PiccaInteractiveFormSummary['kind']): string {
  return kind === 'daily_sono' ? 'Registo diário' : 'Registo semanal'
}

export function PiccaLibraryPage() {
  const { token, user } = useAuth()
  const [modules, setModules] = useState<PiccaModuleSummary[]>([])
  const [interactiveForms, setInteractiveForms] = useState<PiccaInteractiveFormSummary[]>([])
  const [previewModuleId, setPreviewModuleId] = useState<string | null>(null)
  const [previewInteractiveId, setPreviewInteractiveId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token || !user?.piccaEnabled) return
    Promise.all([
      therapistApi.listPiccaModules(token),
      therapistApi.listPiccaInteractiveForms(token),
    ])
      .then(([modulesData, formsData]) => {
        setModules(modulesData.modules)
        setInteractiveForms(formsData.forms)
      })
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

  const previewModule = modules.find((m) => m.id === previewModuleId)
  const PreviewModuleForm = previewModuleId ? piccaModuleRegistry[previewModuleId]?.Form : undefined
  const previewModuleDefaults = previewModuleId ? getPiccaModuleDefaults(previewModuleId) : {}

  const previewInteractive = interactiveForms.find((f) => f.id === previewInteractiveId)
  const PreviewInteractiveForm = previewInteractiveId
    ? piccaInteractiveFormRegistry[previewInteractiveId]?.Form
    : undefined
  const previewInteractiveDefaults = previewInteractiveId
    ? getPiccaInteractiveFormDefaults(previewInteractiveId)
    : {}

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
              activeId={previewModuleId}
              onSelect={(id) => {
                setPreviewModuleId(id)
                setPreviewInteractiveId(null)
              }}
            />
          </Card>

          <Card as="section" className={panelStyles.preview}>
            {previewModule && PreviewModuleForm && hasPiccaModuleRenderer(previewModule.id) ? (
              <>
                <h2>
                  {piccaFullModuleLabel(
                    previewModule.id,
                    previewModule.title,
                    previewModule.volume,
                  )}
                </h2>
                <p className={styles.muted}>Pré-visualização (sem respostas)</p>
                <PreviewModuleForm value={previewModuleDefaults} onChange={() => {}} readOnly />
              </>
            ) : (
              <p className={styles.muted}>Selecione um módulo para pré-visualizar a estrutura.</p>
            )}
          </Card>
        </div>
      )}

      {!loading && interactiveForms.length > 0 && (
        <section className={panelStyles.interactiveSection}>
          <h2 className={panelStyles.interactiveTitle}>Registos interativos</h2>
          <p className={styles.muted}>
            Formulários de registo contínuo (sono diário e estratégias semanais). As respostas dos utentes
            estão na ficha do paciente, na secção de registos interativos.
          </p>

          <div className={panelStyles.layout}>
            <Card as="section" className={panelStyles.list}>
              <h3>Formulários</h3>
              <ul className={panelStyles.moduleList}>
                {interactiveForms.map((form) => (
                  <li key={form.id}>
                    <button
                      type="button"
                      className={previewInteractiveId === form.id ? panelStyles.activeModule : undefined}
                      onClick={() => {
                        setPreviewInteractiveId(form.id)
                        setPreviewModuleId(null)
                      }}
                    >
                      <strong>{piccaInteractiveFormLabel(form.id, form.title)}</strong>
                      <span>{interactiveFormKindLabel(form.kind)}</span>
                      {form.description && <span>{form.description}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </Card>

            <Card as="section" className={panelStyles.preview}>
              {previewInteractive &&
              PreviewInteractiveForm &&
              hasPiccaInteractiveFormRenderer(previewInteractive.id) ? (
                <>
                  <h2>{piccaInteractiveFormLabel(previewInteractive.id, previewInteractive.title)}</h2>
                  <p className={styles.muted}>
                    Pré-visualização (sem respostas) — {interactiveFormKindLabel(previewInteractive.kind)}
                  </p>
                  <PreviewInteractiveForm
                    value={previewInteractiveDefaults}
                    onChange={() => {}}
                    readOnly
                  />
                </>
              ) : (
                <p className={styles.muted}>
                  Selecione um formulário interativo para pré-visualizar a estrutura.
                </p>
              )}
            </Card>
          </div>
        </section>
      )}
    </BackofficeLayout>
  )
}
