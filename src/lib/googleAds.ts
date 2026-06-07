import { canLoadAnalytics } from './trackingSettings'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

let initializedConversionId: string | null = null

function ensureGtag(): void {
  window.dataLayer = window.dataLayer || []
  if (!window.gtag) {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args)
    }
  }
}

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
