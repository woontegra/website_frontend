import { resolveMediaSrc } from '../../api/cms'

type Variant = 'light' | 'dark'

const cardBase = 'rounded-3xl border p-5 shadow-xl sm:p-6'

/**
 * Hero sağ kolon — SaaS / dashboard mockup (dış sarmalayıcı shadow + rotate HeroSection’da)
 */
export function HeroFloatingCards({
  imageUrl = '',
  imageHeight,
  variant = 'dark',
}: {
  imageUrl?: string
  imageHeight?: string
  variant?: Variant
}) {
  const src = imageUrl ? resolveMediaSrc(imageUrl) : ''
  const style = imageHeight ? { height: imageHeight, minHeight: imageHeight } : undefined
  const isDark = variant === 'dark'

  const glass = isDark
    ? 'border-white/10 bg-white/[0.06] ring-1 ring-white/10 backdrop-blur-md'
    : 'border-slate-200/80 bg-white shadow-lg'

  return (
    <div
      className="relative mx-auto min-h-[360px] w-full max-w-lg lg:ml-auto lg:mr-0"
      style={style}
    >
      {isDark ? (
        <div
          className="pointer-events-none absolute -inset-4 rounded-3xl bg-violet-500/15 blur-2xl"
          aria-hidden
        />
      ) : null}

      {src ? (
        <img
          src={src}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full rounded-3xl object-cover opacity-[0.1]"
          aria-hidden
        />
      ) : null}

      <div
        className={`absolute right-2 top-0 z-[1] w-[88%] max-w-[300px] ${cardBase} ${glass}`}
        style={{ transform: 'rotate(2deg)', transformOrigin: 'center' }}
      >
        <div className="mb-4 flex items-center justify-between">
          <span
            className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-500'}`}
          >
            Performans
          </span>
          <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300 ring-1 ring-emerald-400/30">
            +24%
          </span>
        </div>
        <div className="flex h-28 items-end justify-between gap-1.5 px-1">
          {[40, 65, 45, 85, 55, 92, 70].map((h, i) => (
            <div
              key={i}
              className="min-h-[20%] flex-1 rounded-t-md bg-gradient-to-t from-indigo-400 via-blue-400 to-cyan-300/90"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className={`mt-3 flex justify-between text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
      </div>

      <div
        className={`absolute left-0 top-[38%] z-[2] w-[82%] max-w-[280px] ${cardBase} ${glass}`}
        style={{ transform: 'rotate(-1.5deg)', transformOrigin: 'center' }}
      >
        <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Aktif projeler</p>
        <p className="mt-1 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
          127
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div
            className={`rounded-2xl border p-3 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-100 bg-slate-50'}`}
          >
            <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Uptime</p>
            <p className="text-lg font-bold text-cyan-400">99.9%</p>
          </div>
          <div
            className={`rounded-2xl border p-3 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-100 bg-slate-50'}`}
          >
            <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Müşteri</p>
            <p className="text-lg font-bold text-emerald-400">80+</p>
          </div>
        </div>
      </div>

      <div
        className={`absolute bottom-2 right-0 z-[3] w-[90%] max-w-[320px] ${cardBase} ${glass}`}
        style={{ transform: 'rotate(1deg)', transformOrigin: 'center' }}
      >
        <div
          className={`mb-3 flex items-center gap-2 border-b pb-2 ${isDark ? 'border-white/10' : 'border-slate-100'}`}
        >
          <div className="flex gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/90" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
          </div>
          <span className={`truncate text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Woontegra Panel
          </span>
        </div>
        <div className="space-y-2">
          {['Dağıtım pipeline', 'API sağlığı', 'Yedekleme'].map((row, i) => (
            <div
              key={row}
              className={`flex items-center justify-between rounded-xl border px-2.5 py-2 text-xs ${
                isDark ? 'border-white/10 bg-white/[0.04]' : 'border-slate-100/60 bg-slate-50/80'
              }`}
            >
              <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{row}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  i === 0 ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/30' : 'bg-blue-500/20 text-blue-200 ring-1 ring-blue-400/25'
                }`}
              >
                {i === 0 ? 'Canlı' : 'OK'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
