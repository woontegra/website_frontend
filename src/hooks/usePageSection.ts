import { useEffect, useState } from 'react'
import { fetchPageSections } from '../api/pageSections'
import type { PageData, SectionData, SectionType } from '../types/sections'

export function usePageSection<T extends SectionData>(
  pageKey: string,
  sectionType: SectionType,
  defaultData: PageData,
): { data: T | null; loaded: boolean } {
  const [data, setData] = useState<T | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const fromApi = await fetchPageSections(pageKey)
      const page = fromApi ?? defaultData
      const section = page.sections.find((s) => s.type === sectionType)

      if (!cancelled) {
        setData(section ? (section.data as T) : null)
        setLoaded(true)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [pageKey, sectionType, defaultData])

  return { data, loaded }
}
