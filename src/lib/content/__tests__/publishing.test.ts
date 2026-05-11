import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const fromMock = vi.fn()
vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: () => ({ from: fromMock }),
  __resetServiceClient: vi.fn(),
}))

const withFreshMock = vi.fn()
vi.mock('@/lib/credentials/with-fresh', () => ({
  withFreshCredential: withFreshMock,
}))

beforeEach(() => {
  fromMock.mockReset()
  withFreshMock.mockReset()
  vi.stubEnv('PINTEREST_BOARD_ID', 'board-123')
})
afterEach(() => {
  vi.unstubAllEnvs()
})

function setQueuePick(rows: unknown[]) {
  const limit = vi.fn().mockResolvedValue({ data: rows, error: null })
  const order = vi.fn(() => ({ limit }))
  const lte = vi.fn(() => ({ order }))
  const eq = vi.fn(() => ({ lte }))
  const select = vi.fn(() => ({ eq }))
  fromMock.mockImplementationOnce((table: string) => {
    if (table !== 'publishing_queue') throw new Error(`expected publishing_queue, got ${table}`)
    return { select }
  })
}

/**
 * drainPublishingQueue calls `client.from()` four times (once for the pick
 * select, then three times to cache the publishing_queue / content_renditions
 * / published_posts table handles). All later writes flow through those
 * cached handles, so one publishing_queue.update mock has to absorb both
 * the running and final updates.
 */
function setTablesForOneItem() {
  const queueUpdateEq = vi.fn().mockResolvedValue({ error: null })
  const queueUpdate = vi.fn(() => ({ eq: queueUpdateEq }))
  fromMock.mockImplementationOnce(() => ({ update: queueUpdate }))
  const renditionEq = vi.fn().mockResolvedValue({ error: null })
  const renditionUpdate = vi.fn(() => ({ eq: renditionEq }))
  fromMock.mockImplementationOnce(() => ({ update: renditionUpdate }))
  const postsInsert = vi.fn().mockResolvedValue({ error: null })
  fromMock.mockImplementationOnce(() => ({ insert: postsInsert }))
  return { queueUpdate, renditionUpdate, postsInsert }
}

function setTablesForFailedItem() {
  const queueUpdateEq = vi.fn().mockResolvedValue({ error: null })
  const queueUpdate = vi.fn(() => ({ eq: queueUpdateEq }))
  fromMock.mockImplementationOnce(() => ({ update: queueUpdate }))
  const renditionEq = vi.fn().mockResolvedValue({ error: null })
  const renditionUpdate = vi.fn(() => ({ eq: renditionEq }))
  fromMock.mockImplementationOnce(() => ({ update: renditionUpdate }))
  fromMock.mockImplementationOnce(() => ({ insert: vi.fn() }))
  return { queueUpdate, renditionUpdate }
}

const baseRendition = {
  id: 'r-1', atom_id: 'a-1', copy: 'caption', image_prompt: null, image_url: 'https://i/img.jpg',
  video_url: null, schedule_at: null, status: 'approved' as const, ai_job_id: null,
  approved_by: null, approved_at: null, raw_payload: null,
  created_at: '2026-05-11', updated_at: '2026-05-11',
}

describe('drainPublishingQueue', () => {
  it('publishes an instagram rendition and stamps published_posts + content_renditions', async () => {
    setQueuePick([
      {
        id: 'q-1', rendition_id: 'r-1', attempts: 0,
        content_renditions: { ...baseRendition, platform: 'instagram' },
      },
    ])
    const writes = setTablesForOneItem()
    // withFresh passes through, returning the publisher's result
    withFreshMock.mockImplementation(async (_p: string, fn: (cred: unknown) => Promise<unknown>) =>
      fn({ access_token: 'tok', account_id: 'ig-acct-1' }),
    )
    const fetchFn = vi.fn()
      // Step 1: create media container
      .mockResolvedValueOnce({
        ok: true, status: 200,
        text: () => Promise.resolve(JSON.stringify({ id: 'media-1' })),
      } as unknown as Response)
      // Step 2: publish container
      .mockResolvedValueOnce({
        ok: true, status: 200,
        text: () => Promise.resolve(JSON.stringify({ id: 'ig-post-1', permalink: 'https://ig/p/1' })),
      } as unknown as Response)

    const { drainPublishingQueue } = await import('../publishing')
    const res = await drainPublishingQueue({ fetchFn })
    expect(res.ok).toBe(true)
    if (!res.ok) return
    expect(res.drained).toBe(1)
    expect(res.published).toBe(1)
    expect(res.failed).toBe(0)

    expect(fetchFn.mock.calls[0][0]).toContain('graph.facebook.com')
    expect(fetchFn.mock.calls[0][0]).toContain('ig-acct-1/media')
    expect(fetchFn.mock.calls[1][0]).toContain('ig-acct-1/media_publish')

    const postsRow = writes.postsInsert.mock.calls[0][0] as Record<string, unknown>
    expect(postsRow.platform).toBe('instagram')
    expect(postsRow.platform_post_id).toBe('ig-post-1')
    expect(postsRow.platform_post_url).toBe('https://ig/p/1')
  })

  it('returns 0/0/0 when the queue is empty', async () => {
    setQueuePick([])
    const { drainPublishingQueue } = await import('../publishing')
    const res = await drainPublishingQueue({ fetchFn: vi.fn() })
    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.drained).toBe(0)
      expect(res.published).toBe(0)
    }
  })

  it('keeps a failed item as pending until max retries hit, then marks failed', async () => {
    setQueuePick([
      {
        id: 'q-1', rendition_id: 'r-1', attempts: 2, // one shy of maxRetries=3
        content_renditions: { ...baseRendition, platform: 'pinterest' },
      },
    ])
    const writes = setTablesForFailedItem()
    withFreshMock.mockImplementation(async (_p: string, fn: (c: unknown) => Promise<unknown>) =>
      fn({ access_token: 'tok', account_id: 'pin-1' }),
    )
    const fetchFn = vi.fn().mockResolvedValueOnce({
      ok: false, status: 500, text: () => Promise.resolve(JSON.stringify({ message: 'server error' })),
    } as unknown as Response)

    const { drainPublishingQueue } = await import('../publishing')
    const res = await drainPublishingQueue({ fetchFn, maxRetries: 3 })
    expect(res.ok).toBe(true)
    if (!res.ok) return
    expect(res.published).toBe(0)
    expect(res.failed).toBe(1)
    // queueUpdate is called twice: first to flip to running, then to mark the
    // final outcome. attempts(2)+1 >= maxRetries(3) → final status=failed.
    const finalUpdate = writes.queueUpdate.mock.calls[1][0] as Record<string, unknown>
    expect(finalUpdate.status).toBe('failed')
  })

  it('keeps status=pending when retry budget is still available', async () => {
    setQueuePick([
      {
        id: 'q-1', rendition_id: 'r-1', attempts: 0,
        content_renditions: { ...baseRendition, platform: 'pinterest' },
      },
    ])
    const writes = setTablesForFailedItem()
    withFreshMock.mockImplementation(async (_p: string, fn: (c: unknown) => Promise<unknown>) =>
      fn({ access_token: 'tok', account_id: 'pin-1' }),
    )
    const fetchFn = vi.fn().mockResolvedValueOnce({
      ok: false, status: 503, text: () => Promise.resolve(JSON.stringify({ message: 'transient' })),
    } as unknown as Response)

    const { drainPublishingQueue } = await import('../publishing')
    const res = await drainPublishingQueue({ fetchFn, maxRetries: 3 })
    expect(res.ok).toBe(true)
    if (!res.ok) return
    expect(res.published).toBe(0)
    expect(res.failed).toBe(0)
    // queueUpdate called twice (running + outcome). attempts(0)+1 < maxRetries(3)
    // → final status should stay pending so the next cron retries.
    const finalUpdate = writes.queueUpdate.mock.calls[1][0] as Record<string, unknown>
    expect(finalUpdate.status).toBe('pending')
  })
})
