import { LegalCmsPage } from '../../components/legal/LegalCmsPage'
import { LEGAL_PRIVACY_PAGE_KEY } from '../../data/legalPageContent'
import { defaultLegalPrivacyPage } from '../../data/legalPageDefaults'

export function GizlilikPolitikasiPage() {
  return (
    <LegalCmsPage
      pageKey={LEGAL_PRIVACY_PAGE_KEY}
      defaults={defaultLegalPrivacyPage}
      showCompanyRepresentative={false}
    />
  )
}
