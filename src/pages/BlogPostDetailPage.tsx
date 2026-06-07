import { Link, useParams } from 'react-router-dom'
import { Share2, Facebook, Twitter, Linkedin } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { BlogPostHero } from '../components/blog/BlogPostHero'
import { defaultBlogData } from '../data/allPagesData'
import { getBlogPostContent } from '../data/blogPostContent'
import { usePageSection } from '../hooks/usePageSection'
import type { BlogPost, BlogPostsSectionData } from '../types/sections'

function normalizeSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
}

function findPostBySlug(posts: BlogPost[], slug: string): BlogPost | undefined {
  const normalized = normalizeSlug(slug)
  return posts.find((post) => normalizeSlug(post.slug) === normalized)
}

export function BlogPostDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: blogData, loaded } = usePageSection<BlogPostsSectionData>('blog', 'blog-posts', defaultBlogData)

  const posts = blogData?.posts ?? []
  const post = slug ? findPostBySlug(posts, slug) : undefined
  const categories = (blogData?.categories ?? []).filter((c) => c !== 'Tümü')
  const otherPosts = posts.filter((p) => slug && normalizeSlug(p.slug) !== normalizeSlug(slug)).slice(0, 3)

  if (!loaded) {
    return (
      <div className="py-24 text-center text-slate-500">
        <p>Yükleniyor…</p>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-600">Yazı bulunamadı.</p>
        <Link to="/blog" className="mt-4 inline-block text-green-600 hover:text-green-700">
          ← Blog'a Dön
        </Link>
      </div>
    )
  }

  const content = getBlogPostContent(post.slug, post.excerpt)

  return (
    <div className="bg-slate-50">
      <BlogPostHero
        image={post.image}
        title={post.title}
        category={post.category}
        date={post.date}
      />

      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <article className="rounded-3xl bg-white p-8 shadow-lg md:p-12">
              <div
                className="prose prose-lg max-w-none prose-headings:text-slate-900 prose-h2:mb-6 prose-h2:mt-12 prose-h2:text-3xl prose-h2:font-bold prose-h3:mb-4 prose-h3:mt-8 prose-h3:text-2xl prose-h3:font-bold prose-p:mb-6 prose-p:leading-relaxed prose-p:text-slate-700"
                dangerouslySetInnerHTML={{ __html: content }}
              />

              <div className="mt-16 border-t border-gray-200 pt-8">
                <h3 className="mb-4 text-xl font-bold text-slate-900">Paylaş</h3>
                <div className="flex gap-4">
                  <button className="rounded-lg bg-blue-600 p-3 text-white transition-colors hover:bg-blue-700">
                    <Facebook className="h-5 w-5" />
                  </button>
                  <button className="rounded-lg bg-sky-500 p-3 text-white transition-colors hover:bg-sky-600">
                    <Twitter className="h-5 w-5" />
                  </button>
                  <button className="rounded-lg bg-blue-700 p-3 text-white transition-colors hover:bg-blue-800">
                    <Linkedin className="h-5 w-5" />
                  </button>
                  <button className="rounded-lg bg-slate-200 p-3 text-slate-700 transition-colors hover:bg-slate-300">
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
                  {otherPosts.map((other) => (
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
                  ))}
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
