import { Link } from 'react-router-dom'
import { Card } from './Card'

interface SolutionCardProps {
  name: string
  description: string
  href: string
}

function ArrowRightIcon() {
  return (
    <svg className="w-4 h-4 ml-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  )
}

export function SolutionCard({ name, description, href }: SolutionCardProps) {
  return (
    <Link to={href} className="group block h-full">
      <div className="h-full rounded-2xl p-[1px] bg-gradient-to-br from-accent-blue/10 via-transparent to-accent-green/10 group-hover:from-accent-blue/20 group-hover:to-accent-green/20 transition-all duration-250">
        <Card className="p-6 md:p-8 h-full border-0 shadow-sm group-hover:shadow-md group-hover:-translate-y-0.5 transition-all duration-250">
          <h3 className="text-xl font-semibold text-slate-900">{name}</h3>
          <p className="mt-3 text-slate-600 leading-relaxed">{description}</p>
          <span className="mt-4 inline-flex items-center text-sm font-medium text-accent-blue">
            İncele
            <ArrowRightIcon />
          </span>
        </Card>
      </div>
    </Link>
  )
}
