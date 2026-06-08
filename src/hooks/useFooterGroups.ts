import { useEffect, useState } from 'react'
import { fetchPageContentBundle } from '../api/pageContentBundle'
import {
  defaultFooterGroupsBundle,
  FOOTER_GROUPS_KEY,
  getActiveFooterGroups,
  mergeFooterGroups,
  type FooterGroupConfig,
  type FooterGroupsBundle,
} from '../data/footerGroupsContent'

export function useFooterGroups() {
  const [bundle, setBundle] = useState<FooterGroupsBundle>(defaultFooterGroupsBundle)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    void fetchPageContentBundle(FOOTER_GROUPS_KEY, defaultFooterGroupsBundle, mergeFooterGroups).then((data) => {
      if (!cancelled) {
        setBundle(data)
        setLoaded(true)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  const groups = getActiveFooterGroups(bundle)
  return { groups, loaded }
}

export type { FooterGroupConfig }
