import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  productCategoriesPublicApi,
  productsPublicApi,
  type PublicProductCategory,
  type PublicProductListItem,
} from '../api/products-public'
import { ProductCard } from '../components/store/ProductCard'
import { useCustomerFavorites } from '../hooks/useCustomerFavorites'

type CategorySection = {
  slug: string
  title: string
  description: string | null
  products: PublicProductListItem[]
}

export function UrunlerPage() {
  const { favoriteIds, favoriteBusyId, toggleFavorite } = useCustomerFavorites()
  const [items, setItems] = useState<PublicProductListItem[]>([])
  const [categories, setCategories] = useState<PublicProductCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const [plist, clist] = await Promise.all([
          productsPublicApi.list(),
          productCategoriesPublicApi.list(),
        ])
        if (!cancelled) {
          setItems(plist)
          setCategories(clist)
        }
      } catch {
        if (!cancelled) setError('Ürünler yüklenemedi.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const { sections, uncategorized } = useMemo(() => {
    const bySlug = new Map<string, PublicProductListItem[]>()
    const uncategorizedInner: PublicProductListItem[] = []
    for (const p of items) {
      if (!p.category) {
        uncategorizedInner.push(p)
        continue
      }
      const s = p.category.slug
      if (!bySlug.has(s)) bySlug.set(s, [])
      bySlug.get(s)!.push(p)
    }

    const catOrder = new Map(categories.map((c) => [c.slug, c.sortOrder]))
    const ordered: CategorySection[] = []

    for (const c of categories) {
      const prods = bySlug.get(c.slug)
      if (!prods?.length) continue
      ordered.push({
        slug: c.slug,
        title: c.name,
        description: c.description?.trim() || null,
        products: prods,
      })
    }

    for (const [slug, products] of bySlug) {
      if (ordered.some((o) => o.slug === slug)) continue
      const title = products[0]?.category?.name ?? slug
      ordered.push({ slug, title, description: null, products })
    }

    ordered.sort((a, b) => {
      const ia = catOrder.has(a.slug) ? (catOrder.get(a.slug) as number) : 999_999
      const ib = catOrder.has(b.slug) ? (catOrder.get(b.slug) as number) : 999_999
      return ia - ib || a.title.localeCompare(b.title, 'tr')
    })

    return { sections: ordered, uncategorized: uncategorizedInner }
  }, [items, categories])

  const categoryPills = useMemo(() => {
    const slugsWithProducts = new Set(sections.map((s) => s.slug))
    return categories.filter((c) => slugsWithProducts.has(c.slug))
  }, [categories, sections])

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center text-slate-600">
        <div
          className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"
          aria-hidden
        />
        <p className="mt-4 text-sm font-medium">Ürünler yükleniyor…</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white pb-16 pt-6 sm:pt-10">
      <div className="mx-auto max-w-6xl px-4">
        <header className="rounded-3xl border border-slate-200/80 bg-white/90 px-6 py-10 shadow-sm ring-1 ring-slate-900/5 sm:px-10 sm:py-12">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Mağaza</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Woontegra mağaza ürünleri
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
            İndirilebilir masaüstü yazılımlar ile web tabanlı (yıllık kullanımlı) programları tek vitrinde
            bulabilirsiniz. Ürünler kategori bazında gruplanır; her kategori için ayrı sayfa bağlantısı vardır.
          </p>

          {categoryPills.length > 0 ? (
            <nav
              className="mt-8 flex flex-wrap gap-2 border-t border-slate-100 pt-8"
              aria-label="Ürün kategorileri"
            >
              <span className="self-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                Kategoriler
              </span>
              {categoryPills.map((c) => (
                <Link
                  key={c.slug}
                  to={`/kategori/${encodeURIComponent(c.slug)}`}
                  className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-900 transition hover:border-emerald-300 hover:bg-emerald-100"
                >
                  {c.name}
                </Link>
              ))}
            </nav>
          ) : null}
        </header>

        {error && (
          <p className="mt-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
        )}

        {!error && items.length > 0 && (
          <div className="mt-12 space-y-16">
            {uncategorized.length > 0 ? (
              <section aria-labelledby="urunler-diger-heading">
                <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-4">
                  <h2 id="urunler-diger-heading" className="text-2xl font-bold tracking-tight text-slate-900">
                    Diğer ürünler
                  </h2>
                </div>
                <ul className="mt-8 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                  {uncategorized.map((p) => (
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
              </section>
            ) : null}

            {sections.map((sec) => (
              <section key={sec.slug} aria-labelledby={`cat-${sec.slug}`}>
                <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <h2 id={`cat-${sec.slug}`} className="text-2xl font-bold tracking-tight text-slate-900">
                      {sec.title}
                    </h2>
                    {sec.description ? (
                      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">{sec.description}</p>
                    ) : null}
                  </div>
                  <Link
                    to={`/kategori/${encodeURIComponent(sec.slug)}`}
                    className="shrink-0 text-sm font-semibold text-accent-blue hover:underline"
                  >
                    Kategoriye git →
                  </Link>
                </div>
                <ul className="mt-8 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                  {sec.products.map((p) => (
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
              </section>
            ))}
          </div>
        )}

        {!error && items.length === 0 && (
          <div className="mt-12 rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 px-8 py-16 text-center">
            <p className="text-lg font-semibold text-slate-800">Şu an vitrinde ürün bulunmuyor</p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600">
              Yeni ürünler yayınlandığında bu sayfada listelenecek. Web tabanlı vitrin ürünü için yönetici panelinden
              ürün ekleyebilir veya sunucu kurulum talimatlarınızı uygulayabilirsiniz.
            </p>
            <Link
              to="/iletisim"
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              İletişime geç
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
