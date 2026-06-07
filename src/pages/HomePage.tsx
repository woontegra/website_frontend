import { Button } from '../components/ui/Button'
import { SafeImage } from '../components/ui/SafeImage'
import { siteImages } from '../data/siteImages'
import { defaultHomeData } from '../data/defaultHomeData'
import { useHeroSection } from '../hooks/useHeroSection'
import { ArrowRight, Code, Palette, ShoppingCart, Cloud, Scale, Lightbulb, Award, Zap, TrendingUp, Target, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef } from 'react'

export function HomePage() {
  const { heroData } = useHeroSection('home', defaultHomeData)
  const brandsScrollRef = useRef<HTMLDivElement>(null)

  const heroTag = heroData?.tag || 'Teknoloji & Yazılım'
  const heroTitle =
    heroData?.title || 'Woontegra ile Yazılım, Dijital Hizmetler ve Ticaret Tek Yapıda'
  const heroSubtitle =
    heroData?.subtitle ||
    'Woontegra, yazılım geliştirme, e-ticaret sistemleri ve SaaS ürünleri ile işletmeler için sürdürülebilir dijital altyapılar kurar.'
  const heroImage = heroData?.image || siteImages.homeHero

  const scrollBrands = (direction: 'left' | 'right') => {
    if (brandsScrollRef.current) {
      const scrollAmount = 350
      brandsScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-green-900 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(34,197,94,0.2),transparent_70%)]" />
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-block px-3 py-1.5 bg-green-500/20 rounded-full mb-4">
                <span className="text-xs font-medium text-green-400">{heroTag}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold mb-4 leading-tight">
                {heroTitle}
              </h1>
              <p className="text-base text-gray-300 mb-6 leading-relaxed">
                {heroSubtitle}
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => document.getElementById('hizmetler')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center justify-center gap-2 text-sm px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Çözümleri İncele
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Button variant="outline" to="/iletisim" className="text-sm px-6 py-2.5 border-white/30 text-white hover:bg-white/10">
                  İletişime Geç
                </Button>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-blue-500/30 blur-3xl rounded-full animate-pulse" />
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl opacity-20 group-hover:opacity-40 blur transition duration-500" />
              <SafeImage
                src={heroImage}
                alt="Woontegra Teknoloji"
                className="relative rounded-xl shadow-xl border border-white/10 w-full h-auto object-cover transform transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* KISA GİRİŞ */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xl text-slate-700 leading-relaxed mb-6">
              Modern işletmeler sadece bir web sitesine değil, doğru kurgulanmış bir dijital sisteme ihtiyaç duyar.
            </p>
            <p className="text-2xl text-slate-900 leading-relaxed font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Woontegra, fikir aşamasından canlı yayına kadar tüm süreci planlar, geliştirir ve yönetir.
            </p>
          </div>
        </div>
      </section>

      {/* HİZMETLER */}
      <section id="hizmetler" className="py-24 bg-slate-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              İşinizi Büyüten Dijital Çözümler
            </h2>
            <p className="text-lg text-gray-400">Tam kapsamlı teknoloji hizmetleri</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Code, title: 'Yazılım Geliştirme', desc: 'İşletmenize özel, performans odaklı ve ölçeklenebilir yazılım sistemleri geliştiriyoruz.', color: 'from-blue-500 to-cyan-500' },
              { icon: Palette, title: 'Web Tasarım', desc: 'Modern, hızlı ve kullanıcı deneyimi yüksek web arayüzleri tasarımlıyoruz.', color: 'from-purple-500 to-pink-500' },
              { icon: ShoppingCart, title: 'E-Ticaret', desc: 'Satış odaklı, yönetilebilir ve güçlü altyapılara sahip e-ticaret sistemleri kuruyoruz.', color: 'from-green-500 to-emerald-500' },
              { icon: Cloud, title: 'SaaS', desc: 'Kendi yazılım ürününüzü sıfırdan geliştirmeniz için altyapı sağlıyoruz.', color: 'from-orange-500 to-red-500' },
              { icon: Scale, title: 'Marka & Patent', desc: 'Marka tescil ve danışmanlık süreçlerini profesyonel şekilde yönetiyoruz.', color: 'from-yellow-500 to-orange-500' },
              { icon: Lightbulb, title: 'Danışmanlık', desc: 'Dijital büyüme için doğru stratejileri birlikte oluşturuyoruz.', color: 'from-teal-500 to-green-500' },
            ].map((service, i) => (
              <div 
                key={i} 
                className="group relative bg-slate-800 rounded-2xl p-8 border border-slate-700 hover:border-green-500/50 hover:-translate-y-2 transition-all duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`} />
                <div className={`flex items-center justify-center w-16 h-16 bg-gradient-to-br ${service.color} rounded-xl mb-6 shadow-lg`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-base text-gray-400 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARKALAR - Horizontal Scroll */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Woontegra Çatısı Altında Geliştirilen Markalar
            </h2>
            <p className="text-lg text-slate-600">Gerçek projelerle kanıtlanmış deneyim</p>
          </div>
          <div className="relative">
            {/* Left Arrow */}
            <button
              onClick={() => scrollBrands('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-300 -ml-6"
              aria-label="Önceki"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Carousel */}
            <div 
              ref={brandsScrollRef}
              className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide px-2"
            >
              {[
                { 
                  name: 'Bilirkişi', 
                  image: siteImages.brandBilirkisi,
                  desc: 'Hukuk ve aktüerya alanında kullanılan profesyonel hesaplama yazılımıdır.',
                  gradient: 'from-blue-600 to-purple-600',
                  url: 'https://www.bilirkisihesap.com/'
                },
                { 
                  name: 'Optimoon', 
                  image: siteImages.brandOptimoon,
                  desc: 'Doğal taş ve özel tasarım ürünlerin yer aldığı e-ticaret markamızdır.',
                  gradient: 'from-purple-600 to-pink-600',
                  url: 'https://optimoon.com/'
                },
                { 
                  name: 'Datça Tropikal', 
                  image: siteImages.brandDatca,
                  desc: 'Yerel üretim ve doğal ürünlerin satışını gerçekleştiren markamızdır.',
                  gradient: 'from-green-600 to-teal-600',
                  url: 'https://datcatropikal.com/'
                },
                { 
                  name: 'Mercan Danışmanlık', 
                  image: siteImages.brandMercan,
                  desc: 'Marka tescil ve patent danışmanlık süreçlerini yöneten markamızdır.',
                  gradient: 'from-orange-600 to-red-600',
                  url: 'https://mercandanismanlik.com/'
                },
              ].map((brand, i) => (
                <a
                  key={i}
                  href={brand.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex-shrink-0 w-[calc(33.333%-16px)] min-w-[300px] snap-start cursor-pointer"
                >
                  <div className="relative h-72 overflow-hidden bg-slate-100">
                    <SafeImage
                      src={brand.image}
                      alt={brand.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      fallbackClassName="h-full w-full min-h-0 rounded-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{brand.name}</h3>
                    <p className="text-base text-slate-600">{brand.desc}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => scrollBrands('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-300 -mr-6"
              aria-label="Sonraki"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* NEDEN WOONTEGRA */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Neden Woontegra?
            </h2>
            <p className="text-lg text-slate-600">Gerçek projelerle kanıtlanmış uzmanlık</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Award, title: 'Gerçek Ürün Deneyimi', desc: 'Sadece hizmet sunmuyor, kendi ürünlerimizi de geliştiriyoruz.', color: 'bg-gradient-to-br from-yellow-500 to-orange-500' },
              { icon: Target, title: 'Uçtan Uca Sistem', desc: 'Yazılım, satış ve operasyon süreçlerini tek yapı altında kuruyoruz.', color: 'bg-gradient-to-br from-blue-500 to-cyan-500' },
              { icon: Zap, title: 'Performans', desc: 'Hızlı, stabil ve sürdürülebilir sistemler geliştiriyoruz.', color: 'bg-gradient-to-br from-purple-500 to-pink-500' },
              { icon: Code, title: 'Modern Teknoloji', desc: 'Güncel yazılım teknolojileri ile çalışıyoruz.', color: 'bg-gradient-to-br from-green-500 to-emerald-500' },
              { icon: TrendingUp, title: 'Aktif Markalar', desc: 'Kendi markalarımızı aktif olarak yönetiyoruz.', color: 'bg-gradient-to-br from-red-500 to-pink-500' },
              { icon: CheckCircle, title: 'Sürekli Gelişim', desc: 'Projeleri yayına almakla kalmıyor, sürekli geliştiriyoruz.', color: 'bg-gradient-to-br from-teal-500 to-green-500' },
            ].map((item, i) => (
              <div key={i} className="group bg-slate-50 rounded-2xl p-8 border border-gray-200 hover:border-green-500 hover:shadow-xl transition-all duration-300">
                <div className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-base text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SÜREÇ */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Çalışma Sürecimiz
            </h2>
            <p className="text-lg text-gray-400">Profesyonel ve şeffaf süreç yönetimi</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Analiz', desc: 'İhtiyaçları doğru şekilde belirliyoruz.', color: 'from-blue-500 to-cyan-500' },
              { step: '02', title: 'Planlama', desc: 'Proje yapısını ve stratejisini oluşturuyoruz.', color: 'from-purple-500 to-pink-500' },
              { step: '03', title: 'Geliştirme', desc: 'Sistemi modern teknolojilerle inşa ediyoruz.', color: 'from-green-500 to-emerald-500' },
              { step: '04', title: 'Yayın', desc: 'Test süreçlerinden sonra canlıya alıyoruz.', color: 'from-orange-500 to-red-500' },
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-base text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 max-w-7xl text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Projenizi Hayata Geçirmeye Hazır mısınız?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            İşinize en uygun dijital yapıyı birlikte kuralım.
          </p>
          <Button variant="outline" to="/iletisim" className="text-base px-10 py-4 border-white/30 text-white hover:bg-white hover:text-green-600 transition-all">
            İletişime Geç
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}