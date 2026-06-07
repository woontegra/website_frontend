import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { initMetaPixel, resolveMetaPixelId, trackMetaPageView } from '../../lib/metaPixel'
import { reportMissingMetaPixelEnv } from '../../config/tracking'

/**
 * Woontegra kurumsal site Meta Pixel — çerez izin sistemi yok; doğrudan yüklenir.
 */
export function MetaPixelRouteTracker() {
  const location = useLocation()
  const pixelReady = useRef(false)
  const lastTrackedPath = useRef('')

  useEffect(() => {
    let cancelled = false

    async function boot() {
      reportMissingMetaPixelEnv()
      const pixelId = await resolveMetaPixelId()
      if (cancelled || !pixelId) return
      initMetaPixel(pixelId)
      pixelReady.current = true
      lastTrackedPath.current = `${location.pathname}${location.search}`
    }

    void boot()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!pixelReady.current) return

    const path = `${location.pathname}${location.search}`
    if (path === lastTrackedPath.current) return

    lastTrackedPath.current = path
    trackMetaPageView()
  }, [location.pathname, location.search])

  return null
}
