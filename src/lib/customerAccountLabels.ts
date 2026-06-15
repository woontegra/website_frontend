/**
 * Müşteri Hesabım ekranları için merkezi durum / ödeme / ödeme yöntemi metinleri.
 * API’den gelen teknik enum değerleri kullanıcıya asla ham gösterilmemeli.
 */

export function normalizeCustomerToken(s: string | null | undefined): string {
  return (s ?? '').trim().toUpperCase().replace(/\s+/g, '_')
}

const UNKNOWN = 'Durum bilinmiyor'

/** Ödeme satırı / işlem durumu (resolveOrderPaymentRowStatus + olası ekler) */
export function customerPaymentStatusLabel(code: string | null | undefined): string {
  const k = normalizeCustomerToken(code)
  const map: Record<string, string> = {
    PAID: 'Ödeme alındı',
    PENDING: 'Ödeme bekleniyor',
    SUCCESS: 'Ödeme alındı',
    WAITING_BANK_TRANSFER: 'Havale/EFT onayı bekleniyor',
    FAILED: 'Ödeme başarısız',
    REFUNDED: 'İade edildi',
    CANCELLED: 'İptal edildi',
  }
  return map[k] ?? (k ? UNKNOWN : 'Ödeme durumu güncelleniyor')
}

/** Sipariş durumu (OrderStatus + ileride eklenebilecek değerler) */
export function customerOrderStatusLabel(code: string | null | undefined): string {
  const k = normalizeCustomerToken(code)
  const map: Record<string, string> = {
    PENDING: 'Sipariş alındı',
    PROCESSING: 'Hazırlanıyor',
    PAID: 'Teslim edildi',
    FAILED: 'Ödeme başarısız',
    CANCELLED: 'İptal edildi',
    SHIPPED: 'Kargoya verildi',
    DELIVERED: 'Teslim edildi',
    RETURN_REQUESTED: 'İade talebi alındı',
    RETURNED: 'İade edildi',
  }
  return map[k] ?? UNKNOWN
}

/** Ödeme yöntemi (PaymentProvider ve olası alias’lar) */
export function customerPaymentMethodLabel(code: string | null | undefined): string {
  const k = normalizeCustomerToken(code)
  const map: Record<string, string> = {
    PAYTR: 'Kredi/Banka Kartı',
    CARD: 'Kredi/Banka Kartı',
    BANK_TRANSFER: 'Havale/EFT',
    HAVALE_EFT: 'Havale/EFT',
    IYZICO: 'Kredi/Banka Kartı',
    CASH_ON_DELIVERY: 'Kapıda Ödeme',
  }
  return map[k] ?? UNKNOWN
}

export type AccountBadgeTone = 'success' | 'warning' | 'danger' | 'neutral' | 'info' | 'muted'

export function customerPaymentStatusBadgeTone(code: string | null | undefined): AccountBadgeTone {
  const k = normalizeCustomerToken(code)
  if (!k) return 'neutral'
  if (k === 'SUCCESS' || k === 'PAID') return 'success'
  if (k === 'PENDING' || k === 'WAITING_BANK_TRANSFER') return 'warning'
  if (k === 'FAILED') return 'danger'
  if (k === 'CANCELLED') return 'muted'
  if (k === 'REFUNDED') return 'info'
  return 'neutral'
}

export function customerOrderStatusBadgeTone(code: string | null | undefined): AccountBadgeTone {
  const k = normalizeCustomerToken(code)
  if (!k) return 'neutral'
  if (k === 'PAID' || k === 'DELIVERED') return 'success'
  if (k === 'PROCESSING' || k === 'SHIPPED') return 'info'
  if (k === 'PENDING') return 'warning'
  if (k === 'CANCELLED' || k === 'RETURNED') return 'muted'
  if (k === 'FAILED') return 'danger'
  if (k === 'RETURN_REQUESTED') return 'warning'
  return 'neutral'
}

export const accountBadgeToneClasses: Record<AccountBadgeTone, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  warning: 'border-amber-200 bg-amber-50 text-amber-950',
  danger: 'border-red-200 bg-red-50 text-red-900',
  neutral: 'border-slate-200 bg-slate-50 text-slate-800',
  info: 'border-sky-200 bg-sky-50 text-sky-950',
  muted: 'border-slate-200 bg-slate-100 text-slate-600',
}

export type CustomerOrderListFilter =
  | 'all'
  | 'payment_pending'
  | 'preparing'
  | 'shipping'
  | 'delivered'
  | 'cancel_return'

export function matchesCustomerOrderListFilter(
  row: {
    status: string
    paymentStatus: string | null
    shippingTrackingNumber?: string | null
  },
  filter: CustomerOrderListFilter,
): boolean {
  if (filter === 'all') return true
  const ps = normalizeCustomerToken(row.paymentStatus)
  const st = normalizeCustomerToken(row.status)
  const tracking = Boolean(row.shippingTrackingNumber?.trim())

  if (filter === 'payment_pending') {
    return ps === 'PENDING' || ps === 'WAITING_BANK_TRANSFER' || ps === ''
  }
  if (filter === 'preparing') {
    return st === 'PROCESSING' && !tracking
  }
  if (filter === 'shipping') {
    return tracking && st !== 'PAID' && st !== 'CANCELLED' && st !== 'FAILED'
  }
  if (filter === 'delivered') {
    return st === 'PAID'
  }
  if (filter === 'cancel_return') {
    return st === 'CANCELLED' || st === 'FAILED' || ps === 'REFUNDED'
  }
  return true
}

export function formatAccountDateTime(iso: string | null | undefined): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return '—'
  }
}
