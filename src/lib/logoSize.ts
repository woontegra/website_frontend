export const LOGO_HEIGHT_MIN = 28
export const LOGO_HEIGHT_MAX = 96

export const DEFAULT_NAVBAR_LOGO_HEIGHT = 48
export const DEFAULT_FOOTER_LOGO_HEIGHT = 40
export const DEFAULT_MOBILE_LOGO_HEIGHT = 44

export function clampLogoHeight(value: unknown, fallback: number): number {
  const parsed =
    typeof value === 'number' ? value : Number.parseInt(String(value ?? '').trim(), 10)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(LOGO_HEIGHT_MAX, Math.max(LOGO_HEIGHT_MIN, parsed))
}
