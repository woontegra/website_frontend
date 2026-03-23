import { Button } from '../components/ui/Button'
import { ArrowRight } from 'lucide-react'

export function AboutPage() {
  return (
    <div className="bg-white">
      {/* HERO - SADE */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-5 gap-16 items-center">
            <div className="lg:col-span-3">
              <h1 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Woontegra'yı Tanıyın
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Yazılım, e-ticaret ve dijital sistemler alanında ürün geliştiren ve markalar yöneten bir teknoloji şirketiyiz.
              </p>
            </div>
            
            <div className="lg:col-span-2">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
                <img 
                  src="/images/product-screenshot.jpg" 
                  alt="Woontegra Ürünleri" 
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.parentElement!.innerHTML = '<div class="bg-gradient-to-br from-green-100 to-blue-100 rounded-3xl p-12 flex items-center justify-center h-96"><div class="text-center"><div class="text-6xl mb-4">🚀</div><div class="text-xl font-semibold text-slate-700">Woontegra</div><div class="text-sm text-slate-500 mt-2">Teknoloji Sistemleri</div></div></div>'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WOONTEGRA NEDİR - YENİ SECTION */}
      <section className="py-32 bg-slate-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl font-bold text-slate-900 mb-12">
            Woontegra Nedir?
          </h2>
          <div className="space-y-6 text-xl text-slate-700 leading-relaxed">
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
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl font-bold text-slate-900 mb-12">
            Nasıl Başladık?
          </h2>
          <div className="space-y-6 text-xl text-slate-700 leading-relaxed">
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
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl font-bold text-slate-900 mb-20 text-center">
            Bizi Farklı Yapan Ne?
          </h2>
          <div className="space-y-16">
            <div className="border-l-4 border-blue-600 pl-8">
              <h3 className="text-3xl font-bold text-slate-900 mb-4">
                Sadece Hizmet Değil, Ürün
              </h3>
              <p className="text-xl text-slate-600 leading-relaxed">
                Klasik ajanslar müşteri projeleri üzerinde çalışır. Biz ise kendi ürünlerimizi geliştiriyor, gerçek kullanıcılarla test ediyor ve piyasaya sunuyoruz. Bu deneyim, müşteri projelerinde de fark yaratıyor.
              </p>
            </div>

            <div className="border-l-4 border-purple-600 pl-8">
              <h3 className="text-3xl font-bold text-slate-900 mb-4">
                Gerçek Deneyim
              </h3>
              <p className="text-xl text-slate-600 leading-relaxed">
                Kendi markalarımızı aktif olarak yönetiyoruz. E-ticaret, SaaS yazılım, danışmanlık gibi farklı sektörlerde operasyonel deneyime sahibiz. Teorik bilgi değil, gerçek iş deneyimi sunuyoruz.
              </p>
            </div>

            <div className="border-l-4 border-green-600 pl-8">
              <h3 className="text-3xl font-bold text-slate-900 mb-4">
                Tek Yapı
              </h3>
              <p className="text-xl text-slate-600 leading-relaxed">
                Yazılım geliştirme, satış süreçleri ve operasyonel yönetimi tek çatı altında birleştiriyoruz. Bu entegre yapı sayesinde projeler daha hızlı, daha verimli ve daha sürdürülebilir şekilde hayata geçiyor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MARKALAR - BÜYÜK */}
      <section className="py-32 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <p className="text-xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Woontegra, sadece hizmet sunan bir yapı değil, aynı zamanda kendi markalarını oluşturan ve yöneten bir sistemdir.
            </p>
            <p className="text-xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Aşağıdaki markalar aktif olarak geliştirilen ve yönetilen projelerdir.
            </p>
            <h2 className="text-4xl font-bold text-slate-900">
              Aktif Olarak Yönettiğimiz Markalar
            </h2>
          </div>
          
          <div className="space-y-12">
            {/* Bilirkişi */}
            <a
              href="https://www.bilirkisihesap.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative h-96 lg:h-auto overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600">
                  <img 
                    src="/images/brand-bilirkisi.jpg" 
                    alt="Bilirkişi"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
                <div className="p-16 flex flex-col justify-center">
                  <h3 className="text-4xl font-bold text-slate-900 mb-6">Bilirkişi</h3>
                  <div className="space-y-4 text-lg text-slate-600 leading-relaxed">
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
              className="group block bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="lg:order-2 relative h-96 lg:h-auto overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600">
                  <img 
                    src="/images/brand-optimoon.jpg" 
                    alt="Optimoon"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
                <div className="lg:order-1 p-16 flex flex-col justify-center">
                  <h3 className="text-4xl font-bold text-slate-900 mb-6">Optimoon</h3>
                  <div className="space-y-4 text-lg text-slate-600 leading-relaxed">
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
              className="group block bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative h-96 lg:h-auto overflow-hidden bg-gradient-to-br from-green-600 to-teal-600">
                  <img 
                    src="/images/brand-datca.jpg" 
                    alt="Datça Tropikal"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
                <div className="p-16 flex flex-col justify-center">
                  <h3 className="text-4xl font-bold text-slate-900 mb-6">Datça Tropikal</h3>
                  <div className="space-y-4 text-lg text-slate-600 leading-relaxed">
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
              className="group block bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="lg:order-2 relative h-96 lg:h-auto overflow-hidden bg-gradient-to-br from-orange-600 to-red-600">
                  <img 
                    src="/images/brand-mercan.jpg" 
                    alt="Mercan Danışmanlık"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
                <div className="lg:order-1 p-16 flex flex-col justify-center">
                  <h3 className="text-4xl font-bold text-slate-900 mb-6">Mercan Danışmanlık</h3>
                  <div className="space-y-4 text-lg text-slate-600 leading-relaxed">
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
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl font-bold text-slate-900 mb-12">
            Nasıl Bir Yapı Kurduk?
          </h2>
          <div className="space-y-6 text-xl text-slate-700 leading-relaxed">
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
      <section className="py-32 bg-slate-900">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl font-bold text-white mb-12">
            Nereye Gidiyoruz?
          </h2>
          <div className="space-y-6 text-xl text-gray-300 leading-relaxed">
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
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-8">
            Bizimle Çalışmak İster misiniz?
          </h2>
          <Button variant="green" to="/iletisim" className="text-lg px-12 py-4">
            İletişime Geç
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}
