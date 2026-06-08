import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Route değişiminde sayfayı en üste kaydırır.
 * Hash (#bolum) varsa tarayıcının anchor davranışına bırakır.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
