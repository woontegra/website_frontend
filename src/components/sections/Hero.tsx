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
      <svg className="h-4 w-4 shrink-0 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    )
  }
  if (type === 'multi') {
    return (
      <svg className="h-4 w-4 shrink-0 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )
  }
  return (
    <svg className="h-4 w-4 shrink-0 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
}

function DashboardMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[520px] lg:mx-0">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xl shadow-gray-200/50 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-gray-200/60 md:p-6">
        <div className="mb-5 flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-slate-300" />
            <span className="h-3 w-3 rounded-full bg-slate-300" />
            <span className="h-3 w-3 rounded-full bg-slate-300" />
          </div>
          <div className="ml-4 h-8 max-w-[180px] flex-1 rounded-lg bg-slate-100" />
        </div>
        <div className="mb-5 grid grid-cols-3 gap-3">
          {[
            { label: 'Projeler', value: '24', sub: 'Aktif' },
            { label: 'Tamamlanan', value: '156', sub: 'Toplam' },
            { label: 'Müşteri', value: '%98', sub: 'Memnuniyet' },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-xl border border-gray-100 bg-slate-50/80 p-3 transition-transform duration-300 hover:-translate-y-0.5"
            >
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500 md:text-xs">{card.label}</p>
              <p className="mt-0.5 text-lg font-bold text-slate-900 md:text-xl">{card.value}</p>
              <p className="mt-0.5 text-[10px] text-slate-400">{card.sub}</p>
            </div>
          ))}
        </div>
        <div className="h-32 rounded-xl border border-gray-100 bg-slate-50/60 p-4">
          <div className="flex h-full items-end justify-between gap-1">
            {[40, 65, 45, 80, 55, 70, 85, 60, 75, 90].map((h, i) => (
              <div
                key={i}
                className="min-h-[8px] flex-1 rounded-t bg-gradient-to-t from-accent-blue/80 to-accent-blue/40 transition-transform duration-300 hover:from-accent-blue hover:to-accent-blue-light"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <p className="mt-2 text-center text-[10px] text-slate-400">Örnek metrik görünümü</p>
        </div>
        <p className="mt-3 text-center text-[10px] text-slate-400">SaaS panel önizlemesi</p>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-white pb-28 pt-24 md:py-28">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 85% 10%, rgba(37, 99, 235, 0.08), transparent 50%),
            radial-gradient(ellipse 60% 40% at 15% 95%, rgba(5, 150, 105, 0.06), transparent 50%)
          `,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.03) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
      <div className="pointer-events-none absolute top-1/4 -right-20 h-72 w-72 rounded-full bg-accent-blue/[0.04] blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 -left-20 h-64 w-64 rounded-full bg-accent-green/[0.04] blur-3xl" />

      <div className="container relative mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="opacity-0 animate-fade-up-hero">
            <h1 className="max-w-[36rem] text-4xl font-semibold leading-relaxed tracking-[0.02em] text-slate-900 md:text-5xl">
              <span className="text-slate-900">Woontegra ile </span>
              <span className="bg-gradient-to-r from-accent-blue via-accent-blue-light to-accent-green bg-clip-text text-transparent">
                Yazılım, Dijital Ticaret ve Teknoloji Çözümleri
              </span>
            </h1>
            <p className="mt-6 max-w-[34.375rem] text-lg leading-relaxed text-slate-600">
              Yazılım geliştirme, SaaS ürünleri, e-ticaret altyapıları, dijital hizmetler ve marka danışmanlığını tek çatı
              altında sunan modern teknoloji şirketi.
            </p>

            <div className="mt-8 flex flex-col flex-wrap gap-4 sm:flex-row sm:items-stretch">
              <Button
                variant="hero"
                size="xl"
                to="/hizmetler"
                className="w-full min-h-[52px] !h-auto px-8 py-4 text-lg sm:w-auto"
              >
                Hizmetleri İncele
              </Button>
              <Link
                to="/iletisim"
                className="inline-flex min-h-[52px] w-full items-center justify-center rounded-xl border-2 border-gray-200 bg-white/70 px-8 py-4 text-center text-lg font-semibold text-slate-700 backdrop-blur-sm transition-all duration-300 hover:border-accent-blue/40 hover:bg-accent-blue-soft/30 hover:text-accent-blue sm:w-auto"
              >
                İletişime Geç
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {trustBadges.map((b) => (
                <span
                  key={b.label}
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600"
                >
                  <TrustIcon type={b.icon} />
                  {b.label}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-center opacity-0 animate-scale-in lg:justify-end">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  )
}
