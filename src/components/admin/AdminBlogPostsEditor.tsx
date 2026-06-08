import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, ChevronUp, ExternalLink, Plus, Star, Trash2 } from 'lucide-react'
import { fetchPageContentBundle, savePageContentBundle } from '../../api/pageContentBundle'
import {
  BLOG_POSTS_KEY,
  defaultBlogPostsBundle,
  mergeBlogPostsBundle,
  type BlogPostItem,
  type BlogPostsBundle,
} from '../../data/blogPostsContent'
import { BLOG_COVER_IMAGE_OPTIONS } from '../../lib/blogCoverImage'
import {
  ensureUniqueBlogSlug,
  findDuplicateBlogSlug,
  generateBlogSlugFromTitle,
  normalizeBlogSlug,
} from '../../lib/blogSlug'

function newPost(order: number): BlogPostItem {
  const today = new Date().toISOString().slice(0, 10)
  return {
    id: crypto.randomUUID(),
    title: 'Yeni Blog Yazısı',
    slug: '',
    excerpt: '',
    content: '<p>İçerik buraya gelecek.</p>',
    category: 'Yazılım',
    tags: [],
    status: 'draft',
    publishedAt: today,
    updatedAt: today,
    authorName: 'Woontegra',
    seoTitle: '',
    seoDescription: '',
    order,
    featured: false,
    active: true,
    imageKey: 'default',
  }
}

export function AdminBlogPostsEditor() {
  const [bundle, setBundle] = useState<BlogPostsBundle>(defaultBlogPostsBundle)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    void fetchPageContentBundle(BLOG_POSTS_KEY, defaultBlogPostsBundle, mergeBlogPostsBundle).then((data) => {
      setBundle(data)
      setSelectedId(data.posts[0]?.id ?? null)
      setLoading(false)
    })
  }, [])

  const selectedPost = bundle.posts.find((post) => post.id === selectedId) ?? null

  const duplicateSlug = useMemo(() => {
    if (!selectedPost?.slug) return null
    return findDuplicateBlogSlug(selectedPost.slug, bundle.posts, selectedPost.id)
  }, [bundle.posts, selectedPost])

  const updatePosts = (posts: BlogPostItem[]) => {
    setBundle((prev) => ({
      ...prev,
      posts: posts.map((post, index) => ({ ...post, order: index })),
    }))
  }

  const updateSelected = (patch: Partial<BlogPostItem>) => {
    if (!selectedPost) return
    updatePosts(bundle.posts.map((post) => (post.id === selectedPost.id ? { ...post, ...patch } : post)))
  }

  const handleSave = async () => {
    if (selectedPost?.status === 'published' && !normalizeBlogSlug(selectedPost.slug)) {
      setMessage('Hata: Yayınlanan yazılar için slug zorunludur.')
      return
    }

    setSaving(true)
    setMessage('')
    const payload = mergeBlogPostsBundle(defaultBlogPostsBundle, bundle)
    const result = await savePageContentBundle(BLOG_POSTS_KEY, payload)
    setSaving(false)
    if (result.success) {
      setBundle(payload)
      setMessage('✓ Kaydedildi')
      setTimeout(() => setMessage(''), 3000)
    } else {
      setMessage(`Hata: ${result.message ?? 'Kayıt başarısız'}`)
    }
  }

  const handleDelete = (id: string) => {
    const nextPosts = bundle.posts.filter((post) => post.id !== id)
    updatePosts(nextPosts)
    if (selectedId === id) setSelectedId(nextPosts[0]?.id ?? null)
  }

  if (loading) {
    return <p className="text-sm text-slate-600">Yükleniyor…</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Blog Yazıları</h2>
          <p className="mt-1 text-sm text-slate-500">
            Yayınlanan yazılar /blog listesinde görünür. Taslak yazılar yalnızca admin panelde kalır.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const post = newPost(bundle.posts.length)
              updatePosts([...bundle.posts, post])
              setSelectedId(post.id)
            }}
            className="button-secondary"
          >
            <Plus className="mr-1 inline h-4 w-4" />
            Yeni Yazı
          </button>
          <button type="button" onClick={() => void handleSave()} disabled={saving} className="button disabled:opacity-50">
            {saving ? 'Kaydediliyor…' : 'Kaydet'}
          </button>
        </div>
      </div>

      {message ? (
        <p className={`text-sm ${message.startsWith('Hata') ? 'text-red-600' : 'text-emerald-700'}`}>{message}</p>
      ) : null}

      <div className="card space-y-3">
        <label className="label">Kategoriler (virgülle ayırın, Tümü otomatik eklenir)</label>
        <input
          className="input w-full"
          value={bundle.categories.filter((c) => c !== 'Tümü').join(', ')}
          onChange={(e) => {
            const items = e.target.value
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean)
            setBundle((prev) => ({ ...prev, categories: ['Tümü', ...items] }))
          }}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <div className="card space-y-2">
          <p className="text-sm font-semibold text-slate-700">Yazı Listesi ({bundle.posts.length})</p>
          {bundle.posts.map((post, index) => (
            <button
              key={post.id}
              type="button"
              onClick={() => setSelectedId(post.id)}
              className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                selectedId === post.id
                  ? 'border-emerald-300 bg-emerald-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">{post.title || 'Başlıksız yazı'}</p>
                  <p className="truncate text-xs text-slate-500">{post.slug || 'slug yok'}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {post.featured ? <Star className="h-4 w-4 text-amber-500" /> : null}
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      post.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={(e) => {
                    e.stopPropagation()
                    const posts = [...bundle.posts]
                    ;[posts[index - 1], posts[index]] = [posts[index], posts[index - 1]]
                    updatePosts(posts)
                  }}
                  className="text-slate-400 disabled:opacity-30"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={index === bundle.posts.length - 1}
                  onClick={(e) => {
                    e.stopPropagation()
                    const posts = [...bundle.posts]
                    ;[posts[index], posts[index + 1]] = [posts[index + 1], posts[index]]
                    updatePosts(posts)
                  }}
                  className="text-slate-400 disabled:opacity-30"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </button>
          ))}
        </div>

        {selectedPost ? (
          <div className="card space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-slate-900">Yazı Düzenle</h3>
              <div className="flex flex-wrap items-center gap-2">
                {selectedPost.status === 'published' && normalizeBlogSlug(selectedPost.slug) ? (
                  <a
                    href={`/blog/${selectedPost.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Önizle
                  </a>
                ) : null}
                <button
                  type="button"
                  onClick={() => handleDelete(selectedPost.id)}
                  className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Sil
                </button>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="label">Başlık</label>
                <input
                  className="input w-full"
                  value={selectedPost.title}
                  onChange={(e) => updateSelected({ title: e.target.value })}
                />
              </div>

              <div>
                <label className="label">Slug</label>
                <div className="flex gap-2">
                  <input
                    className="input w-full font-mono text-sm"
                    value={selectedPost.slug}
                    onChange={(e) => updateSelected({ slug: e.target.value })}
                    placeholder="ornek-blog-yazisi"
                  />
                  <button
                    type="button"
                    className="button-secondary shrink-0"
                    onClick={() => {
                      const generated = generateBlogSlugFromTitle(selectedPost.title)
                      updateSelected({ slug: ensureUniqueBlogSlug(generated, bundle.posts, selectedPost.id) })
                    }}
                  >
                    Üret
                  </button>
                </div>
                {duplicateSlug ? (
                  <p className="mt-1 text-xs text-amber-700">
                    Uyarı: Bu slug &quot;{duplicateSlug.title}&quot; yazısıyla çakışıyor.
                  </p>
                ) : null}
              </div>

              <div>
                <label className="label">Durum</label>
                <select
                  className="input w-full"
                  value={selectedPost.status}
                  onChange={(e) =>
                    updateSelected({ status: e.target.value as BlogPostItem['status'] })
                  }
                >
                  <option value="draft">Taslak</option>
                  <option value="published">Yayında</option>
                </select>
              </div>

              <div>
                <label className="label">Kategori</label>
                <select
                  className="input w-full"
                  value={selectedPost.category}
                  onChange={(e) => updateSelected({ category: e.target.value })}
                >
                  {bundle.categories
                    .filter((c) => c !== 'Tümü')
                    .map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="label">Kapak görseli</label>
                <select
                  className="input w-full"
                  value={selectedPost.imageKey}
                  onChange={(e) => updateSelected({ imageKey: e.target.value })}
                >
                  {BLOG_COVER_IMAGE_OPTIONS.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Yayın tarihi</label>
                <input
                  type="date"
                  className="input w-full"
                  value={selectedPost.publishedAt?.slice(0, 10) || ''}
                  onChange={(e) => updateSelected({ publishedAt: e.target.value, updatedAt: e.target.value })}
                />
              </div>

              <div>
                <label className="label">Yazar</label>
                <input
                  className="input w-full"
                  value={selectedPost.authorName}
                  onChange={(e) => updateSelected({ authorName: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="label">Kısa açıklama (excerpt)</label>
                <textarea
                  className="input w-full min-h-[80px]"
                  value={selectedPost.excerpt}
                  onChange={(e) => updateSelected({ excerpt: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="label">İçerik (HTML)</label>
                <textarea
                  className="input w-full min-h-[220px] font-mono text-sm"
                  value={selectedPost.content}
                  onChange={(e) => updateSelected({ content: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="label">Etiketler (virgülle ayırın)</label>
                <input
                  className="input w-full"
                  value={selectedPost.tags.join(', ')}
                  onChange={(e) =>
                    updateSelected({
                      tags: e.target.value
                        .split(',')
                        .map((tag) => tag.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </div>

              <div>
                <label className="label">SEO title</label>
                <input
                  className="input w-full"
                  value={selectedPost.seoTitle}
                  onChange={(e) => updateSelected({ seoTitle: e.target.value })}
                  placeholder="Boşsa başlık + Woontegra"
                />
              </div>

              <div>
                <label className="label">SEO description</label>
                <input
                  className="input w-full"
                  value={selectedPost.seoDescription}
                  onChange={(e) => updateSelected({ seoDescription: e.target.value })}
                  placeholder="Boşsa excerpt kullanılır"
                />
              </div>

              <div className="md:col-span-2 flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedPost.featured}
                    onChange={(e) => updateSelected({ featured: e.target.checked })}
                  />
                  Öne çıkar
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedPost.active}
                    onChange={(e) => updateSelected({ active: e.target.checked })}
                  />
                  Aktif
                </label>
              </div>
            </div>
          </div>
        ) : (
          <div className="card text-sm text-slate-500">Düzenlemek için listeden bir yazı seçin.</div>
        )}
      </div>
    </div>
  )
}
