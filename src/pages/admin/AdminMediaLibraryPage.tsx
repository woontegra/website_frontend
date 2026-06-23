import { useEffect, useRef, useState } from 'react'
import { Trash2, Upload } from 'lucide-react'
import { catalogMediaAdminApi, type CatalogMedia } from '../../api/catalog-media-admin'
import { MediaThumb } from '../../components/ui/MediaThumb'
import { resolveCatalogMediaPreviewUrl } from '../../lib/resolveCatalogMediaPreviewUrl'

export function AdminMediaLibraryPage() {
  const [items, setItems] = useState<CatalogMedia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    setError(null)
    try {
      setLoading(true)
      const data = await catalogMediaAdminApi.list()
      setItems(data)
    } catch {
      setError('Liste yüklenemedi.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      await catalogMediaAdminApi.upload(file)
      await load()
    } catch {
      setError('Yükleme başarısız.')
    } finally {
      setUploading(false)
    }
  }

  const remove = async (m: CatalogMedia) => {
    if (!confirm(`“${m.originalName}” silinsin mi?`)) return
    try {
      await catalogMediaAdminApi.remove(m.id)
      await load()
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null
      setError(typeof msg === 'string' ? msg : 'Silinemedi.')
    }
  }

  return (
    <div className="w-full min-w-0 space-y-6">
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="page-title">Medya kütüphanesi</h1>
          <p className="mt-1 text-sm text-slate-600">Görseller ve indirilebilir program dosyaları. Dosyalar sunucuda saklanır.</p>
        </div>
        <div className="w-full shrink-0 sm:w-auto">
          <input ref={inputRef} type="file" className="hidden" onChange={onFile} />
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 sm:w-auto"
          >
            <Upload className="h-4 w-4" />
            {uploading ? 'Yükleniyor…' : 'Dosya yükle'}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="py-16 text-center text-slate-500">Yükleniyor…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[800px] w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-4 py-3">Önizleme</th>
                  <th className="px-4 py-3">Dosya</th>
                  <th className="px-4 py-3">Tür</th>
                  <th className="px-4 py-3">Boyut</th>
                  <th className="px-4 py-3">Yol</th>
                  <th className="px-4 py-3 w-24">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {items.map((m) => (
                  <tr key={m.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3">
                      {m.fileType === 'IMAGE' ? (
                        <MediaThumb
                          url={m.url}
                          fileType={m.fileType}
                          className="h-12 w-16"
                          resolveUrl={resolveCatalogMediaPreviewUrl}
                        />
                      ) : (
                        <span className="text-xs text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">{m.originalName}</td>
                    <td className="px-4 py-3 text-slate-600">{m.fileType}</td>
                    <td className="px-4 py-3 text-slate-600">{(m.fileSize / 1024).toFixed(1)} KB</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{m.url}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => remove(m)}
                        className="inline-flex rounded-lg border border-red-200 p-2 text-red-700 hover:bg-red-50"
                        title="Sil"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && items.length === 0 && (
          <div className="px-6 py-14 text-center text-slate-500">Henüz dosya yok.</div>
        )}
      </div>
    </div>
  )
}
