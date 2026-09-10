import { FormStatus } from '@prisma/client'
import { describe, expect, it } from 'vitest'

function canPatientFinalize(
  modules: Array<{ therapistOnly: boolean; status: FormStatus }>,
  locked: boolean,
) {
  const patientModules = modules.filter((module) => !module.therapistOnly)
  const allSubmitted =
    patientModules.length > 0 &&
    patientModules.every((module) => module.status === FormStatus.submitted)
  return allSubmitted && !locked
}

describe('picca patient finalize guard', () => {
  it('does not allow finalize when there are no family modules', () => {
    expect(
      canPatientFinalize(
        [{ therapistOnly: true, status: FormStatus.not_started }],
        false,
      ),
    ).toBe(false)
  })

  it('allows finalize only when every family module is submitted', () => {
    expect(
      canPatientFinalize(
        [
          { therapistOnly: false, status: FormStatus.submitted },
          { therapistOnly: true, status: FormStatus.not_started },
        ],
        false,
      ),
    ).toBe(true)
  })
})
