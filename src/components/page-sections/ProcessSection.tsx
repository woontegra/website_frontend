import { SURFACE_WHITE } from '../../lib/sectionSurfaces'

export default function ProcessSection(p: Record<string, unknown> & { surfaceBg?: string }) {
  const title = String(p.title ?? '')
  const subtitle = String(p.subtitle ?? '')
  const steps = Array.isArray(p.steps) ? (p.steps as Record<string, unknown>[]) : []
  const bg = p.surfaceBg ?? SURFACE_WHITE
  return (
    <section className={`py-20 md:py-24 ${bg}`} data-section="process">
      <div className="container mx-auto px-4 max-w-[1000px]">
        <h2 className="text-3xl font-bold text-center text-slate-900">{title}</h2>
        <p className="mt-4 text-center text-slate-600">{subtitle}</p>
        <ol className="mt-14 space-y-8">
          {steps.map((st, i) => (
            <li key={i} className="flex gap-6">
              <div className="shrink-0 w-10 h-10 rounded-full bg-accent-blue text-white font-bold flex items-center justify-center text-sm">
                {i + 1}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-lg">{String(st.title ?? '')}</h3>
                <p className="mt-1 text-slate-600 text-sm">{String(st.description ?? '')}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
