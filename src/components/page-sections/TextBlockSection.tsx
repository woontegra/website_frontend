import { SURFACE_WHITE } from '../../lib/sectionSurfaces'

export default function TextBlockSection(p: Record<string, unknown> & { surfaceBg?: string }) {
  const heading = String(p.heading ?? '')
  const body = String(p.body ?? '')
  const bg = p.surfaceBg ?? SURFACE_WHITE
  return (
    <section className={`py-16 md:py-20 ${bg}`} data-section="text">
      <div className="container mx-auto px-4 max-w-[800px] prose prose-slate">
        {heading ? <h2 className="text-2xl font-bold text-slate-900 mb-6">{heading}</h2> : null}
        <div className="text-slate-600 whitespace-pre-wrap leading-relaxed">{body}</div>
      </div>
    </section>
  )
}
