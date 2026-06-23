import { resolveAssetUrl, normalizeStoredAssetPath } from './resolveAssetUrl'

/**
 * Eski panel/veritabanı kayıtlarındaki bilinen path hatalarını düzeltir.
 * Key: kayıtlı yanlış path → value: public/images içindeki gerçek dosya.
 */
const IMAGE_PATH_ALIASES: Record<string, string> = {
  '/images/about-hero.jpg': '/images/about-hero.png',
  '/images/blog/default.jpg': '/images/blog/varsayilan.jpg',
  '/images/e-ticaret.png': '/images/e-ticaret.jpeg',
  '/images/e-ticaret.jpg': '/images/e-ticaret-sistemi.jpg',
  '/images/web-tasarim.jpg': '/images/web-tasarim-mockup.jpg',
  '/brands/optimoon.png': '/images/brand-optimoon.jpg',
  '/brands/datca.png': '/images/brand-datca.jpg',
  '/brands/mercan.png': '/images/brand-mercan.jpg',
  '/brands/bilirkisi.png': '/images/brand-bilirkisi.jpg',
}

const INVALID_LITERALS = new Set(['null', 'undefined', 'none', 'false', 'n/a', 'na'])

/**
 * Ham görsel değerinin geçerli olup olmadığını kontrol eder.
 * Geçersizse img render edilmemeli — 404 isteği oluşmaz.
 */
export function isValidImageSrc(url?: string | null): boolean {
  if (url == null) return false
  const trimmed = url.trim()
  if (!trimmed) return false
  if (INVALID_LITERALS.has(trimmed.toLowerCase())) return false
  return Boolean(resolveImageUrl(trimmed))
}

/**
 * Kurumsal site /images/ alias düzeltmeleri. `/uploads/` dokunulmaz.
 */
export function normalizePublicImagePath(url?: string | null): string {
  if (!url) return ''
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('/uploads/')) return trimmed

  const lower = trimmed.toLowerCase()
  if (IMAGE_PATH_ALIASES[lower]) return IMAGE_PATH_ALIASES[lower]
  if (IMAGE_PATH_ALIASES[trimmed]) return IMAGE_PATH_ALIASES[trimmed]

  return trimmed
}

/**
 * Tüm görsel URL'lerini tek noktadan çözümler.
 * /uploads/ → resolveAssetUrl (backend kökü)
 * /images/ → frontend static
 */
export function resolveImageUrl(url?: string | null): string {
  if (url == null) return ''
  const trimmed = url.trim()
  if (!trimmed || INVALID_LITERALS.has(trimmed.toLowerCase())) return ''

  const stored = normalizeStoredAssetPath(trimmed)
  if (!stored) return ''

  if (stored.startsWith('/uploads/')) {
    return resolveAssetUrl(stored)
  }

  if (/^https?:\/\//i.test(stored)) {
    return stored
  }

  const normalized = normalizePublicImagePath(stored)
  if (!normalized) return ''

  if (normalized.startsWith('/images/')) {
    return normalized
  }

  if (normalized.startsWith('/uploads/')) {
    return resolveAssetUrl(normalized)
  }

  if (normalized.startsWith('/')) {
    return normalized
  }

  return `/images/${normalized.replace(/^\/+/, '')}`
}

export function isPublicImagePath(url?: string | null): boolean {
  if (!url) return false
  const resolved = resolveImageUrl(url)
  return resolved.startsWith('/images/')
}

export function isPersistentImageUrl(url?: string | null): boolean {
  const trimmed = url?.trim() ?? ''
  if (!trimmed) return false
  if (trimmed.startsWith('/uploads/') || normalizeStoredAssetPath(trimmed).startsWith('/uploads/')) {
    return true
  }
  return isPublicImagePath(url) || /^https?:\/\//i.test(trimmed)
}

/** API yüklenene kadar fallback basmamak için sayfa görselleri. */
export function resolvePageImage(
  loaded: boolean,
  apiImage: string | undefined | null,
  fallback: string,
): string | undefined {
  const fromApi = apiImage?.trim()
  if (!loaded) return fromApi || undefined
  return fromApi || fallback
}
