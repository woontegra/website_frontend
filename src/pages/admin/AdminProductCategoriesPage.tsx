import { useEffect, useState } from 'react'
import { Pencil, Plus } from 'lucide-react'
import {
  productCategoriesAdminApi,
  type AdminProductCategory,
  type AdminProductCategoryInput,
} from '../../api/product-categories-admin'
import { isAxiosError } from 'axios'

const empty: AdminProductCategoryInput = {
  name: '',
  slug: '',
  description: '',
  parentId: null,
  isActive: true,
  sortOrder: 0,
}

export function AdminProductCategoriesPage() {
  const [items, setItems] = useState<AdminProductCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<AdminProductCategoryInput>(empty)
  const [slugManual, setSlugManual] = useState(false)

  const load = async () => {
    setError(null)
    try {
      setLoading(true)
      const data = await productCategoriesAdminApi.list()
      setItems(data)
    } catch {
      setError('Kategoriler yüklenemedi.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const slugify = (name: string) => {
    let s = name.trim().toLowerCase()
    const map: Record<string, string> = {
      ç: 'c',
      ğ: 'g',
      ı: 'i',
      ö: 'o',
      ş: 's',
      ü: 'u',
      İ: 'i',
    }
    for (const [k, v] of Object.entries(map)) s = s.split(k).join(v)
    return s
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-{2,}/g, '-')
  }

  useEffect(() => {
    if (slugManual || editingId) return
    setForm((f) => ({ ...f, slug: slugify(f.name) }))
  }, [form.name, slugManual, editingId])

  const startNew = () => {
    setEditingId(null)
    setForm(empty)
    setSlugManual(false)
  }

  const startEdit = (c: AdminProductCategory) => {
    setEditingId(c.id)
    setForm({
      name: c.name,
      slug: c.slug,
      description: c.description ?? '',
      parentId: c.parentId,
      isActive: c.isActive,
      sortOrder: c.sortOrder,
    })
    setSlugManual(true)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const payload: AdminProductCategoryInput = {
        ...form,
        name: form.name.trim(),
        slug: (form.slug || slugify(form.name)).trim().toLowerCase(),
        description: (form.description ?? '').trim(),
        parentId: form.parentId || null,
      }
      if (editingId) await productCategoriesAdminApi.update(editingId, payload)
      else await productCategoriesAdminApi.create(payload)
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

  const deactivate = async (c: AdminProductCategory) => {
    if (!confirm(`“${c.name}” pasife alınsın mı? (Bağlı ürün varsa kategori pasif kalır.)`)) return
    try {
      await productCategoriesAdminApi.remove(c.id)
      await load()
    } catch {
      setError('İşlem başarısız.')
    }
  }

  if (loading) return <div className="flex h-48 items-center justify-center text-slate-500">Yükleniyor…</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Ürün kategorileri</h1>
          <p className="mt-1 text-sm text-slate-600">Hiyerarşik kategori; slug public URL’de kullanılır.</p>
        </div>
        <button
          type="button"
          onClick={startNew}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
        >
          <Plus className="h-4 w-4" />
          Yeni kategori
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            {editingId ? 'Kategori düzenle' : 'Yeni kategori'}
          </h2>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="label" htmlFor="cname">
                Ad *
              </label>
              <input
                id="cname"
                className="input w-full"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="cslug">
                Slug
              </label>
              <input
                id="cslug"
                className="input w-full font-mono text-sm"
                value={form.slug}
                onChange={(e) => {
                  setSlugManual(true)
                  setForm({ ...form, slug: e.target.value })
                }}
              />
            </div>
            <div>
              <label className="label" htmlFor="cparent">
                Üst kategori
              </label>
              <select
                id="cparent"
                className="input w-full"
                value={form.parentId ?? ''}
                onChange={(e) => setForm({ ...form, parentId: e.target.value || null })}
              >
                <option value="">— Yok —</option>
                {items
                  .filter((x) => x.id !== editingId)
                  .map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="cdesc">
                Açıklama
              </label>
              <textarea
                id="cdesc"
                className="textarea w-full"
                rows={3}
                value={form.description ?? ''}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="corder">
                  Sıra
                </label>
                <input
                  id="corder"
                  type="number"
                  className="input w-full"
                  value={form.sortOrder ?? 0}
                  onChange={(e) => setForm({ ...form, sortOrder: Number.parseInt(e.target.value, 10) || 0 })}
                />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={form.isActive !== false}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  />
                  Aktif
                </label>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {saving ? 'Kaydediliyor…' : editingId ? 'Güncelle' : 'Ekle'}
              </button>
              {editingId && (
                <button type="button" onClick={startNew} className="rounded-lg border border-slate-300 px-4 py-2 text-sm">
                  İptal
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[640px] w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-4 py-3">Ad</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Aktif</th>
                  <th className="px-4 py-3">Sıra</th>
                  <th className="px-4 py-3 w-36">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-medium text-slate-900">{c.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{c.slug}</td>
                    <td className="px-4 py-3">{c.isActive ? 'Evet' : 'Hayır'}</td>
                    <td className="px-4 py-3">{c.sortOrder}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(c)}
                          className="inline-flex items-center gap-1 rounded border border-slate-200 px-2 py-1 text-xs font-semibold hover:bg-white"
                        >
                          <Pencil className="h-3 w-3" />
                          Düzenle
                        </button>
                        <button
                          type="button"
                          onClick={() => deactivate(c)}
                          className="rounded border border-amber-200 px-2 py-1 text-xs font-semibold text-amber-900 hover:bg-amber-50"
                        >
                          Pasife al
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
