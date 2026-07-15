import { SessionStatus } from '@prisma/client'
import { describe, expect, it } from 'vitest'
import { getAccessibleSessionUrl } from './sessions.js'

describe('getAccessibleSessionUrl', () => {
  it('returns url for active sessions with a stored token', () => {
    const url = getAccessibleSessionUrl({
      status: SessionStatus.in_progress,
      patientToken: 'abc123',
      expiresAt: null,
    })

    expect(url).toContain('/formularios/p/abc123')
  })

  it('returns null for completed or revoked sessions', () => {
    expect(
      getAccessibleSessionUrl({
        status: SessionStatus.completed,
        patientToken: 'abc123',
        expiresAt: null,
      }),
    ).toBeNull()
  })
})
