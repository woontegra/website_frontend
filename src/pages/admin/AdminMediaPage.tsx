import { useCallback, useEffect, useState } from 'react'
import { adminListMedia, adminUploadMedia, resolveMediaSrc, type MediaAssetRow } from '../../api/cms'

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
      <div className="mb-4">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0]
              e.target.value = ''
              if (!f) return
              setMsg('Yükleniyor…')
              const r = await adminUploadMedia(f)
              if (r.success) {
                setMsg('')
                load()
              } else setMsg(r.message ?? 'Yükleme başarısız')
            }}
          />
          + Görsel yükle
        </label>
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
