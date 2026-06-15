import { useEffect, useMemo, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react'
import { clearAdminSession } from '../lib/adminAuth'
import { adminNavigationGroups } from '../config/adminNavigation.config'

const STORAGE_KEY = 'woontegra_admin_nav_open'

function loadOpenState(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, boolean>
    return typeof parsed === 'object' && parsed ? parsed : {}
  } catch {
    return {}
  }
}

export function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const stored = loadOpenState()
    const next: Record<string, boolean> = { ...stored }
    for (const g of adminNavigationGroups) {
      if (next[g.id] === undefined) next[g.id] = g.defaultOpen
    }
    setOpenGroups(next)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const closeDrawer = () => {
      if (mq.matches) setSidebarOpen(false)
    }
    mq.addEventListener('change', closeDrawer)
    return () => mq.removeEventListener('change', closeDrawer)
  }, [])

  useEffect(() => {
    if (!sidebarOpen) return
    const mq = window.matchMedia('(max-width: 1023px)')
    if (!mq.matches) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [sidebarOpen])

  useEffect(() => {
    if (!sidebarOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [sidebarOpen])

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const persist = (next: Record<string, boolean>) => {
    setOpenGroups(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* ignore */
    }
  }

  const isItemActive = (href: string) =>
    href === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(href)

  const logout = () => {
    clearAdminSession()
    navigate('/admin/giris', { replace: true })
  }

  const groupList = useMemo(() => adminNavigationGroups, [])
  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="flex min-h-screen bg-slate-100">
      {sidebarOpen ? (
        <button
          type="button"
          aria-label="Menüyü kapat"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={closeSidebar}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[min(100vw,16rem)] flex-col border-r border-slate-800 bg-slate-900 text-white transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-64 lg:max-w-none lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 px-4 lg:justify-start lg:gap-0">
          <Link to="/admin" className="text-lg font-bold tracking-tight" onClick={closeSidebar}>
            Woontegra
          </Link>
          <button
            type="button"
            className="rounded-md p-2 text-slate-300 hover:bg-slate-800 hover:text-white lg:hidden"
            onClick={closeSidebar}
            aria-label="Menüyü kapat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto overscroll-contain px-2 py-3">
          {groupList.map((group) => {
            const expanded =
              openGroups[group.id] !== undefined ? Boolean(openGroups[group.id]) : group.defaultOpen
            return (
              <div key={group.id} className="mb-1">
                <button
                  type="button"
                  onClick={() => persist({ ...openGroups, [group.id]: !expanded })}
                  className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
                >
                  {group.title}
                  {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                </button>
                {expanded && (
                  <div className="mt-0.5 space-y-0.5 pb-2">
                    {group.items.map((item) => {
                      const Icon = item.icon
                      const active = isItemActive(item.href)
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={closeSidebar}
                          title={item.placeholder ? 'Bu modül henüz devrede değil veya placeholder.' : undefined}
                          className={`flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                            active
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          } ${item.placeholder ? 'opacity-80' : ''}`}
                        >
                          <Icon className="h-4 w-4 shrink-0 opacity-90" />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
          <div className="mt-4 border-t border-slate-800 pt-3">
            <Link
              to="/"
              onClick={closeSidebar}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              ← Siteye dön
            </Link>
            <button
              type="button"
              onClick={() => {
                closeSidebar()
                logout()
              }}
              className="mt-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-slate-400 hover:bg-slate-800 hover:text-red-300"
            >
              Çıkış yap
            </button>
          </div>
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6">
          <button
            type="button"
            className="shrink-0 rounded-md p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Menüyü aç"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="min-w-0 flex-1 truncate text-base font-semibold text-slate-900">Yönetim paneli</h1>
        </header>
        <main className="min-h-0 w-full min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
