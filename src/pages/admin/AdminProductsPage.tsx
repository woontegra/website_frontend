import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Pencil, Search, Ban } from 'lucide-react'
import { productsAdminApi, type AdminProduct, type ProductType } from '../../api/products-admin'
import { productCategoriesAdminApi, type AdminProductCategory } from '../../api/product-categories-admin'
import { MediaThumb } from '../../components/ui/MediaThumb'
import { formatMoneyAmount } from '../../lib/formatMoney'

const typeLabels: Record<string, string> = {
  DOWNLOAD: 'İndirilebilir',
  SAAS: 'Web tabanlı',
  SERVICE: 'Hizmet (ileride)',
}

export function AdminProductsPage() {
  const [items, setItems] = useState<AdminProduct[]>([])
  const [categories, setCategories] = useState<AdminProductCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [debounced, setDebounced] = useState('')
  const [isActive, setIsActive] = useState<'all' | 'true' | 'false'>('all')
  const [categoryId, setCategoryId] = useState<string>('')
  const [productType, setProductType] = useState<ProductType | ''>('')

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(search.trim()), 300)
    return () => window.clearTimeout(t)
  }, [search])

  const missingDeliveryCount = useMemo(() => items.filter((p) => Boolean(p.deliveryLinkMissing)).length, [items])

  const query = useMemo(
    () => ({
      search: debounced || undefined,
      isActive: isActive === 'all' ? undefined : isActive,
      categoryId: categoryId || undefined,
      productType: productType || undefined,
    }),
    [debounced, isActive, categoryId, productType],
  )

  const load = async () => {
    setError(null)
    try {
      setLoading(true)
      const [data, cats] = await Promise.all([
        productsAdminApi.list(query),
        productCategoriesAdminApi.list().catch(() => [] as AdminProductCategory[]),
      ])
      setItems(data)
      setCategories(cats)
    } catch {
      setError('Ürün listesi yüklenemedi.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- query object stable enough
  }, [debounced, isActive, categoryId, productType])

  const handleDeactivate = async (p: AdminProduct) => {
    if (!confirm(`“${p.name}” pasife alınsın mı? (Ürün silinmez, yalnızca gizlenir.)`)) return
    try {
      await productsAdminApi.remove(p.id)
      await load()
    } catch {
      alert('İşlem başarısız.')
    }
  }

  if (loading && items.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-slate-500">Yükleniyor…</div>
    )
  }

  return (
    <div className="w-full min-w-0 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Ürünler</h1>
          <p className="mt-1 text-sm text-slate-600">Mağaza ürünleri; ödeme ve sipariş bu sürümde yok.</p>
        </div>
        <Link
          to="/admin/urunler/yeni"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-700"
        >
          Yeni ürün
        </Link>
      </div>

      <div className="flex w-full min-w-0 flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-end">
        <div className="min-w-0 w-full sm:min-w-[200px] sm:flex-1">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Arama</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="input w-full pl-9"
              placeholder="Ad veya slug…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full min-w-0 sm:w-auto">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Durum</label>
          <select className="input w-full min-w-0 sm:min-w-[140px]" value={isActive} onChange={(e) => setIsActive(e.target.value as typeof isActive)}>
            <option value="all">Tümü</option>
            <option value="true">Aktif</option>
            <option value="false">Pasif</option>
          </select>
        </div>
        <div className="w-full min-w-0 sm:w-auto">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Kategori</label>
          <select className="input w-full min-w-0 sm:min-w-[180px]" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">Tümü</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full min-w-0 sm:w-auto">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Ürün tipi</label>
          <select
            className="input w-full min-w-0 sm:min-w-[160px]"
            value={productType}
            onChange={(e) => setProductType((e.target.value || '') as ProductType | '')}
          >
            <option value="">Tümü</option>
            <option value="DOWNLOAD">DOWNLOAD</option>
            <option value="SAAS">SAAS</option>
            <option value="SERVICE">SERVICE</option>
          </select>
        </div>
      </div>

      {missingDeliveryCount > 0 && (
        <div className="rounded-xl border border-amber-400 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950">
          {missingDeliveryCount} üründe teslimat linki eksik veya kullanılamıyor (DOWNLOAD, aktif ve satın alınabilir).
          Bu kayıtlar satın alma ve ödeme akışında engellenir; ürünü düzenleyerek bağlantıyı ekleyin veya satın almayı kapatın.
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[1200px] w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
              <tr>
                <th className="px-4 py-3">Kapak</th>
                <th className="px-4 py-3">Ürün</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Tip</th>
                <th className="px-4 py-3">Fiyat</th>
                <th className="px-4 py-3">Aktif</th>
                <th className="px-4 py-3">Öne çıkan</th>
                <th className="px-4 py-3">Sürüm</th>
                <th className="px-4 py-3">Sıra</th>
                <th className="px-4 py-3">Teslimat</th>
                <th className="px-4 py-3 w-40">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80">
                  <td className="px-4 py-3">
                    {p.coverImage ? (
                      <MediaThumb url={p.coverImage} fileType="IMAGE" className="h-12 w-16" alt="" />
                    ) : (
                      <div className="flex h-12 w-16 items-center justify-center rounded-md border border-dashed border-slate-200 bg-slate-50 text-slate-400">
                        <Package className="h-5 w-5" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{p.name}</div>
                    <div className="text-xs text-slate-500">{p.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{p.category?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-700">{typeLabels[p.productType] ?? p.productType}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{formatMoneyAmount(p.price, p.currency)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                        p.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {p.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-4 py-3">{p.isFeatured ? 'Evet' : 'Hayır'}</td>
                  <td className="px-4 py-3 text-slate-600">{p.version ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{p.sortOrder}</td>
                  <td className="px-4 py-3">
                    {p.deliveryLinkMissing === true ? (
                      <span className="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-900">
                        Teslimat linki eksik
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={`/admin/urunler/${p.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Düzenle
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDeactivate(p)}
                        className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-50"
                      >
                        <Ban className="h-3.5 w-3.5" />
                        Pasife al
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {items.length === 0 && (
          <div className="px-6 py-16 text-center text-slate-500">Kayıt yok veya filtrelere uyan ürün yok.</div>
        )}
      </div>
    </div>
  )
}
