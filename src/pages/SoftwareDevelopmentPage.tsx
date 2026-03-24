import { Button } from '../components/ui/Button'
import { ArrowRight, CheckCircle, Code, Database, Settings, ShoppingCart, Users, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { defaultSoftwareDevData } from '../data/allPagesData'
import type { HeroSectionData } from '../types/sections'

export function SoftwareDevelopmentPage() {
  const [heroData, setHeroData] = useState<HeroSectionData | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('woontegra_software_dev_page')
    if (stored) {
      try {
        const pageData = JSON.parse(stored)
        const heroSection = pageData.sections?.find((s: any) => s.type === 'hero')
        if (heroSection) {
          setHeroData(heroSection.data)
          return
        }
      } catch (e) {
        console.error('Failed to parse software-dev page data:', e)
      }
    }
    const heroSection = defaultSoftwareDevData.sections.find(s => s.type === 'hero')
    if (heroSection) {
      setHeroData(heroSection.data as HeroSectionData)
    }
  }, [])

  const title = heroData?.title || "İşletmenize Özel Yazılım Geliştiriyoruz"
  const subtitle = heroData?.subtitle || "Hazır çözümler yerine, işinize özel geliştirilen sistemlerle süreçlerinizi hızlandırın ve kontrol altına alın."
  const image = heroData?.image

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-green-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(34,197,94,0.2),transparent_70%)]" />
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
                <Button variant="outline" to="/iletisim" className="text-sm px-6 py-2.5 border-white/30 text-white hover:bg-white hover:text-slate-900">
                  İletişime Geç
                </Button>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-blue-500/30 blur-3xl rounded-full animate-pulse" />
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl opacity-20 group-hover:opacity-40 blur transition duration-500" />
              <img 
                src={image || "/images/software-dashboard.jpg"}
                alt="Yazılım Dashboard" 
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
            Hazır Sistemler Size Yetmiyor mu?
          </h2>
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200">
            <p className="text-xl text-slate-700 mb-8 leading-relaxed">
              Birçok işletme, hazır yazılımlar nedeniyle:
            </p>
            <ul className="space-y-4 text-lg text-slate-600">
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">✗</span>
                <span>İş süreçlerine uyum sağlayamayan sistemler kullanır</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">✗</span>
                <span>Gereksiz özelliklerle uğraşır</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">✗</span>
                <span>İhtiyaç duyduğu esnekliği bulamaz</span>
              </li>
            </ul>
            <p className="text-xl text-slate-900 font-semibold mt-8">
              Bu durum zaman kaybı ve verimsizlik oluşturur.
            </p>
          </div>
        </div>
      </section>

      {/* ÇÖZÜM */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">
            İhtiyacınıza Özel Sistem Kuruyoruz
          </h2>
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-12 border border-green-200">
            <p className="text-xl text-slate-700 mb-8 leading-relaxed">
              Woontegra olarak, hazır sistemleri adapte etmek yerine, doğrudan işletmenize uygun yazılım geliştiriyoruz.
            </p>
            <p className="text-xl text-slate-700 mb-6 font-semibold">
              Bu sayede:
            </p>
            <ul className="space-y-4 text-lg text-slate-600">
              <li className="flex items-start">
                <CheckCircle className="text-green-600 mr-3 mt-1 flex-shrink-0" size={24} />
                <span>Sadece ihtiyacınız olan özellikler olur</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-600 mr-3 mt-1 flex-shrink-0" size={24} />
                <span>Sistem sizin işinize göre çalışır</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-600 mr-3 mt-1 flex-shrink-0" size={24} />
                <span>Büyüdükçe geliştirilebilir yapı kurulur</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* NELER GELİŞTİRİYORUZ */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-4xl font-bold text-slate-900 mb-16 text-center">
            Geliştirdiğimiz Yazılım Türleri
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Settings, title: 'Yönetim Panelleri', desc: 'Admin sistemleri' },
              { icon: ShoppingCart, title: 'E-Ticaret Altyapıları', desc: 'Online satış sistemleri' },
              { icon: Users, title: 'Özel CRM Sistemleri', desc: 'Müşteri yönetimi' },
              { icon: Code, title: 'SaaS Platformları', desc: 'Bulut tabanlı yazılımlar' },
              { icon: Zap, title: 'Otomasyon Sistemleri', desc: 'Süreç otomasyonu' },
              { icon: Database, title: 'Entegrasyon Sistemleri', desc: 'Platform bağlantıları' },
            ].map((item, i) => (
              <div 
                key={i} 
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center mb-6">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-base text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NASIL ÇALIŞIYORUZ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold text-slate-900 mb-16 text-center">
            Nasıl Çalışıyoruz?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Analiz', desc: 'İhtiyacı detaylı inceleriz' },
              { step: '02', title: 'Planlama', desc: 'Sistem mimarisini oluştururuz' },
              { step: '03', title: 'Geliştirme', desc: 'Modern teknolojilerle geliştiririz' },
              { step: '04', title: 'Yayın', desc: 'Test sonrası canlıya alırız' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-base text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEDEN BİZ */}
      <section className="py-24 bg-slate-900">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl font-bold text-white mb-16 text-center">
            Neden Biz?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              'Hazır sistem satmıyoruz',
              'Kendi ürünlerimizi geliştiriyoruz',
              'Gerçek projeler üzerinde çalışıyoruz',
              'Sürekli destek sağlıyoruz',
            ].map((item, i) => (
              <div key={i} className="flex items-start">
                <CheckCircle className="text-green-500 mr-4 mt-1 flex-shrink-0" size={28} />
                <p className="text-xl text-gray-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Sizin İçin Nasıl Bir Sistem Geliştirelim?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            İhtiyacınızı anlatın, size özel çözümü birlikte kuralım.
          </p>
          <Button variant="outline" to="/iletisim" className="text-lg px-12 py-4 border-white/30 text-white hover:bg-white hover:text-green-600 transition-all">
            Teklif Al
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}
