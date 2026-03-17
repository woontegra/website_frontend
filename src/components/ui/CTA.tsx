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
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-slate-600 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            {subtitle}
          </p>
        )}
        <div className="flex flex-wrap gap-4 justify-center">
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
