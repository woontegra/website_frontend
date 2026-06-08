import { BarChart3, Code2, Target, Workflow, Zap } from 'lucide-react'
import { PageHero } from '../components/page/PageHero'
import { FeatureCard } from '../components/page/FeatureCard'
import { CTASection } from '../components/page/CTASection'
import { SectionHeader } from '../components/ui/SectionHeader'
import { LAYOUT_CONTAINER_CLASS } from '../lib/layoutConstants'
import { frontendImages } from '../data/frontendImages'
import { defaultServicesPageContent } from '../data/servicesPageContent'
import { useMarketingPageContent } from '../hooks/useMarketingPageContent'
import { useServiceCards } from '../hooks/useServiceCards'
import { resolveIcon } from '../lib/iconRegistry'
import { SURFACE_MUTED } from '../lib/sectionSurfaces'

const PROCESS = [
  { step: '01', title: 'Analiz', desc: 'İhtiyaçları ve hedefleri netleştiririz.', color: 'from-blue-500 to-cyan-500' },
  { step: '02', title: 'Planlama', desc: 'Yol haritası ve sistem mimarisini oluştururuz.', color: 'from-purple-500 to-pink-500' },
  { step: '03', title: 'Geliştirme', desc: 'Modern teknolojilerle üretime geçeriz.', color: 'from-emerald-500 to-teal-500' },
  { step: '04', title: 'Yayın & Destek', desc: 'Canlıya alır ve sürdürülebilir hale getiririz.', color: 'from-orange-500 to-red-500' },
] as const

const WHY = [
  { icon: Target, title: 'Ürün Deneyimi', desc: 'Kendi markalarımızdan gelen gerçek operasyon tecrübesi.' },
  { icon: Workflow, title: 'Tek Yapı', desc: 'Yazılım, satış ve operasyonu entegre yönetiyoruz.' },
  { icon: Zap, title: 'Performans', desc: 'Hızlı, stabil ve büyümeye hazır sistemler kuruyoruz.' },
] as const

export function ServicesPage() {
  const page = useMarketingPageContent('servicesPage', defaultServicesPageContent)
  const { cards: serviceCards } = useServiceCards()

  if (!page.enabled) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Sayfa şu an yayında değil</h1>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <PageHero
        eyebrow={page.heroEyebrow}
        title={page.heroTitle}
        description={page.heroDescription}
        image={frontendImages.pages.services}
        imageAlt="Woontegra dijital hizmetler"
        highlights={[
          { icon: Code2, title: page.highlight1 },
          { icon: BarChart3, title: page.highlight2 },
        ]}
      />

      <section className={`${SURFACE_MUTED} py-20 md:py-24`}>
        <div className={LAYOUT_CONTAINER_CLASS}>
          <SectionHeader
            eyebrow={page.sectionEyebrow}
            title={page.sectionTitle}
            subtitle={page.sectionDescription}
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {serviceCards.map((service) => (
              <FeatureCard
                key={service.id}
                icon={resolveIcon(service.icon)}
                title={service.title}
                description={service.description}
                href={service.href}
                gradient={service.gradient}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 md:py-24">
        <div className={LAYOUT_CONTAINER_CLASS}>
          <SectionHeader
            eyebrow="Süreç"
            title="Nasıl Çalışıyoruz?"
            subtitle="Şeffaf, planlı ve sonuç odaklı bir iş akışı ile projelerinizi hayata geçiriyoruz."
            dark
          />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((item) => (
              <div key={item.step} className="text-center">
                <div
                  className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-lg font-bold text-white shadow-lg`}
                >
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className={LAYOUT_CONTAINER_CLASS}>
          <SectionHeader
            eyebrow="Farkımız"
            title="Neden Woontegra?"
            subtitle="Sadece hizmet sunan değil; kendi ürünlerini geliştiren ve yöneten bir teknoloji şirketi."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {WHY.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-7 transition-all hover:border-emerald-200 hover:shadow-md"
              >
                <item.icon className="mb-4 h-8 w-8 text-emerald-600" aria-hidden />
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title={page.ctaTitle}
        description={page.ctaDescription}
        buttonText={page.ctaButtonText}
        buttonTo={page.ctaButtonLink}
        secondaryButtonText={page.ctaSecondaryButtonText || undefined}
        secondaryButtonTo={page.ctaSecondaryButtonLink || undefined}
      />
    </div>
  )
}
