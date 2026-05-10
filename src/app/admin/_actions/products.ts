'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/require-admin'
import {
  createProduct,
  createProductSchema,
  deleteProduct,
  updateProduct,
  updateProductSchema,
  type CreateProductInput,
  type UpdateProductInput,
} from '@/lib/admin/products'
import {
  productFileMetaSchema,
  uploadProductFile,
} from '@/lib/admin/product-files'
import { syncProductToEtsy } from '@/lib/etsy/api'

export type FieldErrors = Record<string, string[]>

export type FormState =
  | { status: 'idle' }
  | { status: 'error'; message: string; fieldErrors?: FieldErrors }
  | { status: 'success'; message?: string; id?: string }

const ADMIN_PRODUCTS = '/admin/products'

async function assertAdmin(): Promise<FormState | null> {
  const auth = await requireAdmin()
  if (!auth.ok) {
    return { status: 'error', message: 'You must be signed in to perform that action.' }
  }
  return null
}

function nullableString(value: FormDataEntryValue | null): string | null {
  if (value === null) return null
  const trimmed = value.toString().trim()
  return trimmed.length === 0 ? null : trimmed
}

function nullableNumber(value: FormDataEntryValue | null): number | null {
  if (value === null) return null
  const raw = value.toString().trim()
  if (raw.length === 0) return null
  const n = Number(raw)
  return Number.isFinite(n) ? n : NaN
}

function parseProductForm(formData: FormData): { input: CreateProductInput | UpdateProductInput; raw: Record<string, unknown> } {
  const raw: Record<string, unknown> = {
    name: nullableString(formData.get('name')) ?? undefined,
    slug: nullableString(formData.get('slug')) ?? undefined,
    description: nullableString(formData.get('description')),
    price: nullableNumber(formData.get('price')) ?? undefined,
    price_essentials: nullableNumber(formData.get('price_essentials')),
    price_pro: nullableNumber(formData.get('price_pro')),
    price_ai: nullableNumber(formData.get('price_ai')),
    tab_count: nullableNumber(formData.get('tab_count')),
    type: nullableString(formData.get('type')) ?? undefined,
    category: nullableString(formData.get('category')),
    etsy_listing_id: nullableString(formData.get('etsy_listing_id')),
    etsy_url: nullableString(formData.get('etsy_url')),
    status: nullableString(formData.get('status')) ?? undefined,
  }
  // Drop keys whose value is `undefined` so updateProductSchema partial works cleanly.
  for (const key of Object.keys(raw)) {
    if (raw[key] === undefined) delete raw[key]
  }
  return { input: raw as CreateProductInput, raw }
}

export async function createProductAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const denied = await assertAdmin()
  if (denied) return denied

  const { input } = parseProductForm(formData)
  const parsed = createProductSchema.safeParse(input)
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Please fix the highlighted fields.',
      fieldErrors: parsed.error.flatten().fieldErrors as FieldErrors,
    }
  }
  const result = await createProduct(parsed.data)
  if (!result.ok) {
    return { status: 'error', message: result.error }
  }
  revalidatePath(ADMIN_PRODUCTS)
  redirect(`${ADMIN_PRODUCTS}/${result.data.id}?created=1`)
}

export async function updateProductAction(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const denied = await assertAdmin()
  if (denied) return denied

  const { input } = parseProductForm(formData)
  const parsed = updateProductSchema.safeParse(input)
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Please fix the highlighted fields.',
      fieldErrors: parsed.error.flatten().fieldErrors as FieldErrors,
    }
  }
  const result = await updateProduct(id, parsed.data)
  if (!result.ok) {
    return { status: 'error', message: result.error }
  }
  revalidatePath(ADMIN_PRODUCTS)
  revalidatePath(`${ADMIN_PRODUCTS}/${id}`)
  return { status: 'success', message: 'Saved.', id }
}

export async function deleteProductAction(id: string): Promise<void> {
  const denied = await assertAdmin()
  if (denied) {
    redirect('/admin/login')
  }
  const result = await deleteProduct(id)
  if (!result.ok) {
    redirect(`${ADMIN_PRODUCTS}/${id}?error=${encodeURIComponent(result.error)}`)
  }
  revalidatePath(ADMIN_PRODUCTS)
  redirect(`${ADMIN_PRODUCTS}?deleted=1`)
}

export async function uploadFileAction(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const denied = await assertAdmin()
  if (denied) return denied

  const file = formData.get('file')
  if (!(file instanceof File) || file.size === 0) {
    return { status: 'error', message: 'Please choose a file to upload.' }
  }

  const meta = productFileMetaSchema.safeParse({
    tier: formData.get('tier'),
    format: formData.get('format'),
    label: formData.get('label'),
    version: formData.get('version') ?? undefined,
  })
  if (!meta.success) {
    return {
      status: 'error',
      message: 'Invalid upload metadata.',
      fieldErrors: meta.error.flatten().fieldErrors as FieldErrors,
    }
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
    return { status: 'error', message: result.error }
  }
  revalidatePath(`${ADMIN_PRODUCTS}/${id}`)
  return { status: 'success', message: `Uploaded as ${result.storagePath}.` }
}

export type SyncEtsyState =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | { status: 'success'; message: string }

export async function syncEtsyAction(
  id: string,
  _prev: SyncEtsyState,
): Promise<SyncEtsyState> {
  const auth = await requireAdmin()
  if (!auth.ok) {
    return { status: 'error', message: 'You must be signed in to sync.' }
  }
  const result = await syncProductToEtsy(id)
  if (!result.ok) {
    return { status: 'error', message: result.error }
  }
  revalidatePath(`${ADMIN_PRODUCTS}/${id}`)
  return { status: 'success', message: `Synced listing ${result.listing_id}.` }
}
