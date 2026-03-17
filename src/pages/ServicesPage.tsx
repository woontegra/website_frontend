import { useMemo, useState } from 'react'
import { services } from '../data/services'
import type { ServiceCategory } from '../types'
import { ServicePageCard } from '../components/ui/ServicePageCard'
import { Button } from '../components/ui/Button'

const CATEGORY_LABELS: Record<ServiceCategory | 'tumu', string> = {
  tumu: 'Tümü',
  yazilim: 'Yazılım',
  'e-ticaret': 'E-Ticaret',
  danismanlik: 'Danışmanlık',
  'marka-patent': 'Marka & Patent',
  diger: 'Diğer',
}

const categoryFilters: (ServiceCategory | 'tumu')[] = ['tumu', 'yazilim', 'e-ticaret', 'danismanlik', 'marka-patent']

export function ServicesPage() {
  const [category, setCategory] = useState<ServiceCategory | 'tumu'>('tumu')

  const filteredServices = useMemo(() => {
    if (category === 'tumu') return services
    return services.filter((s) => s.category === category)
  }, [category])

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative mt-20 py-24 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 70% 0%, rgba(37, 99, 235, 0.06), transparent 55%)',
          }}
        />
        <div className="container mx-auto px-4 relative">
          <div className="mx-auto max-w-[700px] text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
              İşinizi Büyüten Teknoloji Hizmetleri
            </h1>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-[700px] mx-auto">
              Yazılım geliştirmeden e-ticarete, SaaS ürünlerden marka danışmanlığına kadar tüm dijital süreçlerinizi tek çatı altında yönetiyoruz.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {['Tek ekip', 'Uçtan uca çözüm', 'Modern altyapı'].map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category filter */}
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-2">
          {categoryFilters.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setCategory(key)}
              className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                category === key
                  ? 'bg-accent-blue text-white shadow-sm'
                  : 'bg-white border border-[#e5e7eb] text-slate-600 hover:border-accent-blue/30 hover:text-accent-blue'
              }`}
            >
              {CATEGORY_LABELS[key]}
            </button>
          ))}
        </div>
      </div>

      {/* Service cards grid */}
      <section className="container mx-auto px-4 mt-16 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredServices.map((service) => (
            <ServicePageCard
              key={service.id}
              title={service.title}
              description={service.shortDescription}
              features={service.features ?? []}
              href={`/hizmetler/${service.slug}`}
              icon={service.icon}
            />
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section
        className="py-24 md:py-28"
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #f0f9ff 100%)',
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
            Projenizi birlikte hayata geçirelim
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
            Kısa bir brief ile size en uygun çözümü sunalım.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Button variant="hero" size="xl" to="/teklif-al">
              Teklif Al
            </Button>
            <Button variant="outline" size="xl" to="/iletisim">
              İletişime Geç
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
