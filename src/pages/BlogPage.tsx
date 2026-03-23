import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '../components/ui/Button'

// Mock data - replace with API call
const categories = ['Tümü', 'Yazılım', 'E-Ticaret', 'SaaS', 'Marka & Patent', 'Dijital Büyüme']

const blogPosts = [
  {
    id: 1,
    slug: 'saas-urun-gelistirme-rehberi',
    title: 'SaaS Ürün Geliştirme Rehberi',
    excerpt: 'Başarılı bir SaaS ürünü geliştirmek için bilmeniz gereken temel adımlar.',
    category: 'SaaS',
    image: '/images/blog/saas-guide.jpg',
    date: '15 Mart 2026',
  },
  {
    id: 2,
    slug: 'e-ticaret-optimizasyonu',
    title: 'E-Ticaret Optimizasyonu',
    excerpt: 'Dönüşüm oranlarını artırmak için uygulanabilir stratejiler.',
    category: 'E-Ticaret',
    image: '/images/blog/ecommerce-opt.jpg',
    date: '12 Mart 2026',
  },
  {
    id: 3,
    slug: 'marka-tescil-sureci',
    title: 'Marka Tescil Süreci',
    excerpt: 'Markanızı koruma altına almak için izlemeniz gereken adımlar.',
    category: 'Marka & Patent',
    image: '/images/blog/trademark.jpg',
    date: '10 Mart 2026',
  },
  {
    id: 4,
    slug: 'modern-web-teknolojileri',
    title: 'Modern Web Teknolojileri',
    excerpt: 'Güncel web geliştirme araçları ve framework seçimi.',
    category: 'Yazılım',
    image: '/images/blog/web-tech.jpg',
    date: '8 Mart 2026',
  },
  {
    id: 5,
    slug: 'dijital-pazarlama-stratejileri',
    title: 'Dijital Pazarlama Stratejileri',
    excerpt: 'Online varlığınızı güçlendirmek için etkili yöntemler.',
    category: 'Dijital Büyüme',
    image: '/images/blog/digital-marketing.jpg',
    date: '5 Mart 2026',
  },
  {
    id: 6,
    slug: 'api-tasarimi-best-practices',
    title: 'API Tasarımı Best Practices',
    excerpt: 'Ölçeklenebilir ve güvenli API geliştirme prensipleri.',
    category: 'Yazılım',
    image: '/images/blog/api-design.jpg',
    date: '3 Mart 2026',
  },
]

const featuredPost = {
  slug: 'dijital-donusum-rehberi',
  title: 'Dijital Dönüşüm Rehberi: İşletmenizi Geleceğe Taşıyın',
  excerpt: 'Dijital dönüşüm sadece teknoloji değil, iş yapış şeklinizi değiştirmektir. Bu kapsamlı rehberde, işletmenizi dijital çağa hazırlamanın tüm adımlarını bulacaksınız.',
  category: 'Dijital Büyüme',
  image: '/images/blog/digital-transformation.jpg',
  date: '20 Mart 2026',
}

export function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tümü')

  const filteredPosts = selectedCategory === 'Tümü' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory)

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
            Bilgi, Deneyim ve Dijital İçerikler
          </h1>
          <p className="text-2xl text-gray-300 leading-relaxed">
            Yazılım, e-ticaret ve dijital sistemler hakkında güncel içerikler ve rehberler.
          </p>
        </div>
      </section>

      {/* KATEGORİLER */}
      <section className="py-16 bg-slate-50 border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Kategoriler
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG LİSTESİ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="aspect-video bg-gradient-to-br from-slate-200 to-gray-300 relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
                <div className="p-6">
                  <div className="text-sm font-semibold text-green-600 mb-3">
                    {post.category}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-green-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">{post.date}</span>
                    <span className="text-green-600 font-semibold group-hover:gap-2 flex items-center transition-all">
                      Devamını Oku
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ÖNE ÇIKAN YAZI */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Öne Çıkan İçerik
          </h2>
          <Link
            to={`/blog/${featuredPost.slug}`}
            className="group block bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-300"
          >
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="aspect-video lg:aspect-auto bg-gradient-to-br from-slate-200 to-gray-300 relative overflow-hidden">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
              <div className="p-12 flex flex-col justify-center">
                <div className="text-sm font-semibold text-green-600 mb-4">
                  {featuredPost.category}
                </div>
                <h3 className="text-4xl font-bold text-slate-900 mb-6 group-hover:text-green-600 transition-colors">
                  {featuredPost.title}
                </h3>
                <p className="text-xl text-slate-600 mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{featuredPost.date}</span>
                  <span className="text-green-600 font-bold text-lg group-hover:gap-3 flex items-center transition-all">
                    Devamını Oku
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:ml-3 transition-all" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Daha Fazla İçerik İçin Takipte Kalın
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Yeni içerikler ve güncellemeler için bizi takip edin.
          </p>
          <Button variant="outline" to="/iletisim" className="text-lg px-12 py-4 border-white/30 text-white hover:bg-white hover:text-slate-900 transition-all">
            İletişime Geç
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}
