import { useEffect, useRef } from 'react'
import { piccaInteractivePatientApi } from '../lib/api'

export function usePiccaInteractiveAutosave(
  token: string,
  formId: string,
  periodKey: string,
  answers: Record<string, unknown>,
  enabled: boolean,
) {
  const answersRef = useRef(answers)
  answersRef.current = answers

  useEffect(() => {
    if (!enabled || !token || !formId || !periodKey) return

    const timer = window.setTimeout(async () => {
      try {
        await piccaInteractivePatientApi.saveEntry(token, formId, periodKey, answersRef.current)
      } catch {
        // silent autosave failure
      }
    }, 3000)

    return () => window.clearTimeout(timer)
  }, [answers, enabled, formId, periodKey, token])
}
