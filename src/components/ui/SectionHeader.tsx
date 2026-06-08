interface SectionHeaderProps {
  title: string
  subtitle?: string
  eyebrow?: string
  centered?: boolean
  dark?: boolean
  className?: string
}

export function SectionHeader({
  title,
  subtitle,
  eyebrow,
  centered = true,
  dark = false,
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={`mb-10 md:mb-12 ${centered ? 'text-center' : ''} ${className}`}>
      {eyebrow && <p className={`section-eyebrow ${centered ? 'mx-auto' : ''}`}>{eyebrow}</p>}
      <h2 className={`section-title mt-3 ${dark ? 'text-white' : ''}`}>{title}</h2>
      {subtitle && (
        <p
          className={`section-description mt-4 ${centered ? 'mx-auto' : ''} ${dark ? 'text-slate-400' : ''}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
