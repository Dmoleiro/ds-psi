import { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { hasPiccaModuleRenderer, piccaModuleRegistry } from '../picca/moduleRegistry'
import { piccaModuleLabel } from '../../lib/piccaModuleIds'
import { groupPiccaModulesByVolume } from '../../lib/piccaVolumes'
import { exportPiccaSubmissionsPdf, type PiccaSessionSubmissionsView } from '../../lib/exportPiccaSubmissionsPdf'
import volumeStyles from '../picca/PiccaVolumeSections.module.css'
import styles from './PiccaSubmissionsPanel.module.css'

type Props = {
  session: PiccaSessionSubmissionsView
  onClose?: () => void
  onSaveModule?: (moduleId: string, answers: Record<string, unknown>) => Promise<void>
}

export function PiccaSubmissionsPanel({ session, onClose, onSaveModule }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [drafts, setDrafts] = useState<Record<string, Record<string, unknown>>>(() =>
    Object.fromEntries(session.modules.map((m) => [m.moduleId, m.answers])),
  )
  const [saving, setSaving] = useState<string | null>(null)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [session.id])

  function handleExportPdf() {
    try {
      exportPiccaSubmissionsPdf({ ...session, modules: session.modules.map((m) => ({ ...m, answers: drafts[m.moduleId] ?? m.answers })) })
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Não foi possível exportar o PDF')
    }
  }

  async function handleSave(moduleId: string) {
    if (!onSaveModule) return
    setSaving(moduleId)
    setSaveError('')
    try {
      await onSaveModule(moduleId, drafts[moduleId] ?? {})
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Não foi possível guardar')
    } finally {
      setSaving(null)
    }
  }

  return (
    <div ref={panelRef} className={styles.scrollAnchor}>
      <Card as="section" className={styles.panel}>
      <div className={styles.header}>
        <div>
          <h2>PICCA — respostas submetidas</h2>
          <p className={styles.meta}>
            {session.patient.fullName} · {session.location.name}
          </p>
        </div>
        <div className={styles.actions}>
          <Button type="button" variant="outline" onClick={handleExportPdf}>
            Imprimir / guardar PDF
          </Button>
          {onClose && (
            <button type="button" className={styles.closeButton} onClick={onClose}>
              Fechar
            </button>
          )}
        </div>
      </div>

      {saveError && <p className={styles.error}>{saveError}</p>}

      {session.modules.length === 0 ? (
        <p className={styles.empty}>Ainda não existem módulos submetidos.</p>
      ) : (
        <div className={styles.modules}>
          {groupPiccaModulesByVolume(
            session.modules.map((m) => ({ ...m, moduleId: m.moduleId, id: m.moduleId })),
          ).map((group) => (
            <section key={group.volume} className={volumeStyles.volumeGroup}>
              <h3 className={volumeStyles.volumeTitle}>{group.label}</h3>
              {group.modules.map((mod) => {
                const ModuleForm = piccaModuleRegistry[mod.moduleId]?.Form
                const answers = drafts[mod.moduleId] ?? mod.answers
                return (
                  <article key={mod.moduleId} className={styles.moduleBlock}>
                    <header className={styles.moduleHeader}>
                      <h4 className={styles.moduleTitle}>
                        {piccaModuleLabel(mod.moduleId, mod.title)}
                      </h4>
                      <time dateTime={mod.submittedAt}>
                        {new Date(mod.submittedAt).toLocaleString('pt-PT')}
                      </time>
                    </header>
                    {ModuleForm && hasPiccaModuleRenderer(mod.moduleId) ? (
                      <>
                        <ModuleForm
                          value={answers}
                          onChange={(next) =>
                            setDrafts((current) => ({ ...current, [mod.moduleId]: next }))
                          }
                        />
                        {onSaveModule && (
                          <Button
                            type="button"
                            onClick={() => handleSave(mod.moduleId)}
                            disabled={saving === mod.moduleId}
                          >
                            {saving === mod.moduleId ? 'A guardar…' : 'Guardar alterações'}
                          </Button>
                        )}
                      </>
                    ) : (
                      <pre className={styles.rawJson}>{JSON.stringify(answers, null, 2)}</pre>
                    )}
                  </article>
                )
              })}
            </section>
          ))}
        </div>
      )}
    </Card>
    </div>
  )
}
