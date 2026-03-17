import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'

const trustBadges = [
  { label: 'Modern altyapı', icon: 'infra' },
  { label: 'Çok yönlü dijital üretim', icon: 'multi' },
  { label: 'Kurumsal çözüm ortağı', icon: 'partner' },
]

function TrustIcon({ type }: { type: string }) {
  if (type === 'infra') {
    return (
      <svg className="w-4 h-4 shrink-0 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    )
  }
  if (type === 'multi') {
    return (
      <svg className="w-4 h-4 shrink-0 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )
  }
  return (
    <svg className="w-4 h-4 shrink-0 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
}

function DashboardMockup() {
  return (
    <div className="relative w-full max-w-[520px] mx-auto lg:mx-0">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-200/50 p-5 md:p-6 transition-transform duration-300 hover:shadow-2xl hover:shadow-gray-200/60 hover:-translate-y-1">
        {/* Mock header */}
        <div className="flex items-center gap-2 mb-5">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-300" />
            <span className="w-3 h-3 rounded-full bg-slate-300" />
            <span className="w-3 h-3 rounded-full bg-slate-300" />
          </div>
          <div className="flex-1 rounded-lg bg-slate-100 h-8 max-w-[180px] ml-4" />
        </div>
        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Projeler', value: '24', sub: 'Aktif' },
            { label: 'Tamamlanan', value: '156', sub: 'Toplam' },
            { label: 'Müşteri', value: '%98', sub: 'Memnuniyet' },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-xl border border-gray-100 bg-slate-50/80 p-3 transition-transform duration-300 hover:-translate-y-0.5"
            >
              <p className="text-[10px] md:text-xs font-medium text-slate-500 uppercase tracking-wider">{card.label}</p>
              <p className="text-lg md:text-xl font-bold text-slate-900 mt-0.5">{card.value}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{card.sub}</p>
            </div>
          ))}
        </div>
        {/* Chart area */}
        <div className="rounded-xl border border-gray-100 bg-slate-50/60 p-4 h-32">
          <div className="flex items-end justify-between gap-1 h-full">
            {[40, 65, 45, 80, 55, 70, 85, 60, 75, 90].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-gradient-to-t from-accent-blue/80 to-accent-blue/40 min-h-[8px] transition-transform duration-300 hover:from-accent-blue hover:to-accent-blue-light"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <p className="text-[10px] text-slate-400 mt-2 text-center">Örnek metrik görünümü</p>
        </div>
        {/* Bottom hint */}
        <p className="text-[10px] text-slate-400 mt-3 text-center">SaaS panel önizlemesi</p>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white pt-24 pb-28 md:py-28">
      {/* Background: soft radial gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 85% 10%, rgba(37, 99, 235, 0.08), transparent 50%),
            radial-gradient(ellipse 60% 40% at 15% 95%, rgba(5, 150, 105, 0.06), transparent 50%)
          `,
        }}
      />
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.25] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.03) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
      {/* Decorative blur circles - very subtle */}
      <div className="absolute top-1/4 -right-20 w-72 h-72 bg-accent-blue/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-64 h-64 bg-accent-green/[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="container relative mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: copy (mobilde üstte) */}
          <div className="opacity-0 animate-fade-up-hero">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight max-w-[650px]">
              <span className="text-slate-900">Woontegra ile </span>
              <span className="bg-gradient-to-r from-accent-blue via-accent-blue-light to-accent-green bg-clip-text text-transparent">
                Yazılım, Dijital Ticaret ve Teknoloji Çözümleri
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-[500px] leading-relaxed">
              Yazılım geliştirme, SaaS ürünleri, e-ticaret altyapıları, dijital hizmetler ve marka danışmanlığını tek çatı altında sunan modern teknoloji şirketi.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-4">
              <Button variant="hero" size="xl" to="/hizmetler" className="w-full sm:w-auto">
                Hizmetleri İncele
              </Button>
              <Link
                to="/iletisim"
                className="inline-flex items-center justify-center min-h-[52px] px-8 py-4 text-lg font-semibold rounded-xl border-2 border-gray-200 text-slate-700 hover:border-accent-blue/40 hover:text-accent-blue hover:bg-accent-blue-soft/30 transition-all duration-300 w-full sm:w-auto text-center"
              >
                İletişime Geç
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex flex-wrap gap-3">
              {trustBadges.map((b) => (
                <span
                  key={b.label}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 text-slate-600 text-sm font-medium"
                >
                  <TrustIcon type={b.icon} />
                  {b.label}
                </span>
              ))}
            </div>
          </div>

          {/* Right: dashboard mockup (mobilde altta) */}
          <div className="opacity-0 animate-scale-in flex justify-center lg:justify-end">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  )
}
