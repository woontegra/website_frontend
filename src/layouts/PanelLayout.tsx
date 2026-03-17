import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'

const panelNav = [
  { label: 'Dashboard', href: '/panel' },
  { label: 'Profilim', href: '/panel/profil' },
  { label: 'Projelerim', href: '/panel/projeler' },
  { label: 'Tekliflerim', href: '/panel/teklifler' },
  { label: 'Destek Taleplerim', href: '/panel/destek' },
  { label: 'Faturalar / Lisanslar', href: '/panel/faturalar' },
  { label: 'Bildirimler', href: '/panel/bildirimler' },
  { label: 'Ayarlar', href: '/panel/ayarlar' },
]

export function PanelLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (href: string) => location.pathname === href || (href !== '/panel' && location.pathname.startsWith(href))

  const handleLogout = () => {
    navigate('/panel/giris')
  }

  return (
    <div className="min-h-screen bg-surface-50 flex">
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform lg:transform-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
          <Link to="/panel" className="font-bold text-heading">Woontegra Panel</Link>
          <button type="button" className="lg:hidden p-2 text-surface-600" onClick={() => setSidebarOpen(false)} aria-label="Kapat">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {panelNav.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive(item.href) ? 'bg-accent-blue-soft text-accent-blue' : 'text-surface-600 hover:text-heading hover:bg-surface-50'}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <button type="button" onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-surface-600 hover:text-heading hover:bg-surface-50">
            Çıkış
          </button>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-gray-200 bg-white flex items-center px-4 gap-4">
          <button type="button" className="lg:hidden p-2 text-surface-600" onClick={() => setSidebarOpen(true)} aria-label="Menü">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <Link to="/" className="text-sm text-surface-600 hover:text-heading">← Siteye dön</Link>
        </header>
        <main className="flex-1 p-4 md:p-6 bg-surface-50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
