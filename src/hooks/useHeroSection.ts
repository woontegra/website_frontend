import { useEffect, useState } from 'react'
import { fetchPageSections } from '../api/pageSections'
import type { HeroSectionData, PageData } from '../types/sections'

export function useHeroSection(pageKey: string, defaultData: PageData) {
  const [heroData, setHeroData] = useState<HeroSectionData | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const fromApi = await fetchPageSections(pageKey)
      const page = fromApi ?? defaultData
      const hero = page.sections.find((section) => section.type === 'hero')
      if (!cancelled && hero) {
        setHeroData(hero.data as HeroSectionData)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [pageKey, defaultData])

  return heroData
}
