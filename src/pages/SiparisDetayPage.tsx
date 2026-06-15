import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
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

export function SiparisDetayPage() {
  const { orderNo: orderNoParam } = useParams<{ orderNo: string }>()
  const orderNo = orderNoParam ? decodeURIComponent(orderNoParam) : ''
  const [email, setEmail] = useState('')
  const [data, setData] = useState<unknown>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const load = async () => {
    if (!orderNo || !email.trim()) return
    setLoading(true)
    setError(null)
    try {
      const d = await ordersPublicApi.lookup(orderNo, email.trim())
      setData(d)
    } catch {
      setData(null)
      setError('Sipariş bulunamadı veya e-posta eşleşmedi.')
    } finally {
      setLoading(false)
    }
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
    customerName: string
    customerEmail: string
    items: { productName: string; quantity: number; unitPrice: number; total: number; downloadUrl: string | null }[]
  } | null

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-14">
      <Link to="/siparis-sorgula" className="text-sm font-semibold text-emerald-700 hover:underline">
        ← Misafir sipariş sorgula
      </Link>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">Sipariş detayı</h1>
      <p className="mt-1 font-mono text-sm text-slate-600">{orderNo || '—'}</p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Doğrulama</h2>
        <p className="mt-1 text-sm text-slate-600">Siparişte kullandığınız e-posta adresini girin.</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2.5 text-sm shadow-sm outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-posta"
          />
          <button
            type="button"
            onClick={() => void load()}
            className="shrink-0 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
          >
            Göster
          </button>
        </div>
      </div>

      {loading && <p className="mt-6 text-slate-600">Yükleniyor…</p>}
      {error && <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}

      {row && (
        <div className="mt-8 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Sipariş tarihi</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{formatAccountDateTime(row.createdAt)}</p>
                <p className="mt-4 text-xs font-semibold uppercase text-slate-500">Müşteri</p>
                <p className="mt-1 text-sm text-slate-800">{row.customerName}</p>
                <p className="text-sm text-slate-600">{row.customerEmail}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase text-slate-500">Toplam</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{formatMoneyAmount(row.total, row.currency)}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <CustomerAccountBadge label={customerOrderStatusLabel(row.status)} tone={customerOrderStatusBadgeTone(row.status)} />
              <CustomerAccountBadge
                label={customerPaymentStatusLabel(row.paymentStatus)}
                tone={customerPaymentStatusBadgeTone(row.paymentStatus)}
              />
            </div>
            <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase text-slate-500">Ödeme yöntemi</dt>
                <dd className="mt-1 font-medium text-slate-900">{customerPaymentMethodLabel(row.paymentProvider)}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase text-slate-500">Ödeme durumu</dt>
                <dd className="mt-1 font-medium text-slate-900">{customerPaymentStatusLabel(row.paymentStatus)}</dd>
              </div>
              {row.paidAt ? (
                <div className="sm:col-span-2">
                  <dt className="text-xs font-semibold uppercase text-slate-500">Ödeme tarihi</dt>
                  <dd className="mt-1 font-medium text-slate-900">{formatAccountDateTime(row.paidAt)}</dd>
                </div>
              ) : null}
            </dl>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <h3 className="border-b border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900">Ürünler</h3>
            <table className="w-full min-w-[280px] text-left text-sm">
              <thead className="text-xs font-bold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-2">Ürün</th>
                  <th className="px-4 py-2 text-center">Adet</th>
                  <th className="hidden px-4 py-2 text-right sm:table-cell">Birim</th>
                  <th className="px-4 py-2 text-right">Ara toplam</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {row.items.map((it, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{it.productName}</p>
                      {row.status === 'PAID' || row.status === 'PROCESSING' ? (
                        !it.downloadUrl ? (
                          <p className="mt-1 text-xs text-slate-500">—</p>
                        ) : isSaasOrderDeliveryUrl(it.downloadUrl) ? (
                          <p className="mt-1 text-xs text-slate-600">Kullanım bilgileri e-posta ile</p>
                        ) : (
                          <a href={it.downloadUrl} className="mt-2 inline-flex rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700">
                            İndir
                          </a>
                        )
                      ) : row.status === 'PENDING' ? (
                        <p className="mt-1 text-xs text-amber-900">Ödeme tamamlanınca indirme açılır.</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-center font-medium">{it.quantity}</td>
                    <td className="hidden px-4 py-3 text-right text-slate-600 sm:table-cell">{formatMoneyAmount(it.unitPrice, row.currency)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-900">{formatMoneyAmount(it.total, row.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
