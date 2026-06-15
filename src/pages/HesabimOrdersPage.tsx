import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { customersApi } from '../api/customers-api'
import { CustomerAccountBadge } from '../components/hesabim/CustomerAccountBadge'
import {
  formatAccountDateTime,
  matchesCustomerOrderListFilter,
  type CustomerOrderListFilter,
} from '../lib/customerAccountLabels'
import {
  getCustomerPaymentMethodDisplayLabel,
  getCustomerPaymentStatusDisplayLabel,
  getFulfillmentOrderStatusBadgeLabel,
  getFulfillmentOrderStatusBadgeTone,
  getOrderFulfillmentKind,
  getPaymentStatusBadgeToneForDisplay,
} from '../lib/customerOrderFulfillment'
import { formatMoneyAmount } from '../lib/formatMoney'

type Row = {
  orderNo: string
  status: string
  total: number
  currency: string
  createdAt: string
  paymentStatus: string | null
  paymentProvider: string
  productSummary: string
  itemCount: number
  shippingTrackingNumber?: string | null
  lineProductTypes?: string[]
}

const filterTabs: { id: CustomerOrderListFilter; label: string }[] = [
  { id: 'all', label: 'Tüm siparişler' },
  { id: 'payment_pending', label: 'Ödeme bekleyenler' },
  { id: 'preparing', label: 'Hazırlananlar' },
  { id: 'shipping', label: 'Kargodakiler' },
  { id: 'delivered', label: 'Teslim edilenler' },
  { id: 'cancel_return', label: 'İptal / iade' },
]

export function HesabimOrdersPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<CustomerOrderListFilter>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    void (async () => {
      try {
        const data = (await customersApi.listOrders()) as Row[]
        setRows(data)
      } catch {
        setError('Siparişler yüklenemedi.')
      }
    })()
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toUpperCase()
    return rows.filter((o) => {
      if (q && !o.orderNo.toUpperCase().includes(q)) return false
      return matchesCustomerOrderListFilter(o, filter)
    })
  }, [rows, filter, search])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Siparişlerim</h2>
        <p className="mt-1 text-sm text-slate-600">Siparişlerinizi takip edin; ödeme ve teslimat durumlarını buradan görüntüleyin.</p>
      </div>

      {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 shadow-inner">
          <Search className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
          <input
            type="search"
            placeholder="Sipariş numarası ile ara…"
            className="min-w-0 flex-1 border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Sipariş numarası ile ara"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {filterTabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setFilter(t.id)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition sm:text-sm ${
              filter === t.id
                ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 && !error ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-14 text-center">
          <p className="text-base font-semibold text-slate-900">
            {rows.length === 0 ? 'Henüz siparişiniz bulunmuyor.' : 'Bu filtreye uyan sipariş yok.'}
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
            {rows.length === 0 ? 'İhtiyacınıza uygun ürünleri inceleyerek güvenle sipariş verebilirsiniz.' : 'Farklı bir filtre seçin veya aramayı temizleyin.'}
          </p>
          {rows.length === 0 ? (
            <Link
              to="/urunler"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Alışverişe başla
            </Link>
          ) : null}
        </div>
      ) : (
        <ul className="space-y-4">
          {filtered.map((o) => {
            const kind = getOrderFulfillmentKind(o.lineProductTypes ?? [])
            const detailLike = {
              status: o.status,
              paymentStatus: o.paymentStatus,
              paymentProvider: o.paymentProvider,
              items: [] as { downloadUrl: string | null }[],
            }
            const ordLabel = getFulfillmentOrderStatusBadgeLabel(detailLike, kind)
            const ordTone = getFulfillmentOrderStatusBadgeTone(detailLike)
            const payLabel = getCustomerPaymentStatusDisplayLabel(o.paymentStatus, {
              orderStatus: o.status,
              paymentProvider: o.paymentProvider,
            })
            const payTone = getPaymentStatusBadgeToneForDisplay(o.paymentStatus, o.status)
            const methodLabel = getCustomerPaymentMethodDisplayLabel(o.paymentProvider, undefined)
            return (
              <li
                key={o.orderNo}
                className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md sm:p-6"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-bold text-slate-900">{o.orderNo}</span>
                      <CustomerAccountBadge label={ordLabel} tone={ordTone} />
                      <CustomerAccountBadge label={payLabel} tone={payTone} />
                    </div>
                    <p className="text-xs text-slate-500 sm:text-sm">{formatAccountDateTime(o.createdAt)}</p>
                    <p className="text-sm text-slate-700">
                      <span className="font-medium text-slate-800">Ödeme yöntemi:</span> {methodLabel}
                    </p>
                    <p className="text-sm leading-relaxed text-slate-600">
                      <span className="font-medium text-slate-800">Ürünler:</span> {o.productSummary}
                      {o.itemCount > 1 ? <span className="text-slate-400"> ({o.itemCount} kalem)</span> : null}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-stretch gap-3 border-t border-slate-100 pt-4 lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0">
                    <p className="text-lg font-bold text-slate-900 lg:text-right">{formatMoneyAmount(o.total, o.currency)}</p>
                    <Link
                      to={`/hesabim/siparisler/${encodeURIComponent(o.orderNo)}`}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-center text-sm font-bold text-slate-900 transition hover:bg-white"
                    >
                      Sipariş detayı
                    </Link>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
