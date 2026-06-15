import { LegalPageRenderer } from '../legal/LegalPageRenderer'
import { activeLegalSections, LEGAL_KVKK_PAGE_KEY } from '../../data/legalPageContent'
import { defaultLegalKvkkPage } from '../../data/legalPageDefaults'
import { formatLegalDate } from '../../data/legalCompanyInfo'
import { useLegalCompanyInfo } from '../../hooks/useLegalCompanyInfo'
import { useLegalPageContent } from '../../hooks/useLegalPageContent'

/**
 * Checkout modalında KVKK metnini, yasal sayfadakiyle aynı CMS kaynağından gösterir.
 * `/kvkk-aydinlatma-metni` sayfası veya içerik dosyaları değiştirilmez.
 */
export function CheckoutKvkkModalBody() {
  const content = useLegalPageContent(LEGAL_KVKK_PAGE_KEY, defaultLegalKvkkPage)
  const companyInfo = useLegalCompanyInfo()

  if (!content.enabled) {
    return (
      <div className="rounded-xl border border-amber-100 bg-amber-50/80 px-4 py-6 text-sm text-amber-950">
        <p className="font-semibold">Sayfa geçici olarak kullanılamıyor</p>
        <p className="mt-2 text-amber-900/90">Bu yasal sayfa şu anda yayında değil. Lütfen daha sonra tekrar deneyin veya destek ekibiyle iletişime geçin.</p>
      </div>
    )
  }

  const sections = activeLegalSections(content)
  const updatedAt = content.updatedAtLabel?.trim() || companyInfo.lastUpdated

  return (
    <div className="legal-prose min-w-0 text-sm text-slate-800">
      {content.description ? (
        <p className="mb-6 rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2 text-slate-600">{content.description}</p>
      ) : null}
      <p className="mb-6 text-xs text-slate-500">Son güncelleme: {formatLegalDate(updatedAt)}</p>
      <LegalPageRenderer sections={sections} companyInfo={companyInfo} showCompanyRepresentative />
    </div>
  )
}
