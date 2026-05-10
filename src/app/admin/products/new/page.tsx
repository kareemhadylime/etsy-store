import Link from 'next/link'
import { ProductForm } from '../_components/product-form'
import { createProductAction } from '../../_actions/products'

export const dynamic = 'force-dynamic'

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/products" className="text-sm text-gray-500 hover:underline">
          ← Back to products
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">New product</h1>
      </div>

      <div className="rounded border border-gray-200 bg-white p-6">
        <ProductForm action={createProductAction} submitLabel="Create product" submitBusyLabel="Creating…" />
      </div>
    </div>
  )
}
