import { LegalCmsPage } from '../../components/legal/LegalCmsPage'
import { LEGAL_KVKK_PAGE_KEY } from '../../data/legalPageContent'
import { defaultLegalKvkkPage } from '../../data/legalPageDefaults'

export function KvkkAydinlatmaPage() {
  return <LegalCmsPage pageKey={LEGAL_KVKK_PAGE_KEY} defaults={defaultLegalKvkkPage} />
}
