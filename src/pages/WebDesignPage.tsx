import { Button } from '../components/ui/Button'
import { ArrowRight, CheckCircle, Eye, Layout, Monitor, Smartphone, TrendingUp, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { defaultWebDesignData } from '../data/allPagesData'
import type { HeroSectionData } from '../types/sections'

export function WebDesignPage() {
  const [heroData, setHeroData] = useState<HeroSectionData | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('woontegra_web_design_page')
    if (stored) {
      try {
        const pageData = JSON.parse(stored)
        const heroSection = pageData.sections?.find((s: any) => s.type === 'hero')
        if (heroSection) {
          setHeroData(heroSection.data)
          return
        }
      } catch (e) {
        console.error('Failed to parse web-design page data:', e)
      }
    }
    const heroSection = defaultWebDesignData.sections.find(s => s.type === 'hero')
    if (heroSection) {
      setHeroData(heroSection.data as HeroSectionData)
    }
  }, [])

  const title = heroData?.title || "Modern ve Dönüşüm Odaklı Web Siteleri"
  const subtitle = heroData?.subtitle || "Sadece güzel görünen değil, ziyaretçiyi müşteriye dönüştüren web siteleri tasarlıyoruz."
  const image = heroData?.image

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative py-16 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(147,51,234,0.2),transparent_70%)]" />
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-3xl md:text-4xl font-semibold mb-4 leading-tight">
                {title}
              </h1>
              <p className="text-base text-gray-300 mb-6 leading-relaxed">
                {subtitle}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="green" to="/iletisim" className="text-sm px-6 py-2.5">
                  Teklif Al
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button variant="outline" to="/iletisim" className="text-sm px-6 py-2.5 border-white/30 text-white hover:bg-white hover:text-indigo-900">
                  Örnekleri İncele
                </Button>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-blue-500/30 blur-3xl rounded-full animate-pulse" />
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl opacity-20 group-hover:opacity-40 blur transition duration-500" />
              <img 
                src={image || "/images/website-mockup.jpg"}
                alt="Web Tasarım Örneği" 
                className="relative rounded-xl shadow-xl border border-white/10 w-full h-auto object-cover transform transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SORUN */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">
            Web Siteniz Sadece Görünmek İçin mi Var?
          </h2>
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200">
            <p className="text-xl text-slate-700 mb-8 leading-relaxed">
              Birçok web sitesi:
            </p>
            <ul className="space-y-4 text-lg text-slate-600">
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">✗</span>
                <span>Yavaş açılır</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">✗</span>
                <span>Mobilde kötü görünür</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">✗</span>
                <span>Kullanıcıyı yönlendirmez</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">✗</span>
                <span>Satış veya dönüşüm sağlamaz</span>
              </li>
            </ul>
            <p className="text-xl text-slate-900 font-semibold mt-8">
              Bu yüzden sadece "var olmak" yeterli değildir.
            </p>
          </div>
        </div>
      </section>

      {/* ÇÖZÜM */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">
            Görsel Değil, Sonuç Odaklı Tasarım
          </h2>
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-12 border border-purple-200">
            <p className="text-xl text-slate-700 mb-8 leading-relaxed">
              Woontegra olarak sadece tasarım yapmıyoruz.
              Kullanıcı deneyimi, hız ve dönüşüm odaklı web siteleri geliştiriyoruz.
            </p>
            <p className="text-xl text-slate-700 mb-6 font-semibold">
              Her sayfa:
            </p>
            <ul className="space-y-4 text-lg text-slate-600">
              <li className="flex items-start">
                <CheckCircle className="text-purple-600 mr-3 mt-1 flex-shrink-0" size={24} />
                <span>Kullanıcıyı yönlendirir</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-purple-600 mr-3 mt-1 flex-shrink-0" size={24} />
                <span>Hızlı çalışır</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-purple-600 mr-3 mt-1 flex-shrink-0" size={24} />
                <span>Mobil uyumludur</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-purple-600 mr-3 mt-1 flex-shrink-0" size={24} />
                <span>Satışa hizmet eder</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* NELER YAPIYORUZ */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-4xl font-bold text-slate-900 mb-16 text-center">
            Web Tasarım Hizmetlerimiz
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Monitor, title: 'Kurumsal Web Siteleri', desc: 'Profesyonel kurumsal siteler' },
              { icon: TrendingUp, title: 'Landing Page', desc: 'Satış sayfaları' },
              { icon: Layout, title: 'E-Ticaret Arayüz Tasarımı', desc: 'Online mağaza tasarımları' },
              { icon: Eye, title: 'UI/UX Tasarım', desc: 'Kullanıcı deneyimi odaklı' },
              { icon: Smartphone, title: 'Mobil Uyumlu Tasarım', desc: 'Responsive arayüzler' },
              { icon: Zap, title: 'Hız Optimizasyonu', desc: 'Performans iyileştirme' },
            ].map((item, i) => (
              <div 
                key={i} 
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-6">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-base text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TASARIM YAKLAŞIMI */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold text-slate-900 mb-16 text-center">
            Nasıl Tasarlıyoruz?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Analiz', desc: 'Hedef kitle ve amaç belirlenir' },
              { step: '02', title: 'Wireframe', desc: 'Sayfa yapısı oluşturulur' },
              { step: '03', title: 'Tasarım', desc: 'Modern arayüz hazırlanır' },
              { step: '04', title: 'Yayın', desc: 'Kodlanır ve yayına alınır' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-base text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEDEN WOONTEGRA */}
      <section className="py-24 bg-slate-900">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl font-bold text-white mb-16 text-center">
            Neden Woontegra?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              'Sadece tasarım değil, sistem kuruyoruz',
              'Kendi projelerimizi de geliştiriyoruz',
              'Hız ve performans odaklı çalışıyoruz',
              'Mobil deneyimi önceliklendiriyoruz',
            ].map((item, i) => (
              <div key={i} className="flex items-start">
                <CheckCircle className="text-purple-500 mr-4 mt-1 flex-shrink-0" size={28} />
                <p className="text-xl text-gray-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Sitenizi Yeniden Tasarlayalım
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            İşinize uygun modern ve etkili bir web sitesi oluşturalım.
          </p>
          <Button variant="outline" to="/iletisim" className="text-lg px-12 py-4 border-white/30 text-white hover:bg-white hover:text-purple-600 transition-all">
            Teklif Al
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}
