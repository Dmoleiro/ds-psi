import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  getPiccaInteractiveFormDefaults,
  hasPiccaInteractiveFormRenderer,
  piccaInteractiveFormRegistry,
} from '../../components/picca/interactive/interactiveFormRegistry'
import { Container } from '../../components/layout/Container'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ApiError, piccaInteractivePatientApi } from '../../lib/api'
import { isDailyPiccaInteractiveKind, isPortageAssessmentKind } from '../../lib/piccaInteractiveKinds'
import type { PiccaInteractiveFormKind } from '../../lib/piccaInteractiveKinds'
import { formatDayLabelShort, getWeekDates } from '../../lib/piccaInteractiveWeek'
import { usePiccaInteractiveAutosave } from '../../hooks/usePiccaInteractiveAutosave'
import formStyles from '../../components/picca/interactive/PiccaInteractiveForm.module.css'
import styles from './PatientPortal.module.css'

export function PiccaInteractiveFormPage() {
  const { token, formId } = useParams<{ token: string; formId: string }>()
  const [title, setTitle] = useState('')
  const [kind, setKind] = useState<PiccaInteractiveFormKind>('daily_sono')
  const [periodKey, setPeriodKey] = useState('')
  const [weekStart, setWeekStart] = useState('')
  const [today, setToday] = useState('')
  const [readOnly, setReadOnly] = useState(false)
  const [values, setValues] = useState<Record<string, unknown>>({})
  const [weekEntryKeys, setWeekEntryKeys] = useState<Set<string>>(new Set())
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const hasRenderer = formId ? hasPiccaInteractiveFormRenderer(formId) : false
  const isSono = isDailyPiccaInteractiveKind(kind)
  const isPortage = isPortageAssessmentKind(kind)

  const weekDates = useMemo(() => (weekStart ? getWeekDates(weekStart) : []), [weekStart])

  useEffect(() => {
    if (!token || !formId) return
    const activeFormId = formId
    const activeToken = token

    async function load() {
      setLoading(true)
      setError('')
      try {
        const session = await piccaInteractivePatientApi.getSession(activeToken)
        setToday(session.session.today)

        const formKind = piccaInteractiveFormRegistry[activeFormId]?.kind
        if (formKind && isDailyPiccaInteractiveKind(formKind)) {
          const targetDay = session.session.today
          const [formData, weekData] = await Promise.all([
            piccaInteractivePatientApi.getForm(activeToken, activeFormId, targetDay),
            piccaInteractivePatientApi.getWeekEntries(
              activeToken,
              activeFormId,
              session.session.currentWeekStart,
            ),
          ])
          setTitle(formData.form.title)
          setKind(formData.form.kind)
          setPeriodKey(formData.form.periodKey)
          setWeekStart(formData.form.weekStart)
          setReadOnly(formData.form.readOnly)
          setValues({
            ...getPiccaInteractiveFormDefaults(activeFormId),
            ...formData.form.answers,
          })
          setWeekEntryKeys(new Set(weekData.entries.map((entry) => entry.periodKey)))
        } else {
          const formData = await piccaInteractivePatientApi.getForm(activeToken, activeFormId)
          setTitle(formData.form.title)
          setKind(formData.form.kind)
          setPeriodKey(formData.form.periodKey)
          setWeekStart(formData.form.weekStart)
          setReadOnly(formData.form.readOnly)
          setValues({
            ...getPiccaInteractiveFormDefaults(activeFormId),
            ...formData.form.answers,
          })
        }
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Não foi possível carregar o formulário')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [token, formId])

  usePiccaInteractiveAutosave(
    token ?? '',
    formId ?? '',
    periodKey,
    values,
    Boolean(hasRenderer && !readOnly && token && formId && periodKey),
  )

  async function loadSonoDay(day: string) {
    if (!token || !formId) return
    setLoading(true)
    setError('')
    try {
      const formData = await piccaInteractivePatientApi.getForm(token, formId, day)
      setPeriodKey(formData.form.periodKey)
      setReadOnly(formData.form.readOnly)
      setValues({
        ...getPiccaInteractiveFormDefaults(formId),
        ...formData.form.answers,
      })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível carregar o dia')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!token || !formId || !periodKey || readOnly) return
    setSaving(true)
    setError('')
    try {
      await piccaInteractivePatientApi.saveEntry(token, formId, periodKey, values)
      if (isSono) {
        setWeekEntryKeys((current) => new Set([...current, periodKey]))
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível guardar')
    } finally {
      setSaving(false)
    }
  }

  if (loading && !title) {
    return (
      <Container className={styles.page}>
        <p>A carregar…</p>
      </Container>
    )
  }

  const FormComponent = formId ? piccaInteractiveFormRegistry[formId]?.Form : undefined

  return (
    <Container className={styles.page}>
      <p className={styles.back}>
        <Link to={`/formularios/picca-interativo/${token}`}>← Voltar aos registos</Link>
      </p>
      <h1>{title}</h1>
      {!readOnly && hasRenderer && (
        <p className={styles.intro}>
          {isPortage
            ? 'Pode guardar o progresso da avaliação a qualquer momento — o registo mantém-se editável enquanto o link estiver ativo.'
            : 'O progresso é guardado automaticamente a cada poucos segundos.'}
        </p>
      )}
      {readOnly && (
        <p className={styles.intro}>Este registo já não pode ser alterado — consulta apenas.</p>
      )}
      {error && <p className={styles.error}>{error}</p>}

      {isSono && weekDates.length > 0 && (
        <Card className={styles.formCard}>
          <p className={styles.formDescription}>Semana corrente — selecione o dia:</p>
          <div className={formStyles.weekList}>
            {weekDates.map((day) => (
              <button
                key={day}
                type="button"
                className={`${formStyles.weekDayButton} ${day === periodKey ? formStyles.weekDayButtonActive : ''} ${weekEntryKeys.has(day) ? formStyles.weekDayButtonFilled : ''}`}
                onClick={() => loadSonoDay(day)}
              >
                {formatDayLabelShort(day)}
                {day === today ? ' (hoje)' : ''}
              </button>
            ))}
          </div>
        </Card>
      )}

      {FormComponent ? (
        <form
          onSubmit={(event) => {
            event.preventDefault()
            void handleSave()
          }}
        >
          <FormComponent value={values} onChange={setValues} readOnly={readOnly} />
          {!readOnly && (
            <div style={{ marginTop: 'var(--space-lg)' }}>
              <Button type="submit" disabled={saving}>
                {saving ? 'A guardar…' : 'Guardar registo'}
              </Button>
            </div>
          )}
        </form>
      ) : (
        <Card>
          <p>Este formulário ainda não está disponível.</p>
        </Card>
      )}
    </Container>
  )
}
