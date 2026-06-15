import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ordersAdminApi, type AdminOrderListParams, type AdminOrderListRow } from '../../api/orders-admin'
import { AdminBankTransferConfirmModal } from '../../components/admin/AdminBankTransferConfirmModal'
import {
  OrderStatusBadge,
  PaymentMethodBadge,
  PaymentStatusBadge,
  showHavaleConfirmPaymentButton,
} from '../../components/admin/AdminOrderBadges'
import { AdminOrderEditModal, type AdminOrderEditableSnapshot } from '../../components/admin/AdminOrderEditModal'
import { formatMoneyAmount } from '../../lib/formatMoney'

function useToast() {
  const [toast, setToast] = useState<string | null>(null)
  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 4200)
    return () => window.clearTimeout(t)
  }, [toast])
  return { toast, setToast }
}

export function AdminOrdersPage() {
  const { toast, setToast } = useToast()
  const [items, setItems] = useState<AdminOrderListRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState('')
  const [customerQuery, setCustomerQuery] = useState('')
  const [orderNo, setOrderNo] = useState('')
  const [paymentProvider, setPaymentProvider] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const [bankModalOrder, setBankModalOrder] = useState<AdminOrderListRow | null>(null)
  const [bankSubmitting, setBankSubmitting] = useState(false)
  const [editRow, setEditRow] = useState<AdminOrderListRow | null>(null)
  const [editSubmitting, setEditSubmitting] = useState(false)
  const [deleteRow, setDeleteRow] = useState<AdminOrderListRow | null>(null)
  const [deleteSubmitting, setDeleteSubmitting] = useState(false)

  const params: AdminOrderListParams = useMemo(
    () => ({
      status: status || undefined,
      customerQuery: customerQuery.trim() || undefined,
      orderNo: orderNo.trim() || undefined,
      paymentProvider: paymentProvider || undefined,
      paymentStatus: paymentStatus || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    }),
    [status, customerQuery, orderNo, paymentProvider, paymentStatus, dateFrom, dateTo],
  )

  const load = useCallback(async () => {
    setError(null)
    try {
      setLoading(true)
      const data = await ordersAdminApi.list(params)
      setItems(data)
    } catch {
      setError('Siparişler yüklenemedi.')
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (!openMenuId) return
    const fn = (ev: MouseEvent) => {
      const el = ev.target as HTMLElement | null
      if (!el) return
      if (el.closest(`[data-order-menu="${openMenuId}"]`)) return
      setOpenMenuId(null)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [openMenuId])

  const pendingBankCount = useMemo(() => items.filter((o) => showHavaleConfirmPaymentButton(o)).length, [items])

  const toEditable = (o: AdminOrderListRow): AdminOrderEditableSnapshot => ({
    id: o.id,
    status: o.status,
    paymentProvider: o.paymentProvider,
    paymentMethod: o.paymentMethod,
    paymentStatus: o.paymentStatus ?? null,
    hasPaytrTransactionRecord: o.hasPaytrTransactionRecord === true,
    paytrTransactionStatus: o.paytrTransactionStatus ?? null,
    adminNote: o.adminNote ?? null,
    shippingCarrier: o.shippingCarrier ?? null,
    shippingTrackingNumber: o.shippingTrackingNumber ?? null,
    shippingStatus: o.shippingStatus ?? null,
  })

  const applyBankFilterShortcut = () => {
    setPaymentProvider('BANK_TRANSFER')
    setPaymentStatus('PENDING_BANK')
  }

  const handleBankConfirm = async (payload: { paymentDate: string; bankNote: string; reference?: string }) => {
    if (!bankModalOrder) return
    setBankSubmitting(true)
    try {
      await ordersAdminApi.confirmBankPayment(bankModalOrder.id, payload)
      setBankModalOrder(null)
      setToast('Havale/EFT ödemesi onaylandı.')
      await load()
    } catch (e: unknown) {
      const ax = e && typeof e === 'object' && 'response' in e ? (e as { response?: { data?: { message?: string } } }).response : undefined
      setToast(ax?.data?.message || 'Onay işlemi başarısız.')
    } finally {
      setBankSubmitting(false)
    }
  }

  const handleEditSave = async (payload: {
    status: string
    paymentTransactionStatus?: string
    adminNote: string | null
    shippingCarrier: string | null
    shippingTrackingNumber: string | null
    shippingStatus: string | null
  }) => {
    if (!editRow) return
    setEditSubmitting(true)
    try {
      await ordersAdminApi.update(editRow.id, {
        status: payload.status,
        paymentTransactionStatus: payload.paymentTransactionStatus,
        adminNote: payload.adminNote,
        shippingCarrier: payload.shippingCarrier,
        shippingTrackingNumber: payload.shippingTrackingNumber,
        shippingStatus: payload.shippingStatus,
      })
      setEditRow(null)
      setToast('Sipariş güncellendi.')
      await load()
    } catch (e: unknown) {
      const ax = e && typeof e === 'object' && 'response' in e ? (e as { response?: { data?: { message?: string } } }).response : undefined
      setToast(ax?.data?.message || 'Kayıt başarısız.')
    } finally {
      setEditSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteRow) return
    setDeleteSubmitting(true)
    try {
      await ordersAdminApi.delete(deleteRow.id)
      setDeleteRow(null)
      setToast('Sipariş arşivlendi (listeden kaldırıldı).')
      await load()
    } catch (e: unknown) {
      const ax = e && typeof e === 'object' && 'response' in e ? (e as { response?: { data?: { message?: string } } }).response : undefined
      setToast(ax?.data?.message || 'Silme başarısız.')
    } finally {
      setDeleteSubmitting(false)
    }
  }

  return (
    <div className="w-full min-w-0 space-y-6">
      {toast ? (
        <div
          className="fixed bottom-6 left-1/2 z-[110] max-w-[min(92vw,24rem)] -translate-x-1/2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-center text-sm font-medium text-white shadow-lg"
          role="status"
        >
          {toast}
        </div>
      ) : null}

      <AdminBankTransferConfirmModal
        open={!!bankModalOrder}
        onClose={() => !bankSubmitting && setBankModalOrder(null)}
        submitting={bankSubmitting}
        onConfirm={handleBankConfirm}
      />

      <AdminOrderEditModal
        open={!!editRow}
        row={editRow ? toEditable(editRow) : null}
        onClose={() => !editSubmitting && setEditRow(null)}
        submitting={editSubmitting}
        onSave={handleEditSave}
      />

      {deleteRow ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Siparişi sil</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">Bu siparişi silmek istediğinize emin misiniz?</p>
            <p className="mt-2 font-mono text-xs text-slate-500">{deleteRow.orderNo}</p>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50"
                onClick={() => !deleteSubmitting && setDeleteRow(null)}
                disabled={deleteSubmitting}
              >
                Vazgeç
              </button>
              <button
                type="button"
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-red-700 disabled:opacity-50"
                disabled={deleteSubmitting}
                onClick={() => void handleDelete()}
              >
                {deleteSubmitting ? 'Siliniyor…' : 'Sil'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sipariş yönetimi</h1>
          <p className="mt-1 text-sm text-slate-600">Operasyonel liste — durumlar ve ödemeler net görünür.</p>
        </div>
        <Link to="/admin" className="text-sm font-semibold text-accent-blue hover:underline">
          Dashboard
        </Link>
      </div>

      {pendingBankCount > 0 ? (
        <div className="flex flex-col gap-3 rounded-xl border-2 border-orange-400 bg-gradient-to-r from-amber-50 to-orange-50 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-orange-950">
            Onay bekleyen <span className="text-lg font-bold">{pendingBankCount}</span> Havale/EFT siparişi var.
          </p>
          <button
            type="button"
            className="shrink-0 rounded-lg bg-orange-600 px-4 py-2 text-sm font-bold text-white shadow hover:bg-orange-700"
            onClick={applyBankFilterShortcut}
          >
            Havale bekleyenleri göster
          </button>
        </div>
      ) : null}

      <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <label className="block min-w-0 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Sipariş durumu
            <select
              className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm shadow-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Tümü</option>
              <option value="PENDING">Beklemede</option>
              <option value="PROCESSING">İşleme alındı</option>
              <option value="PAID">Ödendi</option>
              <option value="FAILED">Başarısız</option>
              <option value="CANCELLED">İptal</option>
            </select>
          </label>
          <label className="block min-w-0 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Ödeme durumu
            <select
              className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm shadow-sm"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
            >
              <option value="">Tümü</option>
              <option value="PAID">Ödendi</option>
              <option value="PENDING_CARD">Ödeme bekliyor (kart)</option>
              <option value="PENDING_BANK">Havale onayı bekliyor</option>
              <option value="PENDING">Ödeme bekliyor (tümü)</option>
              <option value="FAILED">Başarısız</option>
              <option value="REFUNDED">İade edildi</option>
            </select>
          </label>
          <label className="block min-w-0 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Ödeme yöntemi
            <select
              className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm shadow-sm"
              value={paymentProvider}
              onChange={(e) => setPaymentProvider(e.target.value)}
            >
              <option value="">Tümü</option>
              <option value="PAYTR">Kart (PayTR)</option>
              <option value="BANK_TRANSFER">Havale/EFT</option>
              <option value="COD">Kapıda ödeme</option>
              <option value="IYZICO">Iyzico</option>
            </select>
          </label>
          <label className="block min-w-0 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Sipariş no
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm shadow-sm"
              value={orderNo}
              onChange={(e) => setOrderNo(e.target.value)}
              placeholder="WNT-…"
            />
          </label>
          <label className="block min-w-0 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:col-span-2">
            E-posta / müşteri ara
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm shadow-sm"
              value={customerQuery}
              onChange={(e) => setCustomerQuery(e.target.value)}
              placeholder="Ad veya e-posta"
            />
          </label>
          <label className="block min-w-0 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Başlangıç tarihi
            <input
              type="date"
              className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm shadow-sm"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </label>
          <label className="block min-w-0 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Bitiş tarihi
            <input
              type="date"
              className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm shadow-sm"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </label>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800"
            onClick={() => void load()}
          >
            Yenile
          </button>
        </div>
      </div>

      {error && <p className="text-sm font-medium text-red-700">{error}</p>}

      {loading && items.length === 0 ? (
        <p className="text-slate-600">Yükleniyor…</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-[960px] w-full border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-600">
              <tr>
                <th className="whitespace-nowrap px-3 py-3">Sipariş no</th>
                <th className="whitespace-nowrap px-3 py-3">Müşteri</th>
                <th className="min-w-[8rem] px-3 py-3">E-posta</th>
                <th className="min-w-[10rem] px-3 py-3">Ürünler</th>
                <th className="whitespace-nowrap px-3 py-3">Adet</th>
                <th className="whitespace-nowrap px-3 py-3">Toplam</th>
                <th className="whitespace-nowrap px-3 py-3">Sipariş</th>
                <th className="whitespace-nowrap px-3 py-3">Ödeme ynt.</th>
                <th className="whitespace-nowrap px-3 py-3">Ödeme</th>
                <th className="whitespace-nowrap px-3 py-3">Tarih</th>
                <th className="sticky right-0 z-10 whitespace-nowrap bg-slate-50 px-3 py-3 text-right shadow-[-6px_0_8px_-6px_rgba(0,0,0,0.15)]">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((o) => {
                const showBankBtn = showHavaleConfirmPaymentButton(o)
                return (
                  <tr
                    key={o.id}
                    className={`group border-t border-slate-100 transition hover:bg-slate-50/90 ${showBankBtn ? 'bg-amber-50/40' : ''}`}
                  >
                    <td className="whitespace-nowrap px-3 py-3 font-mono text-xs font-semibold text-slate-900">{o.orderNo}</td>
                    <td className="max-w-[10rem] truncate px-3 py-3 font-medium text-slate-900" title={o.customerName}>
                      {o.customerName}
                    </td>
                    <td className="max-w-[11rem] truncate px-3 py-3 text-slate-600" title={o.customerEmail}>
                      {o.customerEmail}
                    </td>
                    <td className="max-w-[12rem] truncate px-3 py-3 text-slate-800" title={o.productSummary}>
                      {o.productSummary}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 tabular-nums text-slate-800">{o.itemCount}</td>
                    <td className="whitespace-nowrap px-3 py-3 font-semibold tabular-nums text-slate-900">
                      {formatMoneyAmount(o.total, o.currency)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <OrderStatusBadge status={o.status} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <PaymentMethodBadge row={o} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <PaymentStatusBadge
                        row={{
                          status: o.status,
                          paymentProvider: o.paymentProvider,
                          paymentMethod: o.paymentMethod,
                          paymentStatus: o.paymentStatus,
                          paytrTransactionStatus: o.paytrTransactionStatus ?? null,
                          paidAt: o.paidAt ?? null,
                        }}
                      />
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-xs text-slate-600">{new Date(o.createdAt).toLocaleString('tr-TR')}</td>
                    <td
                      className="sticky right-0 z-10 whitespace-nowrap bg-white px-2 py-2 text-right shadow-[-8px_0_12px_-8px_rgba(0,0,0,0.12)] group-hover:bg-slate-50/90"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="relative inline-block text-left" data-order-menu={o.id}>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-800 shadow-sm hover:border-slate-400 hover:bg-slate-50"
                          onClick={(e) => {
                            e.stopPropagation()
                            setOpenMenuId((id) => (id === o.id ? null : o.id))
                          }}
                        >
                          İşlemler
                          <span className="text-[10px] text-slate-500">▾</span>
                        </button>
                        {openMenuId === o.id ? (
                          <div
                            className="absolute right-0 z-30 mt-1 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Link
                              to={`/admin/siparisler/${o.id}`}
                              className="block px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
                              onClick={() => setOpenMenuId(null)}
                            >
                              Detay
                            </Link>
                            <button
                              type="button"
                              className="block w-full px-3 py-2 text-left text-sm font-medium text-slate-800 hover:bg-slate-50"
                              onClick={() => {
                                setOpenMenuId(null)
                                setEditRow(o)
                              }}
                            >
                              Düzenle
                            </button>
                            {showBankBtn ? (
                              <button
                                type="button"
                                className="block w-full px-3 py-2 text-left text-sm font-bold text-amber-900 hover:bg-amber-50"
                                onClick={() => {
                                  setOpenMenuId(null)
                                  setBankModalOrder(o)
                                }}
                              >
                                Ödemeyi Onayla
                              </button>
                            ) : null}
                            <button
                              type="button"
                              className="block w-full px-3 py-2 text-left text-sm font-semibold text-red-700 hover:bg-red-50"
                              onClick={() => {
                                setOpenMenuId(null)
                                setDeleteRow(o)
                              }}
                            >
                              Sil
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {items.length === 0 && <p className="p-8 text-center text-sm font-medium text-slate-500">Kayıt yok.</p>}
        </div>
      )}
    </div>
  )
}
