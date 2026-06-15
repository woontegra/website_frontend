/**
 * Kullanıcıya gösterilecek tutar (varsayılan TRY).
 * Örnek: `2.500,00 ₺` — binlik `.`, ondalık `,`, sembol tutarın sağında; "TL" kullanılmaz.
 */
export function formatMoneyAmount(amount: number, currency?: string | null): string {
  if (!Number.isFinite(amount)) {
    return `${new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(0)} ₺`
  }
  const formatted = new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)

  const code = (currency ?? 'TRY').trim().toUpperCase() || 'TRY'
  if (code === 'TRY') {
    return `${formatted} ₺`
  }
  return `${formatted} ${code}`
}
