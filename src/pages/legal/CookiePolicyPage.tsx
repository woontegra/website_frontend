import { LegalCmsPage } from '../../components/legal/LegalCmsPage'
import { LEGAL_COOKIE_PAGE_KEY } from '../../data/legalPageContent'
import { defaultLegalCookiePage } from '../../data/legalPageDefaults'

export function CookiePolicyPage() {
  return <LegalCmsPage pageKey={LEGAL_COOKIE_PAGE_KEY} defaults={defaultLegalCookiePage} loadCookies />
}
