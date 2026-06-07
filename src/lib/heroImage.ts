import { resolveImageUrl } from './resolveImageUrl'

const HERO_IMAGE_KEYS = ['image', 'imageUrl', 'heroImage', 'mediaUrl'] as const

/**
 * Hero section data içinden görsel path'ini okur.
 * Panel `image`, builder/legacy kayıtlar `imageUrl` kullanabilir — ikisi de desteklenir.
 */
export function extractHeroImage(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined

  const record = data as Record<string, unknown>
  for (const key of HERO_IMAGE_KEYS) {
    const value = record[key]
    if (typeof value === 'string' && value.trim()) {
      const resolved = resolveImageUrl(value)
      if (resolved) return resolved
    }
  }
  return undefined
}
