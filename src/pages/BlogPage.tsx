import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { BlogCoverImage } from '../components/blog/BlogCoverImage'
import { defaultBlogData } from '../data/allPagesData'
import { getBlogCoverImage } from '../data/frontendImages'
import { useHeroSection } from '../hooks/useHeroSection'
import { usePageSection } from '../hooks/usePageSection'
import type { BlogPostsSectionData } from '../types/sections'

export function BlogPage() {
  const { heroData } = useHeroSection('blog', defaultBlogData)
  const { data: blogData } = usePageSection<BlogPostsSectionData>('blog', 'blog-posts', defaultBlogData)
  const [selectedCategory, setSelectedCategory] = useState('Tümü')

  const heroTag = heroData?.tag || 'Blog'
  const heroTitle = heroData?.title || 'Bilgi, Deneyim ve Dijital İçerikler'
  const heroSubtitle =
    heroData?.subtitle ||
    'Yazılım, e-ticaret ve dijital sistemler hakkında güncel içerikler ve rehberler.'

  const categories = blogData?.categories ?? ['Tümü', 'Yazılım', 'E-Ticaret', 'SaaS', 'Marka & Patent', 'Dijital Büyüme']
  const posts = blogData?.posts ?? []
  const featuredPost = posts.find((post) => post.featured) ?? posts[0]

  const filteredPosts =
    selectedCategory === 'Tümü' ? posts : posts.filter((post) => post.category === selectedCategory)

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(34,197,94,0.15),transparent_70%)]" />
        <div className="container relative z-10 mx-auto max-w-5xl px-4 text-center">
          <div className="mb-6 inline-block rounded-full bg-green-500/20 px-4 py-1.5">
            <span className="text-sm font-medium text-green-400">{heroTag}</span>
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-tight text-white md:text-6xl">
            {heroTitle}
          </h1>
          <p className="text-xl leading-relaxed text-gray-300 md:text-2xl">{heroSubtitle}</p>
        </div>
      </section>

      {/* KATEGORİLER */}
      <section className="border-b border-gray-200 bg-slate-50 py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="mb-8 text-center text-3xl font-bold text-slate-900">Kategoriler</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-xl px-6 py-3 font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'border border-gray-200 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG LİSTESİ */}
      <section className="bg-white py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <BlogCoverImage
                  src={getBlogCoverImage(post.slug)}
                  alt={post.title}
                  category={post.category}
                  className="aspect-video"
                />
                <div className="p-6">
                  <div className="mb-3 text-sm font-semibold text-green-600">{post.category}</div>
                  <h3 className="mb-3 text-xl font-bold text-slate-900 transition-colors group-hover:text-green-600">
                    {post.title}
                  </h3>
                  <p className="mb-4 line-clamp-2 text-slate-600">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">{post.date}</span>
                    <span className="flex items-center font-semibold text-green-600 transition-all group-hover:gap-2">
                      Devamını Oku
                      <ArrowRight className="ml-1 h-4 w-4 transition-all group-hover:ml-2" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ÖNE ÇIKAN YAZI */}
      {featuredPost ? (
        <section className="bg-slate-50 py-24">
          <div className="container mx-auto max-w-7xl px-4">
            <h2 className="mb-12 text-center text-3xl font-bold text-slate-900">Öne Çıkan İçerik</h2>
            <Link
              to={`/blog/${featuredPost.slug}`}
              className="group block overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl transition-all duration-300 hover:shadow-3xl"
            >
              <div className="grid gap-0 lg:grid-cols-2">
                <BlogCoverImage
                  src={getBlogCoverImage(featuredPost.slug)}
                  alt={featuredPost.title}
                  category={featuredPost.category}
                  className="aspect-video lg:aspect-auto lg:min-h-[320px]"
                />
                <div className="flex flex-col justify-center p-12">
                  <div className="mb-4 text-sm font-semibold text-green-600">{featuredPost.category}</div>
                  <h3 className="mb-6 text-4xl font-bold text-slate-900 transition-colors group-hover:text-green-600">
                    {featuredPost.title}
                  </h3>
                  <p className="mb-6 text-xl leading-relaxed text-slate-600">{featuredPost.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">{featuredPost.date}</span>
                    <span className="flex items-center text-lg font-bold text-green-600 transition-all group-hover:gap-3">
                      Devamını Oku
                      <ArrowRight className="ml-2 h-5 w-5 transition-all group-hover:ml-3" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      ) : null}

      {/* CTA */}
      <section className="bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900 py-24">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-6 text-5xl font-bold text-white">Daha Fazla İçerik İçin Takipte Kalın</h2>
          <p className="mb-10 text-xl text-gray-300">Yeni içerikler ve güncellemeler için bizi takip edin.</p>
          <Button
            variant="outline"
            to="/iletisim"
            className="border-white/30 px-12 py-4 text-lg text-white transition-all hover:bg-white hover:text-slate-900"
          >
            İletişime Geç
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}
