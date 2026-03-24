import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { mainNav } from '../../data/navigation'
import { fetchPublicMenu, type PublicMenuItem } from '../../api/menus'
import { LAYOUT_CONTAINER_CLASS } from '../../lib/layoutConstants'
import { Button } from '../ui/Button'

function NavItem({ href, label, active, onClick }: { href: string; label: string; active: boolean; onClick?: () => void }) {
  const cls = `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
    active ? 'text-accent-blue' : 'text-slate-700 hover:text-slate-900'
  }`
  if (href.startsWith('http')) {
    return (
      <a href={href} className={cls} onClick={onClick} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    )
  }
  return (
    <Link to={href} className={cls} onClick={onClick}>
      {label}
    </Link>
  )
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState<string | null>(null)
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [cmsNav, setCmsNav] = useState<PublicMenuItem[] | null>(null)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    fetchPublicMenu('header').then((items) => {
      setCmsNav(items.length > 0 ? items : null)
    })
  }, [])

  const isActive = (href: string) => {
    if (href === '/' || href === '#') return location.pathname === '/'
    if (href.startsWith('http')) return false
    return location.pathname === href || location.pathname.startsWith(`${href}/`)
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-gray-200 bg-white/80 shadow-header-scroll backdrop-blur-md'
          : 'border-b border-gray-100 bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className={LAYOUT_CONTAINER_CLASS}>
        <div className="flex min-h-[4rem] items-center justify-between py-1 md:min-h-[4.5rem]">
          <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="Woontegra Ana Sayfa">
            <img src="/logo.png" alt="Woontegra" className="h-14 w-auto md:h-[3.75rem]" />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {cmsNav
              ? cmsNav.map((item) => (
                  <NavItem key={item.id} href={item.href} label={item.label} active={isActive(item.href)} />
                ))
              : mainNav.map((item) => (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => item.children && setMegaOpen(item.href)}
                    onMouseLeave={() => setMegaOpen(null)}
                  >
                    {item.children ? (
                      <>
                        <button
                          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-default ${
                            isActive(item.href) ? 'text-accent-blue' : 'text-slate-700 hover:text-slate-900'
                          }`}
                        >
                          {item.label}
                        </button>
                        {megaOpen === item.href && (
                          <div className="absolute left-0 top-full pt-1">
                            <div className="min-w-[220px] rounded-xl border border-gray-200 bg-white py-2 shadow-md">
                              {item.children.map((child) => (
                                <Link
                                  key={child.href}
                                  to={child.href}
                                  className={`block px-4 py-2.5 text-sm transition-colors ${
                                    isActive(child.href)
                                      ? 'bg-accent-blue-soft/50 text-accent-blue'
                                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                  }`}
                                  onClick={() => setMegaOpen(null)}
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        to={item.href}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                          isActive(item.href) ? 'text-accent-blue' : 'text-slate-700 hover:text-slate-900'
                        }`}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Button variant="ghost" size="sm" to="/teklif-al">
              Teklif Al
            </Button>
            <Button size="sm" to="/iletisim">
              İletişim
            </Button>
          </div>

          <button
            type="button"
            className="p-2 text-slate-600 hover:text-slate-900 lg:hidden"
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
          <div className="animate-fade-in border-t border-gray-200 py-4 lg:hidden">
            <nav className="flex flex-col gap-1">
              {cmsNav
                ? cmsNav.map((item) => (
                    <NavItem
                      key={item.id}
                      href={item.href}
                      label={item.label}
                      active={isActive(item.href)}
                      onClick={() => setMobileOpen(false)}
                    />
                  ))
                : mainNav.map((item) => (
                    <div key={item.href}>
                      {item.children && item.children.length > 0 ? (
                        <>
                          <button
                            onClick={() => setMobileSubmenuOpen(mobileSubmenuOpen === item.href ? null : item.href)}
                            className={`w-full flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium ${
                              isActive(item.href) ? 'bg-accent-blue-soft/50 text-accent-blue' : 'text-slate-700'
                            }`}
                          >
                            <span>{item.label}</span>
                            <svg
                              className={`w-4 h-4 transition-transform ${mobileSubmenuOpen === item.href ? 'rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          {mobileSubmenuOpen === item.href && (
                            <div className="animate-fade-in">
                              {item.children.map((child) => (
                                <Link
                                  key={child.href}
                                  to={child.href}
                                  className="block py-2 pl-8 pr-4 text-sm text-slate-600 hover:text-slate-900"
                                  onClick={() => setMobileOpen(false)}
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <Link
                          to={item.href}
                          className={`block rounded-lg px-4 py-3 text-sm font-medium ${
                            isActive(item.href) ? 'bg-accent-blue-soft/50 text-accent-blue' : 'text-slate-700'
                          }`}
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.label}
                        </Link>
                      )}
                    </div>
                  ))}
              <div className="mt-4 flex gap-2 border-t border-gray-200 px-4 pt-4">
                <Button variant="outline" size="sm" to="/teklif-al" className="flex-1">
                  Teklif Al
                </Button>
                <Button size="sm" to="/iletisim" className="flex-1">
                  İletişim
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
