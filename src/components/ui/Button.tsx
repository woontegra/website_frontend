import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'green' | 'hero'
type Size = 'sm' | 'md' | 'lg' | 'xl'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  href?: string
  to?: string
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-accent-blue to-accent-blue-light text-white shadow-soft hover:opacity-95 focus:ring-2 focus:ring-accent-blue/30 focus:ring-offset-2',
  secondary: 'bg-slate-100 text-slate-900 border border-gray-200 hover:bg-slate-200 hover:border-gray-300',
  ghost: 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
  outline: 'border-2 border-current bg-transparent hover:bg-current/10',
  green: 'bg-green-500 text-white shadow-lg shadow-green-500/30 hover:bg-green-600 focus:ring-2 focus:ring-green-500/30 focus:ring-offset-2',
  hero:
    'bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 text-white min-h-[52px] shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 hover:shadow-emerald-500/20 hover:scale-[1.02] transition-all duration-300 focus:ring-2 focus:ring-blue-400/40 focus:ring-offset-2',
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm rounded-xl h-9',
  md: 'px-6 py-3 text-base rounded-xl h-11',
  lg: 'px-8 py-4 text-lg rounded-xl h-12',
  xl: 'px-8 py-4 text-lg rounded-xl h-12 min-h-[48px]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, href, to, ...props }, ref) => {
    const classes = `inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`

    if (to) {
      return <Link to={to} className={classes}>{children}</Link>
    }
    if (href) {
      return <a href={href} className={classes} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>{children}</a>
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
