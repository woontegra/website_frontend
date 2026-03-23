import { useState } from 'react'
import { Link } from 'react-router-dom'

type Props = {
  name: string
  description: string
  href: string
  logo: string
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export function SubBrandShowcaseCard({ name, description, href, logo }: Props) {
  const [imgOk, setImgOk] = useState(true)
  const external = /^https?:\/\//i.test(href)
  const showFallback = !imgOk

  const className =
    'group relative block h-full rounded-3xl border border-white/70 bg-white/75 p-7 shadow-md shadow-slate-900/[0.04] backdrop-blur-sm outline-none ' +
    'transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/10 hover:ring-2 hover:ring-blue-500/15 ' +
    'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 md:p-8'

  const inner = (
    <>
      <div className="mb-6 flex h-32 w-full items-center justify-center rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/90 px-8 transition-colors group-hover:from-blue-50/90 group-hover:to-indigo-50/50 md:h-36">
        {showFallback ? (
          <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-600 text-xl font-bold text-white shadow-inner">
            {initials(name)}
          </span>
        ) : (
          <img
            src={logo}
            alt=""
            className="max-h-24 w-auto max-w-[220px] object-contain object-center md:max-h-32"
            onError={() => setImgOk(false)}
            loading="lazy"
            decoding="async"
          />
        )}
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-blue-950 md:text-xl">
        {name}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-3 md:text-base">{description}</p>
      <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 group-hover:text-blue-700 md:text-base">
        Siteye Git
        <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </span>
    </>
  )

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    )
  }
  return (
    <Link to={href} className={className}>
      {inner}
    </Link>
  )
}
