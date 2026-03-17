import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { services } from '../data/services'
import { Button } from '../components/ui/Button'

type ServiceContent = {
  description: string
  forWho: string[]
  forWhoDescs?: string[]
  whatWeOffer: string[]
  process: string[]
  faqs: { q: string; a: string }[]
  heroTitle?: string
  heroSubtitle?: string
}

const defaultContent: Record<string, ServiceContent> = {
  'yazilim-gelistirme': {
    description: 'Kurumsal yazılım, masaüstü ve web uygulamaları ile ölçeklenebilir altyapılar geliştiriyoruz. Modern teknolojiler ve temiz kod prensipleriyle sürdürülebilir projeler üretiyoruz.',
    forWho: ['Kurumsal firmalar', 'Startup\'lar', 'KOBİ\'ler', 'Kamu ve özel sektör'],
    forWhoDescs: [
      'Büyük ölçekli projeler için özelleştirilmiş yazılım çözümleri.',
      'Hızlı büyüme ve MVP’den ürün ölçeklemeye teknik ortaklık.',
      'İş süreçlerinize uygun, uygun maliyetli yazılım geliştirme.',
      'Kamu ve özel sektör projeleri için güvenilir altyapı.',
    ],
    whatWeOffer: ['Özelleştirilmiş yazılım geliştirme', 'API ve entegrasyon', 'Bakım ve destek', 'Teknik danışmanlık'],
    process: ['İhtiyaç analizi', 'Mimari ve planlama', 'Geliştirme', 'Test & teslim'],
    faqs: [
      { q: 'Hangi teknolojiler kullanılıyor?', a: 'Proje ihtiyacına göre React, Node.js, .NET, Python ve uygun veritabanları kullanıyoruz.' },
      { q: 'Teslim süresi ne kadar?', a: 'Kapsam ve karmaşıklığa göre değişir; net süre teklif aşamasında belirlenir.' },
    ],
    heroTitle: 'Ölçeklenebilir ve Güçlü Yazılım Çözümleri',
    heroSubtitle: 'Kurumunuza özel, modern teknolojilerle geliştirilen, performans ve sürdürülebilirlik odaklı yazılım çözümleri sunuyoruz.',
  },
  'web-tasarim': {
    description: 'Modern, hızlı ve dönüşüm odaklı kurumsal web siteleri ve dijital çözümler tasarlıyoruz. Responsive, SEO uyumlu ve kullanıcı odaklı arayüzler sunuyoruz.',
    forWho: ['Kurumsal firmalar', 'Serbest çalışanlar', 'E-ticaret girişimleri', 'Markalar'],
    whatWeOffer: ['Kurumsal web sitesi', 'Landing page', 'Web uygulaması arayüzü', 'Bakım ve güncelleme'],
    process: ['Brief ve hedef', 'Tasarım ve onay', 'Geliştirme', 'Yayın ve destek'],
    faqs: [
      { q: 'Mobil uyumlu mu?', a: 'Evet, tüm projeler mobil öncelikli ve responsive olarak teslim edilir.' },
      { q: 'İçerik yönetimi var mı?', a: 'İhtiyaca göre CMS (WordPress, headless CMS vb.) entegre ediyoruz.' },
    ],
  },
  'e-ticaret': {
    description: 'WooCommerce ve modern e-ticaret altyapıları ile mağaza kurulumu, ödeme sistemleri entegrasyonu ve ürün/kategori yönetimi sunuyoruz.',
    forWho: ['Perakende markalar', 'Üreticiler', 'Distribütörler', 'B2B satış yapan firmalar'],
    whatWeOffer: ['E-ticaret sitesi kurulumu', 'Ödeme ve kargo entegrasyonu', 'Ürün ve stok yönetimi', 'Raporlama ve optimizasyon'],
    process: ['Mağaza hedefi ve katalog', 'Tasarım ve yapı', 'Entegrasyonlar', 'Canlıya alma ve eğitim'],
    faqs: [
      { q: 'Hangi ödeme sistemleri?', a: 'İyzico, PayTR, Stripe ve diğer yaygın ödeme altyapıları desteklenir.' },
      { q: 'Mobil mağaza var mı?', a: 'Responsive web mağaza ile mobil deneyim sağlanır; gerekiyorsa PWA veya uygulama tartışılır.' },
    ],
  },
  'saas': {
    description: 'Abonelik tabanlı yazılım ürünleri ve bulut tabanlı iş uygulamaları geliştiriyoruz. Ölçeklenebilir mimari ve güvenli altyapı önceliğimizdir.',
    forWho: ['Girişimciler', 'Kurumsal firmalar', 'Sektörel oyuncular', 'B2B ürün hedefleyenler'],
    whatWeOffer: ['SaaS ürün tasarımı ve geliştirme', 'Abonelik ve faturalandırma', 'Çok kiracılı mimari', 'API ve entegrasyon'],
    process: ['Ürün vizyonu ve MVP', 'Mimari ve geliştirme', 'Beta ve geri bildirim', 'Lansman ve ölçekleme'],
    faqs: [
      { q: 'Bulut altyapısı nerede?', a: 'AWS, GCP veya müşteri tercihine göre uygun bulut sağlayıcı kullanılır.' },
      { q: 'Ölçeklenebilir mi?', a: 'Evet, baştan ölçeklenebilir mimari ve best practice’ler uygulanır.' },
    ],
  },
  'marka-patent-vekilligi': {
    description: 'Resmi marka vekili desteğiyle marka başvurusu, takip, itiraz süreçleri ve fikri mülkiyet danışmanlığı sunuyoruz. Kurumsal ve güvenilir bir hizmet anlayışıyla çalışıyoruz.',
    forWho: ['Şirketler', 'Girişimciler', 'Marka sahipleri', 'Web sitesi ile marka paketi isteyenler'],
    whatWeOffer: ['Marka başvurusu ve takip', 'İtiraz ve itiraz cevapları', 'Marka danışmanlığı', 'Web sitesi + marka paketleri'],
    process: ['Marka araştırma ve strateji', 'Başvuru hazırlığı', 'Resmi süreç takibi', 'Tescile kadar destek'],
    faqs: [
      { q: 'Marka vekili kim?', a: 'Eşimiz resmi marka vekili olarak tescil süreçlerinde yetkin şekilde hizmet vermektedir.' },
      { q: 'Web + marka paketi nedir?', a: 'Web sitesi kurulumu ile marka başvurusunu birlikte sunan paketler talep edebilirsiniz.' },
    ],
  },
  'dijital-danismanlik': {
    description: 'Dijital dönüşüm, süreç iyileştirme ve teknoloji stratejisi danışmanlığı veriyoruz. Mevcut süreçlerinizi analiz edip uygun çözüm önerileri sunuyoruz.',
    forWho: ['Kurumsal firmalar', 'KOBİ\'ler', 'Dijital dönüşüm sürecindeki şirketler'],
    whatWeOffer: ['Süreç analizi', 'Teknoloji seçimi', 'Roadmap oluşturma', 'Uygulama desteği'],
    process: ['Mevcut durum analizi', 'Hedef ve strateji', 'Öneri raporu', 'Uygulama planı'],
    faqs: [
      { q: 'Danışmanlık süresi ne kadar?', a: 'Kapsama göre proje bazlı veya aylık retainer modeli uygulanabilir.' },
      { q: 'Sadece rapor mu?', a: 'İsterseniz rapor sonrası uygulama ve proje yönetimi de sunuyoruz.' },
    ],
  },
  'oyun-gelistirme': {
    description: 'Mobil ve web tabanlı oyun projeleri ile dijital ürün geliştirme yapıyoruz. Teknoloji odaklı ve vizyoner bir üretim anlayışıyla hareket ediyoruz.',
    forWho: ['Oyun stüdyoları', 'Yayıncılar', 'Eğitim ve ciddi oyun projeleri', 'Girişimciler'],
    whatWeOffer: ['Oyun tasarımı ve geliştirme', 'Mobil ve web oyun', 'Prototip ve MVP', 'Yayın ve monetizasyon desteği'],
    process: ['Konsept ve tasarım', 'Prototip', 'Geliştirme', 'Test ve yayın'],
    faqs: [
      { q: 'Hangi platformlar?', a: 'Mobil (iOS/Android), web ve gerekiyorsa masaüstü desteklenir.' },
      { q: 'Motor ve teknoloji?', a: 'Proje gereksinimine göre Unity, Unreal veya web tabanlı teknolojiler kullanılıyor.' },
    ],
  },
  'dijital-altyapi': {
    description: 'API, entegrasyon ve ölçeklenebilir sistem mimarileri kuruyoruz. Mevcut sistemlerinizi birbirine bağlayan veya yeni altyapılar inşa eden çözümler sunuyoruz.',
    forWho: ['Kurumsal IT ekipleri', 'SaaS şirketleri', 'E-ticaret ve lojistik firmaları'],
    whatWeOffer: ['API tasarımı ve geliştirme', 'Sistem entegrasyonu', 'Mikroservis mimarisi', 'Performans ve güvenlik'],
    process: ['Mimari analiz', 'Teklif ve tasarım', 'Geliştirme', 'Test ve devreye alma'],
    faqs: [
      { q: 'Mevcut sistemlerle uyum?', a: 'Evet, mevcut ERP, CRM ve diğer sistemlerle entegrasyon yapıyoruz.' },
      { q: 'Güvenlik nasıl?', a: 'Best practice’lere uygun, güvenlik testleri ve dokümantasyon dahil.' },
    ],
  },
}

// Dashboard / yazılım mockup for hero
function ServiceHeroMockup() {
  return (
    <div className="relative w-full max-w-[480px] mx-auto lg:mx-0">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-200/50 p-5 md:p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-gray-200/60 hover:-translate-y-1">
        <div className="flex items-center gap-2 mb-5">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-300" />
            <span className="w-3 h-3 rounded-full bg-slate-300" />
            <span className="w-3 h-3 rounded-full bg-slate-300" />
          </div>
          <div className="flex-1 rounded-lg bg-slate-100 h-8 max-w-[160px] ml-4" />
        </div>
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Projeler', value: '24' },
            { label: 'Tamamlanan', value: '156' },
            { label: 'Memnuniyet', value: '%98' },
          ].map((card) => (
            <div key={card.label} className="rounded-xl border border-gray-100 bg-slate-50/80 p-3">
              <p className="text-[10px] font-medium text-slate-500 uppercase">{card.label}</p>
              <p className="text-lg font-bold text-slate-900 mt-0.5">{card.value}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-gray-100 bg-slate-50/60 p-4 h-28">
          <div className="flex items-end justify-between gap-1 h-full">
            {[40, 65, 45, 80, 55, 70, 85].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-gradient-to-t from-accent-blue/80 to-accent-blue/40 min-h-[8px]"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Icon for "Kimler için" grid (by index or label)
function ForWhoIcon({ label }: { label: string }) {
  const cls = 'w-8 h-8 shrink-0 text-accent-blue'
  if (label.includes('Startup') || label.includes('Girişimci')) {
    return (
      <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    )
  }
  if (label.includes('KOBİ')) {
    return (
      <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
    )
  }
  if (label.includes('Kamu')) {
    return (
      <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
    )
  }
  return (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
  )
}

// Premium accordion for FAQ
function ServiceDetailFAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className={`rounded-2xl border bg-white transition-all duration-300 overflow-hidden ${
        open ? 'border-accent-blue/30 shadow-lg shadow-gray-200/50' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
    >
      <button
        type="button"
        className="w-full text-left flex justify-between items-center gap-4 px-8 py-6"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="font-semibold text-slate-900 pr-4">{question}</span>
        <span className="shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-medium">
          {open ? '−' : '+'}
        </span>
      </button>
      {open && (
        <div className="px-8 pb-6 pt-0 text-slate-600 leading-relaxed border-t border-gray-100">
          {answer}
        </div>
      )}
    </div>
  )
}

export function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const service = services.find((s) => s.slug === slug)
  const content = slug ? defaultContent[slug] : null

  const heroTitle = content?.heroTitle ?? service?.title ?? ''
  const heroSubtitle = content?.heroSubtitle ?? service?.shortDescription ?? ''

  if (!service) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-600">Hizmet bulunamadı.</p>
        <Link to="/hizmetler" className="mt-4 inline-block text-accent-blue font-medium">← Hizmetlere dön</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* ——— Hero ——— */}
      <section className="relative pt-24 pb-20 md:py-28 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 85% 10%, rgba(37, 99, 235, 0.07), transparent 50%),
              radial-gradient(ellipse 60% 40% at 15% 95%, rgba(5, 150, 105, 0.05), transparent 50%)
            `,
          }}
        />
        <div className="container mx-auto px-4 max-w-6xl relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                {heroTitle}
              </h1>
              <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-[560px]">
                {heroSubtitle}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button variant="hero" size="xl" to="/teklif-al">Teklif Al</Button>
                <Button variant="outline" size="xl" to="/iletisim">İletişime Geç</Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <ServiceHeroMockup />
            </div>
          </div>
        </div>
      </section>

      {content && (
        <div className="container mx-auto px-4 max-w-[1200px]">
          {/* ——— Genel Bakış (Overview card) ——— */}
          <section className="py-20 md:py-24">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-8 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
              <p className="text-sm font-semibold uppercase tracking-wider text-accent-blue mb-4">Genel Bakış</p>
              <p className="text-slate-600 leading-relaxed text-lg">{content.description}</p>
            </div>
          </section>

          {/* ——— Kimler için? Icon grid ——— */}
          <section className="py-20 md:py-24 border-t border-gray-100">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-10">Kimler için uygun?</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {content.forWho.map((label, i) => (
                <div
                  key={label}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                >
                  <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-[#eff6ff] text-accent-blue mb-4">
                    <ForWhoIcon label={label} />
                  </div>
                  <h3 className="font-semibold text-slate-900">{label}</h3>
                  {content.forWhoDescs?.[i] && (
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{content.forWhoDescs[i]}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ——— Neler sunuyoruz? Feature card ——— */}
          <section className="py-20 md:py-24 border-t border-gray-100">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-10">Neler sunuyoruz?</h2>
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-8 md:p-10 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
              <ul className="space-y-5">
                {content.whatWeOffer.map((item) => (
                  <li key={item} className="flex items-start gap-4">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-accent-green/10 flex items-center justify-center mt-0.5">
                      <svg className="w-3.5 h-3.5 text-accent-green" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </span>
                    <span className="text-slate-700 text-lg leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ——— Süreç Timeline ——— */}
          <section className="py-20 md:py-24 border-t border-gray-100">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-10">Süreç</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {content.process.map((step, i) => (
                <div
                  key={step}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                >
                  <span className="text-4xl font-bold text-slate-200 leading-none">{i + 1}</span>
                  <h3 className="mt-4 font-semibold text-slate-900">{step}</h3>
                </div>
              ))}
            </div>
          </section>

          {/* ——— SSS Premium accordion ——— */}
          <section className="py-20 md:py-24 border-t border-gray-100">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-10">Sık sorulan sorular</h2>
            <div className="space-y-4">
              {content.faqs.map((faq) => (
                <ServiceDetailFAQItem key={faq.q} question={faq.q} answer={faq.a} />
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ——— Alt CTA ——— */}
      <section
        className="py-24 md:py-28"
        style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f0f9ff 100%)' }}
      >
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
            Projenizi birlikte hayata geçirelim
          </h2>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            Kısa bir görüşme ile ihtiyacınızı analiz edelim ve size en doğru çözümü sunalım.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Button variant="hero" size="xl" to="/teklif-al">Teklif Al</Button>
            <Button variant="outline" size="xl" to="/iletisim">İletişime Geç</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
