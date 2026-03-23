import { useEffect, useState } from 'react'
import { adminApi } from '../../api/cms'

type Cat = { id: string; slug: string; name: string; description: string | null; _count?: { posts: number } }

export function AdminCategoriesPage() {
  const [list, setList] = useState<Cat[]>([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const [slug, setSlug] = useState('')
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')

  const load = () => {
    setLoading(true)
    adminApi<Cat[]>('/post-categories').then((r) => {
      if (r.success && r.data) setList(r.data)
      else setMsg(r.message ?? 'Hata')
      setLoading(false)
    })
  }

  useEffect(() => {
    load()
  }, [])

  const create = async () => {
    if (!slug.trim() || !name.trim()) {
      setMsg('Slug ve ad gerekli')
      return
    }
    const r = await adminApi('/post-categories', {
      method: 'POST',
      body: JSON.stringify({ slug: slug.trim(), name: name.trim(), description: desc || null }),
    })
    if (r.success) {
      setSlug('')
      setName('')
      setDesc('')
      setMsg('Eklendi')
      load()
    } else setMsg(r.message ?? 'Hata')
  }

  const remove = async (id: string) => {
    if (!confirm('Kategori silinsin mi?')) return
    const r = await adminApi(`/post-categories/${id}`, { method: 'DELETE' })
    if (r.success) load()
    else setMsg(r.message ?? 'Silinemedi')
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Kategoriler</h1>
      {msg && <p className="mb-4 text-sm text-slate-600">{msg}</p>}

      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">Yeni kategori</h2>
        <div className="flex flex-wrap gap-2">
          <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
          <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Ad" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="min-w-[200px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Açıklama" value={desc} onChange={(e) => setDesc(e.target.value)} />
          <button type="button" onClick={create} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">
            Ekle
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-slate-500">Yükleniyor…</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-600">
            <tr>
              <th className="py-2 pr-4">Ad</th>
              <th className="py-2 pr-4">Slug</th>
              <th className="py-2 pr-4">Yazı</th>
              <th className="py-2 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id} className="border-b border-slate-100">
                <td className="py-3 font-medium text-slate-900">{c.name}</td>
                <td className="py-3 font-mono text-xs text-slate-600">{c.slug}</td>
                <td className="py-3 text-slate-600">{c._count?.posts ?? 0}</td>
                <td className="py-3 text-right">
                  <button type="button" className="text-red-600 hover:underline" onClick={() => remove(c.id)}>
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
