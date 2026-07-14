import { useCallback, useEffect, useRef, useState } from 'react'

const IDLE_MS = 60_000

export function useEditLock() {
  const [unlocked, setUnlocked] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const lock = useCallback(() => {
    setUnlocked(false)
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const unlock = useCallback(() => {
    setUnlocked(true)
  }, [])

  const toggle = useCallback(() => {
    setUnlocked((current) => !current)
  }, [])

  const resetIdleTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setUnlocked(false), IDLE_MS)
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (!unlocked) return

    resetIdleTimer()
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll', 'click'] as const
    const onActivity = () => resetIdleTimer()
    events.forEach((event) => window.addEventListener(event, onActivity, { passive: true }))
    return () => events.forEach((event) => window.removeEventListener(event, onActivity))
  }, [unlocked, resetIdleTimer])

  return { unlocked, lock, unlock, toggle }
}
