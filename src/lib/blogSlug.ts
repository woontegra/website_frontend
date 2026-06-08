export function normalizeBlogSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateBlogSlugFromTitle(title: string): string {
  return normalizeBlogSlug(title)
}

export function findDuplicateBlogSlug<T extends { id: string; slug: string }>(
  slug: string,
  posts: T[],
  excludeId?: string,
): T | undefined {
  const normalized = normalizeBlogSlug(slug)
  if (!normalized) return undefined
  return posts.find(
    (post) => post.id !== excludeId && normalizeBlogSlug(post.slug) === normalized,
  )
}

export function ensureUniqueBlogSlug<T extends { id: string; slug: string }>(
  slug: string,
  posts: T[],
  excludeId?: string,
): string {
  const base = normalizeBlogSlug(slug)
  if (!base) return ''

  let candidate = base
  let suffix = 2
  while (findDuplicateBlogSlug(candidate, posts, excludeId)) {
    candidate = `${base}-${suffix}`
    suffix += 1
  }
  return candidate
}

export function slugsMatch(a: string, b: string): boolean {
  return normalizeBlogSlug(a) === normalizeBlogSlug(b)
}
