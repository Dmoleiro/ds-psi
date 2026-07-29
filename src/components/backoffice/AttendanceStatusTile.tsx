import type { AttendanceStatus } from '../../lib/api'
import { attendanceCellLabel } from '../../lib/attendance'
import matrixStyles from './AttendanceMatrix.module.css'
import styles from './AttendanceStatusTile.module.css'

type Props = {
  status: AttendanceStatus | null | undefined
  hasScheduledAppointment?: boolean
  editable?: boolean
  disabled?: boolean
  onClick?: () => void
  locked?: boolean
  onLockToggle?: () => void
}

export function AttendanceStatusTile({
  status,
  hasScheduledAppointment = true,
  editable = false,
  disabled = false,
  onClick,
  locked,
  onLockToggle,
}: Props) {
  const label = attendanceCellLabel(status, hasScheduledAppointment)
  const statusClass = status
    ? matrixStyles[status]
    : hasScheduledAppointment
      ? matrixStyles.scheduled
      : ''
  const showLock = locked !== undefined && Boolean(onLockToggle)
  const interactive = editable && !disabled && !locked && Boolean(onClick)
  const Tag = interactive ? 'button' : 'span'

  return (
    <div className={styles.wrap}>
      {showLock ? (
        <button
          type="button"
          className={`${styles.lockButton} ${locked ? '' : styles.lockButtonOpen}`}
          onClick={onLockToggle}
          aria-pressed={!locked}
          title={locked ? 'Desbloquear presença' : 'Bloquear presença'}
          aria-label={locked ? 'Desbloquear presença' : 'Bloquear presença'}
        >
          <span className={styles.lockIcon} aria-hidden>
            {locked ? '🔒' : '🔓'}
          </span>
        </button>
      ) : null}
      <div className={styles.tileColumn}>
        <Tag
          {...(interactive
            ? {
                type: 'button' as const,
                onClick,
                disabled,
              }
            : {})}
          className={`${matrixStyles.cell} ${styles.tile} ${statusClass}`}
          title={interactive ? 'Clique para alterar presença' : label}
          aria-label={`Presença: ${label}`}
        />
        <span className={styles.label}>{label}</span>
      </div>
    </div>
  )
}
