import { useEffect, useMemo, useState } from 'react'
import { legalDocumentsPublicApi, type LegalDocType } from '../../api/legal-documents-public'

type Props = {
  type: LegalDocType
  variant?: 'DOWNLOAD' | 'SAAS'
  variables: Record<string, string>
}

export function CheckoutLegalPreviewBody({ type, variant, variables }: Props) {
  const [html, setHtml] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const varsKey = useMemo(() => JSON.stringify(variables), [variables])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)
    void legalDocumentsPublicApi
      .preview(type, variables, variant)
      .then((doc) => {
        if (cancelled) return
        setHtml(doc.content)
      })
      .catch(() => {
        if (cancelled) return
        setError(true)
        setHtml(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [type, variant, varsKey, variables])

  if (loading) {
    return <p className="text-sm text-slate-600">Yasal metin yükleniyor…</p>
  }
  if (error || !html) {
    return (
      <p className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-800">
        Yasal metin yüklenemedi. Lütfen sayfayı yenileyin veya destek ile iletişime geçin.
      </p>
    )
  }

  return (
    <div
      className="legal-prose min-w-0 text-sm leading-relaxed text-slate-800 [&_.legal-block]:my-3 [&_.legal-buyer-block]:my-4 [&_.legal-buyer-block_h3]:text-sm [&_.legal-buyer-block_h3]:font-bold [&_.legal-buyer-block_h3]:text-slate-900 [&_.legal-doc_h2]:mt-6 [&_.legal-doc_h2]:text-base [&_.legal-doc_h2]:font-bold [&_.legal-doc_h2]:text-slate-900 [&_.legal-doc_p]:mt-2 [&_.legal-doc_ul]:mt-2 [&_.legal-doc_ul]:list-disc [&_.legal-doc_ul]:pl-5"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
