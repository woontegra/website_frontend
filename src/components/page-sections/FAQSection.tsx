import { SURFACE_WHITE } from '../../lib/sectionSurfaces'

export default function FAQSection(p: Record<string, unknown> & { surfaceBg?: string }) {
  const title = String(p.title ?? '')
  const items = Array.isArray(p.items) ? (p.items as Record<string, unknown>[]) : []
  const bg = p.surfaceBg ?? SURFACE_WHITE
  return (
    <section className={`py-20 md:py-24 ${bg}`} data-section="faq">
      <div className="container mx-auto px-4 max-w-[800px]">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">{title}</h2>
        <div className="space-y-4">
          {items.map((it, i) => (
            <details
              key={i}
              className="group rounded-2xl border border-gray-200 bg-slate-50/50 open:bg-white open:shadow-sm"
            >
              <summary className="cursor-pointer list-none px-6 py-4 font-semibold text-slate-900 flex justify-between items-center">
                {String(it.question ?? '')}
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-4 text-slate-600 text-sm leading-relaxed">{String(it.answer ?? '')}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
