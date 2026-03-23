import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'

const adminNav = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Sayfalar', href: '/admin/sayfalar' },
  { label: 'Blog', href: '/admin/yazilar' },
  { label: 'Medya', href: '/admin/medya' },
  { label: 'Teklifler', href: '/admin/teklifler' },
  { label: 'Mesajlar', href: '/admin/mesajlar' },
  { label: 'Ayarlar', href: '/admin/ayarlar' },
]

export function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (href: string) =>
    href === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(href)

  const logout = () => {
    localStorage.removeItem('woontegra_token')
    navigate('/admin/giris', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 shrink-0 bg-slate-900 text-white">
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800">
          <Link to="/admin" className="font-bold text-xl">
            Woontegra
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive(item.href)
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                  : 'text-gray-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-4 mt-4 border-t border-slate-800">
            <Link to="/" className="flex items-center px-4 py-3 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-slate-800">
              ← Siteye Dön
            </Link>
            <button 
              type="button" 
              onClick={logout} 
              className="w-full flex items-center px-4 py-3 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-slate-800 mt-1"
            >
              Çıkış Yap
            </button>
          </div>
        </nav>
      </aside>
      
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold text-slate-900">Yönetim Paneli</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">info@woontegra.com</span>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-8 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
