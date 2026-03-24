import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { resolveMediaSrc } from '../api/cms'
import { LAYOUT_CONTAINER_CLASS } from '../lib/layoutConstants'
import { getApiUrl } from '../config/api'

const base = () => getApiUrl()

type PostApi = {
  title: string
  slug: string
  excerpt: string | null
  bodyHtml: string | null
  featuredImage: string | null
  category: { name: string; slug: string } | null
  publishedAt: string | null
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<PostApi | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(false)

  useEffect(() => {
    if (!slug) return
    let ok = true
    setLoading(true)
    fetch(`${base()}/api/blog/posts/${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((j) => {
        if (!ok) return
        if (j.success && j.data) {
          setPost(j.data as PostApi)
          setErr(false)
        } else setErr(true)
        setLoading(false)
      })
      .catch(() => {
        if (ok) {
          setErr(true)
          setLoading(false)
        }
      })
    return () => {
      ok = false
    }
  }, [slug])

  useEffect(() => {
    if (!post) return
    document.title = `${post.title} | Woontegra`
  }, [post])

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-500">
        <p>Yükleniyor…</p>
      </div>
    )
  }

  if (err || !post) {
    return (
      <div className="py-16 text-center">
        <p className="text-surface-600">Yazı bulunamadı.</p>
        <Link to="/blog" className="mt-4 inline-block text-accent-blue">
          ← Bloga dön
        </Link>
      </div>
    )
  }

  const img = post.featuredImage ? resolveMediaSrc(post.featuredImage) : ''

  return (
    <article className="pb-16 pt-8 md:pb-24 md:pt-12">
      <div className={LAYOUT_CONTAINER_CLASS}>
        <Link to="/blog" className="mb-6 inline-block text-sm text-surface-600 hover:text-heading">
          ← Blog
        </Link>
        {post.category ? (
          <span className="mb-4 inline-block rounded-full bg-accent-blue-soft px-3 py-1 text-xs font-semibold text-accent-blue">
            {post.category.name}
          </span>
        ) : null}
        <h1 className="text-3xl font-bold text-heading md:text-4xl">{post.title}</h1>
        {post.publishedAt ? (
          <p className="mt-2 text-sm text-surface-500">
            {new Date(post.publishedAt).toLocaleDateString('tr-TR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        ) : null}
        {post.excerpt ? <p className="mt-6 text-lg text-surface-600">{post.excerpt}</p> : null}
        {img ? (
          <div className="my-10 overflow-hidden rounded-2xl border border-slate-200">
            <img src={img} alt="" className="max-h-[420px] w-full object-cover" />
          </div>
        ) : null}
        <div
          className="cms-content mt-8 max-w-none text-slate-700 [&_a]:text-accent-blue [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6"
          dangerouslySetInnerHTML={{
            __html: post.bodyHtml || '<p>İçerik yakında.</p>',
          }}
        />
      </div>
    </article>
  )
}
