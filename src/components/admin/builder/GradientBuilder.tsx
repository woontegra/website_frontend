type Props = {
  gradientFrom?: string
  gradientTo?: string
  onFromChange: (v: string) => void
  onToChange: (v: string) => void
  label?: string
  className?: string
}

export function GradientBuilder({
  gradientFrom = '#3b82f6',
  gradientTo = '#10b981',
  onFromChange,
  onToChange,
  label,
  className = '',
}: Props) {
  const from = /^#[0-9A-Fa-f]{6}$/.test(gradientFrom) ? gradientFrom : '#3b82f6'
  const to = /^#[0-9A-Fa-f]{6}$/.test(gradientTo) ? gradientTo : '#10b981'
  return (
    <div className={className}>
      {label ? <label className="mb-1 block text-xs font-medium text-slate-600">{label}</label> : null}
      <div
        className="mb-2 h-8 rounded-lg border border-slate-200"
        style={{
          background: `linear-gradient(to right, ${from}, ${to})`,
        }}
      />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <span className="text-[10px] text-slate-500">Başlangıç</span>
          <div className="flex gap-1">
            <input
              type="color"
              className="h-8 w-10 cursor-pointer rounded border"
              value={from}
              onChange={(e) => onFromChange(e.target.value)}
            />
            <input
              type="text"
              className="min-w-0 flex-1 rounded border border-slate-200 px-1.5 py-1 text-[10px] font-mono"
              value={gradientFrom ?? ''}
              onChange={(e) => onFromChange(e.target.value)}
            />
          </div>
        </div>
        <div>
          <span className="text-[10px] text-slate-500">Bitiş</span>
          <div className="flex gap-1">
            <input
              type="color"
              className="h-8 w-10 cursor-pointer rounded border"
              value={to}
              onChange={(e) => onToChange(e.target.value)}
            />
            <input
              type="text"
              className="min-w-0 flex-1 rounded border border-slate-200 px-1.5 py-1 text-[10px] font-mono"
              value={gradientTo ?? ''}
              onChange={(e) => onToChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
