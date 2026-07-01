import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Cloud, KeyRound } from 'lucide-react'
import { customersApi, type CustomerSaasMembershipRow } from '../api/customers-api'
import { SaasRenewModal } from '../components/account/SaasRenewModal'

function formatDateTR(iso: string): string {
  return new Date(iso).toLocaleDateString('tr-TR')
}

function statusLabel(status: string): string {
  if (status === 'ACTIVE') return 'Aktif'
  if (status === 'EXPIRED') return 'Süresi doldu'
  if (status === 'SUSPENDED') return 'Askıda'
  return status
}

function statusClass(status: string): string {
  if (status === 'ACTIVE') return 'bg-emerald-50 text-emerald-800 ring-emerald-200'
  if (status === 'EXPIRED') return 'bg-amber-50 text-amber-900 ring-amber-200'
  return 'bg-slate-100 text-slate-700 ring-slate-200'
}

export function HesabimUyeliklerPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [rows, setRows] = useState<CustomerSaasMembershipRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [renewTarget, setRenewTarget] = useState<CustomerSaasMembershipRow | null>(null)
  const [successBanner, setSuccessBanner] = useState<string | null>(null)

  const loadRows = () => {
    setLoading(true)
    setError(null)
    return customersApi
      .listSaasMemberships()
      .then(setRows)
      .catch((e) => setError(e instanceof Error ? e.message : 'Yüklenemedi'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    void loadRows()
  }, [])

  useEffect(() => {
    if (searchParams.get('renewSuccess') === '1') {
      setSuccessBanner('Üyeliğiniz başarıyla uzatıldı. Güncel bitiş tarihi aşağıda görüntülenir.')
      searchParams.delete('renewSuccess')
      setSearchParams(searchParams, { replace: true })
    }
  }, [searchParams, setSearchParams])

  function handleRenewOrderCreated(orderNo: string) {
    setRenewTarget(null)
    sessionStorage.setItem('woontegra_saas_renew_order', orderNo)
    const email = rows[0]?.ownerEmail
    if (email) sessionStorage.setItem('woontegra_last_order_email', email)
    navigate(`/siparis-basarili/${encodeURIComponent(orderNo)}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <Cloud className="mt-0.5 h-7 w-7 shrink-0 text-emerald-600" aria-hidden />
        <div>
          <h2 className="text-lg font-bold text-slate-900">Üyeliklerim / Lisanslarım</h2>
          <p className="mt-1 text-sm text-slate-600">
            Woontegra SaaS ürünlerinizin lisans ve abonelik bilgileri.
          </p>
        </div>
      </div>

      {successBanner ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">
          {successBanner}
        </p>
      ) : null}

      {loading ? <p className="text-sm text-slate-500">Yükleniyor…</p> : null}
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
      ) : null}

      {!loading && !error && rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-10 text-center">
          <p className="text-sm font-medium text-slate-700">Henüz SaaS üyeliğiniz bulunmuyor.</p>
          <p className="mt-2 text-sm text-slate-500">
            Müvekkil Kasa Defteri gibi SaaS ürünleri satın aldığınızda burada listelenir.
          </p>
          <Link
            to="/urunler"
            className="mt-4 inline-flex rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Ürünlere göz at
          </Link>
        </div>
      ) : null}

      {!loading && rows.length > 0 ? (
        <ul className="space-y-4">
          {rows.map((row) => (
            <li
              key={row.id}
              className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/60 p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">{row.productName}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{row.productCode}</p>
                </div>
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusClass(row.status)}`}
                >
                  {statusLabel(row.status)}
                </span>
              </div>

              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Lisans anahtarı</dt>
                  <dd className="mt-1 flex items-center gap-2 font-mono text-xs text-slate-800">
                    <KeyRound className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
                    {row.licenseKey}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Büro kodu</dt>
                  <dd className="mt-1 text-slate-800">{row.tenantSlug}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Bitiş tarihi</dt>
                  <dd className="mt-1 text-slate-800">
                    {formatDateTR(row.licenseEndDate)}
                    {row.kalanGun != null ? (
                      <span className="ml-2 text-slate-500">
                        ({row.kalanGun > 0 ? `${row.kalanGun} gün kaldı` : 'süresi doldu'})
                      </span>
                    ) : null}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Sahip e-postası</dt>
                  <dd className="mt-1 text-slate-800">{row.ownerEmail}</dd>
                </div>
              </dl>

              <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setRenewTarget(row)}
                  className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-100"
                >
                  Üyeliği Uzat
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {renewTarget ? (
        <SaasRenewModal
          membership={renewTarget}
          onClose={() => setRenewTarget(null)}
          onOrderCreated={handleRenewOrderCreated}
        />
      ) : null}
    </div>
  )
}
