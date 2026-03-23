type Props = {
  value: string
  onChange: (v: string) => void
  label?: string
  className?: string
}

export function ColorPicker({ value, onChange, label, className = '' }: Props) {
  const hex = /^#[0-9A-Fa-f]{6}$/.test(value) ? value : '#ffffff'
  return (
    <div className={className}>
      {label ? <label className="mb-1 block text-xs font-medium text-slate-600">{label}</label> : null}
      <div className="flex gap-2">
        <input
          type="color"
          className="h-9 w-12 cursor-pointer rounded-lg border border-slate-200"
          value={hex}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          type="text"
          className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-mono"
          placeholder="#hex"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  )
}
