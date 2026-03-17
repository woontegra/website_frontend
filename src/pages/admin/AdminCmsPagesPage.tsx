import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '../../api/cms'

interface PageRow {
  id: string
  slug: string
  title: string
  isActive: boolean
  updatedAt: string
}

export function AdminCmsPagesPage() {
  const [pages, setPages] = useState<PageRow[]>([])
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    adminApi<PageRow[]>('/pages')
      .then((r) => {
        if (r.success && r.data) setPages(r.data as unknown as PageRow[])
        else setErr(r.message ?? 'Liste alınamadı')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">CMS — Sayfalar</h1>
        <Link
          to="/admin/cms/yeni"
          className="px-4 py-2 rounded-xl bg-accent-blue text-white font-semibold text-sm hover:opacity-95"
        >
          + Yeni sayfa
        </Link>
      </div>
      {err && <p className="mb-4 text-red-600 text-sm">{err}</p>}
      <p className="text-sm text-slate-500 mb-4">
        Önce <Link to="/admin/giris" className="text-accent-blue font-medium">/admin/giris</Link> ile yönetici girişi yapın (
        <code className="bg-slate-100 px-1 rounded">info@woontegra.com</code> — seed şifresi)
      </p>
      {loading ? (
        <p className="text-slate-500">Yükleniyor…</p>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-semibold text-slate-700">Başlık</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Slug</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Durum</th>
                <th className="px-6 py-3 font-semibold text-slate-700" />
              </tr>
            </thead>
            <tbody>
              {pages.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-slate-50/80">
                  <td className="px-6 py-4 font-medium text-slate-900">{p.title}</td>
                  <td className="px-6 py-4 text-slate-600 font-mono text-xs">{p.slug}</td>
                  <td className="px-6 py-4">
                    <span className={p.isActive ? 'text-green-600' : 'text-slate-400'}>{p.isActive ? 'Aktif' : 'Pasif'}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/admin/cms/${p.id}`} className="text-accent-blue font-medium hover:underline">
                      Düzenle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
