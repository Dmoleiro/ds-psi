import { createHash, randomBytes } from 'node:crypto'

export function generatePatientToken(): string {
  return randomBytes(32).toString('base64url')
}

export function hashPatientToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export function buildPatientUrl(token: string, frontendUrl: string): string {
  const base = frontendUrl.replace(/\/$/, '')
  return `${base}/formularios/p/${token}`
}
