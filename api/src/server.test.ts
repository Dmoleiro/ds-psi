import { describe, expect, it } from 'vitest'
import { buildApp } from './server.js'

describe('API', () => {
  it('responds to health check', async () => {
    const app = await buildApp()
    const response = await app.inject({ method: 'GET', url: '/api/health' })
    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({ ok: true })
    await app.close()
  })
})
