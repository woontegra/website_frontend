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

  if (/^https?:\/\//i.test(normalized)) {
    return normalized
  }

  if (normalized.startsWith('/images/')) {
    return normalized
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
