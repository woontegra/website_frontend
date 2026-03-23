interface StatCardProps {
  value: string
  label: string
  /** Koyu arka plan üzerinde */
  variant?: 'light' | 'dark'
}

export function StatCard({ value, label, variant = 'light' }: StatCardProps) {
  const isDark = variant === 'dark'
  return (
    <div className="text-center">
      <div
        className={`text-3xl font-bold tracking-tight md:text-4xl ${
          isDark
            ? 'bg-gradient-to-r from-white via-cyan-100 to-indigo-200 bg-clip-text text-transparent'
            : 'bg-gradient-brand bg-clip-text text-transparent'
        }`}
      >
        {value}
      </div>
      <p className={`mt-3 text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{label}</p>
    </div>
  )
}
