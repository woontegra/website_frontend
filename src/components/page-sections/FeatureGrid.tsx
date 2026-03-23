import { SURFACE_WHITE } from '../../lib/sectionSurfaces'
import { ServiceIcon } from '../ui/ServiceIcons'

export default function FeatureGrid(p: Record<string, unknown> & { surfaceBg?: string }) {
  const title = String(p.title ?? '')
  const description = String(p.description ?? '')
  const items = Array.isArray(p.items) ? (p.items as Record<string, unknown>[]) : []
  const bg = p.surfaceBg ?? SURFACE_WHITE
  return (
    <section className={`py-20 md:py-24 ${bg}`} data-section="features">
      <div className="container mx-auto max-w-[1200px] px-4">
        <h2 className="text-center text-3xl font-bold text-slate-900">{title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg leading-relaxed text-slate-600">{description}</p>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <div key={i} className="rounded-2xl border border-gray-200 p-8 transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-accent-blue">
                <ServiceIcon name={String(it.icon ?? 'code')} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{String(it.title ?? '')}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{String(it.description ?? '')}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
