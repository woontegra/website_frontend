import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { licensesAdminApi, type AdminLicenseRow } from '../../api/licenses-admin'

function defaultExpiresAt(): string {
  const d = new Date()
  d.setFullYear(d.getFullYear() + 1)
  return d.toISOString().slice(0, 10)
}

function sourceLabel(s: AdminLicenseRow['source']): string {
  return s === 'MANUAL' ? 'Manuel' : 'Web siparişi'
}

function statusLabel(s: AdminLicenseRow['status']): string {
  if (s === 'ACTIVE') return 'Aktif'
  if (s === 'DISABLED') return 'Pasif'
  return 'Süresi dolmuş'
}

export function AdminLicensesPage() {
  const [items, setItems] = useState<AdminLicenseRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [source, setSource] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [lastPassword, setLastPassword] = useState<string | null>(null)

  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    productCode: 'MUVEKKIL_KASA_DESKTOP',
    startsAt: new Date().toISOString().slice(0, 10),
    expiresAt: defaultExpiresAt(),
    maxDevices: 1,
    notes: '',
    sendEmail: true,
  })

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const rows = await licensesAdminApi.list({
        q: q.trim() || undefined,
        source: source || undefined,
      })
      setItems(rows)
    } catch {
      setError('Lisans listesi yüklenemedi.')
    } finally {
      setLoading(false)
    }
  }, [q, source])

  useEffect(() => {
    void load()
  }, [load])

  async function onCreate(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setLastPassword(null)
    try {
      const out = await licensesAdminApi.create({
        customerName: form.customerName.trim(),
        customerEmail: form.customerEmail.trim(),
        customerPhone: form.customerPhone.trim() || undefined,
        productCode: form.productCode,
        startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : undefined,
        expiresAt: new Date(form.expiresAt).toISOString(),
        maxDevices: form.maxDevices,
        notes: form.notes.trim() || undefined,
        sendEmail: form.sendEmail,
      })
      setLastPassword(out.activationPassword)
      setToast(form.sendEmail ? 'Lisans oluşturuldu ve e-posta gönderildi.' : 'Lisans oluşturuldu.')
      setShowCreate(false)
      await load()
    } catch {
      setToast('Lisans oluşturulamadı.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lisanslar</h1>
          <p className="text-sm text-slate-500">Manuel ve sipariş kaynaklı masaüstü lisansları</p>
        </div>
        <button
          type="button"
          className="rounded-lg bg-accent-blue px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          onClick={() => setShowCreate(true)}
        >
          Yeni lisans
        </button>
      </div>

      {toast ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {toast}
        </div>
      ) : null}

      {lastPassword ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong>Aktivasyon şifresi (yalnızca bir kez gösterilir):</strong>{' '}
          <span className="font-mono">{lastPassword}</span>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <input
          className="input max-w-xs"
          placeholder="Ara (ad, e-posta, lisans, sipariş)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className="input max-w-[180px]" value={source} onChange={(e) => setSource(e.target.value)}>
          <option value="">Tüm kaynaklar</option>
          <option value="MANUAL">Manuel</option>
          <option value="WEBSITE_ORDER">Web siparişi</option>
        </select>
        <button type="button" className="btn-secondary" onClick={() => void load()}>
          Filtrele
        </button>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">Lisans</th>
              <th className="px-4 py-3">Müşteri</th>
              <th className="px-4 py-3">Kaynak</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3">Bitiş</th>
              <th className="px-4 py-3">Cihaz</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  Yükleniyor…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  Kayıt yok
                </td>
              </tr>
            ) : (
              items.map((row) => (
                <tr key={row.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-mono text-xs">{row.licenseKey}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{row.customerName ?? '—'}</div>
                    <div className="text-xs text-slate-500">{row.customerEmail}</div>
                  </td>
                  <td className="px-4 py-3">{sourceLabel(row.source)}</td>
                  <td className="px-4 py-3">{statusLabel(row.status)}</td>
                  <td className="px-4 py-3">
                    {row.expiresAt ? new Date(row.expiresAt).toLocaleDateString('tr-TR') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    {row.activatedDevicesCount}/{row.maxDevices}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/admin/lisanslar/${row.id}`}
                      className="text-accent-blue font-semibold hover:underline"
                    >
                      Detay
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showCreate ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={(e) => void onCreate(e)}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
          >
            <h2 className="text-lg font-bold text-slate-900">Manuel lisans oluştur</h2>
            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="label">Müşteri adı / ünvan</span>
                <input
                  className="input w-full"
                  required
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="label">E-posta</span>
                <input
                  className="input w-full"
                  type="email"
                  required
                  value={form.customerEmail}
                  onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="label">Telefon</span>
                <input
                  className="input w-full"
                  value={form.customerPhone}
                  onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="label">Program</span>
                <select
                  className="input w-full"
                  value={form.productCode}
                  onChange={(e) => setForm({ ...form, productCode: e.target.value })}
                >
                  <option value="MUVEKKIL_KASA_DESKTOP">Müvekkil Kasa Defteri Masaüstü</option>
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="label">Başlangıç</span>
                  <input
                    className="input w-full"
                    type="date"
                    value={form.startsAt}
                    onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
                  />
                </label>
                <label className="block">
                  <span className="label">Bitiş</span>
                  <input
                    className="input w-full"
                    type="date"
                    required
                    value={form.expiresAt}
                    onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                  />
                </label>
              </div>
              <label className="block">
                <span className="label">Maksimum cihaz</span>
                <input
                  className="input w-full"
                  type="number"
                  min={1}
                  max={50}
                  value={form.maxDevices}
                  onChange={(e) => setForm({ ...form, maxDevices: Number.parseInt(e.target.value, 10) || 1 })}
                />
              </label>
              <label className="block">
                <span className="label">Not</span>
                <textarea
                  className="input w-full"
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.sendEmail}
                  onChange={(e) => setForm({ ...form, sendEmail: e.target.checked })}
                />
                Oluşturunca müşteriye e-posta gönder
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" className="btn-secondary" onClick={() => setShowCreate(false)} disabled={busy}>
                İptal
              </button>
              <button type="submit" className="btn-primary" disabled={busy}>
                {busy ? 'Kaydediliyor…' : 'Oluştur'}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  )
}
