import { type HTMLAttributes, forwardRef } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered'
  hover?: boolean
  children: React.ReactNode
  className?: string
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', hover = true, className = '', children, ...props }, ref) => {
    const base = 'rounded-2xl transition-all duration-250 bg-white border border-gray-200 shadow-sm'
    const variants = {
      default: '',
      elevated: 'shadow-md',
      bordered: 'border-gray-200',
    }
    const hoverClass = hover ? 'hover:shadow-md hover:-translate-y-0.5 hover:border-gray-300' : ''
    return (
      <div
        ref={ref}
        className={`${base} ${variants[variant]} ${hoverClass} ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = 'Card'
