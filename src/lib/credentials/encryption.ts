import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'
import { env } from '@/lib/env'

/**
 * AES-256-GCM encryption for platform credentials.
 *
 * Storage format: `${iv_hex}:${ciphertext_hex}:${authTag_hex}` (3 colon-
 * separated hex blobs). Each token gets a fresh 12-byte IV. The auth tag
 * protects against ciphertext tampering.
 *
 * Key: 32 bytes (256 bits). Sourced from `CREDENTIALS_ENCRYPTION_KEY` env
 * var, hex-encoded (so 64 hex chars). A separate key from the Supabase
 * service-role key, deliberately: defence-in-depth against service-role
 * key leakage.
 */

const ALGORITHM = 'aes-256-gcm'
const IV_BYTES = 12
const KEY_BYTES = 32

let cachedKey: Buffer | null = null

export class CredentialEncryptionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CredentialEncryptionError'
  }
}

export function __resetEncryptionKeyCache(): void {
  cachedKey = null
}

function loadKey(): Buffer {
  if (cachedKey) return cachedKey
  const raw = env('CREDENTIALS_ENCRYPTION_KEY')
  if (!raw) {
    throw new CredentialEncryptionError('CREDENTIALS_ENCRYPTION_KEY env var is not set')
  }
  let buf: Buffer
  try {
    buf = Buffer.from(raw, 'hex')
  } catch {
    throw new CredentialEncryptionError('CREDENTIALS_ENCRYPTION_KEY is not valid hex')
  }
  if (buf.length !== KEY_BYTES) {
    throw new CredentialEncryptionError(
      `CREDENTIALS_ENCRYPTION_KEY must decode to ${KEY_BYTES} bytes (got ${buf.length})`,
    )
  }
  cachedKey = buf
  return buf
}

/** Encrypt a UTF-8 string. Returns the iv:ct:tag storage format. */
export function encryptToken(plaintext: string): string {
  const key = loadKey()
  const iv = randomBytes(IV_BYTES)
  const cipher = createCipheriv(ALGORITHM, key, iv)
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  return `${iv.toString('hex')}:${ciphertext.toString('hex')}:${authTag.toString('hex')}`
}

/** Decrypt a previously-encrypted iv:ct:tag blob back to its UTF-8 plaintext. */
export function decryptToken(blob: string): string {
  const key = loadKey()
  const parts = blob.split(':')
  if (parts.length !== 3) {
    throw new CredentialEncryptionError('expected iv:ct:tag format')
  }
  const [ivHex, ctHex, tagHex] = parts
  let iv: Buffer
  let ct: Buffer
  let tag: Buffer
  try {
    iv = Buffer.from(ivHex, 'hex')
    ct = Buffer.from(ctHex, 'hex')
    tag = Buffer.from(tagHex, 'hex')
  } catch {
    throw new CredentialEncryptionError('non-hex component in encrypted blob')
  }
  if (iv.length !== IV_BYTES) {
    throw new CredentialEncryptionError(`expected ${IV_BYTES}-byte IV (got ${iv.length})`)
  }
  const decipher = createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(tag)
  try {
    return Buffer.concat([decipher.update(ct), decipher.final()]).toString('utf8')
  } catch {
    throw new CredentialEncryptionError('decryption failed (tampered ciphertext or wrong key)')
  }
}

/** Convenience for tests / one-off CLI: generate a fresh hex-encoded 32-byte key. */
export function generateKeyHex(): string {
  return randomBytes(KEY_BYTES).toString('hex')
}
