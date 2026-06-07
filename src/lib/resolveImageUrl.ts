import { getApiBase } from '../config/api'

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
  '/logo.png': '/logo.svg',
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
 * Tüm görsel URL'lerini tek noktadan çözümler.
 * Woontegra kurumsal site görselleri frontend/public/images altındadır.
 * /images/... pathleri aynen Vite/Vercel static asset olarak kullanılır.
 */
export function normalizePublicImagePath(url?: string | null): string {
  if (!url) return ''
  const trimmed = url.trim()
  if (!trimmed) return ''

  const lower = trimmed.toLowerCase()
  if (IMAGE_PATH_ALIASES[lower]) return IMAGE_PATH_ALIASES[lower]
  if (IMAGE_PATH_ALIASES[trimmed]) return IMAGE_PATH_ALIASES[trimmed]

  return trimmed
}

export function resolveImageUrl(url?: string | null): string {
  const normalized = normalizePublicImagePath(url)
  if (!normalized) return ''

  if (INVALID_LITERALS.has(normalized.toLowerCase())) return ''

  if (/^https?:\/\//i.test(normalized)) {
    return normalized
  }

  if (normalized.startsWith('/images/')) {
    return normalized
  }

  if (normalized.startsWith('/uploads/branding/')) {
    if (typeof window !== 'undefined') {
      return normalized
    }
    return `${getApiBase()}${normalized}`
  }

  if (normalized.startsWith('/uploads/')) {
    return ''
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
  return isPublicImagePath(url) || /^https?:\/\//i.test(url?.trim() ?? '')
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
