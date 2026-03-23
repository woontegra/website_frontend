import { SURFACE_WHITE } from '../../lib/sectionSurfaces'

export default function StatsSection(p: Record<string, unknown> & { surfaceBg?: string }) {
  const title = String(p.title ?? '')
  const items = Array.isArray(p.items) ? (p.items as Record<string, unknown>[]) : []
  const bg = p.surfaceBg ?? SURFACE_WHITE
  return (
    <section className={`border-y border-gray-100 py-16 md:py-20 ${bg}`} data-section="stats">
      <div className="container mx-auto px-4 max-w-[1200px]">
        {title ? <h2 className="text-2xl font-bold text-center text-slate-900 mb-12">{title}</h2> : null}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((it, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent-blue">{String(it.value ?? '')}</div>
              <div className="mt-2 text-sm text-slate-600 font-medium">{String(it.label ?? '')}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
