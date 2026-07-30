import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { PatientSummary } from '../../lib/api'
import { matchesPatientSearch, patientContactHint } from '../../lib/patientSearch'
import styles from './PatientSearchPicker.module.css'

type PatientSearchPickerProps = {
  id: string
  patients: PatientSummary[]
  value: string
  onChange: (patientId: string) => void
  disabled?: boolean
  placeholder?: string
}

export function PatientSearchPicker({
  id,
  patients,
  value,
  onChange,
  disabled = false,
  placeholder = 'Pesquisar por nome, email ou telefone…',
}: PatientSearchPickerProps) {
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const selectedPatient = patients.find((patient) => patient.id === value)

  const filteredPatients = useMemo(
    () => patients.filter((patient) => matchesPatientSearch(patient, query)),
    [patients, query],
  )

  useEffect(() => {
    if (open) return
    setQuery(selectedPatient?.fullName ?? '')
  }, [open, selectedPatient])

  useEffect(() => {
    setActiveIndex(0)
  }, [query, patients])

  function closeList(restoreSelection = true) {
    setOpen(false)
    if (restoreSelection) {
      setQuery(selectedPatient?.fullName ?? '')
    }
  }

  function selectPatient(patientId: string) {
    onChange(patientId)
    const patient = patients.find((entry) => entry.id === patientId)
    setQuery(patient?.fullName ?? '')
    setOpen(false)
  }

  function handleInputChange(nextQuery: string) {
    setQuery(nextQuery)
    setOpen(true)
    if (value) onChange('')
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      setOpen(true)
      return
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      closeList()
      return
    }

    if (!open || filteredPatients.length === 0) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((current) => (current + 1) % filteredPatients.length)
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((current) => (current - 1 + filteredPatients.length) % filteredPatients.length)
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      const patient = filteredPatients[activeIndex]
      if (patient) selectPatient(patient.id)
    }
  }

  function handleBlur() {
    window.setTimeout(() => {
      if (!rootRef.current?.contains(document.activeElement)) {
        closeList()
      }
    }, 0)
  }

  return (
    <div ref={rootRef} className={styles.root}>
      <input
        id={id}
        type="search"
        className={`${styles.input} ${open ? styles.inputOpen : ''}`.trim()}
        value={query}
        onChange={(event) => handleInputChange(event.target.value)}
        onFocus={() => !disabled && setOpen(true)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={
          open && filteredPatients[activeIndex]
            ? `${id}-option-${filteredPatients[activeIndex].id}`
            : undefined
        }
        autoComplete="off"
      />
      {open && !disabled && (
        <ul id={listId} className={styles.listbox} role="listbox">
          {filteredPatients.length === 0 ? (
            <li className={styles.empty} role="presentation">
              Nenhum paciente encontrado.
            </li>
          ) : (
            filteredPatients.map((patient, index) => {
              const hint = patientContactHint(patient)
              return (
                <li
                  key={patient.id}
                  id={`${id}-option-${patient.id}`}
                  role="option"
                  aria-selected={patient.id === value}
                  className={`${styles.option} ${index === activeIndex ? styles.optionActive : ''}`.trim()}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectPatient(patient.id)}
                >
                  <span className={styles.optionName}>{patient.fullName}</span>
                  {hint && <span className={styles.optionHint}>{hint}</span>}
                </li>
              )
            })
          )}
        </ul>
      )}
    </div>
  )
}
