import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Copy, Check } from 'lucide-react'
import type { BankTransferInfoDto } from '../../lib/bankTransferTypes'
import { formatIbanDisplay } from '../../lib/bankTransferTypes'

function CopyFieldBtn({ label, value }: { label: string; value: string }) {
  const [ok, setOk] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setOk(true)
      window.setTimeout(() => setOk(false), 2000)
    } catch {
      window.alert('Panoya kopyalanamadı. Metni elle seçip kopyalayın.')
    }
  }
  return (
    <button
      type="button"
      onClick={() => void copy()}
      className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-50"
    >
      {ok ? <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
      {label}
    </button>
  )
}

type PanelVariant = 'success' | 'account'

export function BankTransferPaymentPanel({
  variant,
  info,
  supportHref,
}: {
  variant: PanelVariant
  info: BankTransferInfoDto
  /** Hesabım sipariş detayında destek linki */
  supportHref?: string
}) {
  const title = variant === 'success' ? 'Ödeme yapacağınız banka bilgileri' : 'Havale/EFT ödeme bilgileri'
  const topMt = variant === 'account' ? 'mt-4' : 'mt-8'
  const warn =
    'Havale/EFT açıklamasına sipariş numaranızı yazmayı unutmayın. Açıklama yazılmadığında ödeme onayı gecikebilir.'
  const generalWarn =
    'Havale/EFT yaparken açıklama alanına sipariş numaranızı yazınız. Ödemeniz kontrol edildikten sonra siparişiniz onaylanacaktır.'

  return (
    <div className={`${topMt} rounded-2xl border-2 border-sky-200 bg-sky-50/80 p-5 text-left shadow-sm sm:p-7`}>
      <h2 className="text-lg font-bold text-sky-950">{title}</h2>
      <p className="mt-2 text-xs leading-relaxed text-sky-900/90 sm:text-sm">{generalWarn}</p>
      <dl className="mt-5 space-y-4 text-sm">
        <div className="flex flex-col gap-2 rounded-xl border border-sky-100 bg-white/95 p-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Banka</dt>
            <dd className="mt-1 font-medium text-slate-900">{info.bankName}</dd>
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded-xl border border-sky-100 bg-white/95 p-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Alıcı / hesap sahibi</dt>
            <dd className="mt-1 font-medium text-slate-900">{info.accountHolder}</dd>
          </div>
        </div>
        {info.branchName ? (
          <div className="rounded-xl border border-sky-100 bg-white/95 p-4">
            <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Şube</dt>
            <dd className="mt-1 font-medium text-slate-900">{info.branchName}</dd>
          </div>
        ) : null}
        {info.accountNumber ? (
          <div className="rounded-xl border border-sky-100 bg-white/95 p-4">
            <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Hesap numarası</dt>
            <dd className="mt-1 font-mono text-slate-900">{info.accountNumber}</dd>
          </div>
        ) : null}
        <div className="flex flex-col gap-2 rounded-xl border border-sky-100 bg-white/95 p-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">IBAN</dt>
            <dd className="mt-1 break-all font-mono text-sm font-semibold text-slate-900">{formatIbanDisplay(info.iban)}</dd>
          </div>
          <CopyFieldBtn label="IBAN kopyala" value={info.ibanCompact} />
        </div>
        <div className="flex flex-col gap-2 rounded-xl border border-sky-100 bg-white/95 p-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Ödenecek tutar</dt>
            <dd className="mt-1 text-lg font-bold text-slate-900">{info.amountFormatted}</dd>
          </div>
          <CopyFieldBtn label="Tutar kopyala" value={info.amountFormatted} />
        </div>
        <div className="flex flex-col gap-2 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <dt className="text-xs font-bold uppercase tracking-wide text-emerald-900">Ödeme açıklaması (sipariş no)</dt>
            <dd className="mt-1 font-mono text-base font-bold tracking-wide text-emerald-950">{info.paymentReference}</dd>
          </div>
          <CopyFieldBtn label="Açıklama kopyala" value={info.paymentReference} />
        </div>
      </dl>
      {info.instructions ? (
        <p className="mt-4 rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-xs leading-relaxed text-slate-700">{info.instructions}</p>
      ) : null}
      <div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950">
        <strong className="font-bold">Uyarı:</strong> {warn}
      </div>
      {variant === 'account' && supportHref ? (
        <Link
          to={supportHref}
          className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-bold text-white hover:bg-slate-800 sm:w-auto"
        >
          Siparişimle ilgili destek al
        </Link>
      ) : null}
    </div>
  )
}
