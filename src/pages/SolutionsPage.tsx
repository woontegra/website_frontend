import { Button } from '../components/ui/Button'
import { StaticImage } from '../components/ui/StaticImage'
import { frontendImages } from '../data/frontendImages'
import { defaultSolutionsData } from '../data/allPagesData'
import { useHeroSection } from '../hooks/useHeroSection'
import { ArrowRight } from 'lucide-react'

export function SolutionsPage() {
  const { heroData } = useHeroSection('solutions', defaultSolutionsData)
  const title = heroData?.title || 'Geliştirdiğimiz Dijital Yapılar'
  const subtitle =
    heroData?.subtitle ||
    'Woontegra sadece hizmet sunmaz, kendi ürünlerini geliştirir ve markalarını aktif olarak yönetir.'
  const heroImage = frontendImages.solutionsHero

  return (
    <div className="bg-white overflow-x-hidden">
      {/* HERO */}
      <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            <div className="text-white min-w-0">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
                {title}
              </h1>
              <p className="text-base md:text-lg text-gray-300 leading-relaxed">
                {subtitle}
              </p>
            </div>

            <div className="relative min-w-0">
              <div className="rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <StaticImage
                  src={heroImage}
                  alt="Dijital Sistemler"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GİRİŞ */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-4 md:space-y-6">
            <p className="text-lg md:text-xl text-slate-700 leading-relaxed">
              Woontegra, yazılım geliştirme ve dijital sistem kurmanın ötesinde, kendi markalarını oluşturan ve yöneten bir yapı kurmuştur.
            </p>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed">
              Aşağıda yer alan projeler, aktif olarak geliştirilen ve yönetilen sistemlerdir.
            </p>
          </div>
        </div>
      </section>

      {/* BİLİRKİŞİ - EN BÜYÜK BLOK */}
      <section className="py-16 md:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            <div className="space-y-6 min-w-0">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
                Bilirkişi Hesaplama Programı
              </h2>
              <div className="space-y-4 md:space-y-6 text-base md:text-lg text-slate-700 leading-relaxed">
                <p>
                  Hukuk ve aktüerya alanında kullanılan profesyonel bir hesaplama yazılımıdır.
                </p>
                <p>
                  İşçilik alacakları, tazminat hesaplamaları ve detaylı analiz süreçlerini hızlı ve doğru şekilde gerçekleştirmenizi sağlar.
                </p>
                <p className="font-semibold text-slate-900">
                  Hazır Excel çözümleri yerine, sistematik ve hatasız bir yapı sunar.
                </p>
              </div>
              <Button variant="green" to="/cozumler/bilirkisi-hesaplama" size="lg" className="w-full sm:w-auto">
                Ürünü İncele
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>

            <div className="relative min-w-0">
              <div className="rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
                <StaticImage
                  src={frontendImages.bilirkisiHesapHero}
                  alt="Bilirkişi Hesaplama"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OPTIMOON */}
      <section className="py-16 md:py-20 lg:py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            <div className="relative order-2 lg:order-1 min-w-0">
              <div className="rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
                <StaticImage
                  src={frontendImages.optimoonProducts}
                  alt="Optimoon Ürünleri"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            <div className="space-y-6 order-1 lg:order-2 min-w-0">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
                Optimoon
              </h2>
              <div className="space-y-4 md:space-y-6 text-base md:text-lg text-slate-700 leading-relaxed">
                <p>
                  Doğal taş ve özel tasarım ürünlerin yer aldığı e-ticaret markamızdır.
                </p>
                <p className="font-semibold text-slate-900">
                  Ürün yönetimi, satış süreçleri ve altyapı tamamen Woontegra tarafından geliştirilen sistemler ile yürütülmektedir.
                </p>
              </div>
              <Button variant="green" to="https://optimoon.com" size="lg" className="w-full sm:w-auto">
                Mağazayı İncele
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* DATÇA TROPİKAL */}
      <section className="py-16 md:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            <div className="space-y-6 min-w-0">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
                Datça Tropikal
              </h2>
              <div className="space-y-4 md:space-y-6 text-base md:text-lg text-slate-700 leading-relaxed">
                <p>
                  Datça bölgesine ait doğal ve yerel ürünlerin satışını gerçekleştiren e-ticaret markasıdır.
                </p>
                <p className="font-semibold text-slate-900">
                  Üretimden satışa kadar tüm süreçler dijital altyapı ile desteklenmektedir.
                </p>
              </div>
              <Button variant="green" to="https://datcatropikal.com" size="lg" className="w-full sm:w-auto">
                Ürünleri İncele
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>

            <div className="relative min-w-0">
              <div className="rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
                <StaticImage
                  src={frontendImages.datcaProducts}
                  alt="Datça Tropikal Ürünleri"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MERCAN DANIŞMANLIK */}
      <section className="py-16 md:py-20 lg:py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            <div className="relative order-2 lg:order-1 min-w-0">
              <div className="rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
                <StaticImage
                  src={frontendImages.mercanServices}
                  alt="Mercan Danışmanlık"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            <div className="space-y-6 order-1 lg:order-2 min-w-0">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
                Mercan Danışmanlık
              </h2>
              <div className="space-y-4 md:space-y-6 text-base md:text-lg text-slate-700 leading-relaxed">
                <p>
                  Marka tescil, patent başvuruları ve fikri mülkiyet haklarında profesyonel danışmanlık hizmeti sunan markamızdır.
                </p>
                <p className="font-semibold text-slate-900">
                  Resmi marka vekili desteği ile başvuru süreçleri, takip ve hukuki danışmanlık hizmetleri verilmektedir.
                </p>
              </div>
              <Button variant="green" to="https://mercandanismanlik.com" size="lg" className="w-full sm:w-auto">
                Hizmetleri İncele
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6">
            Kendi Dijital Yapınızı Kurmaya Hazır mısınız?
          </h2>
          <p className="text-base md:text-lg text-gray-300 mb-8 md:mb-10">
            Woontegra ile fikirden canlı ürüne kadar tüm süreci birlikte planlayalım.
          </p>
          <Button variant="green" to="/teklif-al" size="lg" className="w-full sm:w-auto">
            Teklif Al
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}
