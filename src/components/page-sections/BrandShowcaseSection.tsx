import { useState } from 'react'
import { Link } from 'react-router-dom'
import { resolveMediaSrc } from '../../api/cms'

type BrandTone = 'indigo' | 'emerald' | 'coral' | 'ocean'

export type BrandShowcaseItem = {
  name: string
  description: string
  href: string
  logo: string
  coverImage?: string
  tone?: BrandTone
}

const TONE_STYLES: Record<BrandTone, { mesh: string; ring: string; fallback: string; logoBg: string }> = {
  indigo: {
    mesh: 'from-indigo-600/90 via-violet-600/75 to-slate-900/90',
    ring: 'ring-indigo-400/25',
    fallback: 'from-indigo-400 to-violet-600',
    logoBg: 'from-indigo-50/90 to-slate-100/70',
  },
  emerald: {
    mesh: 'from-emerald-600/85 via-teal-600/70 to-slate-900/88',
    ring: 'ring-emerald-400/25',
    fallback: 'from-emerald-400 to-teal-600',
    logoBg: 'from-emerald-50/90 to-slate-100/70',
  },
  coral: {
    mesh: 'from-rose-500/85 via-amber-500/65 to-slate-900/88',
    ring: 'ring-rose-300/30',
    fallback: 'from-rose-400 to-amber-500',
    logoBg: 'from-rose-50/90 to-slate-100/70',
  },
  ocean: {
    mesh: 'from-sky-600/88 via-blue-700/75 to-slate-900/90',
    ring: 'ring-sky-400/25',
    fallback: 'from-sky-500 to-blue-700',
    logoBg: 'from-sky-50/90 to-slate-100/70',
  },
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

function BrandCard({ item, cardClsAdd }: { item: BrandShowcaseItem; cardClsAdd?: string }) {
  const [logoOk, setLogoOk] = useState(true)
  const [coverOk, setCoverOk] = useState(!!item.coverImage)
  const tone: BrandTone = item.tone ?? 'ocean'
  const t = TONE_STYLES[tone]
  const external = /^https?:\/\//i.test(item.href)
  const showLogoFallback = !logoOk

  const cardCls =
    'group flex h-full flex-col overflow-hidden rounded-[1.35rem] backdrop-blur-sm ' +
    (cardClsAdd || 'border border-slate-200/50 bg-slate-50/90 shadow-lg shadow-slate-900/[0.06]') +
    ' ' +
    `transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10 hover:ring-2 ${t.ring} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`

  const visual = (
    <div className="relative aspect-[16/10] w-full overflow-hidden">
      {item.coverImage && coverOk ? (
        <img
          src={resolveMediaSrc(item.coverImage)}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          onError={() => setCoverOk(false)}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${t.fallback}`} aria-hidden />
      )}
      <div
        className={`absolute inset-0 bg-gradient-to-t ${t.mesh} opacity-95`}
        style={{ mixBlendMode: 'multiply' }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent" aria-hidden />
      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
        <span className="inline-flex items-center rounded-full border border-white/25 bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
          Alt marka
        </span>
      </div>
    </div>
  )

  const body = (
    <>
      {visual}
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <div className={`mb-4 flex h-16 items-center justify-center rounded-2xl bg-gradient-to-b ${t.logoBg} px-4 transition-colors group-hover:opacity-95`}>
          {showLogoFallback ? (
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${t.fallback} text-sm font-bold text-white shadow-md`}
            >
              {initials(item.name)}
            </span>
          ) : (
            <img
              src={resolveMediaSrc(item.logo)}
              alt=""
              className="max-h-12 w-auto max-w-[200px] object-contain"
              onError={() => setLogoOk(false)}
              loading="lazy"
            />
          )}
        </div>
        <h3 className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl">{item.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 md:text-[0.9375rem]">{item.description}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 group-hover:text-blue-800">
          Keşfet
          <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      </div>
    </>
  )

  if (external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={cardCls}>
        {body}
      </a>
    )
  }
  return (
    <Link to={item.href} className={cardCls}>
      {body}
    </Link>
  )
}

function parseItems(raw: unknown): BrandShowcaseItem[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((row) => {
      const r = row as Record<string, unknown>
      return {
        name: String(r.name ?? ''),
        description: String(r.description ?? ''),
        href: String(r.href ?? '#'),
        logo: String(r.logo ?? ''),
        coverImage: r.coverImage != null && String(r.coverImage) ? String(r.coverImage) : undefined,
        tone: ['indigo', 'emerald', 'coral', 'ocean'].includes(String(r.tone))
          ? (String(r.tone) as BrandTone)
          : undefined,
      }
    })
    .filter((x) => x.name)
}

const GRID_COLS: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

const CARD_STYLE_CLS: Record<string, string> = {
  shadow:
    'border border-slate-200/50 bg-slate-50/90 shadow-lg shadow-slate-900/[0.06]',
  bordered: 'border-2 border-slate-200 bg-white',
  minimal: 'border border-slate-100 bg-white/80',
}

export default function BrandShowcaseSection(p: Record<string, unknown> & { surfaceBg?: string }) {
  const title = String(
    p.title ?? p.umbrellaTitle ?? 'Ekosistemdeki markalar'
  )
  const subtitle = String(
    p.subtitle ??
      p.umbrellaSubtitle ??
      'Her marka kendi alanında güçlenir; Woontegra altyapı ve disiplinini paylaşır.'
  )
  const badge = String(p.badge ?? '')
  const items = parseItems(p.items)
  const bg = String(p.surfaceBg ?? '')
  const columns = typeof p.columns === 'number' ? Math.min(4, Math.max(1, p.columns)) : 4
  const gap = String(p.gap ?? '1.5rem')
  const cardStyle = String(p.cardStyle ?? 'shadow')
  const gridCls = GRID_COLS[columns] ?? GRID_COLS[4]
  const cardClsAdd = CARD_STYLE_CLS[cardStyle] ?? CARD_STYLE_CLS.shadow

  return (
    <section className={`relative overflow-hidden py-20 md:py-28 ${bg}`} aria-labelledby="brand-showcase-heading">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-50/40 via-rose-50/25 to-emerald-50/35"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-indigo-200/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-20 bottom-1/4 h-64 w-64 rounded-full bg-rose-200/20 blur-3xl"
        aria-hidden
      />

      <div className="relative z-[1] container mx-auto max-w-[1280px] px-4">
        <header className="mx-auto max-w-3xl text-center">
          {badge ? (
            <p className="mb-4 inline-flex items-center rounded-full border border-indigo-200/60 bg-indigo-50/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-indigo-800/90 shadow-sm backdrop-blur-sm">
              {badge}
            </p>
          ) : null}
          <h2
            id="brand-showcase-heading"
            className="text-3xl font-semibold tracking-tight md:text-4xl md:tracking-tight"
            style={{
              fontSize: 'var(--section-title-font-size)',
              fontWeight: 'var(--section-title-font-weight)',
              color: 'var(--section-title-color, #0f172a)',
            }}
          >
            {title}
          </h2>
          <p
            className="mt-5 text-base leading-relaxed md:text-lg"
            style={{
              fontSize: 'var(--section-subtitle-font-size)',
              color: 'var(--section-subtitle-color, #475569)',
            }}
          >
            {subtitle}
          </p>
        </header>

        <div className={`mt-14 grid ${gridCls}`} style={{ gap }}>
          {items.map((item) => (
            <BrandCard key={item.name + item.href} item={item} cardClsAdd={cardClsAdd} />
          ))}
        </div>
      </div>
    </section>
  )
}
