import { useEffect, useState } from 'react'
import { fetchLegalPageContent } from '../api/legalPageContent'
import { mergeLegalPageContent, type LegalPageContent } from '../data/legalPageContent'

export function useLegalPageContent(pageKey: string, defaults: LegalPageContent): LegalPageContent {
  const [content, setContent] = useState<LegalPageContent>(() => mergeLegalPageContent(defaults))

  useEffect(() => {
    void fetchLegalPageContent(pageKey, defaults).then(setContent)
  }, [pageKey])

  return content
}
