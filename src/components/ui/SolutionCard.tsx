import { Link } from 'react-router-dom'
import { Card } from './Card'
import { resolveMediaSrc } from '../../api/cms'

interface SolutionCardProps {
  name: string
  description: string
  href: string
  /** Kapak görseli */
  imageUrl?: string | null
  /** Marka logosu (üst metin üzerinde) */
  logoUrl?: string | null
}

function ArrowRightIcon() {
  return (
    <svg className="ml-1 h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  )
}

export function SolutionCard({ name, description, href, imageUrl, logoUrl }: SolutionCardProps) {
  const cover = imageUrl ? resolveMediaSrc(imageUrl) : ''
  const logo = logoUrl ? resolveMediaSrc(logoUrl) : ''

  return (
    <Link to={href} className="group block h-full">
      <div className="h-full overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/10">
        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-blue-700">
          {cover ? (
            <img src={cover} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
          {logo ? (
            <div className="absolute left-5 top-5 rounded-xl bg-white/95 p-2 shadow-lg ring-1 ring-black/5">
              <img src={logo} alt="" className="h-8 w-auto max-w-[140px] object-contain" />
            </div>
          ) : null}
        </div>
        <Card className="border-0 p-8 shadow-none" hover={false}>
          <h3 className="text-xl font-bold tracking-tight text-slate-900">{name}</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{description}</p>
          <span className="mt-5 inline-flex items-center text-sm font-semibold text-indigo-600 transition-colors group-hover:text-indigo-500">
            İncele
            <ArrowRightIcon />
          </span>
        </Card>
      </div>
    </Link>
  )
}
