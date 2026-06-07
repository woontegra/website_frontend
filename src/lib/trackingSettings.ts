import { getApiBase } from '../config/api'

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

/** İleride çerez onayı buraya bağlanacak; şimdilik mevcut davranış: doğrudan yükle. */
export function canLoadAnalytics(): boolean {
  return true
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
