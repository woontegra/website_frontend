import { Button } from '../components/ui/Button'
import { ArrowRight, CheckCircle, CreditCard, Package, ShoppingBag, ShoppingCart, Tag, TrendingUp, Truck, Users } from 'lucide-react'

export function EcommercePage() {
  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="py-24 bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-white">
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Satış Odaklı E-Ticaret Sistemleri Kuruyoruz
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Sadece bir mağaza değil, satış yapan ve büyüyen bir e-ticaret sistemi kurun.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="green" to="/iletisim" className="text-lg px-8 py-4 bg-white text-green-900 hover:bg-gray-100">
                  Teklif Al
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button variant="outline" to="/iletisim" className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white hover:text-green-900">
                  Demo Talep Et
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <img 
                  src="/images/ecommerce-screenshot.jpg" 
                  alt="E-Ticaret Sistemi" 
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.parentElement!.innerHTML = '<div class="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-12 flex items-center justify-center h-96"><div class="text-white text-center"><div class="text-6xl mb-4">🛒</div><div class="text-2xl font-semibold">E-Ticaret Sistemi</div></div></div>'
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
            E-Ticaret Siteniz Var Ama Satış Yok mu?
          </h2>
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200">
            <p className="text-xl text-slate-700 mb-8 leading-relaxed">
              Birçok e-ticaret sitesi:
            </p>
            <ul className="space-y-4 text-lg text-slate-600">
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">✗</span>
                <span>Trafik alır ama satış yapmaz</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">✗</span>
                <span>Yönetimi zor ve karmaşıktır</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">✗</span>
                <span>Pazaryerleri ile entegre değildir</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">✗</span>
                <span>Ölçeklenemez</span>
              </li>
            </ul>
            <p className="text-xl text-slate-900 font-semibold mt-8">
              Bu yüzden sadece site kurmak yetmez.
            </p>
          </div>
        </div>
      </section>

      {/* ÇÖZÜM */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">
            Sadece Site Değil, Satış Sistemi Kuruyoruz
          </h2>
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-12 border border-emerald-200">
            <p className="text-xl text-slate-700 mb-8 leading-relaxed">
              Woontegra olarak e-ticaret projelerini sadece tasarım olarak değil, bir satış sistemi olarak ele alıyoruz.
            </p>
            <p className="text-xl text-slate-700 mb-6 font-semibold">
              Kurduğumuz sistemler:
            </p>
            <ul className="space-y-4 text-lg text-slate-600">
              <li className="flex items-start">
                <CheckCircle className="text-emerald-600 mr-3 mt-1 flex-shrink-0" size={24} />
                <span>Kullanıcıyı satın almaya yönlendirir</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-emerald-600 mr-3 mt-1 flex-shrink-0" size={24} />
                <span>Yönetimi kolaydır</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-emerald-600 mr-3 mt-1 flex-shrink-0" size={24} />
                <span>Büyümeye uygundur</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-emerald-600 mr-3 mt-1 flex-shrink-0" size={24} />
                <span>Entegre çalışır</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* NELER SUNUYORUZ */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-4xl font-bold text-slate-900 mb-16 text-center">
            E-Ticaret Çözümlerimiz
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: ShoppingCart, title: 'Özel E-Ticaret Siteleri', desc: 'Sıfırdan özel geliştirme' },
              { icon: ShoppingBag, title: 'WooCommerce Altyapı Kurulumu', desc: 'WordPress tabanlı mağaza' },
              { icon: CreditCard, title: 'Ödeme Sistemleri Entegrasyonu', desc: 'Güvenli ödeme altyapısı' },
              { icon: TrendingUp, title: 'Pazaryeri Entegrasyonları', desc: 'Trendyol, Hepsiburada vb.' },
              { icon: Package, title: 'Ürün & Sipariş Yönetimi', desc: 'Merkezi yönetim sistemi' },
              { icon: Truck, title: 'Kargo ve Fatura Sistemleri', desc: 'Otomatik entegrasyonlar' },
            ].map((item, i) => (
              <div 
                key={i} 
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-6">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-base text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SİSTEMİN İÇİNDE NE VAR */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl font-bold text-slate-900 mb-16 text-center">
            Kurulan Sistem Neleri Kapsar?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Users, text: 'Yönetim paneli' },
              { icon: Package, text: 'Ürün yönetimi' },
              { icon: ShoppingCart, text: 'Sipariş takibi' },
              { icon: Users, text: 'Müşteri yönetimi' },
              { icon: Tag, text: 'Kampanya & indirim sistemi' },
              { icon: TrendingUp, text: 'SEO uyumlu yapı' },
            ].map((item, i) => (
              <div 
                key={i} 
                className="flex items-center bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-lg font-semibold text-slate-900">{item.text}</p>
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
              'Kendi e-ticaret markalarımız var (Optimoon, Datça Tropikal)',
              'Sadece kurmuyor, yönetiyoruz',
              'Gerçek satış deneyimine sahibiz',
              'Sistemi büyümeye uygun kuruyoruz',
            ].map((item, i) => (
              <div key={i} className="flex items-start">
                <CheckCircle className="text-emerald-500 mr-4 mt-1 flex-shrink-0" size={28} />
                <p className="text-xl text-gray-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            E-Ticaretinizi Büyütmeye Hazır mısınız?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Satış odaklı bir e-ticaret sistemi kuralım.
          </p>
          <Button variant="outline" to="/iletisim" className="text-lg px-12 py-4 border-white/30 text-white hover:bg-white hover:text-emerald-600 transition-all">
            Teklif Al
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}
