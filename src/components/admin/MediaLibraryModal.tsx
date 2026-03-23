import { useCallback, useEffect, useState } from 'react'
import { adminListMedia, adminUploadMedia, resolveMediaSrc, type MediaAssetRow } from '../../api/cms'

type Props = {
  open: boolean
  onClose: () => void
  onPick: (url: string) => void
}

export function MediaLibraryModal({ open, onClose, onPick }: Props) {
  const [items, setItems] = useState<MediaAssetRow[]>([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    adminListMedia().then((r) => {
      if (r.success && r.data) setItems(r.data)
      else setMsg(r.message ?? 'Liste alınamadı')
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (open) {
      setMsg('')
      load()
    }
  }, [open, load])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal>
      <div className="flex max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-900">Medya kütüphanesi</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
          >
            Kapat
          </button>
        </div>
        <div className="border-b border-slate-100 px-4 py-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800">
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
                if (r.success && r.data) {
                  setMsg('')
                  load()
                  onPick(r.data.url)
                } else setMsg(r.message ?? 'Yükleme başarısız')
              }}
            />
            Görsel yükle
          </label>
          {msg ? <p className="mt-2 text-xs text-amber-700">{msg}</p> : null}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {loading ? (
            <p className="text-sm text-slate-500">Yükleniyor…</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-slate-500">Henüz görsel yok. Yukarıdan yükleyin.</p>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {items.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    onPick(m.url)
                    onClose()
                  }}
                  className="group overflow-hidden rounded-xl border border-slate-200 bg-slate-50 text-left transition hover:border-slate-400 hover:ring-2 hover:ring-slate-300"
                >
                  <div className="aspect-square bg-slate-100">
                    <img
                      src={resolveMediaSrc(m.url)}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <p className="truncate p-1.5 text-[10px] text-slate-600">{m.filename}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
