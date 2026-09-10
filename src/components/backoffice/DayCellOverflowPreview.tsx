import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { AppointmentSummary, CalendarBlockSummary } from '../../lib/api'
import { formatBlockRange } from '../../lib/appointments'
import styles from './AppointmentsCalendar.module.css'

type Props = {
  hiddenCount: number
  appointments: AppointmentSummary[]
  blocks: CalendarBlockSummary[]
}

const POPOVER_WIDTH = 15.5 * 16
const VIEWPORT_PADDING = 8

export function DayCellOverflowPreview({ hiddenCount, appointments, blocks }: Props) {
  const triggerRef = useRef<HTMLSpanElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current
    const popover = popoverRef.current
    if (!trigger) return

    const rect = trigger.getBoundingClientRect()
    const popoverHeight = popover?.offsetHeight ?? 180
    const spaceBelow = window.innerHeight - rect.bottom
    const showAbove = spaceBelow < popoverHeight + 12 && rect.top > popoverHeight + 12
    const top = showAbove ? rect.top - popoverHeight - 6 : rect.bottom + 6
    const left = Math.min(
      Math.max(VIEWPORT_PADDING, rect.left),
      window.innerWidth - POPOVER_WIDTH - VIEWPORT_PADDING,
    )

    setCoords({ top, left })
  }, [])

  const show = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current)
      hideTimerRef.current = null
    }
    setOpen(true)
  }, [])

  const scheduleHide = useCallback(() => {
    hideTimerRef.current = setTimeout(() => setOpen(false), 120)
  }, [])

  const cancelHide = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current)
      hideTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!open) return

    const frame = requestAnimationFrame(() => {
      updatePosition()
      requestAnimationFrame(updatePosition)
    })
    const handleReposition = () => updatePosition()
    window.addEventListener('scroll', handleReposition, true)
    window.addEventListener('resize', handleReposition)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', handleReposition, true)
      window.removeEventListener('resize', handleReposition)
    }
  }, [open, updatePosition, appointments.length, blocks.length])

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    }
  }, [])

  if (hiddenCount <= 0) return null

  const popover =
    open &&
    createPortal(
      <div
        ref={popoverRef}
        className={styles.dayPopover}
        style={{ top: coords.top, left: coords.left }}
        onMouseEnter={cancelHide}
        onMouseLeave={scheduleHide}
        role="tooltip"
      >
        <p className={styles.dayPopoverTitle}>Consultas do dia</p>
        <ul className={styles.dayPopoverList}>
          {appointments.map((appointment) => (
            <li key={appointment.id} className={styles.dayPopoverItem}>
              <span className={styles.dayPopoverTime}>{appointment.time}</span>
              <span className={styles.dayPopoverBody}>
                <span className={styles.dayPopoverName}>{appointment.patientName}</span>
                <span className={styles.dayPopoverMeta}>
                  {appointment.gabineteName} · {appointment.locationName}
                </span>
              </span>
            </li>
          ))}
          {blocks.map((block) => (
            <li key={block.id} className={styles.dayPopoverItemBlock}>
              <span className={styles.dayPopoverTime}>
                {formatBlockRange(block.startTime, block.endTime)}
              </span>
              <span className={styles.dayPopoverBody}>
                <span className={styles.dayPopoverName}>{block.label}</span>
                <span className={styles.dayPopoverMeta}>Bloqueado</span>
              </span>
            </li>
          ))}
        </ul>
      </div>,
      document.body,
    )

  return (
    <>
      <span
        ref={triggerRef}
        className={styles.moreLabel}
        onMouseEnter={show}
        onMouseLeave={scheduleHide}
      >
        +{hiddenCount} mais
      </span>
      {popover}
    </>
  )
}
