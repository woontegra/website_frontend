import { ensureGtag } from './gtag'
import { canLoadAnalytics } from './trackingSettings'

let initializedConversionId: string | null = null

/** Google Ads — yalnızca conversion ID doluysa gtag config ekler (GA ile aynı dataLayer). */
export function initGoogleAds(conversionId: string, _conversionLabel?: string): boolean {
  const id = conversionId.trim()
  if (!id || !canLoadAnalytics()) return false
  if (initializedConversionId === id) return false

  ensureGtag()
  window.gtag?.('config', id)
  initializedConversionId = id
  return true
}
