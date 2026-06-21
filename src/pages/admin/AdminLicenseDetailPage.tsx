import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { licensesAdminApi, type AdminLicenseDetail } from '../../api/licenses-admin'

export function AdminLicenseDetailPage() {
  const { id = '' } = useParams()
  const [row, setRow] = useState<AdminLicenseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [lastPassword, setLastPassword] = useState<string | null>(null)
  const [extendDate, setExtendDate] = useState('')

  const load = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const data = await licensesAdminApi.get(id)
      setRow(data)
      if (data.expiresAt) {
        setExtendDate(data.expiresAt.slice(0, 10))
      }
    } catch {
      setRow(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    void load()
  }, [load])

  async function runAction(label: string, fn: () => Promise<void>) {
    setBusy(true)
    setToast(null)
    try {
      await fn()
      setToast(label)
      await load()
    } catch {
      setToast('İşlem başarısız.')
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return <div className="p-6 text-slate-500">Yükleniyor…</div>
  }

  if (!row) {
    return (
      <div className="p-6">
        <p className="text-red-600">Lisans bulunamadı.</p>
        <Link to="/admin/lisanslar" className="mt-4 inline-block text-accent-blue hover:underline">
          ← Lisans listesi
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <Link to="/admin/lisanslar" className="text-sm font-semibold text-accent-blue hover:underline">
        ← Lisans listesi
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Lisans detayı</h1>
        <p className="font-mono text-sm text-slate-600">{row.licenseKey}</p>
      </div>

      {toast ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {toast}
        </div>
      ) : null}

      {lastPassword ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong>Yeni aktivasyon şifresi:</strong> <span className="font-mono">{lastPassword}</span>
        </div>
      ) : null}

      <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 md:grid-cols-2">
        <div>
          <div className="text-xs text-slate-500">Müşteri</div>
          <div className="font-medium">{row.customerName ?? '—'}</div>
          <div className="text-sm">{row.customerEmail}</div>
          {row.customerPhone ? <div className="text-sm text-slate-600">{row.customerPhone}</div> : null}
        </div>
        <div>
          <div className="text-xs text-slate-500">Program</div>
          <div>{row.productName}</div>
          <div className="text-xs text-slate-500">{row.productCode}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Kaynak</div>
          <div>{row.source === 'MANUAL' ? 'Manuel' : 'Web siparişi'}</div>
          {row.orderNo ? (
            <Link to={`/admin/siparisler/${row.orderId}`} className="text-sm text-accent-blue hover:underline">
              Sipariş {row.orderNo}
            </Link>
          ) : null}
        </div>
        <div>
          <div className="text-xs text-slate-500">Durum / cihaz</div>
          <div>
            {row.status} — {row.activatedDevicesCount}/{row.maxDevices} cihaz
          </div>
          <div className="text-sm text-slate-600">
            {row.startsAt ? new Date(row.startsAt).toLocaleDateString('tr-TR') : '—'} →{' '}
            {row.expiresAt ? new Date(row.expiresAt).toLocaleDateString('tr-TR') : '—'}
          </div>
        </div>
        {row.notes ? (
          <div className="md:col-span-2">
            <div className="text-xs text-slate-500">Not</div>
            <div className="text-sm whitespace-pre-wrap">{row.notes}</div>
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="btn-secondary"
          disabled={busy}
          onClick={() =>
            void runAction('Lisans aktif yapıldı.', async () => {
              await licensesAdminApi.patch(row.id, { status: 'ACTIVE' })
            })
          }
        >
          Aktif yap
        </button>
        <button
          type="button"
          className="btn-secondary"
          disabled={busy}
          onClick={() =>
            void runAction('Lisans pasif yapıldı.', async () => {
              await licensesAdminApi.patch(row.id, { status: 'DISABLED' })
            })
          }
        >
          Pasif yap
        </button>
        <button
          type="button"
          className="btn-secondary"
          disabled={busy}
          onClick={() => {
            if (!window.confirm('Tüm cihaz kayıtları silinsin mi?')) return
            void runAction('Cihazlar sıfırlandı.', async () => {
              await licensesAdminApi.resetDevices(row.id)
            })
          }}
        >
          Cihazları sıfırla
        </button>
        <button
          type="button"
          className="btn-secondary"
          disabled={busy}
          onClick={() =>
            void runAction('E-posta gönderildi.', async () => {
              await licensesAdminApi.sendEmail(row.id)
            })
          }
        >
          Mail tekrar gönder
        </button>
        <button
          type="button"
          className="btn-primary"
          disabled={busy}
          onClick={() =>
            void (async () => {
              setBusy(true)
              try {
                const out = await licensesAdminApi.regeneratePassword(row.id, true)
                setLastPassword(out.activationPassword)
                setToast('Şifre yenilendi ve e-posta gönderildi.')
                await load()
              } catch {
                setToast('Şifre yenilenemedi.')
              } finally {
                setBusy(false)
              }
            })()
          }
        >
          Şifre yenile + mail
        </button>
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-5">
        <label className="block">
          <span className="label">Bitiş tarihi uzat</span>
          <input
            className="input"
            type="date"
            value={extendDate}
            onChange={(e) => setExtendDate(e.target.value)}
          />
        </label>
        <button
          type="button"
          className="btn-primary"
          disabled={busy || !extendDate}
          onClick={() =>
            void runAction('Lisans süresi uzatıldı.', async () => {
              await licensesAdminApi.extend(row.id, new Date(extendDate).toISOString())
            })
          }
        >
          Uzat
        </button>
      </div>

      {row.activations.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3">Cihaz</th>
                <th className="px-4 py-3">Platform</th>
                <th className="px-4 py-3">İlk aktivasyon</th>
                <th className="px-4 py-3">Son doğrulama</th>
              </tr>
            </thead>
            <tbody>
              {row.activations.map((a) => (
                <tr key={a.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <div>{a.deviceName ?? '—'}</div>
                    <div className="font-mono text-xs text-slate-500">{a.deviceHash.slice(0, 16)}…</div>
                  </td>
                  <td className="px-4 py-3">{a.platform ?? '—'}</td>
                  <td className="px-4 py-3">{new Date(a.firstActivatedAt).toLocaleString('tr-TR')}</td>
                  <td className="px-4 py-3">
                    {a.lastValidatedAt ? new Date(a.lastValidatedAt).toLocaleString('tr-TR') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-slate-500">Henüz cihaz aktivasyonu yok.</p>
      )}
    </div>
  )
}
