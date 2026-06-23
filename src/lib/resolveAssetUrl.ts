import { getUploadsBase } from '../config/api'

/** Path segmentlerini encode eder (Türkçe / boşluk içeren /uploads/ yolları için). */
function encodeUriPathSegments(pathname: string): string {
  const segs = pathname.split('/').filter((s) => s.length > 0)
  if (segs.length === 0) return ''
  return `/${segs.map((seg) => encodeURIComponent(seg)).join('/')}`
}

function isLocalhostHostname(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.localhost')
}

function tryParseUrl(raw: string): URL | null {
  try {
    return new URL(raw)
  } catch {
    return null
  }
}

/**
 * Canlı ortamda DB'ye sızan localhost mutlak URL'lerini göreli /uploads/ yoluna indirger.
 */
export function normalizeStoredAssetPath(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('/')) return trimmed

  const parsed = tryParseUrl(trimmed)
  if (!parsed) return trimmed

  if (isLocalhostHostname(parsed.hostname) && parsed.pathname.startsWith('/uploads/')) {
    return parsed.pathname
  }

  return trimmed
}

function resolveUploadsPath(relativePath: string): string {
  const base = getUploadsBase()
  const pathPart = encodeUriPathSegments(relativePath.startsWith('/') ? relativePath : `/${relativePath}`)
  if (!base) return pathPart
  return `${base.replace(/\/+$/, '')}${pathPart}`
}

/**
 * Tek merkez: backend `/uploads/...`, localhost mutlak URL ve harici https görselleri.
 * Kurumsal site `/images/...` için resolveImageUrl kullanın.
 */
export function resolveAssetUrl(path: string | null | undefined): string {
  if (!path) return ''
  const p = path.trim()
  if (!p) return ''

  const normalized = normalizeStoredAssetPath(p)

  if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
    return normalized
  }

  if (normalized.startsWith('/uploads/')) {
    return resolveUploadsPath(normalized)
  }

  if (normalized.startsWith('/')) {
    return normalized
  }

  return normalized
}
