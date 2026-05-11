import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/admin/products'
import { listProductFiles } from '@/lib/admin/product-files'
import { loadRecentOutputs } from '@/lib/ai/listing-copy'
import {
  deleteProductAction,
  syncEtsyAction,
  updateProductAction,
  uploadFileAction,
} from '../../_actions/products'
import { ProductForm } from '../_components/product-form'
import { UploadFileForm } from '../_components/upload-file-form'
import { SyncEtsyButton } from '../_components/sync-etsy-button'
import { DeleteProductButton } from '../_components/delete-button'
import { AiCopyPanel } from '../_components/ai-copy-panel'

export const dynamic = 'force-dynamic'

type SearchParams = { created?: string; error?: string }

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<SearchParams>
}) {
  const { id } = await params
  const sp = await searchParams

  const productRes = await getProduct(id)
  if (!productRes.ok) {
    if (productRes.status === 404) notFound()
    throw new Error(productRes.error)
  }
  const product = productRes.data
  const [filesRes, recentOutputsRes] = await Promise.all([
    listProductFiles(id),
    loadRecentOutputs(id, 10),
  ])
  const recentOutputs = recentOutputsRes.ok ? recentOutputsRes.rows : []

  const updateBound = updateProductAction.bind(null, id)
  const uploadBound = uploadFileAction.bind(null, id)
  const syncBound = syncEtsyAction.bind(null, id)
  const deleteBound = deleteProductAction.bind(null, id)

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <Link href="/admin/products" className="text-sm text-gray-500 hover:underline">
            ← Back to products
          </Link>
          <h1 className="mt-2 text-2xl font-semibold">{product.name}</h1>
          <p className="font-mono text-xs text-gray-500">{product.slug}</p>
        </div>
        <div className="flex items-center gap-3">
          <SyncEtsyButton action={syncBound} hasListingId={!!product.etsy_listing_id} />
          <DeleteProductButton action={deleteBound} />
        </div>
      </div>

      {sp.created === '1' ? (
        <p className="rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          Product created.
        </p>
      ) : null}
      {sp.error ? (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {sp.error}
        </p>
      ) : null}

      <section className="rounded border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-medium">Details</h2>
        <ProductForm action={updateBound} product={product} submitLabel="Save changes" submitBusyLabel="Saving…" />
      </section>

      <section className="rounded border border-gray-200 bg-white p-6">
        <h2 className="mb-1 text-lg font-medium">Files</h2>
        <p className="mb-4 text-xs text-gray-500">
          Files upload to <code className="rounded bg-gray-100 px-1">{process.env.SUPABASE_DOWNLOADS_BUCKET ?? 'downloads'}</code> bucket
          and are delivered post-purchase via signed URLs.
        </p>

        <UploadFileForm action={uploadBound} />

        <div className="mt-6">
          {!filesRes.ok ? (
            <p className="text-sm text-red-700">Failed to load files: {filesRes.error}</p>
          ) : filesRes.data.length === 0 ? (
            <p className="text-sm text-gray-500">No files uploaded yet.</p>
          ) : (
            <div className="overflow-hidden rounded border border-gray-100">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-3 py-2">Tier</th>
                    <th className="px-3 py-2">Format</th>
                    <th className="px-3 py-2">Label</th>
                    <th className="px-3 py-2">Version</th>
                    <th className="px-3 py-2">Storage path</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filesRes.data.map((f) => (
                    <tr key={f.id}>
                      <td className="px-3 py-2 capitalize">{f.tier}</td>
                      <td className="px-3 py-2 capitalize">{f.format}</td>
                      <td className="px-3 py-2">{f.label}</td>
                      <td className="px-3 py-2 font-mono text-xs">{f.version}</td>
                      <td className="px-3 py-2 font-mono text-xs text-gray-600">{f.url}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <section className="rounded border border-gray-200 bg-white p-6">
        <h2 className="mb-1 text-lg font-medium">AI listing copy</h2>
        <p className="mb-4 text-xs text-gray-500">
          Generate Etsy titles, descriptions, tags and OG meta with Claude. Output is stored in
          <code className="mx-1 rounded bg-gray-100 px-1">ai_outputs</code>; accept the version you like
          to stamp it for later sync.
        </p>
        <AiCopyPanel productId={id} recentOutputs={recentOutputs} />
      </section>
    </div>
  )
}
