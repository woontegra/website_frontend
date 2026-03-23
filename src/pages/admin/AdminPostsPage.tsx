import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '../../api/cms'

type PostRow = {
  id: string
  slug: string
  title: string
  status: string
  category: { name: string } | null
  updatedAt: string
}

export function AdminPostsPage() {
  const [list, setList] = useState<PostRow[]>([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    adminApi<PostRow[]>('/posts').then((r) => {
      if (r.success && r.data) setList(r.data)
      else setMsg(r.message ?? 'Hata')
      setLoading(false)
    })
  }, [])

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Yazılar</h1>
        <Link
          to="/admin/yazilar/yeni"
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          + Yeni yazı
        </Link>
      </div>
      {msg && <p className="mb-4 text-sm text-slate-600">{msg}</p>}
      {loading ? (
        <p className="text-slate-500">Yükleniyor…</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-700">Başlık</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Slug</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Kategori</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Durum</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-slate-900">{p.title}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{p.slug}</td>
                  <td className="px-4 py-3 text-slate-600">{p.category?.name ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={p.status === 'published' ? 'text-green-600' : 'text-amber-600'}>
                      {p.status === 'published' ? 'Yayında' : 'Taslak'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/admin/yazilar/${p.id}`} className="font-medium text-accent-blue hover:underline">
                      Düzenle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="p-8 text-center text-slate-500">Henüz yazı yok.</p>}
        </div>
      )}
    </div>
  )
}
