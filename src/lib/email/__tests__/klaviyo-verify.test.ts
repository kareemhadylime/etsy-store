import { describe, it, expect } from 'vitest'
import { createHmac } from 'node:crypto'
import { verifyKlaviyoSignature } from '../klaviyo-verify'

const SECRET = 'whsec_klaviyo_test_secret'

function sign(body: string, secret = SECRET): string {
  return createHmac('sha256', secret).update(body, 'utf8').digest('base64')
}

describe('verifyKlaviyoSignature', () => {
  it('accepts a correctly signed body', () => {
    const body = '{"data":{"type":"event"}}'
    expect(verifyKlaviyoSignature(body, sign(body), SECRET)).toBe(true)
  })

  it('rejects a body that has been tampered with', () => {
    const body = '{"data":{"type":"event"}}'
    expect(verifyKlaviyoSignature(body + ' ', sign(body), SECRET)).toBe(false)
  })

  it('rejects an empty signature', () => {
    expect(verifyKlaviyoSignature('any', '', SECRET)).toBe(false)
    expect(verifyKlaviyoSignature('any', '   ', SECRET)).toBe(false)
    expect(verifyKlaviyoSignature('any', null, SECRET)).toBe(false)
  })

  it('rejects when signed with a different secret', () => {
    const body = 'hello'
    expect(verifyKlaviyoSignature(body, sign(body, 'other-secret'), SECRET)).toBe(false)
  })

  it('rejects malformed base64', () => {
    const body = 'hello'
    expect(verifyKlaviyoSignature(body, '!!!not-base64!!!', SECRET)).toBe(false)
  })
})
