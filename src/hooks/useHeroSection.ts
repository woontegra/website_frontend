import { useEffect, useState } from 'react'
import { fetchPageSections } from '../api/pageSections'
import { extractHeroImage } from '../lib/heroImage'
import type { HeroSectionData, PageData } from '../types/sections'

export function useHeroSection(pageKey: string, defaultData: PageData) {
  const [heroData, setHeroData] = useState<HeroSectionData | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const fromApi = await fetchPageSections(pageKey)
      const page = fromApi ?? defaultData
      const hero = page.sections.find((section) => section.type === 'hero')

      if (!cancelled) {
        if (hero) {
          const raw = hero.data as HeroSectionData
          const image = extractHeroImage(raw)
          setHeroData({ ...raw, image })
        } else {
          setHeroData(null)
        }
        setLoaded(true)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [pageKey, defaultData])

  return { heroData, loaded }
}
