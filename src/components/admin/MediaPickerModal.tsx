import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { catalogMediaAdminApi, type CatalogMedia, type CatalogMediaFileType } from '../../api/catalog-media-admin'
import { resolveCatalogMediaPreviewUrl } from '../../lib/resolveCatalogMediaPreviewUrl'
import { MediaThumb } from '../ui/MediaThumb'

type Props = {
  open: boolean
  title: string
  /** Kapak: IMAGE. Program: DOWNLOAD ve DOCUMENT */
  allowedTypes: CatalogMediaFileType[]
  onClose: () => void
  onSelect: (media: CatalogMedia) => void
}

export function MediaPickerModal({ open, title, allowedTypes, onClose, onSelect }: Props) {
  const [items, setItems] = useState<CatalogMedia[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    void (async () => {
      setError(null)
      setLoading(true)
      try {
        const lists = await Promise.all(
          allowedTypes.map((t) => catalogMediaAdminApi.list(t)),
        )
        if (cancelled) return
        const merged = lists.flat().sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        setItems(merged)
      } catch {
        if (!cancelled) setError('Medya listesi yüklenemedi.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [open, allowedTypes])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[85vh] w-full max-w-3xl flex-col rounded-xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            aria-label="Kapat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-4">
          {loading && <div className="py-12 text-center text-slate-500">Yükleniyor…</div>}
          {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</div>}
          {!loading && !error && items.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-600">Bu türde dosya yok. Önce Medya Kütüphanesinden yükleyin.</p>
          )}
          <ul className="divide-y divide-slate-100">
            {items.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(m)
                    onClose()
                  }}
                  className="flex w-full items-center gap-3 px-2 py-3 text-left hover:bg-slate-50"
                >
                  {m.fileType === 'IMAGE' ? (
                    <MediaThumb
                      url={m.url}
                      fileType={m.fileType}
                      className="h-14 w-20"
                      resolveUrl={resolveCatalogMediaPreviewUrl}
                    />
                  ) : (
                    <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded border border-slate-200 bg-slate-100 text-xs font-medium text-slate-600">
                      {m.fileType}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-slate-900">{m.originalName}</div>
                    <div className="text-xs text-slate-500">
                      {(m.fileSize / 1024).toFixed(1)} KB · {m.mimeType}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
