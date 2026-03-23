import { Link } from 'react-router-dom'
import { SURFACE_WHITE } from '../../lib/sectionSurfaces'
import { ServiceIcon } from '../ui/ServiceIcons'

const COLS_CLS: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}

export default function ServiceGrid(p: Record<string, unknown> & { surfaceBg?: string }) {
  const title = String(p.title ?? '')
  const description = String(p.description ?? '')
  const items = Array.isArray(p.items) ? (p.items as Record<string, unknown>[]) : []
  const bg = p.surfaceBg ?? SURFACE_WHITE
  const columns = typeof p.columns === 'number' ? Math.min(4, Math.max(1, p.columns)) : 3
  const iconSize = String(p.iconSize ?? '2.5rem')
  const gridCls = COLS_CLS[columns] ?? COLS_CLS[3]
  return (
    <section className={`py-20 md:py-24 ${bg}`} data-section="services">
      <div className="container mx-auto px-4 max-w-[1200px]">
        <h2
          className="text-3xl font-bold text-center"
          style={{
            fontSize: 'var(--section-title-font-size)',
            fontWeight: 'var(--section-title-font-weight)',
            color: 'var(--section-title-color, #0f172a)',
          }}
        >
          {title}
        </h2>
        <p
          className="mt-4 text-center max-w-xl mx-auto"
          style={{
            fontSize: 'var(--section-subtitle-font-size)',
            color: 'var(--section-subtitle-color, #475569)',
          }}
        >
          {description}
        </p>
        <div className={`grid gap-6 mt-12 ${gridCls}`}>
          {items.map((it, i) => {
            const href = String(it.href ?? '#')
            const inner = (
              <>
                <div
                  className="flex items-center justify-center rounded-lg bg-[#eff6ff] text-accent-blue mb-3"
                  style={{ width: iconSize, height: iconSize }}
                >
                  <ServiceIcon name={String(it.icon ?? 'code')} />
                </div>
                <h3 className="font-semibold text-slate-900">{String(it.title ?? '')}</h3>
                <p className="mt-2 text-sm text-slate-600">{String(it.description ?? '')}</p>
                <span className="mt-4 inline-flex text-sm font-medium text-accent-blue">Detay →</span>
              </>
            )
            return href.startsWith('/') ? (
              <Link
                key={i}
                to={href}
                className="group block rounded-2xl border border-gray-200 p-6 bg-white hover:shadow-md transition-all"
              >
                {inner}
              </Link>
            ) : (
              <a
                key={i}
                href={href}
                className="group block rounded-2xl border border-gray-200 p-6 bg-white hover:shadow-md transition-all"
              >
                {inner}
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
