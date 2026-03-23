/** Sayfa bölümleri — net kontrast, premium teknoloji hissi */

export const SURFACE_WHITE = 'bg-white'
export const SURFACE_MUTED = 'bg-slate-50'
export const SURFACE_SOFT_A = 'bg-gradient-to-b from-slate-50 via-white to-slate-100/90'
export const SURFACE_SOFT_B = 'bg-gradient-to-br from-indigo-50/70 via-white to-violet-50/50'
export const SURFACE_SOFT_C = 'bg-gradient-to-b from-slate-100/80 via-slate-50 to-white'

/** Koyu bant — istatistik / vurgu */
export const SURFACE_DARK = 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white'

/** Ana sayfa kökü — tek düz beyaz değil, hafif derinlik */
export const SURFACE_PAGE_ROOT = 'bg-slate-100'

const CYCLE = [
  SURFACE_WHITE,
  SURFACE_MUTED,
  SURFACE_SOFT_A,
  SURFACE_SOFT_B,
  SURFACE_MUTED,
  SURFACE_SOFT_C,
] as const

export function surfaceByStackIndex(i: number): string {
  return CYCLE[((i % CYCLE.length) + CYCLE.length) % CYCLE.length]
}

/** CTA — koyu gradient + glow için taban */
export const CTA_GRADIENT_SECTION =
  'relative overflow-hidden bg-gradient-to-br from-[#060a14] via-[#0f172a] to-[#1e1b4b] text-white shadow-[0_-20px_80px_-20px_rgba(59,130,246,0.35)]'

export const CTA_GRADIENT_OVERLAY =
  'pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(99,102,241,0.45),transparent_55%),radial-gradient(ellipse_60%_50%_at_100%_50%,rgba(59,130,246,0.2),transparent_50%),radial-gradient(ellipse_50%_40%_at_0%_80%,rgba(16,185,129,0.15),transparent_50%)]'

export const CTA_GLOW_BOTTOM =
  'pointer-events-none absolute bottom-0 left-1/2 h-40 w-[120%] -translate-x-1/2 translate-y-1/2 rounded-full bg-indigo-500/20 blur-[80px]'
