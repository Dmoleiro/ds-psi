import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react'

const CLICKS_REQUIRED = 4
const CLICK_WINDOW_MS = 2500

let unlocked = false
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function notify() {
  listeners.forEach((listener) => listener())
}

export function isEasterEggUnlocked(): boolean {
  return unlocked
}

export function toggleEasterEgg(): boolean {
  unlocked = !unlocked
  notify()
  return unlocked
}

export function useEasterEggUnlocked(): boolean {
  return useSyncExternalStore(subscribe, isEasterEggUnlocked, () => false)
}

export function useDirectorPortraitEasterEgg() {
  const clicksRef = useRef(0)
  const timeoutRef = useRef<number>()

  const handleClick = useCallback(() => {
    clicksRef.current += 1
    window.clearTimeout(timeoutRef.current)

    if (clicksRef.current >= CLICKS_REQUIRED) {
      clicksRef.current = 0
      toggleEasterEgg()
      return
    }

    timeoutRef.current = window.setTimeout(() => {
      clicksRef.current = 0
    }, CLICK_WINDOW_MS)
  }, [])

  useEffect(() => {
    return () => window.clearTimeout(timeoutRef.current)
  }, [])

  return handleClick
}
