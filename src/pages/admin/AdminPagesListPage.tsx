import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '../../api/cms'

interface PageRow {
  id: string
  slug: string
  title: string
  status?: string
  updatedAt: string
}

export function AdminPagesListPage() {
  const [pages, setPages] = useState<PageRow[]>([])
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    adminApi<PageRow[]>('/pages')
      .then((r) => {
        if (r.success && r.data) setPages(r.data as PageRow[])
        else setErr(r.message ?? 'Liste alınamadı')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const statusLabel = (p: PageRow) => {
    if (p.status === 'draft') return <span className="text-amber-600">Taslak</span>
    return <span className="text-green-600">Yayında</span>
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Sayfalar</h1>
        <Link
          to="/admin/sayfalar/yeni/edit"
          className="rounded-xl bg-green-500 px-6 py-3 text-sm font-semibold text-white hover:bg-green-600 shadow-lg shadow-green-500/20"
        >
          + Yeni Sayfa
        </Link>
      </div>
      {err && <p className="mb-4 text-sm text-red-600">{err}</p>}
      {loading ? (
        <p className="text-slate-500">Yükleniyor…</p>
      ) : (
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-6 py-3 font-semibold text-slate-700">Başlık</th>
                <th className="px-6 py-3 font-semibold text-slate-700">URL</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Durum</th>
                <th className="px-6 py-3 text-right font-semibold text-slate-700">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 last:border-0 hover:bg-slate-50/80">
                  <td className="px-6 py-4 font-medium text-slate-900">{p.title}</td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-600">/{p.slug}</td>
                  <td className="px-6 py-4">{statusLabel(p)}</td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/admin/sayfalar/${p.id}/edit`} className="font-medium text-green-600 hover:text-green-700 hover:underline">
                      Düzenle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pages.length === 0 && <p className="py-12 text-center text-slate-500">Henüz sayfa yok.</p>}
        </section>
      )}
    </div>
  )
}
