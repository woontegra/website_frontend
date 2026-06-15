import type { AccountBadgeTone } from '../../lib/customerAccountLabels'
import { accountBadgeToneClasses } from '../../lib/customerAccountLabels'

type Props = {
  label: string
  tone: AccountBadgeTone
  className?: string
}

export function CustomerAccountBadge({ label, tone, className = '' }: Props) {
  return (
    <span
      className={`inline-flex max-w-full items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold leading-tight ${accountBadgeToneClasses[tone]} ${className}`}
    >
      {label}
    </span>
  )
}
