import { useEffect, useState } from 'react'
import { isAdminPaytrCardOrder, normalizePaymentToken } from '../../lib/adminOrderHavaleUi'

export type AdminOrderEditableSnapshot = {
  id: string
  status: string
  paymentProvider?: string | null
  paymentMethod?: string | null
  paymentStatus?: string | null
  /** PayTR PaymentTransaction satırı var mı */
  hasPaytrTransactionRecord?: boolean
  paytrTransactionStatus?: string | null
  adminNote?: string | null
  shippingCarrier?: string | null
  shippingTrackingNumber?: string | null
  shippingStatus?: string | null
}

type Props = {
  open: boolean
  row: AdminOrderEditableSnapshot | null
  onClose: () => void
  submitting: boolean
  onSave: (payload: {
    status: string
    paymentTransactionStatus?: string
    adminNote: string | null
    shippingCarrier: string | null
    shippingTrackingNumber: string | null
    shippingStatus: string | null
  }) => void | Promise<void>
}

export function AdminOrderEditModal({ open, row, onClose, submitting, onSave }: Props) {
  const [status, setStatus] = useState('')
  const [paytrTx, setPaytrTx] = useState('')
  const [adminNote, setAdminNote] = useState('')
  const [shippingCarrier, setShippingCarrier] = useState('')
  const [shippingTrackingNumber, setShippingTrackingNumber] = useState('')
  const [shippingStatus, setShippingStatus] = useState('')

  useEffect(() => {
    if (!open || !row) return
    setStatus(row.status)
    setPaytrTx(row.paytrTransactionStatus ?? 'PENDING')
    setAdminNote(row.adminNote ?? '')
    setShippingCarrier(row.shippingCarrier ?? '')
    setShippingTrackingNumber(row.shippingTrackingNumber ?? '')
    setShippingStatus(row.shippingStatus ?? '')
  }, [open, row])

  if (!open || !row) return null

  const paytrMode = isAdminPaytrCardOrder(row)
  const showPaytrTxEditor = paytrMode && row.hasPaytrTransactionRecord === true
  const showPaytrPendingButNoTx =
    paytrMode && row.hasPaytrTransactionRecord !== true && normalizePaymentToken(row.status) === 'PENDING'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4" role="dialog" aria-modal="true">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-slate-900">Siparişi düzenle</h3>
        <p className="mt-1 font-mono text-xs text-slate-500">{row.id}</p>

        <div className="mt-5 space-y-4 text-sm">
          <label className="block font-medium text-slate-800">
            Sipariş durumu
            <select
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="PENDING">Beklemede</option>
              <option value="PROCESSING">İşleme alındı</option>
              <option value="PAID">Ödendi</option>
              <option value="FAILED">Başarısız</option>
              <option value="CANCELLED">İptal</option>
            </select>
          </label>

          {showPaytrTxEditor ? (
            <label className="block font-medium text-slate-800">
              Ödeme işlem durumu (PayTR)
              <select
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
                value={paytrTx}
                onChange={(e) => setPaytrTx(e.target.value)}
              >
                <option value="PENDING">Ödeme bekliyor</option>
                <option value="SUCCESS">Ödendi</option>
                <option value="FAILED">Başarısız</option>
              </select>
              <p className="mt-1 text-xs text-slate-500">Son PayTR işlem kaydı bu değerle hizalanır.</p>
            </label>
          ) : showPaytrPendingButNoTx ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-950">
              <p className="font-semibold">PayTR işlem kaydı yok</p>
              <p className="mt-1">
                Kayıtta ödeme yöntemi “Kart (PayTR)” görünse bile bu siparişte <strong>PayTR işlem satırı oluşmamış</strong>. Ödeme{' '}
                <strong>Havale/EFT</strong> ile alındıysa veritabanında <code className="rounded bg-white/80 px-1">paymentProvider</code> değeri{' '}
                <strong>BANK_TRANSFER</strong> olmalıdır; havale onayı için <strong>Ödemeyi Onayla</strong> yalnızca bu düzeltmeden sonra
                kullanılabilir.
              </p>
              <p className="mt-2 text-amber-900/90">
                Buradan sipariş durumu, kargo ve admin notunu güncelleyebilirsiniz; PayTR alanı gönderilmez.
              </p>
            </div>
          ) : !paytrMode ? (
            <div className="rounded-lg border border-amber-100 bg-amber-50/80 px-3 py-2 text-xs text-amber-950">
              Bu sipariş Havale/EFT. Ödeme durumu yalnızca <strong>Ödemeyi Onayla</strong> ile güvenli şekilde kapanır.
            </div>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800">
              PayTR işlem kaydı görünmüyor; bu formdan sipariş durumu, kargo ve admin notunu güncelleyebilirsiniz.
            </div>
          )}

          <label className="block font-medium text-slate-800">
            Admin notu
            <textarea
              className="mt-1 min-h-[80px] w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Operasyonel notlar (müşteri görmez)"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block font-medium text-slate-800 sm:col-span-2">
              Kargo firması
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
                value={shippingCarrier}
                onChange={(e) => setShippingCarrier(e.target.value)}
              />
            </label>
            <label className="block font-medium text-slate-800 sm:col-span-2">
              Kargo takip numarası
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
                value={shippingTrackingNumber}
                onChange={(e) => setShippingTrackingNumber(e.target.value)}
              />
            </label>
            <label className="block font-medium text-slate-800 sm:col-span-2">
              Kargo durumu
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
                value={shippingStatus}
                onChange={(e) => setShippingStatus(e.target.value)}
                placeholder="Örn. Dağıtımda, Teslim edildi"
              />
            </label>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50"
            onClick={onClose}
            disabled={submitting}
          >
            İptal
          </button>
          <button
            type="button"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800 disabled:opacity-50"
            disabled={submitting}
            onClick={() =>
              void onSave({
                status,
                paymentTransactionStatus: showPaytrTxEditor ? paytrTx : undefined,
                adminNote: adminNote.trim() || null,
                shippingCarrier: shippingCarrier.trim() || null,
                shippingTrackingNumber: shippingTrackingNumber.trim() || null,
                shippingStatus: shippingStatus.trim() || null,
              })
            }
          >
            {submitting ? 'Kaydediliyor…' : 'Kaydet'}
          </button>
        </div>
      </div>
    </div>
  )
}
