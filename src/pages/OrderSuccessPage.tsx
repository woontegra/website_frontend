import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ordersPublicApi, type OrderSuccessData, type OrderSuccessPaid } from '../api/orders-public'
import { BankTransferPaymentPanel } from '../components/payment/BankTransferPaymentPanel'
import { isSaasOrderDeliveryUrl } from '../lib/orderDeliveryUrl'
import { formatMoneyAmount } from '../lib/formatMoney'

const POLL_MS = 2000
const MAX_POLLS = 15

function isPaidOrProcessing(d: OrderSuccessData): d is OrderSuccessPaid {
  return d.status === 'PAID' || d.status === 'PROCESSING'
}

function OrderLinesTable({
  lines,
  currency,
  downloads,
}: {
  lines: { productName: string; quantity: number; lineTotal: number }[]
  currency: string
  downloads?: (string | null | undefined)[]
}) {
  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 text-left">
      <table className="w-full min-w-[280px] text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-2 font-medium">Ürün</th>
            <th className="px-4 py-2 font-medium">Adet</th>
            <th className="px-4 py-2 text-right font-medium">Tutar</th>
            {downloads ? <th className="px-4 py-2 text-right font-medium">İndir</th> : null}
          </tr>
        </thead>
        <tbody>
          {lines.map((row, i) => (
            <tr key={i} className="border-b border-slate-100 last:border-0">
              <td className="px-4 py-2.5 font-medium text-slate-900">{row.productName}</td>
              <td className="px-4 py-2.5 text-slate-700">{row.quantity}</td>
              <td className="px-4 py-2.5 text-right text-slate-800">{formatMoneyAmount(row.lineTotal, currency)}</td>
              {downloads ? (
                <td className="px-4 py-2.5 text-right">
                  {(() => {
                    const url = downloads[i]
                    if (!url) return <span className="text-slate-400">—</span>
                    if (isSaasOrderDeliveryUrl(url)) {
                      return (
                        <span className="max-w-[10rem] text-xs font-medium leading-snug text-slate-600 sm:max-w-none">
                          Kullanım hesabı bilgileri e-posta ile
                        </span>
                      )
                    }
                    return (
                      <a
                        href={url}
                        className="inline-flex rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                      >
                        İndir
                      </a>
                    )
                  })()}
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function FooterLinks() {
  return (
    <div className="mt-10 flex flex-wrap justify-center gap-3 text-sm">
      <Link to="/hesabim/siparisler" className="rounded-lg border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-slate-50">
        Hesabım — Siparişlerim
      </Link>
      <Link to="/" className="rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800">
        Ana sayfaya dön
      </Link>
    </div>
  )
}

export function OrderSuccessPage() {
  const { orderNo } = useParams<{ orderNo?: string }>()
  const [data, setData] = useState<OrderSuccessData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [rateMessage, setRateMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [pollExhausted, setPollExhausted] = useState(false)
  const [polling, setPolling] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [emailToken, setEmailToken] = useState(0)

  const storedEmail = () => sessionStorage.getItem('woontegra_last_order_email')?.trim() || undefined

  const fetchOrder = useCallback(async (): Promise<OrderSuccessData | null> => {
    if (!orderNo) return null
    const em = storedEmail() || undefined
    return ordersPublicApi.getSuccess(orderNo, em)
  }, [orderNo, emailToken])

  useEffect(() => {
    if (!orderNo) {
      setLoading(false)
      setData(null)
      return
    }
    let cancelled = false
    let pollTimer: number | null = null
    let pollsAfterPending = 0

    const clearTimer = () => {
      if (pollTimer !== null) {
        window.clearInterval(pollTimer)
        pollTimer = null
      }
    }

    const loadOnce = async (depth = 0): Promise<OrderSuccessData | null> => {
      try {
        const d = await fetchOrder()
        if (cancelled) return null
        setRateMessage(null)
        setError(null)
        setData(d)
        setLoading(false)
        return d
      } catch (e) {
        if (cancelled) return null
        if (axios.isAxiosError(e) && e.response?.status === 429 && depth < 5) {
          setRateMessage('Sunucu çok sık istek aldı, birkaç saniye sonra tekrar kontrol ediliyor.')
          await new Promise((r) => window.setTimeout(r, 3000 + depth * 400))
          if (cancelled) return null
          return loadOnce(depth + 1)
        }
        if (axios.isAxiosError(e) && e.response?.status === 404) {
          setError('Sipariş bulunamadı.')
        } else {
          setError('Sipariş bilgisi alınamadı.')
        }
        setRateMessage(null)
        setLoading(false)
        return null
      }
    }

    void (async () => {
      const initial = await loadOnce()
      if (cancelled || !initial || initial.status !== 'PENDING') {
        setPolling(false)
        setPollExhausted(false)
        return
      }
      setPolling(true)
      setPollExhausted(false)
      pollTimer = window.setInterval(() => {
        void (async () => {
          pollsAfterPending += 1
          const next = await loadOnce()
          if (cancelled) return
          if (next && next.status !== 'PENDING') {
            clearTimer()
            setPolling(false)
            return
          }
          if (pollsAfterPending >= MAX_POLLS) {
            setPollExhausted(true)
            clearTimer()
            setPolling(false)
          }
        })()
      }, POLL_MS)
    })()

    return () => {
      cancelled = true
      clearTimer()
    }
  }, [orderNo, emailToken, fetchOrder])

  const applyEmail = () => {
    const t = emailInput.trim()
    if (t) sessionStorage.setItem('woontegra_last_order_email', t.toLowerCase())
    setEmailToken((k) => k + 1)
  }

  if (!orderNo) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-slate-900">Sipariş numarası gerekli</h1>
        <p className="mt-4 text-slate-600">Başarılı ödeme sayfası için URL içinde sipariş numarası bulunmalıdır.</p>
        <Link to="/siparis-sorgula" className="mt-8 inline-block font-semibold text-accent-blue hover:underline">
          Sipariş sorgula
        </Link>
        <FooterLinks />
      </div>
    )
  }

  if (loading && !data) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center text-slate-600">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
        <p className="mt-4 text-sm">Sipariş durumu kontrol ediliyor…</p>
        {rateMessage ? <p className="mt-3 text-sm text-amber-800">{rateMessage}</p> : null}
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-red-800">{error ?? 'Sipariş bulunamadı.'}</p>
        <FooterLinks />
      </div>
    )
  }

  if (data.status === 'PENDING') {
    const bankInfo = data.paymentProvider === 'BANK_TRANSFER' && 'bankTransferInfo' in data ? data.bankTransferInfo : null
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center sm:py-16">
        <h1 className="text-2xl font-bold text-slate-900">Siparişiniz alındı</h1>
        <p className="mt-2 text-sm text-slate-500">Sipariş no: {data.orderNo}</p>
        <p className="mt-4 text-base font-medium text-amber-800">{data.paymentStatusLabel}</p>
        <p className="mt-2 text-sm text-slate-600">{data.message}</p>
        <OrderLinesTable lines={data.lines} currency={data.currency} />
        <p className="mt-4 text-lg font-bold text-slate-900">Toplam: {formatMoneyAmount(data.orderTotal, data.currency)}</p>
        {bankInfo ? <BankTransferPaymentPanel variant="success" info={bankInfo} /> : null}
        {data.paymentProvider === 'BANK_TRANSFER' && !bankInfo ? (
          <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            Banka bilgileri şu an yüklenemedi. Lütfen sipariş onay e-postanızı kontrol edin veya destek ile iletişime geçin.
          </p>
        ) : null}
        {polling && !pollExhausted && (
          <p className="mt-4 text-sm text-slate-500">
            {data.paymentProvider === 'BANK_TRANSFER' ? 'Ödeme onayı bekleniyor…' : 'Ödeme bildirimi bekleniyor…'}
          </p>
        )}
        {rateMessage && polling ? <p className="mt-2 text-sm text-amber-800">{rateMessage}</p> : null}
        {pollExhausted && (
          <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950">
            {data.paymentProvider === 'BANK_TRANSFER'
              ? 'Havale/EFT onayı bir süre sürebilir. Bir süre sonra bu sayfayı yenileyerek güncel durumu kontrol edebilirsiniz.'
              : 'Ödeme bildirimi henüz ulaşmadı. Birkaç dakika içinde tekrar kontrol edin.'}
          </p>
        )}
        <FooterLinks />
      </div>
    )
  }

  if (data.status === 'FAILED' || data.status === 'CANCELLED') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center sm:py-16">
        <h1 className="text-2xl font-bold text-red-900">Ödeme başarısız görünüyor</h1>
        <p className="mt-2 text-sm text-slate-500">Sipariş no: {data.orderNo}</p>
        <p className="mt-4 text-base font-medium text-slate-800">{data.paymentStatusLabel}</p>
        <p className="mt-2 text-sm text-slate-600">{data.message}</p>
        <OrderLinesTable lines={data.lines} currency={data.currency} />
        <p className="mt-4 text-lg font-bold text-slate-900">Toplam: {formatMoneyAmount(data.orderTotal, data.currency)}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/sepet" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700">
            Sepete dön
          </Link>
          <Link to="/checkout" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50">
            Tekrar ödeme dene
          </Link>
        </div>
        <FooterLinks />
      </div>
    )
  }

  if (!isPaidOrProcessing(data)) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-slate-600">Beklenmeyen durum</p>
        <FooterLinks />
      </div>
    )
  }

  const needsEmail = data.requiresEmail === true
  const downloads = data.items.map((it) => it.downloadUrl)
  const legacyUrl = (data as OrderSuccessPaid & { downloadUrl?: string }).downloadUrl

  const isProcessing = data.status === 'PROCESSING'

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-center sm:py-16">
      <h1 className="text-2xl font-bold text-slate-900">{isProcessing ? 'Ödemeniz onaylandı' : 'Siparişiniz alındı'}</h1>
      <p className="mt-2 text-sm text-slate-500">Sipariş no: {data.orderNo}</p>
      <p className="mt-4 text-base font-semibold text-emerald-800">{data.paymentStatusLabel}</p>
      {data.message ? <p className="mt-2 text-sm text-slate-600">{data.message}</p> : null}
      <p className="mt-1 text-sm text-slate-600">
        {data.customerEmail} — Ödeme: {data.paidAt ? new Date(data.paidAt).toLocaleString('tr-TR') : '—'}
      </p>
      <p className="mt-4 text-lg font-bold text-slate-900">Toplam: {formatMoneyAmount(data.orderTotal, data.currency)}</p>

      {needsEmail && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-left text-sm text-amber-950">
          <p>{data.message}</p>
          <div className="mt-3 flex gap-2">
            <input
              type="email"
              placeholder="Sipariş e-postanız"
              className="min-w-0 flex-1 rounded border border-amber-300 px-2 py-1.5"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />
            <button type="button" className="rounded bg-amber-800 px-3 py-1.5 text-white" onClick={applyEmail}>
              Doğrula
            </button>
          </div>
        </div>
      )}

      {data.lines.length > 0 ? (
        <OrderLinesTable lines={data.lines} currency={data.currency} downloads={needsEmail ? undefined : downloads} />
      ) : legacyUrl ? (
        isSaasOrderDeliveryUrl(legacyUrl) ? (
          <p className="mt-8 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            Web tabanlı programınıza giriş bilgileri e-postanıza iletilecek.
          </p>
        ) : (
          <div className="mt-8">
            <a href={legacyUrl} className="inline-flex rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700">
              İndirmeye başla
            </a>
          </div>
        )
      ) : null}

      <p className="mt-10 text-sm text-slate-500">
        Sorularınız için{' '}
        <a href="mailto:info@woontegra.com" className="font-semibold text-accent-blue underline">
          info@woontegra.com
        </a>
      </p>
      <FooterLinks />
    </div>
  )
}
