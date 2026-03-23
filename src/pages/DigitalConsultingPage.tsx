import { Button } from '../components/ui/Button'
import { ArrowRight, CheckCircle, Compass, LineChart, ShoppingBag, Settings, Cpu, TrendingUp } from 'lucide-react'

export function DigitalConsultingPage() {
  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="py-24 bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-white">
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Dijital Süreçlerinizi Doğru Kurgulayın
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Doğru strateji olmadan yapılan yatırımlar zaman ve para kaybına dönüşür. İşinize en uygun dijital yapıyı birlikte planlıyoruz.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="green" to="/iletisim" className="text-lg px-8 py-4">
                  Görüşme Planla
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button variant="outline" to="/iletisim" className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white hover:text-blue-900">
                  İletişime Geç
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <img 
                  src="/images/consulting-dashboard.jpg" 
                  alt="Dijital Analiz" 
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.parentElement!.innerHTML = '<div class="bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl p-12 flex items-center justify-center h-96"><div class="text-white text-center"><div class="text-6xl mb-4">📊</div><div class="text-2xl font-semibold">Dijital Danışmanlık</div></div></div>'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SORUN */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">
            Doğru Strateji Olmadan İlerlemek Zor
          </h2>
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200">
            <p className="text-xl text-slate-700 mb-8 leading-relaxed">
              Birçok işletme:
            </p>
            <ul className="space-y-4 text-lg text-slate-600">
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">✗</span>
                <span>Neye yatırım yapacağını bilemez</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">✗</span>
                <span>Yanlış sistemler kurar</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">✗</span>
                <span>Zaman kaybeder</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">✗</span>
                <span>Verim alamaz</span>
              </li>
            </ul>
            <p className="text-xl text-slate-900 font-semibold mt-8">
              Bu yüzden doğru planlama kritik.
            </p>
          </div>
        </div>
      </section>

      {/* ÇÖZÜM */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">
            İşinize Uygun Yol Haritasını Oluşturuyoruz
          </h2>
          <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-12 border border-blue-200">
            <p className="text-xl text-slate-700 mb-8 leading-relaxed">
              Woontegra olarak, işletmenizin mevcut durumunu analiz ediyor ve ihtiyaçlarınıza uygun dijital stratejiyi birlikte belirliyoruz.
            </p>
            <p className="text-xl text-slate-700 mb-6 font-semibold">
              Amaç:
            </p>
            <ul className="space-y-4 text-lg text-slate-600">
              <li className="flex items-start">
                <CheckCircle className="text-blue-600 mr-3 mt-1 flex-shrink-0" size={24} />
                <span>Gereksiz maliyeti önlemek</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-blue-600 mr-3 mt-1 flex-shrink-0" size={24} />
                <span>Doğru sistemleri kurmak</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-blue-600 mr-3 mt-1 flex-shrink-0" size={24} />
                <span>Sürdürülebilir yapı oluşturmak</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* NELERDE DESTEK VERİYORUZ */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-4xl font-bold text-slate-900 mb-16 text-center">
            Danışmanlık Alanlarımız
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Compass, title: 'Dijital Dönüşüm', desc: 'Süreçlerin dijitalleşmesi' },
              { icon: Settings, title: 'Yazılım Planlama', desc: 'Doğru sistem seçimi' },
              { icon: ShoppingBag, title: 'E-Ticaret Stratejisi', desc: 'Online satış yapılandırması' },
              { icon: LineChart, title: 'Sistem Kurgulama', desc: 'Altyapı planlaması' },
              { icon: Cpu, title: 'Teknoloji Seçimi', desc: 'Platform ve araç belirleme' },
              { icon: TrendingUp, title: 'Süreç Optimizasyonu', desc: 'Verimlilik artırma' },
            ].map((item, i) => (
              <div 
                key={i} 
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl flex items-center justify-center mb-6">
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
            Danışmanlık Süreci
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Analiz', desc: 'Mevcut durum incelenir' },
              { step: '02', title: 'Tespit', desc: 'Sorunlar belirlenir' },
              { step: '03', title: 'Plan', desc: 'Strateji oluşturulur' },
              { step: '04', title: 'Uygulama', desc: 'Süreç yönlendirilir' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white shadow-lg">
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
              'Sadece teorik değil, gerçek deneyim',
              'Kendi projelerimiz üzerinden bilgi',
              'Sistem kurma odaklı yaklaşım',
              'Uzun vadeli bakış',
            ].map((item, i) => (
              <div key={i} className="flex items-start">
                <CheckCircle className="text-blue-400 mr-4 mt-1 flex-shrink-0" size={28} />
                <p className="text-xl text-gray-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            İşinizi Birlikte Planlayalım
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Doğru strateji ile sağlam bir dijital yapı kuralım.
          </p>
          <Button variant="outline" to="/iletisim" className="text-lg px-12 py-4 border-white/30 text-white hover:bg-white hover:text-blue-600 transition-all">
            Görüşme Planla
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}
