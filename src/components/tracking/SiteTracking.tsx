import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { initGoogleAds } from '../../lib/googleAds'
import { initGoogleAnalytics, trackGoogleAnalyticsPageView } from '../../lib/googleAnalytics'
import { initGoogleTagManager } from '../../lib/googleTagManager'
import { initMetaPixel, trackMetaPageView } from '../../lib/metaPixel'
import { reportMissingMetaPixelEnv, WOONTEGRA_META_PIXEL_FALLBACK } from '../../config/tracking'
import { fetchTrackingSettings } from '../../lib/trackingSettings'

/**
 * Woontegra kurumsal site — panel /api/settings/tracking ayarlarından piksel ve analytics yükler.
 * Çerez banner yok; canLoadAnalytics() ileride consent'e bağlanacak.
 */
export function SiteTracking() {
  const location = useLocation()
  const ready = useRef(false)
  const lastTrackedPath = useRef('')

  useEffect(() => {
    let cancelled = false

    async function boot() {
      reportMissingMetaPixelEnv()
      const settings = await fetchTrackingSettings()
      if (cancelled) return

      const envPixel = import.meta.env.VITE_META_PIXEL_ID?.trim()
      let pixelId = envPixel || ''
      if (!pixelId && settings.metaBrowserPixelEnabled !== false) {
        pixelId = settings.metaPixelId || WOONTEGRA_META_PIXEL_FALLBACK
      }
      if (!pixelId) pixelId = WOONTEGRA_META_PIXEL_FALLBACK
      initMetaPixel(pixelId)

      const envGa = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim()
      const measurementId = envGa || settings.googleAnalyticsId
      if (measurementId) {
        await initGoogleAnalytics(measurementId)
      }

      if (settings.googleTagManagerId) {
        initGoogleTagManager(settings.googleTagManagerId)
      }

      if (settings.googleAdsConversionId) {
        initGoogleAds(settings.googleAdsConversionId, settings.googleAdsConversionLabel)
      }

      ready.current = true
      lastTrackedPath.current = `${location.pathname}${location.search}`
    }

    void boot()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!ready.current) return

    const path = `${location.pathname}${location.search}`
    if (path === lastTrackedPath.current) return

    lastTrackedPath.current = path
    trackMetaPageView()
    trackGoogleAnalyticsPageView(path)
  }, [location.pathname, location.search])

  return null
}
