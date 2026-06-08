import { Boxes, LayoutDashboard, Workflow } from 'lucide-react'
import { PageHero } from '../components/page/PageHero'
import { FeatureCard } from '../components/page/FeatureCard'
import { CTASection } from '../components/page/CTASection'
import { StatCard } from '../components/page/StatCard'
import { SectionHeader } from '../components/ui/SectionHeader'
import { LAYOUT_CONTAINER_CLASS } from '../lib/layoutConstants'
import { frontendImages } from '../data/frontendImages'
import { defaultSolutionsPageContent } from '../data/solutionsPageContent'
import { useMarketingPageContent } from '../hooks/useMarketingPageContent'
import { useSolutionCards } from '../hooks/useSolutionCards'
import { resolveIcon } from '../lib/iconRegistry'
import { SURFACE_MUTED } from '../lib/sectionSurfaces'

export function SolutionsPage() {
  const page = useMarketingPageContent('solutionsPage', defaultSolutionsPageContent)
  const { cards: solutionCards, benefits } = useSolutionCards()

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
        image={frontendImages.pages.solutions}
        imageAlt="Woontegra dijital çözümler"
        highlights={[{ title: page.highlight1 }, { title: page.highlight2 }]}
      />

      <section className={`${SURFACE_MUTED} py-20 md:py-24`}>
        <div className={LAYOUT_CONTAINER_CLASS}>
          <SectionHeader
            eyebrow="Ürün Mantığı"
            title="Çözüm Alanlarımız"
            subtitle="İşletmenizin dijital omurgasını modüler veya entegre şekilde kuruyoruz."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {solutionCards.map((item) => (
              <FeatureCard
                key={item.id}
                icon={resolveIcon(item.icon)}
                title={item.title}
                description={item.description}
                href={item.href}
                gradient={item.gradient}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className={LAYOUT_CONTAINER_CLASS}>
          <SectionHeader
            eyebrow="Değer"
            title="İşletmeye Ne Kazandırır?"
            subtitle="Sadece yazılım değil; yönetilebilir ve ölçülebilir bir dijital operasyon modeli sunarız."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {benefits.map((item) => (
              <StatCard
                key={item.id}
                icon={resolveIcon(item.icon)}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 md:py-24">
        <div className={LAYOUT_CONTAINER_CLASS}>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHeader
                eyebrow="Merkezi Yönetim"
                title="Tek Merkezden Yönetim"
                subtitle="Sipariş, stok, müşteri ve operasyon verilerini parçalı araçlar yerine entegre bir yapıda toplayın."
                centered={false}
                dark
              />
              <p className="body-text text-slate-400">
                Kendi markalarımızda kullandığımız operasyon deneyimini müşteri projelerine aktararak; e-ticaret,
                entegrasyon ve özel yazılım katmanlarını birbirine bağlı bir sistem olarak kuruyoruz.
              </p>
            </div>
            <div className="grid gap-4">
              <StatCard
                icon={LayoutDashboard}
                title="Tek panel mantığı"
                description="Farklı kanallar ve süreçler tek bakışta izlenebilir."
              />
              <StatCard
                icon={Workflow}
                title="Entegre iş akışı"
                description="Satış, operasyon ve raporlama birbirini besler."
              />
              <StatCard
                icon={Boxes}
                title="Modüler büyüme"
                description="İhtiyaç arttıkça sisteme yeni modüller eklenir."
              />
            </div>
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
