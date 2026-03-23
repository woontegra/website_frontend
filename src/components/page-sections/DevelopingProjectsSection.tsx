import { useState } from 'react'
import { Link } from 'react-router-dom'
import { resolveMediaSrc } from '../../api/cms'

type ProjectItem = {
  title: string
  description: string
  imageUrl: string
  href?: string
  statusLabel?: string
}

function parseItems(raw: unknown): ProjectItem[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((row) => {
      const r = row as Record<string, unknown>
      return {
        title: String(r.title ?? ''),
        description: String(r.description ?? ''),
        imageUrl: String(r.imageUrl ?? ''),
        href: r.href != null && String(r.href) ? String(r.href) : undefined,
        statusLabel: r.statusLabel != null ? String(r.statusLabel) : undefined,
      }
    })
    .filter((x) => x.title)
}

function ProjectCard({ item }: { item: ProjectItem }) {
  const [imgOk, setImgOk] = useState(!!item.imageUrl)
  const status = item.statusLabel || 'Geliştiriliyor'
  const hasLink = item.href && item.href !== '#'

  const inner = (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/50 bg-slate-50/95 shadow-md shadow-slate-900/[0.04] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-200/60 hover:shadow-lg hover:shadow-violet-900/5">
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">
        {item.imageUrl && imgOk ? (
          <img
            src={resolveMediaSrc(item.imageUrl)}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            onError={() => setImgOk(false)}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-600/20 via-indigo-700/15 to-slate-800/80 text-slate-500"
            aria-hidden
          >
            <svg className="h-14 w-14 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.25}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        <div className="absolute left-3 top-3">
          <span className="inline-flex rounded-full bg-violet-700/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
            {status}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{item.description}</p>
        {hasLink ? (
          <span className="mt-4 text-sm font-semibold text-violet-700 group-hover:text-violet-800">Detay →</span>
        ) : null}
      </div>
    </article>
  )

  if (hasLink && item.href!.startsWith('http')) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className="block h-full">
        {inner}
      </a>
    )
  }
  if (hasLink && item.href!.startsWith('/')) {
    return (
      <Link to={item.href!} className="block h-full">
        {inner}
      </Link>
    )
  }
  return inner
}

export default function DevelopingProjectsSection(p: Record<string, unknown> & { surfaceBg?: string }) {
  const title = String(p.title ?? 'Gelişmekte Olan Projeler')
  const subtitle = String(
    p.subtitle ?? 'Ar-Ge ve ürünleştirme aşamasındaki çalışmalarımızı buradan takip edebilirsiniz. Görselleri ve metinleri panelden güncelleyebilirsiniz.'
  )
  const items = parseItems(p.items)
  const bg = String(p.surfaceBg ?? '')

  return (
    <section className={`relative py-20 md:py-28 ${bg}`} aria-labelledby="developing-projects-heading">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-violet-50/40 via-amber-50/25 to-slate-50/40"
        aria-hidden
      />
      <div className="relative z-[1] container mx-auto max-w-[1280px] px-4">
        <header className="mx-auto mb-12 max-w-2xl text-center md:mb-14">
          <h2 id="developing-projects-heading" className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            {title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">{subtitle}</p>
        </header>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <ProjectCard key={`${item.title}-${i}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
