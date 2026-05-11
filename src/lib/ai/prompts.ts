import { createServiceClient } from '@/lib/supabase/service'
import type { AiJobType, PromptTemplate } from '@/lib/supabase/types'

type AnyClient = ReturnType<typeof createServiceClient>

function asTable<T>(client: AnyClient, name: string): T {
  return client.from(name) as unknown as T
}

/**
 * Substitute `{{var}}` tokens in `template` with values from `vars`. Unknown
 * tokens are left as the literal `{{var}}` so the prompt still renders
 * (and the model can flag the gap) rather than silently dropping data.
 */
export function renderTemplate(template: string, vars: Record<string, unknown>): string {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key: string) => {
    const value = vars[key]
    if (value === undefined || value === null) return match
    return String(value)
  })
}

export async function loadActivePromptTemplate(
  type: AiJobType,
  client: AnyClient = createServiceClient(),
): Promise<{ ok: true; template: PromptTemplate } | { ok: false; error: string }> {
  const res = await asTable<{
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        eq: (col: string, val: boolean) => {
          order: (col: string, opts: { ascending: boolean }) => {
            limit: (n: number) => Promise<{ data: PromptTemplate[] | null; error: { message: string } | null }>
          }
        }
      }
    }
  }>(client, 'prompt_templates')
    .select('*')
    .eq('type', type)
    .eq('active', true)
    .order('version', { ascending: false })
    .limit(1)
  if (res.error) return { ok: false, error: res.error.message }
  const row = res.data?.[0]
  if (!row) return { ok: false, error: `no active prompt template for type=${type}` }
  return { ok: true, template: row }
}
