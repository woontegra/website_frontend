import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { CmsSection, CmsFaq, CmsSectionItem } from '../../types/cms'
import { Button } from '../ui/Button'
import { ServiceIcon } from '../ui/ServiceIcons'
import { SolutionCard } from '../ui/SolutionCard'
import { StatCard } from '../ui/StatCard'
import { CmsContactForm, CmsQuoteForm } from './CmsForms'

function c<T = Record<string, unknown>>(v: unknown): T {
  return (v && typeof v === 'object' ? v : {}) as T
}

function TrustIcon({ type }: { type: string }) {
  if (type === 'infra')
    return (
      <svg className="w-4 h-4 shrink-0 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    )
  if (type === 'multi')
    return (
      <svg className="w-4 h-4 shrink-0 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
      </svg>
    )
  return (
    <svg className="w-4 h-4 shrink-0 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
}

function WhyIcon({ name }: { name: string }) {
  const cls = 'w-10 h-10 text-accent-blue'
  const g = 'w-10 h-10 text-accent-green'
  const paths: Record<string, JSX.Element> = {
    layers: (
      <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    code: (
      <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    shield: (
      <svg className={g} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    growth: (
      <svg className={g} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  }
  return paths[name] ?? paths.layers
}

function AudienceIcon({ icon }: { icon: string | null }) {
  const cls = 'w-8 h-8 shrink-0 text-accent-blue'
  if (icon === 'rocket')
    return (
      <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  if (icon === 'kobi')
    return (
      <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  if (icon === 'gov')
    return (
      <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
      </svg>
    )
  return (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  )
}

function DashboardMockup() {
  return (
    <div className="relative w-full max-w-[480px] mx-auto lg:mx-0">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-xl p-5 md:p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
        <div className="flex gap-1.5 mb-5">
          {[1, 2, 3].map((i) => (
            <span key={i} className="w-3 h-3 rounded-full bg-slate-300" />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { l: 'Projeler', v: '24' },
            { l: 'Tamamlanan', v: '156' },
            { l: 'Memnuniyet', v: '%98' },
          ].map((x) => (
            <div key={x.l} className="rounded-xl border border-gray-100 bg-slate-50/80 p-3">
              <p className="text-[10px] font-medium text-slate-500 uppercase">{x.l}</p>
              <p className="text-lg font-bold text-slate-900">{x.v}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-gray-100 bg-slate-50/60 p-4 h-28 flex items-end gap-1">
          {[40, 65, 45, 80, 55, 70, 85].map((h, i) => (
            <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-accent-blue/80 to-accent-blue/40" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

function BlogApiSection({ section }: { section: CmsSection }) {
  const ct = c(section.content)
  const [posts, setPosts] = useState<{ slug: string; title: string; excerpt?: string }[]>([])
  useEffect(() => {
    const base = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'
    fetch(`${base}/api/blog/posts`)
      .then((r) => r.json())
      .then((j) => setPosts(j.data ?? j.posts ?? []))
      .catch(() => setPosts([]))
  }, [])
  return (
    <section className="py-12 container mx-auto px-4 max-w-3xl">
      {section.title && <h2 className="text-xl font-bold text-slate-900 mb-6">{section.title}</h2>}
      <ul className="space-y-4">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link to={`/blog/${p.slug}`} className="text-accent-blue font-semibold hover:underline">
              {p.title}
            </Link>
            {p.excerpt && <p className="text-sm text-slate-600 mt-1">{p.excerpt}</p>}
          </li>
        ))}
      </ul>
      {posts.length === 0 && <p className="text-slate-500 text-sm">{String(ct.emptyMessage ?? 'Yazılar yükleniyor veya henüz yok.')}</p>}
    </section>
  )
}

const CAT_LABELS: Record<string, string> = {
  tumu: 'Tümü',
  yazilim: 'Yazılım',
  'e-ticaret': 'E-Ticaret',
  danismanlik: 'Danışmanlık',
  'marka-patent': 'Marka & Patent',
}

function ServiceCardsSection({ section }: { section: CmsSection }) {
  const [cat, setCat] = useState('tumu')
  const filters = (section.content?.filterCategories as string[]) ?? ['tumu', 'yazilim', 'e-ticaret', 'danismanlik', 'marka-patent']
  const items = section.items.filter((i) => {
    if (cat === 'tumu') return true
    const c = (i.extraData as { category?: string })?.category
    return c === cat
  })
  return (
    <>
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {filters.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setCat(key)}
            className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
              cat === key ? 'bg-accent-blue text-white shadow-sm' : 'bg-white border border-gray-200 text-slate-600 hover:border-accent-blue/30'
            }`}
          >
            {CAT_LABELS[key] ?? key}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {items.map((item) => (
          <ServicePageCard key={item.id} item={item} />
        ))}
      </div>
    </>
  )
}

function ServicePageCard({ item }: { item: CmsSectionItem }) {
  const ex = c(item.extraData)
  const features = (ex.features as string[]) ?? []
  const href = (ex.href as string) ?? '#'
  return (
    <Link
      to={href}
      className="group block h-full rounded-2xl border border-gray-200 bg-white p-6 sm:p-7 shadow-sm transition-all duration-300 hover:-translate-y-6 hover:shadow-xl hover:border-accent-blue/30"
    >
      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#eff6ff] text-accent-blue">
        <ServiceIcon name={item.icon ?? 'code'} />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
      <p className="mt-3 text-[#475569] text-sm leading-relaxed line-clamp-3">{item.description}</p>
      {features.length > 0 && (
        <ul className="mt-5 space-y-2">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
              <svg className="w-4 h-4 text-accent-green shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {f}
            </li>
          ))}
        </ul>
      )}
      <span className="mt-6 inline-flex items-center text-sm font-semibold text-accent-blue">
        Detaylı incele
        <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </span>
    </Link>
  )
}

function FaqAccordion({ faqs }: { faqs: CmsFaq[] }) {
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null)
  return (
    <div className="space-y-4">
      {faqs.map((faq) => {
        const isOpen = open === faq.id
        return (
          <div
            key={faq.id}
            className={`rounded-2xl border bg-white transition-all ${isOpen ? 'border-accent-blue/30 shadow-lg' : 'border-gray-200 hover:shadow-md'}`}
          >
            <button type="button" className="w-full text-left flex justify-between items-center px-8 py-6" onClick={() => setOpen(isOpen ? null : faq.id)}>
              <span className="font-semibold text-slate-900 pr-4">{faq.question}</span>
              <span className="shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && <div className="px-8 pb-6 text-slate-600 border-t border-gray-100 pt-4">{faq.answer}</div>}
          </div>
        )
      })}
    </div>
  )
}

export function CmsSectionView({ section, pageFaqs }: { section: CmsSection; pageFaqs: CmsFaq[] }) {
  const ct = c(section.content)

  switch (section.type) {
    case 'hero': {
      const badges = (ct.badges as { label: string; icon: string }[]) ?? []
      const pc = ct.primaryCta as { label: string; href: string }
      const sc = ct.secondaryCta as { label: string; href: string }
      return (
        <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-white pt-24 pb-28 md:py-28">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 80% 50% at 85% 10%, rgba(37, 99, 235, 0.08), transparent 50%), radial-gradient(ellipse 60% 40% at 15% 95%, rgba(5, 150, 105, 0.06), transparent 50%)`,
            }}
          />
          <div className="container relative mx-auto px-4 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="animate-fade-up-hero">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight max-w-[650px]">
                  <span className="text-slate-900">{String(ct.headlinePrefix ?? '')}</span>
                  <span className="bg-gradient-to-r from-accent-blue via-accent-blue-light to-accent-green bg-clip-text text-transparent">
                    {String(ct.headlineGradient ?? '')}
                  </span>
                </h1>
                <p className="mt-6 text-lg text-slate-600 max-w-[500px] leading-relaxed">{String(ct.subtitle ?? '')}</p>
                <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-4">
                  {pc?.label && (
                    <Button variant="hero" size="xl" to={pc.href} className="w-full sm:w-auto">
                      {pc.label}
                    </Button>
                  )}
                  {sc?.label && (
                    <Link
                      to={sc.href}
                      className="inline-flex items-center justify-center min-h-[52px] px-8 py-4 text-lg font-semibold rounded-xl border-2 border-gray-200 text-slate-700 hover:border-accent-blue/40 hover:text-accent-blue w-full sm:w-auto text-center"
                    >
                      {sc.label}
                    </Link>
                  )}
                </div>
                {badges.length > 0 && (
                  <div className="mt-10 flex flex-wrap gap-3">
                    {badges.map((b) => (
                      <span key={b.label} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 text-slate-600 text-sm font-medium">
                        <TrustIcon type={b.icon} />
                        {b.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {ct.showMockup !== false && (
                <div className="flex justify-center lg:justify-end opacity-0 animate-scale-in">
                  <DashboardMockup />
                </div>
              )}
            </div>
          </div>
        </section>
      )
    }
    case 'page_hero':
      return (
        <section className="relative mt-20 py-24 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_50%_at_70%_0%,rgba(37,99,235,0.06),transparent_55%)]" />
          <div className="container mx-auto px-4 relative max-w-[700px] text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">{String(ct.title ?? section.title ?? '')}</h1>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">{String(ct.subtitle ?? '')}</p>
            {Array.isArray(ct.badges) && (
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {(ct.badges as string[]).map((b) => (
                  <span key={b} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                    {b}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>
      )
    case 'service_hero': {
      const pc = ct.primaryCta as { label: string; href: string }
      const sc = ct.secondaryCta as { label: string; href: string }
      return (
        <section className="relative pt-24 pb-20 md:py-28 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 80% 50% at 85% 10%, rgba(37, 99, 235, 0.07), transparent 50%), radial-gradient(ellipse 60% 40% at 15% 95%, rgba(5, 150, 105, 0.05), transparent 50%)`,
            }}
          />
          <div className="container mx-auto px-4 max-w-6xl relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">{String(ct.title ?? '')}</h1>
                <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-[560px]">{String(ct.subtitle ?? '')}</p>
                <div className="mt-8 flex flex-wrap gap-4">
                  {pc?.label && <Button variant="hero" size="xl" to={pc.href}>{pc.label}</Button>}
                  {sc?.label && <Button variant="outline" size="xl" to={sc.href}>{sc.label}</Button>}
                </div>
              </div>
              {ct.showMockup !== false && (
                <div className="flex justify-center lg:justify-end">
                  <DashboardMockup />
                </div>
              )}
            </div>
          </div>
        </section>
      )
    }
    case 'trust_grid':
      return (
        <section className="py-24 md:py-28 bg-slate-50">
          <div className="container mx-auto px-4 max-w-[1200px]">
            {section.title && (
              <>
                <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900">{section.title}</h2>
                <p className="mt-4 text-lg text-slate-600 text-center max-w-[600px] mx-auto">{String(ct.subtitle ?? '')}</p>
              </>
            )}
            <div className={`grid md:grid-cols-3 gap-6 md:gap-8 ${section.title ? 'mt-12' : ''}`}>
              {section.items.map((it) => (
                <div key={it.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                  <h3 className="text-lg font-semibold text-slate-900">{it.title}</h3>
                  <p className="mt-2 text-slate-600 text-sm leading-relaxed">{it.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )
    case 'card_grid':
      return (
        <section className="py-24 md:py-28 bg-white">
          <div className="container mx-auto px-4 max-w-[1200px]">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900">{section.title}</h2>
            <p className="mt-4 text-lg text-slate-600 text-center max-w-[600px] mx-auto">{String(ct.subtitle ?? '')}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-12">
              {section.items.map((it) => {
                const href = (it.extraData as { href?: string })?.href ?? '#'
                return (
                  <Link key={it.id} to={href} className="group block rounded-2xl border border-gray-200 p-6 h-full hover:shadow-md hover:-translate-y-0.5 transition-all">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eff6ff] text-accent-blue mb-3">
                      <ServiceIcon name={it.icon ?? 'code'} />
                    </div>
                    <h3 className="font-semibold text-slate-900">{it.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{it.description}</p>
                    <span className="mt-4 inline-flex text-sm font-medium text-accent-blue">Detaylı bilgi →</span>
                  </Link>
                )
              })}
            </div>
            {ct.footerCta && (
              <div className="mt-12 text-center">
                <Button variant="secondary" to={(ct.footerCta as { href: string }).href}>
                  {(ct.footerCta as { label: string }).label}
                </Button>
              </div>
            )}
          </div>
        </section>
      )
    case 'sub_brands':
      return (
        <section className="py-24 md:py-28 bg-slate-50">
          <div className="container mx-auto px-4 max-w-[1200px]">
            <h2 className="text-2xl md:text-3xl font-bold text-center">{section.title}</h2>
            <p className="mt-4 text-center text-slate-600 max-w-xl mx-auto">{String(ct.subtitle ?? '')}</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {section.items.map((it) => (
                <SolutionCard
                  key={it.id}
                  name={it.title ?? ''}
                  description={it.description ?? ''}
                  href={(it.extraData as { href?: string })?.href ?? '#'}
                />
              ))}
            </div>
            {ct.footerCta && (
              <div className="mt-12 text-center">
                <Button variant="secondary" to={(ct.footerCta as { href: string }).href}>
                  {(ct.footerCta as { label: string }).label}
                </Button>
              </div>
            )}
          </div>
        </section>
      )
    case 'why_grid':
      return (
        <section className="py-24 md:py-28 bg-white">
          <div className="container mx-auto px-4 max-w-[1200px]">
            <h2 className="text-2xl md:text-3xl font-bold text-center">{section.title}</h2>
            <p className="mt-4 text-center text-slate-600">{String(ct.subtitle ?? '')}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
              {section.items.map((it) => (
                <div key={it.id}>
                  <WhyIcon name={it.icon ?? 'layers'} />
                  <h3 className="mt-4 font-semibold text-slate-900">{it.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{it.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )
    case 'process_steps':
      return (
        <section className="py-24 md:py-28 bg-slate-50">
          <div className="container mx-auto px-4 max-w-[1200px]">
            <h2 className="text-2xl md:text-3xl font-bold text-center">{section.title}</h2>
            <p className="mt-4 text-center text-slate-600 max-w-xl mx-auto">{String(ct.subtitle ?? '')}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
              {section.items.map((it, i) => (
                <div key={it.id} className="flex gap-4">
                  <span className="text-5xl font-bold text-slate-200 shrink-0">{it.icon ?? String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{it.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{it.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )
    case 'stats_row':
      return (
        <section className="py-24 md:py-28 bg-white">
          <div className="container mx-auto px-4 max-w-[1200px]">
            <div className="grid sm:grid-cols-3 gap-8">
              {section.items.map((it) => (
                <StatCard key={it.id} value={it.title ?? ''} label={it.description ?? ''} />
              ))}
            </div>
          </div>
        </section>
      )
    case 'cta': {
      const pc = ct.primaryCta as { label: string; href: string }
      const sc = ct.secondaryCta as { label: string; href: string }
      const grad = ct.variant === 'gradient_blue'
      return (
        <section
          className={`py-24 md:py-28 ${grad ? '' : 'bg-gradient-cta'}`}
          style={grad ? { background: 'linear-gradient(180deg, #ffffff 0%, #f0f9ff 100%)' } : undefined}
        >
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{String(ct.title ?? '')}</h2>
            <p className="mt-4 text-lg text-slate-600">{String(ct.subtitle ?? '')}</p>
            <div className="mt-10 flex flex-wrap gap-4 justify-center">
              {pc?.label && (grad ? <Button variant="hero" size="xl" to={pc.href}>{pc.label}</Button> : <Button size="xl" to={pc.href}>{pc.label}</Button>)}
              {sc?.label && <Button variant="outline" size="xl" to={sc.href}>{sc.label}</Button>}
            </div>
          </div>
        </section>
      )
    }
    case 'overview':
      return (
        <section className="py-20 md:py-24">
          <div className="container mx-auto px-4 max-w-[1200px]">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-8 hover:shadow-md transition-all">
              <p className="text-sm font-semibold uppercase tracking-wider text-accent-blue mb-4">{section.title ?? 'Genel Bakış'}</p>
              <p className="text-slate-600 leading-relaxed text-lg">{String(ct.body ?? '')}</p>
            </div>
          </div>
        </section>
      )
    case 'target_audience':
      return (
        <section className="py-20 md:py-24 border-t border-gray-100">
          <div className="container mx-auto px-4 max-w-[1200px]">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-10">{section.title}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {section.items.map((it) => (
                <div key={it.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                  <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-[#eff6ff] mb-4">
                    <AudienceIcon icon={it.icon} />
                  </div>
                  <h3 className="font-semibold text-slate-900">{it.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{it.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )
    case 'features_list':
      return (
        <section className="py-20 md:py-24 border-t border-gray-100">
          <div className="container mx-auto px-4 max-w-[1200px]">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-10">{section.title}</h2>
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-8 md:p-10">
              <ul className="space-y-5">
                {section.items.map((it) => (
                  <li key={it.id} className="flex items-start gap-4">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-accent-green/10 flex items-center justify-center mt-0.5">
                      <svg className="w-3.5 h-3.5 text-accent-green" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-slate-700 text-lg">{it.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )
    case 'process_timeline':
      return (
        <section className="py-20 md:py-24 border-t border-gray-100">
          <div className="container mx-auto px-4 max-w-[1200px]">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-10">{section.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {section.items.map((it, i) => (
                <div key={it.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                  <span className="text-4xl font-bold text-slate-200">{i + 1}</span>
                  <h3 className="mt-4 font-semibold text-slate-900">{it.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )
    case 'faq_block':
      return pageFaqs.length === 0 ? null : (
        <section className="py-20 md:py-24 border-t border-gray-100">
          <div className="container mx-auto px-4 max-w-[900px]">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-10">{section.title}</h2>
            <FaqAccordion faqs={pageFaqs} />
          </div>
        </section>
      )
    case 'rich_text':
      return (
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-[1200px] prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: String(ct.html ?? '') }} />
        </section>
      )
    case 'service_cards':
      return (
        <section className="container mx-auto px-4 max-w-[1200px] mt-16 pb-20">
          <ServiceCardsSection section={section} />
        </section>
      )
    case 'blog_api':
      return <BlogApiSection section={section} />
    case 'contact_form':
      return <CmsContactForm content={ct} />
    case 'quote_form':
      return <CmsQuoteForm content={ct} />
    default:
      return null
  }
}
