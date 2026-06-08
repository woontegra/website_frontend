import { useEffect, useState } from 'react'
import { ExternalLink, Save } from 'lucide-react'
import { fetchSifreKasasiPageContent, saveSifreKasasiPageContent } from '../../api/sifreKasasiPageContent'
import {
  defaultSifreKasasiPageContent,
  mergeSifreKasasiPageContent,
  resolveSifreKasasiHeroImage,
  type SifreKasasiPageContent,
} from '../../data/sifreKasasiPage'
export function AdminSifreKasasiEditor() {
  const [content, setContent] = useState<SifreKasasiPageContent>(defaultSifreKasasiPageContent)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    void fetchSifreKasasiPageContent().then((data) => {
      setContent(data)
      setLoading(false)
    })
  }, [])

  const update = <K extends keyof SifreKasasiPageContent>(key: K, value: SifreKasasiPageContent[K]) => {
    setContent((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    const payload = mergeSifreKasasiPageContent(content)
    const result = await saveSifreKasasiPageContent(payload)
    if (result.success) {
      setContent(payload)
      setMessage('✓ Kaydedildi')
      setTimeout(() => setMessage(''), 3000)
    } else {
      setMessage(`Hata: ${result.message ?? 'Kayıt başarısız'}`)
    }
    setSaving(false)
  }

  const previewImage = resolveSifreKasasiHeroImage(content.heroImageUrl)

  if (loading) {
    return (
      <div className="card p-8 text-center">
        <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-b-2 border-green-500" />
        <p className="text-sm text-slate-600">Yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Şifre Kasası Sayfası</h2>
          <p className="mt-1 text-sm text-slate-500">
            /ucretsiz-araclar/sifre-kasasi — metinler, görsel ve SEO ayarları
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/ucretsiz-araclar/sifre-kasasi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <ExternalLink className="h-4 w-4" />
            Canlı sayfa
          </a>
          <button type="button" onClick={() => void handleSave()} disabled={saving} className="button flex items-center gap-1.5 disabled:opacity-50">
            <Save className="h-4 w-4" />
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`rounded-lg border p-3 text-sm ${
            message.includes('✓')
              ? 'border-green-200 bg-green-50 text-green-800'
              : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          {message}
        </div>
      )}

      <div className="card space-y-5">
        <label className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <span className="text-sm font-medium text-slate-800">Sayfa aktif</span>
          <input
            type="checkbox"
            checked={content.enabled}
            onChange={(e) => update('enabled', e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
          />
        </label>

        <Field label="Hero rozet metni" value={content.badge} onChange={(v) => update('badge', v)} />
        <Field label="Ana başlık" value={content.title} onChange={(v) => update('title', v)} />
        <TextArea label="Alt başlık" value={content.subtitle} onChange={(v) => update('subtitle', v)} />
        <TextArea label="Açıklama" value={content.description} onChange={(v) => update('description', v)} rows={4} />

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Sürüm" value={content.version} onChange={(v) => update('version', v)} />
          <Field label="Platform" value={content.platform} onChange={(v) => update('platform', v)} />
        </div>

        <Field label="Windows kurulum buton metni" value={content.setupButtonText} onChange={(v) => update('setupButtonText', v)} />
        <Field label="Portable buton metni" value={content.portableButtonText} onChange={(v) => update('portableButtonText', v)} />
        <TextArea label="Güven notu metni" value={content.trustNote} onChange={(v) => update('trustNote', v)} rows={3} />

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Toplam indirme etiketi" value={content.statsTotalLabel} onChange={(v) => update('statsTotalLabel', v)} />
          <Field label="Sayaç yok metni" value={content.statsFallbackText} onChange={(v) => update('statsFallbackText', v)} />
          <Field label="Kurulum sayaç etiketi" value={content.statsSetupLabel} onChange={(v) => update('statsSetupLabel', v)} />
          <Field label="Portable sayaç etiketi" value={content.statsPortableLabel} onChange={(v) => update('statsPortableLabel', v)} />
        </div>

        <Field label="SEO title" value={content.seoTitle} onChange={(v) => update('seoTitle', v)} />
        <TextArea label="SEO description" value={content.seoDescription} onChange={(v) => update('seoDescription', v)} rows={3} />

        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
          <p className="text-sm text-slate-600">
            Uygulama ekran görüntüsü sabit frontend asset olarak kullanılır; panelden görsel URL girilmez.
          </p>
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Önizleme</p>
            <img
              src={previewImage}
              alt="Şifre Kasası hero önizleme"
              className="max-h-64 w-full max-w-xl rounded-lg border border-slate-200 object-contain bg-slate-900"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input type="text" className="input w-full" value={value} onChange={(e) => onChange(e.target.value)} />
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
  onChange: (value: string) => void
  rows?: number
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <textarea className="textarea w-full" rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}
