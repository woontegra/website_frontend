import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  productCategoriesPublicApi,
  type PublicProductCategory,
  type PublicProductListItem,
} from '../api/products-public'
import { ProductCard } from '../components/store/ProductCard'
import { useCustomerFavorites } from '../hooks/useCustomerFavorites'

export function KategoriPage() {
  const { favoriteIds, favoriteBusyId, toggleFavorite } = useCustomerFavorites()
  const { slug } = useParams<{ slug: string }>()
  const [category, setCategory] = useState<PublicProductCategory | null>(null)
  const [items, setItems] = useState<PublicProductListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    void (async () => {
      try {
        setLoading(true)
        const [cats, prods] = await Promise.all([
          productCategoriesPublicApi.list(),
          productCategoriesPublicApi.listProductsByCategorySlug(slug),
        ])
        if (cancelled) return
        const cat = cats.find((c) => c.slug === slug) ?? null
        setCategory(cat)
        setItems(prods)
        if (!cat) setError('Kategori bulunamadı veya yayında değil.')
      } catch {
        if (!cancelled) setError('Veri yüklenemedi.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [slug])

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center text-slate-600">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" aria-hidden />
        <p className="mt-4 text-sm font-medium">Kategori yükleniyor…</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white pb-16 pt-6 sm:pt-10">
      <div className="mx-auto max-w-6xl px-4">
        <Link to="/urunler" className="text-sm font-semibold text-slate-600 transition hover:text-slate-900">
          ← Tüm ürünler
        </Link>

        <header className="mt-6 rounded-3xl border border-slate-200/80 bg-white/90 px-6 py-8 shadow-sm ring-1 ring-slate-900/5 sm:px-10 sm:py-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{category?.name ?? 'Kategori'}</h1>
          {category?.description?.trim() ? (
            <p className="mt-4 max-w-3xl whitespace-pre-wrap text-base leading-relaxed text-slate-600">
              {category.description.trim()}
            </p>
          ) : (
            <p className="mt-4 max-w-2xl text-slate-600">
              Bu kategorideki ürünler aşağıda listelenir.
            </p>
          )}
        </header>

        {error && (
          <p className="mt-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
        )}

        {!error && items.length > 0 && (
          <ul className="mt-12 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((p) => (
              <li key={p.id}>
                <ProductCard
                  product={p}
                  favorite={{
                    isFavorite: favoriteIds.has(p.id),
                    busy: favoriteBusyId === p.id,
                    onToggle: () => void toggleFavorite(p.id),
                  }}
                />
              </li>
            ))}
          </ul>
        )}

        {!error && items.length === 0 && (
          <div className="mt-12 rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 px-8 py-14 text-center">
            <p className="text-lg font-semibold text-slate-800">Bu kategoride henüz ürün yok</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
              Diğer çözümler için mağaza sayfasına dönebilirsiniz.
            </p>
            <Link
              to="/urunler"
              className="mt-6 inline-flex rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Ürünlere git
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
