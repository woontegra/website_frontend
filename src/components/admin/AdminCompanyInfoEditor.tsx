import { useEffect, useState } from 'react'
import { Building2, Globe2, Landmark, Save, Share2 } from 'lucide-react'
import { fetchLegalCompanyInfo, saveLegalCompanyInfo } from '../../api/legalCompanyInfo'
import {
  defaultLegalCompanyInfo,
  mergeLegalCompanyInfo,
  type LegalCompanyInfo,
} from '../../data/legalCompanyInfo'
import { isValidHttpUrl, normalizeWebsiteUrl } from '../../lib/companyContact'

type FieldProps = {
  label: string
  hint?: string
  children: React.ReactNode
}

function Field({ label, hint, children }: FieldProps) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  )
}

function Card({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
        <Icon className="h-5 w-5 text-emerald-600" />
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

export function AdminCompanyInfoEditor() {
  const [content, setContent] = useState<LegalCompanyInfo>(defaultLegalCompanyInfo)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    void fetchLegalCompanyInfo().then((data) => {
      setContent(data)
      setLoading(false)
    })
  }, [])

  const update = <K extends keyof LegalCompanyInfo>(key: K, value: LegalCompanyInfo[K]) => {
    setContent((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    const urlFields: Array<{ key: keyof LegalCompanyInfo; label: string }> = [
      { key: 'website', label: 'Web sitesi' },
      { key: 'instagram', label: 'Instagram' },
      { key: 'facebook', label: 'Facebook' },
      { key: 'linkedin', label: 'LinkedIn' },
      { key: 'twitter', label: 'X / Twitter' },
      { key: 'youtube', label: 'YouTube' },
    ]
    for (const { key, label } of urlFields) {
      const value = String(content[key] ?? '').trim()
      if (value && !isValidHttpUrl(value)) {
        setMessage({ type: 'error', text: `${label} alanı geçerli bir URL olmalıdır.` })
        setSaving(false)
        return
      }
    }

    const payload = mergeLegalCompanyInfo({
      ...content,
      website: normalizeWebsiteUrl(content.website),
    })

    const result = await saveLegalCompanyInfo(payload)
    if (result.success) {
      setContent(payload)
      setMessage({ type: 'success', text: 'Firma bilgileri kaydedildi.' })
      setTimeout(() => setMessage(null), 4000)
    } else {
      setMessage({ type: 'error', text: result.message ?? 'Kayıt başarısız' })
    }
    setSaving(false)
  }

  if (loading) {
    return <p className="text-sm text-slate-600">Yükleniyor…</p>
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        Bu bilgiler KVKK, Gizlilik Politikası, Çerez Politikası, İletişim sayfası ve footer&apos;daki iletişim
        alanlarında otomatik kullanılır. Boş bırakılan alanlar sitede gösterilmez.
      </div>

      {message ? (
        <div
          className={`rounded-lg p-3 text-sm ${
            message.type === 'success'
              ? 'border border-green-200 bg-green-50 text-green-800'
              : 'border border-red-200 bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      ) : null}

      <Card title="Temel Firma Bilgileri" icon={Building2}>
        <Field label="Şirket unvanı" hint="KVKK veri sorumlusu tablosunda görünür.">
          <input
            type="text"
            value={content.companyName}
            onChange={(e) => update('companyName', e.target.value)}
            className="input w-full"
          />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Kısa marka adı" hint="Site genelinde marka adı olarak kullanılır.">
            <input
              type="text"
              value={content.brandName}
              onChange={(e) => update('brandName', e.target.value)}
              className="input w-full"
            />
          </Field>
          <Field label="Web sitesi" hint="https:// ile veya domain olarak girebilirsiniz.">
            <input
              type="url"
              value={content.website}
              onChange={(e) => update('website', e.target.value)}
              className="input w-full"
              placeholder="https://woontegra.com"
            />
          </Field>
        </div>
      </Card>

      <Card title="İletişim Bilgileri" icon={Globe2}>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="E-posta" hint="İletişim sayfası, footer ve yasal sayfalarda kullanılır.">
            <input
              type="email"
              value={content.email}
              onChange={(e) => update('email', e.target.value)}
              className="input w-full"
              placeholder="info@woontegra.com"
            />
          </Field>
          <Field label="Telefon" hint="Örnek: 0532 317 17 55 — KVKK tablosunda görünür.">
            <input
              type="tel"
              value={content.phone}
              onChange={(e) => update('phone', e.target.value)}
              className="input w-full"
              placeholder="0532 317 17 55"
            />
          </Field>
        </div>
        <Field label="WhatsApp" hint="Footer ve iletişim sayfasındaki WhatsApp bağlantısı için.">
          <input
            type="tel"
            value={content.whatsapp}
            onChange={(e) => update('whatsapp', e.target.value)}
            className="input w-full"
            placeholder="0532 317 17 55"
          />
        </Field>
        <Field label="Adres" hint="Tam adres satırı.">
          <textarea
            value={content.address}
            onChange={(e) => update('address', e.target.value)}
            rows={2}
            className="textarea w-full"
          />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="İl">
            <input
              type="text"
              value={content.city}
              onChange={(e) => update('city', e.target.value)}
              className="input w-full"
            />
          </Field>
          <Field label="İlçe">
            <input
              type="text"
              value={content.district}
              onChange={(e) => update('district', e.target.value)}
              className="input w-full"
            />
          </Field>
        </div>
      </Card>

      <Card title="Yasal Bilgiler" icon={Landmark}>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Vergi dairesi">
            <input
              type="text"
              value={content.taxOffice}
              onChange={(e) => update('taxOffice', e.target.value)}
              className="input w-full"
            />
          </Field>
          <Field label="Vergi numarası">
            <input
              type="text"
              value={content.taxNumber}
              onChange={(e) => update('taxNumber', e.target.value)}
              className="input w-full"
            />
          </Field>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="MERSİS no">
            <input
              type="text"
              value={content.mersisNumber}
              onChange={(e) => update('mersisNumber', e.target.value)}
              className="input w-full"
            />
          </Field>
          <Field label="Güncelleme tarihi" hint="Yasal sayfalarda son güncelleme tarihi olarak kullanılır.">
            <input
              type="date"
              value={content.lastUpdated}
              onChange={(e) => update('lastUpdated', e.target.value)}
              className="input w-full"
            />
          </Field>
        </div>
        <Field label="Veri sorumlusu temsilcisi" hint="Varsa temsilci bilgisi — boş bırakılırsa gizlenir.">
          <textarea
            value={content.dataControllerRepresentative}
            onChange={(e) => update('dataControllerRepresentative', e.target.value)}
            rows={2}
            className="textarea w-full"
          />
        </Field>
      </Card>

      <Card title="Sosyal Medya" icon={Share2}>
        <div className="grid gap-4 md:grid-cols-2">
          {(
            [
              ['instagram', 'Instagram'],
              ['facebook', 'Facebook'],
              ['linkedin', 'LinkedIn'],
              ['twitter', 'X / Twitter'],
              ['youtube', 'YouTube'],
            ] as const
          ).map(([key, label]) => (
            <Field key={key} label={label}>
              <input
                type="url"
                value={content[key]}
                onChange={(e) => update(key, e.target.value)}
                className="input w-full"
                placeholder="https://"
              />
            </Field>
          ))}
        </div>
      </Card>

      <div className="sticky bottom-0 z-10 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-md">
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving}
          className="button flex items-center gap-1.5 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Kaydediliyor…' : 'Firma Bilgilerini Kaydet'}
        </button>
        <span className="text-xs text-slate-500">Değişiklikler kaydedildikten sonra public sayfalara yansır.</span>
      </div>
    </div>
  )
}
