import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { adminApi, resolveMediaSrc } from '../../api/cms'
import { MediaLibraryModal } from '../../components/admin/MediaLibraryModal'
import { RichTextEditor } from '../../components/admin/RichTextEditor'

type Cat = { id: string; slug: string; name: string }
type PostData = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  bodyHtml: string | null
  featuredImage: string | null
  status: string
  categoryId: string | null
}

export function AdminPostEditPage() {
  const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()
  const isNew = postId === 'yeni'

  const [cats, setCats] = useState<Cat[]>([])
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [mediaOpen, setMediaOpen] = useState(false)

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [bodyHtml, setBodyHtml] = useState('')
  const [featuredImage, setFeaturedImage] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [status, setStatus] = useState<'draft' | 'published'>('draft')

  useEffect(() => {
    adminApi<Cat[]>('/post-categories').then((r) => {
      if (r.success && r.data) setCats(r.data)
    })
  }, [])

  const load = useCallback(() => {
    if (!postId || isNew) return
    setLoading(true)
    adminApi<PostData>(`/posts/${postId}`).then((r) => {
      if (r.success && r.data) {
        const p = r.data
        setTitle(p.title)
        setSlug(p.slug)
        setExcerpt(p.excerpt ?? '')
        setBodyHtml(p.bodyHtml ?? '')
        setFeaturedImage(p.featuredImage ?? '')
        setCategoryId(p.categoryId ?? '')
        setStatus(p.status === 'published' ? 'published' : 'draft')
        setMsg('')
      } else setMsg(r.message ?? 'Yüklenemedi')
      setLoading(false)
    })
  }, [postId, isNew])

  useEffect(() => {
    if (isNew) {
      setLoading(false)
      return
    }
    load()
  }, [load, isNew])

  const save = async () => {
    if (!title.trim() || !slug.trim()) {
      setMsg('Başlık ve slug gerekli')
      return
    }
    setSaving(true)
    setMsg('')
    const body = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt || null,
      bodyHtml,
      featuredImage: featuredImage || null,
      categoryId: categoryId || null,
      status,
    }
    if (isNew) {
      const r = await adminApi<{ id: string }>('/posts', { method: 'POST', body: JSON.stringify(body) })
      setSaving(false)
      if (r.success && r.data) navigate(`/admin/yazilar/${(r.data as { id: string }).id}`, { replace: true })
      else setMsg(r.message ?? 'Hata')
      return
    }
    const r = await adminApi(`/posts/${postId}`, { method: 'PUT', body: JSON.stringify(body) })
    setSaving(false)
    if (r.success) setMsg('Kaydedildi')
    else setMsg(r.message ?? 'Hata')
  }

  if (loading) return <p className="text-slate-500">Yükleniyor…</p>

  const img = featuredImage ? resolveMediaSrc(featuredImage) : ''

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/admin/yazilar" className="mb-6 inline-block text-sm font-medium text-slate-600 hover:text-slate-900">
        ← Yazılar
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">{isNew ? 'Yeni yazı' : 'Yazıyı düzenle'}</h1>
      {msg && <p className="mb-4 text-sm text-slate-600">{msg}</p>}

      <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Başlık</label>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Slug</label>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Kategori</label>
            <select
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">— Yok —</option>
              {cats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Durum</label>
            <select
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
            >
              <option value="draft">Taslak</option>
              <option value="published">Yayında</option>
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Özet</label>
          <textarea
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">İçerik</label>
          <RichTextEditor value={bodyHtml} onChange={setBodyHtml} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Öne çıkan görsel</label>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setMediaOpen(true)}
              className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium hover:bg-slate-200"
            >
              Medyadan seç
            </button>
            {img ? <img src={img} alt="" className="h-16 rounded-lg border object-cover" /> : null}
            {featuredImage ? (
              <button type="button" className="text-sm text-red-600" onClick={() => setFeaturedImage('')}>
                Kaldır
              </button>
            ) : null}
          </div>
        </div>
        <div className="flex justify-end border-t border-slate-100 pt-6">
          <button
            type="button"
            disabled={saving}
            onClick={save}
            className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? 'Kaydediliyor…' : 'Kaydet'}
          </button>
        </div>
      </div>

      <MediaLibraryModal open={mediaOpen} onClose={() => setMediaOpen(false)} onPick={(u) => { setFeaturedImage(u); setMediaOpen(false) }} />
    </div>
  )
}
