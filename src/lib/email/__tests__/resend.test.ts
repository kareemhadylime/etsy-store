import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createElement } from 'react'

const send = vi.fn()
const ResendCtor = vi.fn(function (this: { emails: { send: typeof send } }) {
  this.emails = { send }
})

vi.mock('resend', () => ({
  Resend: ResendCtor,
}))

beforeEach(() => {
  vi.resetModules()
  send.mockReset()
  ResendCtor.mockClear()
  vi.stubEnv('RESEND_API_KEY', 'test-api-key')
  vi.stubEnv('RESEND_FROM_EMAIL', 'orders@example.com')
  vi.stubEnv('RESEND_REPLY_TO', '')
})

afterEach(() => {
  vi.unstubAllEnvs()
})

const reactNode = createElement('div', null, 'hello')

describe('sendTransactionalEmail', () => {
  it('returns ok with id when Resend succeeds', async () => {
    send.mockResolvedValueOnce({ data: { id: 'em_abc' }, error: null })
    const { sendTransactionalEmail } = await import('../resend')

    const result = await sendTransactionalEmail({
      to: 'buyer@example.com',
      subject: 'Your files',
      react: reactNode,
    })

    expect(result).toEqual({ ok: true, id: 'em_abc' })
    expect(ResendCtor).toHaveBeenCalledWith('test-api-key')
    expect(send).toHaveBeenCalledTimes(1)
    const call = send.mock.calls[0][0]
    expect(call.from).toBe('orders@example.com')
    expect(call.to).toBe('buyer@example.com')
    expect(call.subject).toBe('Your files')
    expect(call.react).toBe(reactNode)
    expect(call.replyTo).toBeUndefined()
  })

  it('caches the Resend client across calls', async () => {
    send.mockResolvedValue({ data: { id: 'em_1' }, error: null })
    const { sendTransactionalEmail } = await import('../resend')

    await sendTransactionalEmail({ to: 'a@x.com', subject: 's', react: reactNode })
    await sendTransactionalEmail({ to: 'b@x.com', subject: 's', react: reactNode })

    expect(ResendCtor).toHaveBeenCalledTimes(1)
    expect(send).toHaveBeenCalledTimes(2)
  })

  it('passes through explicit from and replyTo overrides', async () => {
    send.mockResolvedValueOnce({ data: { id: 'em_2' }, error: null })
    const { sendTransactionalEmail } = await import('../resend')

    await sendTransactionalEmail({
      to: 'buyer@example.com',
      subject: 's',
      react: reactNode,
      from: 'custom@example.com',
      replyTo: 'support@example.com',
    })

    const call = send.mock.calls[0][0]
    expect(call.from).toBe('custom@example.com')
    expect(call.replyTo).toBe('support@example.com')
  })

  it('uses RESEND_REPLY_TO when set and no override is provided', async () => {
    vi.stubEnv('RESEND_REPLY_TO', 'support@example.com')
    send.mockResolvedValueOnce({ data: { id: 'em_3' }, error: null })
    const { sendTransactionalEmail } = await import('../resend')

    await sendTransactionalEmail({ to: 'a@x.com', subject: 's', react: reactNode })

    expect(send.mock.calls[0][0].replyTo).toBe('support@example.com')
  })

  it('returns ok:false when Resend returns an error', async () => {
    send.mockResolvedValueOnce({
      data: null,
      error: { message: 'invalid api key', name: 'validation_error' },
    })
    const { sendTransactionalEmail } = await import('../resend')

    const result = await sendTransactionalEmail({
      to: 'a@x.com',
      subject: 's',
      react: reactNode,
    })

    expect(result).toEqual({ ok: false, error: 'invalid api key' })
  })

  it('returns ok:false when Resend throws', async () => {
    send.mockRejectedValueOnce(new Error('network down'))
    const { sendTransactionalEmail } = await import('../resend')

    const result = await sendTransactionalEmail({
      to: 'a@x.com',
      subject: 's',
      react: reactNode,
    })

    expect(result).toEqual({ ok: false, error: 'network down' })
  })

  it('returns ok:false when RESEND_FROM_EMAIL is missing and no from override', async () => {
    vi.stubEnv('RESEND_FROM_EMAIL', '')
    const { sendTransactionalEmail } = await import('../resend')

    const result = await sendTransactionalEmail({
      to: 'a@x.com',
      subject: 's',
      react: reactNode,
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toMatch(/RESEND_FROM_EMAIL/)
    }
    expect(send).not.toHaveBeenCalled()
  })

  it('throws when RESEND_API_KEY is missing', async () => {
    vi.stubEnv('RESEND_API_KEY', '')
    const { sendTransactionalEmail } = await import('../resend')

    const result = await sendTransactionalEmail({
      to: 'a@x.com',
      subject: 's',
      react: reactNode,
    })

    expect(result).toEqual({
      ok: false,
      error: 'RESEND_API_KEY is not set',
    })
  })
})
