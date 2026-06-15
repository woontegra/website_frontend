/** Admin sipariş ekranı: ödeme yöntemi / durum değerlerini tek biçimde karşılaştırır. */
export function normalizePaymentToken(v: unknown): string {
  return String(v ?? '')
    .trim()
    .toUpperCase()
    .replace(/-/g, '_')
}

export function isBankTransferLikeProvider(v: unknown): boolean {
  const x = normalizePaymentToken(v)
  return (
    x === 'BANK_TRANSFER' ||
    x === 'BANK' ||
    x === 'HAVALE' ||
    x === 'EFT' ||
    x === 'HAVALE_EFT' ||
    x === 'WIRE'
  )
}

/**
 * Admin düzenleme: PayTR işlem alanı yalnızca kart (PayTR) siparişinde gösterilmeli.
 * paymentProvider boş/eksik olduğunda "değil PayTR" sanılıp yanlış pozitif vermemek için açık PAYTR eşleşmesi kullanılır.
 */
export function isAdminPaytrCardOrder(row: { paymentProvider?: unknown; paymentMethod?: unknown; paymentStatus?: unknown }): boolean {
  const ps = normalizePaymentToken(row.paymentStatus)
  if (ps === 'WAITING_BANK_TRANSFER') return false
  const pp = normalizePaymentToken(row.paymentProvider)
  const pm = normalizePaymentToken(row.paymentMethod)
  if (
    isBankTransferLikeProvider(row.paymentProvider) ||
    isBankTransferLikeProvider(row.paymentMethod) ||
    pp === 'BANK_TRANSFER' ||
    pm === 'BANK_TRANSFER'
  ) {
    return false
  }
  return pp === 'PAYTR' || pm === 'PAYTR'
}

/** Havale/EFT onay kutusu: sipariş hâlâ bekliyor ve yöntem Havale veya liste “WAITING_BANK_TRANSFER” kodu. */
export function shouldShowHavaleApproveBox(row: {
  status?: unknown
  paymentProvider?: unknown
  paymentMethod?: unknown
  paymentStatus?: unknown
}): boolean {
  const st = normalizePaymentToken(row.status)
  if (st !== 'PENDING') return false

  const ps = normalizePaymentToken(row.paymentStatus)
  if (ps === 'WAITING_BANK_TRANSFER') return true

  return (
    isBankTransferLikeProvider(row.paymentProvider) || isBankTransferLikeProvider(row.paymentMethod)
  )
}

export function shouldShowHavaleApprovedBanner(row: {
  status?: unknown
  paymentProvider?: unknown
  paymentMethod?: unknown
}): boolean {
  const st = normalizePaymentToken(row.status)
  if (st !== 'PROCESSING' && st !== 'PAID') return false
  return (
    isBankTransferLikeProvider(row.paymentProvider) || isBankTransferLikeProvider(row.paymentMethod)
  )
}

export function adminPaymentMethodDisplay(row: {
  paymentProvider?: unknown
  paymentMethod?: unknown
}): 'Havale/EFT' | 'Kart (PayTR)' {
  if (isBankTransferLikeProvider(row.paymentProvider) || isBankTransferLikeProvider(row.paymentMethod)) {
    return 'Havale/EFT'
  }
  return 'Kart (PayTR)'
}

export function adminPaymentStatusDisplay(row: {
  paymentProvider?: unknown
  paymentMethod?: unknown
  paymentStatus?: unknown
  paymentStatusLabel?: unknown
  status?: unknown
}): string {
  const st = normalizePaymentToken(row.status)
  const ps = normalizePaymentToken(row.paymentStatus)
  const bank = isBankTransferLikeProvider(row.paymentProvider) || isBankTransferLikeProvider(row.paymentMethod)

  if (bank) {
    if (st === 'PROCESSING' || st === 'PAID' || ps === 'SUCCESS') return 'Ödendi'
    return 'Ödeme Bekliyor'
  }

  if (st === 'PAID' || ps === 'SUCCESS') return 'Ödendi'
  if (st === 'PENDING' || ps === 'PENDING') return 'Ödeme Bekliyor'
  const lbl = String(row.paymentStatusLabel ?? '').trim()
  if (lbl) return lbl
  return '—'
}
