import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { EvaluationAgeInput } from '../components/backoffice/EvaluationAgeInput'
import { emptyEvaluationAgeFields } from './chronologicalAge'

describe('EvaluationAgeInput', () => {
  it('calculates years and months from birth and evaluation dates', () => {
    const onChange = vi.fn()

    render(
      <EvaluationAgeInput
        value={{
          ...emptyEvaluationAgeFields(),
          ageInputMode: 'dates',
          birthDate: '2015-03-10',
        }}
        onChange={onChange}
      />,
    )

    fireEvent.change(screen.getByLabelText('Data da avaliação'), {
      target: { value: '2025-09-10' },
    })

    expect(onChange).toHaveBeenCalledWith({
      ageInputMode: 'dates',
      birthDate: '2015-03-10',
      evaluationDate: '2025-09-10',
      ageYears: '10',
      ageMonths: '6',
    })
  })

  it('switches from years and months to dates and prefills birth date', () => {
    const onChange = vi.fn()

    render(
      <EvaluationAgeInput
        value={{ ...emptyEvaluationAgeFields(), ageYears: '8', ageMonths: '2' }}
        defaultBirthDate="2016-01-15"
        onChange={onChange}
      />,
    )

    fireEvent.change(screen.getByLabelText('Como indicar a idade'), {
      target: { value: 'dates' },
    })

    expect(onChange).toHaveBeenCalledWith({
      ageInputMode: 'dates',
      birthDate: '2016-01-15',
      evaluationDate: '',
      ageYears: '8',
      ageMonths: '2',
    })
  })
})
