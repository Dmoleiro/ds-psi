import { useEffect, useRef } from 'react'
import { patientApi } from '../lib/api'

export function useDraftAutosave(
  token: string,
  formId: string,
  answers: Record<string, unknown>,
  enabled: boolean,
) {
  const answersRef = useRef(answers)
  answersRef.current = answers

  useEffect(() => {
    if (!enabled || !token || !formId) return

    const timer = window.setTimeout(async () => {
      try {
        await patientApi.saveDraft(token, formId, answersRef.current)
      } catch {
        // silent autosave failure; user can still submit manually
      }
    }, 3000)

    return () => window.clearTimeout(timer)
  }, [answers, enabled, formId, token])
}
