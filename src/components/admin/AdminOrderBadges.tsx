import { isBankTransferLikeProvider, normalizePaymentToken } from '../../lib/adminOrderHavaleUi'

export type OrderStatusBadgeProps = { status: string }

const orderStatusStyles: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-950 ring-1 ring-amber-300/80',
  PROCESSING: 'bg-sky-100 text-sky-950 ring-1 ring-sky-300/80',
  PAID: 'bg-emerald-100 text-emerald-950 ring-1 ring-emerald-300/80',
  FAILED: 'bg-red-100 text-red-900 ring-1 ring-red-300/80',
  CANCELLED: 'bg-slate-200 text-slate-800 ring-1 ring-slate-400/60',
}

const orderStatusLabels: Record<string, string> = {
  PENDING: 'Beklemede',
  PROCESSING: 'İşleme alındı',
  PAID: 'Ödendi',
  FAILED: 'Başarısız',
  CANCELLED: 'İptal',
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const k = normalizePaymentToken(status)
  const cls = orderStatusStyles[k] ?? 'bg-slate-100 text-slate-800 ring-1 ring-slate-300/80'
  const label = orderStatusLabels[k] ?? status
  return (
    <span className={`inline-flex max-w-full items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {label}
    </span>
  )
}

export type PaymentMethodRow = { paymentProvider: string; paymentMethod?: string }

export function paymentMethodBadgeLabel(row: PaymentMethodRow): string {
  const p = normalizePaymentToken(row.paymentProvider)
  const m = normalizePaymentToken(row.paymentMethod)
  if (isBankTransferLikeProvider(row.paymentProvider) || isBankTransferLikeProvider(row.paymentMethod)) return 'Havale/EFT'
  if (p === 'PAYTR' || m === 'PAYTR') return 'Kart (PayTR)'
  if (p.includes('IYZICO') || m.includes('IYZICO')) return 'Iyzico'
  if (p.includes('COD') || p.includes('KAPIDA') || m.includes('COD') || m.includes('KAPIDA')) return 'Kapıda Ödeme'
  return row.paymentProvider || '—'
}

export function paymentMethodBadgeClass(row: PaymentMethodRow): string {
  const label = paymentMethodBadgeLabel(row)
  if (label === 'Havale/EFT') return 'bg-indigo-50 text-indigo-950 ring-1 ring-indigo-200'
  if (label === 'Kart (PayTR)') return 'bg-violet-50 text-violet-950 ring-1 ring-violet-200'
  if (label === 'Iyzico') return 'bg-fuchsia-50 text-fuchsia-950 ring-1 ring-fuchsia-200'
  if (label === 'Kapıda Ödeme') return 'bg-orange-50 text-orange-950 ring-1 ring-orange-200'
  return 'bg-slate-100 text-slate-800 ring-1 ring-slate-200'
}

export function PaymentMethodBadge({ row }: { row: PaymentMethodRow }) {
  const label = paymentMethodBadgeLabel(row)
  const cls = paymentMethodBadgeClass(row)
  return <span className={`inline-flex max-w-full rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>{label}</span>
}

export type PaymentStatusBadgeInput = {
  status: string
  paymentProvider: string
  paymentMethod?: string
  paymentStatus?: string | null
  paytrTransactionStatus?: string | null
  paidAt?: string | null
}

export type PaymentBadgeKind = 'paid' | 'pending' | 'waiting_bank' | 'failed' | 'refunded' | 'cancelled' | 'unknown'

export function resolvePaymentBadgeKind(row: PaymentStatusBadgeInput): PaymentBadgeKind {
  const st = normalizePaymentToken(row.status)
  const ps = normalizePaymentToken(row.paymentStatus)
  const tx = normalizePaymentToken(row.paytrTransactionStatus)
  const bank = isBankTransferLikeProvider(row.paymentProvider) || isBankTransferLikeProvider(row.paymentMethod)

  if (st === 'CANCELLED' && row.paidAt) return 'refunded'
  if (st === 'CANCELLED') return 'cancelled'

  if (bank) {
    if (st === 'PENDING' && (ps === 'WAITING_BANK_TRANSFER' || ps === 'PENDING' || ps === '')) return 'waiting_bank'
    if (st === 'PROCESSING' || st === 'PAID' || ps === 'SUCCESS') return 'paid'
    if (st === 'FAILED') return 'failed'
    return 'unknown'
  }

  if (st === 'FAILED' || tx === 'FAILED') return 'failed'
  if (st === 'PAID' || ps === 'SUCCESS' || tx === 'SUCCESS') return 'paid'
  if (st === 'PENDING' || ps === 'PENDING' || tx === 'PENDING') return 'pending'
  if (st === 'CANCELLED') return 'failed'
  return 'unknown'
}

export function paymentBadgeKindLabel(kind: PaymentBadgeKind): string {
  switch (kind) {
    case 'paid':
      return 'Ödendi'
    case 'pending':
      return 'Ödeme bekliyor'
    case 'waiting_bank':
      return 'Havale onayı bekliyor'
    case 'failed':
      return 'Başarısız'
    case 'refunded':
      return 'İade edildi'
    case 'cancelled':
      return 'İptal edildi'
    default:
      return '—'
  }
}

export function paymentBadgeKindClass(kind: PaymentBadgeKind): string {
  switch (kind) {
    case 'paid':
      return 'bg-emerald-500 text-white ring-2 ring-emerald-300 shadow-sm'
    case 'pending':
      return 'bg-amber-400 text-amber-950 ring-2 ring-amber-600/50 shadow-sm font-bold'
    case 'waiting_bank':
      return 'bg-gradient-to-r from-orange-500 to-red-600 text-white ring-2 ring-red-400/70 shadow-md font-bold'
    case 'failed':
      return 'bg-red-600 text-white ring-2 ring-red-400/80 shadow-sm font-semibold'
    case 'refunded':
      return 'bg-slate-400 text-white ring-2 ring-violet-300/80 shadow-sm'
    case 'cancelled':
      return 'bg-slate-300 text-slate-900 ring-2 ring-slate-400/70 shadow-sm'
    default:
      return 'bg-slate-200 text-slate-800 ring-1 ring-slate-300'
  }
}

export function PaymentStatusBadge({ row }: { row: PaymentStatusBadgeInput }) {
  const kind = resolvePaymentBadgeKind(row)
  const cls = paymentBadgeKindClass(kind)
  const label = paymentBadgeKindLabel(kind)
  return (
    <span className={`inline-flex max-w-full items-center rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>
      {label}
    </span>
  )
}

export function showHavaleConfirmPaymentButton(row: PaymentStatusBadgeInput): boolean {
  const bank = isBankTransferLikeProvider(row.paymentProvider) || isBankTransferLikeProvider(row.paymentMethod)
  if (!bank) return false
  const st = normalizePaymentToken(row.status)
  const ps = normalizePaymentToken(row.paymentStatus)
  if (st !== 'PENDING') return false
  return ps === 'WAITING_BANK_TRANSFER' || ps === 'PENDING' || ps === ''
}
