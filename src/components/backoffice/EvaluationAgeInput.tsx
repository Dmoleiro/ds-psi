import type { ReactNode } from 'react'
import {
  AGE_INPUT_MODES,
  chronologicalAgeYearsMonths,
  isEvaluationBeforeBirth,
  resolveEvaluationAge,
  type AgeInputMode,
  type EvaluationAgeFields,
} from '../../lib/chronologicalAge'
import styles from './PatientEvaluationsPanel.module.css'

type Props = {
  value: EvaluationAgeFields
  readOnly?: boolean
  defaultBirthDate?: string
  yearsPlaceholder?: string
  monthsPlaceholder?: string
  extra?: ReactNode
  onChange: (next: EvaluationAgeFields) => void
}

export function EvaluationAgeInput({
  value,
  readOnly = false,
  defaultBirthDate = '',
  yearsPlaceholder = 'anos',
  monthsPlaceholder = '0–11',
  extra,
  onChange,
}: Props) {
  const age = resolveEvaluationAge(value)
  const calculated = chronologicalAgeYearsMonths(age.birthDate, age.evaluationDate)
  const dateOrderError = isEvaluationBeforeBirth(age.birthDate, age.evaluationDate)
  const datesIncomplete =
    age.ageInputMode === 'dates' && (!age.birthDate || !age.evaluationDate) && !dateOrderError

  function commit(patch: Partial<EvaluationAgeFields>) {
    onChange(resolveEvaluationAge({ ...value, ...patch }))
  }

  function changeMode(mode: AgeInputMode) {
    commit({
      ageInputMode: mode,
      birthDate:
        mode === 'dates' && !value.birthDate && defaultBirthDate
          ? defaultBirthDate
          : value.birthDate,
    })
  }

  return (
    <div className={styles.ageFieldsStack}>
      <label className={styles.ageField}>
        <span>Como indicar a idade</span>
        <select
          className={`${styles.tableInput} ${styles.ageModeSelect}`}
          value={age.ageInputMode}
          disabled={readOnly}
          aria-label="Como indicar a idade"
          onChange={(event) => changeMode(event.target.value as AgeInputMode)}
        >
          {AGE_INPUT_MODES.map((mode) => (
            <option key={mode.value} value={mode.value}>
              {mode.label}
            </option>
          ))}
        </select>
      </label>

      {age.ageInputMode === 'dates' ? (
        <>
          <div className={styles.ageDatesRow}>
            <label className={styles.ageField}>
              <span>Data de nascimento</span>
              <input
                className={`${styles.tableInput} ${styles.ageDateInput}`}
                type="date"
                value={age.birthDate}
                disabled={readOnly}
                aria-label="Data de nascimento"
                onChange={(event) => commit({ birthDate: event.target.value })}
              />
            </label>
            <label className={styles.ageField}>
              <span>Data da avaliação</span>
              <input
                className={`${styles.tableInput} ${styles.ageDateInput}`}
                type="date"
                value={age.evaluationDate}
                disabled={readOnly}
                aria-label="Data da avaliação"
                onChange={(event) => commit({ evaluationDate: event.target.value })}
              />
            </label>
            {extra}
          </div>
          {dateOrderError ? (
            <p className={styles.ageDateError}>
              A data da avaliação tem de ser igual ou posterior à data de nascimento.
            </p>
          ) : null}
          {datesIncomplete && !readOnly ? (
            <p className={styles.ageCalculated}>
              Indique as duas datas para calcular a idade em anos e meses.
            </p>
          ) : null}
          {calculated ? (
            <p className={styles.ageCalculated}>
              Idade na avaliação: {calculated.years} anos e {calculated.months} meses
            </p>
          ) : null}
        </>
      ) : (
        <div className={styles.ageDatesRow}>
          <label className={styles.ageField}>
            <span>Idade na avaliação</span>
            <span className={styles.ageInputs}>
              <input
                className={styles.tableInput}
                inputMode="numeric"
                placeholder={yearsPlaceholder}
                value={age.ageYears}
                disabled={readOnly}
                aria-label="Idade em anos"
                onChange={(event) => commit({ ageYears: event.target.value })}
              />
              <span>anos</span>
              <input
                className={styles.tableInput}
                inputMode="numeric"
                placeholder={monthsPlaceholder}
                value={age.ageMonths}
                disabled={readOnly}
                aria-label="Idade em meses"
                onChange={(event) => commit({ ageMonths: event.target.value })}
              />
              <span>meses</span>
            </span>
          </label>
          {extra}
        </div>
      )}
    </div>
  )
}
