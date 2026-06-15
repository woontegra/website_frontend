import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { customersApi } from '../api/customers-api'
import { getCustomerToken, isCustomerToken, isJwtExpired } from '../lib/customerAuth'

type FavoriteRow = { productId: string }

export function useCustomerFavorites() {
  const navigate = useNavigate()
  const location = useLocation()
  const returnPath = `${location.pathname}${location.search}`

  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => new Set())
  const [favoritesLoaded, setFavoritesLoaded] = useState(false)
  const [favoriteBusyId, setFavoriteBusyId] = useState<string | null>(null)

  useEffect(() => {
    const t = getCustomerToken()
    if (!t || isJwtExpired(t) || !isCustomerToken(t)) {
      setFavoritesLoaded(true)
      return
    }
    let cancelled = false
    void customersApi
      .listFavorites()
      .then((rows) => {
        if (cancelled) return
        setFavoriteIds(new Set((rows as FavoriteRow[]).map((r) => r.productId)))
      })
      .catch(() => {
        if (!cancelled) setFavoriteIds(new Set())
      })
      .finally(() => {
        if (!cancelled) setFavoritesLoaded(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const toggleFavorite = useCallback(
    async (productId: string) => {
      const t = getCustomerToken()
      if (!t || isJwtExpired(t) || !isCustomerToken(t)) {
        navigate(`/giris?return=${encodeURIComponent(returnPath)}`)
        return
      }
      setFavoriteBusyId(productId)
      try {
        const isFav = favoriteIds.has(productId)
        if (isFav) {
          await customersApi.removeFavorite(productId)
          setFavoriteIds((prev) => {
            const n = new Set(prev)
            n.delete(productId)
            return n
          })
        } else {
          await customersApi.addFavorite(productId)
          setFavoriteIds((prev) => new Set(prev).add(productId))
        }
      } finally {
        setFavoriteBusyId(null)
      }
    },
    [favoriteIds, navigate, returnPath],
  )

  return { favoriteIds, favoritesLoaded, favoriteBusyId, toggleFavorite }
}
