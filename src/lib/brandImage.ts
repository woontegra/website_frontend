import type { BrandsSectionData } from '../types/sections'

export function getBrandImage(
  brands: BrandsSectionData | null | undefined,
  matchKey: string,
  fallback: string,
): string {
  if (!brands?.items?.length) return fallback

  const key = matchKey.toLowerCase()
  const item = brands.items.find((b) => {
    const name = b.name.toLowerCase()
    return name.includes(key) || key.includes(name.split(' ')[0])
  })

  return item?.image?.trim() || fallback
}
