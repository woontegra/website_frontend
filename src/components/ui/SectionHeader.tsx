interface SectionHeaderProps {
  title: string
  subtitle?: string
  centered?: boolean
  className?: string
}

export function SectionHeader({ title, subtitle, centered = true, className = '' }: SectionHeaderProps) {
  return (
    <div className={`mb-10 md:mb-11 ${centered ? 'text-center' : ''} ${className}`}>
      <h2 className="text-xl font-semibold tracking-[0.02em] text-slate-900 md:text-2xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-slate-600 md:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  )
}
