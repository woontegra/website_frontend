import { useEffect, useState } from 'react'
import { fetchPageContentBundle } from '../api/pageContentBundle'
import {
  defaultFreeToolCardsBundle,
  FREE_TOOL_CARDS_KEY,
  getActiveFreeToolCards,
  mergeFreeToolCards,
  type FreeToolCardConfig,
} from '../data/freeToolCardsContent'

export function useFreeToolCards() {
  const [cards, setCards] = useState<FreeToolCardConfig[]>(getActiveFreeToolCards(defaultFreeToolCardsBundle))
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    void fetchPageContentBundle(FREE_TOOL_CARDS_KEY, defaultFreeToolCardsBundle, mergeFreeToolCards).then((data) => {
      if (!cancelled) {
        setCards(getActiveFreeToolCards(data))
        setLoaded(true)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  return { cards, loaded }
}
