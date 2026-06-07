/** Woontegra kurumsal site — Bilirkişi Hesap pikseli DEĞİL */
export const WOONTEGRA_META_PIXEL_FALLBACK = '351069957242160'

export const WOONTEGRA_META_PIXEL_ID = (
  import.meta.env.VITE_META_PIXEL_ID ?? WOONTEGRA_META_PIXEL_FALLBACK
).trim()

export function reportMissingMetaPixelEnv(): void {
  if (!import.meta.env.PROD) return
  if (import.meta.env.VITE_META_PIXEL_ID?.trim()) return
  console.warn(
    '[Woontegra] VITE_META_PIXEL_ID tanımlı değil; varsayılan Woontegra Pixel ID kullanılıyor: ' +
      WOONTEGRA_META_PIXEL_FALLBACK,
  )
}
