import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { mainNav } from '../../data/navigation'
import { Button } from '../ui/Button'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) => location.pathname === href || location.pathname.startsWith(href + '/')

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-header-scroll'
          : 'bg-white/95 backdrop-blur-sm border-b border-gray-100'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-18">
          <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="Woontegra Ana Sayfa">
            <img src="/logo.png" alt="Woontegra" className="h-11 w-auto" />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {mainNav.map((item) => (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => item.children && setMegaOpen(item.href)}
                onMouseLeave={() => setMegaOpen(null)}
              >
                {item.children ? (
                  <>
                    <Link
                      to={item.href}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive(item.href) ? 'text-accent-blue' : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      {item.label}
                    </Link>
                    {megaOpen === item.href && (
                      <div className="absolute left-0 top-full pt-1">
                        <div className="bg-white border border-gray-200 rounded-xl shadow-md min-w-[220px] py-2">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              to={child.href}
                              className={`block px-4 py-2.5 text-sm transition-colors ${
                                isActive(child.href) ? 'text-accent-blue bg-accent-blue-soft/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.href) ? 'text-accent-blue' : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Button variant="ghost" size="sm" to="/teklif-al">
              Teklif Al
            </Button>
            <Button size="sm" to="/panel/giris">
              Giriş Yap
            </Button>
          </div>

          <button
            type="button"
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menü"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 animate-fade-in">
            <nav className="flex flex-col gap-1">
              {mainNav.map((item) => (
                <div key={item.href}>
                  <Link
                    to={item.href}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium ${
                      isActive(item.href) ? 'text-accent-blue bg-accent-blue-soft/50' : 'text-slate-700'
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {item.children?.map((child) => (
                    <Link
                      key={child.href}
                      to={child.href}
                      className="block pl-8 pr-4 py-2 text-sm text-slate-600 hover:text-slate-900"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2 px-4">
                <Button variant="outline" size="sm" to="/teklif-al" className="flex-1">
                  Teklif Al
                </Button>
                <Button size="sm" to="/panel/giris" className="flex-1">
                  Giriş Yap
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
