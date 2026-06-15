import { useEffect, useMemo, useState } from 'react'
import type { LegalDocType } from '../../api/legal-documents-public'
import { legalDocumentsPublicApi } from '../../api/legal-documents-public'

export function LegalDocModal({
  type,
  title,
  open,
  onClose,
  previewVariables,
}: {
  type: LegalDocType
  title: string
  open: boolean
  onClose: () => void
  previewVariables: Record<string, string>
}) {
  const [html, setHtml] = useState<string>('')
  const [headline, setHeadline] = useState(title)
  const [loading, setLoading] = useState(false)
  const previewSig = useMemo(() => JSON.stringify(previewVariables), [previewVariables])

  useEffect(() => {
    if (!open) {
      setHtml('')
      setHeadline(title)
      return
    }
    setHeadline(title)
    let cancelled = false
    void (async () => {
      try {
        setLoading(true)
        const d = await legalDocumentsPublicApi.preview(type, previewVariables)
        if (!cancelled) {
          setHtml(d.content)
          if (d.title?.trim()) setHeadline(d.title)
        }
      } catch {
        if (!cancelled) {
          setHtml(
            '<p class="text-slate-700">Yasal metin şu anda yüklenemedi. Lütfen bir süre sonra yeniden deneyin veya destek ekibiyle iletişime geçin.</p>',
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [open, type, title, previewSig])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-4 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="legal-doc-modal-title">
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
          <h2 id="legal-doc-modal-title" className="min-w-0 text-lg font-bold leading-snug text-slate-900">
            {headline}
          </h2>
          <button type="button" className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100" onClick={onClose}>
            Kapat
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-800 prose-p:mb-3 prose-headings:scroll-mt-4 prose-h2:mb-2 prose-h2:mt-6 prose-h2:text-base prose-h2:font-bold prose-ul:my-2 prose-li:my-0.5">
            {loading ? <p className="text-slate-600">Yükleniyor…</p> : <div dangerouslySetInnerHTML={{ __html: html }} />}
          </div>
        </div>
      </div>
    </div>
  )
}
