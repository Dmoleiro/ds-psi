import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12

function getEncryptionKey(): Buffer {
  const raw = process.env.GOOGLE_TOKEN_ENCRYPTION_KEY ?? process.env.JWT_SECRET ?? 'dev-only-change-in-production'
  return createHash('sha256').update(raw).digest()
}

export function encryptSecret(value: string): string {
  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv(ALGORITHM, getEncryptionKey(), iv)
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return Buffer.concat([iv, tag, encrypted]).toString('base64url')
}

export function decryptSecret(payload: string): string {
  const buffer = Buffer.from(payload, 'base64url')
  const iv = buffer.subarray(0, IV_LENGTH)
  const tag = buffer.subarray(IV_LENGTH, IV_LENGTH + 16)
  const encrypted = buffer.subarray(IV_LENGTH + 16)
  const decipher = createDecipheriv(ALGORITHM, getEncryptionKey(), iv)
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8')
}
