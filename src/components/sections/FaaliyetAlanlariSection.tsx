/**
 * Ana sayfa — Faaliyet Alanlarımız (premium kartlar, SaaS/E-ticaret UI mockup)
 */

import { SURFACE_MUTED } from '../../lib/sectionSurfaces'

type Visual = 'saas' | 'ecommerce' | 'consulting' | 'integration' | 'digital'

const CARDS: {
  title: string
  description: string
  visual: Visual
  brands: string[]
  href: string
  aria: string
}[] = [
  {
    title: 'SaaS Sistemleri',
    description:
      'Ölçeklenebilir bulut yazılımları, yönetim panelleri ve raporlama arayüzleri geliştiriyoruz. Abonelik, çok kiracılı mimari ve güvenli API katmanlarıyla ürününüzü son kullanıcıya sakin ve öngörülebilir bir deneyimle sunmanıza yardımcı oluyoruz.',
    visual: 'saas',
    brands: ['Bilirkişi Hesaplama', 'Aktüerya (yakında)', 'Optimoon'],
    href: '/cozumler/bilirkisi-hesaplama',
    aria: 'SaaS projelerini incele',
  },
  {
    title: 'E-Ticaret Markaları',
    description:
      'WooCommerce ve özel mağaza çözümleri, ödeme ve kargo entegrasyonları, stok ve sipariş operasyonları. Markanızın dijital satış kanallarını sade, sürdürülebilir altyapılarla destekliyoruz.',
    visual: 'ecommerce',
    brands: ['Datça Tropikal', 'Mercan Danışmanlık'],
    href: '/e-ticaret',
    aria: 'E-ticaret referanslarını incele',
  },
  {
    title: 'Yazılım & Danışmanlık',
    description:
      'Sistem mimarisi, güvenlik incelemesi ve süreç iyileştirme konularında yanınızdayız. Teknik kararlarınızı netleştiriyor, ekiplerinizin üretim hızını ve kalitesini artıracak yol haritaları öneriyoruz.',
    visual: 'consulting',
    brands: ['Mercan Danışmanlık', 'Optimoon'],
    href: '/iletisim',
    aria: 'Danışmanlık hizmetlerini incele',
  },
  {
    title: 'Entegrasyon Sistemleri',
    description:
      'ERP, muhasebe, kargo ve üçüncü parti servisler arasında güvenilir köprüler kuruyoruz. Dağınık veriyi tek akışta toplayarak manuel iş yükünü azaltıyor ve hata riskini düşürüyoruz.',
    visual: 'integration',
    brands: ['Bilirkişi Hesaplama', 'Aktüerya (yakında)'],
    href: '/hizmetler',
    aria: 'Entegrasyon çözümlerini incele',
  },
  {
    title: 'Dijital Ürünler & Oyun',
    description:
      'Oyun, abonelik ve dijital ürün ekonomileri için store ve dağıtım kanallarına uyumlu, ölçeklenebilir yapılar tasarlıyoruz. Kullanıcı deneyimini ön planda tutarak ürününüzün pazara çıkışını destekliyoruz.',
    visual: 'digital',
    brands: ['Optimoon', 'Datça Tropikal'],
    href: '/oyun-ve-dijital-urunler',
    aria: 'Dijital ürün ve oyun alanını incele',
  },
]

function cardHref(href: string) {
  if (href.startsWith('http')) return href
  if (typeof window !== 'undefined') return `${window.location.origin}${href.startsWith('/') ? href : `/${href}`}`
  return href
}

/** Gerçek dashboard UI — stock foto yok */
function VisualSaaS() {
  return (
    <div className="absolute inset-0 flex text-[10px] leading-none select-none">
      <aside className="w-[26%] min-w-[72px] bg-slate-900 flex flex-col py-3 px-2 gap-2 border-r border-slate-700/80">
        <div className="h-6 w-6 rounded-lg bg-blue-500/90 mx-auto mb-2" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-2 rounded ${i === 1 ? 'bg-white/25 w-full' : 'bg-white/10 w-4/5 mx-auto'}`}
          />
        ))}
        <div className="flex-1" />
        <div className="h-8 rounded-lg bg-slate-800/80 mx-1" />
      </aside>
      <div className="flex-1 flex flex-col bg-slate-100 min-w-0">
        <header className="h-9 shrink-0 border-b border-slate-200/90 bg-white flex items-center px-3 gap-2">
          <div className="h-5 flex-1 max-w-[120px] rounded-md bg-slate-100" />
          <div className="h-6 w-6 rounded-full bg-slate-200" />
        </header>
        <div className="p-2.5 grid grid-cols-5 gap-2 flex-1 min-h-0">
          <div className="col-span-3 rounded-xl bg-white shadow-sm border border-slate-200/80 p-2.5 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide">Rapor</span>
              <span className="text-[9px] text-emerald-600 font-bold">+18%</span>
            </div>
            <div className="flex-1 flex items-end gap-1 min-h-[72px]">
              {[35, 55, 42, 78, 50, 88, 65, 92, 70, 95].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-gradient-to-t from-blue-600 to-blue-400"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
          <div className="col-span-2 flex flex-col gap-2">
            <div className="rounded-xl bg-white shadow-sm border border-slate-200/80 p-2 flex-1">
              <div className="text-[9px] text-slate-400">Aktif</div>
              <div className="text-lg font-bold text-slate-800 tabular-nums">2.4k</div>
            </div>
            <div className="rounded-xl bg-white shadow-sm border border-slate-200/80 p-2 flex-1">
              <div className="text-[9px] text-slate-400">Gelir</div>
              <div className="text-sm font-bold text-blue-600 tabular-nums">₺842k</div>
            </div>
          </div>
        </div>
        <div className="mx-2.5 mb-2.5 rounded-xl bg-white shadow-sm border border-slate-200/80 p-2 space-y-1.5">
          {[['API yanıt', '12ms'], ['Queue', 'OK'], ['DB', '99.9%']].map(([a, b]) => (
            <div key={a} className="flex justify-between items-center text-[9px]">
              <span className="text-slate-500">{a}</span>
              <span className="font-mono text-slate-800">{b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Mağaza mockup — tarayıcı + ürün grid */
function VisualEcommerce() {
  return (
    <div className="absolute inset-0 flex flex-col bg-slate-200 p-1.5 sm:p-2">
      <div className="rounded-t-lg bg-slate-300 h-7 flex items-center px-2 gap-1.5 shrink-0">
        <span className="w-2 h-2 rounded-full bg-red-400" />
        <span className="w-2 h-2 rounded-full bg-amber-400" />
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        <div className="flex-1 mx-2 h-4 rounded bg-white/90 flex items-center px-2">
          <span className="text-[8px] text-slate-400 truncate">magaza.marka.com</span>
        </div>
      </div>
      <div className="flex-1 bg-white rounded-b-lg overflow-hidden flex flex-col min-h-0">
        <div className="h-10 border-b border-slate-100 flex items-center justify-between px-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600" />
            <div className="hidden sm:flex gap-2">
              {['Yeni', 'İndirim', 'Koleksiyon'].map((t) => (
                <span key={t} className="text-[8px] text-slate-500 font-medium">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="h-6 w-16 rounded-full bg-slate-900 text-white text-[8px] flex items-center justify-center font-semibold">
            Sepet
          </div>
        </div>
        <div className="p-2.5 grid grid-cols-2 gap-2 flex-1 content-start">
          {[
            { bg: 'from-amber-100 to-orange-200', price: '₺449' },
            { bg: 'from-emerald-100 to-teal-200', price: '₺1.290' },
            { bg: 'from-rose-100 to-pink-200', price: '₺89' },
            { bg: 'from-sky-100 to-blue-200', price: '₺2.100' },
          ].map((p, i) => (
            <div key={i} className="rounded-lg border border-slate-100 overflow-hidden shadow-sm bg-white">
              <div className={`aspect-[4/3] bg-gradient-to-br ${p.bg}`} />
              <div className="p-1.5 flex justify-between items-center">
                <div className="h-1.5 w-8 bg-slate-200 rounded" />
                <span className="text-[9px] font-bold text-slate-800">{p.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function VisualConsulting() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 p-4 flex flex-col justify-center">
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur p-3 space-y-2 max-w-[90%] mx-auto w-full">
        <div className="flex gap-2">
          <div className="h-2 w-1/3 rounded bg-blue-400/60" />
          <div className="h-2 w-1/4 rounded bg-white/20" />
        </div>
        <div className="h-16 rounded-lg bg-gradient-to-r from-blue-500/30 to-emerald-500/20 border border-white/10" />
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 rounded-lg bg-white/10 border border-white/5" />
          ))}
        </div>
      </div>
    </div>
  )
}

function VisualIntegration() {
  const nodes = [
    { cls: 'top-[10%] left-[8%]', bg: 'bg-emerald-500/85' },
    { cls: 'top-[10%] right-[8%]', bg: 'bg-violet-500/85' },
    { cls: 'bottom-[14%] left-[8%]', bg: 'bg-amber-500/85' },
    { cls: 'bottom-[14%] right-[8%]', bg: 'bg-rose-500/85' },
  ] as const
  return (
    <div className="absolute inset-0 bg-slate-900 flex items-center justify-center p-3">
      <div className="relative w-full h-full min-h-[140px]">
        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl bg-blue-500 border-2 border-blue-400 shadow-lg shadow-blue-500/40 flex items-center justify-center text-white text-[10px] font-bold">
          API
        </div>
        {nodes.map(({ cls, bg }, i) => (
          <div
            key={i}
            className={`absolute ${cls} w-10 h-10 rounded-xl ${bg} border border-white/25 shadow-md`}
          />
        ))}
        <svg className="absolute inset-0 w-full h-full pointer-events-none text-white/35" aria-hidden>
          <line x1="50%" y1="50%" x2="18%" y2="18%" stroke="currentColor" strokeWidth="1.2" />
          <line x1="50%" y1="50%" x2="82%" y2="18%" stroke="currentColor" strokeWidth="1.2" />
          <line x1="50%" y1="50%" x2="18%" y2="82%" stroke="currentColor" strokeWidth="1.2" />
          <line x1="50%" y1="50%" x2="82%" y2="82%" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </div>
    </div>
  )
}

function VisualDigital() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 p-3 flex flex-col">
      <div className="text-[9px] text-indigo-300 font-semibold mb-2">Store</div>
      <div className="grid grid-cols-2 gap-2 flex-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl bg-gradient-to-br from-indigo-600/40 to-purple-600/30 border border-white/10 overflow-hidden"
          >
            <div className="aspect-video bg-slate-800/50 flex items-center justify-center text-lg">🎮</div>
            <div className="p-1.5">
              <div className="h-1.5 w-3/4 bg-white/20 rounded mb-1" />
              <div className="text-[8px] text-emerald-400 font-bold">₺199</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CardVisual({ type }: { type: Visual }) {
  switch (type) {
    case 'saas':
      return <VisualSaaS />
    case 'ecommerce':
      return <VisualEcommerce />
    case 'consulting':
      return <VisualConsulting />
    case 'integration':
      return <VisualIntegration />
    case 'digital':
      return <VisualDigital />
    default:
      return null
  }
}

export function FaaliyetAlanlariSection({ surfaceBg }: { surfaceBg?: string }) {
  const bg = surfaceBg ?? SURFACE_MUTED
  return (
    <section className={`border-y border-gray-100 py-24 md:py-28 ${bg}`} aria-labelledby="faaliyet-baslik">
      <div className="container mx-auto max-w-[1420px] px-4">
        <header className="mx-auto mb-14 max-w-3xl text-center md:mb-16">
          <h2
            id="faaliyet-baslik"
            className="text-2xl font-semibold tracking-[0.02em] text-slate-900 md:text-3xl"
          >
            Faaliyet Alanlarımız
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            Yazılım, e-ticaret, SaaS ve dijital ürün üretiminde aktif olarak sistemler kuruyor ve uzun vadede
            sürdürülebilir şekilde yönetiyoruz.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-9 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {CARDS.map((card) => (
            <a
              key={card.title}
              href={cardHref(card.href)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={card.aria}
              className="group flex origin-center flex-col overflow-hidden rounded-2xl bg-white shadow-lg shadow-slate-900/8 transition-all duration-300 ease-out hover:scale-[1.05] hover:shadow-xl hover:shadow-slate-900/18 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2"
            >
              <div className="relative aspect-[16/11] w-full overflow-hidden bg-slate-800">
                <div className="absolute inset-0">
                  <CardVisual type={card.visual} />
                </div>
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/25"
                  aria-hidden
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 pt-16 md:p-6 md:pt-20">
                  <h3 className="text-lg font-semibold tracking-tight text-white drop-shadow-md md:text-xl">
                    {card.title}
                  </h3>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6 md:p-7 md:pt-6">
                <p className="min-h-[2.75rem] text-sm leading-relaxed text-slate-600 line-clamp-2 md:line-clamp-none md:min-h-0">
                  {card.description}
                </p>

                <p className="mt-5 text-[11px] font-medium uppercase tracking-wide text-slate-400 leading-relaxed">
                  {card.brands.join(' · ')}
                </p>

                <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-accent-blue transition-transform duration-300 group-hover:translate-x-1">
                  İncele
                  <span aria-hidden>→</span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
