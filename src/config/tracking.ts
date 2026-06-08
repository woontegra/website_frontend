/**
 * Yalnızca admin panelinde ve /api/settings/tracking yanıtında pixel yoksa kullanılır.
 * Tek kaynak: admin panel Meta Pixel ID alanı.
 */
export const WOONTEGRA_META_PIXEL_FALLBACK = '3510699572421610'

/** @deprecated Tek kaynak admin ayarıdır; doğrudan kullanmayın. */
export const WOONTEGRA_META_PIXEL_ID = WOONTEGRA_META_PIXEL_FALLBACK

export function reportMissingMetaPixelEnv(): void {
  if (!import.meta.env.PROD) return
  if (import.meta.env.VITE_META_PIXEL_ID?.trim()) return
  console.warn(
    '[Woontegra] Meta Pixel ID admin panelinden veya VITE_META_PIXEL_ID env değişkeninden okunur. ' +
      'Öncelik: /api/settings/tracking → env → fallback.',
  )
}
