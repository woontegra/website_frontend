import { resolveImageUrl } from './resolveImageUrl'

/** Logo/favicon gibi marka asset'leri için cache-bust'lu URL üretir. */
export function buildBrandedAssetUrl(path: string, version?: string | null): string {
  const resolved = resolveImageUrl(path)
  if (!resolved) return ''

  const v = version?.trim() || path.trim()
  const separator = resolved.includes('?') ? '&' : '?'
  return `${resolved}${separator}v=${encodeURIComponent(v)}`
}
