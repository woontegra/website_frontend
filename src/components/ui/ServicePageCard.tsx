import { Link } from 'react-router-dom'
import { ServiceIcon } from './ServiceIcons'

interface ServicePageCardProps {
  title: string
  description: string
  features: string[]
  href: string
  icon?: string
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 shrink-0 text-accent-green" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  )
}

export function ServicePageCard({ title, description, features, href, icon = 'code' }: ServicePageCardProps) {
  return (
    <Link
      to={href}
      className="group block h-full rounded-2xl border border-[#e5e7eb] bg-white p-6 sm:p-7 shadow-sm transition-all duration-300 hover:-translate-y-6 hover:shadow-xl hover:border-accent-blue/30 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:ring-offset-2"
    >
      {/* Icon */}
      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#eff6ff] text-accent-blue">
        <ServiceIcon name={icon} className="text-accent-blue" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>

      {/* Description */}
      <p className="mt-3 text-[#475569] text-sm leading-relaxed line-clamp-3">{description}</p>

      {/* Feature list */}
      {features.length > 0 && (
        <ul className="mt-5 space-y-2">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
              <CheckIcon />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      )}

      {/* CTA */}
      <span className="mt-6 inline-flex items-center text-sm font-semibold text-accent-blue">
        Detaylı incele
        <ArrowRightIcon />
      </span>
    </Link>
  )
}
