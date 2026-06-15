import type { ProductType } from '../api/products-admin'
import type { CartPreviewRow } from '../api/products-public'
import type { CartLine, CartSnapshot } from './cartStorage'

export type MergedCartRow = CartPreviewRow & { quantity: number; lineTotal: number }

function snapshotToPreview(line: CartLine, snap: CartSnapshot): CartPreviewRow {
  return {
    id: line.productId,
    name: snap.name,
    slug: snap.slug,
    productType: snap.productType,
    price: snap.price,
    currency: snap.currency || 'TRY',
    coverImage: snap.coverImage,
    hasDownload: snap.productType !== 'SAAS' && snap.productType !== 'SERVICE',
  }
}

/** Önce API önizlemesi; yoksa satırdaki snapshot; o da yoksa minimal satır (eski sepet uyumu). */
export function mergeCartWithPreview(lines: CartLine[], preview: CartPreviewRow[]): MergedCartRow[] {
  const map = new Map<string, CartPreviewRow>()
  for (const p of preview) {
    map.set(p.id, p)
    for (const k of p.matchKeys ?? []) {
      if (k) map.set(k, p)
    }
  }
  return lines.map((line) => {
    const fromApi = map.get(line.productId)
    const base: CartPreviewRow = fromApi
      ? { ...fromApi }
      : line.snapshot
        ? snapshotToPreview(line, line.snapshot)
        : {
            id: line.productId,
            name: 'Ürün',
            slug: '',
            productType: 'DOWNLOAD' as ProductType,
            price: 0,
            currency: 'TRY',
            coverImage: null,
            hasDownload: true,
          }
    return {
      ...base,
      quantity: line.quantity,
      lineTotal: base.price * line.quantity,
    }
  })
}
