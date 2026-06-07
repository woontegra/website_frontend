import { getApiBase } from '../config/api'

const MEDIA_CDN_BASE = (import.meta.env.VITE_WOONTEGRA_MEDIA_CDN ?? '').replace(/\/$/, '')

/**
 * Tüm görsel URL'lerini tek noktadan çözümler.
 * - https://... (Cloudinary dahil) → olduğu gibi
 * - /images/... → Vercel static veya opsiyonel CDN öneki
 * - /uploads/... → backend API (geçici disk; yeni yüklemeler Cloudinary'ye gider)
 */
export function resolveImageUrl(url?: string | null): string {
  if (!url) return ''

  const trimmed = url.trim()
  if (!trimmed) return ''

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }

  if (trimmed.startsWith('/images/')) {
    return MEDIA_CDN_BASE ? `${MEDIA_CDN_BASE}${trimmed}` : trimmed
  }

  if (trimmed.startsWith('/uploads/')) {
    return `${getApiBase()}${trimmed}`
  }

  if (trimmed.startsWith('/')) {
    return trimmed
  }

  return `/${trimmed}`
}

/** Yönetici yüklemeleri — yalnızca Cloudinary https URL kalıcı kabul edilir */
export function isCloudinaryMediaUrl(url?: string | null): boolean {
  if (!url) return false
  return /^https:\/\/res\.cloudinary\.com\//i.test(url.trim())
}

export function isPersistentImageUrl(url?: string | null): boolean {
  if (!url) return false
  const trimmed = url.trim()
  if (trimmed.startsWith('/uploads/')) return false
  if (isCloudinaryMediaUrl(trimmed)) return true
  if (trimmed.startsWith('/images/')) return true
  return /^https?:\/\//i.test(trimmed)
}
