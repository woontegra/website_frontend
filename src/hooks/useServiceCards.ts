import { useEffect, useState } from 'react'
import { fetchPageContentBundle } from '../api/pageContentBundle'
import {
  defaultServiceCardsBundle,
  getActiveServiceCards,
  mergeServiceCards,
  SERVICE_CARDS_KEY,
  type ServiceCardConfig,
  type ServiceCardsBundle,
} from '../data/serviceCardsContent'

export function useServiceCards() {
  const [bundle, setBundle] = useState<ServiceCardsBundle>(defaultServiceCardsBundle)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    void fetchPageContentBundle(SERVICE_CARDS_KEY, defaultServiceCardsBundle, mergeServiceCards).then((data) => {
      if (!cancelled) {
        setBundle(data)
        setLoaded(true)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  const cards = getActiveServiceCards(bundle)
  return { cards, loaded }
}

export type { ServiceCardConfig }
