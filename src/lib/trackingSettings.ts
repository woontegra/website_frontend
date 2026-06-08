import { getApiBase } from '../config/api'
import { getCookieConsent } from './cookieConsent'

export type PublicTrackingSettings = {
  googleAnalyticsId: string
  googleTagManagerId: string
  googleAdsConversionId: string
  googleAdsConversionLabel: string
  metaPixelId: string
  metaBrowserPixelEnabled: boolean
  tiktokPixelId: string
  tiktokPixelEnabled: boolean
}

const EMPTY: PublicTrackingSettings = {
  googleAnalyticsId: '',
  googleTagManagerId: '',
  googleAdsConversionId: '',
  googleAdsConversionLabel: '',
  metaPixelId: '',
  metaBrowserPixelEnabled: true,
  tiktokPixelId: '',
  tiktokPixelEnabled: true,
}

let cached: PublicTrackingSettings | null = null
let inflight: Promise<PublicTrackingSettings> | null = null

export function canLoadAnalytics(): boolean {
  const consent = getCookieConsent()
  return consent?.analytics === true
}

export function canLoadMarketing(): boolean {
  const consent = getCookieConsent()
  return consent?.marketing === true
}

export function canLoadFunctional(): boolean {
  const consent = getCookieConsent()
  return consent?.functional === true
}

export async function fetchTrackingSettings(): Promise<PublicTrackingSettings> {
  if (cached) return cached
  if (inflight) return inflight

  inflight = (async () => {
    try {
      const response = await fetch(`${getApiBase()}/api/settings/tracking`, { cache: 'no-store' })
      if (response.ok) {
        const data = (await response.json()) as Partial<PublicTrackingSettings>
        cached = {
          googleAnalyticsId: String(data.googleAnalyticsId ?? '').trim(),
          googleTagManagerId: String(data.googleTagManagerId ?? '').trim(),
          googleAdsConversionId: String(data.googleAdsConversionId ?? '').trim(),
          googleAdsConversionLabel: String(data.googleAdsConversionLabel ?? '').trim(),
          metaPixelId: String(data.metaPixelId ?? '').trim(),
          metaBrowserPixelEnabled: data.metaBrowserPixelEnabled !== false,
          tiktokPixelId: String(data.tiktokPixelId ?? '').trim(),
          tiktokPixelEnabled: data.tiktokPixelEnabled !== false,
        }
        return cached
      }
    } catch {
      /* API yoksa boş ayarlar */
    }
    cached = { ...EMPTY }
    return cached
  })()

  try {
    return await inflight
  } finally {
    inflight = null
  }
}

export function clearTrackingSettingsCache(): void {
  cached = null
}
