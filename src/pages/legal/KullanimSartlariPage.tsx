import { LegalCmsPage } from '../../components/legal/LegalCmsPage'
import { LEGAL_TERMS_PAGE_KEY } from '../../data/legalPageContent'
import { defaultLegalTermsPage } from '../../data/legalPageDefaults'

export function KullanimSartlariPage() {
  return (
    <LegalCmsPage
      pageKey={LEGAL_TERMS_PAGE_KEY}
      defaults={defaultLegalTermsPage}
      showCompanyRepresentative={false}
    />
  )
}
