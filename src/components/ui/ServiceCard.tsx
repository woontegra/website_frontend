import { Link } from 'react-router-dom'
import { Card } from './Card'

interface ServiceCardProps {
  title: string
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

export function ServiceCard({ title, description, href }: ServiceCardProps) {
  return (
    <Link to={href} className="group block h-full">
      <Card className="p-6 md:p-8 h-full group-hover:border-accent-blue/30 transition-colors duration-250">
        <h3 className="text-base font-medium text-slate-800">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
        <span className="mt-4 inline-flex items-center text-sm font-medium text-accent-blue">
          Detaylı bilgi
          <ArrowRightIcon />
        </span>
      </Card>
    </Link>
  )
}
