import { Button } from '../components/ui/Button'
import { ArrowRight, CheckCircle, Cloud, Database, Lock, Layers, Zap, BarChart3, Users, CreditCard, Code, Activity } from 'lucide-react'

export function SaasProductPage() {
  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-white">
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Kendi Yazılım Ürününüzü Geliştirin
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                SaaS (Software as a Service) modeli ile çalışan, ölçeklenebilir ve sürdürülebilir yazılım ürünleri geliştiriyoruz.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="green" to="/iletisim" className="text-lg px-8 py-4">
                  Projeni Anlat
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button variant="outline" to="/iletisim" className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white hover:text-slate-900">
                  Teklif Al
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <img 
                  src="/images/saas-dashboard.jpg" 
                  alt="SaaS Dashboard" 
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.parentElement!.innerHTML = '<div class="bg-gradient-to-br from-slate-700 to-gray-800 rounded-2xl p-12 flex items-center justify-center h-96"><div class="text-white text-center"><div class="text-6xl mb-4">⚡</div><div class="text-2xl font-semibold">SaaS Platform</div></div></div>'
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
            Bir Fikriniz Var Ama Nasıl Ürüne Döneceğini Bilmiyor musunuz?
          </h2>
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200">
            <p className="text-xl text-slate-700 mb-8 leading-relaxed">
              Birçok girişim:
            </p>
            <ul className="space-y-4 text-lg text-slate-600">
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">✗</span>
                <span>Fikrini ürüne dönüştüremez</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">✗</span>
                <span>Teknik altyapı kuramaz</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">✗</span>
                <span>Yanlış sistemlerle başlar</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">✗</span>
                <span>Ölçeklenemez</span>
              </li>
            </ul>
            <p className="text-xl text-slate-900 font-semibold mt-8">
              Bu yüzden doğru başlangıç kritik.
            </p>
          </div>
        </div>
      </section>

      {/* ÇÖZÜM */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">
            Fikri Ürüne Dönüştürüyoruz
          </h2>
          <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-12 border border-slate-200">
            <p className="text-xl text-slate-700 mb-10 leading-relaxed">
              Woontegra olarak SaaS projelerini sıfırdan ele alıyoruz.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                'Ürün planlama',
                'Sistem mimarisi',
                'Geliştirme',
                'Yayına alma',
              ].map((item, i) => (
                <div key={i} className="flex items-center bg-white rounded-xl p-6 border border-slate-200">
                  <CheckCircle className="text-slate-700 mr-4 flex-shrink-0" size={24} />
                  <p className="text-lg font-semibold text-slate-900">{item}</p>
                </div>
              ))}
            </div>
            <p className="text-xl text-slate-900 font-semibold mt-10">
              Tüm süreci tek yapı içinde yönetiyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* NELER GELİŞTİRİYORUZ */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-4xl font-bold text-slate-900 mb-16 text-center">
            Geliştirdiğimiz SaaS Sistemleri
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Users, title: 'Üyelik Sistemleri', desc: 'Çok kullanıcılı yapılar' },
              { icon: Layers, title: 'Yönetim Panelleri', desc: 'Admin & dashboard sistemleri' },
              { icon: Cloud, title: 'Çok Kullanıcılı Sistemler', desc: 'Multi-tenant mimariler' },
              { icon: CreditCard, title: 'Abonelik Altyapıları', desc: 'Ödeme & fatura sistemleri' },
              { icon: Code, title: 'API Tabanlı Sistemler', desc: 'RESTful & GraphQL' },
              { icon: BarChart3, title: 'Dashboard & Analiz Panelleri', desc: 'Veri görselleştirme' },
            ].map((item, i) => (
              <div 
                key={i} 
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-gray-800 rounded-xl flex items-center justify-center mb-6">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-base text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEKNİK YAPI */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl font-bold text-slate-900 mb-16 text-center">
            Nasıl Bir Sistem Kuruyoruz?
          </h2>
          <div className="space-y-6">
            {[
              { icon: Layers, title: 'Multi-tenant yapı', desc: 'Her müşteri için izole veri yapısı' },
              { icon: Lock, title: 'Güvenli veri yönetimi', desc: 'Şifreleme ve erişim kontrolü' },
              { icon: Zap, title: 'Hızlı ve ölçeklenebilir backend', desc: 'Yüksek performans ve büyümeye hazır altyapı' },
              { icon: Activity, title: 'Modern frontend mimarisi', desc: 'React, Vue veya Next.js tabanlı' },
              { icon: Database, title: 'API-first yaklaşım', desc: 'Entegrasyon odaklı mimari' },
            ].map((item, i) => (
              <div 
                key={i} 
                className="flex items-start bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-8 border border-slate-200"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-slate-700 to-gray-800 rounded-lg flex items-center justify-center mr-6 flex-shrink-0">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-base text-slate-600">{item.desc}</p>
                </div>
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
              'Kendi SaaS projelerimizi geliştiriyoruz',
              'Sadece kod değil, ürün geliştiriyoruz',
              'Ölçeklenebilir mimari kuruyoruz',
              'Uzun vadeli düşünerek geliştiriyoruz',
            ].map((item, i) => (
              <div key={i} className="flex items-start">
                <CheckCircle className="text-slate-400 mr-4 mt-1 flex-shrink-0" size={28} />
                <p className="text-xl text-gray-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Fikrinizi Bir Ürüne Dönüştürelim
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Doğru altyapı ile güçlü bir SaaS ürünü oluşturalım.
          </p>
          <Button variant="outline" to="/iletisim" className="text-lg px-12 py-4 border-white/30 text-white hover:bg-white hover:text-slate-900 transition-all">
            Projeni Anlat
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}
