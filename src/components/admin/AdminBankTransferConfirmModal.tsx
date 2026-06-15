import { useEffect, useState } from 'react'

function todayDateInput(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

type Props = {
  open: boolean
  title?: string
  onClose: () => void
  submitting: boolean
  onConfirm: (payload: { paymentDate: string; bankNote: string; reference?: string }) => void | Promise<void>
}

export function AdminBankTransferConfirmModal({
  open,
  title = 'Havale/EFT ödemesini onayla',
  onClose,
  submitting,
  onConfirm,
}: Props) {
  const [paymentDate, setPaymentDate] = useState(todayDateInput)
  const [bankNote, setBankNote] = useState('')
  const [reference, setReference] = useState('')

  useEffect(() => {
    if (open) {
      setPaymentDate(todayDateInput())
      setBankNote('')
      setReference('')
    }
  }, [open])

  if (!open) return null

  const valid = Boolean(paymentDate.trim() && bankNote.trim())

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4" role="dialog" aria-modal="true">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Ödemenin hesaba geçtiğini teyit ediyorsanız aşağıdaki bilgileri doldurun. Bu kayıt denetim için saklanır.
        </p>
        <div className="mt-4 space-y-3">
          <label className="block text-sm font-medium text-slate-800">
            Ödeme tarihi <span className="text-red-600">*</span>
            <input
              type="date"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              required
            />
          </label>
          <label className="block text-sm font-medium text-slate-800">
            Banka notu / açıklama <span className="text-red-600">*</span>
            <textarea
              className="mt-1 min-h-[96px] w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
              value={bankNote}
              onChange={(e) => setBankNote(e.target.value)}
              placeholder="Dekont açıklaması, gönderen adı vb."
              required
            />
          </label>
          <label className="block text-sm font-medium text-slate-800">
            Referans numarası <span className="font-normal text-slate-500">(opsiyonel)</span>
            <input
              type="text"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Banka referans / dekont no"
            />
          </label>
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
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700 disabled:opacity-50"
            disabled={submitting || !valid}
            onClick={() => void onConfirm({ paymentDate, bankNote: bankNote.trim(), reference: reference.trim() || undefined })}
          >
            {submitting ? 'Kaydediliyor…' : 'Ödemeyi Onayla'}
          </button>
        </div>
      </div>
    </div>
  )
}
