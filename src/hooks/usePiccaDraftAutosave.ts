import { useEffect, useRef } from 'react'
import { piccaPatientApi } from '../lib/api'

export function usePiccaDraftAutosave(
  token: string,
  moduleId: string,
  answers: Record<string, unknown>,
  enabled: boolean,
) {
  const answersRef = useRef(answers)
  answersRef.current = answers

  useEffect(() => {
    if (!enabled || !token || !moduleId) return

    const timer = window.setTimeout(async () => {
      try {
        await piccaPatientApi.saveDraft(token, moduleId, answersRef.current)
      } catch {
        // silent autosave failure
      }
    }, 3000)

    return () => window.clearTimeout(timer)
  }, [answers, enabled, moduleId, token])
}
