import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ordersPublicApi, type OrderSuccessData } from '../api/orders-public'
import { formatMoneyAmount } from '../lib/formatMoney'

export function OrderFailPage() {
  const { orderNo } = useParams<{ orderNo?: string }>()
  const [data, setData] = useState<OrderSuccessData | null>(null)
  const [loading, setLoading] = useState(Boolean(orderNo))
  const [notFound, setNotFound] = useState(false)

  const storedEmail = () => sessionStorage.getItem('woontegra_last_order_email')?.trim() || undefined

  const load = useCallback(async () => {
    if (!orderNo) return
    const em = storedEmail() || undefined
    const d = await ordersPublicApi.getSuccess(orderNo, em)
    setData(d)
  }, [orderNo])

  useEffect(() => {
    if (!orderNo) {
      setLoading(false)
      return
    }
    let cancelled = false
    void (async () => {
      try {
        setLoading(true)
        setNotFound(false)
        await load()
      } catch {
        if (!cancelled) setNotFound(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [orderNo, load])

  if (!orderNo) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Ödeme tamamlanamadı</h1>
        <p className="mt-4 text-slate-600">
          Ödeme işlemi tamamlanmadı veya iptal edildi. Sepetinize dönüp tekrar deneyebilir veya sipariş numaranızı biliyorsanız sipariş sorgulama sayfasını kullanabilirsiniz.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/sepet" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700">
            Sepete dön
          </Link>
          <Link to="/checkout" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50">
            Tekrar ödeme dene
          </Link>
          <Link to="/iletisim" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50">
            İletişim
          </Link>
        </div>
        <Link to="/" className="mt-8 inline-block text-sm font-semibold text-accent-blue hover:underline">
          Ana sayfa
        </Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center text-slate-600">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
        <p className="mt-4 text-sm">Sipariş bilgisi yükleniyor…</p>
      </div>
    )
  }

  if (notFound || !data) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Ödeme tamamlanamadı</h1>
        <p className="mt-4 text-slate-600">Bu sipariş numarasına ait kayıt bulunamadı veya bilgiler doğrulanamadı.</p>
        <p className="mt-2 text-sm text-slate-500">Referans: {orderNo}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/sepet" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700">
            Sepete dön
          </Link>
          <Link to="/checkout" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50">
            Tekrar ödeme dene
          </Link>
          <Link to="/iletisim" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50">
            İletişim
          </Link>
        </div>
      </div>
    )
  }

  if (data.status === 'PAID' || data.status === 'PROCESSING') {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-emerald-800">Ödemeniz onaylanmış</h1>
        <p className="mt-4 text-slate-600">Bu sipariş için ödeme zaten alınmış.</p>
        <Link to={`/siparis-basarili/${encodeURIComponent(data.orderNo)}`} className="mt-8 inline-block font-semibold text-accent-blue hover:underline">
          Sipariş özeti sayfasına git
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-center sm:py-16">
      <h1 className="text-2xl font-bold text-slate-900">Ödeme tamamlanamadı</h1>
      <p className="mt-2 text-sm text-slate-500">Sipariş no: {data.orderNo}</p>
      <p className="mt-4 text-slate-600">{data.message}</p>
      {'lines' in data && data.lines.length > 0 ? (
        <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 text-left">
          <table className="w-full min-w-[280px] text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-2 font-medium">Ürün</th>
                <th className="px-4 py-2 font-medium">Adet</th>
                <th className="px-4 py-2 text-right font-medium">Tutar</th>
              </tr>
            </thead>
            <tbody>
              {data.lines.map((row, i) => (
                <tr key={i} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-2.5 font-medium text-slate-900">{row.productName}</td>
                  <td className="px-4 py-2.5 text-slate-700">{row.quantity}</td>
                  <td className="px-4 py-2.5 text-right text-slate-800">{formatMoneyAmount(row.lineTotal, data.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {'orderTotal' in data ? (
        <p className="mt-4 text-lg font-bold text-slate-900">Toplam: {formatMoneyAmount(data.orderTotal, data.currency)}</p>
      ) : null}

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link to="/sepet" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700">
          Sepete dön
        </Link>
        <Link to="/checkout" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50">
          Tekrar ödeme dene
        </Link>
        <Link to="/iletisim" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50">
          İletişim
        </Link>
      </div>
      <Link to="/" className="mt-8 inline-block text-sm font-semibold text-accent-blue hover:underline">
        Ana sayfa
      </Link>
    </div>
  )
}
