export const LOGO_HEIGHT_MIN = 24
export const LOGO_HEIGHT_MAX = 90

export const DEFAULT_NAVBAR_LOGO_HEIGHT = 42
export const DEFAULT_FOOTER_LOGO_HEIGHT = 28
export const DEFAULT_MOBILE_LOGO_HEIGHT = 34

export function clampLogoHeight(value: unknown, fallback: number): number {
  const parsed =
    typeof value === 'number' ? value : Number.parseInt(String(value ?? '').trim(), 10)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(LOGO_HEIGHT_MAX, Math.max(LOGO_HEIGHT_MIN, parsed))
}
