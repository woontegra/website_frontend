import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { paymentSettingsAdminApi, type AdminPaytrSettingsDto } from '../../api/payment-settings-admin'

const MASK = '••••••••••••••••'

/** PayTR mağaza paneli Bildirim URL: ana domain üzerinden /api Vercel → Railway proxy */
const DEFAULT_PAYTR_CALLBACK_PUBLIC = 'https://woontegra.com/api/payments/paytr/callback'

export function AdminPaymentSettingsPage() {
  const [dto, setDto] = useState<AdminPaytrSettingsDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const [isActive, setIsActive] = useState(false)
  const [testMode, setTestMode] = useState(true)
  const [debugOn, setDebugOn] = useState(true)
  const [merchantId, setMerchantId] = useState('')
  const [merchantKey, setMerchantKey] = useState('')
  const [merchantSalt, setMerchantSalt] = useState('')
  const [callbackUrl, setCallbackUrl] = useState('')
  const [successUrl, setSuccessUrl] = useState('')
  const [failUrl, setFailUrl] = useState('')

  const displayCallbackUrl = useMemo(() => {
    const t = callbackUrl.trim()
    if (t) return t
    return DEFAULT_PAYTR_CALLBACK_PUBLIC
  }, [callbackUrl])

  const callbackIsLocalhost = useMemo(() => {
    const u = displayCallbackUrl.toLowerCase()
    return u.includes('localhost') || u.includes('127.0.0.1') || u.includes('[::1]')
  }, [displayCallbackUrl])

  const load = async () => {
    setError(null)
    try {
      setLoading(true)
      const d = await paymentSettingsAdminApi.getPaytr()
      setDto(d)
      setIsActive(d.isActive)
      setTestMode(d.testMode)
      setDebugOn(d.debugOn)
      setMerchantId(d.merchantId)
      setMerchantKey('')
      setMerchantSalt('')
      setCallbackUrl(d.callbackUrl ?? '')
      setSuccessUrl(d.successUrl ?? '')
      setFailUrl(d.failUrl ?? '')
    } catch {
      setError('Ayarlar yüklenemedi.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const copyCallback = async () => {
    try {
      await navigator.clipboard.writeText(displayCallbackUrl)
      setMessage('Callback URL kopyalandı.')
      window.setTimeout(() => setMessage(null), 2500)
    } catch {
      setMessage('Kopyalanamadı; metni elle seçin.')
    }
  }

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setMessage(null)
    try {
      const body: Record<string, unknown> = {
        isActive,
        testMode,
        debugOn,
        merchantId,
        callbackUrl: callbackUrl.trim() || null,
        successUrl: successUrl.trim() || null,
        failUrl: failUrl.trim() || null,
      }
      if (merchantKey.trim()) body.merchantKey = merchantKey.trim()
      if (merchantSalt.trim()) body.merchantSalt = merchantSalt.trim()

      const d = await paymentSettingsAdminApi.patchPaytr(body)
      setDto(d)
      setMerchantKey('')
      setMerchantSalt('')
      setMessage('Kaydedildi.')
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null
      setError(msg || 'Kayıt başarısız.')
    } finally {
      setSaving(false)
    }
  }

  if (loading && !dto) {
    return (
      <div className="w-full min-w-0">
        <p className="text-slate-600">Yükleniyor…</p>
      </div>
    )
  }

  return (
    <div className="w-full min-w-0 space-y-4 sm:space-y-6">
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
        <Link to="/admin" className="shrink-0 text-sm text-accent-blue hover:underline">
          ← Dashboard
        </Link>
        <h1 className="min-w-0 text-xl font-bold text-slate-900 sm:text-2xl">Ödeme ayarları (PayTR)</h1>
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}
      {message && <p className="text-sm text-emerald-800">{message}</p>}

      {callbackIsLocalhost && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <p className="font-semibold">PayTR callback URL localhost olamaz.</p>
          <p className="mt-1 leading-relaxed">
            Mağaza panelinde Bildirim URL olarak ana domain üzerinden tam HTTPS adresi kullanın (ör. woontegra.com/api/…). Vercel’de /api istekleri Railway backend’e yönlendirilir.
          </p>
        </div>
      )}

      <section className="w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
        <h2 className="font-semibold text-slate-900">PayTR bildirim (callback) URL</h2>
        <p className="mt-2 min-w-0 text-sm leading-relaxed text-slate-600">
          Mağaza panelinde Bildirim URL alanına tam adresi yapıştırın. Bu adres PayTR sunucusundan backend’e POST ile gelir; müşteri tarayıcı yönlendirmesi için aşağıdaki Başarı URL ve Hata URL alanlarını kullanın. Yol:{' '}
          <code className="break-all rounded bg-slate-100 px-1 text-xs">{dto?.callbackPath ?? '/api/payments/paytr/callback'}</code>
        </p>
        <div className="mt-3 flex min-w-0 flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-2">
          <input
            readOnly
            className="box-border min-h-[2.75rem] w-full min-w-0 rounded border border-slate-300 bg-slate-50 px-3 py-2 font-mono text-xs sm:flex-1 sm:text-sm"
            value={displayCallbackUrl}
          />
          <button
            type="button"
            className="w-full shrink-0 rounded bg-slate-800 px-4 py-2.5 text-sm text-white hover:bg-slate-900 sm:w-auto sm:self-start"
            onClick={() => void copyCallback()}
          >
            Kopyala
          </button>
        </div>
      </section>

      <form onSubmit={onSave} className="w-full max-w-2xl min-w-0 space-y-4 rounded-lg border border-slate-200 bg-white p-4 sm:p-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          PayTR ayarları aktif (veritabanından kullan)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={testMode} onChange={(e) => setTestMode(e.target.checked)} />
          Test modu
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={debugOn} onChange={(e) => setDebugOn(e.target.checked)} />
          Debug log
        </label>

        <div>
          <label className="block text-sm font-medium text-slate-700">Mağaza no (merchant_id)</label>
          <input className="mt-1 box-border w-full min-w-0 rounded border border-slate-300 px-3 py-2 font-mono text-sm" value={merchantId} onChange={(e) => setMerchantId(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Mağaza parola (merchant_key)</label>
          <input
            type="password"
            autoComplete="new-password"
            placeholder={dto?.merchantKeyMasked ? MASK : 'Yeni değer girin (boş bırakırsanız değişmez)'}
            className="mt-1 box-border w-full min-w-0 rounded border border-slate-300 px-3 py-2 font-mono text-sm"
            value={merchantKey}
            onChange={(e) => setMerchantKey(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Mağaza gizli anahtar (merchant_salt)</label>
          <input
            type="password"
            autoComplete="new-password"
            placeholder={dto?.merchantSaltMasked ? MASK : 'Yeni değer girin (boş bırakırsanız değişmez)'}
            className="mt-1 box-border w-full min-w-0 rounded border border-slate-300 px-3 py-2 font-mono text-sm"
            value={merchantSalt}
            onChange={(e) => setMerchantSalt(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Callback URL (opsiyonel, DB)</label>
          <p className="mt-1 text-xs text-slate-500">
            PayTR mağaza paneli Bildirim URL:{' '}
            <span className="font-mono text-slate-700">{DEFAULT_PAYTR_CALLBACK_PUBLIC}</span> — Vercel&apos;de{' '}
            <code className="rounded bg-slate-100 px-1">/api</code> Railway backend&apos;e proxylanır.
          </p>
          <input
            className="mt-1 box-border w-full min-w-0 rounded border border-slate-300 px-3 py-2 font-mono text-sm"
            placeholder={DEFAULT_PAYTR_CALLBACK_PUBLIC}
            value={callbackUrl}
            onChange={(e) => setCallbackUrl(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Başarı URL (opsiyonel)</label>
          <p className="mt-1 text-xs text-slate-500">
            Örnek: https://woontegra.com/siparis-basarili — sistem sipariş numarasını otomatik ekler.
          </p>
          <input className="mt-1 box-border w-full min-w-0 rounded border border-slate-300 px-3 py-2 text-sm" value={successUrl} onChange={(e) => setSuccessUrl(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Hata URL (opsiyonel)</label>
          <p className="mt-1 text-xs text-slate-500">
            Örnek: https://woontegra.com/siparis-basarisiz — sistem sipariş numarasını otomatik ekler.
          </p>
          <input className="mt-1 box-border w-full min-w-0 rounded border border-slate-300 px-3 py-2 text-sm" value={failUrl} onChange={(e) => setFailUrl(e.target.value)} />
        </div>

        <button type="submit" disabled={saving} className="rounded-lg bg-emerald-600 px-5 py-2.5 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
          {saving ? 'Kaydediliyor…' : 'Kaydet'}
        </button>
      </form>
    </div>
  )
}
