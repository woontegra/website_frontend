import { ensureGtag, gaDebug } from './gtag'
import { applyGoogleConsentMode } from './consentMode'
import { getCookieConsent } from './cookieConsent'
import { canLoadAnalytics, fetchTrackingSettings } from './trackingSettings'

const SCRIPT_ID = 'woontegra-gtag-js'

let initializedMeasurementId: string | null = null
let scriptLoadPromise: Promise<void> | null = null
let scriptLoadedForId: string | null = null

declare global {
  interface Window {
    __woontegraGaMeasurementId?: string
    __woontegraSendGaManualTestEvent?: () => boolean
    __woontegraEnableGaDebug?: () => void
  }
}

export function isGaDebugEnabled(): boolean {
  if (import.meta.env.DEV) return true
  try {
    if (localStorage.getItem('woontegra_ga_debug') === '1') return true
    if (new URLSearchParams(window.location.search).has('ga_debug')) return true
  } catch {
    /* ignore */
  }
  return false
}

/**
 * GA Measurement ID çözümleme önceliği:
 * 1. GET /api/settings/tracking → googleAnalyticsId (admin panel)
 * 2. VITE_GA_MEASUREMENT_ID (yalnızca API boşsa)
 */
const GA_MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]{10}$/i

export function warnIfGaMeasurementIdLooksInvalid(measurementId: string): void {
  const id = measurementId.trim()
  if (!id || GA_MEASUREMENT_ID_PATTERN.test(id)) return
  console.warn(
    `[Woontegra GA] Measurement ID formatı standart GA4 formatına uymuyor (G- + 10 karakter beklenir): ${id}`,
  )
}

export async function resolveGoogleAnalyticsMeasurementId(): Promise<string> {
  try {
    const settings = await fetchTrackingSettings()
    if (settings.googleAnalyticsId) {
      warnIfGaMeasurementIdLooksInvalid(settings.googleAnalyticsId)
      return settings.googleAnalyticsId
    }
  } catch {
    /* API yoksa env */
  }

  const envGa = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim()
  if (envGa) warnIfGaMeasurementIdLooksInvalid(envGa)
  return envGa || ''
}

function loadGtagScript(measurementId: string): Promise<void> {
  if (scriptLoadPromise && scriptLoadedForId === measurementId) {
    return scriptLoadPromise
  }

  scriptLoadedForId = measurementId
  scriptLoadPromise = new Promise((resolve, reject) => {
    const src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null

    const markLoaded = () => {
      script?.setAttribute('data-loaded', 'true')
      gaDebug('GA script loaded', measurementId)
      resolve()
    }

    if (script) {
      if (script.getAttribute('data-loaded') === 'true' && script.src === src) {
        gaDebug('GA script already loaded', measurementId)
        resolve()
        return
      }
      if (script.src !== src) {
        script.removeAttribute('data-loaded')
        script.src = src
      }
      script.addEventListener('load', markLoaded, { once: true })
      script.addEventListener('error', () => reject(new Error('gtag.js yüklenemedi')), { once: true })
      return
    }

    script = document.createElement('script')
    script.id = SCRIPT_ID
    script.async = true
    script.src = src
    script.onload = markLoaded
    script.onerror = () => reject(new Error('gtag.js yüklenemedi'))
    document.head.appendChild(script)
  })

  return scriptLoadPromise
}

function sendConfig(measurementId: string): void {
  const configParams: Record<string, unknown> = {
    send_page_view: true,
    page_title: document.title,
    page_location: window.location.href,
  }
  if (isGaDebugEnabled()) {
    configParams.debug_mode = true
  }
  window.gtag?.('config', measurementId, configParams)
  gaDebug('GA config sent', { measurementId, ...configParams })
}

export function sendGaManualTestEvent(): boolean {
  if (!canLoadAnalytics() || !initializedMeasurementId || !window.gtag) {
    console.warn('[Woontegra GA] Analytics consent gerekli veya GA henüz başlatılmadı.')
    return false
  }

  window.gtag('event', 'manual_test_event', {
    debug_mode: true,
    event_category: 'debug',
    event_label: 'manual_console_test',
  })
  gaDebug('GA manual_test_event sent', initializedMeasurementId)
  return true
}

export function enableGaDebugMode(): void {
  try {
    localStorage.setItem('woontegra_ga_debug', '1')
    console.info('[Woontegra GA] Debug modu etkin. Sayfayı yenileyin, ardından __woontegraSendGaManualTestEvent() çalıştırın.')
  } catch {
    console.warn('[Woontegra GA] Debug modu kaydedilemedi.')
  }
}

function exposeGaDebugHelpers(measurementId: string): void {
  window.__woontegraGaMeasurementId = measurementId
  window.__woontegraSendGaManualTestEvent = sendGaManualTestEvent
  window.__woontegraEnableGaDebug = enableGaDebugMode
}

export async function initGoogleAnalytics(measurementId: string): Promise<boolean> {
  const id = measurementId.trim()
  if (!id || !canLoadAnalytics()) return false

  ensureGtag()
  applyGoogleConsentMode(getCookieConsent())

  try {
    await loadGtagScript(id)
  } catch (error) {
    gaDebug('GA script load failed', error)
    return false
  }

  window.gtag?.('js', new Date())
  sendConfig(id)

  initializedMeasurementId = id
  exposeGaDebugHelpers(id)
  return true
}

export function trackGoogleAnalyticsPageView(path?: string): void {
  if (!canLoadAnalytics() || !initializedMeasurementId || !window.gtag) return

  const page_path = path ?? `${window.location.pathname}${window.location.search}`
  const params: Record<string, unknown> = {
    page_title: document.title,
    page_location: window.location.href,
    page_path,
  }
  if (isGaDebugEnabled()) {
    params.debug_mode = true
  }

  window.gtag('event', 'page_view', params)
  gaDebug('GA page_view sent', params)
}

export function isGoogleAnalyticsInitialized(): boolean {
  return initializedMeasurementId !== null
}

export function getGoogleAnalyticsMeasurementId(): string | null {
  return initializedMeasurementId
}
