/** `brands` bölümü içeriğini BrandShowcase bileşen prop'larına çevirir */
export function brandsContentToShowcaseProps(c: Record<string, unknown>) {
  const itemsRaw = Array.isArray(c.items) ? c.items : []
  const items = itemsRaw.map((row: unknown) => {
    const r = row as Record<string, unknown>
    return {
      name: String(r.title ?? r.name ?? ''),
      description: String(r.description ?? ''),
      href: String(r.link ?? r.href ?? '#'),
      logo: String(r.image ?? r.logo ?? ''),
      coverImage: r.coverImage != null && String(r.coverImage) ? String(r.coverImage) : undefined,
      tone: ['indigo', 'emerald', 'coral', 'ocean'].includes(String(r.tone))
        ? (String(r.tone) as 'indigo' | 'emerald' | 'coral' | 'ocean')
        : undefined,
    }
  })
  return {
    title: String(c.title ?? c.sectionTitle ?? 'Markalar'),
    subtitle: String(c.subtitle ?? ''),
    badge: String(c.badge ?? ''),
    items,
    columns: typeof c.columns === 'number' ? Math.min(4, Math.max(1, c.columns)) : 4,
    gap: String(c.gap ?? '1.5rem'),
    cardStyle: ['shadow', 'bordered', 'minimal'].includes(String(c.cardStyle))
      ? (c.cardStyle as 'shadow' | 'bordered' | 'minimal')
      : 'shadow',
  }
}
