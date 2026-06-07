import { useCallback, useEffect, useState } from 'react'
import { adminListMedia, resolveMediaSrc, type MediaAssetRow } from '../../api/cms'
import { PUBLIC_IMAGE_OPTIONS } from '../../data/publicImages'

export function AdminMediaPage() {
  const [items, setItems] = useState<MediaAssetRow[]>([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    adminListMedia().then((r) => {
      if (r.success && r.data) setItems(r.data ?? [])
      else setMsg(r.message ?? 'Liste alınamadı')
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Medya</h1>
      {msg && <p className="mb-4 text-amber-700 text-sm">{msg}</p>}
      <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        Bilgisayardan yükleme kapalı. Kurumsal site görselleri{' '}
        <code className="rounded bg-white px-1">frontend/public/images</code> klasöründen gelir (
        {PUBLIC_IMAGE_OPTIONS.length} dosya). İçerik düzenleme modallarından seçim yapın.
      </div>
      {loading ? (
        <p className="text-slate-500">Yükleniyor…</p>
      ) : items.length === 0 ? (
        <p className="text-slate-500 py-12 text-center">Henüz görsel yok. Yukarıdan yükleyin.</p>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
          {items.map((m) => (
            <div
              key={m.id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-slate-100">
                <img
                  src={resolveMediaSrc(m.url)}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-2">
                <p className="truncate text-xs text-slate-600" title={m.filename}>{m.filename}</p>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(resolveMediaSrc(m.url))
                    setMsg('URL panoya kopyalandı')
                    setTimeout(() => setMsg(''), 2000)
                  }}
                  className="mt-1 text-xs text-accent-blue hover:underline"
                >
                  URL kopyala
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
