import { canLoadAnalytics } from './trackingSettings'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

let initializedMeasurementId: string | null = null

function ensureDataLayer(): void {
  window.dataLayer = window.dataLayer || []
  if (!window.gtag) {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args)
    }
  }
}

function loadGtagScript(measurementId: string): void {
  const scriptId = 'woontegra-gtag-js'
  const existing = document.getElementById(scriptId) as HTMLScriptElement | null
  const src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`

  if (existing) {
    if (existing.src !== src) existing.src = src
    return
  }

  const script = document.createElement('script')
  script.id = scriptId
  script.async = true
  script.src = src
  document.head.appendChild(script)
}

export function initGoogleAnalytics(measurementId: string): boolean {
  const id = measurementId.trim()
  if (!id || !canLoadAnalytics()) return false
  if (initializedMeasurementId === id) return false

  ensureDataLayer()
  loadGtagScript(id)
  window.gtag?.('js', new Date())
  window.gtag?.('config', id)
  initializedMeasurementId = id
  return true
}

export function trackGoogleAnalyticsPageView(path: string): void {
  if (!initializedMeasurementId || !window.gtag) return
  window.gtag('config', initializedMeasurementId, { page_path: path })
}

export function isGoogleAnalyticsInitialized(): boolean {
  return initializedMeasurementId !== null
}

export function getGoogleAnalyticsMeasurementId(): string | null {
  return initializedMeasurementId
}
