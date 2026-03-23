import { Button } from '../components/ui/Button'
import { ArrowRight, CheckCircle, Gamepad2, Smartphone, Globe, Box, GraduationCap, Sparkles, Code, Database, Activity } from 'lucide-react'

export function GameDevelopmentPage() {
  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="py-24 bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-white">
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Dijital Oyunlar ve Etkileşimli Deneyimler Geliştiriyoruz
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Sadece oyun değil, kullanıcıyı içine çeken dijital deneyimler tasarlıyor ve geliştiriyoruz.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="green" to="/iletisim" className="text-lg px-8 py-4">
                  Projeni Anlat
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button variant="outline" to="/iletisim" className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white hover:text-violet-900">
                  İletişime Geç
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <img 
                  src="/images/game-scene.jpg" 
                  alt="Oyun Sahnesi" 
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.parentElement!.innerHTML = '<div class="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl p-12 flex items-center justify-center h-96"><div class="text-white text-center"><div class="text-6xl mb-4">🎮</div><div class="text-2xl font-semibold">Dijital Oyun Geliştirme</div></div></div>'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* YAKLAŞIM */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">
            Oyun Geliştirme Bizim İçin Nedir?
          </h2>
          <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-12 border border-violet-200">
            <p className="text-xl text-slate-700 mb-6 leading-relaxed">
              Oyun geliştirme, sadece kod yazmak değil;
              tasarım, deneyim ve etkileşimi bir araya getiren bir süreçtir.
            </p>
            <p className="text-xl text-slate-900 font-semibold">
              Woontegra olarak projelere sadece teknik değil,
              ürün ve deneyim perspektifiyle yaklaşıyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* NELER GELİŞTİRİYORUZ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-4xl font-bold text-slate-900 mb-16 text-center">
            Geliştirdiğimiz Oyun Türleri
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Smartphone, title: 'Mobil Oyunlar', desc: 'iOS ve Android platformları' },
              { icon: Globe, title: 'Web Tabanlı Oyunlar', desc: 'Tarayıcıda çalışan oyunlar' },
              { icon: Box, title: '2D / 3D Oyunlar', desc: 'Farklı görsel stiller' },
              { icon: Gamepad2, title: 'Simülasyonlar', desc: 'Gerçekçi deneyimler' },
              { icon: GraduationCap, title: 'Eğitici Oyunlar', desc: 'Öğrenme odaklı içerikler' },
              { icon: Sparkles, title: 'Etkileşimli Deneyimler', desc: 'Yenilikçi projeler' },
            ].map((item, i) => (
              <div 
                key={i} 
                className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-8 shadow-lg border border-violet-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-base text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEKNOLOJİ */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl font-bold text-slate-900 mb-16 text-center">
            Kullandığımız Teknolojiler
          </h2>
          <div className="space-y-6">
            {[
              { icon: Box, title: 'Unity', desc: '2D ve 3D oyun geliştirme motoru' },
              { icon: Globe, title: 'WebGL', desc: 'Tarayıcı tabanlı 3D grafik teknolojisi' },
              { icon: Code, title: 'JavaScript / Web tabanlı motorlar', desc: 'Phaser, Three.js gibi framework\'ler' },
              { icon: Database, title: 'Backend entegrasyonları', desc: 'Çok oyunculu ve veri yönetimi' },
              { icon: Activity, title: 'Gerçek zamanlı veri sistemleri', desc: 'Canlı etkileşim ve senkronizasyon' },
            ].map((item, i) => (
              <div 
                key={i} 
                className="flex items-start bg-white rounded-xl p-8 border border-gray-200 shadow-md"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center mr-6 flex-shrink-0">
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

      {/* SÜREÇ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold text-slate-900 mb-16 text-center">
            Nasıl Geliştiriyoruz?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Fikir', desc: 'Oyun konsepti oluşturulur' },
              { step: '02', title: 'Tasarım', desc: 'Oyun mekaniği ve deneyim kurgulanır' },
              { step: '03', title: 'Geliştirme', desc: 'Teknik altyapı oluşturulur' },
              { step: '04', title: 'Yayın', desc: 'Test edilir ve yayına alınır' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white shadow-lg">
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
              'Sadece oyun değil, ürün geliştiriyoruz',
              'Teknik ve yaratıcı yaklaşımı birleştiriyoruz',
              'Ölçeklenebilir sistemler kuruyoruz',
              'Fikir aşamasından yayına kadar destek sağlıyoruz',
            ].map((item, i) => (
              <div key={i} className="flex items-start">
                <CheckCircle className="text-violet-400 mr-4 mt-1 flex-shrink-0" size={28} />
                <p className="text-xl text-gray-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Fikrinizi Bir Oyuna Dönüştürelim
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Projenizi birlikte planlayalım ve hayata geçirelim.
          </p>
          <Button variant="outline" to="/iletisim" className="text-lg px-12 py-4 border-white/30 text-white hover:bg-white hover:text-violet-600 transition-all">
            Projeni Anlat
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}
