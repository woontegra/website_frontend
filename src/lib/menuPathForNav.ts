/** Menü href'ini pathname olarak normalize et (CMS + katalog eşlemesi için). */
export function menuPathForNav(href: string): string {
  if (!href) return '/'
  if (href.startsWith('http')) {
    try {
      const u = new URL(href)
      const p = u.pathname.replace(/\/+$/, '') || '/'
      return p
    } catch {
      return '/'
    }
  }
  let p = href.split('?')[0].trim()
  if (!p.startsWith('/')) p = `/${p}`
  p = p.replace(/\/+$/, '') || '/'
  return p
}
