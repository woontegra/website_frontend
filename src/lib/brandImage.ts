import type { BrandsSectionData } from '../types/sections'

export function getBrandImage(
  brands: BrandsSectionData | null | undefined,
  matchKey: string,
  fallback: string,
  loaded = true,
): string | undefined {
  const key = matchKey.toLowerCase()
  const item = brands?.items?.find((b) => {
    const name = b.name.toLowerCase()
    return name.includes(key) || key.includes(name.split(' ')[0])
  })

  const fromApi = item?.image?.trim()

  if (!loaded) return fromApi || undefined
  return fromApi || fallback
}
