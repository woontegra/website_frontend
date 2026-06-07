import { Button } from '../components/ui/Button'
import { SafeImage } from '../components/ui/SafeImage'
import { siteImages } from '../data/siteImages'
import { ArrowRight } from 'lucide-react'

export function SolutionsPage() {
  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="py-32 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="text-white">
              <h1 className="text-6xl font-bold mb-8 leading-tight">
                Geliştirdiğimiz Dijital Yapılar
              </h1>
              <p className="text-2xl text-gray-300 leading-relaxed">
                Woontegra sadece hizmet sunmaz, kendi ürünlerini geliştirir ve markalarını aktif olarak yönetir.
              </p>
            </div>
            
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <SafeImage
                  src={siteImages.solutionsHero}
                  alt="Dijital Sistemler"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GİRİŞ */}
      <section className="py-32 bg-slate-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-8">
            <p className="text-2xl text-slate-700 leading-relaxed">
              Woontegra, yazılım geliştirme ve dijital sistem kurmanın ötesinde, kendi markalarını oluşturan ve yöneten bir yapı kurmuştur.
            </p>
            <p className="text-xl text-slate-600 leading-relaxed">
              Aşağıda yer alan projeler, aktif olarak geliştirilen ve yönetilen sistemlerdir.
            </p>
          </div>
        </div>
      </section>

      {/* BİLİRKİŞİ - EN BÜYÜK BLOK */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-5xl font-bold text-slate-900 leading-tight">
                Bilirkişi Hesaplama Programı
              </h2>
              <div className="space-y-6 text-xl text-slate-700 leading-relaxed">
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
              <Button variant="green" to="/cozumler/bilirkisi-hesaplama" className="text-lg px-10 py-4">
                Ürünü İncele
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
            
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
                <SafeImage
                  src={siteImages.bilirkisiHesapHero}
                  alt="Bilirkişi Hesaplama"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OPTIMOON */}
      <section className="py-32 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
                <SafeImage
                  src={siteImages.optimoonProducts}
                  alt="Optimoon Ürünleri"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            <div className="space-y-8 order-1 lg:order-2">
              <h2 className="text-5xl font-bold text-slate-900 leading-tight">
                Optimoon
              </h2>
              <div className="space-y-6 text-xl text-slate-700 leading-relaxed">
                <p>
                  Doğal taş ve özel tasarım ürünlerin yer aldığı e-ticaret markamızdır.
                </p>
                <p className="font-semibold text-slate-900">
                  Ürün yönetimi, satış süreçleri ve altyapı tamamen Woontegra tarafından geliştirilen sistemler ile yürütülmektedir.
                </p>
              </div>
              <Button variant="green" to="https://optimoon.com" className="text-lg px-10 py-4">
                Mağazayı İncele
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* DATÇA TROPİKAL */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-5xl font-bold text-slate-900 leading-tight">
                Datça Tropikal
              </h2>
              <div className="space-y-6 text-xl text-slate-700 leading-relaxed">
                <p>
                  Datça bölgesine ait doğal ve yerel ürünlerin satışını gerçekleştiren e-ticaret markasıdır.
                </p>
                <p className="font-semibold text-slate-900">
                  Üretimden satışa kadar tüm süreçler dijital altyapı ile desteklenmektedir.
                </p>
              </div>
              <Button variant="green" to="https://datcatropikal.com" className="text-lg px-10 py-4">
                Ürünleri İncele
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
            
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
                <SafeImage
                  src={siteImages.datcaProducts}
                  alt="Datça Tropikal Ürünleri"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MERCAN DANIŞMANLIK */}
      <section className="py-32 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
                <SafeImage
                  src={siteImages.mercanServices}
                  alt="Mercan Danışmanlık"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            <div className="space-y-8 order-1 lg:order-2">
              <h2 className="text-5xl font-bold text-slate-900 leading-tight">
                Mercan Danışmanlık
              </h2>
              <div className="space-y-6 text-xl text-slate-700 leading-relaxed">
                <p>
                  Marka tescil, patent başvuruları ve fikri mülkiyet haklarında profesyonel danışmanlık hizmeti sunan markamızdır.
                </p>
                <p className="font-semibold text-slate-900">
                  Resmi marka vekili desteği ile başvuru süreçleri, takip ve hukuki danışmanlık hizmetleri verilmektedir.
                </p>
              </div>
              <Button variant="green" to="https://mercandanismanlik.com" className="text-lg px-10 py-4">
                Hizmetleri İncele
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-5xl font-bold text-white mb-8">
            Kendi Dijital Yapınızı Kurmaya Hazır mısınız?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Woontegra ile fikirden canlı ürüne kadar tüm süreci birlikte planlayalım.
          </p>
          <Button variant="green" to="/teklif-al" className="text-lg px-12 py-4">
            Teklif Al
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}
