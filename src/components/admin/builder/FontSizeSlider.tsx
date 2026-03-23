type Props = {
  value: string
  onChange: (v: string) => void
  label?: string
  min?: number
  max?: number
  step?: number
  unit?: string
  className?: string
}

const parseNum = (s: string, fallback: number) => {
  const n = parseInt(s.replace(/\D/g, ''), 10)
  return isNaN(n) ? fallback : n
}

export function FontSizeSlider({
  value,
  onChange,
  label,
  min = 12,
  max = 72,
  step = 2,
  unit = 'px',
  className = '',
}: Props) {
  const num = parseNum(value, 18)
  const clamped = Math.min(max, Math.max(min, num))
  return (
    <div className={className}>
      {label ? (
        <div className="mb-1 flex items-center justify-between">
          <label className="text-xs font-medium text-slate-600">{label}</label>
          <span className="text-xs text-slate-500">{clamped}{unit}</span>
        </div>
      ) : null}
      <div className="flex gap-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={clamped}
          onChange={(e) => onChange(e.target.value + unit)}
          className="flex-1"
        />
        <input
          type="text"
          className="w-14 rounded border border-slate-200 px-1.5 py-1 text-xs"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  )
}
