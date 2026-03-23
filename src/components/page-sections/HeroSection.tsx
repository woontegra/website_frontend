import { Link } from 'react-router-dom'
import type { CSSProperties } from 'react'
import type { SectionSettings, SectionStyle } from '../../types/section-builder'
import { heroSectionStyleVars, sectionHasVisualBackground } from '../../lib/sectionSettingsStyle'
import { LAYOUT_CONTAINER_CLASS } from '../../lib/layoutConstants'
import { HeroFloatingCards } from './HeroFloatingCards'

/**
 * Tek hero bileşeni — website + builder aynı dosya.
 * Panel tipografisi için `style` üst bileşenden gelir.
 */
export type HeroSectionProps = {
  content: Record<string, unknown>
  settings?: SectionSettings & Record<string, unknown>
  isBuilderMode?: boolean
  style?: SectionStyle & Record<string, unknown>
}

function IconShield({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  )
}

function IconBolt({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  )
}

function IconLayers({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
      />
    </svg>
  )
}

const CTA_BASE_CLASS =
  'inline-flex min-h-[52px] w-full items-center justify-center rounded-xl px-8 py-4 text-center text-lg font-semibold sm:w-auto'

function TrustIcon({ type, className = 'text-accent-blue' }: { type: string; className?: string }) {
  if (type === 'infra')
    return (
      <svg className={`h-4 w-4 shrink-0 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    )
  if (type === 'multi')
    return (
      <svg className={`h-4 w-4 shrink-0 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
      </svg>
    )
  return (
    <svg className={`h-4 w-4 shrink-0 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
}

function BadgeIcon({ type, dark }: { type: string; dark?: boolean }) {
  const ic = dark ? 'text-cyan-300' : 'text-blue-500'
  if (['infra', 'multi', 'partner'].includes(type)) {
    const tc =
      dark ? 'text-cyan-300' : type === 'partner' ? 'text-accent-green' : 'text-accent-blue'
    return <TrustIcon type={type} className={tc} />
  }
  if (type === 'bolt') return <IconBolt className={`h-4 w-4 shrink-0 ${ic}`} />
  if (type === 'layers') return <IconLayers className={`h-4 w-4 shrink-0 ${ic}`} />
  return <IconShield className={`h-4 w-4 shrink-0 ${ic}`} />
}

export function normalizeHeroContent(raw: Record<string, unknown>): Record<string, unknown> {
  const out = { ...raw }
  const pc = raw.primaryCta as { label?: string; href?: string } | undefined
  const sc = raw.secondaryCta as { label?: string; href?: string } | undefined
  if (pc?.label && !out.cta1) {
    out.cta1 = { text: pc.label, href: pc.href ?? '#' }
  }
  if (sc?.label && !out.cta2) {
    out.cta2 = { text: sc.label, href: sc.href ?? '#' }
  }
  return out
}

function HeroCtaPrimary({
  text,
  href,
  isBuilderMode,
  isDark,
}: {
  text: string
  href: string
  isBuilderMode: boolean
  isDark: boolean
}) {
  const cls = isDark
    ? `${CTA_BASE_CLASS} bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-md`
    : `${CTA_BASE_CLASS} shadow-md`
  const btnStyle: CSSProperties = isDark
    ? {}
    : {
        background: `linear-gradient(to right, var(--hero-gradient-from), var(--hero-gradient-via), var(--hero-gradient-to))`,
        color: 'var(--section-button-text-color, #fff)',
      }
  const inner = isDark ? text : <span>{text}</span>
  if (isBuilderMode) {
    return (
      <button type="button" className={cls} style={btnStyle} tabIndex={-1}>
        {inner}
      </button>
    )
  }
  return href.startsWith('/') ? (
    <Link to={href} className={cls} style={btnStyle}>
      {inner}
    </Link>
  ) : (
    <a href={href} className={cls} style={btnStyle}>
      {inner}
    </a>
  )
}

function HeroCtaSecondary({
  text,
  href,
  isBuilderMode,
  isDark,
}: {
  text: string
  href: string
  isBuilderMode: boolean
  isDark?: boolean
}) {
  const cls = isDark
    ? `${CTA_BASE_CLASS} border-2 border-white/40 bg-transparent text-white`
    : `${CTA_BASE_CLASS} border-2 border-slate-200/80 bg-white/60 text-slate-800 hover:border-slate-300 hover:bg-white`
  if (isBuilderMode) {
    return (
      <button type="button" className={cls} tabIndex={-1}>
        {text}
      </button>
    )
  }
  return href.startsWith('/') ? (
    <Link to={href} className={cls}>
      {text}
    </Link>
  ) : (
    <a href={href} className={cls}>
      {text}
    </a>
  )
}

const DEFAULT_BADGES: { text: string; icon: string }[] = [
  { text: 'Kurumsal güven', icon: 'shield' },
  { text: 'Hızlı teslimat', icon: 'bolt' },
  { text: 'Ölçeklenebilir mimari', icon: 'layers' },
]

export default function HeroSection({
  content: rawContent,
  settings = {},
  isBuilderMode = false,
  style = {},
}: HeroSectionProps) {
  const p = normalizeHeroContent(rawContent)
  const plainSurface = sectionHasVisualBackground(settings)
  const heroVars = heroSectionStyleVars(settings, style)
  const isDarkHero = !plainSurface
  const surfaceStyle = {
    ...heroVars,
    ...(isDarkHero
      ? {
          '--section-title-color': '#f8fafc',
          '--section-subtitle-color': '#e2e8f0',
          '--section-text-color': '#e2e8f0',
          '--hero-gradient-from': '#60a5fa',
          '--hero-gradient-via': '#34d399',
          '--hero-gradient-to': '#10b981',
        }
      : {}),
  } as CSSProperties

  const title = String(p.title ?? '')
  const headlinePrefix = String(p.headlinePrefix ?? '')
  const headlineGradient = String(p.headlineGradient ?? '')
  const subtitle = String(p.subtitle ?? '')
  const ctaLegacy = (p.cta1 as { text?: string; href?: string }) ?? {}
  const buttonText = String(p.buttonText ?? '')
  const buttonLink = String(p.buttonLink ?? '/')
  const cta1 =
    ctaLegacy.text || !buttonText
      ? ctaLegacy
      : { text: buttonText, href: buttonLink || '#' }
  const cta2 = (p.cta2 as { text?: string; href?: string }) ?? {}
  const imageUrl = String(p.imageUrl ?? p.image ?? '')
  const imagePosition = String(p.imagePosition ?? 'right') as 'left' | 'right'
  const imageSize = String(p.imageSize ?? 'medium') as 'small' | 'medium' | 'large' | 'custom'
  const imageHeight = String(p.imageHeight ?? '')
  const imgFirst = imagePosition === 'left'
  const imgMax =
    imageSize === 'small' ? 'max-w-sm' : imageSize === 'large' ? 'max-w-2xl' : 'max-w-lg'
  const rawBadges = p.badges
  const hasSplitHeadline = Boolean(headlinePrefix || headlineGradient)
  const displayTitle = hasSplitHeadline ? headlinePrefix + headlineGradient : title
  const showMockup = p.showMockup !== false

  const rawBadgesList = Array.isArray(rawBadges)
    ? (rawBadges as { text?: string; label?: string; icon?: string }[])
    : []
  const badges: { text: string; icon: string }[] = rawBadgesList.length
    ? rawBadgesList.map((b) => ({
        text: String(b.text ?? b.label ?? ''),
        icon: String(b.icon ?? ''),
      }))
    : DEFAULT_BADGES

  const headlineGradientStyle: CSSProperties = {
    background: `linear-gradient(to right, var(--hero-gradient-from), var(--hero-gradient-via), var(--hero-gradient-to))`,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
  }

  const rowStyle: CSSProperties = { gap: 'var(--hero-grid-gap)' }

  const sectionSurfaceClass = isDarkHero
    ? 'bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900'
    : 'bg-white'

  return (
    <section
      className={`relative isolate flex min-h-screen w-full items-center overflow-hidden ${sectionSurfaceClass}`}
      data-section="hero"
      style={surfaceStyle}
    >
      <div className={`${LAYOUT_CONTAINER_CLASS} relative z-[1] w-full py-16 md:py-20`}>
        <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-2" style={rowStyle}>
          <div
            className={`w-full text-center lg:text-left ${imgFirst ? 'order-1 lg:order-2' : 'order-1 lg:order-1'}`}
          >
            <h1
              className={
                isDarkHero
                  ? 'text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl'
                  : 'text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl'
              }
              style={
                isDarkHero
                  ? undefined
                  : {
                      fontSize: 'var(--section-title-font-size)',
                      fontWeight: 'var(--section-title-font-weight)',
                      color: 'var(--section-title-color, #0f172a)',
                    }
              }
            >
              {hasSplitHeadline ? (
                <>
                  <span
                    className="block sm:inline"
                    style={
                      isDarkHero
                        ? { color: '#f8fafc' }
                        : { color: 'var(--section-title-color, #0f172a)' }
                    }
                  >
                    {headlinePrefix}
                  </span>
                  <span className="block sm:inline" style={headlineGradientStyle}>
                    {headlineGradient}
                  </span>
                </>
              ) : (
                displayTitle
              )}
            </h1>
            <p
              className={
                isDarkHero
                  ? 'mt-6 max-w-xl text-base opacity-80 md:text-lg lg:mx-0 mx-auto'
                  : 'mt-6 max-w-xl text-base md:text-lg lg:mx-0 mx-auto'
              }
              style={{
                color: isDarkHero ? undefined : 'var(--section-subtitle-color, #475569)',
                fontSize: isDarkHero ? undefined : 'var(--section-subtitle-font-size)',
              }}
            >
              {isDarkHero ? <span className="text-white">{subtitle}</span> : subtitle}
            </p>
            <div
              className="mt-8 flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-center lg:justify-start"
              style={{ gap: 'var(--hero-cta-row-gap)' }}
            >
              {cta1.text ? (
                <HeroCtaPrimary
                  text={cta1.text}
                  href={cta1.href ?? '#'}
                  isBuilderMode={isBuilderMode}
                  isDark={isDarkHero}
                />
              ) : null}
              {cta2.text ? (
                <HeroCtaSecondary
                  text={cta2.text}
                  href={cta2.href ?? '#'}
                  isBuilderMode={isBuilderMode}
                  isDark={isDarkHero}
                />
              ) : null}
            </div>
            <div
              className="mt-10 flex flex-wrap justify-center lg:justify-start"
              style={{ gap: 'var(--hero-badge-row-gap)' }}
            >
              {badges
                .filter((b) => b.text)
                .map(({ text, icon }) => (
                  <span
                    key={text}
                    className={
                      isDarkHero
                        ? 'inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-medium text-slate-200 backdrop-blur-sm'
                        : 'inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-4 py-2 text-xs font-medium text-slate-600 shadow-sm'
                    }
                    style={!isDarkHero ? { color: 'var(--section-text-color, #475569)' } : undefined}
                  >
                    <BadgeIcon type={icon} dark={isDarkHero} />
                    {text}
                  </span>
                ))}
            </div>
          </div>

          {showMockup ? (
            <div
              className={`flex w-full justify-center lg:justify-end ${imgFirst ? 'order-2 lg:order-1' : 'order-2 lg:order-2'}`}
            >
              <div
                className={`w-full ${imageSize === 'custom' && imageHeight ? 'max-w-lg' : imgMax} mx-auto shadow-2xl lg:ml-auto lg:mr-0`}
              >
                <HeroFloatingCards
                  imageUrl={imageUrl}
                  imageHeight={imageHeight || undefined}
                  variant={isDarkHero ? 'dark' : 'light'}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
