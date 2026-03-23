import { Link } from 'react-router-dom'
import { CTA_GRADIENT_OVERLAY, CTA_GRADIENT_SECTION, CTA_GLOW_BOTTOM } from '../../lib/sectionSurfaces'

export default function CTASection(p: Record<string, unknown>) {
  const title = String(p.title ?? '')
  const subtitle = String(p.subtitle ?? '')
  const buttonText = String(p.buttonText ?? '')
  const buttonHref = String(p.buttonHref ?? '#')
  const secondaryText = String(p.secondaryText ?? '')
  const secondaryHref = String(p.secondaryHref ?? '#')
  return (
    <section className={`relative overflow-hidden py-28 md:py-36 ${CTA_GRADIENT_SECTION}`} data-section="cta">
      <div className={CTA_GRADIENT_OVERLAY} aria-hidden />
      <div className={CTA_GLOW_BOTTOM} aria-hidden />
      <div className="container relative z-[1] mx-auto max-w-[900px] px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">{title}</h2>
        <p className="mt-6 text-lg leading-relaxed text-slate-300 md:text-xl">{subtitle}</p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
          {buttonText ? (
            buttonHref.startsWith('/') ? (
              <Link
                to={buttonHref}
                className="inline-flex min-h-[56px] items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 px-10 py-4 text-lg font-semibold text-white shadow-xl shadow-indigo-500/40 transition hover:opacity-95"
              >
                {buttonText}
              </Link>
            ) : (
              <a
                href={buttonHref}
                className="inline-flex min-h-[56px] items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 px-10 py-4 text-lg font-semibold text-white shadow-xl shadow-indigo-500/40 transition hover:opacity-95"
              >
                {buttonText}
              </a>
            )
          ) : null}
          {secondaryText ? (
            secondaryHref.startsWith('/') ? (
              <Link
                to={secondaryHref}
                className="inline-flex min-h-[56px] items-center justify-center rounded-2xl border-2 border-white/45 bg-white/5 px-10 py-4 text-lg font-semibold text-white shadow-lg backdrop-blur-sm transition hover:bg-white/15"
              >
                {secondaryText}
              </Link>
            ) : (
              <a
                href={secondaryHref}
                className="inline-flex min-h-[56px] items-center justify-center rounded-2xl border-2 border-white/45 bg-white/5 px-10 py-4 text-lg font-semibold text-white shadow-lg backdrop-blur-sm transition hover:bg-white/15"
              >
                {secondaryText}
              </a>
            )
          ) : null}
        </div>
      </div>
    </section>
  )
}
