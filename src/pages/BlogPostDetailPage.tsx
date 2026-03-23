import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react'
import { Button } from '../components/ui/Button'

// Mock data - replace with API call
const blogPost = {
  title: 'SaaS Ürün Geliştirme Rehberi',
  category: 'SaaS',
  date: '15 Mart 2026',
  readTime: '8 dk okuma',
  image: '/images/blog/saas-guide.jpg',
  content: `
    <h2>Giriş</h2>
    <p>SaaS (Software as a Service) ürün geliştirmek, modern yazılım dünyasının en popüler iş modellerinden biridir. Bu rehberde, başarılı bir SaaS ürünü geliştirmek için bilmeniz gereken temel adımları ele alacağız.</p>

    <h2>1. Problem Tanımlama</h2>
    <p>Her başarılı SaaS ürünü, gerçek bir problemi çözmekle başlar. Hedef kitlenizin karşılaştığı zorlukları anlamak ve bu zorluklara çözüm üretmek kritik öneme sahiptir.</p>

    <h3>Pazar Araştırması</h3>
    <p>Hedef pazarınızı detaylı şekilde araştırın. Rakiplerinizi inceleyin ve onların eksik bıraktığı noktaları belirleyin.</p>

    <h2>2. Ürün Planlama</h2>
    <p>Ürününüzün temel özelliklerini belirleyin. MVP (Minimum Viable Product) yaklaşımıyla başlayarak, kullanıcı geri bildirimlerine göre ürününüzü geliştirin.</p>

    <h2>3. Teknik Altyapı</h2>
    <p>Ölçeklenebilir bir mimari kurun. Bulut tabanlı çözümler kullanarak, ürününüzün büyümeye hazır olmasını sağlayın.</p>

    <h2>Sonuç</h2>
    <p>SaaS ürün geliştirme süreci, doğru planlama ve sürekli iyileştirme gerektirir. Kullanıcı odaklı yaklaşım ve teknik mükemmellik, başarının anahtarıdır.</p>
  `,
}

const otherPosts = [
  { slug: 'e-ticaret-optimizasyonu', title: 'E-Ticaret Optimizasyonu', category: 'E-Ticaret' },
  { slug: 'marka-tescil-sureci', title: 'Marka Tescil Süreci', category: 'Marka & Patent' },
  { slug: 'modern-web-teknolojileri', title: 'Modern Web Teknolojileri', category: 'Yazılım' },
]

const categories = ['Yazılım', 'E-Ticaret', 'SaaS', 'Marka & Patent', 'Dijital Büyüme']

export function BlogPostDetailPage() {
  const { slug } = useParams()

  return (
    <div className="bg-white">
      {/* HERO IMAGE */}
      <section className="relative h-96 bg-gradient-to-br from-slate-200 to-gray-300">
        <img
          src={blogPost.image}
          alt={blogPost.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </section>

      {/* CONTENT */}
      <div className="container mx-auto px-4 max-w-7xl -mt-32 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* MAIN CONTENT */}
          <div className="lg:col-span-8">
            <article className="bg-white rounded-3xl shadow-2xl p-12">
              {/* BACK BUTTON */}
              <Link
                to="/blog"
                className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-8 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Blog'a Dön
              </Link>

              {/* META */}
              <div className="flex items-center gap-4 mb-6">
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold text-sm">
                  {blogPost.category}
                </span>
                <span className="text-slate-500">{blogPost.date}</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-500">{blogPost.readTime}</span>
              </div>

              {/* TITLE */}
              <h1 className="text-5xl font-bold text-slate-900 mb-8 leading-tight">
                {blogPost.title}
              </h1>

              {/* CONTENT */}
              <div
                className="prose prose-lg max-w-none prose-headings:text-slate-900 prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-2xl prose-h3:font-bold prose-h3:mt-8 prose-h3:mb-4 prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-6"
                dangerouslySetInnerHTML={{ __html: blogPost.content }}
              />

              {/* SHARE BUTTONS */}
              <div className="mt-16 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Paylaş</h3>
                <div className="flex gap-4">
                  <button className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
                    <Twitter className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </article>

            {/* CTA */}
            <div className="mt-12 bg-gradient-to-br from-slate-900 to-gray-800 rounded-3xl p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Projeniz İçin Destek mi Arıyorsunuz?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Size özel çözümler geliştirmek için iletişime geçin.
              </p>
              <Button variant="green" to="/iletisim" className="text-lg px-10 py-4">
                İletişime Geç
              </Button>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 space-y-8">
              {/* OTHER POSTS */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                  Diğer Yazılar
                </h3>
                <div className="space-y-4">
                  {otherPosts.map((post) => (
                    <Link
                      key={post.slug}
                      to={`/blog/${post.slug}`}
                      className="block p-4 rounded-xl hover:bg-slate-50 transition-colors border border-gray-100"
                    >
                      <div className="text-xs font-semibold text-green-600 mb-2">
                        {post.category}
                      </div>
                      <h4 className="font-semibold text-slate-900 hover:text-green-600 transition-colors">
                        {post.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>

              {/* CATEGORIES */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                  Kategoriler
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      to={`/blog?category=${category}`}
                      className="block px-4 py-3 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-medium transition-colors"
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

      {/* SPACING */}
      <div className="h-24" />
    </div>
  )
}
