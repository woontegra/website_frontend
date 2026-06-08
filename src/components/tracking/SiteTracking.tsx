import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { initGoogleAds } from '../../lib/googleAds'
import {
  initGoogleAnalytics,
  resolveGoogleAnalyticsMeasurementId,
  trackGoogleAnalyticsPageView,
} from '../../lib/googleAnalytics'
import { initGoogleTagManager } from '../../lib/googleTagManager'
import { initMetaPixel, resolveMetaPixelId, trackMetaPageView } from '../../lib/metaPixel'
import { initTikTokPixel, trackTikTokPageView } from '../../lib/tiktokPixel'
import { reportMissingMetaPixelEnv } from '../../config/tracking'
import { getCookieConsent, onConsentChange } from '../../lib/cookieConsent'
import { ensureGtag } from '../../lib/gtag'
import { applyGoogleConsentMode, initDeniedConsentDefaults } from '../../lib/consentMode'
import { fetchTrackingSettings } from '../../lib/trackingSettings'

async function bootTracking(path: string): Promise<void> {
  reportMissingMetaPixelEnv()

  const consent = getCookieConsent()
  if (!consent) {
    initDeniedConsentDefaults()
  } else {
    ensureGtag()
  }
  applyGoogleConsentMode(consent)

  const settings = await fetchTrackingSettings()

  if (consent?.marketing) {
    const pixelId = await resolveMetaPixelId()
    if (pixelId) initMetaPixel(pixelId)

    if (settings.tiktokPixelEnabled !== false && settings.tiktokPixelId) {
      initTikTokPixel(settings.tiktokPixelId)
    }
  }

  if (consent?.analytics) {
    const measurementId = await resolveGoogleAnalyticsMeasurementId()
    if (measurementId) {
      await initGoogleAnalytics(measurementId)
    }

    if (settings.googleTagManagerId) {
      initGoogleTagManager(settings.googleTagManagerId)
    }

    if (settings.googleAdsConversionId) {
      initGoogleAds(settings.googleAdsConversionId, settings.googleAdsConversionLabel)
    }
  }

  trackPageViews(path)
}

function trackPageViews(path: string): void {
  trackMetaPageView()
  trackGoogleAnalyticsPageView(path)
  trackTikTokPageView()
}

/**
 * Woontegra kurumsal site — tracking yalnızca çerez onayı sonrası yüklenir.
 */
export function SiteTracking() {
  const location = useLocation()
  const ready = useRef(false)
  const lastTrackedPath = useRef('')

  useEffect(() => {
    let cancelled = false

    async function start() {
      const path = `${location.pathname}${location.search}`
      await bootTracking(path)
      if (cancelled) return
      ready.current = true
      lastTrackedPath.current = path
    }

    void start()

    const unsubscribe = onConsentChange(() => {
      if (cancelled) return
      ready.current = false
      void bootTracking(`${location.pathname}${location.search}`).then(() => {
        if (!cancelled) ready.current = true
      })
    })

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!ready.current) return

    const path = `${location.pathname}${location.search}`
    if (path === lastTrackedPath.current) return

    lastTrackedPath.current = path
    trackPageViews(path)
  }, [location.pathname, location.search])

  return null
}
