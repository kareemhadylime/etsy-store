import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/require-admin'
import {
  createProduct,
  createProductSchema,
  listProducts,
  type ListProductsParams,
} from '@/lib/admin/products'

export const dynamic = 'force-dynamic'

const listQuerySchema = z.object({
  status: z.enum(['draft', 'live']).optional(),
  type: z.enum(['spreadsheet', 'app']).optional(),
  search: z.string().max(200).optional(),
  limit: z.coerce.number().int().min(1).max(200).optional(),
  offset: z.coerce.number().int().min(0).optional(),
})

export async function GET(req: NextRequest) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response

  const sp = req.nextUrl.searchParams
  const parsed = listQuerySchema.safeParse({
    status: sp.get('status') ?? undefined,
    type: sp.get('type') ?? undefined,
    search: sp.get('search') ?? undefined,
    limit: sp.get('limit') ?? undefined,
    offset: sp.get('offset') ?? undefined,
  })
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'invalid query', issues: parsed.error.issues },
      { status: 400 },
    )
  }

  const result = await listProducts(parsed.data as ListProductsParams)
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 500 })
  }
  return NextResponse.json({
    ok: true,
    data: result.data,
    total: result.total,
    limit: parsed.data.limit ?? 50,
    offset: parsed.data.offset ?? 0,
  })
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 })
  }

  const parsed = createProductSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'invalid body', issues: parsed.error.issues },
      { status: 400 },
    )
  }

  const result = await createProduct(parsed.data)
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: result.status })
  }
  return NextResponse.json({ ok: true, data: result.data }, { status: 201 })
}
