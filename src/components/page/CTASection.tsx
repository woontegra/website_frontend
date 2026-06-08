import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from '../ui/Button'
import { LAYOUT_CONTAINER_CLASS } from '../../lib/layoutConstants'

type CTASectionProps = {
  title: string
  description: string
  buttonText?: string
  buttonTo?: string
  buttonHref?: string
  secondaryButtonText?: string
  secondaryButtonTo?: string
  secondaryButtonHref?: string
  children?: ReactNode
}

export function CTASection({
  title,
  description,
  buttonText = 'İletişime Geç',
  buttonTo = '/iletisim',
  buttonHref,
  secondaryButtonText,
  secondaryButtonTo,
  secondaryButtonHref,
  children,
}: CTASectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-600 py-20 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.12),transparent_50%)]" />
      <div className={`${LAYOUT_CONTAINER_CLASS} relative z-10 text-center`}>
        <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">{title}</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-emerald-50 md:text-lg">{description}</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button
            variant="outline"
            {...(buttonHref ? { href: buttonHref } : { to: buttonTo })}
            className="border-white/40 px-8 py-4 text-base text-white transition-all hover:bg-white hover:text-emerald-700"
          >
            {buttonText}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          {secondaryButtonText && (secondaryButtonTo || secondaryButtonHref) && (
            <Button
              variant="outline"
              {...(secondaryButtonHref ? { href: secondaryButtonHref } : { to: secondaryButtonTo })}
              className="border-white/25 bg-white/10 px-8 py-4 text-base text-white backdrop-blur-sm hover:bg-white/20"
            >
              {secondaryButtonText}
            </Button>
          )}
        </div>
        {children}
      </div>
    </section>
  )
}
