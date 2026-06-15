import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import type { PublicProductListItem } from '../../api/products-public'
import { formatProductPrice, productPricePeriodSuffix } from '../../lib/formatProductPrice'
import { formatMoneyAmount } from '../../lib/formatMoney'
import { addToCart, type CartSnapshot } from '../../lib/cartStorage'
import { MediaThumb } from '../ui/MediaThumb'

type ProductCardProps = {
  product: PublicProductListItem
  favorite?: {
    isFavorite: boolean
    busy: boolean
    onToggle: () => void
  }
}

export function ProductCard({ product: p, favorite }: ProductCardProps) {
  const detailHref = `/urun/${p.slug}`
  const canPurchase =
    p.productType === 'DOWNLOAD' ||
    ((p.productType === 'SAAS' || p.productType === 'SERVICE') && p.purchaseEnabled !== false)

  const handleSepeteEkle = () => {
    if (!canPurchase) return
    const snapshot: CartSnapshot = {
      name: p.name,
      slug: p.slug,
      price: p.price,
      currency: p.currency,
      productType: p.productType,
      coverImage: p.coverImage,
      licenseDurationMonths: p.licenseMonths,
    }
    addToCart(p.id, 1, { snapshot })
  }

  const compare =
    p.compareAtPrice != null && p.compareAtPrice > p.price ? formatMoneyAmount(p.compareAtPrice, p.currency) : null

  const priceSuffix = productPricePeriodSuffix(p.productType)

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-slate-900/5 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg">
      <Link to={detailHref} className="relative block aspect-[16/10] overflow-hidden bg-slate-100">
        {favorite && (
          <button
            type="button"
            className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/90 bg-white/95 text-rose-600 shadow-sm backdrop-blur-sm transition hover:bg-white hover:text-rose-700 disabled:opacity-50"
            aria-label={favorite.isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
            disabled={favorite.busy}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              void favorite.onToggle()
            }}
          >
            <Heart className={`h-5 w-5 ${favorite.isFavorite ? 'fill-current' : ''}`} aria-hidden />
          </button>
        )}
        {p.coverImage ? (
          <div className="relative h-full w-full">
            <MediaThumb url={p.coverImage} fileType="IMAGE" className="h-full w-full" alt={p.name} />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-sm font-medium text-slate-400">
            Görsel hazırlanıyor
          </div>
        )}
        {p.category && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-sm">
            {p.category.name}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5 pt-4">
        <div className="min-h-0 flex-1">
          <Link to={detailHref} className="block">
            <h2 className="text-lg font-bold tracking-tight text-slate-900 transition group-hover:text-accent-blue">
              {p.name}
            </h2>
          </Link>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">
            {p.shortDescription?.trim() ||
              (p.productType === 'SAAS' || p.productType === 'SERVICE'
                ? 'Web tabanlı yıllık kullanım; detaylar için ürün sayfasına göz atın.'
                : 'Pratik masaüstü çözüm; detaylar için ürün sayfasına göz atın.')}
          </p>
        </div>

        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 border-t border-slate-100 pt-4">
          <span className="inline-flex flex-wrap items-baseline gap-x-1.5 gap-y-0">
            <span className="text-xl font-bold text-emerald-700">{formatProductPrice(p)}</span>
            {priceSuffix ? (
              <span className="text-sm font-medium text-slate-500">{priceSuffix}</span>
            ) : null}
          </span>
          {compare && (
            <span className="text-sm text-slate-400 line-through decoration-slate-400">{compare}</span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!canPurchase}
            title={
              canPurchase
                ? undefined
                : p.productType === 'SAAS' || p.productType === 'SERVICE'
                  ? 'Bu web tabanlı ürün için online satın alma kapalı; detaylar için ürün sayfasına gidin.'
                  : 'Bu ürün için satın alma kapalı; detaylar için ürün sayfasına gidin.'
            }
            onClick={handleSepeteEkle}
            className="inline-flex flex-1 min-w-[8rem] items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Sepete Ekle
          </button>
          <Link
            to={detailHref}
            className="inline-flex flex-1 min-w-[8rem] items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            Detayları Gör
          </Link>
        </div>
      </div>
    </article>
  )
}
