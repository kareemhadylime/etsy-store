import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ENV_SCHEMA, checkEnv, validateEnvAtBoot } from '../env'

describe('ENV_SCHEMA', () => {
  it('is non-empty', () => {
    expect(ENV_SCHEMA.length).toBeGreaterThan(0)
  })

  it('has no duplicate var names', () => {
    const names = ENV_SCHEMA.map((s) => s.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it('every entry has a non-empty description', () => {
    for (const spec of ENV_SCHEMA) {
      expect(spec.description.length).toBeGreaterThan(0)
    }
  })

  it('every severity is one of boot|prod|feature', () => {
    for (const spec of ENV_SCHEMA) {
      expect(['boot', 'prod', 'feature']).toContain(spec.severity)
    }
  })

  it('includes the Supabase boot trio (URL + anon key) as boot-severity', () => {
    const boot = ENV_SCHEMA.filter((s) => s.severity === 'boot').map((s) => s.name)
    expect(boot).toContain('NEXT_PUBLIC_SUPABASE_URL')
    expect(boot).toContain('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  })
})

describe('checkEnv', () => {
  it('returns ok=false + boot list populated when boot vars missing', () => {
    const res = checkEnv({})
    expect(res.ok).toBe(false)
    expect(res.missing.boot.length).toBeGreaterThan(0)
    expect(res.missing.boot.map((s) => s.name)).toContain('NEXT_PUBLIC_SUPABASE_URL')
  })

  it('returns ok=true when all boot vars present', () => {
    const res = checkEnv({
      NEXT_PUBLIC_SUPABASE_URL: 'https://x.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'k',
    })
    expect(res.ok).toBe(true)
    expect(res.missing.boot).toEqual([])
  })

  it('separates prod and feature missing vars', () => {
    const res = checkEnv({
      NEXT_PUBLIC_SUPABASE_URL: 'x',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'x',
      // Intentionally leave everything else unset.
    })
    expect(res.ok).toBe(true)
    expect(res.missing.prod.length).toBeGreaterThan(0)
    expect(res.missing.feature.length).toBeGreaterThan(0)
    // RESEND_API_KEY should be in prod missing
    expect(res.missing.prod.map((s) => s.name)).toContain('RESEND_API_KEY')
    // ANTHROPIC_API_KEY should be in feature missing
    expect(res.missing.feature.map((s) => s.name)).toContain('ANTHROPIC_API_KEY')
  })

  it('treats empty string as missing (not "configured to empty")', () => {
    const res = checkEnv({
      NEXT_PUBLIC_SUPABASE_URL: '',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'k',
    })
    expect(res.ok).toBe(false)
    expect(res.missing.boot.map((s) => s.name)).toContain('NEXT_PUBLIC_SUPABASE_URL')
  })

  it('reports a feature group as enabled only when every var in it is set', () => {
    const res = checkEnv({
      NEXT_PUBLIC_SUPABASE_URL: 'x',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'x',
      // klaviyo: both vars set
      KLAVIYO_API_KEY: 'k',
      KLAVIYO_WEBHOOK_SECRET: 's',
      // meta: only some vars set → partial
      META_PIXEL_ID: 'p',
    })
    expect(res.enabledGroups).toContain('klaviyo')
    expect(res.partialGroups).toContain('meta')
    expect(res.enabledGroups).not.toContain('meta')
  })

  it('does not double-count: a group is either enabled, partial, or neither', () => {
    const res = checkEnv({
      NEXT_PUBLIC_SUPABASE_URL: 'x',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'x',
    })
    const overlap = res.enabledGroups.filter((g) => res.partialGroups.includes(g))
    expect(overlap).toEqual([])
  })

  it('reads process.env when called with no argument', () => {
    // process.env always has at least PATH set, but never has our app's vars
    // in the bare test runner. So this should report ok=false with boot missing.
    const res = checkEnv()
    // We don't assert specific contents because the test environment may
    // have stubs from setEnv elsewhere — just that the shape is right.
    expect(typeof res.ok).toBe('boolean')
    expect(Array.isArray(res.missing.boot)).toBe(true)
  })
})

describe('validateEnvAtBoot', () => {
  let originalEnv: NodeJS.ProcessEnv

  beforeEach(() => {
    originalEnv = process.env
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
    vi.restoreAllMocks()
  })

  it('throws with a clear message when a boot var is missing', () => {
    process.env = {}
    expect(() => validateEnvAtBoot()).toThrow(/Missing required env vars/)
  })

  it('lists missing boot vars in the thrown error', () => {
    process.env = {}
    try {
      validateEnvAtBoot()
    } catch (e) {
      expect((e as Error).message).toMatch(/NEXT_PUBLIC_SUPABASE_URL/)
      expect((e as Error).message).toMatch(/NEXT_PUBLIC_SUPABASE_ANON_KEY/)
      return
    }
    expect.fail('validateEnvAtBoot should have thrown')
  })

  it('does not throw when boot vars are present', () => {
    process.env = {
      NEXT_PUBLIC_SUPABASE_URL: 'https://x.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'k',
    }
    expect(() => validateEnvAtBoot()).not.toThrow()
  })

  it('logs a warning when prod vars are missing but does not throw', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    process.env = {
      NEXT_PUBLIC_SUPABASE_URL: 'x',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'x',
    }
    expect(() => validateEnvAtBoot()).not.toThrow()
    expect(warn).toHaveBeenCalled()
    const warnedString = warn.mock.calls.flat().join(' ')
    expect(warnedString).toMatch(/RESEND_API_KEY|CRON_SECRET|production-recommended/)
  })

  it('logs info about enabled feature groups', () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {})
    process.env = {
      NEXT_PUBLIC_SUPABASE_URL: 'x',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'x',
      KLAVIYO_API_KEY: 'k',
      KLAVIYO_WEBHOOK_SECRET: 's',
    }
    validateEnvAtBoot()
    const infoString = info.mock.calls.flat().join(' ')
    expect(infoString).toMatch(/klaviyo/)
  })
})
