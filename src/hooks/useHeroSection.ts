import { useEffect, useState } from 'react'
import { fetchPageSections } from '../api/pageSections'
import { resolveImageUrl } from '../lib/resolveImageUrl'
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
        const raw = hero.data as HeroSectionData
        const image = raw.image ? resolveImageUrl(raw.image) : undefined
        setHeroData({ ...raw, image: image || undefined })
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [pageKey, defaultData])

  return heroData
}
