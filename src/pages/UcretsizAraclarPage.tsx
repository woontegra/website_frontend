import { Clock, KeyRound, Shield, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHero } from '../components/page/PageHero'
import { CTASection } from '../components/page/CTASection'
import { SectionHeader } from '../components/ui/SectionHeader'
import { StaticImage } from '../components/ui/StaticImage'
import { LAYOUT_CONTAINER_CLASS } from '../lib/layoutConstants'
import { frontendImages } from '../data/frontendImages'
import { defaultUcretsizAraclarPageContent } from '../data/ucretsizAraclarPageContent'
import { getToolBadge } from '../data/freeToolCardsContent'
import { useFreeToolCards } from '../hooks/useFreeToolCards'
import { useMarketingPageContent } from '../hooks/useMarketingPageContent'
import { SURFACE_MUTED } from '../lib/sectionSurfaces'

function resolveToolImage(imageKey: string) {
  if (imageKey === 'sifre-kasasi') return frontendImages.sifreKasasiScreenshot
  return null
}

export function UcretsizAraclarPage() {
  const page = useMarketingPageContent('ucretsizAraclarPage', defaultUcretsizAraclarPageContent)
  const { cards: tools } = useFreeToolCards()

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
        image={frontendImages.pages.tools}
        imageAlt="Woontegra ücretsiz araçlar"
        highlights={[
          { icon: Shield, title: page.highlight1 },
          { icon: Sparkles, title: page.highlight2 },
        ]}
      />

      <section className={`${SURFACE_MUTED} py-20 md:py-24`}>
        <div className={LAYOUT_CONTAINER_CLASS}>
          <SectionHeader eyebrow={page.sectionEyebrow} title={page.sectionTitle} subtitle={page.sectionDescription} />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => {
              const image = resolveToolImage(tool.imageKey)
              const isActive = tool.status === 'active'
              const badge = getToolBadge(tool.status)

              const card = (
                <div
                  className={`flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all ${
                    isActive
                      ? 'border-slate-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl'
                      : 'border-slate-200/80 opacity-80'
                  }`}
                >
                  {image && (
                    <div className="h-44 overflow-hidden bg-slate-100">
                      <StaticImage src={image} alt={tool.name} className="h-full w-full object-cover object-top" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <h3 className="text-lg font-bold text-slate-900">{tool.name}</h3>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {badge}
                      </span>
                    </div>
                    <p className="flex-1 text-sm leading-relaxed text-slate-600">{tool.description}</p>
                    {isActive ? (
                      <span className="mt-4 text-sm font-semibold text-emerald-700">{tool.buttonText} →</span>
                    ) : (
                      <span className="mt-4 inline-flex items-center gap-1 text-sm text-slate-400">
                        <Clock className="h-4 w-4" />
                        {tool.buttonText}
                      </span>
                    )}
                  </div>
                </div>
              )

              return isActive && tool.href && tool.href !== '#' ? (
                <Link key={tool.id} to={tool.href} className="block">
                  {card}
                </Link>
              ) : (
                <div key={tool.id}>{card}</div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className={LAYOUT_CONTAINER_CLASS}>
          <div className="grid items-center gap-10 rounded-3xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-white p-8 md:grid-cols-2 md:p-12">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                <KeyRound className="h-4 w-4" />
                Öne Çıkan Araç
              </div>
              <h2 className="section-title">Woontegra Şifre Kasası</h2>
              <p className="body-text mt-4">
                Excel dosyaları yerine şifrelerinizi yerel ve şifreli bir masaüstü uygulamasında yönetin.
                Verileriniz bilgisayarınızda kalır; Woontegra sunucularına gönderilmez.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
              <Link
                to="/ucretsiz-araclar/sifre-kasasi"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Şifre Kasası Sayfası
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title={page.ctaTitle}
        description={page.ctaDescription}
        buttonText={page.ctaButtonText}
        buttonTo={page.ctaButtonLink}
      />
    </div>
  )
}
