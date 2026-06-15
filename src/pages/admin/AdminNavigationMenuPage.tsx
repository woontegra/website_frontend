import { useEffect, useMemo, useRef, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { isAxiosError } from 'axios'
import {
  navigationMenuAdminApi,
  type AdminNavigationMenuItem,
  type AdminNavigationMenuInput,
  type NavigationMenuItemType,
} from '../../api/navigation-menu-admin'
import { productsAdminApi, type AdminProduct } from '../../api/products-admin'
import { productCategoriesAdminApi, type AdminProductCategory } from '../../api/product-categories-admin'
import { cmsPagesAdminApi, type CmsPageListItem } from '../../api/cms-pages-admin'

const empty: AdminNavigationMenuInput = {
  label: '',
  type: 'CUSTOM_URL',
  url: '',
  productId: null,
  categoryId: null,
  pageId: null,
  parentId: null,
  sortOrder: 0,
  isActive: true,
  openInNewTab: false,
}

const typeLabels: Record<NavigationMenuItemType, string> = {
  CUSTOM_URL: 'Özel URL',
  PRODUCT: 'Ürün',
  CATEGORY: 'Kategori',
  PAGE: 'Sayfa',
}

function validateForm(form: AdminNavigationMenuInput): string | null {
  if (!form.label.trim()) return 'Etiket gerekli'
  switch (form.type) {
    case 'CUSTOM_URL': {
      const u = (form.url ?? '').trim()
      if (!u) return 'Özel URL için adres girin'
      if (!/^https?:\/\//i.test(u) && !u.startsWith('/')) return 'Adres http(s) veya / ile başlamalı'
      break
    }
    case 'PRODUCT':
      if (!form.productId) return 'Ürün seçin'
      break
    case 'CATEGORY':
      if (!form.categoryId) return 'Kategori seçin'
      break
    case 'PAGE':
      if (!form.pageId) return 'Sayfa seçin'
      break
    default:
      break
  }
  return null
}

export function AdminNavigationMenuPage() {
  const [items, setItems] = useState<AdminNavigationMenuItem[]>([])
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [categories, setCategories] = useState<AdminProductCategory[]>([])
  const [pages, setPages] = useState<CmsPageListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<AdminNavigationMenuInput>(empty)
  const [prodFilter, setProdFilter] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [pageFilter, setPageFilter] = useState('')
  const [editLoading, setEditLoading] = useState(false)
  const editRequestRef = useRef(0)

  const filteredProducts = useMemo(() => {
    const q = prodFilter.trim().toLowerCase()
    if (!q) return products
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q),
    )
  }, [products, prodFilter])

  const filteredCategories = useMemo(() => {
    const q = catFilter.trim().toLowerCase()
    if (!q) return categories
    return categories.filter(
      (c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q),
    )
  }, [categories, catFilter])

  const filteredPages = useMemo(() => {
    const q = pageFilter.trim().toLowerCase()
    if (!q) return pages
    return pages.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.status.toLowerCase().includes(q),
    )
  }, [pages, pageFilter])

  /** Düzenlemede seçili sayfa filtre dışında kaldıysa listede görünsün */
  const pageSelectOptions = useMemo(() => {
    if (editingId && form.type === 'PAGE' && form.pageId) {
      const inFiltered = filteredPages.some((p) => p.id === form.pageId)
      if (!inFiltered) {
        const missing = pages.find((p) => p.id === form.pageId)
        if (missing) return [missing, ...filteredPages]
      }
    }
    return filteredPages
  }, [editingId, form.type, form.pageId, filteredPages, pages])

  const load = async () => {
    setError(null)
    try {
      setLoading(true)
      const [nav, prods, cats, pgs] = await Promise.all([
        navigationMenuAdminApi.list(),
        productsAdminApi.list({ isActive: 'all' }),
        productCategoriesAdminApi.list(),
        cmsPagesAdminApi.list().catch(() => [] as CmsPageListItem[]),
      ])
      setItems(nav)
      setProducts(prods)
      setCategories(cats)
      setPages(pgs)
    } catch {
      setError('Veriler yüklenemedi.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const startNew = () => {
    editRequestRef.current += 1
    setEditingId(null)
    setForm(empty)
    setEditLoading(false)
    setProdFilter('')
    setCatFilter('')
    setPageFilter('')
  }

  const applyRowToForm = (row: AdminNavigationMenuItem) => {
    setEditingId(row.id)
    setForm({
      label: row.label,
      type: row.type,
      url: row.url ?? '',
      productId: row.productId,
      categoryId: row.categoryId,
      pageId: row.pageId,
      parentId: row.parentId,
      sortOrder: row.sortOrder,
      isActive: row.isActive === true,
      openInNewTab: row.openInNewTab === true,
    })
    setProdFilter('')
    setCatFilter('')
    setPageFilter('')
  }

  const startEdit = async (row: AdminNavigationMenuItem) => {
    const rid = ++editRequestRef.current
    setError(null)
    setEditLoading(true)
    try {
      const full = await navigationMenuAdminApi.getById(row.id)
      if (rid !== editRequestRef.current) return
      applyRowToForm(full)
    } catch {
      if (rid !== editRequestRef.current) return
      applyRowToForm(row)
    } finally {
      if (rid === editRequestRef.current) setEditLoading(false)
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const v = validateForm(form)
    if (v) {
      setError(v)
      return
    }
    setSaving(true)
    setError(null)
    try {
      const payload: AdminNavigationMenuInput = {
        label: form.label.trim(),
        type: form.type,
        url: form.type === 'CUSTOM_URL' ? (form.url ?? '').trim() : null,
        productId: form.type === 'PRODUCT' ? form.productId : null,
        categoryId: form.type === 'CATEGORY' ? form.categoryId : null,
        pageId: form.type === 'PAGE' ? form.pageId : null,
        parentId: form.parentId ?? null,
        sortOrder: form.sortOrder ?? 0,
        isActive: form.isActive === true,
        openInNewTab: form.openInNewTab === true,
      }
      if (editingId) await navigationMenuAdminApi.update(editingId, payload)
      else await navigationMenuAdminApi.create(payload)
      await load()
      startNew()
    } catch (err) {
      const msg = isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message ?? err.message
        : 'Kayıt başarısız.'
      setError(typeof msg === 'string' ? msg : 'Kayıt başarısız.')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (row: AdminNavigationMenuItem) => {
    if (!confirm(`“${row.label}” silinsin mi?`)) return
    try {
      await navigationMenuAdminApi.remove(row.id)
      await load()
    } catch {
      setError('Silinemedi.')
    }
  }

  const rowTargetLabel = (row: AdminNavigationMenuItem) => {
    const dest = row.resolvedUrl && row.resolvedUrl !== '#' ? row.resolvedUrl : '—'
    return `${row.label} → ${dest}`
  }

  if (loading) return <div className="flex h-48 items-center justify-center text-slate-500">Yükleniyor…</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Menü yönetimi (mağaza)</h1>
        <p className="mt-1 text-sm text-slate-600">
          Üst menü hedefi: özel adres, ürün, kategori veya CMS sayfası. Tür seçince hedef alanı değişir.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            {editingId ? 'Öğe düzenle' : 'Yeni menü öğesi'}
          </h2>
          {editingId && (
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={startNew} className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Yeni öğe
              </button>
              <button type="button" onClick={startNew} className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Vazgeç
              </button>
            </div>
          )}
        </div>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="md:col-span-2">
            <label className="label">Etiket *</label>
            <input
              className="input w-full"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">Tür *</label>
            <select
              className="input w-full"
              value={form.type}
              onChange={(e) =>
                setForm({
                  ...form,
                  type: e.target.value as NavigationMenuItemType,
                  url: '',
                  productId: null,
                  categoryId: null,
                  pageId: null,
                })
              }
            >
              {(Object.keys(typeLabels) as NavigationMenuItemType[]).map((k) => (
                <option key={k} value={k}>
                  {typeLabels[k]}
                </option>
              ))}
            </select>
          </div>

          {form.type === 'CUSTOM_URL' && (
            <div className="md:col-span-2 lg:col-span-3">
              <label className="label">URL *</label>
              <input
                className="input w-full font-mono text-sm"
                value={form.url ?? ''}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://... veya /iletisim"
              />
            </div>
          )}

          {form.type === 'PRODUCT' && (
            <div className="md:col-span-2 lg:col-span-3 space-y-2">
              <label className="label">Ürün *</label>
              <input
                className="input w-full max-w-md"
                placeholder="Ara: ad veya slug…"
                value={prodFilter}
                onChange={(e) => setProdFilter(e.target.value)}
              />
              <select
                className="input w-full max-w-xl"
                value={form.productId ?? ''}
                onChange={(e) => setForm({ ...form, productId: e.target.value || null })}
                required={form.type === 'PRODUCT'}
                size={Math.min(10, Math.max(4, filteredProducts.length + 1))}
              >
                <option value="">— Ürün seçin —</option>
                {filteredProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.slug}){p.isActive ? '' : ' — pasif'}
                  </option>
                ))}
              </select>
            </div>
          )}

          {form.type === 'CATEGORY' && (
            <div className="md:col-span-2 lg:col-span-3 space-y-2">
              <label className="label">Kategori *</label>
              <input
                className="input w-full max-w-md"
                placeholder="Ara…"
                value={catFilter}
                onChange={(e) => setCatFilter(e.target.value)}
              />
              <select
                className="input w-full max-w-xl"
                value={form.categoryId ?? ''}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value || null })}
                required={form.type === 'CATEGORY'}
                size={Math.min(10, Math.max(4, filteredCategories.length + 1))}
              >
                <option value="">— Kategori seçin —</option>
                {filteredCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.slug}){c.isActive ? '' : ' — pasif'}
                  </option>
                ))}
              </select>
            </div>
          )}

          {form.type === 'PAGE' && (
            <div className="md:col-span-2 lg:col-span-3 space-y-2">
              <label className="label">Sayfa * (CMS)</label>
              <input
                className="input w-full max-w-md"
                placeholder="Ara: başlık, slug…"
                value={pageFilter}
                onChange={(e) => setPageFilter(e.target.value)}
              />
              <select
                className="input w-full max-w-xl"
                value={form.pageId ?? ''}
                onChange={(e) => setForm({ ...form, pageId: e.target.value || null })}
                required={form.type === 'PAGE'}
                size={Math.min(12, Math.max(4, pageSelectOptions.length + 1))}
              >
                <option value="">— Sayfa seçin —</option>
                {pageSelectOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} — /{p.slug} ({p.status})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="label">Üst menü</label>
            <select
              className="input w-full"
              value={form.parentId ?? ''}
              onChange={(e) => setForm({ ...form, parentId: e.target.value || null })}
            >
              <option value="">— Üst seviye —</option>
              {items
                .filter((x) => x.id !== editingId)
                .map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.parentId ? `↳ ${x.label}` : x.label}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="label">Sıra</label>
            <input
              type="number"
              className="input w-full"
              value={form.sortOrder ?? 0}
              onChange={(e) => setForm({ ...form, sortOrder: Number.parseInt(e.target.value, 10) || 0 })}
            />
          </div>
          <div className="flex flex-col justify-end gap-2 pb-1">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={form.isActive === true}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              Aktif
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={form.openInNewTab === true}
                onChange={(e) => setForm({ ...form, openInNewTab: e.target.checked })}
              />
              Yeni sekmede aç
            </label>
          </div>
          <div className="md:col-span-2 lg:col-span-3 flex gap-2">
            <button
              type="submit"
              disabled={saving || editLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {saving ? 'Kaydediliyor…' : editingId ? 'Güncelle' : 'Ekle'}
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
              <tr>
                <th className="px-4 py-3">Etiket / hedef</th>
                <th className="px-4 py-3">Tür</th>
                <th className="px-4 py-3">Üst</th>
                <th className="px-4 py-3">Sıra</th>
                <th className="px-4 py-3">Aktif</th>
                <th className="px-4 py-3 w-32">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => {
                const parent = row.parentId ? items.find((x) => x.id === row.parentId) : null
                return (
                  <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50/80">
                    <td className="px-4 py-3 text-slate-900">
                      <div className="font-medium">{rowTargetLabel(row)}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{typeLabels[row.type]}</td>
                    <td className="px-4 py-3 text-slate-600">{parent?.label ?? '—'}</td>
                    <td className="px-4 py-3">{row.sortOrder}</td>
                    <td className="px-4 py-3">{row.isActive ? 'Evet' : 'Hayır'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => void startEdit(row)}
                          disabled={editLoading}
                          className="rounded border border-slate-200 p-1.5 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Düzenle"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(row)}
                          className="rounded border border-red-200 p-1.5 text-red-700 hover:bg-red-50"
                          title="Sil"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {items.length === 0 && <div className="px-6 py-12 text-center text-slate-500">Henüz menü öğesi yok.</div>}
      </div>
    </div>
  )
}
