import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { StaticImage } from '../ui/StaticImage'
import { FeatureCard } from '../page/FeatureCard'
import { CTASection } from '../page/CTASection'
import { SectionHeader } from '../ui/SectionHeader'
import type { ServiceDetailContent, ServiceHeroTheme } from '../../data/serviceDetailContent'
import { extractHeroImage } from '../../lib/heroImage'
import type { HeroSectionData } from '../../types/sections'
import { LAYOUT_CONTAINER_CLASS } from '../../lib/layoutConstants'
import { SURFACE_MUTED } from '../../lib/sectionSurfaces'

const HERO_THEMES: Record<ServiceHeroTheme, string> = {
  emerald: 'from-slate-950 via-slate-900 to-emerald-950',
  purple: 'from-slate-950 via-indigo-950 to-purple-950',
  teal: 'from-slate-950 via-emerald-950 to-teal-950',
  blue: 'from-slate-950 via-slate-900 to-blue-950',
  amber: 'from-slate-950 via-amber-950 to-orange-950',
  violet: 'from-slate-950 via-violet-950 to-purple-950',
  slate: 'from-slate-950 via-slate-900 to-slate-800',
}

type ServiceDetailLayoutProps = {
  content: ServiceDetailContent
  /** CMS yalnızca hero görselini override eder; metin serviceDetailContent'ten gelir. */
  heroOverride?: HeroSectionData | null
}

export function ServiceDetailLayout({ content, heroOverride }: ServiceDetailLayoutProps) {
  const heroTitle = content.hero.title
  const heroDescription = content.hero.description
  const heroEyebrow = content.hero.eyebrow
  const heroImage = extractHeroImage(heroOverride) || content.hero.image

  return (
    <div className="bg-white">
      <section className={`relative overflow-hidden bg-gradient-to-br ${HERO_THEMES[content.heroTheme]} py-20 md:py-24`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(34,197,94,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className={`${LAYOUT_CONTAINER_CLASS} relative z-10`}>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="text-white">
              <p className="section-eyebrow border-emerald-400/30 bg-emerald-500/15 text-emerald-300">{heroEyebrow}</p>
              <h1 className="page-hero-title mt-4 text-white">{heroTitle}</h1>
              <p className="page-hero-description mt-5 max-w-xl text-slate-300">{heroDescription}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button variant="green" to={content.hero.primaryCta.to} className="px-6 py-3">
                  {content.hero.primaryCta.text}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  to={content.hero.secondaryCta.to}
                  className="border-white/30 px-6 py-3 text-white hover:bg-white hover:text-slate-900"
                >
                  {content.hero.secondaryCta.text}
                </Button>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-blue-500/15 blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-900/40 p-2 shadow-2xl shadow-emerald-900/20">
                <StaticImage
                  src={heroImage}
                  alt={content.hero.imageAlt}
                  className="aspect-[4/3] w-full rounded-xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${SURFACE_MUTED} py-20 md:py-24`}>
        <div className={LAYOUT_CONTAINER_CLASS}>
          <SectionHeader title={content.problems.title} subtitle={content.problems.subtitle} centered />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {content.problems.items.map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500 transition-colors group-hover:bg-red-100">
                  <item.icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className={LAYOUT_CONTAINER_CLASS}>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHeader title={content.approach.title} subtitle={content.approach.description} centered={false} />
              <ul className="mt-8 space-y-4">
                {content.approach.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
                    <span className="text-base text-slate-700">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-emerald-50/50 p-6 md:p-8">
              <p className="mb-6 text-center text-sm font-semibold uppercase tracking-wide text-slate-500">
                Süreç Akışı
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
                {content.approach.flowSteps.map((step, index) => (
                  <div key={step} className="flex items-center gap-2 md:gap-3">
                    <span className="rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-sm font-semibold text-emerald-800 shadow-sm">
                      {step}
                    </span>
                    {index < content.approach.flowSteps.length - 1 ? (
                      <ArrowRight className="hidden h-4 w-4 text-slate-400 sm:block" aria-hidden />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${SURFACE_MUTED} py-20 md:py-24`}>
        <div className={LAYOUT_CONTAINER_CLASS}>
          <SectionHeader title={content.scope.title} subtitle={content.scope.subtitle} centered />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {content.scope.items.map((item) => (
              <FeatureCard
                key={item.title}
                icon={item.icon}
                title={item.title}
                description={item.description}
                gradient={item.gradient}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className={LAYOUT_CONTAINER_CLASS}>
          <SectionHeader title={content.process.title} subtitle={content.process.subtitle} centered />
          <div className="mt-12 hidden lg:block">
            <div className="relative space-y-10">
              <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-emerald-300 via-emerald-500 to-emerald-300" />
              {content.process.steps.map((step, index) => (
                <div
                  key={step.step}
                  className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-10 text-right' : 'pl-10'}`}>
                    <div className="inline-block max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm">
                      <span className="text-sm font-bold text-emerald-600">{step.step}</span>
                      <h3 className="mt-2 text-lg font-bold text-slate-900">{step.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-white bg-emerald-500 shadow" />
                  <div className="w-1/2" />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 space-y-4 lg:hidden">
            {content.process.steps.map((step) => (
              <div key={`m-${step.step}`} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-sm font-bold text-white">
                  {step.step}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{step.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-20 md:py-24">
        <div className={LAYOUT_CONTAINER_CLASS}>
          <h2 className="section-title text-center text-white">{content.whyUs.title}</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {content.whyUs.items.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm transition-colors hover:border-emerald-500/30"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" aria-hidden />
                </div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${SURFACE_MUTED} py-20 md:py-24`}>
        <div className={LAYOUT_CONTAINER_CLASS}>
          <SectionHeader title={content.technology.title} subtitle={content.technology.description} centered />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {content.technology.items.map((item) => (
              <FeatureCard key={item.title} icon={item.icon} title={item.title} description={item.description} />
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title={content.cta.title}
        description={content.cta.description}
        buttonText={content.cta.buttonText}
        buttonTo={content.cta.buttonTo}
        secondaryButtonText={content.cta.secondaryButtonText}
        secondaryButtonTo={content.cta.secondaryButtonTo}
      />
    </div>
  )
}
