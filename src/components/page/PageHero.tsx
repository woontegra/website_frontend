import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { StaticImage } from '../ui/StaticImage'
import { LAYOUT_CONTAINER_CLASS } from '../../lib/layoutConstants'

export type HighlightCard = {
  icon?: LucideIcon
  title: string
}

type PageHeroProps = {
  eyebrow: string
  title: string
  description: string
  highlights?: HighlightCard[]
  image?: string
  imageAlt?: string
  rightContent?: ReactNode
  children?: ReactNode
  variant?: 'dark' | 'soft'
}

export function PageHero({
  eyebrow,
  title,
  description,
  highlights = [],
  image,
  imageAlt = '',
  rightContent,
  children,
  variant = 'dark',
}: PageHeroProps) {
  const isDark = variant === 'dark'

  return (
    <section
      className={
        isDark
          ? 'relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 py-20 md:py-24'
          : 'relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100 py-20 md:py-24'
      }
    >
      {isDark && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(34,197,94,0.15),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgba(59,130,246,0.12),transparent_50%)]" />
        </>
      )}
      <div className={`${LAYOUT_CONTAINER_CLASS} relative z-10`}>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className={isDark ? 'text-white' : 'text-slate-900'}>
            <p className="section-eyebrow">{eyebrow}</p>
            <h1 className="page-hero-title mt-4">{title}</h1>
            <p className={`page-hero-description mt-5 max-w-xl ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {description}
            </p>
            {highlights.length > 0 && (
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {highlights.map((card) => (
                  <div
                    key={card.title}
                    className={`rounded-xl border p-4 ${
                      isDark
                        ? 'border-white/10 bg-white/5 backdrop-blur-sm'
                        : 'border-slate-200 bg-white shadow-sm'
                    }`}
                  >
                    {card.icon && (
                      <card.icon
                        className={`mb-2 h-5 w-5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}
                        aria-hidden
                      />
                    )}
                    <p className={`text-sm font-medium leading-snug ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                      {card.title}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {children}
          </div>

          {(image || rightContent) && (
            <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
              {rightContent ?? (
                image && (
                  <>
                    <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-blue-500/15 blur-2xl" />
                    <div
                      className={`relative overflow-hidden rounded-2xl border p-2 shadow-2xl ${
                        isDark ? 'border-white/15 bg-slate-900/40 shadow-emerald-900/20' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <StaticImage src={image} alt={imageAlt} className="aspect-[4/3] w-full rounded-xl object-cover" />
                    </div>
                  </>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
