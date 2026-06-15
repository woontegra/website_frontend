import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Circle } from 'lucide-react'
import { customersApi } from '../api/customers-api'
import { CustomerAccountBadge } from '../components/hesabim/CustomerAccountBadge'
import { formatAccountDateTime, normalizeCustomerToken } from '../lib/customerAccountLabels'
import {
  buildCustomerOrderSteps,
  getCustomerOrderLineDeliveryUi,
  getCustomerPaymentMethodDisplayLabel,
  getCustomerPaymentStatusDisplayLabel,
  getFulfillmentOrderHeaderBadgeTone,
  getFulfillmentOrderStatusBadgeLabel,
  getOrderFulfillmentKind,
  getPaymentStatusBadgeToneForDisplay,
  getPostFulfillmentCard,
  isEmailDeliveryFulfillmentKind,
  orderPaymentIsSettled,
  type CustomerOrderStep,
  type LineDeliveryUi,
} from '../lib/customerOrderFulfillment'
import { formatMoneyAmount } from '../lib/formatMoney'
import type { BankTransferInfoDto } from '../lib/bankTransferTypes'
import { BankTransferPaymentPanel } from '../components/payment/BankTransferPaymentPanel'

type Item = {
  productName: string
  productSlug: string | null
  productType: string | null
  quantity: number
  unitPrice: number
  total: number
  downloadUrl: string | null
}

type OrderDetail = {
  orderNo: string
  status: string
  total: number
  subtotal?: number
  currency: string
  customerName: string
  customerEmail: string
  customerPhone: string | null
  billingType: string | null
  companyName: string | null
  taxOffice: string | null
  taxNumber: string | null
  paidAt: string | null
  createdAt: string
  paymentStatus: string | null
  paymentProvider: string
  paymentMethod?: string | null
  paymentConfirmedAt: string | null
  bankTransferPaymentDate: string | null
  bankTransferInfo?: BankTransferInfoDto | null
  shippingCarrier: string | null
  shippingTrackingNumber: string | null
  shippingStatus: string | null
  items: Item[]
  licenseCodesMasked?: string[]
}

function isHttpUrl(s: string | null | undefined): boolean {
  if (!s?.trim()) return false
  try {
    const u = new URL(s.trim())
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

function billingTypeTr(t: string | null): string {
  const k = normalizeCustomerToken(t)
  if (k === 'CORPORATE' || k === 'KURUMSAL') return 'Kurumsal fatura'
  if (k === 'INDIVIDUAL' || k === 'BIREYSEL' || k === 'PERSONAL') return 'Bireysel fatura'
  return t?.trim() ? 'Fatura bilgisi' : '—'
}

function OrderStepper({ steps }: { steps: CustomerOrderStep[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5">
      <h3 className="text-sm font-bold text-slate-900">Sipariş takibi</h3>
      <ol className="mt-4 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-2">
        {steps.map((step, idx) => (
          <li key={step.key} className="relative flex flex-1 gap-3 sm:flex-col sm:items-center sm:text-center">
            {idx < steps.length - 1 ? (
              <span
                className="absolute left-[11px] top-7 hidden h-[calc(100%-1.5rem)] w-px bg-slate-200 sm:left-1/2 sm:top-5 sm:block sm:h-px sm:w-full sm:max-w-[80%] sm:translate-x-4 sm:translate-y-2.5"
                aria-hidden
              />
            ) : null}
            <div className="relative z-[1] flex shrink-0 sm:justify-center">
              {step.done ? (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                </span>
              ) : step.active ? (
                <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-amber-400 bg-white shadow-sm">
                  <Circle className="h-2.5 w-2.5 fill-amber-400 text-amber-400" aria-hidden />
                </span>
              ) : (
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-300">
                  <Circle className="h-2 w-2" aria-hidden />
                </span>
              )}
            </div>
            <div className="min-w-0 sm:px-1">
              <p className={`text-sm font-semibold ${step.done || step.active ? 'text-slate-900' : 'text-slate-400'}`}>{step.title}</p>
              {step.hint && step.active ? <p className="mt-1 text-xs leading-relaxed text-amber-900">{step.hint}</p> : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

function LineDeliveryBlock({ ui }: { ui: LineDeliveryUi }) {
  if (ui.type === 'none') return null
  if (ui.type === 'info') {
    return <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-700">{ui.message}</p>
  }
  if (ui.type === 'download') {
    return (
      <a
        href={ui.href}
        className="mt-2 inline-flex rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
        target="_blank"
        rel="noopener noreferrer"
      >
        Ürünü indir
      </a>
    )
  }
  if (ui.type === 'panel') {
    return (
      <Link
        to={`/urun/${encodeURIComponent(ui.slug)}`}
        className="mt-2 inline-flex rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-sky-700"
      >
        Hesabıma git
      </Link>
    )
  }
  return (
    <a
      href={ui.href}
      className="mt-2 inline-flex rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-800"
      target="_blank"
      rel="noopener noreferrer"
    >
      İndirme / lisans bilgisi
    </a>
  )
}

export function HesabimCustomerOrderPage() {
  const { orderNo: raw } = useParams<{ orderNo: string }>()
  const orderNo = raw ? decodeURIComponent(raw) : ''
  const [data, setData] = useState<OrderDetail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderNo) {
      setLoading(false)
      return
    }
    let cancelled = false
    void (async () => {
      try {
        setLoading(true)
        const d = (await customersApi.getOrder(orderNo)) as OrderDetail
        if (!cancelled) {
          setData(d)
          setError(null)
        }
      } catch {
        if (!cancelled) {
          setData(null)
          setError('Sipariş bulunamadı.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [orderNo])

  const paymentDateLabel = useMemo(() => {
    if (!data) return null
    const iso = data.paidAt || data.paymentConfirmedAt || data.bankTransferPaymentDate
    return iso ? formatAccountDateTime(iso) : null
  }, [data])

  const fulfillmentKind = useMemo(() => {
    if (!data) return getOrderFulfillmentKind([])
    return getOrderFulfillmentKind(data.items.map((i) => i.productType))
  }, [data])

  const steps = useMemo(() => {
    if (!data) return []
    return buildCustomerOrderSteps(fulfillmentKind, data)
  }, [data, fulfillmentKind])

  if (loading) {
    return <p className="text-slate-600">Yükleniyor…</p>
  }

  if (error || !data) {
    return (
      <div className="space-y-4">
        <p className="text-red-800">{error ?? 'Bulunamadı'}</p>
        <Link to="/hesabim/siparisler" className="inline-flex text-sm font-semibold text-emerald-700 hover:underline">
          Siparişlerime dön
        </Link>
      </div>
    )
  }

  const d = data
  const ps = normalizeCustomerToken(d.paymentStatus)
  const st = normalizeCustomerToken(d.status)
  const isBank = normalizeCustomerToken(d.paymentProvider) === 'BANK_TRANSFER'
  const paymentOk = orderPaymentIsSettled(d.paymentStatus, d.status)
  const showCancel =
    fulfillmentKind === 'physical' &&
    st === 'PENDING' &&
    (ps === 'PENDING' || ps === 'WAITING_BANK_TRANSFER' || ps === 'FAILED' || ps === '')
  const showReturn = fulfillmentKind === 'physical' && st === 'PAID'
  const trackingUrl = isHttpUrl(d.shippingStatus) ? d.shippingStatus!.trim() : null

  const contactHref = `/iletisim?siparis=${encodeURIComponent(d.orderNo)}`

  const postCard = fulfillmentKind === 'saas' ? getPostFulfillmentCard(d, fulfillmentKind) : null
  const orderBadgeLabel = getFulfillmentOrderStatusBadgeLabel(d, fulfillmentKind)
  const orderBadgeTone = getFulfillmentOrderHeaderBadgeTone(d, fulfillmentKind)
  const payLabel = getCustomerPaymentStatusDisplayLabel(d.paymentStatus, {
    orderStatus: d.status,
    paymentProvider: d.paymentProvider,
  })
  const payTone = getPaymentStatusBadgeToneForDisplay(d.paymentStatus, d.status)
  const methodLabel = getCustomerPaymentMethodDisplayLabel(d.paymentProvider, d.paymentMethod)

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            to="/hesabim/siparisler"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Siparişlerime dön
          </Link>
          <h2 className="mt-4 font-mono text-lg font-bold text-slate-900 sm:text-xl">{d.orderNo}</h2>
          <p className="mt-1 text-sm text-slate-600">{formatAccountDateTime(d.createdAt)}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <CustomerAccountBadge label={orderBadgeLabel} tone={orderBadgeTone} />
            <CustomerAccountBadge label={payLabel} tone={payTone} />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-5 py-4 text-right shadow-inner">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Toplam</p>
          <p className="text-2xl font-bold text-slate-900">{formatMoneyAmount(d.total, d.currency)}</p>
        </div>
      </div>

      <OrderStepper steps={steps} />

      <section className="space-y-3">
        <h3 className="text-base font-bold text-slate-900">Ürünler</h3>
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full min-w-[280px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Ürün</th>
                <th className="px-4 py-3 text-center">Adet</th>
                <th className="hidden px-4 py-3 text-right sm:table-cell">Birim fiyat</th>
                <th className="px-4 py-3 text-right">Ara toplam</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {d.items.map((it, i) => {
                const lineUi = getCustomerOrderLineDeliveryUi(it, { paymentOk, orderStatus: d.status })
                return (
                  <tr key={i}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{it.productName}</p>
                      <LineDeliveryBlock ui={lineUi} />
                      {it.productSlug ? (
                        <Link to={`/urun/${it.productSlug}`} className="mt-1 inline-block text-xs font-semibold text-emerald-700 hover:underline">
                          Ürünü incele
                        </Link>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-center font-medium text-slate-800">{it.quantity}</td>
                    <td className="hidden px-4 py-3 text-right text-slate-600 sm:table-cell">{formatMoneyAmount(it.unitPrice, d.currency)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-900">{formatMoneyAmount(it.total, d.currency)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="text-base font-bold text-slate-900">Ödeme bilgileri</h3>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ödeme yöntemi</dt>
            <dd className="mt-1 font-medium text-slate-900">{methodLabel}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ödeme durumu</dt>
            <dd className="mt-1 font-medium text-slate-900">{payLabel}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ödeme tarihi</dt>
            <dd className="mt-1 font-medium text-slate-900">{paymentDateLabel ?? '—'}</dd>
          </div>
        </dl>
        {isBank && paymentOk ? (
          <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-relaxed text-emerald-950">
            Ödemeniz alındı. Teslimat bilgileriniz e-posta adresinize gönderildi.
          </p>
        ) : null}
        {isBank && !paymentOk && d.bankTransferInfo ? (
          <BankTransferPaymentPanel variant="account" info={d.bankTransferInfo} supportHref={contactHref} />
        ) : null}
        {isBank && !paymentOk && !d.bankTransferInfo ? (
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950">
            Ödemeniz tarafımıza ulaştığında siparişiniz hazırlanacaktır. Havale/EFT açıklamasına sipariş numaranızı yazmayı unutmayın.
          </p>
        ) : null}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="text-base font-bold text-slate-900">Teslimat ve fatura</h3>
        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500">Teslimat / iletişim</h4>
            <ul className="mt-2 space-y-1 text-sm text-slate-800">
              <li>{d.customerName}</li>
              <li>{d.customerEmail}</li>
              {d.customerPhone ? <li>{d.customerPhone}</li> : null}
            </ul>
            {fulfillmentKind !== 'physical' ? (
              <p className="mt-3 text-xs leading-relaxed text-slate-600">
                {isEmailDeliveryFulfillmentKind(fulfillmentKind)
                  ? 'İndirme ve lisans bilgileri ödeme sonrasında kayıtlı e-posta adresinize gönderilir.'
                  : 'Dijital ürünlerde teslimat e-posta, indirme bağlantısı veya ürün sayfanızdaki erişim bilgileri ile yapılır.'}
              </p>
            ) : null}
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500">Fatura</h4>
            <ul className="mt-2 space-y-1 text-sm text-slate-800">
              <li>{billingTypeTr(d.billingType)}</li>
              {d.companyName ? <li>{d.companyName}</li> : null}
              {d.taxOffice ? (
                <li>
                  VD: {d.taxOffice}
                  {d.taxNumber ? ` · VN: ${d.taxNumber}` : ''}
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </section>

      {fulfillmentKind === 'physical' ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="text-base font-bold text-slate-900">Kargo bilgileri</h3>
          {d.shippingCarrier || d.shippingTrackingNumber || trackingUrl ? (
            <dl className="mt-4 space-y-3 text-sm">
              {d.shippingCarrier ? (
                <div>
                  <dt className="text-xs font-semibold uppercase text-slate-500">Kargo firması</dt>
                  <dd className="mt-1 font-medium text-slate-900">{d.shippingCarrier}</dd>
                </div>
              ) : null}
              {d.shippingTrackingNumber ? (
                <div>
                  <dt className="text-xs font-semibold uppercase text-slate-500">Takip numarası</dt>
                  <dd className="mt-1 font-mono text-sm font-medium text-slate-900">{d.shippingTrackingNumber}</dd>
                </div>
              ) : null}
              {trackingUrl ? (
                <a
                  href={trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
                >
                  Kargoyu takip et
                </a>
              ) : null}
            </dl>
          ) : (
            <p className="mt-3 text-sm text-slate-700">Kargo bilgisi henüz oluşturulmadı.</p>
          )}
        </section>
      ) : isEmailDeliveryFulfillmentKind(fulfillmentKind) ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="text-base font-bold text-slate-900">Lisans ve indirme</h3>
          {paymentOk ? (
            <>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                İndirme bağlantınız ve lisans kodunuz e-posta adresinize gönderildi.
              </p>
              {d.licenseCodesMasked && d.licenseCodesMasked.length > 0 ? (
                <ul className="mt-3 space-y-1 text-sm text-slate-800">
                  {d.licenseCodesMasked.map((code) => (
                    <li key={code}>
                      Lisans kodunuz: <span className="font-mono font-semibold tracking-tight">{code}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              <p className="mt-3 text-xs leading-relaxed text-slate-600">
                E-postayı bulamıyorsanız spam/gereksiz klasörünü kontrol edin veya destek ile iletişime geçin.
              </p>
            </>
          ) : (
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              Ödemeniz tamamlandığında indirme bağlantınız e-posta adresinize gönderilecektir.
            </p>
          )}
          <Link
            to={contactHref}
            className="mt-4 inline-flex rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-slate-800"
          >
            Siparişimle ilgili destek al
          </Link>
        </section>
      ) : postCard ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="text-base font-bold text-slate-900">{postCard.title}</h3>
          {'body' in postCard ? (
            <>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">{postCard.body}</p>
              {postCard.variant === 'saas' && postCard.panelSlug ? (
                <Link
                  to={`/urun/${encodeURIComponent(postCard.panelSlug)}`}
                  className="mt-4 inline-flex rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-sky-700"
                >
                  Ürün / panel sayfasına git
                </Link>
              ) : null}
            </>
          ) : null}
        </section>
      ) : null}

      {fulfillmentKind === 'physical' && (showCancel || showReturn) ? (
        <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
          <h3 className="text-base font-bold text-slate-900">İptal veya iade</h3>
          <p className="mt-2 text-sm text-slate-600">Talebiniz için müşteri temsilcilerimiz sipariş numaranızla size yardımcı olur.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {showCancel ? (
              <Link
                to={contactHref}
                className="inline-flex rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-900 shadow-sm hover:bg-slate-50"
              >
                İptal talebi oluştur
              </Link>
            ) : null}
            {showReturn ? (
              <Link
                to={contactHref}
                className="inline-flex rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-900 shadow-sm hover:bg-slate-50"
              >
                İade talebi oluştur
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}

      {fulfillmentKind === 'saas' ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="text-base font-bold text-slate-900">Destek</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Siparişiniz, teslimat veya faturalandırma ile ilgili sorularınız için destek ekibimize yazabilirsiniz.
          </p>
          <Link
            to={contactHref}
            className="mt-4 inline-flex rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-slate-800"
          >
            Siparişimle ilgili destek al
          </Link>
        </section>
      ) : null}
    </div>
  )
}
