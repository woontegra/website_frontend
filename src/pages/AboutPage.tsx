import { Button } from '../components/ui/Button'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { defaultAboutData } from '../data/allPagesData'
import type { HeroSectionData } from '../types/sections'

export function AboutPage() {
  const [heroData, setHeroData] = useState<HeroSectionData | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('woontegra_about_page')
    if (stored) {
      try {
        const pageData = JSON.parse(stored)
        const heroSection = pageData.sections?.find((s: any) => s.type === 'hero')
        if (heroSection) {
          setHeroData(heroSection.data)
          return
        }
      } catch (e) {
        console.error('Failed to parse about page data:', e)
      }
    }
    // Fallback to default data
    const heroSection = defaultAboutData.sections.find(s => s.type === 'hero')
    if (heroSection) {
      setHeroData(heroSection.data as HeroSectionData)
    }
  }, [])

  const title = heroData?.title || "Woontegra'yı Tanıyın"
  const subtitle = heroData?.subtitle || "Yazılım, e-ticaret ve dijital sistemler alanında ürün geliştiren ve markalar yöneten bir teknoloji şirketiyiz."
  const image = heroData?.image

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-green-900 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(34,197,94,0.2),transparent_70%)]" />
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-block px-3 py-1.5 bg-green-500/20 rounded-full mb-4">
                <span className="text-xs font-medium text-green-400">Hakkımızda</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold mb-4 leading-tight">
                {title}
              </h1>
              <p className="text-base text-gray-300 mb-6 leading-relaxed">
                {subtitle}
              </p>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-blue-500/30 blur-3xl rounded-full animate-pulse" />
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl opacity-20 group-hover:opacity-40 blur transition duration-500" />
              <img 
                src={image || "/images/about-hero.jpg"}
                alt="Hakkımızda" 
                className="relative rounded-xl shadow-xl border border-white/10 w-full h-auto object-cover transform transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* WOONTEGRA NEDİR - YENİ SECTION */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-semibold text-slate-900 mb-8">
            Woontegra Nedir?
          </h2>
          <div className="space-y-4 text-base text-slate-700 leading-relaxed">
            <p>
              Woontegra, klasik bir ajans ya da yalnızca hizmet sunan bir yapı değildir.
            </p>
            <p>
              Kendi markalarını kuran, ürünler geliştiren ve bu ürünleri aktif olarak yöneten bir teknoloji şirketidir.
            </p>
            <p>
              Yazılım geliştirme, e-ticaret ve dijital sistemler alanında sadece müşteriler için değil, kendi projeleri için de üretim yapan bir yapı kurduk.
            </p>
            <p>
              Bu sayede teorik değil, gerçek kullanım üzerinden deneyim kazanan ve bunu projelere yansıtan bir sistem oluşturduk.
            </p>
            <p className="font-semibold text-slate-900">
              Amacımız, işletmelere sadece bir hizmet sunmak değil, sürdürülebilir bir dijital yapı kurmalarını sağlamaktır.
            </p>
          </div>
        </div>
      </section>

      {/* HİKAYE */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-semibold text-slate-900 mb-8">
            Nasıl Başladık?
          </h2>
          <div className="space-y-4 text-base text-slate-700 leading-relaxed">
            <p>
              Woontegra, piyasadaki klasik ajans modelinin eksikliklerini gözlemleyerek ortaya çıktı.
            </p>
            <p>
              Çoğu ajans, müşteri projeleri üzerinde çalışır ancak kendi ürünlerini geliştirmez. Bu durum, gerçek kullanıcı deneyimi ve operasyonel zorlukları anlamayı zorlaştırır.
            </p>
            <p>
              Biz ise farklı bir yol seçtik: Kendi ürünlerimizi geliştiren, markalarımızı yöneten ve bu süreçte edindiğimiz deneyimi müşteri projelerine aktaran bir yapı kurmak.
            </p>
            <p>
              Bugün, yazılım geliştirme, e-ticaret ve dijital sistemler alanında hem kendi markalarını yöneten hem de işletmelere çözümler sunan bir teknoloji yapısına dönüştük.
            </p>
            <p className="font-semibold text-slate-900">
              Farkımız şu: Sadece kod yazmıyoruz, sistem kuruyoruz. Sadece tasarım yapmıyoruz, marka oluşturuyoruz. Sadece danışmanlık vermiyor, gerçek projeler yönetiyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* NEYİ FARKLI YAPIYORUZ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-semibold text-slate-900 mb-12 text-center">
            Bizi Farklı Yapan Ne?
          </h2>
          <div className="space-y-8">
            <div className="border-l-2 border-blue-600 pl-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                Sadece Hizmet Değil, Ürün
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Klasik ajanslar müşteri projeleri üzerinde çalışır. Biz ise kendi ürünlerimizi geliştiriyor, gerçek kullanıcılarla test ediyor ve piyasaya sunuyoruz. Bu deneyim, müşteri projelerinde de fark yaratıyor.
              </p>
            </div>

            <div className="border-l-2 border-purple-600 pl-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                Gerçek Deneyim
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Kendi markalarımızı aktif olarak yönetiyoruz. E-ticaret, SaaS yazılım, danışmanlık gibi farklı sektörlerde operasyonel deneyime sahibiz. Teorik bilgi değil, gerçek iş deneyimi sunuyoruz.
              </p>
            </div>

            <div className="border-l-2 border-green-600 pl-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                Tek Yapı
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Yazılım geliştirme, satış süreçleri ve operasyonel yönetimi tek çatı altında birleştiriyoruz. Bu entegre yapı sayesinde projeler daha hızlı, daha verimli ve daha sürdürülebilir şekilde hayata geçiyor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MARKALAR - BÜYÜK */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <p className="text-sm text-slate-600 mb-4 max-w-4xl mx-auto leading-relaxed">
              Woontegra, sadece hizmet sunan bir yapı değil, aynı zamanda kendi markalarını oluşturan ve yöneten bir sistemdir.
            </p>
            <p className="text-sm text-slate-600 mb-6 max-w-4xl mx-auto leading-relaxed">
              Aşağıdaki markalar aktif olarak geliştirilen ve yönetilen projelerdir.
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              Aktif Olarak Yönettiğimiz Markalar
            </h2>
          </div>
          
          <div className="space-y-8">
            {/* Bilirkişi */}
            <a
              href="https://www.bilirkisihesap.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative h-64 lg:h-auto overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600">
                  <img 
                    src="/images/brand-bilirkisi.jpg" 
                    alt="Bilirkişi"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Bilirkişi</h3>
                  <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                    <p>
                      Hukuk ve aktüerya alanında kullanılan profesyonel hesaplama yazılımı. İşçi alacakları, kıdem-ihbar tazminatı, fazla mesai ve yıllık izin hesaplamalarını otomatik olarak gerçekleştirir.
                    </p>
                    <p className="font-semibold text-slate-700">
                      Kullanım Alanı: İş hukuku davaları, bilirkişi raporları, tazminat hesaplamaları
                    </p>
                    <p className="font-semibold text-slate-700">
                      Hedef Kullanıcı: Bilirkişiler, avukatlar, mahkemeler, hukuk büroları
                    </p>
                  </div>
                </div>
              </div>
            </a>

            {/* Optimoon */}
            <a
              href="https://optimoon.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="lg:order-2 relative h-64 lg:h-auto overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600">
                  <img 
                    src="/images/brand-optimoon.jpg" 
                    alt="Optimoon"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
                <div className="lg:order-1 p-8 flex flex-col justify-center">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Optimoon</h3>
                  <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                    <p>
                      Doğal taş takılar, kristaller ve özel tasarım ürünlerin satışını gerçekleştiren e-ticaret markası. Özgün tasarımlar, kaliteli malzemeler ve güvenilir teslimat ile müşterilerine ulaşıyor.
                    </p>
                    <p className="font-semibold text-slate-700">
                      Kullanım Alanı: Online satış, doğal taş koleksiyonları, hediye ürünleri
                    </p>
                    <p className="font-semibold text-slate-700">
                      Hedef Kullanıcı: Doğal taş severler, koleksiyonerler, hediye arayanlar
                    </p>
                  </div>
                </div>
              </div>
            </a>

            {/* Datça Tropikal */}
            <a
              href="https://datcatropikal.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative h-64 lg:h-auto overflow-hidden bg-gradient-to-br from-green-600 to-teal-600">
                  <img 
                    src="/images/brand-datca.jpg" 
                    alt="Datça Tropikal"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Datça Tropikal</h3>
                  <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                    <p>
                      Datça'nın yerel üretim ve doğal ürünlerini satışa sunan e-ticaret markası. Organik zeytinyağı, badem, bal ve tropikal meyveler gibi bölgeye özgü ürünleri müşterilere ulaştırıyor.
                    </p>
                    <p className="font-semibold text-slate-700">
                      Kullanım Alanı: Yerel ürün satışı, organik gıda, doğal ürünler
                    </p>
                    <p className="font-semibold text-slate-700">
                      Hedef Kullanıcı: Organik ürün tüketicileri, sağlıklı yaşam severler
                    </p>
                  </div>
                </div>
              </div>
            </a>

            {/* Mercan Danışmanlık */}
            <a
              href="https://mercandanismanlik.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="lg:order-2 relative h-64 lg:h-auto overflow-hidden bg-gradient-to-br from-orange-600 to-red-600">
                  <img 
                    src="/images/brand-mercan.jpg" 
                    alt="Mercan Danışmanlık"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
                <div className="lg:order-1 p-8 flex flex-col justify-center">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Mercan Danışmanlık</h3>
                  <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                    <p>
                      Marka tescil, patent başvuruları ve fikri mülkiyet haklarını profesyonel şekilde yöneten danışmanlık markası. İşletmelerin marka koruma süreçlerinde baştan sona rehberlik ediyor.
                    </p>
                    <p className="font-semibold text-slate-700">
                      Kullanım Alanı: Marka tescil, patent başvuruları, fikri mülkiyet danışmanlığı
                    </p>
                    <p className="font-semibold text-slate-700">
                      Hedef Kullanıcı: Girişimciler, işletmeler, marka sahipleri, patent başvuru sahipleri
                    </p>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* NASIL BİR YAPI KURDUK - YENİ SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-semibold text-slate-900 mb-8">
            Nasıl Bir Yapı Kurduk?
          </h2>
          <div className="space-y-4 text-base text-slate-700 leading-relaxed">
            <p>
              Woontegra içinde, yazılım geliştirme, satış, operasyon ve marka yönetimi süreçlerini birbirinden bağımsız değil, tek bir sistem olarak ele alıyoruz.
            </p>
            <p>
              Bu yaklaşım sayesinde geliştirilen projeler sadece teknik olarak değil, ticari olarak da sürdürülebilir hale gelir.
            </p>
          </div>
        </div>
      </section>

      {/* VİZYON */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-semibold text-white mb-8">
            Nereye Gidiyoruz?
          </h2>
          <div className="space-y-4 text-base text-gray-300 leading-relaxed">
            <p>
              Woontegra'nın hedefi, yalnızca hizmet veren bir yapı olmak değil, kendi ürünleriyle büyüyen ve global ölçekte rekabet eden bir teknoloji şirketine dönüşmektir.
            </p>
            <p>
              Her geliştirdiğimiz proje, bu yapının bir parçası olarak ilerler.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            Bizimle Çalışmak İster misiniz?
          </h2>
          <Button variant="green" to="/iletisim" className="text-sm px-8 py-3">
            İletişime Geç
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}
