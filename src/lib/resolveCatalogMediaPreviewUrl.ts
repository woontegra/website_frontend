import { getApiUrl } from '../config/api'
import { normalizeStoredAssetPath, resolveAssetUrl } from './resolveAssetUrl'

/** Path segmentlerini encode eder (Türkçe / boşluk içeren /uploads/ yolları için). */
function encodeUriPathSegments(pathname: string): string {
  const segs = pathname.split('/').filter((s) => s.length > 0)
  if (segs.length === 0) return ''
  return `/${segs.map((seg) => encodeURIComponent(seg)).join('/')}`
}

function usesSameOriginApiProxy(): boolean {
  const api = getApiUrl().replace(/\/+$/, '')
  if (api === '/api') return true
  if (import.meta.env.DEV && /^(https?:\/\/)?(127\.0\.0\.1|localhost)(:\d+)?\/api$/i.test(api)) {
    return true
  }
  return false
}

/**
 * Admin medya kütüphanesi önizlemesi — /uploads/... yollarını API ile aynı origin/proxy üzerinden çözer.
 * VITE_API_URL=/api iken göreli /uploads/... kullanır (Vite veya Vercel rewrite).
 */
export function resolveCatalogMediaPreviewUrl(path: string | null | undefined): string {
  if (!path) return ''
  const normalized = normalizeStoredAssetPath(path.trim())
  if (!normalized) return ''

  if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
    return normalized
  }

  if (normalized.startsWith('/uploads/') && usesSameOriginApiProxy()) {
    return encodeUriPathSegments(normalized)
  }

  return resolveAssetUrl(normalized)
}
