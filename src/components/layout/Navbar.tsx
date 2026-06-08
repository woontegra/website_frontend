import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useMenuItems, type MenuItemConfig } from '../../hooks/useMenuItems'
import { Button } from '../ui/Button'
import { SiteLogo } from '../ui/SiteLogo'

const NAV_CONTAINER_CLASS = 'mx-auto max-w-[1280px] px-4 sm:px-5 min-[1200px]:px-6'

function NavLinkItem({
  item,
  active,
  onClick,
}: {
  item: MenuItemConfig
  active: boolean
  onClick?: () => void
}) {
  const cls = `whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[14px] font-medium transition-colors ${
    active ? 'text-accent-blue' : 'text-slate-700 hover:text-slate-900'
  }`
  if (item.href.startsWith('http')) {
    return (
      <a
        href={item.href}
        className={cls}
        onClick={onClick}
        target={item.openInNewTab ? '_blank' : undefined}
        rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
      >
        {item.label}
      </a>
    )
  }
  return (
    <Link to={item.href} className={cls} onClick={onClick}>
      {item.label}
    </Link>
  )
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState<string | null>(null)
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const { items: navItems, headerButtons } = useMenuItems()
  const location = useLocation()

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
    if (hasChildren) {
      return (
        <div
          key={item.id}
          className="relative"
          onMouseEnter={() => setMegaOpen(item.id)}
          onMouseLeave={() => setMegaOpen(null)}
        >
          <button
            type="button"
            className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[14px] font-medium transition-colors cursor-default ${
              isActive(item.href) ? 'text-accent-blue' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            {item.label}
          </button>
          {megaOpen === item.id && (
            <div className="absolute left-0 top-full pt-1">
              <div className="min-w-[220px] rounded-xl border border-gray-200 bg-white py-2 shadow-md">
                {item.children!.map((child) => (
                  <Link
                    key={child.id}
                    to={child.href}
                    className={`block px-4 py-2.5 text-sm transition-colors ${
                      isActive(child.href)
                        ? 'bg-accent-blue-soft/50 text-accent-blue'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                    onClick={() => setMegaOpen(null)}
                    target={child.openInNewTab ? '_blank' : undefined}
                    rel={child.openInNewTab ? 'noopener noreferrer' : undefined}
                  >
                    {child.label}
                  </Link>
                ))}
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
          className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[14px] font-medium transition-colors ${
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
        className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[14px] font-medium transition-colors ${
          isActive(item.href) ? 'text-accent-blue' : 'text-slate-700 hover:text-slate-900'
        }`}
      >
        {item.label}
      </Link>
    )
  }

  const renderMobileItem = (item: MenuItemConfig) => {
    const hasChildren = item.children && item.children.length > 0
    if (hasChildren) {
      return (
        <div key={item.id}>
          <button
            type="button"
            onClick={() => setMobileSubmenuOpen(mobileSubmenuOpen === item.id ? null : item.id)}
            className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium ${
              isActive(item.href) ? 'bg-accent-blue-soft/50 text-accent-blue' : 'text-slate-700'
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
            <div className="animate-fade-in">
              {item.children!.map((child) => (
                <Link
                  key={child.id}
                  to={child.href}
                  className="block py-2 pl-8 pr-4 text-sm text-slate-600 hover:text-slate-900"
                  onClick={() => setMobileOpen(false)}
                >
                  {child.label}
                </Link>
              ))}
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
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-gray-200 bg-white/80 shadow-header-scroll backdrop-blur-md'
          : 'border-b border-gray-100 bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className={NAV_CONTAINER_CLASS}>
        <div className="flex items-center justify-between gap-2 py-2 min-[1200px]:gap-3">
          <Link
            to="/"
            className="flex shrink-0 items-center"
            aria-label="Woontegra Ana Sayfa"
          >
            <SiteLogo placement="navbar" />
          </Link>

          <nav className="hidden min-w-0 flex-1 flex-nowrap items-center justify-center gap-0 min-[1200px]:flex">
            {navItems.map(renderDesktopItem)}
          </nav>

          <div className="hidden shrink-0 items-center gap-1.5 min-[1200px]:flex">
            {headerButtons.map((btn, index) =>
              btn.isButton ? (
                <Button
                  key={btn.id}
                  variant={index === 0 ? 'ghost' : 'primary'}
                  size="sm"
                  to={btn.href.startsWith('http') ? undefined : btn.href}
                  href={btn.href.startsWith('http') ? btn.href : undefined}
                  className="whitespace-nowrap !px-3.5 !py-2 text-[14px]"
                >
                  {btn.label}
                </Button>
              ) : (
                <NavLinkItem key={btn.id} item={btn} active={isActive(btn.href)} />
              ),
            )}
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
              {navItems.map(renderMobileItem)}
              <div className="mt-4 flex gap-2 border-t border-gray-200 px-4 pt-4">
                {headerButtons.map((btn, index) => (
                  <Button
                    key={btn.id}
                    variant={index === 0 ? 'outline' : 'primary'}
                    size="sm"
                    to={btn.href.startsWith('http') ? undefined : btn.href}
                    href={btn.href.startsWith('http') ? btn.href : undefined}
                    className="flex-1"
                    onClick={() => setMobileOpen(false)}
                  >
                    {btn.label}
                  </Button>
                ))}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
