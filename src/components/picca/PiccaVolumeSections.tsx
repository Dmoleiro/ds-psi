import type { ReactNode } from 'react'
import { piccaModuleLabel } from '../../lib/piccaModuleIds'
import { groupPiccaModulesByVolume } from '../../lib/piccaVolumes'
import styles from './PiccaVolumeSections.module.css'

type ModuleWithVolume = {
  volume?: number
  moduleNumber?: number
  id?: string
  moduleId?: string
  title: string
}

export function PiccaVolumeCheckboxGroups({
  modules,
  selectedIds,
  onToggle,
  getId = (mod) => mod.id ?? mod.moduleId ?? '',
  previewHref,
}: {
  modules: Array<ModuleWithVolume & { id: string; description?: string | null }>
  selectedIds: string[]
  onToggle: (id: string) => void
  getId?: (mod: ModuleWithVolume & { id: string }) => string
  previewHref?: (id: string) => string | null
}) {
  const groups = groupPiccaModulesByVolume(modules)

  return (
    <>
      {groups.map((group) => (
        <section key={group.volume} className={styles.volumeGroup}>
          <h3 className={styles.volumeTitle}>{group.label}</h3>
          <div className={styles.moduleList}>
            {group.modules.map((mod) => {
              const id = getId(mod as ModuleWithVolume & { id: string })
              const href = previewHref?.(id)
              return (
                <div key={id} className={href ? styles.selectRow : undefined}>
                  <label className={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(id)}
                      onChange={() => onToggle(id)}
                    />
                    {piccaModuleLabel(id, mod.title)}
                  </label>
                  {href ? (
                    <a
                      className={styles.previewLink}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Pré-visualizar
                    </a>
                  ) : null}
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </>
  )
}

export function PiccaVolumeStatusList({
  modules,
  getId = (mod) => mod.moduleId ?? mod.id ?? '',
  renderStatus,
}: {
  modules: Array<ModuleWithVolume & { status: string; moduleId?: string; id?: string }>
  getId?: (mod: ModuleWithVolume & { moduleId?: string; id?: string }) => string
  renderStatus: (mod: ModuleWithVolume & { status: string }) => ReactNode
}) {
  const groups = groupPiccaModulesByVolume(modules)

  return (
    <>
      {groups.map((group) => (
        <section key={group.volume} className={styles.volumeGroup}>
          <h4 className={styles.volumeTitle}>{group.label}</h4>
          <div className={styles.moduleList}>
            {group.modules.map((mod) => {
              const id = getId(mod)
              return (
                <div key={id} className={styles.statusItem}>
                  <span>{piccaModuleLabel(id, mod.title)}</span>
                  {renderStatus(mod)}
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </>
  )
}

export function PiccaVolumeNavList({
  modules,
  activeId,
  onSelect,
  getId = (mod) => mod.id ?? '',
}: {
  modules: Array<ModuleWithVolume & { id: string; description?: string | null }>
  activeId: string | null
  onSelect: (id: string) => void
  getId?: (mod: ModuleWithVolume & { id: string }) => string
}) {
  const groups = groupPiccaModulesByVolume(modules)

  return (
    <>
      {groups.map((group) => (
        <section key={group.volume} className={styles.volumeGroup}>
          <h3 className={styles.volumeTitle}>{group.label}</h3>
          <ul className={styles.moduleList} style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {group.modules.map((mod) => {
              const id = getId(mod)
              return (
                <li key={id}>
                  <button
                    type="button"
                    className={
                      activeId === id
                        ? `${styles.navButton} ${styles.navButtonActive}`
                        : styles.navButton
                    }
                    onClick={() => onSelect(id)}
                  >
                    <strong>{piccaModuleLabel(id, mod.title)}</strong>
                    {mod.description && <span>{mod.description}</span>}
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </>
  )
}

export function PiccaVolumePortalSections({
  modules,
  getId = (mod) => mod.moduleId ?? '',
  renderModule,
}: {
  modules: Array<
    ModuleWithVolume & {
      moduleId: string
      description?: string | null
      status: string
      accessible: boolean
      readOnly: boolean
    }
  >
  getId?: (mod: { moduleId: string }) => string
  renderModule: (
    mod: ModuleWithVolume & {
      moduleId: string
      description?: string | null
      status: string
      accessible: boolean
      readOnly: boolean
    },
  ) => ReactNode
}) {
  const groups = groupPiccaModulesByVolume(modules)

  return (
    <>
      {groups.map((group) => (
        <section key={group.volume} className={styles.volumeGroup}>
          <h2 className={styles.volumeTitle}>{group.label}</h2>
          <div className={styles.portalCardList}>
            {group.modules.map((mod) => (
              <div key={getId(mod)}>{renderModule(mod)}</div>
            ))}
          </div>
        </section>
      ))}
    </>
  )
}
