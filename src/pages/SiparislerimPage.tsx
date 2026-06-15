import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PackageSearch } from 'lucide-react'
import { ordersPublicApi } from '../api/orders-public'
import { CustomerAccountBadge } from '../components/hesabim/CustomerAccountBadge'
import {
  customerOrderStatusBadgeTone,
  customerOrderStatusLabel,
  customerPaymentMethodLabel,
  customerPaymentStatusBadgeTone,
  customerPaymentStatusLabel,
  formatAccountDateTime,
} from '../lib/customerAccountLabels'
import { isSaasOrderDeliveryUrl } from '../lib/orderDeliveryUrl'
import { formatMoneyAmount } from '../lib/formatMoney'

export function SiparislerimPage() {
  const [params] = useSearchParams()
  const orderNoQ = params.get('orderNo')?.trim() ?? ''
  const emailQ = params.get('customerEmail')?.trim() ?? ''
  const [orderNo, setOrderNo] = useState(orderNoQ)
  const [email, setEmail] = useState(emailQ)
  const [data, setData] = useState<unknown>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const runLookup = async (o: string, em: string) => {
    if (!o || !em) return
    setLoading(true)
    setError(null)
    try {
      const d = await ordersPublicApi.lookup(o, em)
      setData(d)
    } catch {
      setData(null)
      setError('Sipariş bulunamadı veya e-posta eşleşmedi.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (orderNoQ && emailQ) {
      setOrderNo(orderNoQ)
      setEmail(emailQ)
      void runLookup(orderNoQ, emailQ)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNoQ, emailQ])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void runLookup(orderNo.trim(), email.trim())
  }

  const row = data as {
    orderNo: string
    status: string
    total: number
    currency: string
    createdAt: string
    paidAt: string | null
    paymentStatus: string | null
    paymentProvider: string
    items: { productName: string; quantity: number; downloadUrl: string | null }[]
  } | null

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-14">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
            <PackageSearch className="h-6 w-6" aria-hidden />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Misafir sipariş sorgulama</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Üye olmadan verdiğiniz siparişi sipariş numarası ve siparişte kullandığınız e-posta adresi ile görüntüleyin.
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="guest-email" className="text-sm font-medium text-slate-700">
              E-posta
            </label>
            <input
              id="guest-email"
              type="email"
              required
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm shadow-sm outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
              placeholder="siparis@ornek.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="guest-orderno" className="text-sm font-medium text-slate-700">
              Sipariş numarası
            </label>
            <input
              id="guest-orderno"
              required
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-mono text-sm shadow-sm outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
              placeholder="WNT-…"
              value={orderNo}
              onChange={(e) => setOrderNo(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700">
            Sorgula
          </button>
        </form>
      </div>

      {loading && <p className="mt-8 text-center text-slate-600">Yükleniyor…</p>}
      {error && <p className="mt-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-800">{error}</p>}

      {row && (
        <div className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <p className="font-mono text-sm font-bold text-slate-900">{row.orderNo}</p>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">Sipariş tarihi: {formatAccountDateTime(row.createdAt)}</p>
            </div>
            <p className="text-lg font-bold text-slate-900">{formatMoneyAmount(row.total, row.currency)}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <CustomerAccountBadge label={customerOrderStatusLabel(row.status)} tone={customerOrderStatusBadgeTone(row.status)} />
            <CustomerAccountBadge
              label={customerPaymentStatusLabel(row.paymentStatus)}
              tone={customerPaymentStatusBadgeTone(row.paymentStatus)}
            />
          </div>
          <p className="text-sm text-slate-700">
            <span className="font-semibold text-slate-800">Ödeme yöntemi:</span> {customerPaymentMethodLabel(row.paymentProvider)}
          </p>
          {row.paidAt ? <p className="text-sm text-slate-600">Ödeme tarihi: {formatAccountDateTime(row.paidAt)}</p> : null}

          <ul className="divide-y divide-slate-100 rounded-xl border border-slate-100">
            {row.items.map((it, i) => (
              <li key={i} className="flex flex-wrap items-center justify-between gap-3 px-3 py-3 sm:px-4">
                <div>
                  <p className="font-medium text-slate-900">{it.productName}</p>
                  <p className="text-sm text-slate-600">Adet: {it.quantity}</p>
                </div>
                {row.status === 'PAID' || row.status === 'PROCESSING' ? (
                  !it.downloadUrl ? (
                    <span className="text-sm text-slate-500">—</span>
                  ) : isSaasOrderDeliveryUrl(it.downloadUrl) ? (
                    <span className="text-sm font-medium text-slate-600">Kullanım hesabı (e-posta)</span>
                  ) : (
                    <a href={it.downloadUrl} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-bold text-white hover:bg-emerald-700">
                      İndir
                    </a>
                  )
                ) : row.status === 'PENDING' ? (
                  <span className="text-sm font-medium text-amber-900">Ödeme tamamlanınca indirme açılır.</span>
                ) : (
                  <span className="text-sm text-slate-500">—</span>
                )}
              </li>
            ))}
          </ul>

          <Link to={`/siparis/${encodeURIComponent(row.orderNo)}`} className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm font-bold text-slate-900 hover:bg-white">
            Detaylı görünüm
          </Link>
        </div>
      )}

      <p className="mt-10 text-center text-sm text-slate-600">
        <Link to="/giris" className="font-semibold text-emerald-700 hover:underline">
          Üye girişi
        </Link>
        <span className="mx-2 text-slate-300">·</span>
        <Link to="/hesabim" className="font-semibold text-emerald-700 hover:underline">
          Hesabım
        </Link>
      </p>
    </div>
  )
}
