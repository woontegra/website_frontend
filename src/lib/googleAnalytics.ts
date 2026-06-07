import { ensureGtag, gaDebug } from './gtag'
import { canLoadAnalytics } from './trackingSettings'

const SCRIPT_ID = 'woontegra-gtag-js'

let initializedMeasurementId: string | null = null
let scriptLoadPromise: Promise<void> | null = null
let scriptLoadedForId: string | null = null

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

function grantDefaultConsent(): void {
  // Çerez banner yok — consent tamamlanana kadar analytics veri gönderebilsin
  window.gtag?.('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
  })
}

function sendConfig(measurementId: string): void {
  const configParams = {
    send_page_view: true,
    page_title: document.title,
    page_location: window.location.href,
  }
  window.gtag?.('config', measurementId, configParams)
  gaDebug('GA config sent', { measurementId, ...configParams })
}

export async function initGoogleAnalytics(measurementId: string): Promise<boolean> {
  const id = measurementId.trim()
  if (!id || !canLoadAnalytics()) return false

  ensureGtag()

  try {
    await loadGtagScript(id)
  } catch (error) {
    gaDebug('GA script load failed', error)
    return false
  }

  grantDefaultConsent()
  window.gtag?.('js', new Date())
  sendConfig(id)

  initializedMeasurementId = id
  return true
}

export function trackGoogleAnalyticsPageView(path?: string): void {
  if (!initializedMeasurementId || !window.gtag) return

  const page_path = path ?? `${window.location.pathname}${window.location.search}`
  const params = {
    page_title: document.title,
    page_location: window.location.href,
    page_path,
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
