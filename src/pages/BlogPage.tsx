import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, BookOpen } from 'lucide-react'
import { BlogCoverImage } from '../components/blog/BlogCoverImage'
import { PageHero } from '../components/page/PageHero'
import { CTASection } from '../components/page/CTASection'
import { SectionHeader } from '../components/ui/SectionHeader'
import { defaultBlogData } from '../data/allPagesData'
import { formatBlogDate, getBlogListCategories, getPublicBlogPosts } from '../data/blogPostsContent'
import { frontendImages } from '../data/frontendImages'
import { useBlogPosts } from '../hooks/useBlogPosts'
import { useHeroSection } from '../hooks/useHeroSection'
import { resolveBlogCoverImage } from '../lib/blogCoverImage'
import { LAYOUT_CONTAINER_CLASS } from '../lib/layoutConstants'
import { SURFACE_MUTED } from '../lib/sectionSurfaces'

export function BlogPage() {
  const { heroData } = useHeroSection('blog', defaultBlogData)
  const { bundle, loaded } = useBlogPosts()
  const [searchParams] = useSearchParams()
  const initialCategory = searchParams.get('category') || 'Tümü'
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'Tümü')
  }, [searchParams])

  useEffect(() => {
    document.title = 'Blog | Woontegra'
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute(
      'content',
      'Yazılım, e-ticaret, SaaS ve dijital büyüme hakkında Woontegra blog yazıları ve rehberler.',
    )
  }, [])

  const heroTitle = heroData?.title || 'Bilgi, Deneyim ve Dijital İçerikler'
  const heroSubtitle =
    heroData?.subtitle ||
    'Yazılım, e-ticaret ve dijital sistemler hakkında güncel içerikler ve rehberler.'

  const publishedPosts = useMemo(() => getPublicBlogPosts(bundle), [bundle])
  const categories = useMemo(() => getBlogListCategories(bundle), [bundle])
  const featuredPost = publishedPosts.find((post) => post.featured) ?? publishedPosts[0]

  const filteredPosts =
    selectedCategory === 'Tümü'
      ? publishedPosts
      : publishedPosts.filter((post) => post.category === selectedCategory)

  const listPosts = filteredPosts.filter((post) => post.id !== featuredPost?.id || selectedCategory !== 'Tümü')

  return (
    <div className="bg-white">
      <PageHero
        eyebrow="Blog"
        title={heroTitle}
        description={heroSubtitle}
        image={frontendImages.pages.blog}
        imageAlt="Woontegra blog"
        highlights={[{ title: 'Uzman içerikler' }, { title: 'Dijital büyüme rehberleri' }]}
      />

      {featuredPost && selectedCategory === 'Tümü' ? (
        <section className={`${SURFACE_MUTED} py-20 md:py-24`}>
          <div className={LAYOUT_CONTAINER_CLASS}>
            <SectionHeader eyebrow="Öne Çıkan" title="Editörün Seçimi" centered />
            <Link
              to={`/blog/${featuredPost.slug}`}
              className="group block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg transition-all hover:shadow-xl"
            >
              <div className="grid lg:grid-cols-2">
                <BlogCoverImage
                  src={resolveBlogCoverImage(featuredPost.imageKey, featuredPost.slug)}
                  alt={featuredPost.title}
                  category={featuredPost.category}
                  className="aspect-video lg:min-h-[300px] lg:aspect-auto"
                />
                <div className="flex flex-col justify-center p-8 md:p-12">
                  <p className="text-sm font-semibold text-emerald-600">{featuredPost.category}</p>
                  <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 transition-colors group-hover:text-emerald-700 md:text-3xl">
                    {featuredPost.title}
                  </h3>
                  <p className="body-text mt-4">{featuredPost.excerpt}</p>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm text-slate-500">{formatBlogDate(featuredPost.publishedAt)}</span>
                    <span className="flex items-center text-sm font-semibold text-emerald-700">
                      Devamını Oku
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      ) : null}

      <section className="border-b border-slate-200 py-10">
        <div className={LAYOUT_CONTAINER_CLASS}>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-emerald-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className={LAYOUT_CONTAINER_CLASS}>
          {!loaded ? (
            <p className="text-center text-slate-500">Blog yazıları yükleniyor…</p>
          ) : listPosts.length === 0 ? (
            <div className="mx-auto max-w-lg rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-8 py-16 text-center">
              <BookOpen className="mx-auto mb-4 h-12 w-12 text-slate-400" />
              <h3 className="text-xl font-bold text-slate-900">
                {publishedPosts.length === 0 ? 'Henüz yayınlanmış yazı yok' : 'Bu kategoride yazı bulunamadı'}
              </h3>
              <p className="body-text mt-3">
                {publishedPosts.length === 0
                  ? 'Yeni blog yazıları çok yakında burada olacak.'
                  : 'Başka bir kategori seçerek devam edebilirsiniz.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {listPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
                >
                  <BlogCoverImage
                    src={resolveBlogCoverImage(post.imageKey, post.slug)}
                    alt={post.title}
                    category={post.category}
                    className="aspect-video"
                  />
                  <div className="p-6">
                    <p className="text-sm font-semibold text-emerald-600">{post.category}</p>
                    <h3 className="mt-2 text-lg font-bold text-slate-900 transition-colors group-hover:text-emerald-700">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{post.excerpt}</p>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-slate-500">{formatBlogDate(post.publishedAt)}</span>
                      <span className="font-semibold text-emerald-700">Oku →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection
        title="Daha fazla içerik için takipte kalın"
        description="Yeni yazılar ve güncellemeler için bizimle iletişime geçebilirsiniz."
        buttonText="İletişime Geç"
      />
    </div>
  )
}
