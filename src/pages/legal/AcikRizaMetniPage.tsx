import { LegalCmsPage } from '../../components/legal/LegalCmsPage'
import { LEGAL_CONSENT_PAGE_KEY } from '../../data/legalPageContent'
import { defaultLegalAcikRizaPage } from '../../data/legalPageDefaults'

export function AcikRizaMetniPage() {
  return <LegalCmsPage pageKey={LEGAL_CONSENT_PAGE_KEY} defaults={defaultLegalAcikRizaPage} />
}
