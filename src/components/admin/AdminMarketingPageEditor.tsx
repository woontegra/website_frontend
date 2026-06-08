import { useEffect, useState } from 'react'
import { ExternalLink, Save } from 'lucide-react'
import { fetchMarketingPageContent, saveMarketingPageContent } from '../../api/marketingPageContent'
import { mergeMarketingPageContent, type MarketingPageContent } from '../../data/marketingPageContent'

type AdminMarketingPageEditorProps = {
  pageKey: string
  pageTitle: string
  livePath: string
  defaults: MarketingPageContent
}

export function AdminMarketingPageEditor({
  pageKey,
  pageTitle,
  livePath,
  defaults,
}: AdminMarketingPageEditorProps) {
  const [content, setContent] = useState<MarketingPageContent>(defaults)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    void fetchMarketingPageContent(pageKey, defaults).then((data) => {
      setContent(data)
      setLoading(false)
    })
  }, [pageKey, defaults])

  const update = <K extends keyof MarketingPageContent>(key: K, value: MarketingPageContent[K]) => {
    setContent((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    const payload = mergeMarketingPageContent(defaults, content)
    const result = await saveMarketingPageContent(pageKey, payload)
    if (result.success) {
      setContent(payload)
      setMessage('✓ Kaydedildi')
      setTimeout(() => setMessage(''), 3000)
    } else {
      setMessage(`Hata: ${result.message ?? 'Kayıt başarısız'}`)
    }
    setSaving(false)
  }

  if (loading) {
    return <p className="text-sm text-slate-600">Yükleniyor…</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{pageTitle}</h2>
          <p className="mt-1 text-sm text-slate-500">{livePath} — hero, bölüm başlıkları, CTA ve SEO</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={livePath}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <ExternalLink className="h-4 w-4" />
            Canlı sayfa
          </a>
          <button type="button" onClick={() => void handleSave()} disabled={saving} className="button flex items-center gap-1.5 disabled:opacity-50">
            <Save className="h-4 w-4" />
            {saving ? 'Kaydediliyor…' : 'Kaydet'}
          </button>
        </div>
      </div>

      {message && <p className="text-sm text-slate-600">{message}</p>}

      <div className="card space-y-5">
        <label className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-sm font-medium text-slate-800">Sayfa aktif</span>
          <input type="checkbox" checked={content.enabled} onChange={(e) => update('enabled', e.target.checked)} className="h-4 w-4" />
        </label>
        <label className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-sm font-medium text-slate-800">Menüde göster</span>
          <input type="checkbox" checked={content.showInMenu} onChange={(e) => update('showInMenu', e.target.checked)} className="h-4 w-4" />
        </label>

        <Field label="Hero rozet" value={content.heroEyebrow} onChange={(v) => update('heroEyebrow', v)} />
        <Field label="Hero başlık" value={content.heroTitle} onChange={(v) => update('heroTitle', v)} />
        <TextArea label="Hero açıklama" value={content.heroDescription} onChange={(v) => update('heroDescription', v)} />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Vurgu kartı 1" value={content.highlight1} onChange={(v) => update('highlight1', v)} />
          <Field label="Vurgu kartı 2" value={content.highlight2} onChange={(v) => update('highlight2', v)} />
        </div>

        <Field label="Bölüm rozet" value={content.sectionEyebrow} onChange={(v) => update('sectionEyebrow', v)} />
        <Field label="Bölüm başlık" value={content.sectionTitle} onChange={(v) => update('sectionTitle', v)} />
        <TextArea label="Bölüm açıklama" value={content.sectionDescription} onChange={(v) => update('sectionDescription', v)} />

        <Field label="CTA başlık" value={content.ctaTitle} onChange={(v) => update('ctaTitle', v)} />
        <TextArea label="CTA açıklama" value={content.ctaDescription} onChange={(v) => update('ctaDescription', v)} />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="CTA buton metni" value={content.ctaButtonText} onChange={(v) => update('ctaButtonText', v)} />
          <Field label="CTA buton linki" value={content.ctaButtonLink} onChange={(v) => update('ctaButtonLink', v)} />
          <Field label="İkincil CTA metni" value={content.ctaSecondaryButtonText} onChange={(v) => update('ctaSecondaryButtonText', v)} />
          <Field label="İkincil CTA linki" value={content.ctaSecondaryButtonLink} onChange={(v) => update('ctaSecondaryButtonLink', v)} />
        </div>

        <Field label="SEO title" value={content.seoTitle} onChange={(v) => update('seoTitle', v)} />
        <TextArea label="SEO description" value={content.seoDescription} onChange={(v) => update('seoDescription', v)} />
      </div>
    </div>
  )
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="input w-full" />
    </div>
  )
}

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  rows?: number
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className="textarea w-full" />
    </div>
  )
}
