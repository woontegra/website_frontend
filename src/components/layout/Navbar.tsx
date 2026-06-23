import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, UserRound } from 'lucide-react'
import { useMenuItems, type MenuItemConfig } from '../../hooks/useMenuItems'
import { useCart } from '../../hooks/useCart'
import { getCustomerProfile, getCustomerToken, isCustomerToken, isJwtExpired } from '../../lib/customerAuth'
import { SiteLogo } from '../ui/SiteLogo'
import { LAYOUT_CONTAINER_CLASS } from '../../lib/layoutConstants'
import { menuPathForNav } from '../../lib/menuPathForNav'

/** Taşma olursa önce bu path'lerdeki öğeler "Diğer"e alınır (sırayla). */
const FOLD_PATHS_IN_ORDER = ['/blog', '/cozumler', '/urunler', '/iletisim']

function idsFromPaths(items: MenuItemConfig[], paths: string[]): string[] {
  const ids: string[] = []
  for (const p of paths) {
    const it = items.find((i) => menuPathForNav(i.href) === p)
    if (it) ids.push(it.id)
  }
  return ids
}

/**
 * ResizeObserver + ölçüm döngüsü yok: viewport genişliğine göre "Diğer"e alınacak id'ler.
 * Yatay scroll yok; dar masaüstünde Blog/Çözümler (ve gerekirse katalog linkleri) katlanır.
 */
function computeFoldIdsForViewport(w: number, items: MenuItemConfig[]): string[] {
  if (w < 1200) return []
  if (w >= 1500) return []
  if (w >= 1380) return idsFromPaths(items, ['/blog'])
  if (w >= 1280) return idsFromPaths(items, ['/blog'])
  const base = idsFromPaths(items, FOLD_PATHS_IN_ORDER)
  if (w < 1240) {
    const catalogExtra = items.filter((i) => i.id.startsWith('catalog-nav-')).map((i) => i.id)
    return [...new Set([...base, ...catalogExtra])]
  }
  return base
}

function menuItemActive(item: MenuItemConfig, isActive: (h: string) => boolean): boolean {
  if (isActive(item.href)) return true
  return !!item.children?.some((c) => !c.groupHeader && isActive(c.href))
}

function renderNavChildLink(
  child: MenuItemConfig,
  onNavigate: () => void,
  className: string,
) {
  if (child.groupHeader) {
    return (
      <div
        key={child.id}
        role="presentation"
        className="px-4 pt-2.5 pb-1 text-[11px] font-bold uppercase tracking-wide text-slate-500 first:pt-1.5"
      >
        {child.label}
      </div>
    )
  }
  if (child.href.startsWith('http')) {
    return (
      <a
        key={child.id}
        href={child.href}
        className={className}
        onClick={onNavigate}
        target={child.openInNewTab ? '_blank' : undefined}
        rel={child.openInNewTab ? 'noopener noreferrer' : undefined}
      >
        {child.label}
      </a>
    )
  }
  return (
    <Link key={child.id} to={child.href} className={className} onClick={onNavigate}>
      {child.label}
    </Link>
  )
}

function foldedEntryActive(item: MenuItemConfig, isActive: (h: string) => boolean): boolean {
  return menuItemActive(item, isActive)
}

/** Aynı href birden fazla kaynaktan gelirse (CMS + katalog) tek satırda gösterilecek kazanan. */
function pickPreferredMenuItemForPath(path: string, candidates: MenuItemConfig[]): MenuItemConfig {
  if (candidates.length === 1) return candidates[0]!
  if (path === '/hizmetler') {
    const withChildren = candidates.find((i) => (i.children?.length ?? 0) > 0)
    if (withChildren) return withChildren
  }
  if (path === '/urunler') {
    const catalog = candidates.find((i) => i.id.startsWith('catalog-nav-'))
    if (catalog) return catalog
    return (
      candidates.find((i) => i.id === 'desktop-store') ??
      candidates.find((i) => !i.id.startsWith('catalog-nav-')) ??
      candidates[0]!
    )
  }
  if (path === '/iletisim') {
    return (
      candidates.find((i) => i.id === 'contact') ??
      candidates.find((i) => !i.id.startsWith('catalog-nav-')) ??
      candidates[0]!
    )
  }
  const nonCat = candidates.find((i) => !i.id.startsWith('catalog-nav-'))
  return nonCat ?? candidates[0]!
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState<string | null>(null)
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const { items: navItems } = useMenuItems()
  const { count: cartCount } = useCart()
  const location = useLocation()

  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1536,
  )

  const customerAuthed = (() => {
    const t = getCustomerToken()
    return !!(t && !isJwtExpired(t) && isCustomerToken(t))
  })()
  const hesapHref = customerAuthed ? '/hesabim' : '/giris'
  const customerProfile = customerAuthed ? getCustomerProfile() : null
  const hesapActive =
    location.pathname.startsWith('/hesabim') ||
    location.pathname === '/giris' ||
    location.pathname === '/kayit' ||
    location.pathname === '/siparis-sorgula' ||
    location.pathname.startsWith('/siparislerim') ||
    location.pathname.startsWith('/siparis/')

  /** Aynı href birden fazla menü kaynağından geliyorsa (statik + navigation-menu) yalnızca birini göster. */
  const navItemsFiltered = useMemo(() => {
    const sorted = [...navItems].sort((a, b) => a.order - b.order)
    const pathItems = sorted.filter((i) => menuPathForNav(i.href) !== '#')
    const dropdownOnlyItems = sorted.filter(
      (i) => menuPathForNav(i.href) === '#' && (i.children?.length ?? 0) > 0,
    )

    const byPath = new Map<string, MenuItemConfig[]>()
    for (const i of pathItems) {
      const p = menuPathForNav(i.href)
      if (!p) continue
      if (!byPath.has(p)) byPath.set(p, [])
      byPath.get(p)!.push(i)
    }
    const winnerByPath = new Map<string, MenuItemConfig>()
    for (const [p, cands] of byPath) {
      winnerByPath.set(p, pickPreferredMenuItemForPath(p, cands))
    }
    const seen = new Set<string>()
    const out: MenuItemConfig[] = []
    for (const i of pathItems) {
      const p = menuPathForNav(i.href)
      if (!p) continue
      const winner = winnerByPath.get(p)
      if (!winner || winner.id !== i.id) continue
      if (seen.has(p)) continue
      seen.add(p)
      out.push(i)
    }

    const dropdownSeen = new Set<string>()
    for (const i of dropdownOnlyItems) {
      if (dropdownSeen.has(i.id)) continue
      dropdownSeen.add(i.id)
      out.push(i)
    }

    const norm = (s: string) => s.trim().toLocaleLowerCase('tr-TR')
    const masa = out.filter((i) => norm(i.label) === 'masaüstü araçlar')
    if (masa.length <= 1) return out.sort((a, b) => a.order - b.order)
    const keep =
      masa.find((i) => i.id === 'desktop-store') ??
      masa.find((i) => menuPathForNav(i.href) === '/urunler') ??
      masa[0]!
    return out
      .filter((i) => norm(i.label) !== 'masaüstü araçlar' || i.id === keep.id)
      .sort((a, b) => a.order - b.order)
  }, [navItems])

  const centerItemsAll = useMemo(() => navItemsFiltered, [navItemsFiltered])

  const overflowFoldIds = useMemo(
    () => computeFoldIdsForViewport(viewportWidth, centerItemsAll),
    [viewportWidth, centerItemsAll],
  )

  const visibleCenterItems = useMemo(
    () => centerItemsAll.filter((i) => !overflowFoldIds.includes(i.id)),
    [centerItemsAll, overflowFoldIds],
  )

  const foldedItems = useMemo(
    () => centerItemsAll.filter((i) => overflowFoldIds.includes(i.id)),
    [centerItemsAll, overflowFoldIds],
  )

  useEffect(() => {
    const update = () => setViewportWidth(window.innerWidth)
    update()
    let tid: ReturnType<typeof setTimeout> | undefined
    const onResize = () => {
      clearTimeout(tid)
      tid = setTimeout(update, 100)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      clearTimeout(tid)
    }
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) => {
    if (href === '/' || href === '#') return location.pathname === '/'
    if (href.startsWith('http')) return false
    return location.pathname === href || location.pathname.startsWith(`${href}/`)
  }

  const renderDesktopItem = (item: MenuItemConfig) => {
    const hasChildren = item.children && item.children.length > 0
    const active = menuItemActive(item, isActive)
    if (hasChildren) {
      return (
        <div
          key={item.id}
          className="relative shrink-0"
          onMouseEnter={() => setMegaOpen(item.id)}
          onMouseLeave={() => setMegaOpen(null)}
        >
          <button
            type="button"
            className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[14px] font-medium transition-colors cursor-default ${
              active ? 'text-accent-blue' : 'text-slate-700 hover:text-slate-900'
            }`}
            aria-expanded={megaOpen === item.id}
            aria-haspopup="true"
          >
            {item.label}
            <span className="ml-0.5 text-slate-400" aria-hidden>
              ▾
            </span>
          </button>
          {megaOpen === item.id && (
            <div className="absolute left-0 top-full z-[110] pt-0.5">
              <div className="min-w-[280px] rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                {item.children!.map((child) =>
                  renderNavChildLink(
                    child,
                    () => setMegaOpen(null),
                    `block px-4 py-2.5 text-sm transition-colors ${
                      isActive(child.href)
                        ? 'bg-accent-blue-soft/50 text-accent-blue'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`,
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      )
    }

    if (item.href.startsWith('http')) {
      return (
        <a
          key={item.id}
          href={item.href}
          className={`shrink-0 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[14px] font-medium transition-colors ${
            isActive(item.href) ? 'text-accent-blue' : 'text-slate-700 hover:text-slate-900'
          }`}
          target={item.openInNewTab ? '_blank' : undefined}
          rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
        >
          {item.label}
        </a>
      )
    }

    return (
      <Link
        key={item.id}
        to={item.href}
        className={`shrink-0 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[14px] font-medium transition-colors ${
          isActive(item.href) ? 'text-accent-blue' : 'text-slate-700 hover:text-slate-900'
        }`}
      >
        {item.label}
      </Link>
    )
  }

  const renderFoldedDropdownRow = (item: MenuItemConfig) => {
    if (item.children && item.children.length > 0) {
      return (
        <div key={item.id} className="border-b border-slate-100 py-1 last:border-b-0">
          <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</div>
          {item.children.map((child) =>
            child.groupHeader ? (
              <div
                key={child.id}
                role="presentation"
                className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500"
              >
                {child.label}
              </div>
            ) : (
              renderNavChildLink(
                child,
                () => setMoreMenuOpen(false),
                `block px-4 py-2.5 text-sm transition-colors ${
                  isActive(child.href)
                    ? 'bg-accent-blue-soft/50 text-accent-blue'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`,
              )
            ),
          )}
        </div>
      )
    }
    if (item.href.startsWith('http')) {
      return (
        <a
          key={item.id}
          href={item.href}
          className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
          onClick={() => setMoreMenuOpen(false)}
          target={item.openInNewTab ? '_blank' : undefined}
          rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
        >
          {item.label}
        </a>
      )
    }
    return (
      <Link
        key={item.id}
        to={item.href}
        className={`block px-4 py-2.5 text-sm transition-colors ${
          isActive(item.href) ? 'bg-accent-blue-soft/50 text-accent-blue' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        }`}
        onClick={() => setMoreMenuOpen(false)}
      >
        {item.label}
      </Link>
    )
  }

  const moreMenuActive = foldedItems.some((i) => foldedEntryActive(i, isActive))

  const renderMobileItem = (item: MenuItemConfig) => {
    const hasChildren = item.children && item.children.length > 0
    const active = menuItemActive(item, isActive)
    if (hasChildren) {
      return (
        <div key={item.id}>
          <button
            type="button"
            onClick={() => setMobileSubmenuOpen(mobileSubmenuOpen === item.id ? null : item.id)}
            className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium ${
              active ? 'bg-accent-blue-soft/50 text-accent-blue' : 'text-slate-700'
            }`}
          >
            <span>{item.label}</span>
            <svg
              className={`h-4 w-4 transition-transform ${mobileSubmenuOpen === item.id ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {mobileSubmenuOpen === item.id && (
            <div className="animate-fade-in pb-1">
              {item.children!.map((child) =>
                child.groupHeader ? (
                  <div
                    key={child.id}
                    role="presentation"
                    className="px-4 pb-1 pt-3 text-[11px] font-bold uppercase tracking-wide text-slate-500"
                  >
                    {child.label}
                  </div>
                ) : (
                  <Link
                    key={child.id}
                    to={child.href}
                    className={`block py-2 pl-8 pr-4 text-sm ${
                      isActive(child.href) ? 'font-semibold text-accent-blue' : 'text-slate-600 hover:text-slate-900'
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {child.label}
                  </Link>
                ),
              )}
            </div>
          )}
        </div>
      )
    }

    if (item.href.startsWith('http')) {
      return (
        <a
          key={item.id}
          href={item.href}
          className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700"
          onClick={() => setMobileOpen(false)}
          target={item.openInNewTab ? '_blank' : undefined}
          rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
        >
          {item.label}
        </a>
      )
    }

    return (
      <Link
        key={item.id}
        to={item.href}
        className={`block rounded-lg px-4 py-3 text-sm font-medium ${
          isActive(item.href) ? 'bg-accent-blue-soft/50 text-accent-blue' : 'text-slate-700'
        }`}
        onClick={() => setMobileOpen(false)}
      >
        {item.label}
      </Link>
    )
  }

  return (
    <header
      className={`sticky top-0 z-[100] isolate w-full max-w-full overflow-visible border-b bg-white transition-all duration-300 ${
        scrolled ? 'border-gray-200 shadow-header-scroll' : 'border-gray-100'
      }`}
    >
      <div className={`${LAYOUT_CONTAINER_CLASS} w-full overflow-x-clip`}>
        <div className="flex min-h-[3.25rem] flex-nowrap items-center gap-2 py-2 min-[1200px]:grid min-[1200px]:min-h-[4rem] min-[1200px]:grid-cols-[minmax(0,auto)_minmax(0,1fr)_minmax(0,auto)] min-[1200px]:items-center min-[1200px]:gap-x-4 min-[1200px]:gap-y-0 min-[1200px]:py-2.5">
          <Link
            to="/"
            className="relative z-20 flex shrink-0 items-center self-center min-[1200px]:justify-start"
            aria-label="Woontegra Ana Sayfa"
          >
            <SiteLogo placement="navbar" />
          </Link>

          <div className="hidden min-h-0 min-w-0 min-[1200px]:col-start-2 min-[1200px]:flex min-[1200px]:min-w-0 min-[1200px]:items-center min-[1200px]:justify-center min-[1200px]:overflow-visible min-[1200px]:px-1">
            <nav
              aria-label="Ana menü"
              className="flex min-w-0 max-w-full flex-nowrap items-center justify-center gap-1"
            >
              {visibleCenterItems.map(renderDesktopItem)}
              {foldedItems.length > 0 ? (
                <div
                  className="relative shrink-0"
                  onMouseEnter={() => setMoreMenuOpen(true)}
                  onMouseLeave={() => setMoreMenuOpen(false)}
                >
                  <button
                    type="button"
                    className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[14px] font-medium transition-colors ${
                      moreMenuActive ? 'text-accent-blue' : 'text-slate-700 hover:text-slate-900'
                    }`}
                    aria-expanded={moreMenuOpen}
                    aria-haspopup="true"
                  >
                    Diğer
                    <span className="ml-0.5 text-slate-400" aria-hidden>
                      ▾
                    </span>
                  </button>
                  {moreMenuOpen ? (
                    <div className="absolute right-0 top-full z-[110] pt-0.5">
                      <div className="min-w-[220px] max-w-[min(100vw-2rem,280px)] rounded-xl border border-gray-200 bg-white py-2 shadow-md">
                        {foldedItems.map(renderFoldedDropdownRow)}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </nav>
          </div>

          <div className="hidden min-h-9 shrink-0 items-center justify-end gap-2 min-[1200px]:col-start-3 min-[1200px]:flex">
            <Link
              to="/sepet"
              className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                isActive('/sepet') ? 'text-accent-blue' : 'text-slate-600 hover:text-slate-900'
              }`}
              aria-label="Sepet"
            >
              <ShoppingCart className="h-5 w-5" aria-hidden />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
            <div className="flex h-9 max-w-[9rem] items-center gap-1 border-l border-slate-200/80 pl-2">
              <Link
                to={hesapHref}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  hesapActive ? 'text-accent-blue' : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-label="Hesabım"
                title={customerProfile?.name ? customerProfile.name : 'Hesabım'}
              >
                <UserRound className="h-5 w-5" aria-hidden />
              </Link>
              {customerProfile?.name ? (
                <span className="max-w-[6.5rem] truncate text-xs font-medium leading-tight text-slate-600" title={customerProfile.name}>
                  {customerProfile.name}
                </span>
              ) : null}
            </div>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-0.5 min-[1200px]:hidden">
            <Link
              to="/sepet"
              className={`relative rounded-lg p-2 ${isActive('/sepet') ? 'text-accent-blue' : 'text-slate-600'}`}
              aria-label="Sepet"
            >
              <ShoppingCart className="h-6 w-6" aria-hidden />
              {cartCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
            <Link
              to={hesapHref}
              className={`rounded-lg p-2 ${hesapActive ? 'text-accent-blue' : 'text-slate-600'}`}
              aria-label="Hesabım"
            >
              <UserRound className="h-6 w-6" aria-hidden />
            </Link>
          </div>

          <button
            type="button"
            className="flex shrink-0 p-2 text-slate-600 hover:text-slate-900 min-[1200px]:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menü"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="animate-fade-in border-t border-gray-200 py-4 min-[1200px]:hidden">
            <nav className="flex flex-col gap-1">
              <div className="flex gap-2 px-4 pb-2">
                <Link
                  to="/sepet"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-slate-800"
                  onClick={() => setMobileOpen(false)}
                >
                  <ShoppingCart className="h-4 w-4" aria-hidden />
                  Sepet
                  {cartCount > 0 ? ` (${cartCount})` : ''}
                </Link>
                <Link
                  to={hesapHref}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-slate-800"
                  onClick={() => setMobileOpen(false)}
                >
                  <UserRound className="h-4 w-4" aria-hidden />
                  {customerAuthed ? 'Hesabım' : 'Giriş'}
                </Link>
              </div>
              {navItemsFiltered.map(renderMobileItem)}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
