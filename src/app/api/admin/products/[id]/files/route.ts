import { type NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/require-admin'
import {
  listProductFiles,
  productFileMetaSchema,
  uploadProductFile,
} from '@/lib/admin/product-files'

export const dynamic = 'force-dynamic'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, ctx: Ctx) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response
  const { id } = await ctx.params

  const result = await listProductFiles(id)
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 500 })
  }
  return NextResponse.json({ ok: true, data: result.data })
}

export async function POST(req: NextRequest, ctx: Ctx) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response
  const { id } = await ctx.params

  const contentType = req.headers.get('content-type') ?? ''
  if (!contentType.includes('multipart/form-data')) {
    return NextResponse.json(
      { ok: false, error: 'expected multipart/form-data' },
      { status: 415 },
    )
  }

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid form data' }, { status: 400 })
  }

  const file = form.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: 'missing file' }, { status: 400 })
  }

  const meta = productFileMetaSchema.safeParse({
    tier: form.get('tier'),
    format: form.get('format'),
    label: form.get('label'),
    version: form.get('version') ?? undefined,
  })
  if (!meta.success) {
    return NextResponse.json(
      { ok: false, error: 'invalid metadata', issues: meta.error.issues },
      { status: 400 },
    )
  }

  const result = await uploadProductFile({
    productId: id,
    meta: meta.data,
    file: {
      arrayBuffer: () => file.arrayBuffer(),
      name: file.name,
      type: file.type,
      size: file.size,
    },
  })
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: result.status })
  }
  return NextResponse.json(
    { ok: true, data: result.file, storage_path: result.storagePath },
    { status: 201 },
  )
}
