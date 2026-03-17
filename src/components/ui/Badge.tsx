interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'blue' | 'green' | 'gray'
  className?: string
}

const variants = {
  default: 'bg-surface-100 text-surface-700',
  blue: 'bg-accent-blue-soft text-accent-blue',
  green: 'bg-accent-green-soft text-accent-green',
  gray: 'bg-surface-200 text-surface-600',
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
