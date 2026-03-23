import { useCallback, useEffect, useState } from 'react'
import { adminApi } from '../../api/cms'

type PageOpt = { id: string; title: string; slug: string }
type MenuItemRow = {
  id: string
  label: string
  url: string
  pageId: string
}

type MenuResponse = {
  id: string
  location: string
  items: Array<{
    id: string
    label: string
    url: string | null
    pageId: string | null
    page: { id: string; title: string; slug: string } | null
  }>
}

export function AdminMenusPage() {
  const [location, setLocation] = useState<'header' | 'footer'>('header')
  const [pages, setPages] = useState<PageOpt[]>([])
  const [rows, setRows] = useState<MenuItemRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [dragId, setDragId] = useState<string | null>(null)

  const loadPages = useCallback(() => {
    adminApi<Array<{ id: string; title: string; slug: string }>>('/pages').then((r) => {
      if (r.success && r.data) setPages(r.data)
    })
  }, [])

  const loadMenu = useCallback(() => {
    setLoading(true)
    adminApi<MenuResponse>(`/menus/${location}/items`).then((r) => {
      if (r.success && r.data) {
        setRows(
          r.data.items.map((it) => ({
            id: it.id,
            label: it.label,
            url: it.url ?? '',
            pageId: it.pageId ?? '',
          }))
        )
        setMsg('')
      } else setMsg(r.message ?? 'Menü yüklenemedi')
      setLoading(false)
    })
  }, [location])

  useEffect(() => {
    loadPages()
  }, [loadPages])

  useEffect(() => {
    loadMenu()
  }, [loadMenu])

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { id: `new-${crypto.randomUUID()}`, label: 'Yeni öğe', url: '', pageId: '' },
    ])
  }

  const updateRow = (id: string, patch: Partial<MenuItemRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  const removeRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  const onDragStart = (id: string) => setDragId(id)
  const onDragOver = (e: React.DragEvent, overId: string) => {
    e.preventDefault()
    if (!dragId || dragId === overId) return
    setRows((prev) => {
      const i = prev.findIndex((x) => x.id === dragId)
      const j = prev.findIndex((x) => x.id === overId)
      if (i < 0 || j < 0) return prev
      const next = [...prev]
      const [a] = next.splice(i, 1)
      next.splice(j, 0, a)
      return next
    })
  }
  const onDragEnd = () => setDragId(null)

  const save = async () => {
    setSaving(true)
    setMsg('')
    const payload = rows.map((r, order) => ({
      label: r.label,
      url: r.url.trim() || null,
      pageId: r.pageId || null,
      order,
    }))
    const r = await adminApi(`/menus/${location}/items`, {
      method: 'PUT',
      body: JSON.stringify({ items: payload }),
    })
    setSaving(false)
    if (r.success) {
      setMsg('Kaydedildi')
      loadMenu()
    } else setMsg(r.message ?? 'Kayıt hatası')
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Menüler</h1>
      <p className="mb-4 text-sm text-slate-600">
        Öğeleri sürükleyerek sıralayın. Sayfa seçilirse URL yerine sayfa bağlantısı kullanılır.
      </p>
      {msg && <p className="mb-4 text-sm text-slate-600">{msg}</p>}

      <div className="mb-4 flex gap-2">
        {(['header', 'footer'] as const).map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => setLocation(loc)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              location === loc ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {loc === 'header' ? 'Üst menü' : 'Alt menü'}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-slate-500">Yükleniyor…</p>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="space-y-3">
            {rows.map((row) => (
              <div
                key={row.id}
                draggable
                onDragStart={() => onDragStart(row.id)}
                onDragOver={(e) => onDragOver(e, row.id)}
                onDragEnd={onDragEnd}
                className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/80 p-3"
              >
                <span className="cursor-grab select-none text-slate-400" title="Sürükle">
                  ⋮⋮
                </span>
                <input
                  className="min-w-[120px] flex-1 rounded border border-slate-200 px-2 py-1.5 text-sm"
                  placeholder="Etiket"
                  value={row.label}
                  onChange={(e) => updateRow(row.id, { label: e.target.value })}
                />
                <select
                  className="rounded border border-slate-200 px-2 py-1.5 text-sm"
                  value={row.pageId}
                  onChange={(e) => {
                    const pid = e.target.value
                    const p = pages.find((x) => x.id === pid)
                    updateRow(row.id, {
                      pageId: pid,
                      url: p ? '' : row.url,
                      label: p && !row.label?.trim() ? p.title : row.label,
                    })
                  }}
                >
                  <option value="">— Sayfa seç (isteğe bağlı) —</option>
                  {pages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} (/{p.slug})
                    </option>
                  ))}
                </select>
                <input
                  className="min-w-[140px] flex-1 rounded border border-slate-200 px-2 py-1.5 font-mono text-xs"
                  placeholder="/ozel-url veya https://..."
                  value={row.url}
                  onChange={(e) => updateRow(row.id, { url: e.target.value, pageId: e.target.value ? '' : row.pageId })}
                  disabled={!!row.pageId}
                />
                <button type="button" className="text-sm text-red-600 hover:underline" onClick={() => removeRow(row.id)}>
                  Sil
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={addRow} className="text-sm font-medium text-accent-blue hover:underline">
              + Öğe ekle
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={save}
              className="ml-auto rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving ? 'Kaydediliyor…' : 'Kaydet'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
