import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { legalDocumentsPublicApi } from '../../api/legal-documents-public'
import { LegalPageLayout } from '../../components/legal/LegalPageLayout'
import {
  isLegalCheckoutDocSlug,
  LEGAL_CHECKOUT_DOC_BY_SLUG,
  legalCheckoutPreviewVariables,
} from '../../data/legalCheckoutDocuments'
import { fallbackLegalDocumentHtml } from '../../data/legalDocumentApiFallbacks'
import { useLegalCompanyInfo } from '../../hooks/useLegalCompanyInfo'

export function LegalCheckoutDocumentPage() {
  const { docSlug = '' } = useParams<{ docSlug: string }>()
  const company = useLegalCompanyInfo()
  const cfg = isLegalCheckoutDocSlug(docSlug) ? LEGAL_CHECKOUT_DOC_BY_SLUG[docSlug] : undefined

  const [title, setTitle] = useState(() => cfg?.title ?? 'Yasal metin')
  const [html, setHtml] = useState('')
  const [version, setVersion] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!cfg) {
      setLoading(false)
      return
    }
    setTitle(cfg.title)
    let cancelled = false
    const vars = legalCheckoutPreviewVariables()
    void (async () => {
      try {
        setLoading(true)
        const d = await legalDocumentsPublicApi.preview(cfg.type, vars)
        if (cancelled) return
        const body = d.content?.trim()
        setHtml(body && body.length > 20 ? d.content : fallbackLegalDocumentHtml(cfg.type))
        if (d.title?.trim()) setTitle(d.title.trim())
        setVersion(typeof d.version === 'number' ? d.version : null)
      } catch {
        if (!cancelled) {
          setHtml(fallbackLegalDocumentHtml(cfg.type))
          setVersion(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [cfg, docSlug])

  if (!cfg) {
    return <Navigate to="/" replace />
  }

  const versionNote = version != null ? `Belge sürümü: ${version}. ` : ''

  return (
    <LegalPageLayout
      title={title}
      subtitle={cfg.subtitle}
      seoTitle={cfg.seoTitle}
      seoDescription={cfg.seoDescription}
      updatedAt={company.lastUpdated}
    >
      <p className="body-text mb-6 text-sm text-slate-600">
        <Link to="/checkout" className="font-semibold text-accent-blue underline hover:no-underline">
          Ödeme sayfasına dön
        </Link>
        <span className="mx-2 text-slate-300">·</span>
        <Link to="/" className="font-semibold text-accent-blue underline hover:no-underline">
          Ana sayfa
        </Link>
      </p>
      {loading ? (
        <p className="text-slate-600">Metin yükleniyor…</p>
      ) : (
        <>
          {version != null && (
            <p className="mb-4 text-xs text-slate-500">
              {versionNote}
              Aşağıdaki metin yönetim panelinden güncellenebilir; bağlantıyı ödeme öncesi okumanız önerilir.
            </p>
          )}
          <div
            className="prose prose-slate max-w-none text-slate-800 prose-headings:scroll-mt-28 prose-h2:text-xl prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </>
      )}
    </LegalPageLayout>
  )
}
