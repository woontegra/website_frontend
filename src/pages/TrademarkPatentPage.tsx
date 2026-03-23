import { Button } from '../components/ui/Button'
import { ArrowRight, CheckCircle, FileText, Search, Shield, Scale, Award, FileCheck } from 'lucide-react'

export function TrademarkPatentPage() {
  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="py-24 bg-gradient-to-br from-slate-800 via-slate-700 to-gray-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-white">
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Markanızı Güvence Altına Alın
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Marka tescil, patent ve hukuki süreçlerde profesyonel destek ile markanızı koruyun.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="green" to="/iletisim" className="text-lg px-8 py-4">
                  Başvuru Yap
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button variant="outline" to="/iletisim" className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white hover:text-slate-800">
                  İletişime Geç
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <img 
                  src="/images/trademark-document.jpg" 
                  alt="Marka Tescil Belgesi" 
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.parentElement!.innerHTML = '<div class="bg-gradient-to-br from-slate-600 to-gray-700 rounded-2xl p-12 flex items-center justify-center h-96"><div class="text-white text-center"><div class="text-6xl mb-4">⚖️</div><div class="text-2xl font-semibold">Marka & Patent Tescil</div></div></div>'
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
            Markanızı Tescil Ettirmeden Risk Alıyorsunuz
          </h2>
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200">
            <p className="text-xl text-slate-700 mb-8 leading-relaxed">
              Tescil edilmeyen markalar:
            </p>
            <ul className="space-y-4 text-lg text-slate-600">
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">✗</span>
                <span>Başkaları tarafından alınabilir</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">✗</span>
                <span>Hukuki sorunlar oluşturabilir</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">✗</span>
                <span>Ticari kayıplara yol açabilir</span>
              </li>
            </ul>
            <p className="text-xl text-slate-900 font-semibold mt-8">
              Bu yüzden marka tescil süreci kritik öneme sahiptir.
            </p>
          </div>
        </div>
      </section>

      {/* ÇÖZÜM */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">
            Süreci Profesyonel Şekilde Yönetiyoruz
          </h2>
          <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-12 border border-slate-200">
            <p className="text-xl text-slate-700 mb-6 leading-relaxed">
              Woontegra bünyesinde, marka ve patent süreçleri uzman vekil desteği ile yürütülmektedir.
            </p>
            <p className="text-xl text-slate-900 font-semibold">
              Başvuru sürecinden tescile kadar tüm aşamaları sizin adınıza takip ediyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* HİZMETLER */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-4xl font-bold text-slate-900 mb-16 text-center">
            Sunduğumuz Hizmetler
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: FileText, title: 'Marka Tescil Başvurusu', desc: 'Resmi başvuru süreci' },
              { icon: Search, title: 'Marka Sorgulama', desc: 'Uygunluk araştırması' },
              { icon: Award, title: 'Patent Başvurusu', desc: 'Buluş tescil işlemleri' },
              { icon: FileCheck, title: 'Faydalı Model Başvurusu', desc: 'Yenilik tescili' },
              { icon: Scale, title: 'İtiraz ve Hukuki Süreçler', desc: 'Hukuki destek' },
              { icon: Shield, title: 'Marka Danışmanlığı', desc: 'Profesyonel rehberlik' },
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

      {/* SÜREÇ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold text-slate-900 mb-16 text-center">
            Başvuru Süreci Nasıl İşler?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Ön Araştırma', desc: 'Marka uygunluğu kontrol edilir' },
              { step: '02', title: 'Başvuru', desc: 'Resmi başvuru yapılır' },
              { step: '03', title: 'Takip', desc: 'Süreç düzenli olarak takip edilir' },
              { step: '04', title: 'Tescil', desc: 'Marka resmi olarak korunur' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-700 to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white shadow-lg">
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
              'Uzman marka & patent vekili desteği',
              'Sürecin baştan sona takibi',
              'Hukuki güvence',
              'Profesyonel danışmanlık',
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
      <section className="py-24 bg-gradient-to-br from-slate-700 via-gray-700 to-slate-800">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Markanızı Koruma Altına Alın
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Süreci başlatmak için bizimle iletişime geçin.
          </p>
          <Button variant="outline" to="/iletisim" className="text-lg px-12 py-4 border-white/30 text-white hover:bg-white hover:text-slate-800 transition-all">
            Başvuru Yap
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}
