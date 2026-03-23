import { Button } from './Button'

interface CTAProps {
  title: string
  subtitle?: string
  primaryAction?: { label: string; href: string }
  secondaryAction?: { label: string; href: string }
  className?: string
}

export function CTA({
  title,
  subtitle,
  primaryAction = { label: 'İletişime Geç', href: '/iletisim' },
  secondaryAction = { label: 'Teklif Al', href: '/teklif-al' },
  className = '',
}: CTAProps) {
  return (
    <section className={`py-24 md:py-28 bg-gradient-cta ${className}`}>
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-4 text-2xl font-semibold leading-relaxed tracking-[0.02em] text-slate-900 md:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-slate-600">
            {subtitle}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="xl" to={primaryAction.href}>
            {primaryAction.label}
          </Button>
          <Button variant="outline" size="xl" to={secondaryAction.href}>
            {secondaryAction.label}
          </Button>
        </div>
      </div>
    </section>
  )
}
