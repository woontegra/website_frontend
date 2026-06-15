import { getApiBase } from '../config/api'

/** Path segmentlerini encode eder (Türkçe / boşluk içeren eski /uploads/ yolları için). */
function encodeUriPathSegments(path: string): string {
  const segs = path.split('/').filter((s) => s.length > 0)
  if (segs.length === 0) return ''
  return `/${segs.map((seg) => encodeURIComponent(seg)).join('/')}`
}

/** Backend’de `/uploads/...` veya tam URL görselleri için tarayıcıda kullanılacak adres */
export function resolveAssetUrl(path: string | null | undefined): string {
  if (!path) return ''
  const p = path.trim()
  if (!p) return ''
  if (p.startsWith('http://') || p.startsWith('https://')) return p
  if (p.startsWith('/')) {
    const base = getApiBase()
    return `${base}${encodeUriPathSegments(p)}`
  }
  return p
}
