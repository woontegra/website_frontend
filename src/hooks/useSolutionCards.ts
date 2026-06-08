import { useEffect, useState } from 'react'
import { fetchPageContentBundle } from '../api/pageContentBundle'
import {
  defaultSolutionBenefitCardsBundle,
  defaultSolutionCardsBundle,
  getActiveSolutionBenefitCards,
  getActiveSolutionCards,
  mergeSolutionBenefitCards,
  mergeSolutionCards,
  SOLUTION_BENEFIT_CARDS_KEY,
  SOLUTION_CARDS_KEY,
  type SolutionBenefitCardConfig,
  type SolutionCardConfig,
} from '../data/solutionCardsContent'

export function useSolutionCards() {
  const [cards, setCards] = useState<SolutionCardConfig[]>(getActiveSolutionCards(defaultSolutionCardsBundle))
  const [benefits, setBenefits] = useState<SolutionBenefitCardConfig[]>(
    getActiveSolutionBenefitCards(defaultSolutionBenefitCardsBundle),
  )
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    void Promise.all([
      fetchPageContentBundle(SOLUTION_CARDS_KEY, defaultSolutionCardsBundle, mergeSolutionCards),
      fetchPageContentBundle(SOLUTION_BENEFIT_CARDS_KEY, defaultSolutionBenefitCardsBundle, mergeSolutionBenefitCards),
    ]).then(([cardsBundle, benefitsBundle]) => {
      if (!cancelled) {
        setCards(getActiveSolutionCards(cardsBundle))
        setBenefits(getActiveSolutionBenefitCards(benefitsBundle))
        setLoaded(true)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  return { cards, benefits, loaded }
}
