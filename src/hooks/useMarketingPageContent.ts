import { useEffect, useState } from 'react'
import { fetchMarketingPageContent } from '../api/marketingPageContent'
import type { MarketingPageContent } from '../data/marketingPageContent'

export function useMarketingPageContent(
  pageKey: string,
  defaults: MarketingPageContent,
): MarketingPageContent {
  const [content, setContent] = useState<MarketingPageContent>(defaults)

  useEffect(() => {
    void fetchMarketingPageContent(pageKey, defaults).then(setContent)
  }, [pageKey, defaults])

  useEffect(() => {
    document.title = content.seoTitle
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', content.seoDescription)
  }, [content.seoTitle, content.seoDescription])

  return content
}
