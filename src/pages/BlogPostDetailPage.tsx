import { useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Share2, Facebook, Twitter, Linkedin } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { BlogPostHero } from '../components/blog/BlogPostHero'
import {
  findBlogPostBySlug,
  formatBlogDate,
  getBlogListCategories,
  getPublicBlogPosts,
} from '../data/blogPostsContent'
import { useBlogPosts } from '../hooks/useBlogPosts'
import { resolveBlogCoverImage } from '../lib/blogCoverImage'
import { normalizeBlogSlug } from '../lib/blogSlug'

export function BlogPostDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { bundle, loaded } = useBlogPosts()

  const post = slug ? findBlogPostBySlug(bundle, slug, true) : undefined
  const publishedPosts = useMemo(() => getPublicBlogPosts(bundle), [bundle])
  const categories = useMemo(() => getBlogListCategories(bundle).filter((c) => c !== 'Tümü'), [bundle])

  const otherPosts = publishedPosts
    .filter((item) => slug && normalizeBlogSlug(item.slug) !== normalizeBlogSlug(slug))
    .slice(0, 3)

  useEffect(() => {
    if (!post) return

    const title = post.seoTitle?.trim() || `${post.title} | Woontegra`
    const description = post.seoDescription?.trim() || post.excerpt

    document.title = title

    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', description)

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', `${window.location.origin}/blog/${post.slug}`)
  }, [post])

  if (!loaded) {
    return (
      <div className="py-24 text-center text-slate-500">
        <p>Yükleniyor…</p>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Yazı bulunamadı</h1>
        <p className="mt-3 text-slate-600">
          Aradığınız blog yazısı yayından kaldırılmış, taslak durumunda veya mevcut değil.
        </p>
        <Link to="/blog" className="mt-6 inline-block font-semibold text-emerald-700 hover:text-emerald-800">
          ← Blog'a Dön
        </Link>
      </div>
    )
  }

  const coverImage = resolveBlogCoverImage(post.imageKey, post.slug)
  const contentHtml = post.content?.trim() || `<p>${post.excerpt}</p>`

  return (
    <div className="bg-slate-50">
      <BlogPostHero
        image={coverImage}
        title={post.title}
        category={post.category}
        date={formatBlogDate(post.publishedAt)}
        authorName={post.authorName}
      />

      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <article className="rounded-3xl bg-white p-8 shadow-lg md:p-12">
              <div
                className="prose prose-lg max-w-none prose-headings:text-slate-900 prose-h2:mb-6 prose-h2:mt-12 prose-h2:text-3xl prose-h2:font-bold prose-h3:mb-4 prose-h3:mt-8 prose-h3:text-2xl prose-h3:font-bold prose-p:mb-6 prose-p:leading-relaxed prose-p:text-slate-700"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />

              {post.tags.length > 0 ? (
                <div className="mt-10 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-16 border-t border-gray-200 pt-8">
                <h3 className="mb-4 text-xl font-bold text-slate-900">Paylaş</h3>
                <div className="flex gap-4">
                  <button type="button" className="rounded-lg bg-blue-600 p-3 text-white transition-colors hover:bg-blue-700">
                    <Facebook className="h-5 w-5" />
                  </button>
                  <button type="button" className="rounded-lg bg-sky-500 p-3 text-white transition-colors hover:bg-sky-600">
                    <Twitter className="h-5 w-5" />
                  </button>
                  <button type="button" className="rounded-lg bg-blue-700 p-3 text-white transition-colors hover:bg-blue-800">
                    <Linkedin className="h-5 w-5" />
                  </button>
                  <button type="button" className="rounded-lg bg-slate-200 p-3 text-slate-700 transition-colors hover:bg-slate-300">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </article>

            <div className="mt-12 rounded-3xl bg-gradient-to-br from-slate-900 to-gray-800 p-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white">Projeniz İçin Destek mi Arıyorsunuz?</h2>
              <p className="mb-8 text-xl text-gray-300">Size özel çözümler geliştirmek için iletişime geçin.</p>
              <Button variant="green" to="/iletisim" className="px-10 py-4 text-lg">
                İletişime Geç
              </Button>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="space-y-8 lg:sticky lg:top-8">
              <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
                <h3 className="mb-6 text-2xl font-bold text-slate-900">Diğer Yazılar</h3>
                <div className="space-y-4">
                  {otherPosts.length ? (
                    otherPosts.map((other) => (
                      <Link
                        key={other.id}
                        to={`/blog/${other.slug}`}
                        className="block rounded-xl border border-gray-100 p-4 transition-colors hover:bg-slate-50"
                      >
                        <div className="mb-2 text-xs font-semibold text-green-600">{other.category}</div>
                        <h4 className="font-semibold text-slate-900 transition-colors hover:text-green-600">
                          {other.title}
                        </h4>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">Başka yayınlanmış yazı bulunmuyor.</p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
                <h3 className="mb-6 text-2xl font-bold text-slate-900">Kategoriler</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      to={`/blog?category=${encodeURIComponent(category)}`}
                      className="block rounded-lg px-4 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
